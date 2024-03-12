import asyncHandler from "../middleware/asyncHandler.js";
import { customError } from "../middleware/apierror.js";
import usermodel from "../models/userModel.js";
import dotenv from "dotenv";
import generateToken from "../utils/generateToken.js";


dotenv.config()

// New user registration
//for public
const userRegistration =asyncHandler(async(req ,res ,next) =>{
    const {name ,email ,password} =req.body;

    const existuser =await usermodel.findOne({email}) ;
    
    if(existuser){
        let err =new customError('User already registered',401)
        return next(err)
    }

    const newUser = new usermodel({name , email ,password})
    if(newUser){
        generateToken(res , newUser._id)
        let saveUser =await newUser.save();
        res.status(200).json({
             _id: saveUser._id,
            name: saveUser.name,
            email: saveUser.email,
            isAdmin: saveUser.isAdmin,})
    }else{
        
        let err =new customError('invalid user data',400)
        return next(err)

    }

})



//login user
const auth =asyncHandler(async(req,res ,next)=>{

    const {email ,password} =req.body;
    const userfind =await usermodel.findOne({email})

    if(userfind && (await userfind.matchPassword(password))){

        generateToken(res ,userfind._id)

       return res.json({'_id':userfind._id
                ,'name':userfind.name,
                'email':userfind.email,
                'isAdmin':userfind.isAdmin })
    }else{
        const err =new customError('incorrect user email or Password',404)
        return next(err)

    }
})

//logOut user 
const logout =asyncHandler(async(req ,res ,next) =>{

    res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0),

    });
    res.status(200).json({message:'logged out sucessfully'});
})




//get all users
//only for admin
const getalluser =asyncHandler(async(req,res,next) =>{
    res.send('all uses')
})

//get user by Id
//public route
const getuserprofile = asyncHandler(async(req ,res ,next) =>{

    const getProfile = await usermodel.findById(req.activeUser)

    if(getProfile){
        res.status(200).json({
            _id: getProfile._id,
            name: getProfile.name,
            email: getProfile.email,
            isAdmin: getProfile.isAdmin,
        })
    } else{
        let err =new customError ('No user profile found',400)
        return next(err);
    }





})



//Update user profile 
const updateUserProfle =asyncHandler(async(req ,res ,next) =>{
    const {name ,email ,password} =req.body ;

    const userProfile =await usermodel.findById(req.activeUser)

    if (userProfile) {
        userProfile.name = name || userProfile.name;
        userProfile.email = email || userProfile.email;
        userProfile.password = password || userProfile.password
        
        const saveupdateprofile =await userProfile.save()
        res.status(200).json({
            _id:saveupdateprofile._id,
            name:saveupdateprofile.name,
            email:saveupdateprofile.email,
            isAdmin:saveupdateprofile.isAdmin,
        })
    }else{
        let err = new customError('user upadattion failed' , 404)
        return next(err)

    }
})



export{auth, getalluser,logout ,userRegistration ,getuserprofile,updateUserProfle};