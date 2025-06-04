import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (file) => {
    if (!file || !file.buffer) {
        throw new Error('Invalid file: Missing buffer or file content');
    }

    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) {
                        reject(new Error(`Cloudinary Error: ${error.message}`));
                    } else {
                        resolve(result);
                    }
                }
            );

            // Send the file buffer to Cloudinary
            uploadStream.end(file.buffer);
        });

        if (process.env.DEBUG === 'true') {
            console.log('Uploaded Image URL:', result.secure_url);
        }

        return result.secure_url; // Return the URL of the uploaded image
    } catch (error) {
        throw new Error(`Error uploading image to Cloudinary: ${error.message}`);
    }
};

export default uploadImageToCloudinary;
