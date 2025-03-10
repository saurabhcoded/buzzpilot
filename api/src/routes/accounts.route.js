const express = require("express");
const accountController = require("../controllers/account.controller");
const acccountRouter = express.Router();

//code for  generating file url and it will be uploaded on client side by taking url
acccountRouter.post("/create", accountController.createUserAccount);
acccountRouter.post("/delete", accountController.deleteUserAccount);
acccountRouter.put("/update", accountController.editUserAccount);
acccountRouter.get("/list/:type", accountController.getAccountsList);

module.exports = acccountRouter;
