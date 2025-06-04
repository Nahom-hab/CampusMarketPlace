const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'nahomhabtamu147@gmail.com',
        pass: 'mocn zyir mkaw vizr'
    }
});

module.exports = { transporter };