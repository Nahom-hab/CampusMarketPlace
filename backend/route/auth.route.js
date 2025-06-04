import express from 'express';
import { AUTH_google_github, checkStatus, forgetPassowrd, loginUser, Resetpassword, sendOtp, signout, signupUser, userExists, verifyOtp } from '../controller/auth.js';
import { authenticateToken } from '../middelwere/IsUser.js';

const router = express.Router();
import multer from 'multer'

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/google', AUTH_google_github);
router.post('/login', loginUser);
router.post('/signup', upload.single('image'), signupUser);
router.get('/signout', signout)
router.post('/sendOtp', sendOtp)
router.post('/VerifyOtp', verifyOtp)
router.post('/userExists', userExists)
router.post('/forgot-password', forgetPassowrd)
router.post('/reset-password/:token', Resetpassword)
router.get('/check-user-status', authenticateToken, checkStatus)



export default router;
