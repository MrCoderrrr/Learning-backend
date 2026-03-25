import fs from "fs";
import path from "path";
import multer from "multer";

const tempDir = path.resolve("./public/temp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "_");

    cb(null, `${Date.now()}-${baseName}${extension}`);
  },
});

export const upload = multer({ storage });
