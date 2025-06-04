import { backend_url } from "./constants";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const signup = async (data) => {
    const formData = new FormData();

    // Append all fields
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'image' && value?.uri) {
            formData.append('image', {
                uri: value.uri,
                name: 'profile.jpg',
                type: 'image/jpeg'
            });
        } else if (value !== null && value !== undefined) {
            formData.append(key, value);
        }
    });

    try {
        const response = await axios.post(`${backend_url}/api/auth/signup`, formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: (data, headers) => {
                // Special handling for React Native FormData
                return formData;
            },
        });

        const result = response.data;

        if (result.token) {
            await AsyncStorage.setItem('authToken', result.token);
            await AsyncStorage.setItem('userData', JSON.stringify(result.user));
        }

        return result;
    } catch (error) {
        console.error('Signup error:', {
            message: error.message,
            response: error.response?.data,
            request: error.request,
        });

        // Throw a more informative error
        const errorMessage = error.response?.data?.message ||
            error.message ||
            'Signup failed';
        throw new Error(errorMessage);
    }
};

export const getAuthToken = async () => {
    return await AsyncStorage.getItem('authToken');
};

export const getUserData = async () => {
    const data = await AsyncStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
};

export const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
};

export const login = async (email, password) => {
    try {
        const response = await fetch(`${backend_url}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Login failed');
        }

        if (result.token) {
            // Store the token and user data securely
            await AsyncStorage.setItem('authToken', result.token);
        }

        return result;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};


export const editUser = async (formdata, userId) => {
    try {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formdata.name);
        formDataToSend.append('email', formdata.email);
        formDataToSend.append('university', formdata.university);
        formDataToSend.append('bio', formdata.bio);

        // Handle image upload (React Native specific format)
        if (formdata.image && formdata.image.startsWith('file://')) {
            formDataToSend.append('image', {
                uri: formdata.image,      // Local file URI
                type: 'image/jpeg',      // MIME type
                name: 'profile.jpg',     // Filename
            });
        }

        const response = await fetch(`${backend_url}/api/auth/edit/${userId}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                // No 'Content-Type' header - let React Native set it automatically
                // No Authorization token as per your requirement
            },
            body: formDataToSend,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update user');
        }

        return await response.json();
    } catch (error) {
        console.error('Edit user error:', error);
        throw error; // Re-throw for handling in the calling component
    }
};

// Add these to your existing auth service functions
export const isLoggedIn = async () => {
    const token = await AsyncStorage.getItem('authToken');
    return token !== null;
};

export const getCurrentUser = async () => {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};

export const GetUserInfo = async (id) => {

    try {
        const response = await axios.get(`${backend_url}/api/auth/userInfo/${id}`);
        const result = response.data;
        console.log('user info :', result);
        return result
    } catch (error) {
        console.error('Error:', error);
    }

} 