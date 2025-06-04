import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uploadImageToCloudinary from "../config/UploadToClaudinary.js";
import Company from "../models/Seller.js";

// Utility: Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// [1] REGISTER a new company (with logo/backImage upload)
export const registerCompany = async (req, res) => {
    try {
        const { name, email, password, phone, businessType, description, address } =
            req.body;
        const { files } = req;

        // Validation
        if (!name || !email || !password || !phone || !businessType) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        // Check if company exists
        const exists = await Company.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "Company already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload images
        let logoUrl = "";
        let backImageUrl = "";

        if (files?.logo) {
            logoUrl = await uploadImageToCloudinary(files.logo[0]);
        }
        if (files?.backImage) {
            backImageUrl = await uploadImageToCloudinary(files.backImage[0]);
        }

        // Create company
        const company = await Company.create({
            name,
            email,
            password: hashedPassword,
            phone,
            businessType,
            description,
            address,
            logo: logoUrl,
            backImage: backImageUrl,
        });

        // Generate JWT
        const token = generateToken(company._id);

        res.status(201).json({
            _id: company._id,
            name: company.name,
            email: company.email,
            logo: company.logo,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [2] LOGIN company
export const loginCompany = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find company
        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(401).json({ message: "Account with this email dont exist" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = generateToken(company._id);


        res
            .cookie('access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
            .status(200)
            .json({
                _id: company._id,
                name: company.name,
                email: company.email,
                logo: company.logo,
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [3] LOGOUT (optional - client-side JWT invalidation)
export const logoutCompany = async (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
};

// [4] GET COMPANY PROFILE (protected)
export const getCompanyProfile = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id).select("-password");
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// [5] UPDATE COMPANY PROFILE (protected)
export const updateCompanyProfile = async (req, res) => {
    try {
        const { files } = req;
        const updates = req.body;

        // Handle password update
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        // Handle image uploads
        if (files?.logo) {
            updates.logo = await uploadImageToCloudinary(files.logo[0]);
        }
        if (files?.backImage) {
            updates.backImage = await uploadImageToCloudinary(files.backImage[0]);
        }

        const company = await Company.findByIdAndUpdate(
            req.company._id,
            updates,
            { new: true }
        ).select("-password");

        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [6] DELETE COMPANY (admin only)
export const deleteCompany = async (req, res) => {
    try {
        await Company.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [7] GET ALL COMPANIES (admin only)
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().select("-password");
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const SellerExists = async (req, res, next) => {
    const { email } = req.body;
    try {
        const sellerByEmail = await Company.findOne({ email });

        if (sellerByEmail) {
            return res.json({ userExists: true, message: "Seller with this email already exists. You cannot sign up." });
        } else {
            return res.json({ userExists: false });
        }
    } catch (error) {
        console.error(error);
    }
};
