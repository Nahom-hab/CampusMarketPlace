import express from 'express';
import multer from 'multer'
import { getAllsellersForAdmin, getSellerAccountsForUser, getUserAccountsForSeller, UserGetMessages, UserSendMessage } from '../controller/messageUsers.controller.js';
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });
const router = express.Router();




router.post("/send-message", upload.single('image'), UserSendMessage);
router.get("/getMessages", UserGetMessages);
router.get('/getsellers/:id', getSellerAccountsForUser)
router.get('/getbuyers/:id', getUserAccountsForSeller)

router.get("/sellers", getAllsellersForAdmin);


export default router;
