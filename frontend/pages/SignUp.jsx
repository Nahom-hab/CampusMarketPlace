import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Image, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { signup } from '../BackEnd_Calls/authentication';

const Signup = () => {
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        university: '',
    });

    const [image, setImage] = useState(null);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission denied to access photos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignup = async () => {
        console.log(formData)
        const user = await signup({ ...formData, image })
        console.log('signedUp user', user);
        navigation('HomeMain')

    };

    return (
        <ScrollView style={tw`bg-gray-50 mt-32 p-6`}>
            <View style={tw`items-center mb-6`}>
                <Text style={tw`text-3xl font-bold text-green-800 mb-2`}>CampusMarket</Text>
                <Text style={tw`text-xl text-gray-800 text-center`}>Create Account</Text>

            </View>

            <TouchableOpacity
                style={tw`items-center mb-6`}
                onPress={handlePickImage}
            >
                {image ? (
                    <Image source={{ uri: image }} style={tw`w-24 h-24 rounded-full`} />
                ) : (
                    <View style={tw`w-24 h-24 bg-gray-200 rounded-full justify-center items-center`}>
                        <Ionicons name="camera" size={30} color="#6B7280" />
                    </View>
                )}
                <Text style={tw`text-blue-600 mt-2`}>Upload Photo</Text>
            </TouchableOpacity>

            <TextInput
                placeholder="Full Name"
                value={formData.name}
                onChangeText={value => handleChange('name', value)}
                style={tw`bg-white p-3 rounded-lg mb-4 text-gray-800`}
            />

            <TextInput
                placeholder="Email"
                value={formData.email}
                keyboardType="email-address"
                onChangeText={value => handleChange('email', value)}
                style={tw`bg-white p-3 rounded-lg mb-4 text-gray-800`}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                value={formData.password}
                onChangeText={value => handleChange('password', value)}
                style={tw`bg-white p-3 rounded-lg mb-4 text-gray-800`}
            />

            <TextInput
                placeholder="University"
                value={formData.university}
                onChangeText={value => handleChange('university', value)}
                style={tw`bg-white p-3 rounded-lg mb-6 text-gray-800`}
            />

            <TouchableOpacity
                onPress={handleSignup}
                style={tw`bg-green-600 flex-row justify-center gap-2 py-2 rounded-full items-center mb-4`}
            >
                <Ionicons name="person-add" size={20} color="white" />
                <Text style={tw`text-white text-lg font-semibold`}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={tw`text-center text-gray-500`}>
                    Already have an account? <Text style={tw`text-blue-600`}>Log In</Text>
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Signup;
