const notifyRouter = require("express").Router();
const NotificationController = require('../controllers/notification.controller');
const {isAuth} = require("../middleware/jwt_auth");

//code for  generating file url and it will be uploaded on client side by taking url

/* TODO: Need to Work Upon this */
notifyRouter.get("/all", isAuth, NotificationController.getAllNotificationList);
notifyRouter.post("/markread", isAuth, NotificationController.markReadNotificationList);

module.exports = notifyRouter;
