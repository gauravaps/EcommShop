import  jwt  from "jsonwebtoken";
import dotenv from "dotenv";



dotenv.config()


const generateToken =(res , userId) =>{
            // create token here
            const token = jwt.sign({userId},process.env.SECRET_TOKEN ,{expiresIn:'30d'},)

            //set jwt as a HTTP-only cookie
            res.cookie('jwt',token, {
                httpOnly:true,
                secure:process.env.NODE_ENV !=='development',
                sameSite:'strict',
                maxAge:30*24*60*60*1000 ,// 30days
                
            });
}

export default generateToken;