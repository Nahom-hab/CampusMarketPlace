const cloudinary = require('cloudinary').v2;
// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dav0xprbp',
    api_key: '248274752835674',
    api_secret: '4h9yIvx3Z2K87R-JYX4cSmUAASo',
});

module.exports = cloudinary;
