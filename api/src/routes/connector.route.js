const express = require("express");
const connectorController = require("../controllers/connector.controller");
const { commonConfig } = require("../config/config");
const { createUploadService } = require("../services/UploadService");
const connectorRouter = express.Router();

let postuploadService = createUploadService(commonConfig.postmax_size);

// youtube
connectorRouter.get("/youtube", connectorController.connectYoutubeAccount);
// gdrive
connectorRouter.get("/gdrive", connectorController.connectGDriveAccount);
connectorRouter.post("/gdrive/items", connectorController.getGdriveItemsList);
connectorRouter.post("/gdrive/itemdata", connectorController.getGdriveFileData);
connectorRouter.delete("/gdrive/delete", connectorController.deleteGdriveFile);
connectorRouter.post("/gdrive/addfolder", connectorController.addGdriveFolder);
connectorRouter.post(
  "/gdrive/uploadfile",
  postuploadService.single("file"),
  connectorController.uploadGdriveFile
);
connectorRouter.post("/gdrive/rename", connectorController.renameGdriveItem);
connectorRouter.get("/callback", connectorController.connectCallbackController);

module.exports = connectorRouter;
