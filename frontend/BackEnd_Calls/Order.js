import axios from 'axios';
import { backend_url } from './constants';

// Create an order
export const createOrder = async (data) => {
    const {
        user_Id,
        phoneNumber,
        selectedBank,
        address,
        order, // array of order items
        image // bank receipt image file
    } = data;

    const formData = new FormData();

    // Append basic fields
    formData.append('user_Id', user_Id);
    formData.append('phoneNumber', phoneNumber);
    formData.append('selectedBank', selectedBank);
    formData.append('address', address);
    formData.append('order', JSON.stringify(order));

    // Append image if exists
    if (image) {
        formData.append('image', {
            uri: image.uri,
            name: 'bank_receipt.jpg',
            type: 'image/jpeg'
        });
    }

    try {
        const response = await axios.post(`${backend_url}/api/order/create`, formData, {
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
        console.error('Error creating order:', error.response?.data || error.message);
        throw error;
    }
};

// Get all orders for a user
export const getUserOrders = async (userId) => {
    try {
        const response = await axios.get(`${backend_url}/api/order/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting user orders:', error.response?.data || error.message);
        throw error;
    }
};

// Get all orders for a seller
export const getSellerOrders = async (sellerId) => {
    try {
        const response = await axios.get(`${backend_url}/api/order/seller/${sellerId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting seller orders:', error.response?.data || error.message);
        throw error;
    }
};

// Get order by ID
export const getOrderById = async (orderId) => {
    try {
        const response = await axios.get(`${backend_url}/api/order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting order:', error.response?.data || error.message);
        throw error;
    }
};

// Update order status
export const updateOrderStatus = async (orderId, statusData) => {
    const { status, itemId } = statusData;

    try {
        const response = await axios.put(`${backend_url}/api/order/${orderId}/status`, {
            status,
            itemId
        });
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error.response?.data || error.message);
        throw error;
    }
};

// Cancel an order item
export const cancelOrderItem = async (orderId, itemId, reason) => {
    try {
        const response = await axios.put(`${backend_url}/api/order/${orderId}/cancel/${itemId}`, {
            reason
        });
        return response.data;
    } catch (error) {
        console.error('Error cancelling order item:', error.response?.data || error.message);
        throw error;
    }
};

// Additional utility functions

// Calculate order total (client-side calculation)
export const calculateOrderTotal = (orderItems) => {
    return orderItems.reduce((total, item) => {
        return total + (item.price * item.amount);
    }, 0);
};

// Format order date
export const formatOrderDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Get order status color for UI
export const getStatusColor = (status) => {
    switch (status) {
        case 'pending': return 'orange';
        case 'accepted': return 'green';
        case 'delivered': return 'blue';
        case 'cancelled': return 'red';
        default: return 'gray';
    }
};