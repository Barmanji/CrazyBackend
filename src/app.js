import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

app.use(cors({
 origin: process.env.ORIGIN_KEY_CORS,
 credentials: true
}))

const app = express ();

export {app}
