import express from 'express';
import { signup, login, forgetPassowrd, Resetpassword, checkAdminStatus } from '../controller/admin.controller.js'
import { isAdmin } from '../middelwere/isAdmin.js';

const router = express.Router();

router.post('/signup', signup);          // Signup route
router.post('/login', login);            // Login route
router.post('/forgot-password', forgetPassowrd)
router.post('/reset-password/:token', Resetpassword)
router.get('/check-admin-status', isAdmin, checkAdminStatus)



export default router;
