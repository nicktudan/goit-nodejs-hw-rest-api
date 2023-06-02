const multer = require("multer");
const path = require("path");

const { HttpErr } = require("../helpers");

const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1024 * 1024
  }
});

const fileFilter = (req, file, cb) => {
  const { mimetype } = file;
  console.log(mimetype);
  if (mimetype !== "image/jpeg" || mimetype !== "image/png") {
    cb(HttpErr(400, "File can have only .jpg or .png extension"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: multerConfig,
  fileFilter,
});

module.exports = upload;
