import asyncHandler from "./asyncHandler.js";
import  jwt  from "jsonwebtoken";
import usermodel from "../models/userModel.js";
import { customError } from "./apierror.js";
import dotenv from "dotenv";

dotenv.config()


// middleware for protect routes
const protect = asyncHandler(async(req,res,next) =>{
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decode =jwt.verify(token,process.env.SECRET_TOKEN)
            req.activeUser =await usermodel.findById(decode.userId).select('-password')

            next()
            
        } catch (error) { 
            console.log('token error' ,error)
            let err =new customError('Not authorized , token failed' , 401)
            return next(err)        
        }
        
    } else {
        let err = new customError('Not authorized , No token found' ,401);
        return next(err)  
    }

})

//check for admin User 
const admin =asyncHandler(async(req ,res ,next) =>{
    if(req.activeUser && req.activeUser.isAdmin){
        next();
    }else{
        let err =new customError('Not authorized as admin' , 401)
        return next(err)
    }
})

export{protect , admin}