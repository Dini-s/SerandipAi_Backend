import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TouristPlace"
    },
    action: String,
    languageUsed: String

}, { timestamps: true });

export default mongoose.model("UserActivityLog", activitySchema);