// server/src/routes/shopRoutes.js
import express from "express";
import { getdistance, nerallstation } from "../controller/shopController.js";
// import { getNearbyShops, getRecommendedShop } from "../controller/shopController.js";

const router = express.Router();

router.get("/nearby", nerallstation);
router.post("/distance", getdistance);


export default router;
