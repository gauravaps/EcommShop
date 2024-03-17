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


dbconnect()
dotenv.config()





const app =express();
const port=process.env.PORT || 5000;



//set cookie-parser middleware
app.use(cookieParser());


app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use('/api', productroute); 
app.use('/api/user',userroute); 
app.use('/api/order' , orderRoute)

app.get('/api/config/paypal', (req, res, next) => {
    const clientId = process.env.PAYPAL_CLIENT_ID;;
    if (!clientId) {
        const error = new Error('PayPal client ID is not set');
        return next(error);
    }
    res.send({ clientId });
});


app.use(Notfound);

 app.use(errorHandler) 






app.listen(port, () => {
    console.log(` ⚙️  express is running on port ${port}`);
    

    
});