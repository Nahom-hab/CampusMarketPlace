const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Seller ID is required']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%']
    },
    productCategory: {
        type: String,
        required: [true, 'Product category is required'],
        enum: {
            values: ['electronics', 'clothing', 'home', 'beauty', 'books', 'food', 'other'],
            message: 'Invalid product category'
        }
    },
    tags: {
        type: [String],
        default: []
    },
    images: [{
        type: String, // URL to the stored image
        required: true
    }],
    deliveryMethod: {
        type: String,
        enum: ['pickup', 'delivery', 'both'],
        default: 'both'
    },
    comments: [{
        profile: {
            type: String
        },
        name: {
            type: String
        },
        comment: {
            type: String
        }
    }],
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});



const Product = mongoose.model('Product', productSchema);

module.exports = Product;