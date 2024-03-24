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
    const users =await usermodel.find({});
    
    if(users){
        res.status(200).json(users)
    }else{
        let err = new customError('No user found' , 404);
        return next(err)
    }

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
//put method
//access user
const updateUserProfle =asyncHandler(async(req ,res ,next) =>{
    const {name ,email ,password} =req.body ;

    const userProfile =await usermodel.findById(req.activeUser._id)

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

//get user by Id
//method get
//access admin
const getUserById =asyncHandler(async(req ,res ,next) =>{

    const user = await usermodel.findById(req.params.id).select('-password');

    if(user){
        res.status(200).json(user);

    }else{
        let err = new customError(' User not found' ,404);
        return next(err);
    }

})


//delete user
//method delete
//access admin
const deleteUser =asyncHandler(async(req ,res ,next) =>{
    const user =await usermodel.findById(req.params.id)
    if(user){
        if(user.isAdmin){
            res.status(400).json('you can not delete admin user')
        }
        await usermodel.deleteOne({_id:user._id});
        res.status(200).json({message:'User deleted successfully'})

    }else{
        let err =new customError('User not found for delete' ,404);
        return next(err)
    }
})


//update user by Id
//method put
//access admin
const updateUserById =asyncHandler(async(req ,res ,next) =>{

    const user = await usermodel.findById(req.params.id)

    if(user){
        user.name =req.body.name ||user.name;
        user.email =req.body.email || user.email;
        user.isAdmin=Boolean(req.body.email) || user.isAdmin;

        const updateUser = await user.save();
        res.status(200).json({
            _id:updateUser._id,
            name:updateUser.name,
            email:updateUser.email,
            isAdmin:updateUser.isAdmin,
        })
    }else{
        let err =new customError('User not found for update' ,404);
        return next(err);
    }

})












export{auth, getalluser,logout ,userRegistration ,
    getuserprofile,updateUserProfle ,updateUserById,deleteUser,getUserById};