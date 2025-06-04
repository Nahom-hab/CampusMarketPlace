const express = require('express');
const { deleteNotification, markAllAsRead, markAsRead, getUserNotifications } = require('../controller/notfication.controller');
const router = express.Router();
// const notificationController = require('../controllers/notificationController');
// const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/notifications
// @desc    Get all notifications for logged in user
// @access  Private
router.get('/', getUserNotifications);

// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
router.put('/:id/read', markAsRead);

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', markAllAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', deleteNotification);

module.exports = router;