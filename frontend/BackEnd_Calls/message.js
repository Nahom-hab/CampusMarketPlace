import axios from 'axios';
import { backend_url } from './constants';

// Send a message (text or image)
export const sendMessage = async (data) => {
    const {
        senderId,
        reciverId,
        caption,
        IsImg,
        message,
        ReplyMessageID,
        image // optional image file
    } = data;

    const formData = new FormData();

    formData.append('senderId', senderId);
    formData.append('reciverId', reciverId);
    formData.append('caption', caption || '');
    formData.append('IsImg', IsImg);
    formData.append('message', message);
    formData.append('ReplyMessageID', ReplyMessageID || '');

    if (image) {
        formData.append('image', {
            uri: image.uri,
            name: `image_${Date.now()}.jpg`,
            type: 'image/jpeg'
        });
    }

    try {
        const response = await axios.post(
            `${backend_url}/api/message/send-message`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
        throw error;
    }
};

// Get messages between two users
export const getMessages = async (senderId, reciverId) => {
    try {
        const response = await axios.post(
            `${backend_url}/api/message/get-messages`,
            { senderId, reciverId }
        );
        return response.data;
    } catch (error) {
        console.error('Error getting messages:', error.response?.data || error.message);
        throw error;
    }
};

// Get all conversation partners for a user
export const getConversationPartners = async (userId) => {
    try {
        const response = await axios.get(
            `${backend_url}/api/message/conversation-partners/${userId}`
        );
        return response.data;
    } catch (error) {
        console.error('Error getting conversation partners:', error.response?.data || error.message);
        throw error;
    }
};