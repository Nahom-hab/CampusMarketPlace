const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const ProductRoute = require('./route/product.route.js');
const adminRoute = require('./route/admin.route.js');
const OrderRoute = require('./route/order.route.js');
const authRouter = require('./route/auth.route.js');
const userMessageRoute = require('./route/Usermessage.route.js');

const app = express();
dotenv.config();
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, {
})
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log("MongoDB connection error:", error));



app.use(cors());
app.use(express.json());

app.use('/api/products', ProductRoute);
app.use('/api/admin', adminRoute);
app.use('/api/auth', authRouter);
app.use('/api/order', OrderRoute);
app.use('/api/message', userMessageRoute);

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/dist/index.html'));
});

// Global error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

// Start the server
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

// Initialize payment endpoint
app.post('/api/payment/initialize', async (req, res) => {
    try {
        const { amount, email, phone, first_name, last_name } = req.body;

        const response = await axios.post(
            'https://api.chapa.co/v1/transaction/initialize',
            {
                amount: amount,
                currency: 'ETB',
                email: email,
                first_name: first_name || 'Customer',
                last_name: last_name || 'Anonymous',
                phone_number: phone,
                tx_ref: `tx-${Date.now()}`,
                callback_url: `http://localhost:8000/api/payment/verify`,
                return_url: `http://localhost:5173/payment-success`,
                customization: {
                    title: 'Your Company Name',
                    description: 'Payment for your services'
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Payment initialization error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Payment initialization failed' });
    }
});

// Payment verification endpoint
app.get('/api/payment/verify/:id', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.chapa.co/v1/transaction/verify/${req.params.id}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`
                }
            }
        );

        // Here you should update your database with payment status
        console.log('Payment verified:', response.data);

        res.redirect(`${process.env.FRONTEND_URL}/payment-success?status=success`);
    } catch (error) {
        console.error('Payment verification error:', error.response?.data || error.message);
        res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }
});