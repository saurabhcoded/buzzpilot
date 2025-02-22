const models = require("../models");
const CommonService = require("../services/CommonService");
const UserServices = require("../services/UserServices");
const AuthServices = require("../services/AuthServices");
const {CREATED, UPDATE} = require("../config/action.config");
const {SaveEventService} = require('../services/EventService')
const EVENTS_CONSTANTS = require("../config/events.config");
const URL_CONFIG = require("../config/urls.config");


// REGISTER THE NEW EMPLOYEE==============>
exports.createUser = async (req, res) => {
    try {
        let data = CommonService.trimBodyData(req.body);
        let {firstName, lastName, email, password, mobile} = data;

        const checkEmailExists = await UserServices.getSingleUserByEmail(email);

        if (checkEmailExists) {
            return res.REST.CONFLICT(0, {msg: "User with email:{{email}} already exists", msgReplace: {email}})
        }

        // create the hashed password========>
        let hashedPassword = await AuthServices.generateHash(password);

        const result = await UserServices.saveNewUser({firstName, lastName, email, hashedPassword, mobile, activeStatus: 1});
        const options = {userId: result?.id}
        if (result) {
            // action logs for the Create User=====>
            await CommonService.actionLogs("User", result?.id, CREATED, options, result?.id, req,)

            await models.users.update(
                {createdBy: result.id},  // Assuming req.user.id is the id of the user who created the new employee
                {where: {id: result.id}}
            );

            const {verificationLink} = await AuthServices.GenerateVerifyUrl(URL_CONFIG.account_verify_url, result.id)


            SaveEventService(EVENTS_CONSTANTS.ACCOUNT_VERIFICATION, {
                userId: result.id,
                email_to: result.email,
                replacements: {
                    EMPLOYEE_NAME: `${result.firstName} ${result.lastName}`,
                    VERIFICATION_LINK: verificationLink
                },
            });

            return res.REST.SUCCESS(1, {
                msg: "Account with email:{{email}} Register Successfully",
                msgReplace: {email: email}
            });
        }
        else {
            return res.REST.ERROR(0, "Failed to Create Account");
        }

    } catch (error) {
        console.log('Error in catch block  : ', error)
        await CommonService.filterError(error, req, res);
    }
};

// View Logged User Profile==============>
exports.getLoggedUser = async (req, res) => {
    try {
        let userId = req.userId;

        const user = await UserServices.getSingleUserByID(userId, ['password', 'verification_token', 'email_verify', 'activeStatus', 'id', 'createdAt', 'updatedAt', 'deleted']);

        if (!user) {
            return res.REST.NOTFOUND(0);
        }
        return res.REST.SUCCESS(1, 'User Found Successfully', user)

    } catch (error) {
        console.log('Error in catch block  : ', error)
        await CommonService.filterError(error, req, res);
    }
};

// Edit Self Profile  ==============>
exports.editSelfProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const data = CommonService.trimBodyData(req.body);
        const user = await UserServices.getSingleUser(userId, ['password', 'verification_token', 'email_verify', 'activeStatus', 'createdAt', 'updatedAt', 'deleted']);
        if (user) {
            await user.update(data)
            let actionLogOption = {
                id: req?.userId
            }
            actionLogOption = await CommonService.actionLogs("EDIT_USER_PROFILE", user.id, UPDATE, actionLogOption, req?.userId, req, res)
            return res.REST.SUCCESS(1, "Profile Updated Successfully", {user})
        }
        else {
            return res.REST.NOTFOUND(0, "Account Not Found");
        }
    } catch (error) {
        await CommonService.filterError(error, req, res);
    }
};

// View User (Get User By ID) Profile==============>
exports.getUserById = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await UserServices.getSingleUserByID(id, ['password', 'verification_token', 'email_verify', 'activeStatus', 'id', 'createdAt', 'updatedAt', 'deleted']);
        if (user) {
            return res.REST.SUCCESS(1, "User Fetched Successfully", {user})
        } else {
            return res.REST.NOTFOUND(0, "User Not Found!");
        }
    } catch (error) {
        await CommonService.filterError(error, req, res);
    }
};

// Change Password By Self
exports.changeUserPassword = async (req, res) => {
    try {

        const userId = req.userId;
        const {oldPassword, password, confirmPassword} = CommonService.trimBodyData(req.body);

        /* ===========check wheather the oldPassword is not similar with the old password;
        if password is not same as the confirm passwor logout ============== */
        const {status, message} = await UserServices.changePasswordValidation(oldPassword, password, confirmPassword);
        if (!status) {
            return res.REST.BADREQUEST(0, message)
        }
        //second parameter in getSingleUserById is the field which should be excluded (password , verification_token)
        let user = await UserServices.getSingleUserByID(userId, []);
        if (user) {
            const validPassword = await AuthServices.comparePassword(oldPassword, user.password);
            if (!validPassword) {
                return res.REST.UNAUTHORIZED(0, "Invalid Password");
            }
            const hashedPassword = await AuthServices.generateHash(password);

            let actionLogOption = {id: req?.userId}
            actionLogOption = await CommonService.actionLogs("change-password", user.id, UPDATE, actionLogOption, req?.user?.id, req, res)

            await UserServices.updateUser({password: hashedPassword, updatedBy: userId}, user.id)
            return res.REST.SUCCESS(1, "Password Changed Successfully");
        }
        else {
            return res.REST.NOTFOUND(0, "User not found!");
        }

    } catch (error) {
        console.log('Error in catch block  : ', error)
        await CommonService.filterError(error, req, res);
    }
};

// Edit User Password By a Another User Basically by any Admin
exports.editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = CommonService.trimBodyData(req.body);
        const user = await UserServices.getSingleUser(userId, ['password', 'verification_token', 'email_verify', 'activeStatus', 'createdAt', 'updatedAt', 'deleted'])

        if (user) {
            await user.update(data)
            // make the actionLog for edit user=======>
            let actionLogOption = {
                id: req?.UserId
            };
            actionLogOption = await CommonService.actionLogs("EDIT_USER_PROFILE", user.id, UPDATE, actionLogOption, userId, req, res);
            return res.REST.SUCCESS(1, "Profile Updated Successfully", user)
        }
        else {
            return res.REST.NOTFOUND(0, "User not found!");
        }
    } catch (error) {
        console.log('Error in catch block  : ', error)
        await CommonService.filterError(error, req, res);
    }
};
