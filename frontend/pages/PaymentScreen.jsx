import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import tw from 'twrnc';
import useCartStore from '../zustand/useProduct';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { createOrder } from '../BackEnd_Calls/Order';
import OrderSuccessPopup from '../component/OrderSuccusPopup';
import useUser from '../zustand/useUser';
import { Picker } from '@react-native-picker/picker';

const PaymentScreen = () => {
    const navigation = useNavigation();
    const { cartProducts, clearCart } = useCartStore();
    const [bankReceipt, setBankReceipt] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [address, setAddress] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [deliveryOption, setDeliveryOption] = useState('delivery');
    const [campusLocation, setCampusLocation] = useState('');
    const { user } = useUser();

    // Ethiopian banks and payment options
    const paymentOptions = [
        { id: 'telebirr', name: 'Telebirr' },
        { id: 'cbe', name: 'Commercial Bank of Ethiopia' },
        { id: 'awash', name: 'Awash Bank' },
        { id: 'dashen', name: 'Dashen Bank' },
        { id: 'abyssinia', name: 'Bank of Abyssinia' },
        { id: 'nib', name: 'NIB International Bank' },
        { id: 'abay', name: 'Abay Bank' },
        { id: 'lion', name: 'Lion International Bank' },
    ];

    // Campus locations
    const campusLocations = [
        '5 Kilo Campus',
        '6 Kilo Campus',
        'Sidist Kilo Campus',
        'Informatics Campus',
        'Technology Campus'
    ];

    // Calculate order total
    const subtotal = cartProducts?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const shipping = deliveryOption === 'pickup' ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Pick image from gallery
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'We need access to your photos to upload the receipt');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setBankReceipt(result.assets[0]);
        }
    };

    // Validate form
    const validateForm = () => {
        if (!phoneNumber) {
            Alert.alert('Error', 'Please enter your phone number');
            return false;
        }

        if (!selectedBank) {
            Alert.alert('Error', 'Please select a payment method');
            return false;
        }

        if (deliveryOption === 'delivery' && !address) {
            Alert.alert('Error', 'Please enter your delivery address');
            return false;
        }

        if (deliveryOption === 'campus' && !campusLocation) {
            Alert.alert('Error', 'Please select a campus location');
            return false;
        }

        if (!bankReceipt && selectedBank !== 'telebirr') {
            Alert.alert('Error', 'Please upload your payment receipt');
            return false;
        }

        return true;
    };

    // Handle order submission
    const handleSubmitOrder = async () => {
        if (!validateForm()) return;

        try {
            const orderItems = cartProducts.map(item => ({
                productId: item._id,
                amount: item.quantity,
                price: item.price
            }));

            const deliveryDetails = deliveryOption === 'campus'
                ? `Campus delivery: ${campusLocation}`
                : deliveryOption === 'pickup'
                    ? 'Store pickup'
                    : address;

            const orderData = {
                user_Id: user._id,
                phoneNumber,
                paymentMethod: selectedBank,
                deliveryMethod: deliveryOption,
                deliveryDetails,
                order: orderItems,
                image: bankReceipt,
                totalAmount: total.toFixed(2)
            };

            const response = await createOrder(orderData);

            setShowSuccess(true);
            clearCart();

            setTimeout(() => {
                setShowSuccess(false);
                navigation.navigate('SuccsussScreen', {
                    orderId: response.orderId,
                    total: total.toFixed(2),
                    deliveryDetails
                });
            }, 3000);

        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to place order. Please try again.');
            console.error('Order error:', error);
        }
    };

    return (
        <View style={tw`flex-1 pb-32 bg-gray-50`}>
            <ScrollView contentContainerStyle={tw`pb-30 p-4`}>
                {/* Header */}
                <View style={tw`mb-6`}>
                    <Text style={tw`text-2xl font-bold text-gray-800`}>Complete Your Order</Text>
                    <Text style={tw`text-gray-500`}>Review and confirm your purchase</Text>
                </View>

                {/* Order Summary Card */}
                <View style={tw`bg-white rounded-xl shadow-sm p-5 mb-5 border border-gray-100`}>
                    <View style={tw`flex-row justify-between items-center mb-4`}>
                        <Text style={tw`text-lg font-bold text-gray-800`}>Order Summary</Text>
                        <Text style={tw`text-blue-600`}>{cartProducts.length} items</Text>
                    </View>

                    {cartProducts.map((item) => (
                        <View key={item._id} style={tw`flex-row justify-between mb-3`}>
                            <View style={tw`flex-row items-center`}>
                                <View style={tw`w-10 h-10 bg-gray-100 rounded-md mr-3 overflow-hidden`}>
                                    {item.image && (
                                        <Image
                                            source={{ uri: item.images[0] }}
                                            style={tw`w-full h-full`}
                                            resizeMode="cover"
                                        />
                                    )}
                                </View>
                                <View>
                                    <Text style={tw`font-medium`}>{item.name}</Text>
                                    <Text style={tw`text-gray-500 text-xs`}>Qty: {item.quantity}</Text>
                                </View>
                            </View>
                            <Text style={tw`font-medium`}>ETB{(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}

                    <View style={tw`border-t border-gray-200 mt-4 pt-4`}>
                        <View style={tw`flex-row justify-between mb-2`}>
                            <Text style={tw`text-gray-600`}>Subtotal:</Text>
                            <Text style={tw`font-medium`}>ETB{subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={tw`flex-row justify-between mb-2`}>
                            <Text style={tw`text-gray-600`}>Shipping:</Text>
                            <Text style={tw`font-medium`}>
                                {shipping === 0 ? 'FREE' : `ETB${shipping.toFixed(2)}`}
                            </Text>
                        </View>
                        <View style={tw`flex-row justify-between mb-2`}>
                            <Text style={tw`text-gray-600`}>Tax (8%):</Text>
                            <Text style={tw`font-medium`}>ETB{tax.toFixed(2)}</Text>
                        </View>
                        <View style={tw`flex-row justify-between mt-3 pt-3 border-t border-gray-200`}>
                            <Text style={tw`text-lg font-bold text-gray-800`}>Total:</Text>
                            <Text style={tw`text-lg font-bold text-blue-600`}>ETB{total.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Delivery Options Card */}
                <View style={tw`bg-white rounded-xl shadow-sm p-5 mb-5 border border-gray-100`}>
                    <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Delivery Options</Text>

                    <View style={tw`mb-4`}>
                        <TouchableOpacity
                            style={tw`flex-row items-center mb-3 p-3 rounded-lg ${deliveryOption === 'delivery' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
                            onPress={() => setDeliveryOption('delivery')}
                        >
                            <View style={tw`w-6 h-6 rounded-full border-2 ${deliveryOption === 'delivery' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'} mr-3 justify-center items-center`}>
                                {deliveryOption === 'delivery' && <Icon name="check" size={16} color="white" />}
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`font-medium`}>Home Delivery</Text>
                                <Text style={tw`text-gray-500 text-xs`}>Delivered to your address (ETB 5.99)</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={tw`flex-row items-center mb-3 p-3 rounded-lg ${deliveryOption === 'campus' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
                            onPress={() => setDeliveryOption('campus')}
                        >
                            <View style={tw`w-6 h-6 rounded-full border-2 ${deliveryOption === 'campus' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'} mr-3 justify-center items-center`}>
                                {deliveryOption === 'campus' && <Icon name="check" size={16} color="white" />}
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`font-medium`}>Campus Delivery</Text>
                                <Text style={tw`text-gray-500 text-xs`}>Pick up at selected campus location</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={tw`flex-row items-center p-3 rounded-lg ${deliveryOption === 'pickup' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
                            onPress={() => setDeliveryOption('pickup')}
                        >
                            <View style={tw`w-6 h-6 rounded-full border-2 ${deliveryOption === 'pickup' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'} mr-3 justify-center items-center`}>
                                {deliveryOption === 'pickup' && <Icon name="check" size={16} color="white" />}
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`font-medium`}>Store Pickup</Text>
                                <Text style={tw`text-gray-500 text-xs`}>Pick up at our store (Free)</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {deliveryOption === 'delivery' && (
                        <>
                            <Text style={tw`text-gray-700 mb-2 font-medium`}>Delivery Address</Text>
                            <TextInput
                                style={tw`border border-gray-300 rounded-lg p-3 mb-4 bg-white`}
                                placeholder="Enter full delivery address"
                                value={address}
                                onChangeText={setAddress}
                                multiline
                                numberOfLines={3}
                            />
                        </>
                    )}

                    {deliveryOption === 'campus' && (
                        <>
                            <Text style={tw`text-gray-700 mb-2 font-medium`}>Select Campus Location</Text>
                            <View style={tw`border border-gray-300 rounded-lg mb-4 bg-white overflow-hidden`}>
                                <Picker
                                    selectedValue={campusLocation}
                                    onValueChange={(itemValue) => setCampusLocation(itemValue)}
                                    style={tw`text-gray-800`}
                                >
                                    <Picker.Item label="Select campus location" value="" />
                                    {campusLocations.map((location) => (
                                        <Picker.Item key={location} label={location} value={location} />
                                    ))}
                                </Picker>
                            </View>
                        </>
                    )}
                </View>

                {/* Payment Details Card */}
                <View style={tw`bg-white rounded-xl shadow-sm p-5 mb-5 border border-gray-100`}>
                    <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Payment Details</Text>

                    <Text style={tw`text-gray-700 mb-2 font-medium`}>Phone Number</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg p-3 mb-4 bg-white`}
                        placeholder="09XXXXXXXX"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                    />

                    <Text style={tw`text-gray-700 mb-2 font-medium`}>Payment Method</Text>
                    <View style={tw`border border-gray-300 rounded-lg mb-4 bg-white overflow-hidden`}>
                        <Picker
                            selectedValue={selectedBank}
                            onValueChange={(itemValue) => setSelectedBank(itemValue)}
                            style={tw`text-gray-800`}
                        >
                            <Picker.Item label="Select payment method" value="" />
                            {paymentOptions.map((bank) => (
                                <Picker.Item key={bank.id} label={bank.name} value={bank.id} />
                            ))}
                        </Picker>
                    </View>

                    {selectedBank === 'telebirr' && (
                        <View style={tw`bg-blue-50 p-3 rounded-lg mb-4`}>
                            <View style={tw`flex-row items-center mb-2`}>
                                <Icon name="info" size={18} color="#3b82f6" style={tw`mr-2`} />
                                <Text style={tw`text-blue-700 font-medium`}>Telebirr Payment Instructions</Text>
                            </View>
                            <Text style={tw`text-blue-600 text-sm`}>
                                1. Open Telebirr app{"\n"}
                                2. Send money to 0912345678{"\n"}
                                3. Enter amount: ETB{total.toFixed(2)}{"\n"}
                                4. Use your phone number as reference
                            </Text>
                        </View>
                    )}

                    {selectedBank && selectedBank !== 'telebirr' && (
                        <>
                            <Text style={tw`text-gray-700 mb-2 font-medium`}>Upload Payment Receipt</Text>
                            <TouchableOpacity
                                style={tw`border-2 border-dashed ${bankReceipt ? 'border-green-500 bg-green-50' : 'border-gray-400 bg-gray-50'} rounded-xl p-4 items-center mb-4`}
                                onPress={pickImage}
                            >
                                {bankReceipt ? (
                                    <View style={tw`w-full`}>
                                        <Image
                                            source={{ uri: bankReceipt.uri }}
                                            style={tw`w-full h-40 rounded-lg mb-2`}
                                            resizeMode="contain"
                                        />
                                        <Text style={tw`text-green-600 text-center`}>Receipt uploaded</Text>
                                    </View>
                                ) : (
                                    <>
                                        <Icon name="receipt" size={30} color="#888" />
                                        <Text style={tw`text-gray-500 mt-2 text-center`}>Upload your bank payment receipt</Text>
                                        <Text style={tw`text-gray-400 text-xs mt-1`}>Screenshot or photo of transaction</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <View style={tw`bg-yellow-50 p-3 rounded-lg border border-yellow-200`}>
                                <View style={tw`flex-row items-center mb-1`}>
                                    <Icon name="warning" size={18} color="#d97706" style={tw`mr-2`} />
                                    <Text style={tw`text-yellow-700 font-medium`}>Important</Text>
                                </View>
                                <Text style={tw`text-yellow-600 text-sm`}>
                                    Please make sure your payment receipt is clear and shows:
                                    {"\n"}- Transaction amount
                                    {"\n"}- Transaction reference
                                    {"\n"}- Date and time
                                </Text>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Fixed Submit Button */}
            <View style={tw`absolute bottom-20 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-lg`}>
                <TouchableOpacity
                    style={tw`bg-green-700 p-3 rounded-xl shadow-md flex-row justify-center items-center`}
                    onPress={handleSubmitOrder}
                    activeOpacity={0.9}
                >
                    <Icon name="check-circle" size={20} color="white" style={tw`mr-2`} />
                    <Text style={tw`text-white text-center font-bold text-lg`}>Confirm Order</Text>
                </TouchableOpacity>
            </View>

            {/* Success Popup */}
            <OrderSuccessPopup visible={showSuccess} onClose={() => setShowSuccess(false)} />
        </View>
    );
};

export default PaymentScreen;