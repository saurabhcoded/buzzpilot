const express = require("express");
const connectorController = require("../controllers/connector.controller");
const connectorRouter = express.Router();

connectorRouter.get("/youtube", connectorController.connectYoutubeAccount);
connectorRouter.get("/gdrive", connectorController.connectGDriveAccount);
connectorRouter.post("/gdrive/items", connectorController.getGdriveItemsList);
connectorRouter.post("/gdrive/itemdata", connectorController.getGdriveFileData);
connectorRouter.delete("/gdrive/delete", connectorController.deleteGdriveFile);
connectorRouter.get("/callback", connectorController.connectCallbackController);

module.exports = connectorRouter;
