import express from "express";
import { trackActivity } from "../controllers/activityController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Track user activity
router.post("/", verifyToken, trackActivity);


export { router as activityRoute };