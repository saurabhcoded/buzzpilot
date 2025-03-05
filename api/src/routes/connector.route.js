const express = require("express");
const connectorController = require("../controllers/connector.controller");
const connectorRouter = express.Router();

connectorRouter.get("/youtube", connectorController.connectYoutubeAccount);
connectorRouter.get("/youtube/save", connectorController.saveYoutubeAccount);
connectorRouter.get("/callback", connectorController.connectCallbackController);

module.exports = connectorRouter;
