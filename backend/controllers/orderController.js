import dotenv from "dotenv";
import ordermodel from "../models/orderModel.js";
import { customError } from "../middleware/apierror.js";
import asyncHandler from "../middleware/asyncHandler.js";
import razorpay from 'razorpay';
import crypto from 'crypto';
import razorpayModel from "../models/razorpayModel.js";


const API_KEY='rzp_test_B4h4G5aIXIDmF3'
const SECRET_KEY='tZlUSy0PyMSlFCCcqceqcU0Q' 

dotenv.config();

//Create new order
//post /api/order
//private
const addOrderitems =asyncHandler(async(req ,res ,next) =>{
    const {orderItems,shippingAddress,paymentMethod,itemsPrice,taxPrice,shippingPrice,totalPrice} =req.body;

    if(orderItems && orderItems.length === 0){
        let err =new customError("No order items", 400)
        return next(err)
    }
    
    const order = new ordermodel({
        user:req.activeUser._id,
         orderItems:orderItems.map((x) => ({
            ...x,
           product:x._id,
           _id:undefined,

         })),


        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,

                                
    })
    const saveOrder =await order.save();
    res.status(200).json(saveOrder);
});


// Initialize Razorpay instance with your API keys
const instance = new razorpay({
    key_id: API_KEY,
    key_secret: SECRET_KEY,
});

// razorpay order create..

const razorpaycreateOrder= async(req ,res) =>{
    try {
        const totalPrice = req.body.totalPrice;
        const saveOrder = req.body.saveOrder;

        

         // Prepare options for creating a Razorpay order
         const options = {
            amount: Number(totalPrice * 100), // Amount in paise
            currency: 'INR', // Currency (change as per your requirement)
            receipt: saveOrder._id.toString(), // Unique identifier for order
            payment_capture: 1, // Auto-capture payment after order creation
        };
         // Create Razorpay order
         const razorpayOrder = await instance.orders.create(options);

         // Send response with the newly created order and Razorpay order details
         res.status(200).json({ success: true, order: saveOrder, razorpayOrder });


        
    } catch (error) {
        // Handle any errors that occur during order creation or Razorpay integration
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
        
    }
}


// Payment verification after successful payment in Razorpay
// POST /api/order/verify
// public

const paymentVerify =asyncHandler(async(req ,res ,next) =>{
    try {
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Generate expected signature using Razorpay secret key
        const hmac = crypto.createHmac('sha256', SECRET_KEY);
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        const expectedSignature = hmac.digest('hex');

        // Verify the signature
        if (expectedSignature === razorpay_signature) {
            // Payment verification successful
            // Perform any additional actions here (e.g., updating order status)
            
            res.status(200).json({ success: true, message: 'Payment verification successful' });
        } else {
            // Signature mismatch, payment verification failed
            res.status(400).json({ success: false, message: 'Payment verification failed: Signature mismatch' });
        }
    } catch (error) {
        // Handle any errors that occur during payment verification
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})




//Get order by Id
//post /api/order/:id
//private
const getOrderById =asyncHandler(async(req ,res ,next) =>{

    const user={
        name:req.activeUser.name,
        email:req.activeUser.email,

    }
    
     const orders =await ordermodel.findById(req.params.id).populate('user' ,'name email' );

    if(orders){
        res.status(200).json(orders)

    } else{
        let err = new customError('Order not found' ,404);
        return next(err);
    }
});



//Get logged in user orders
//post /api/order/myorders
//private
const getMyOrders =asyncHandler(async(req ,res ,next) =>{
    const orders =await ordermodel.find({user:req.activeUser._id})
    res.status(200).json(orders)
});




//update order to paid
//put /api/order/:id?pay
//private
const updateOrderToPaid =asyncHandler(async(req ,res ,next) =>{

    const order =await ordermodel.findById(req.params.id);

    if(order){
        order.isPaid=true,
        order.paidAt=Date.now(),
        order.paymentResult={
            id:req.body.razorpay_order_id,
            status:req.body.status,
            update_time:req.body.update_time,
            email_address:req.body.email,
        }

        const saveOrder =await order.save();
        res.status(200).json(saveOrder)

    } else{
        let err= new customError('Order not fount' ,404)
        return next(err)
    }
});




//Gupdate to delivered
//put /api/order/:id/delivered
//private/admin
const updateOrderToDelivered =asyncHandler(async(req ,res ,next) =>{
    
    const updateDeliverd = await ordermodel.findById(req.params.id);
    
    if(updateDeliverd){
        updateDeliverd.isDelivered=true;
        updateDeliverd.deliveredAt=Date.now();

        const updateStatus = await updateDeliverd.save()
        res.status(200).json(updateStatus);

    }else{
        let err =('order not found' ,404);
        return next(err);
    }
});



//Get all orders
//get /api/order/id
//private/admin
const getAllOrders =asyncHandler(async(req ,res ,next) =>{

    const allOrders =await ordermodel.find({}).populate('user' , 'id name');

    if(allOrders){
        res.status(200).json(allOrders)
    }else{
        let err =new customError('No order found' ,404);
        return next(err)
    }
});

//RAZORPAY TRANSACTION HERE 
const razorpayTransaction =asyncHandler(async(req ,res ) =>{

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
        const createTransaction = new razorpayModel({
          user: req.activeUser,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        });
    
        const savedTransaction = await createTransaction.save();
    
        res.status(200).json({
          success: true,
          transaction: savedTransaction
        });
      } catch (error) {
        console.error('Error in razorpay transaction:', error);
        res.status(500).json({
          success: false,
          message: 'Internal Server Error'
        });
      }

})



export{addOrderitems ,getMyOrders ,getOrderById,updateOrderToPaid 
    ,updateOrderToDelivered ,getAllOrders ,
    paymentVerify ,razorpaycreateOrder, razorpayTransaction}



