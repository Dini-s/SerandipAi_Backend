import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: String,
    touristPlace: { type: mongoose.Schema.Types.ObjectId, ref: "TouristPlace" },
    cuisineType: String,
    rating: Number
});

export default mongoose.model("Restaurant", restaurantSchema);