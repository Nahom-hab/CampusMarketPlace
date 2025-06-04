const mongoose = require("mongoose")


// Define a schema for order items
const OrderItemSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    product_status: {
        type: String,
        required: true,
        enum: ['pending', 'delivered', 'cancelled'],
        default: 'pending'
    },
    price: {
        type: Number,
        required: true
    }
    ,
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { _id: false });

// Define the main Order schema
const OrderSchema = mongoose.Schema({
    user_Id: {
        type: String,
    },
    bankRecipt: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    selectedBank: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    order: [OrderItemSchema],
    order_status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted']
    }
}, {
    timestamps: true
});

// Create the Order model
const Order = mongoose.model('Order', OrderSchema);


module.exports = Order

