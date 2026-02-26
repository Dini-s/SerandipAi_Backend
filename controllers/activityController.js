import TouristActivity from "../models/TouristActivity.js";

export const trackActivity = async (req, res) => {
    const { touristPlaceId, action, language } = req.body;

    await TouristActivity.create({
        user: req.user.id,
        touristPlace: touristPlaceId,
        action,
        languageUsed: language
    });

    res.json({ message: "Tracked" });
};