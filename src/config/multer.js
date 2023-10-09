import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const upload = (role) => {
  let folder;

  switch (role) {
    case 'admin':
      folder = 'adminFile';
      break;
    case 'user':
      folder = 'userFile';
      break;
    case 'book':
      folder = 'bookFile';
      break;
    default:
      throw new Error('Invalid role specified');
  }

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      resource_type: 'auto',
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
      const uniqueFilename = `${role}-${uniqueSuffix}-${file.originalname}`;
      cb(null, uniqueFilename);
    },
  });

  const uploadMiddleware = multer({
    storage: storage,

    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  });

  return uploadMiddleware;
};

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('ERROR: Kindly please upload a valid filetype');
  };
};

export default upload;