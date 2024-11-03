import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const mongooseInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MONGO DB IS CONNECTED || DB HOST: ${mongooseInstance.connection.host}`)
    }
    catch(error){
        console.log("Mongo Connection error",error);
        process.exit(1);
    }
}

export default connectDB;
