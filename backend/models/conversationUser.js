const mongoose = require("mongoose");

const UserconversationSchema = mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserMessage',
        required: true,
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserMessage'
    },
    unreadCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Add hook to update latest message and unread count
UserconversationSchema.pre('save', function (next) {
    if (this.isModified('messages')) {
        this.latestMessage = this.messages[this.messages.length - 1];
    }
    next();
});

const UserConversation = mongoose.model('UserConversation', UserconversationSchema);

module.exports = UserConversation;