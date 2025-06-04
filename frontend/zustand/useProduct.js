// stores/cartStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCartStore = create((set) => ({
    cartProducts: null,

    // Load cart from storage when app starts
    loadCart: async () => {
        const storedCart = await AsyncStorage.getItem('cartProducts');
        set({ cartProducts: storedCart ? JSON.parse(storedCart) : [] });
    },

    // Add to cart
    addToCart: async (product) => {
        set((state) => {
            const newCart = state.cartProducts ? [...state.cartProducts] : [];
            newCart.push(product);
            AsyncStorage.setItem('cartProducts', JSON.stringify(newCart));
            return { cartProducts: newCart };
        });
    },

    // Remove from cart
    removeFromCart: async (productId) => {
        set((state) => {
            if (!state.cartProducts) return state;
            const newCart = state.cartProducts.filter(item => item._id !== productId);
            AsyncStorage.setItem('cartProducts', JSON.stringify(newCart));
            return { cartProducts: newCart };
        });
    },

    // Clear cart
    clearCart: async () => {
        await AsyncStorage.removeItem('cartProducts');
        set({ cartProducts: [] });
    }
    , updateCartItem: (id, updates) =>
        set(state => ({
            cartProducts: state.cartProducts.map(item =>
                item.id === id ? { ...item, ...updates } : item
            )
        })),
}));

export default useCartStore;