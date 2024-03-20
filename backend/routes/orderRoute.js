import express from 'express'
const router =express.Router()
import { protect } from '../middleware/authMiddleware.js'
import { admin } from '../middleware/authMiddleware.js'
import{addOrderitems ,getMyOrders ,
    getOrderById,updateOrderToPaid ,
    updateOrderToDelivered ,getAllOrders ,
    paymentVerify,razorpaycreateOrder,razorpayTransaction} from '../controllers/orderController.js'

 
 router.route('/addorder').post(protect ,addOrderitems);
 router.route('/myorders').get(protect ,getMyOrders) 
 router.route('/getallorders').get(protect ,admin ,getAllOrders);
 router.route('/:id').get(protect  ,getOrderById);
 router.route('/:id/pay').put(protect ,updateOrderToPaid);
 router.route('/:id/deliver').put(protect , admin , updateOrderToDelivered);
 router.route('/verify').post(paymentVerify)
 router.route('/createorder').post(razorpaycreateOrder)
 router.route('/createtransaction').post(protect ,razorpayTransaction)
  







export default router;