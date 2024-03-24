
import  Path from "path";
import express from "express";
import { protect ,admin } from "../middleware/authMiddleware.js";
import multer from "multer";


const router =express.Router()

import { createProduct ,updateProduct ,addProductButton ,deleteProduct} from "../controllers/adminController.js";
import path from "path";


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











router.route('/addproduct').post(protect ,admin ,createProduct)
router.route('/:id').put(protect , admin ,updateProduct)
router.route('/addproductbutton').post(protect, admin, upload.single('image'), addProductButton);
router.route('/delete/:id').delete(protect ,admin ,deleteProduct);






export default router;
