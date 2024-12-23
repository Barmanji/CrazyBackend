import multer from "multer"


 //can be used memory storage rather than diskstorage ~~~ READ ABOUT IT ~~~ FUTURE BJJr.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.filename + '-' + uniqueSuffix) //can be used original name, but its generally a bad prac.
  }
})
export const upload = multer({ storage, }) //because its es6 we dont need storage: storage


