import express from 'express'
import { protect ,admin} from '../middleware/authMiddleware.js';

const router =express.Router()

import { getallproduct ,getsingleProduct } from '../controllers/productcontroller.js';

// route for getting all product
router.route('/products').get(getallproduct)

//route for getting single user
router.route('/products/:id').get(getsingleProduct)
//create product


 
export default router;