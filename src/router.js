import express from 'express';
import multer from 'multer';

const router = express.Router();

const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg\png)$/)) {
      return cb(new Error('Please upload a valid photo'))
    }

    cb(undefined, true)
  }
})

router.post('/upload', upload.single('upload'), (req, res) => {
  console.log(req.file)
  console.log(req.body)
  res.json({
    image: req.file,
    message: 'successfully uploaded'
  })
})

export default router; 