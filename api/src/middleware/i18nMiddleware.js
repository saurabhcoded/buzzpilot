const i18n = require("../config/i18n.config");

const I18nMiddleware = (app) => {
    app.use(i18n.init)
    i18n.setLocale('en');
    app.use(function (req, res, next) {
        if (req.headers['accept-language']) {
            i18n.setLocale(req.headers['accept-language'])
        }
        next();
    })
}

module.exports = I18nMiddleware;