import TouristPlace from "../models/TouristPlace.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const addTouristPlace = async (req, res) => {
    try {
        const { name, description, category, province, lat, lng } = req.body;

        // Debug: Log received values
        console.log('Received data:', { name, description, category, province, lat, lng });
        console.log('Types:', {
            latType: typeof lat,
            lngType: typeof lng,
            latValue: lat,
            lngValue: lng
        });

        // Validate required fields
        if (!name || !description || !category || !province || !lat || !lng) {
            return res.status(400).json({
                message: 'Missing required fields. Please provide name, description, category, province, lat, and lng.'
            });
        }

        // Convert coordinates to numbers safely
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        // Validate coordinates are valid numbers
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                message: 'Invalid coordinates. Please provide valid numbers for lat and lng.',
                received: { lat, lng }
            });
        }

        // Validate coordinate ranges (Sri Lanka bounds)
        if (latitude < 5.8 || latitude > 9.9 || longitude < 79.5 || longitude > 82.0) {
            return res.status(400).json({
                message: 'Coordinates outside Sri Lanka bounds. Please check your values.',
                bounds: { lat: '5.8 to 9.9', lng: '79.5 to 82.0' }
            });
        }

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

        // Create place with proper GeoJSON format
        const placeData = {
            name,
            description,
            category,
            province,
            images: imageUrls,
            location: {
                type: "Point",
                coordinates: [longitude, latitude] // IMPORTANT: [lng, lat] order!
            }
        };

        console.log('Creating place with data:', JSON.stringify(placeData, null, 2));

        const place = await TouristPlace.create(placeData);

        res.status(201).json({
            success: true,
            message: 'Tourist place added successfully',
            data: place
        });

    } catch (error) {
        console.error('Error adding tourist place:', error);

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation failed',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Retrieve all tourist places
export const getAllTouristPlaces = async (req, res) => {
    try {
        const places = await TouristPlace.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: places.length,
            data: places
        });
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Retrieve specific tourist place
export const getTouristPlaceById = async (req, res) => {
    try {
        const place = await TouristPlace.findById(req.params.id);

        if (!place) {
            return res.status(404).json({
                success: false,
                message: "Tourist place not found"
            });
        }

        res.json({
            success: true,
            data: place
        });
    } catch (error) {
        console.error('Error fetching place:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Retrieve nearby locations
export const getNearbyPlaces = async (req, res) => {
    try {
        const { lat, lng, distance = 5000 } = req.query;

        // Validate coordinates
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                message: 'Invalid coordinates. Please provide valid lat and lng.'
            });
        }

        const places = await TouristPlace.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: parseInt(distance) // Distance in meters
                }
            }
        });

        res.json({
            success: true,
            count: places.length,
            data: places
        });

    } catch (error) {
        console.error('Error finding nearby places:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};