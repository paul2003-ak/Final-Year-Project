import express from "express";
import { registerUser, loginUser, GoogleLogIn } from "../controller/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", GoogleLogIn);

export default router;
