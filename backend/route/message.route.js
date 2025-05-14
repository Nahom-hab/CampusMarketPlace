import express from 'express';
import { getAllsellersFromConversations, getMessages, getRecentMessages, sendMessage } from '../controller/message.controller.js';
import multer from 'multer'
import { isAdmin } from '../middelwere/isAdmin.js';
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });
const router = express.Router();




router.post("/send-message", upload.single('image'), sendMessage);
router.get("/getMessages/:sellerId", getMessages);
router.get("/users", getAllsellersFromConversations);
router.get('/recent', getRecentMessages)
// router.delete('/:id', deleteMessage)


export default router;
