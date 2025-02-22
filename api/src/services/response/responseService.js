const i18n = require('../../config/i18n.config');
const REST_METHODS = require("./status-code.json");
class RestService {
    constructor(request, response) {
        this.req = request;
        this.res = response;
    }
}

/* Dynamically Adding Diffrent Methods for Api Routes */
REST_METHODS.forEach(method => {
    RestService.prototype[method.type] = function (status = 1, msg, data) {
        let responseData = {
            status,
            statusType: ["error", "success", "warning"][status] ?? "success"
        };
        /* Based Upon Diffrent types of message
            First : type string
            Second : {msg: string , msgReplace:{replacements(key:replacement)}}
        */
        if (typeof msg === "object") {
            responseData.message = this.req.__(msg?.msg ?? method.defaultMessage, msg?.msgReplace ?? {})
        } else {
            responseData.message = this.req.__(msg ?? method.defaultMessage)
        }
        if (data) {
            responseData.data = data
        }
        return this.res.status(method.code).json(responseData);
    };
});
exports.RestService = RestService;

exports.internalServerError = (res, error) => {
    return res.status(500).json({
        status: 500,
        message: i18n.__n('INTERNAL_SERVER_ERROR'),
        error: error
    })
}

exports.emailExists = (res) => {
    return res.status(409).json({
        status: 409,
        message: i18n.__n('EMAIL_ALREADY_EXIST')
    })
}

exports.invalidEmail = (res) => {
    return res.status(409).json({
        status: 409,
        message: i18n.__n('INVALID_MAIL')
    })
}

exports.invalidCredentials = (res) => {
    return res.status(409).json({
        status: 401,
        message: i18n.__n('INVALID_CREDENTIALS')
    })
}

exports.userNotExist = (res) => {
    return res.status(409).json({
        status: 404,
        message: i18n.__n('USER_NOT_EXIST')
    })
}

exports.loginSuccess = (res, user, token, req) => {
    return res.status(409).json({
        status: 200,
        message: req.__('LOGIN_SUCCESS'),
        data: {
            ...user,
            token: {
                auth_token: token.auth_token,
                refresh_token: token.refresh_token
            }

        }
    })
}

exports.forgotPasswordEmailSent = (res, verificationLink, email) => {
    return res.status(409).json({
        status: 200,
        message: i18n.__n('FORGOT_PASSWORD_LINK_SENT', {email: email}),
    })
}

exports.emailNotVerify = (res) => {
    return res.status(409).json({
        status: 200,
        message: i18n.__n('EMAIL_NOT_VERIFY'),
    })
}

