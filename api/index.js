const express = require('express');
let logger = require('morgan');
let app = express();
const api = require('./src/routes/api');
const SecurityMiddleware = require('./src/middleware/securityHeaders');
const I18nMiddleware = require('./src/middleware/i18nMiddleware');
const RestMiddleware = require('./src/middleware/RestMiddleWare');
// sequelize

/* ---------- MiddleWares ---------- */
// Internalisation
I18nMiddleware(app);
//Security and Cors Middleware
SecurityMiddleware(app);
// Logger
app.use(logger('dev'));
// Application Type
app.use(express.text());
app.use(express.json());
// Url Encoded
app.use(express.urlencoded({extended: false}))
// Rest Method for Api
app.use(RestMiddleware)

/* ----------- Api Routes ----------- */
app.use('/api/v1', api);
// We Can add Multiple versions here for api versioning

module.exports = app;