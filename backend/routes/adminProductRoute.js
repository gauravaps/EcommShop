import express from "express";
import { protect ,admin } from "../middleware/authMiddleware.js";

const router =express.Router()

import { createProduct ,updateProduct} from "../controllers/adminController.js";

router.route('/addproduct').post(protect ,admin ,createProduct)
router.route('/:id').put(protect , admin ,updateProduct)






export default router;
