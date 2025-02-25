const multer = require("multer");

const storage = multer.memoryStorage();
exports.uploadService = multer({ storage: storage });