import express from "express";
import { gemini } from "../controller/gemini.controller.js";

const router=express.Router();

router.post("/bestlocation",gemini)

export default router;