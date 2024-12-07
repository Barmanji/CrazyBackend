//require('dotenv').config()
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { DB_NAME } from "./constants.js";
import { app } from "./app.js";
dotenv.config({
    path: './env'
})
console.log(process.env)
//;(async ()=>{
//    try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//        app.on("error",(error)=>{
//            console.log('ERR: ', error);
//            throw error
//        })
//        app.listen(process.env.PORT, ()=>{
//            console.log(`The app is listening at ${process.env.PORT}`);
//        })
//    }
//    catch {
//        console.log("error",error)
//        throw err
//    }
//})()

connectDB()
    .then(() => {
        app.on("error", (error)=> {
            console.log('ERROR: ', error);
            throw error
        });
        app.listen(process.env.PORT || 8000, ()=> {
            console.log(`Server is running at port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(`error in connection DB`, err);
    })
