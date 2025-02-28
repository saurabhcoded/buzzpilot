const express = require("express");
const PostsController = require("../controllers/posts.controller");
const {
  createUploadService,
  multerErrorHandler,
  deleteTemporaryFiles,
} = require("../services/UploadService");
const { commonConfig } = require("../config/config");
const postsRouter = express.Router();

//code for  generating file url and it will be uploaded on client side by taking url
let postuploadService = createUploadService(commonConfig.postmax_size);
postsRouter.post(
  "/createpost/youtube",
  postuploadService.fields([
    { name: "videofile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  PostsController.uploadVideotoYoutube,
  multerErrorHandler
);

module.exports = postsRouter;
