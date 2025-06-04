import express from "express";
import {
    registerCompany,
    loginCompany,
    logoutCompany,
    getCompanyProfile,
    updateCompanyProfile,
    deleteCompany,
    getAllCompanies,
    SellerExists,
} from "../controller/seller.controller.js";
import multer from "multer";
import { isSeller } from "../middelwere/isSeller.js";
import { isAdmin } from "../middelwere/isAdmin.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

// Public Routes
router.post(
    "/register",
    upload.fields([
        { name: "logo", maxCount: 1 },
        { name: "backImage", maxCount: 1 },
    ]),
    registerCompany
);
router.post("/login", loginCompany);

// isSellered Routes (Company)
router.get("/:id", getCompanyProfile);
router.patch(
    "/profile",
    isSeller,
    upload.fields([
        { name: "logo", maxCount: 1 },
        { name: "backImage", maxCount: 1 },
    ]),
    updateCompanyProfile
);
router.post("/logout", isSeller, logoutCompany);

// Admin-Only Routes
router.get("/", isAdmin, getAllCompanies);
router.post("/sellerExists", SellerExists);
router.delete("/:id", isAdmin, deleteCompany);

export default router;