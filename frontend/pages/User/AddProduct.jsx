import React, { useState } from 'react';
import {
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    TextInput as RNTextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Text, Button, Chip, Menu, Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import tw from 'twrnc';
import { createProduct } from '../../BackEnd_Calls/product';
import useUser from '../../zustand/useUser';

const AddProduct = ({ navigation }) => {
    // Form state
    const [name, setName] = useState('');
    const { user } = useUser()
    const sellerId = user._id
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('both');
    const [stock, setStock] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [images, setImages] = useState([]);


    // Constants
    const CATEGORIES = [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Clothing', value: 'clothing' },
        { label: 'Home', value: 'home' },
        { label: 'Beauty', value: 'beauty' },
        { label: 'Food', value: 'food' },
        { label: 'Other', value: 'other' },
    ];

    const DELIVERY_METHODS = [
        { label: 'Both Delivery & Pickup', value: 'both' },
        { label: 'Delivery Only', value: 'delivery' },
        { label: 'Pickup Only', value: 'pickup' },
    ];

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'We need camera roll permissions to upload images');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
            selectionLimit: 5 - images.length // Limit to 5 images total
        });

        if (!result.canceled && result.assets) {
            const newImages = result.assets.map(asset => ({ uri: asset.uri }));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
            setTags([...tags, trimmedTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async () => {
        // Validation
        if (!name || !description || !price || !productCategory || images.length === 0) {
            Alert.alert('Missing Fields', 'Please fill in all required fields and add at least one image.');
            return;
        }

        if (parseFloat(price) <= 0) {
            Alert.alert('Invalid Price', 'Price must be greater than 0');
            return;
        }

        if (discount && (parseFloat(discount) < 0 || parseFloat(discount) > 100)) {
            Alert.alert('Invalid Discount', 'Discount must be between 0 and 100');
            return;
        }

        const productData = {
            name,
            sellerId,
            description,
            price: parseFloat(price),
            discount: discount ? parseFloat(discount) : 0,
            productCategory,
            deliveryMethod,
            stock: stock ? parseInt(stock) : 0,
            tags,
            images
        };

        try {
            const data = await createProduct(productData);
            console.log('Product data to submit:', productData);
            Alert.alert('Success', 'Product created successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Error creating product:', error);
            Alert.alert('Error', error.message || 'Failed to create product');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={tw`flex-1 bg-gray-50`}
        >
            <ScrollView contentContainerStyle={tw`p-5 pb-10`}>
                <Text style={tw`text-2xl font-bold mb-6 text-gray-800`}>Add New Product</Text>

                {/* Product Name */}
                <View style={tw`mb-5`}>
                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Product Name *</Text>
                    <RNTextInput
                        style={tw`bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        placeholder="Enter product name"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Description */}
                <View style={tw`mb-5`}>
                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Description *</Text>
                    <RNTextInput
                        style={tw`bg-white border border-gray-300 rounded-lg px-4 py-3 h-32 text-gray-800`}
                        placeholder="Describe your product in detail"
                        multiline
                        numberOfLines={5}
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                {/* Price and Discount */}
                <View style={tw`flex-row mb-5`}>
                    <View style={tw`flex-1 mr-2`}>
                        <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Price ($) *</Text>
                        <RNTextInput
                            style={tw`bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                            placeholder="0.00"
                            keyboardType="decimal-pad"
                            value={price}
                            onChangeText={setPrice}
                        />
                    </View>
                    <View style={tw`flex-1 ml-2`}>
                        <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Discount (%)</Text>
                        <RNTextInput
                            style={tw`bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                            placeholder="0"
                            keyboardType="decimal-pad"
                            value={discount}
                            onChangeText={setDiscount}
                        />
                    </View>
                </View>

                {/* Stock */}
                <View style={tw`mb-5`}>
                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Stock Quantity</Text>
                    <RNTextInput
                        style={tw`bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        placeholder="Leave empty if unlimited"
                        keyboardType="numeric"
                        value={stock}
                        onChangeText={setStock}
                    />
                </View>

                {/* Category Selector */}
                <View style={tw`mb-5`}>
                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Category *</Text>
                    <View style={tw`bg-white border border-gray-300 rounded-lg overflow-hidden`}>
                        <Picker
                            selectedValue={productCategory}
                            onValueChange={(itemValue) => setProductCategory(itemValue)}
                            style={tw`text-gray-800`}
                            dropdownIconColor="#6b7280"
                        >
                            <Picker.Item label="Select a category" value="" />
                            {CATEGORIES.map((category) => (
                                <Picker.Item
                                    key={category.value}
                                    label={category.label}
                                    value={category.value}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Delivery Method Selector */}
                <View style={tw`mb-5`}>
                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Delivery Method</Text>
                    <View style={tw`bg-white border border-gray-300 rounded-lg overflow-hidden`}>
                        <Picker
                            selectedValue={deliveryMethod}
                            onValueChange={(itemValue) => setDeliveryMethod(itemValue)}
                            style={tw`text-gray-800`}
                            dropdownIconColor="#6b7280"
                        >
                            {DELIVERY_METHODS.map((method) => (
                                <Picker.Item
                                    key={method.value}
                                    label={method.label}
                                    value={method.value}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Tags Input */}
                <View style={tw`mb-5`}>
                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Tags (Max 5)</Text>
                    <View style={tw`flex-row items-center`}>
                        <RNTextInput
                            style={tw`flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                            placeholder="Add tag (press enter)"
                            value={tagInput}
                            onChangeText={setTagInput}
                            onSubmitEditing={handleAddTag}
                            returnKeyType="done"
                        />
                        <TouchableOpacity
                            onPress={handleAddTag}
                            style={tw`ml-2 bg-green-600 px-4 py-3 rounded-lg`}
                            disabled={!tagInput.trim()}
                        >
                            <Text style={tw`text-white font-medium`}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tag Chips */}
                    {tags.length > 0 && (
                        <View style={tw`flex-row flex-wrap mt-2`}>
                            {tags.map(tag => (
                                <View key={tag} style={tw`bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center`}>
                                    <Text style={tw`text-blue-800 text-sm mr-1`}>{tag}</Text>
                                    <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                                        <Text style={tw`text-blue-800 font-bold`}>×</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Image Upload */}
                <View style={tw`mb-6`}>
                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Images *</Text>
                    <Text style={tw`text-xs text-gray-500 mb-2`}>Upload at least one image (max 5)</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-2`}>
                        <View style={tw`flex-row`}>
                            {images.map((img, index) => (
                                <View key={index} style={tw`relative mr-2`}>
                                    <Image
                                        source={{ uri: img.uri }}
                                        style={tw`w-24 h-24 rounded-lg`}
                                    />
                                    <TouchableOpacity
                                        onPress={() => handleRemoveImage(index)}
                                        style={tw`absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center`}
                                    >
                                        <Text style={tw`text-white font-bold`}>×</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {images.length < 5 && (
                                <TouchableOpacity
                                    onPress={handlePickImage}
                                    style={tw`w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg justify-center items-center bg-gray-50`}
                                >
                                    <Text style={tw`text-gray-400 text-4xl`}>+</Text>
                                    <Text style={tw`text-gray-400 text-xs mt-1`}>Add Image</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>
                </View>

                {/* Submit Button */}
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={tw`bg-green-600 mb-10 py-2 rounded-lg`}
                    labelStyle={tw`text-white font-medium`}
                >
                    Create Product
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddProduct;