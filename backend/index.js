import  Path from 'path';
import express from 'express'
import products from './data/products.js'
import dotenv from 'dotenv';
import dbconnect from './config/db.js';
import productroute from './routes/productroute.js';
import userroute from './routes/userRoute.js'
import orderRoute from './routes/orderRoute.js'
import { errorHandler, Notfound} from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import { customError } from './middleware/apierror.js';
import cors from 'cors' ;
import adminRoute from './routes/adminProductRoute.js';
import path from 'path';
import uploadRoute from './routes/uploadRouter.js'



dbconnect()
dotenv.config()





const app =express();
const port=process.env.PORT || 5000;



//set cookie-parser middleware
app.use(cookieParser());


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());



app.use('/api', productroute); 
app.use('/api/user',userroute); 
app.use('/api/order' , orderRoute);
app.use('/api/adminproduct' ,adminRoute)
app.use('/api/upload',uploadRoute)





app.get('/api/config/paypal', (req, res, next) => {
    const clientId = process.env.API_KEY;
    if (!clientId) {
        const error = new Error('PayPal client ID is not set');
        return next(error);
    }
    res.send({ clientId });
});

//static path
const __dirname= path.resolve();
app.use('/uploads' , express.static(path.join(__dirname, '/uploads')));

//for production route
if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static(path.join(__dirname,'/frontend/build')));

    //any route that is not will be redirected to index.html

    app.get('*' ,(req ,res) =>
    res.sendFile(path.resolve(__dirname ,'frontend' ,'build' ,'index.html'))
    );
}else{
    app.get('/' ,(req,res) =>{
        res.send('API is running...');
    });
}


app.use(Notfound);

 app.use(errorHandler) 






app.listen(port, () => {
    console.log(` ⚙️  express is running on port ${port}`);
    

    
});