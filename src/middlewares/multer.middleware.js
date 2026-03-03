import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    // here we could have store with unique name but the file is going to stay for a very short amount of time so we are saving with the original names
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage, })