const multer = require("multer");
const path = require("path");

const upload = multer({
  dest: "uploads/", // temp folder
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
    const allowedMime = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedExt.includes(ext) || !allowedMime.includes(file.mimetype)) {
      return cb(new Error("Only JPG, JPEG, PNG, and WEBP images are allowed"));
    }

    cb(null, true);
  },
});

module.exports = upload;
