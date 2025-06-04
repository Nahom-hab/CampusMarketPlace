import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUser = create((set) => ({
    user: null, // Initialize as null, we'll load in useEffect
    isLoading: true, // Add loading state
    products: [],


    // Load user from storage when store initializes
    loadUser: async () => {
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = userString ? JSON.parse(userString) : null;
            set({ user, isLoading: false });
        } catch (error) {
            console.error('Failed to load user:', error);
            set({ isLoading: false });
        }
    },
    setProducts: (products) => set({ products }),

    // Set or clear user
    setUser: async (user) => {
        try {
            if (user) {
                await AsyncStorage.setItem('user', JSON.stringify(user));
            } else {
                await AsyncStorage.removeItem('user');
            }
            set({ user });
        } catch (error) {
            console.error('Failed to save user:', error);
        }
    },


    // Clear user (logout)
    clearUser: async () => {
        try {
            await AsyncStorage.removeItem('user');
            set({ user: null });
        } catch (error) {
            console.error('Failed to clear user:', error);
        }
    }
}));

// Load user when store is created
useUser.getState().loadUser();

export default useUser;