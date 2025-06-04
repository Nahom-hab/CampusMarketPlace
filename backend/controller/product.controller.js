import uploadImageToCloudinary from "../config/UploadToClaudinary.js";
import Product from "../models/product.js";

// ✅ Create a new product
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            productCategory,
            tags,
            sellerId,
            discount
        } = req.body;

        const { files } = req;

        if (!name || !description || !price || !productCategory || !sellerId || !files || files.length === 0) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const parsedTags = tags ? JSON.parse(tags) : [];

        const imageUrls = [];
        for (let file of files) {
            const url = await uploadImageToCloudinary(file);
            imageUrls.push(url);
        }

        const product = new Product({
            name,
            description,
            price,
            sellerId,
            tags: parsedTags,
            discount,
            productCategory,
            images: imageUrls
        });

        await product.save();

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get products by seller ID
export const getProductsBySellerId = async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.params.id });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Add view count

// ✅ Update a product
export const updateProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        tags,
        productCategory,
        discount,
        existingImages,
        sellerId
    } = req.body;

    const { files } = req;

    try {
        const product = await Product.findOne({
            _id: req.params.id,
            sellerId
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found or unauthorized" });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.productCategory = productCategory || product.productCategory;
        product.discount = discount || 0;
        product.tags = tags ? JSON.parse(tags) : [];

        const imageUrls = [];

        const existing = existingImages ? JSON.parse(existingImages) : [];
        imageUrls.push(...existing);

        if (files && files.length > 0) {
            for (let file of files) {
                const url = await uploadImageToCloudinary(file);
                imageUrls.push(url);
            }
        }

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
        res.status(400).json({ error: error.message });
    }
};

// ✅ Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🔍 Search products (stub)
export const searchProducts = async (req, res) => {
    res.status(200).json({ message: "Search functionality coming soon!" });
};
