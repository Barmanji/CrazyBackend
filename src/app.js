import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()
app.use(cors({
 origin: process.env.ORIGIN_KEY_CORS,
 credentials: true
}))

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes
import router from "./routes/user.routes.js";
//routers declaration pracs...
app.use("/api/v1/user", router)   //USL WILL BE = http://localhost:8000/api/v1/users/register  - good prac for url.

export {app}
