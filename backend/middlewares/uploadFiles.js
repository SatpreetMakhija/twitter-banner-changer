const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    //in bytes (approx 1 MB)
    fileSize: 1024 * 1024,
    files: 4
  },
  fileFilter: (req, file, cb) => {
    console.log("fileFilter is called...");
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      console.log("pass");
      cb(null, true);
    } else {
      const err = new Error("File type not supported");
      err.code = "FILE_TYPE_NOT_SUPPORTED";
      cb(err);
    }
  },
});



module.exports = {upload};
