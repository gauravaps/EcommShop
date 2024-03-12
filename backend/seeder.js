import usermodel from "./models/userModel.js";
import productmodel from "./models/productModel.js";
import ordermodel from "./models/orderModel.js";
import users from "./data/users.js"
import products from "./data/products.js";
import dbconnect from "./config/db.js";
import dotenv from 'dotenv';

dbconnect()
dotenv.config()

const importdata =async()=>{
    try {
        await ordermodel.deleteMany()
        await productmodel.deleteMany()
        await usermodel.deleteMany()

        const createusers =await usermodel.insertMany(users);

        const adminuser =createusers[0]._id;

        const sampleproducts =products.map((prod)=>{
            return{...prod ,user:adminuser}
        })
        const createproduct =await productmodel.insertMany(sampleproducts)

        console.log(createproduct);
        process.exit();
        
    } catch (error) {

        console.log(error);
        process.exit(1);

        
    }
}



const destroydata =async() =>{
    try {

        await ordermodel.deleteMany()
        await productmodel.deleteMany()
        await usermodel.deleteMany()

        console.log('data destroyed!');
        process.exit()
        
    } catch (error) {
        console.log(error);
        process.exit(1)
        
    }
}

if(process.argv[2]=== '-d'){
    destroydata();

} else{
    importdata()
}

