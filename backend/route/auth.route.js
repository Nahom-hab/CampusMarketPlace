const express = require('express')
const { AUTH_google_github, checkStatus, forgetPassowrd, loginUser, Resetpassword, sendOtp, signout, signupUser, userExists, verifyOtp, userInfo, updateUserProfile } = require('../controller/auth.js')
const authenticateToken = require('../middelwere/IsUser.js')

const router = express.Router();

const multer = require('multer');

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
    storage
});


router.post('/google', AUTH_google_github);
router.post('/login', loginUser);
router.post('/signup', upload.single('image'), signupUser);
router.patch('/edit/:id', upload.single('image'), updateUserProfile);


router.get('/signout', signout)
router.post('/sendOtp', sendOtp)
router.get('/userInfo/:id', userInfo)
router.post('/VerifyOtp', verifyOtp)
router.post('/userExists', userExists)
router.post('/forgot-password', forgetPassowrd)
router.post('/reset-password/:token', Resetpassword)
router.get('/check-user-status', authenticateToken, checkStatus)



module.exports = router;
