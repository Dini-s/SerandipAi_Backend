import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true,
    },
    Gender: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    prefferedLanguage: {
        type: String,
        required: true
    },
    profileImgUrl: {
        url: String,
        public_id: String
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("User", userSchema);