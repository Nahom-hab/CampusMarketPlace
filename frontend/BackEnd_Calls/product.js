import axios from 'axios';
import { backend_url } from './constants';

// Create a product
export const createProduct = async (data) => {
    const {
        name,
        sellerId,
        description,
        price,
        discount,
        productCategory,
        tags,
        images, // array of image files
        deliveryMethod,
        stock
    } = data;
    console.log(data)

    const formData = new FormData();

    // Append basic fields
    formData.append('name', name);
    formData.append('sellerId', sellerId);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('discount', discount);
    formData.append('productCategory', productCategory);
    formData.append('deliveryMethod', deliveryMethod);
    formData.append('stock', stock);

    // Append arrays
    tags.forEach(tag => formData.append('tags[]', tag));

    // In createProduct function, modify the image handling:
    images.forEach((image, index) => {
        formData.append('files', {
            uri: image.uri,
            name: `image_${index}.jpg`,
            type: 'image/jpeg' // Explicitly set type
        });
    });

    try {
        const response = await axios.post(`${backend_url}/api/products`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            },
            transformRequest: (data, headers) => {
                // Don't stringify FormData
                return data;
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error.response?.data || error.message);
        throw error;
    }
};

// Get all products
export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${backend_url}/api/products`);
        return response.data;
    } catch (error) {
        console.error('Error getting products:', error.response?.data || error.message);
        throw error;
    }
};

// Get product by ID
export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${backend_url}/api/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting product:', error.response?.data || error.message);
        throw error;
    }
};

// Get products by seller ID
export const getProductsBySellerId = async (sellerId) => {
    try {
        const response = await axios.get(`${backend_url}/api/products/seller/${sellerId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting seller products:', error.response?.data || error.message);
        throw error;
    }
};

// Update a product
export const updateProduct = async (id, data) => {
    const {
        name,
        description,
        price,
        tags,
        productCategory,
        discount,
        deliveryMethod,
        stock,
        existingImages,
        sellerId,
        images // new image files
    } = data;

    const formData = new FormData();

    // Append basic fields
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('productCategory', productCategory);
    formData.append('discount', discount);
    formData.append('deliveryMethod', deliveryMethod);
    formData.append('stock', stock);
    formData.append('sellerId', sellerId);
    formData.append('existingImages', JSON.stringify(existingImages));

    // Append arrays
    tags.forEach(tag => formData.append('tags[]', tag));

    // Append new image files
    if (images && images.length > 0) {
        images.forEach((image, index) => {
            formData.append('files', image, `image_${index}.jpg`);
        });
    }

    try {
        const response = await axios.put(`${backend_url}/api/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error.response?.data || error.message);
        throw error;
    }
};

// Delete a product (soft delete)
export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${backend_url}/api/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error.response?.data || error.message);
        throw error;
    }
};

// Add comment to product
export const addComment = async (productId, commentData) => {
    try {
        const response = await axios.post(`${backend_url}/api/products/${productId}/comments`, commentData);
        return response.data;
    } catch (error) {
        console.error('Error adding comment:', error.response?.data || error.message);
        throw error;
    }
};