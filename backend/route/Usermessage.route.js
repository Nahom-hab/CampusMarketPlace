const express = require('express');
const multer = require('multer');
const {
    getConversationPartners,
    UserGetMessages,
    UserSendMessage,
    MarkMessageAsRead
} = require('../controller/messageUsers.controller.js');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post("/send-message", upload.single('image'), UserSendMessage);
router.post("/get-messages", UserGetMessages);
router.patch("/mark-message/read/:id", MarkMessageAsRead);
router.get('/conversation-partners/:id', getConversationPartners);

module.exports = router;