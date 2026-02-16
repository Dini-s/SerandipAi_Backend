import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Coonect to MongoDB");
    } catch (err) {
        console.log("DB connecting issue occured " + err);
    }
}

export default connectDB;

