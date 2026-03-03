// In your backend controller (touristActivityController.js or wherever trackActivity is defined)
import TouristActivity from "../models/TouristActivity.js";

export const trackActivity = async (req, res) => {
    try {
        const { touristPlaceId, action, language } = req.body;

        // Validate required fields
        if (!touristPlaceId || !action) {
            return res.status(400).json({
                success: false,
                message: "touristPlaceId and action are required"
            });
        }

        // Create activity record
        const activity = await TouristActivity.create({
            user: req.user?.id || req.user?._id, // Handle different user ID formats
            touristPlace: touristPlaceId,
            action,
            languageUsed: language || 'en',
            timestamp: new Date()
        });

        res.status(201).json({
            success: true,
            message: "Activity tracked successfully",
            data: activity
        });
    } catch (error) {
        console.error('Error tracking activity:', error);
        res.status(500).json({
            success: false,
            message: "Failed to track activity",
            error: error.message
        });
    }
};

// Get user's favorite activities
export const getUserFavorites = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        const favorites = await TouristActivity.find({
            user: userId,
            action: 'favorite'
        })
            .populate('touristPlace')
            .sort({ timestamp: -1 });

        res.status(200).json({
            success: true,
            data: favorites
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch favorites",
            error: error.message
        });
    }
};

// Remove favorite
export const removeFavorite = async (req, res) => {
    try {
        const { touristPlaceId } = req.params;
        const userId = req.user?.id || req.user?._id;

        await TouristActivity.findOneAndDelete({
            user: userId,
            touristPlace: touristPlaceId,
            action: 'favorite'
        });

        res.status(200).json({
            success: true,
            message: "Favorite removed successfully"
        });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({
            success: false,
            message: "Failed to remove favorite",
            error: error.message
        });
    }
};