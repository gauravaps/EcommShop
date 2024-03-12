import mongoose from "mongoose"; 

const orderSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'usermodel',
        required:true,
    },

    orderItems:[
        {
            name:{type:String, required:true},
            qty:{type:Number, required:true},
            image:{type:String, required:true},
            price:{type:Number, required:true},
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'productmodel',
                required:true,
            },
        }
    ],

    shippingAddress:{
        address:{type:String, required:true},
        city:{type:String,required:true},
        postcode:{type:Number , required:true},
        country:{type:String , required:true},

    },

    paymenymethod:{
        type:String,
        required:true,
    },

    paymentresult:{
        id:{type:String},
        status:{type:String},
        update_time:{type:String},
        email_address:{type:String},
    },

    itemsprice:{
        type:Number,
        required:true,
        default:0.0,
    },
    
    texprice:{
        type:Number,
        required:true,
        default:0.0,
    },

    shippingprice:{
        type:Number,
        required:true,
        default:0.0,
    },

    totalprice:{
        type:Number,
        required:true,
        default:0.0,
    },

    isPaid:{
        type:Boolean,
        required:true,
        default:false,
    },

    paidAt:{
        type:Date,
    },

    isDelivered:{
        type:Boolean,
        required:true,
        default:false,
    },

    deliveredAt:{
        type:Date,
    },

},{timestamps:true});

const ordermodel = mongoose.model('ordermodel',orderSchema);

export default ordermodel;