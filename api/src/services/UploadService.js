const fs = require("fs");
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();
exports.createUploadService = (sizeLimitMB) => {
  const uploadDir = path.join(process.cwd(), "temp_uploads");

  // Ensure the directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        // Generate a unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
      },
    }),
    limits: { fileSize: sizeLimitMB * 1024 * 1024 }, // Convert MB to Bytes
  });
};

exports.deleteTemporaryFiles = () => {
  const uploadDir = path.join(process.cwd(), "temp_uploads");
  console.log('uploadDir',uploadDir)
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Error reading temp_uploads directory:", err);
    }
    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Error deleting file ${filePath}:`, unlinkErr);
        }
      });
    });
  });
};

exports.multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.REST.BADREQUEST(0, err.message, err); // Send JSON error response
  } else if (err) {
    return res.REST.SERVERERROR(0, "Something went wrong!", err);
  }
  next();
};

exports.uploadService = multer({ storage: storage });
