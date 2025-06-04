import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';

export const isAdmin = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

        // Find the admin by decoded ID
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        req.admin = admin;  // Store admin info in the request object
        next();  // Pass control to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
