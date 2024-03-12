import dotenv from 'dotenv'
dotenv.config()


// Url Not found middleware ***
const Notfound =(req,res,next)=>{
    
    const error =new Error(`Not found - ${req.originalUrl}`)

    res.status(404);
    next(error)
}


//ErrorHandler Middleware 
const errorHandler = (err, req, res, next) => {
    
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message

    
    res.status(statusCode).json({
        message,
        statusCode:err.statusCode,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
}



export{Notfound,errorHandler};