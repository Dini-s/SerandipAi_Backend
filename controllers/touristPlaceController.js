import TouristPlace from "../models/TouristPlace.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const addTouristPlace = async (req, res) => {
    try {
        const { name, description, category, province, lat, lng } = req.body;

        // Upload images to Cloudinary
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "tourist_places",
                });
                imageUrls.push(result.secure_url);

                // Remove local file after upload
                fs.unlinkSync(file.path);
            }
        }

        const place = await TouristPlace.create({
            name,
            description,
            category,
            province,
            images: imageUrls,
            location: {
                type: "Point",
                coordinates: [parseFloat(lng), parseFloat(lat)],
            },
        });

        res.status(201).json(place);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

//retriew all tourist places
export const getAllTouristPlaces = async (req, res) => {
    try {
        const places = await TouristPlace.find().sort({ createdAt: -1 });
        res.json(places);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//retriew specific tourist place
export const getTouristPlaceById = async (req, res) => {
    try {
        const place = await TouristPlace.findById(req.params.id);

        if (!place)
            return res.status(404).json({ message: "Tourist place not found" });

        res.json(place);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//retriew nearby loactions
export const getNearbyPlaces = async (req, res) => {
    try {
        const { lat, lng } = req.query;

        const places = await TouristPlace.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 5000 // 5KM
                }
            }
        });

        res.json(places);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};