import express from 'express';
import session from 'express-session';
import passport from 'passport';
import env from "dotenv"
import { v2 as cloudinary } from 'cloudinary';
import  cors from "cors"
 import path, { dirname } from "path";
import { fileURLToPath } from "url";



import authRoter from "./router/authRouter.js"
import postRouter from "./router/postRouter.js";
import userRouter from "./router/usersRouter.js"
import notiRouter from "./router/notiRouter.js"
const app=express();
const port=5000;
const __dirname = dirname(fileURLToPath(import.meta.url));
env.config();
   cloudinary.config({ 
        cloud_name:process.env.CLOUND_NAME, 
        api_key:process.env.CLOUN_API_KEY, 
        api_secret:process.env.CLOUND_API_SECRET
    });
const allowedOrigins = [
  'http://localhost:3000', // For local development
  process.env.FRONTEND_URL 
]
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
    
    origin: function (origin, callback) {
       
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use("/auth",authRoter);
app.use("/post",postRouter);
app.use("/user",userRouter);
app.use("/notification",notiRouter)
if(process.env.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname,"..","frontend","dist")));
    app.use((req,res)=>{

        res.sendFile(path.join(__dirname,"..","frontend","dist","index.html"))
    })
}


passport.serializeUser((user,cb)=>{
    cb (null,user);
})
passport.deserializeUser((user,cb)=>{
    cb (null,user);
})
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});