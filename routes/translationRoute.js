import express from "express";
import { translateText } from "../controllers/translationController.js";

const router = express.Router();

// Translate text
router.post("/", translateText);

export default router;