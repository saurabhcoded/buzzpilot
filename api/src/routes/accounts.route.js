const express = require("express");
const PostsController = require("../controllers/posts.controller");
const { uploadService } = require("../services/UploadService");
const { verifyFirebaseToken } = require("../services/firebaseService");
const postsRouter = express.Router();

//code for  generating file url and it will be uploaded on client side by taking url
postsRouter.post("/create", PostsController.uploadVideotoYoutube);

module.exports = postsRouter;
