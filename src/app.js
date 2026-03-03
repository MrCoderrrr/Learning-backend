// import express for making app server
import express from 'express';
// CORS(cross origin resource sharing) it is used to allow frontend to get data and resources from backed that runs on other port
import cors from 'cors';
// cookie parser is used to parse cookies that are stored in browser of the user regarding his last visit and his data
import cookieParser from 'cookie-parser';
 
// made a server with the name app
const app = express();

/*-------------------------------
MIDDLEWARES
----------------------------------*/
//using middleware cors that is allowing frontend to get resources from backend 
app.use(cors({
    //process.env.cors origin is having the url of all the frontend ports that can access this backend server
    origin: process.env.CORS_ORIGIN,
    // sensitive data is allowed when credentials is turned on
    credentials: true
}))

// using this middle ware to read json from the request object with the max limit of 16kb
app.use(express.json({limit : "16kb"}))
// using this middle ware to read url from the request object with the max limit of 16kb and the extended part is allowing nested urls
app.use(express.urlencoded({extended: true, limit:"16kb"}))
//this is the middleware that is used to store images or favicon that might come in req object sent by user
app.use(express.static("public"))
//perform CURD on the cookies of the user 
app.use(cookieParser())

import userRouter from './routes/user.routes.js';

// declaring routes
app.use("/api/v1/users",userRouter)
export { app }