const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reciverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    IsImg: {
        type: Boolean,
        required: true
    },
    caption: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    },
    ReplyMessageID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserMessage',
        default: null
    }
}, {
    timestamps: true
});

const UserMessage = mongoose.model('UserMessage', messageSchema);

module.exports = UserMessage;