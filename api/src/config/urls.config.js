const FrontendBaseUrl = process.env.FRONTEND_BASE_URL;
const URL_CONFIG = {
    frontend_url: FrontendBaseUrl,
    account_verify_url: FrontendBaseUrl + '/auth/account-verify/',
    forgot_password_url: FrontendBaseUrl + '/auth/reset-password/',

}
module.exports = URL_CONFIG;