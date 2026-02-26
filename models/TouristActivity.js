import mongoose from "mongoose";

const touristActivitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    touristPlace: { type: mongoose.Schema.Types.ObjectId, ref: "TouristPlace" },
    action: {
        type: String,
        enum: ["viewed", "clicked_hotel", "language_changed"]
    },
    languageUsed: String
}, { timestamps: true });

export default mongoose.model("TouristActivity", touristActivitySchema);