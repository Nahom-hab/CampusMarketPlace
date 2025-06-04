import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import useUser from '../../zustand/useUser';
import { backend_url } from '../../BackEnd_Calls/constants';
import { editUser } from '../../BackEnd_Calls/authentication';

const EditProfile = () => {
    const navigation = useNavigation();
    const { user, setUser } = useUser();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        university: user?.university || '',
        bio: user?.bio || '',
        image: user?.image || 'https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png'
    });
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = async () => {
        try {
            setImageLoading(true);
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                setFormData(prev => ({ ...prev, image: uri }));
            }
        } catch (error) {
            console.error('Image picker error:', error);
            setError('Failed to select image');
        } finally {
            setImageLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setError('');


            // const config = {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //         Authorization: `Bearer ${user.token}`,
            //     },
            // };
            console.log(`${backend_url}/api/auth/edit/${user._id}`)
            // const { data } = await axios.patch(
            //     `${backend_url}/api/auth/edit/${user._id}`,
            //     formDataToSend
            // );
            const data = await editUser(formData, user._id);

            setUser(data); // Update global state
            navigation.goBack();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.message ||
                'Something went wrong'
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView style={tw`bg-gray-50 mb-16`}>
            {/* Header */}
            <View style={tw`bg-white p-4 flex-row items-center justify-between border-b border-gray-200`}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={tw`text-xl font-bold`}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#16a34a" />
                    ) : (
                        <Text style={tw`text-green-600 font-medium`}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            {error && (
                <View style={tw`bg-red-100 p-3 mx-4 mt-4 rounded-lg`}>
                    <Text style={tw`text-red-600 text-center`}>{error}</Text>
                </View>
            )}

            {/* Profile Picture */}
            <View style={tw`items-center mt-6`}>
                <View style={tw`relative`}>
                    {imageLoading ? (
                        <View style={tw`w-32 h-32 rounded-full border-4 border-green-100 justify-center items-center`}>
                            <ActivityIndicator size="small" color="#16a34a" />
                        </View>
                    ) : (
                        <Image
                            source={{ uri: formData.image }}
                            style={tw`w-32 h-32 rounded-full border-4 border-green-100`}
                        />
                    )}
                    <TouchableOpacity
                        style={tw`absolute bottom-0 right-0 bg-green-500 rounded-full p-2`}
                        onPress={handleImageUpload}
                        disabled={imageLoading}
                    >
                        <MaterialIcons name="edit" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={tw`mt-2`}
                    onPress={handleImageUpload}
                    disabled={imageLoading}
                >
                    <Text style={tw`text-green-600 font-medium`}>
                        {imageLoading ? 'Uploading...' : 'Change Photo'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Edit Form */}
            <View style={tw`mt-6 bg-white p-5`}>
                {/* Name Field */}
                <View style={tw`mb-3`}>
                    <Text style={tw`text-gray-500 mb-1`}>Full Name</Text>
                    <View style={tw`border border-gray-200 rounded-lg p-3 py-1`}>
                        <TextInput
                            style={tw`text-gray-800`}
                            value={formData.name}
                            onChangeText={(text) => handleInputChange('name', text)}
                            placeholder="Enter your full name"
                        />
                    </View>
                </View>

                {/* Email Field */}
                <View style={tw`mb-3`}>
                    <Text style={tw`text-gray-500 mb-1`}>Email</Text>
                    <View style={tw`border border-gray-200 rounded-lg p-3 py-1`}>
                        <TextInput
                            style={tw`text-gray-800`}
                            value={formData.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                        />
                    </View>
                </View>

                {/* University Field */}
                <View style={tw`mb-3`}>
                    <Text style={tw`text-gray-500 mb-1`}>University</Text>
                    <View style={tw`border border-gray-200 rounded-lg p-3 py-1 flex-row items-center`}>
                        <Ionicons name="school" size={20} color="#3B82F6" style={tw`mr-2`} />
                        <TextInput
                            style={tw`flex-1 text-gray-800`}
                            value={formData.university}
                            onChangeText={(text) => handleInputChange('university', text)}
                            placeholder="Enter your university"
                        />
                    </View>
                </View>

                {/* Bio Field */}
                <View style={tw`mb-3`}>
                    <Text style={tw`text-gray-500 mb-1`}>Bio</Text>
                    <View style={tw`border border-gray-200 rounded-lg p-3 py-1 h-32`}>
                        <TextInput
                            style={tw`text-gray-800 flex-1`}
                            value={formData.bio}
                            onChangeText={(text) => handleInputChange('bio', text)}
                            placeholder="Tell others about yourself"
                            multiline
                            maxLength={200}
                        />
                    </View>
                    <Text style={tw`text-right text-xs text-gray-400 mt-1`}>
                        {formData.bio?.length || 0}/200 characters
                    </Text>
                </View>

                {/* Change Password */}
                <TouchableOpacity
                    style={tw`border-t border-gray-100 pt-4 mb-2`}
                    onPress={() => navigation.navigate('ChangePassword')}
                >
                    <Text style={tw`text-green-600 font-medium`}>Change Password</Text>
                </TouchableOpacity>
            </View>

            {/* Delete Account Option */}
            <View style={tw`mt-4 bg-white p-5`}>
                <TouchableOpacity
                    style={tw`flex-row items-center`}
                    onPress={() => console.log('Delete account pressed')}
                >
                    <MaterialIcons name="delete" size={24} color="#EF4444" />
                    <Text style={tw`ml-4 text-red-500`}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default EditProfile;