const express = require('express');
const { signup, login, forgetPassowrd, Resetpassword, checkAdminStatus } = require('../controller/admin.controller.js')
const isAdmin = require('../middelwere/isAdmin.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgetPassowrd)
router.post('/reset-password/:token', Resetpassword)
router.get('/check-admin-status', isAdmin, checkAdminStatus)


module.exports = router;
