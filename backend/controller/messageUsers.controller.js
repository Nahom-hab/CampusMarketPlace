import uploadImageToCloudinary from "../config/UploadToClaudinary.js";
import Conversation from "../models/conversation.js";
import UserConversation from "../models/conversationUser.js";
import Company from "../models/Seller.js";
import UserMessage from "../models/UserMessages.js";


export const UserSendMessage = async (req, res) => {
    const { SenderIsSeller, caption, IsImg, sellerId, buyerId, message, ReplyMessageID } = req.body;
    console.log(req.body);

    if (!sellerId || !buyerId || (!message && !IsImg)) {
        return res.status(400).json({ error: "Invalid input data" });
    }

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
        const newMessage = new UserMessage({
            SenderIsSeller,
            sellerId,
            buyerId,
            message: req.file ? url : message,
            IsImg,
            caption: caption || '',
            ReplyMessageID
        });

        await newMessage.save();

        // Update or create conversation
        const conversation = await UserConversation.findOne({ sellerId, buyerId });
        if (conversation) {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        } else {
            const newConversation = new Conversation({
                sellerId,
                buyerId,
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


export const UserGetMessages = async (req, res) => {
    const { sellerId, buyerId } = req.bordy;
    console.log(sellerId);

    if (!sellerId || !buyerId) {
        return res.status(400).json({ error: "seller ID and Buyer ID is required" });
    }

    try {
        // Find the conversation for the seller
        const conversation = await UserConversation.findOne({ sellerId, buyerId })
            .populate({
                path: "messages",
                model: "UserMessage",
                select: "-__v",
            });

        // If no conversation exists, return an empty array
        if (!conversation) {
            return res.status(200).json([]);
        }

        res.status(200).json(conversation.messages);
    } catch (error) {
        console.error("Error retrieving messages:", error);
        res.status(500).json({ error: "Failed to retrieve messages" });
    }
};


export const getSellerAccountsForUser = async (req, res) => {
    try {
        const conversations = await UserConversation.find({ buyerId: req.params.id })
            .populate("sellerId", '_id name email logo');

        if (!conversations) {
            res.json({ message: 'no conversations yet for this user' })
        }
        res.status(200).json(conversations)

    } catch (err) {

    }
}


export const getUserAccountsForSeller = async (req, res) => {
    try {
        const conversations = await UserConversation.find({ sellerId: req.params.id })
            .populate("buyerId", '_id name email profile');

        if (!conversations) {
            res.json({ message: 'no conversations yet for this user' })
        }
        res.status(200).json(conversations)

    } catch (err) {

    }
}



export const getAllsellersForAdmin = async (req, res) => {
    try {

        const sellers = await Company.find();

        res.status(200).json(sellers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching sellers" });
    }
};


