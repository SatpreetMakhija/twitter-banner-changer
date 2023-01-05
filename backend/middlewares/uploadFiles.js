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
  },
  fileFilter: (req, file, cb) => {
    console.log("fileFilter is called...");
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      console.log("pass");
      cb(null, true);
    } else {
      console.log("not pass");
      cb("There exists a file that is not supported", false);
    }
  },
});



module.exports = {upload};
