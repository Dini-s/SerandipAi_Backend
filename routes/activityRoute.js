import express from "express";
import { getUserFavorites, removeFavorite, trackActivity } from "../controllers/activityController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Track user activity
router.post("/", verifyToken, trackActivity);
router.get('/favorites', verifyToken, getUserFavorites);
router.delete('/favorites/:touristPlaceId', verifyToken, removeFavorite);


export { router as activityRoute };