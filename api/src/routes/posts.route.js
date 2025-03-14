const express = require("express");
const PostsController = require("../controllers/posts.controller");
const { multerErrorHandler } = require("../services/UploadService");
const postsRouter = express.Router();

//code for  generating file url and it will be uploaded on client side by taking url
postsRouter.post("/createpost", PostsController.createpost);

module.exports = postsRouter;
