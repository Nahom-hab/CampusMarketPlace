const Order = require('../models/order.js');
const Product = require('../models/product');
const UserMessage = require('../models/UserMessages');
const Account = require('../models/Account');
const uploadImageToCloudinary = require('../config/UploadToClaudinary.js');
// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { user_Id, phoneNumber, selectedBank, address, order } = req.body;
        // Handle image if uploaded
        let imageUrl = '';
        console.log(order)
        if (req.file) {
            imageUrl = await uploadImageToCloudinary(req.file);
            // Implement this function or use a cloud service SDK
        }
        // Validate order items
        if (!order || order.length === 0) {
            return res.status(400).json({ message: 'Order items are required' });
        }

        // Check product availability and calculate total price
        let totalAmount = 0;
        const orderItems = [];

        for (const item of JSON.parse(order)) {
            console.log(item.productId)
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productId}` });
            }

            // if (product.stock < item.amount) {
            //     return res.status(400).json({
            //         message: `Insufficient stock for product: ${product.name}`
            //     });
            // }

            // Calculate price after discount
            const priceAfterDiscount = product.price * (1 - (product.discount / 100));
            const itemTotal = priceAfterDiscount * item.amount;
            totalAmount += itemTotal;

            orderItems.push({
                productId: item.productId,
                amount: item.amount,
                price: priceAfterDiscount,
                sellerId: product.sellerId,
                product_status: 'pending'
            });
        }

        // Create the order
        const newOrder = new Order({
            user_Id,
            bankRecipt: imageUrl,
            phoneNumber,
            selectedBank,
            address,
            order: orderItems,
            order_status: 'pending'
        });

        await newOrder.save();

        // Send notification to sellers
        for (const item of orderItems) {
            await UserMessage.create({
                senderId: user_Id,
                reciverId: item.sellerId,
                message: `You have a new order for product ${item.productId}`,
                IsImg: false
            });
        }

        res.status(201).json({
            message: 'Order created successfully',
            order: newOrder,
            totalAmount
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ user_Id: userId })
            .populate('order.productId', 'name images price')
            .populate('order.sellerId', 'username');

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all orders for a seller
exports.getSellerOrders = async (req, res) => {
    try {
        const { sellerId } = req.params;

        // Find orders that have at least one item belonging to this seller
        const orders = await Order.find({
            'order.sellerId': sellerId
        })
            .populate('order.productId', 'name images price')
            .populate('user_Id', 'username');

        // Filter to only include items belonging to this seller
        const filteredOrders = orders.map(order => {
            const filteredItems = order.order.filter(item =>
                item.sellerId.toString() === sellerId
            );
            return {
                ...order.toObject(),
                order: filteredItems
            };
        });

        res.status(200).json(filteredOrders);
    } catch (error) {
        console.error('Error fetching seller orders:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update order status (admin/seller)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, itemId } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // If updating a specific item
        if (itemId) {
            const item = order.order.id(itemId);
            if (!item) {
                return res.status(404).json({ message: 'Order item not found' });
            }

            item.product_status = status;

            // If item is delivered, update product stock and seller account
            if (status === 'delivered') {
                // Update product stock
                const product = await Product.findById(item.productId);
                if (product) {
                    product.stock -= item.amount;
                    await product.save();
                }

                // Credit seller's account
                const sellerAccount = await Account.findOne({ userId: item.sellerId });
                if (sellerAccount) {
                    const amount = item.price * item.amount;
                    sellerAccount.balance += amount;
                    sellerAccount.accountHistory.push({
                        amount,
                        type: 'payment',
                        reference: `Order ${orderId}`,
                        balanceAfter: sellerAccount.balance
                    });
                    await sellerAccount.save();
                }
            }

            await order.save();

            // Notify buyer
            await UserMessage.create({
                senderId: item.sellerId,
                reciverId: order.user_Id,
                message: `Your order item status has been updated to ${status}`,
                IsImg: false
            });

            return res.status(200).json({
                message: 'Order item status updated successfully',
                order
            });
        }

        // Update entire order status
        if (!['pending', 'accepted'].includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        order.order_status = status;
        await order.save();

        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cancel an order item
exports.cancelOrderItem = async (req, res) => {
    try {
        const { orderId, itemId } = req.params;
        const { reason } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const item = order.order.id(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Order item not found' });
        }

        // Only allow cancellation if not already delivered
        if (item.product_status === 'delivered') {
            return res.status(400).json({ message: 'Delivered items cannot be cancelled' });
        }

        item.product_status = 'cancelled';
        await order.save();

        // Notify seller
        await UserMessage.create({
            senderId: order.user_Id,
            reciverId: item.sellerId,
            message: `Order item ${itemId} has been cancelled. Reason: ${reason || 'Not specified'}`,
            IsImg: false
        });

        res.status(200).json({
            message: 'Order item cancelled successfully',
            order
        });

    } catch (error) {
        console.error('Error cancelling order item:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate('order.productId', 'name images price discount')
            .populate('order.sellerId', 'username email')
            .populate('user_Id', 'username email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};