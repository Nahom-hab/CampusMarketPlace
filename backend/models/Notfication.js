const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    user: {  // Recipient of the notification
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: [
            'new_message',
            'order_placed',
            'order_accepted',
            'order_rejected',
            'item_sold',
            'price_offer',
            'admin_alert'
        ]
    },
    message: {
        type: String,
        required: true
    },
    relatedItem: {  // Optional link to an item (e.g., for order/sale notifications)
        type: Schema.Types.ObjectId,
        ref: 'Item'
    },
    relatedUser: {  // Optional link to another user (e.g., message sender)
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for faster querying of user notifications
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);