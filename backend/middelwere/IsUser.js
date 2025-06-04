import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid Token' });
    }
};
