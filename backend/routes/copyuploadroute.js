import path from 'path'
import express from 'express'
import multer from 'multer'


const router =express.Router()
//mutler configuration ..
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Uploads folder where files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // file naming 
     
    },
  });

  //upload file here...
const upload = multer({ storage: storage }); 


router.post('/' , upload.single('image') ,(req ,res ) =>{
    res.send({
        message:'image uploaded',
        image:`${req.file.path}`
    })
})


//export default router;

