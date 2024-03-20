import mongoose from "mongoose";

const razorpaySchema =new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'usermodels',
        required:true,
    },

    razorpay_order_id:{
        type:String,
        required:true, 
    },
    razorpay_payment_id:{
        type:String,
        required:true,
    },
    razorpay_signature:{
        type:String,
        required:true,
    },

    
},{timestamps:true})

const razorpayModel = mongoose.model('razorpayModel' ,razorpaySchema)

export default razorpayModel ;