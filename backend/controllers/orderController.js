import dotenv from "dotenv";
import ordermodel from "../models/orderModel.js";
import { customError } from "../middleware/apierror.js";
import asyncHandler from "../middleware/asyncHandler.js";

dotenv.config();

//Create new order
//post /api/order
//private
const addOrderitems =asyncHandler(async(req ,res ,next) =>{
    res.send('add order items')
});



//Get logged in user orders
//post /api/order/myorders
//private
const getMyOrders =asyncHandler(async(req ,res ,next) =>{
    res.send('get my order')
});



//Get order by Id
//post /api/order/:id
//private
const getOrderById =asyncHandler(async(req ,res ,next) =>{
    res.send('get order by id')
});



//update order to paid
//get /api/order/:id?pay
//private
const updateOrderToPaid =asyncHandler(async(req ,res ,next) =>{
    res.send('update order to paid')
});



//Gupdate to delivered
//get /api/order/:id/delivered
//private/admin
const updateOrderToDelivered =asyncHandler(async(req ,res ,next) =>{
    res.send('update order to deliverd')
});



//Get all orders
//get /api/order/id
//private/admin
const getAllOrders =asyncHandler(async(req ,res ,next) =>{
    res.send('get all orders')
});



export{addOrderitems ,getMyOrders ,getOrderById,updateOrderToPaid ,updateOrderToDelivered ,getAllOrders}



