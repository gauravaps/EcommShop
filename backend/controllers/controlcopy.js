import dotenv from "dotenv";
import ordermodel from "../models/orderModel.js";
import { customError } from "../middleware/apierror.js";
import asyncHandler from "../middleware/asyncHandler.js";

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
            id:req.body.id,
            status:req.body.status,
            update_time:req.body.update_time,
            email_address:req.body.payer.email_address,
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
    res.send('update order to deliverd');
});



//Get all orders
//get /api/order/id
//private/admin
const getAllOrders =asyncHandler(async(req ,res ,next) =>{
    res.send('get all orders')
});



//export{addOrderitems ,getMyOrders ,getOrderById,updateOrderToPaid ,updateOrderToDelivered ,getAllOrders}



