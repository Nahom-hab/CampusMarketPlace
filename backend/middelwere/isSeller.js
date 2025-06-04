import jwt from 'jsonwebtoken';
import Company from '../models/Seller.js';

export const isSeller = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SELLER_SECRET);

        // Find the seller by decoded ID
        const seller = await Company.findById(decoded.id);
        if (!seller) {
            return res.status(404).json({ message: "seller not found" });
        }

        req.seller = seller;  // Store seller info in the request object
        next();  // Pass control to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
