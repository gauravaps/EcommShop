import mongoose from "mongoose";
import bcrypt from 'bcryptjs'


const userSchema =new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
        unique:true,
        validate: {
            validator: (email) => {
                // Regular expression for email validation
                return /^[a-zA-Z]+[a-zA-Z0-9._%+-]*@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/.test(email);
            },
            message: error => `${error.value} is not a valid email address`
        }
    },

    password:{ 
        type:String,
        required:true,
    },
    
    isAdmin:{
        type:Boolean,
        required:true,
        default:false,
    },





},{timestamps:true});

//capare password after login user
userSchema.methods.matchPassword =async function(enterPassword)  {
    return await bcrypt.compare(enterPassword ,this.password)
};

// bcrypt password user registration time 
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
         next()
    }
    try {
        
            let salt =await bcrypt.genSalt(10);
            const hassPassword= await bcrypt.hash(this.password,salt)
            this.password =hassPassword

            next();
    } catch (error) {
        return next(error);
        
    }
    
})




const usermodel =mongoose.model('usermodel',userSchema);

export default usermodel;