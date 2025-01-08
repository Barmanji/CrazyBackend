 //can be used memory storage rather than diskstorage ~~~ READ ABOUT IT ~~~ FUTURE BJJr.
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {

      cb(null, file.originalname)
    }
  })

export const upload = multer({
    storage,
}) //because its es6 we dont need storage: storage


