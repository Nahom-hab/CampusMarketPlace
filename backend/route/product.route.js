// routes/productRoutes.js
import express from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsBySellerId,
} from "../controller/product.controller.js";
import multer from 'multer'
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post("/", upload.array('images'), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.patch("/:id", upload.array('images'), updateProduct);
router.delete("/:id", deleteProduct);
router.get('/seller/:id', getProductsBySellerId)

export default router;
