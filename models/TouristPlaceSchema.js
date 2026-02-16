import mongoose from "mongoose";

const touristPlaceSchema = new mongoose.Schema({
    externalPlaceId: String,
    source: String,
    name: String,
    type: String,

    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: [Number]
    },
    rating: Number,
    images: [String]
});

touristPlaceSchema.index({ location: "2dsphere" });

export default mongoose.model("TouristPlace", touristPlaceSchema);