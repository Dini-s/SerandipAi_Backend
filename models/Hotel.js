import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    name: String,
    touristPlace: { type: mongoose.Schema.Types.ObjectId, ref: "TouristPlace" },
    contact: String,
    priceRange: String,
    location: {
        type: { type: String, enum: ["Point"] },
        coordinates: [Number]
    }
});

hotelSchema.index({ location: "2dsphere" });

export default mongoose.model("Hotel", hotelSchema);