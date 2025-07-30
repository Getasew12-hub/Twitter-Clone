import express from 'express';
import session from 'express-session';
import passport from 'passport';
import env from "dotenv"
import { v2 as cloudinary } from 'cloudinary';
import  cors from "cors"

import authRoter from "./router/authRouter.js"
import postRouter from "./router/postRouter.js";
import userRouter from "./router/usersRouter.js"
import notiRouter from "./router/notiRouter.js"
const app=express();
const port=5000;
env.config();
   cloudinary.config({ 
        cloud_name:process.env.CLOUND_NAME, 
        api_key:process.env.CLOUN_API_KEY, 
        api_secret:process.env.CLOUND_API_SECRET
    });

app.use(express.urlencoded({extended:true}));
app.use(express.json({limit:"12mb"}));
app.use(session({
    secret:"TOPSECRET",
    resave:false,
    saveUninitialized:false,
    name:"user",
    cookie:{
        maxAge:1000*60*60*60*48,
        path:"/"
   }
}))
app.use(passport.initialize());
app.use(passport.session())
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}))
app.use("/auth",authRoter);
app.use("/post",postRouter);
app.use("/user",userRouter);
app.use("/notification",notiRouter)



passport.serializeUser((user,cb)=>{
    cb (null,user);
})
passport.deserializeUser((user,cb)=>{
    cb (null,user);
})
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});