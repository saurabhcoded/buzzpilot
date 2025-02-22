const express = require("express");
const FeaturesController = require('../controllers/features.controller');
const featureRouter = express.Router();

//code for  generating file url and it will be uploaded on client side by taking url
featureRouter.post("/xlsx/tojson", FeaturesController.exceltoJsonController);
featureRouter.post("/xlsx/toxlsx", FeaturesController.jsontoExcelController);
featureRouter.post("/pdf/pdf2text", FeaturesController.pdf2TextController);
featureRouter.post("/pdf/text2pdf", FeaturesController.text2PdfController);
featureRouter.post("/pdf/html2pdf", FeaturesController.html2PdfController);

module.exports = featureRouter;
