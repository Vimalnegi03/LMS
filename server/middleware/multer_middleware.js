import path from "path";

import multer from "multer";

const upload = multer({
  dest: "uploads/",//destination
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 mb in size max limit
  storage: multer.diskStorage({//where it will be stored
    destination: "uploads/",
    filename: (_req, file, cb) => {
      cb(null, file.originalname);//name with which file will be stored
    },
  }),
  fileFilter: (_req, file, cb) => {//filtration in file
    let ext = path.extname(file.originalname);

    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp" &&
      ext !== ".png" &&
      ext !== ".mp4"
    ) {
      cb(new Error(`Unsupported file type! ${ext}`), false);
      return;
    }

    cb(null, true);
  },
});

export default upload;