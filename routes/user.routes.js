import express from "express"
import { register,verify,login } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register",register);

router.get("/verify/:token",verify);

router.get("/login",login);

export default router;