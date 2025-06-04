import User from "../models/user.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Otp from "../models/otp.js";
import { transporter } from "../config/transporter.config.js";
import crypto from 'crypto'
import { sendEmailOtp } from "../config/sendOtp.js";
import uploadImageToCloudinary from "../config/UploadToClaudinary.js";


export const AUTH_google_github = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...otheruserdata } = user._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(otheruserdata);

        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const generatedUsername = req.body.name.split(' ').join('') + Math.random().toString(36).slice(-4);

            const newUser = new User({
                name: generatedUsername,
                password: hashedPassword,
                email: req.body.email,
                profile: req.body.profile,
                uid: req.body.uuid
            });

            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...otheruserdata } = savedUser._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(otheruserdata);
        }
    } catch (error) {
        console.error(error);
    }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = bcryptjs.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const { password: pass, ...otherUserData } = user._doc;

        res
            .cookie('access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
            .status(200)
            .json({ message: "Login successful", user: otherUserData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const signout = (req, res, next) => {
    try {
        res.clearCookie("access_token", { path: "/", domain: "yourdomain.com" });
        res.status(200).json("User logged out");
    } catch (error) {
        next(error);
    }
};




export const signupUser = async (req, res) => {
    const { name, email, password, university } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered" });
        }

        let url = "";

        if (req.file) {
            try {
                url = await uploadImageToCloudinary(req.file);
            } catch (error) {
                console.error("Error uploading image to Cloudinary:", error);
                return res.status(500).json({ error: "Failed to upload image" });
            }
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            university,
            prodile: url
        });

        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const { password: pass, ...otherUserData } = savedUser._doc;
        res
            .cookie("access_token", token, { httpOnly: true })
            .status(201)
            .json({ message: "User registered successfully", user: otherUserData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const sendOtp = async (req, res) => {
    const email = req.body.email;
    console.log(email);

    try {
        // Generate OTP
        const otp = Math.floor(10000 + Math.random() * 90000);
        const otpString = otp.toString();
        const hashedOtp = bcryptjs.hashSync(otpString, 10); // Hashing OTP

        sendEmailOtp(email, otpString); // Send OTP to user's email
        // Check if OTP already exists for the user
        const otpsent = await Otp.findOne({ email });
        if (otpsent) {
            await Otp.findByIdAndUpdate(
                otpsent._id,
                { otp: hashedOtp, email, verified: false },
                { new: true }
            );
        } else {
            const newOtp = new Otp({ otp: hashedOtp, email, verified: false });
            await newOtp.save();
        }

        res.status(200).json({ message: "OTP sent successfully." });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
};

// Verify OTP function
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const otpData = await Otp.findOne({ email });
        if (!otpData) return res.status(400).json({ message: "Invalid request" });

        // Compare hashed OTPs
        const isMatch = bcryptjs.compareSync(otp, otpData.otp);
        if (isMatch) {
            await Otp.findByIdAndUpdate(otpData._id, { verified: true });
            res.status(200).json({ otpVerified: true, message: "OTP verified successfully." });
        } else {
            res.status(400).json({ otpVerified: false, message: "Incorrect OTP. Try again." });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
};

export const userExists = async (req, res, next) => {
    const { email } = req.body;
    try {
        const userByEmail = await User.findOne({ email });

        if (userByEmail) {
            return res.json({ userExists: true, message: "User with this email already exists. You cannot sign up." });
        } else {
            return res.json({ userExists: false });
        }
    } catch (error) {
        console.error(error);
    }
};


export const forgetPassowrd = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a token
        const token = crypto.randomBytes(32).toString('hex');

        // Save the token to the user's record (you might also want to set an expiry date)
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Create the magic link
        const magicLink = `http://localhost:5173/reset-password/${token}`;

        // Send email using nodemailer


        const mailOptions = {
            from: "nahomhabtamu147@gmail.com",
            to: email,
            subject: 'Password Reset - Your App',
            text: `You requested a password reset. Click the link below to reset your password:\n\n${magicLink}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Magic link sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while sending the magic link.' });
    }
}

export const Resetpassword = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // Check if token is still valid
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = bcryptjs.hashSync(req.body.password, 10);
        user.password = hashedPassword
        user.save()
        res.status(200).json({ message: 'sucsusfully reseted password Now you can login' });

    } catch (error) {
        res.status(500).json({ message: 'An error occurred while validating the token.' });
    }
}



export const checkStatus = async (req, res) => {
    res.status(200).json(req.user);
}

