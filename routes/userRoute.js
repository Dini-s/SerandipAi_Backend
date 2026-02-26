import express from "express";
import { upload } from "../config/multer.js";
import verifyToken from "../middleware/authMiddleware.js";
import { uploadProfileImage } from "../middleware/userController.js";

const router = express.Router();

router.post(
    "/upload-profile",
    verifyToken,
    upload.single("image"),
    uploadProfileImage
)

export { router as userRoute };