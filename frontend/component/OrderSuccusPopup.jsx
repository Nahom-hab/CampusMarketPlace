import React from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Easing, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import tw from 'twrnc';

const OrderSuccessPopup = ({ visible, onClose }) => {
    const scaleValue = new Animated.Value(0);
    const opacityValue = new Animated.Value(0);
    const progressValue = new Animated.Value(0);

    React.useEffect(() => {
        if (visible) {
            // Reset animations
            scaleValue.setValue(0);
            opacityValue.setValue(0);
            progressValue.setValue(0);

            // Animate popup
            Animated.parallel([
                Animated.spring(scaleValue, {
                    toValue: 1,
                    useNativeDriver: true,
                    speed: 0.5,
                }),
                Animated.timing(opacityValue, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(progressValue, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ]).start();

            // Auto-close after 3 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal transparent animationType="none" visible={visible}>
            <View style={tw`flex-1 justify-center items-center bg-black/50 p-6`}>
                {/* Backdrop */}
                <Animated.View
                    style={[
                        tw`absolute inset-0 bg-black/50`,
                        { opacity: opacityValue }
                    ]}
                />

                {/* Popup Container */}
                <Animated.View
                    style={[
                        tw`bg-white rounded-xl p-6 w-full max-w-md`,
                        {
                            transform: [{ scale: scaleValue }],
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                        }
                    ]}
                >
                    {/* Close Button */}
                    <TouchableOpacity
                        style={tw`absolute top-3 right-3 p-1`}
                        onPress={onClose}
                    >
                        <Icon name="close" size={24} color="#888" />
                    </TouchableOpacity>

                    {/* Content */}
                    <View style={tw`items-center`}>
                        {/* Checkmark Animation */}
                        <Animated.View
                            style={[
                                tw`w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-4`,
                                {
                                    transform: [{
                                        scale: scaleValue.interpolate({
                                            inputRange: [0, 0.5, 1],
                                            outputRange: [0.8, 1.1, 1]
                                        })
                                    }]
                                }
                            ]}
                        >
                            <Icon name="check" size={40} color="white" />
                        </Animated.View>

                        <Text style={tw`text-2xl font-bold text-center mb-2`}>Order Successful!</Text>
                        <Text style={tw`text-gray-600 text-center mb-6`}>
                            Your order has been placed successfully
                        </Text>

                        {/* Progress Bar */}
                        <View style={tw`h-1 bg-gray-200 w-full rounded-full overflow-hidden mb-4`}>
                            <Animated.View
                                style={[
                                    tw`h-full bg-green-500`,
                                    {
                                        width: progressValue.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%']
                                        })
                                    }
                                ]}
                            />
                        </View>

                        <TouchableOpacity
                            style={tw`bg-green-600 px-6 py-3 rounded-lg w-full`}
                            onPress={onClose}
                        >
                            <Text style={tw`text-white text-center font-bold`}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default OrderSuccessPopup;