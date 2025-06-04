import Admin from '../models/admin.js';
import jwt from 'jsonwebtoken';
import { transporter } from "../config/transporter.config.js";
import crypto from 'crypto'
// Signup
export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if admin already exists
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Create new admin
        const admin = new Admin({ username, email, password });
        await admin.save();

        // Generate token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(201).json({
            message: "Admin created successfully",
            admin: { id: admin._id, username: admin.username, email: admin.email },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Compare passwords
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_ADMIN_SECRET, {
            expiresIn: '1d',
        });

        res.status(200).json({
            message: "Logged in successfully",
            admin: { id: admin._id, username: admin.username, email: admin.email },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const forgetPassowrd = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'admin not found' });
        }

        // Generate a token
        const token = crypto.randomBytes(32).toString('hex');

        // Save the token to the user's record (you might also want to set an expiry date)
        admin.resetPasswordToken = token;
        admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await admin.save();

        // Create the magic link
        const magicLink = `http://localhost:5173/admin/reset-password/${token}`;

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
        const admin = await Admin.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // Check if token is still valid
        });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid  or expired reset token' });
        }

        const hashedPassword = bcryptjs.hashSync(req.body.password, 10);
        admin.password = hashedPassword
        admin.save()
        res.status(200).json({ message: 'sucsusfully reseted password Now you can login' });

    } catch (error) {
        res.status(500).json({ message: 'An error occurred while validating the token.' });
    }
}




export const checkAdminStatus = async (req, res) => {
    res.status(200).json(req.admin);

}