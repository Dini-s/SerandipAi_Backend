import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const uploadProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
            i
        }
        if (!req.file) {
            return res.status(400).json({ message: "No file uploded" });
        }

        const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        if (user.profileImgUrl?.public_id) {
            await cloudinary.uploader.destroy(user.profileImgUrl.public_id);
        }

        const result = await cloudinary.uploader.upload(base64String, {
            folder: "touristAppProfiles"
        });

        user.profileImgUrl = {
            url: result.secure_url,
            public_id: result.public_id
        };

        await user.save();

        res.json({
            message: "Profile Impge Uploaded",
            profileImgUrl: user.profileImgUrl
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}