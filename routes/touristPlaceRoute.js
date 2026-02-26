import express from "express";
import verifyToken from "../middleware/authMiddleware";
import { upload } from "../config/multer";
import { getAllTouristPlaces, getNearbyPlaces, getTouristPlaceById } from "../controllers/touristPlaceController";

const router = express.Router();

router.post("/AddNew", verifyToken, upload.array("images", 5), addNewPlace);
router.get("/", getAllTouristPlaces);
router.get("/nearby", getNearbyPlaces);
router.get("/:id", getTouristPlaceById);


export { router as touristRoute };