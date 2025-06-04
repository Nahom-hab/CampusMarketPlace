// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const multer = require('multer');
const { addComment, deleteProduct, updateProduct, getProductsBySellerId, getProductById, searchProducts, getProducts, createProduct } = require("../controller/product.controller");

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Product routes
router.post('/', upload.array('files', 5), createProduct);
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.get('/seller/:id', getProductsBySellerId);
router.put('/:id', upload.array('files', 5), updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/reviews', addComment);

module.exports = router;