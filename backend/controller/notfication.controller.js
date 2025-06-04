const Notification = require('../models/Notification');
const Item = require('../models/Item');

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user._id
        })
            .sort({ createdAt: -1 })
            .populate('relatedUser', 'name avatar')
            .populate('relatedItem', 'title images');

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { $set: { read: true } },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Helper function to create notifications (used by other controllers)
exports.createNotification = async (userId, type, message, relatedItem = null, relatedUser = null) => {
    try {
        const notification = new Notification({
            user: userId,
            type,
            message,
            relatedItem,
            relatedUser
        });

        await notification.save();
        return notification;
    } catch (err) {
        console.error('Error creating notification:', err);
    }
};