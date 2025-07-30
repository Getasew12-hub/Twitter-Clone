import express from "express";
import { suggestUser,followUnfollow,profile,editprofile,userPost,userLike,editimg,folllowId} from "../controller/userController.js";
import { authUser } from "../authUser/authUser.js";
const router=express.Router();
router.get("/sugget",authUser,suggestUser);
router.post("/follow/:id",authUser,followUnfollow);
router.get("/profile/:id",authUser,profile);
router.post("/editprofile",authUser,editprofile)
router.post("/editimg",authUser,editimg)
router.get("/userPost/:id",authUser,userPost)
router.get("/userLike/:id",authUser,userLike)
router.get("/folllowId",authUser,folllowId)
export default router;