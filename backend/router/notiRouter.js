import express from "express";
import { authUser } from "../authUser/authUser.js";
import { getNoti ,unreadNoti,readNoti,deleteallNoti,deleteNoti} from "../controller/notiController.js";
const router=express.Router();
router.get("/get",authUser,getNoti)
router.get("/isread",authUser,unreadNoti)
router.post("/read",authUser,readNoti)
router.post("/deleteall",authUser,deleteallNoti)
router.delete("/delete/:id",authUser,deleteNoti)

export default router;