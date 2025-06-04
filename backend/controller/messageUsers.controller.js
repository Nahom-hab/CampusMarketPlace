const uploadImageToCloudinary = require("../config/UploadToClaudinary.js");
const UserConversation = require("../models/conversationUser.js");
const UserMessage = require("../models/UserMessages.js");

const UserSendMessage = async (req, res) => {
    const { caption, IsImg, senderId, reciverId, message, ReplyMessageID } = req.body;

    if (!senderId || !reciverId || (!message && !IsImg)) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    const participants = [senderId, reciverId].sort();
    let url = "";

    if (req.file) {
        try {
            url = await uploadImageToCloudinary(req.file);
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return res.status(500).json({ error: "Failed to upload image" });
        }
    }

    try {
        // Create and save the new message 
        let newMessage = {};
        if (req.body.isProduct) {
            newMessage = new UserMessage({
                senderId,
                reciverId,
                message: message,
                IsImg: true,
                isRead: false,
                caption: caption || '',
                // ReplyMessageID 
            });
        } else {
            newMessage = new UserMessage({
                senderId,
                reciverId,
                message: req.file ? url : message,
                IsImg,
                isRead: false,
                caption: caption || '',
                // ReplyMessageID
            });
        }

        await newMessage.save();

        // Update or create conversation using participants array
        const conversation = await UserConversation.findOne({
            participants: { $all: participants }
        });

        if (conversation) {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        } else {
            const newConversation = new UserConversation({
                participants,
                messages: [newMessage._id],
            });
            await newConversation.save();
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error saving new message or updating conversation:", error);
        res.status(500).json({ error: "Failed to save message or update conversation" });
    }
};

const UserGetMessages = async (req, res) => {
    const { senderId, reciverId } = req.body;
    if (!senderId || !reciverId) {
        return res.status(400).json({ error: "Both sender and receiver IDs are required" });
    }

    const participants = [senderId, reciverId].sort();

    try {
        const conversation = await UserConversation.findOne({
            participants: { $all: participants }
        }).populate({
            path: "messages",
            model: "UserMessage",
            select: "-__v",
        });

        if (!conversation) {
            return res.status(200).json([]);
        }

        res.status(200).json(conversation.messages);
    } catch (error) {
        console.error("Error retrieving messages:", error);
        res.status(500).json({ error: "Failed to retrieve messages" });
    }
};

const getConversationPartners = async (req, res) => {
    try {
        const userId = req.params.id;

        const conversations = await UserConversation.find({
            participants: userId
        })
            .populate({
                path: 'participants',
                match: { _id: { $ne: userId } },
                select: '_id name email image bio university'
            })
            .populate({
                path: 'latestMessage',
                select: 'message senderId reciverId IsImg caption isRead createdAt'
            });

        if (!conversations || conversations.length === 0) {
            return res.status(200).json([]);
        }

        // Extract and format the conversation partners with last message
        const partners = conversations.map(conv => {
            const partner = conv.participants.find(p => p && p._id.toString() !== userId);
            if (!partner) return null;

            const lastMessage = conv.latestMessage ? {
                _id: conv.latestMessage._id,
                message: conv.latestMessage.message,
                isImage: conv.latestMessage.IsImg,
                caption: conv.latestMessage.caption,
                isRead: conv.latestMessage.isRead,
                senderId: conv.latestMessage.senderId,
                receiverId: conv.latestMessage.reciverId,
                createdAt: conv.latestMessage.createdAt
            } : null;

            return {
                _id: partner._id,
                name: partner.name,
                university: partner.university,
                email: partner.email,
                image: partner.image,
                bio: partner.bio,
                conversationId: conv._id,
                lastMessage: lastMessage,
                unreadCount: conv.unreadCount || 0
            };
        }).filter(Boolean);

        res.status(200).json(partners);
    } catch (err) {
        console.error("Error getting conversation partners:", err);
        res.status(500).json({ error: "Failed to get conversation partners" });
    }
};
const MarkMessageAsRead = async (req, res) => {
    try {
        const message = await UserMessage.findById(req.params.id)
        if (!message) {
            res.status(404).json({ massage: 'message not found' })
        }
        message.isRead = true
        message.readAt = new Date()
        const newmessage = await message.save()
        res.status(200).json(newmessage)
    } catch (err) {
        console.error("Error marking message as read:", err);
        res.status(500).json({ error: "Failed to mark message as read:" });
    }
}

module.exports = {
    getConversationPartners,
    UserGetMessages,
    MarkMessageAsRead,
    UserSendMessage
};
