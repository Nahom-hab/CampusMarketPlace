// components/Cart.js
import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import tw from 'twrnc';
import useCartStore from '../zustand/useProduct';
import { useNavigation } from '@react-navigation/native';


const Cart = () => {
    const {
        cartProducts,
        loadCart,
        removeFromCart,
        updateQuantity,
    } = useCartStore();
    const navigation = useNavigation()

    // Load cart when component mounts
    useEffect(() => {
        loadCart();
    }, []);

    // Calculate cart totals
    const subtotal = cartProducts?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const shipping = 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(id, newQuantity);
    };

    return (
        <View style={tw`flex-1 bg-gray-100`}>
            {/* Scrollable content */}
            <ScrollView contentContainerStyle={tw`pb-40`}>
                <View style={tw`bg-white p-4 shadow-sm`}>
                    <Text style={tw`text-xl font-bold text-center`}>Your Cart</Text>
                </View>

                {cartProducts?.length > 0 ? (
                    <>
                        {cartProducts.map((item) => (
                            <View key={item._id} style={tw`bg-white m-2 p-4 rounded-lg shadow-sm`}>
                                <View style={tw`flex-row`}>
                                    <Image
                                        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                                        style={tw`w-20 h-20 rounded-lg`}
                                    />
                                    <View style={tw`ml-4 flex-1`}>
                                        <Text style={tw`text-lg font-medium`}>{item.title || item.name}</Text>
                                        <Text style={tw`text-gray-600`}>ETB{item.price}</Text>

                                        <View style={tw`flex-row items-center mt-2`}>
                                            <TouchableOpacity
                                                onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                style={tw`bg-gray-200 px-3 py-1 rounded-l-lg`}
                                            >
                                                <Text>-</Text>
                                            </TouchableOpacity>
                                            <Text style={tw`px-4`}>{item.quantity}</Text>
                                            <TouchableOpacity
                                                onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                style={tw`bg-gray-200 px-3 py-1 rounded-r-lg`}
                                            >
                                                <Text>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => removeFromCart(item.id)}
                                        style={tw`p-2`}
                                    >
                                        <Icon name="delete" size={20} color="red" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}

                        <View style={tw`bg-white m-2 p-4 rounded-lg shadow-sm`}>
                            <Text style={tw`text-lg font-bold mb-4`}>Order Summary</Text>

                            <View style={tw`flex-row justify-between mb-2`}>
                                <Text>Subtotal</Text>
                                <Text>ETB{subtotal.toFixed(2)}</Text>
                            </View>

                            <View style={tw`flex-row justify-between mb-2`}>
                                <Text>Shipping</Text>
                                <Text>ETB{shipping.toFixed(2)}</Text>
                            </View>

                            <View style={tw`flex-row justify-between mb-2`}>
                                <Text>Tax</Text>
                                <Text>ETB{tax.toFixed(2)}</Text>
                            </View>

                            <View style={tw`flex-row justify-between mt-4 pt-4 border-t border-gray-200`}>
                                <Text style={tw`font-bold`}>Total</Text>
                                <Text style={tw`font-bold`}>ETB{total.toFixed(2)}</Text>
                            </View>
                        </View>
                    </>
                ) : (
                    <View style={tw`flex-1 items-center justify-center p-8`}>
                        <Icon name="remove-shopping-cart" size={50} color="#ccc" />
                        <Text style={tw`text-lg text-gray-500 mt-4`}>Your cart is empty</Text>
                        <TouchableOpacity
                            style={tw`mt-4 bg-green-600 px-6 py-2 rounded-lg`}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={tw`text-white`}>Continue Shopping</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Fixed Checkout Button */}
            {cartProducts?.length > 0 && (
                <View style={tw`absolute bottom-14  left-0 right-0 bg-white p-4 border-t border-gray-200`}>
                    <TouchableOpacity
                        style={tw`bg-green-600 p-4 rounded-full shadow-md`}
                        onPress={() => navigation.navigate('Payment')}
                    >
                        <Text style={tw`text-white text-center font-bold`}>Proceed to Checkout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default Cart;