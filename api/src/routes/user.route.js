const express = require('express')
const UserRouter = express.Router()
const userController = require("../controllers/user.controller")
const {isAuth} = require('../middleware/jwt_auth')
const apiValidator = require('../middleware/validatorMiddleWare')
const {UserValidationSchema, EditUserValidation, ChangePassValidation} = require('../validations/users.validations')

//  Route for change password
UserRouter.put('/change-password', isAuth, apiValidator(ChangePassValidation), userController.changeUserPassword)

// Route To Register a New User
UserRouter.post('/create', apiValidator(UserValidationSchema), userController.createUser);

// Route For Self Info
UserRouter.get('/self-user', isAuth, userController.getLoggedUser)
UserRouter.put('/self-user', isAuth, apiValidator(EditUserValidation), userController.editSelfProfile)

//Route for Updating Users by some sort of Authority Such as Admin
/* Make sure to put a filter based upon user roles to be able to use these Routes */
UserRouter.get('/view/:id', isAuth, userController.getUserById)
UserRouter.put('/edit/:id', isAuth, apiValidator(EditUserValidation), userController.editUser)




module.exports = UserRouter;