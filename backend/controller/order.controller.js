import uploadImageToCloudinary from "../config/UploadToClaudinary.js";
import Order from "../models/order.js";
import Product from "../models/product.js";

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { fullName, phoneNumber, selectedBank, address, totalPrice, order } = req.body;
        const receipt = req.files?.[0];

        if (!receipt) {
            return res.status(400).json({ message: "Bank receipt is required" });
        }

        const imageUrl = await uploadImageToCloudinary(receipt);
        const newOrder = new Order({
            fullName,
            phoneNumber,
            address, // Corrected field
            selectedBank,
            totalPrice,
            order: JSON.parse(order),
            bankRecipt: imageUrl,
            order_status: 'pending'
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getOrderById = async (req, res) => {
    try {
        // Find the order by ID and populate the product details in the order items
        const order = await Order.findById(req.params.id)
            .populate({
                path: 'order.productId', // Populate the productId field in the order items
                model: Product,          // Specify the model to populate from
                select: 'name price images description discount'     // Optionally select the fields you want to return from Product
            });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getOrderByUserId = async (req, res) => {
    try {
        // Find the order by ID and populate the product details in the order items
        const order = await Order.find({
            user_Id: req.params.id
        })
            .populate({
                path: 'order.productId', // Populate the productId field in the order items
                model: Product,          // Specify the model to populate from
                select: 'name price images description discount'     // Optionally select the fields you want to return from Product
            });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Update an order by ID
export const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { order_status } = req.body;

        if (!['pending', 'accepted', 'delivered', 'cancelled'].includes(order_status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const updatedOrder = await Order.findById(req.params.id);

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        updatedOrder.order_status = order_status;

        await updatedOrder.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an order by ID
export const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
