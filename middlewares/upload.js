const multer = require("multer");
const path = require("path");

const { HttpErr } = require("../helpers");

const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const limits = {
  fileSize: 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  const { mimetype } = file;
  console.log(mimetype);
  if (mimetype === "image/jpeg" || mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(HttpErr(400, "File can have only .jpg or .png extension"), false);
  }
};

const upload = multer({
  storage: multerConfig,
  limits,
  fileFilter,
});

module.exports = upload;
