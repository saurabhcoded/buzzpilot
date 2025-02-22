const express = require('express')
const AuthRouter = express.Router();
const authController = require('../controllers/auth.controller')
const {isAuth} = require('../middleware/jwt_auth');
const apiValidator = require('../middleware/validatorMiddleWare');
const {PasswordValidation, LoginValidation, ForgotPassValidation} = require('../validations/users.validations');

/* Login Route */
AuthRouter.post('/login', apiValidator(LoginValidation), authController.login);

//verify account
AuthRouter.post('/account-verify/generate', authController.newVerificationLink);
AuthRouter.post('/account-verify/:token', authController.verifyUserAccount);

//forgot password
AuthRouter.post('/forgot-password/request', apiValidator(ForgotPassValidation), authController.forgotPasswordRequest);
AuthRouter.post('/forgot-password/save/:token', apiValidator(PasswordValidation), authController.forgotPasswordSave);

//refresh token
AuthRouter.post('/refresh-user-token', isAuth, authController.refreshUserToken)

module.exports = AuthRouter