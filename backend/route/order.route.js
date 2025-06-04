import express from "express";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    getOrderByUserId
} from '../controller/order.controller.js'
import multer from 'multer'
import { isAdmin } from "../middelwere/isAdmin.js";
const upload = multer();
const router = express.Router();

// Create a new order
router.post("/", upload.any(), createOrder);

// Get all orders
router.get("/", getAllOrders);

// Get a single order by ID
router.get("/:id", getOrderById);

// get orders by user ID
router.get("/user/:id", getOrderByUserId);


// Update an order by ID
router.put("/:id", isAdmin, updateOrder);

// Delete an order by ID
router.delete("/:id", isAdmin, deleteOrder);


export default router;
