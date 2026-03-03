import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


//generate Token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};

export const register = async (req, res) => {
    try {
        //get input values
        const { name, email, password, contactNo, Gender, Country, Language } = req.body;

        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: "You already Register to the system" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            contactNo: contactNo,
            Gender: Gender,
            country: Country,
            prefferedLanguage: Language,

        });

        user.token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            contactNo: user.contactNo,
            Gender: user.Gender,
            country: user.country,
            prefferedLanguage: user.Language,
        })


    } catch (err) {
        res.status(500).json({ message: err.message })
    }
};

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        //find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Username or password" });
        }

        //check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Username or password" });
        }

        //create token
        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                contactNo: user.contactNo,
                Gender: user.Gender,
                country: user.country,
                language: user.prefferedLanguage
            }
        })


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getMe = async (req, res) => {
    res.json(req.user);
};

