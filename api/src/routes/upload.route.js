const express = require("express");
const fs = require("fs");
const UploadController = require('../controllers/upload.controller');
const path = require("path");
const apiValidator = require("../middleware/validatorMiddleWare");
const {getSignedUrlSchema} = require("../validations/upload.validations");
const uploadRouter = express.Router();

//code for  generating file url and it will be uploaded on client side by taking url
uploadRouter.post("/s3UploadUrl", apiValidator(getSignedUrlSchema), UploadController.s3SignedUrl);
uploadRouter.get("/image", UploadController.getS3Image);
uploadRouter.get("/tempurl", UploadController.getTempS3Url);

module.exports = uploadRouter;
