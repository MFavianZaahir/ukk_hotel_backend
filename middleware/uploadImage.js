const multer = require('multer');
const path = require('path');

const storageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/usr/");
  },
  filename: (req, file, cb) => {
    cb(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname));
  }
});

const storageTypeRoom = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/");
  },
  filename: (req, file, cb) => {
    cb(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname));
  }
});

const uploadUser = multer({ storage: storageUser });
const uploadTypeRoom = multer({ storage: storageTypeRoom });

module.exports = {
  uploadUser,
  uploadTypeRoom
};
