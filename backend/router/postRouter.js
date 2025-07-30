import express, { Router } from "express";
import { authUser } from "../authUser/authUser.js";
import { createPost,allpost,LikeUnlike,comment,removePost,followPost} from "../controller/postController.js";

const router = express.Router();
router.post("/create",authUser, createPost);
router.get("/allpost",authUser,allpost);
router.post("/like/:id",authUser,LikeUnlike);
router.post("/comment/:id",comment);
router.delete("/delete/:id",removePost);
router.get("/followPost",authUser,followPost)


export default router;