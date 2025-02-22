const CommonService = require("../services/CommonService");
const AuthServices = require("../services/AuthServices");
const UserServices = require("../services/UserServices");
const models = require("../models/index");
const bcrypt = require("bcryptjs");
const {SaveEventService} = require("../services/EventService");
const URL_CONFIG = require("../config/urls.config");
const EVENTS_CONSTANTS = require("../config/events.config");

/* TO login User */
exports.login = async (req, res) => {
    try {
        let {email, password} = CommonService.trimBodyData(req.body);

        // const user = await UserServices.getSingleUserByEmail(email);
        const user = await models.users.findOne({where: {email: email, deleted: 0}, raw: true});
        if (!user) {
            return res.REST.NOTFOUND(0, "Account not found!");
        }
        /* Email Verification */
        if (!user.email_verify) {
            return res.REST.SUCCESS(0, "Account Email is not verified!");
        }
        /* Password Validation */
        const isValidPassoword = await bcrypt.compare(password, user.password);
        if (!isValidPassoword) {
            return res.REST.SUCCESS(0, "Invalid Credentials");
        }
        const token = await AuthServices.generateJWTAccessToken(user.id);
        // Removing non Sharing Keys
        delete user.password;
        delete user.verification_token;

        return res.REST.SUCCESS(1, "Logged In Successfully", {user, token: token})
    } catch (error) {
        await CommonService.filterError(error, req, res);
    }
};

/* TO Verify User Account */
exports.verifyUserAccount = async (req, res) => {
    try {
        const {token} = req.params;
        const {status, user} = await AuthServices.ValidateVerifyUrl(token, [{field: 'email_verify', value: 1}])
        if (status) {
            await SaveEventService(EVENTS_CONSTANTS.EMPLOYEE_REGISTER, {
                userId: user.id,
                email_to: user.email,
                replacements: {
                    FULL_NAME: `${user.firstName} ${user.lastName}`,
                },
            })
            return res.REST.SUCCESS(1, "Account Verified Successfully");
        } else {
            return res.REST.BADREQUEST(0, "Verification Link Expired");
        }


    } catch (error) {
        clog.error('Verifying Error ', error)
        await CommonService.filterError(error, req, res);
    }
}

/* TO Send New Verification Link */
exports.newVerificationLink = async (req, res) => {
    try {
        const {email} = req.body;
        if (!email) {
            res.REST.BADREQUEST(0, "Email address is Required!");
        }
        const user = await UserServices.getSingleUserByEmail(email);
        if (!user) {
            return res.REST.SUCCESS(0, "Account not found!");
        }
        let verification_page = URL_CONFIG.account_verify_url;
        const {status, verificationLink, message} = await AuthServices.GenerateVerifyUrl(verification_page, user.id);
        /* Account Verifying Status */
        if (status) {
            await SaveEventService(EVENTS_CONSTANTS.ACCOUNT_VERIFICATION, {
                userId: user.id,
                email_to: email,
                replacements: {
                    VERIFICATION_LINK: verificationLink,
                    EMPLOYEE_NAME: user.firstName + ' ' + user.lastName
                }
            })
            return res.REST.SUCCESS(1, {msg: "Verification Link sent to email:{{email}}", msgReplace: {email}});

        } else {
            return res.REST.ERROR(0, message ?? "Account not verified please try again later.")
        }
    } catch (error) {
        CommonService.filterError(error, req, res);
    }

}

/* TO Forgot Password Request */
exports.forgotPasswordRequest = async (req, res) => {
    try {
        let {email} = CommonService.trimBodyData(req.body);
        const user = await UserServices.getSingleUserByEmail(email);
        if (user) {
            const {status, verificationLink} = await AuthServices.GenerateVerifyUrl(URL_CONFIG.forgot_password_url, user.id)
            if (status) {
                await SaveEventService(EVENTS_CONSTANTS.FORGOT_PASSWORD, {
                    userId: user.id,
                    email_to: user.email,
                    replacements: {
                        VERIFICATION_LINK: verificationLink,
                        EMPLOYEE_NAME: user.firstName + " " + user.lastName
                    }
                });
                return res.REST.SUCCESS(1, {
                    msg: "Account Password reset mail sent to email:{{email}}",
                    msgReplace: {email}
                });
            }
            else {
                return res.REST.BADREQUEST(1, "OOps Something Went Wrong!")
            }
        } else {
            return res.REST.NOTFOUND(0, "Account not found!");
        }
    } catch (error) {
        await CommonService.filterError(error, req, res);
    }
};

/* To Save Forgot Password at page */
exports.forgotPasswordSave = async (req, res) => {
    try {
        const verification_token = req.params.token
        let {password, confirm_password} = CommonService.trimBodyData(req.body);
        if (password != confirm_password) {
            return res.REST.BADREQUEST(0, "Password and Confirm password must Match")
        }
        const hashedPassword = await AuthServices.generateHash(password);
        const {status} = await AuthServices.ValidateVerifyUrl(verification_token, [{field: 'password', value: hashedPassword}, {field: 'email_verify', value: 1}])
        if (status) {
            /* TODO: Send Email Event for Password Reset Successfull */
            return res.REST.SUCCESS(1, "Password Reset Successfull")
        }
        else {
            return res.REST.ERROR(0, "Link Expired please try Again")
        }
    } catch (error) {
        await CommonService.filterError(error, req, res);
    }
};

/* To Refresh the user jwt token */
exports.refreshUserToken = async (req, res) => {
    try {
        const userId = req?.userId;
        const data = {
            status: 0,
            message: req.__('SOMETHING_WENT_WRONG'),
        }
        if (userId) {
            const refreshToken = await AuthServices.generateJWTAccessToken(userId);
            if (refreshToken) {
                data.refresh_token = refreshToken;
                data.message = req.__('TOKEN_REFRESH_SUCCESSS')
                data.status = 1;
            }
        }
        return res.REST.SUCCESS(1, "Token Refreshed", data);
    } catch (error) {
        return CommonService.filterError(error, req, res);
    }
};



