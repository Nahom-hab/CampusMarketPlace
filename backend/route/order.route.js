const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller.js');
const multer = require('multer');

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
    storage
});
// Order routes
router.post('/create', upload.single('image'), orderController.createOrder);
router.get('/user/:userId', orderController.getUserOrders);
router.get('/seller/:sellerId', orderController.getSellerOrders);
router.get('/:orderId', orderController.getOrderById);
router.put('/:orderId/status', orderController.updateOrderStatus);
router.put('/:orderId/cancel/:itemId', orderController.cancelOrderItem);

module.exports = router;