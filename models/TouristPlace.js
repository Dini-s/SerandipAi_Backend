import mongoose from "mongoose";

const touristPlaceSchema = new mongoose.Schema({
    name: String,
    description: {
        type: String,
        required: true
    },
    category: String,
    province: String,
    images: [String],
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

touristPlaceSchema.index({ location: "2dsphere" });

export default mongoose.model("TouristPlace", touristPlaceSchema);