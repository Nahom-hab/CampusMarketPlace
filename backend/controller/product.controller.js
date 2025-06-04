const uploadImageToCloudinary = require("../config/UploadToClaudinary.js");
const Product = require("../models/product.js");

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, productCategory, tags, sellerId, discount, deliveryMethod, stock } = req.body;
        const { files } = req;

        // Validation: Check if all required fields are present
        if (!name || !description || !price || !productCategory || !sellerId || !files) {
            return res.status(400).json({ message: "All required fields are missing." });
        }

        // Handle file uploads
        const imageUrls = [];
        for (let file of files) {
            const url = await uploadImageToCloudinary(file);
            imageUrls.push(url);
        }

        // Create the product
        const product = new Product({
            name,
            description,
            price,
            sellerId,
            tags: tags ? tags : [],
            discount: discount || 0,
            productCategory,
            deliveryMethod: deliveryMethod || 'both',
            images: imageUrls,
            stock: stock || 0
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true })
            .populate("sellerId", '_id name image university email');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add review to product
const addComment = async (req, res) => {
    const { profile, name, comment, productId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        product.comments.push({
            profile,
            name,
            comment
        });


        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("sellerId", 'name image bio university email');
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get products by seller ID
const getProductsBySellerId = async (req, res) => {
    try {
        console.log(req.params.id);
        const products = await Product.find({ sellerId: req.params.id })
            .populate("sellerId", '_id image university bio name email');

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update product by ID
const updateProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        tags,
        productCategory,
        discount,
        deliveryMethod,
        stock,
        existingImages, // Array of existing image URLs to keep
        sellerId
    } = req.body;

    const { files } = req;

    try {
        // Validate product exists and belongs to the seller
        const product = await Product.findOne({
            _id: req.params.id,
            sellerId: sellerId
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found or unauthorized" });
        }

        // Update product fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.productCategory = productCategory || product.productCategory;
        product.deliveryMethod = deliveryMethod || product.deliveryMethod;
        product.discount = discount || product.discount;
        product.stock = stock || product.stock;
        product.tags = tags ? JSON.parse(tags) : product.tags;

        // Handle images
        const imageUrls = [];

        // 1. Keep existing images that weren't deleted
        const existingImagesToKeep = existingImages ? JSON.parse(existingImages) : product.images;
        imageUrls.push(...existingImagesToKeep);

        // 2. Upload new images if any
        if (files && files.length > 0) {
            for (let file of files) {
                const url = await uploadImageToCloudinary(file);
                imageUrls.push(url);
            }
        }

        // Validate we have at least one image
        if (imageUrls.length === 0) {
            return res.status(400).json({ error: "At least one image is required" });
        }

        product.images = imageUrls;
        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(400).json({
            error: error.message || "Failed to update product"
        });
    }
};

// Delete product by ID (soft delete)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Soft delete by setting isActive to false
        product.isActive = false;
        await product.save();

        res.status(200).json({ message: "Product deactivated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search products
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;

        const products = await Product.find({
            $and: [
                { isActive: true },
                {
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } },
                        { tags: { $in: [new RegExp(query, 'i')] } }
                    ]
                }
            ]
        }).populate("sellerId", '_id name email');

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    addComment,
    getProductById,
    getProductsBySellerId,
    updateProduct,
    deleteProduct,
    searchProducts
};