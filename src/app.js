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
import userRouter from "./routes/user.routes.js";
//routers declaration pracs...
app.use("/api/v1/user", userRouter)   //USL WILL BE = http://localhost:8000/api/v1/users/register  - good prac for url.
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)
export {app}
