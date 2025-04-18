import express from "express"
import { register,verify,login,getProfile } from "../controllers/user.controller.js";
import isLoggedIn from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/register",register);

router.get("/verify/:token",verify);

router.post("/login",login);

router.get("/profile",isLoggedIn,getProfile);

export default router;