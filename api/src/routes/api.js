const api = require("express")();
const { uploadService } = require("../services/UploadService");
const acccountRouter = require("./accounts.route");
const connectorRouter = require("./connector.route");
const dashboardRouter = require("./dashboard.route");
const postsRouter = require("./posts.route");

api.get("/", (req, res) => {
  res.send("buzzpilot api version 1");
});
api.use("/posts", postsRouter);
api.use("/dashboard", dashboardRouter);
api.use("/connector", connectorRouter);
api.use("/account", acccountRouter);
api.post("/testupload", uploadService.single("testfile"), (req, res) => {
  return res.json(req?.file);
});

module.exports = api;
