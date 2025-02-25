const express = require("express");
const ReportsController = require("../controllers/reports.controller");
const dashboardRouter = express.Router();

dashboardRouter.post("/reports/youtube", ReportsController.getReportData);

module.exports = dashboardRouter;
