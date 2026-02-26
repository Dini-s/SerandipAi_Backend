import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";
import { addTouristPlace, getAllTouristPlaces, getNearbyPlaces, getTouristPlaceById } from "../controllers/touristPlaceController.js";

const router = express.Router();

router.post("/AddNew", verifyToken, upload.array("images", 5), addTouristPlace);
router.get("/", getAllTouristPlaces);
router.get("/nearby", getNearbyPlaces);
router.get("/:id", getTouristPlaceById);


export { router as touristRoute };