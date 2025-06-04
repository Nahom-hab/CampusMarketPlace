const User = require("../models/user.js");
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Otp = require("../models/otp.js");
const { transporter } = require("../config/transporter.config.js");
const crypto = require('crypto')
const { sendEmailOtp } = require("../config/sendOtp.js");
const uploadImageToCloudinary = require("../config/UploadToClaudinary.js");


const AUTH_google_github = async (req, res, next) => {
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


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
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

        // Return token in response body instead of cookie
        res.status(200).json({
            message: "Login successful",
            user: otherUserData,
            token // Send token in response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
const signout = (req, res, next) => {
    try {
        res.clearCookie("access_token", { path: "/", domain: "yourdomain.com" });
        res.status(200).json("User logged out");
    } catch (error) {
        next(error);
    }
};


const updateUserProfile = async (req, res) => {
    console.log(req.body)
    const { name, email, university, bio } = req.body;
    try {
        console.log(req.body)
        const user = await User.findById(req.params.id);
        // // Handle image if uploaded
        let imageUrl = '';
        if (req.file) {
            imageUrl = await uploadImageToCloudinary(req.file);
            // Implement this function or use a cloud service SDK
        }
        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.university = university || user.university;
            user.bio = bio || user.bio;
            user.image = imageUrl || user.image;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                university: updatedUser.university,
                bio: updatedUser.bio,
                image: updatedUser.image
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        console.error("editing user  error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Controller:
const signupUser = async (req, res) => {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    const { name, email, password, university } = req.body;

    try {
        // Validate required fields
        if (!name || !email || !password || !university) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Handle image if uploaded
        let imageUrl = '';
        if (req.file) {
            imageUrl = await uploadImageToCloudinary(req.file);
            // Implement this function or use a cloud service SDK
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // Create new user
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            university,
            profileImage: imageUrl || undefined
        });

        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        const { password: _, ...userData } = savedUser._doc;
        res.status(201).json({
            message: "User registered successfully",
            user: userData,
            token
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const sendOtp = async (req, res) => {
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
const verifyOtp = async (req, res) => {
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


const userExists = async (req, res, next) => {
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


const forgetPassowrd = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is require' });
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

const Resetpassword = async (req, res) => {
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


const userInfo = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching user info.' });
    }
}


const checkStatus = async (req, res) => {
    res.status(200).json(req.user);
}


module.exports = {
    AUTH_google_github,
    checkStatus,
    Resetpassword,
    verifyOtp,
    userExists,
    signupUser,
    signout,
    userInfo,
    loginUser,
    updateUserProfile,
    sendOtp,
    forgetPassowrd
}