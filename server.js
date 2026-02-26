import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import { authRoute } from "./routes/authRoute.js";
import { userRoute } from "./routes/userRoute.js";
import { touristRoute } from "./routes/touristPlaceRoute.js";
import { activityRoute } from "./routes/activityRoute.js";
import { translationRoute } from "./routes/translationRoute.js";


dotenv.config();

const app = express();

//middle ware handle cors
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-type", "Authorization"],
    })
);

//connect database
//connect database - only connect if not in test environment
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}
//middleware
app.use(express.json());

//define Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use("/api/touristPlace", touristRoute);
app.use("/api/activity", activityRoute);
app.use("/api/translate", translationRoute);

//start server
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;