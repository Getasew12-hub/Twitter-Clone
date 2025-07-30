import express from "express";
import { Login ,Signup,Logout,getAuth} from "../controller/authController.js";

const router=express.Router();
router.post("/login",Login);
router.post("/signup",Signup);
router.post("/logout",Logout);
router.get("/authuser",getAuth)

export default router;