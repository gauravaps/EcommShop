import mongoose from "mongoose";
import dotenv from 'dotenv';


dotenv.config()


const dbconnect =async()=>{
    try {
     const connectioninstance=  await mongoose.connect(process.env.MONGOGB_URI)

     console.log(`\n mongodb connection !! DB => host: ${connectioninstance.connection.host}`);
     console.log(process.env.MONGOGB_URI);

        
    } catch (error) {
        console.log('mongodb connction error',error);
        process.exit(1);
        
    }
}

export default dbconnect; 