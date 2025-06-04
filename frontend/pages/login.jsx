import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import logo from '../assets/logo.png'
import { login } from '../BackEnd_Calls/authentication';
import useUser from '../zustand/useUser';
const Login = ({ navigation, setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const { setUser } = useUser()
    const [password, setPassword] = useState('');
    const [isFocused, setIsFocused] = useState({
        email: false,
        password: false
    });

    const handleFocus = (field) => {
        setIsFocused({ ...isFocused, [field]: true });
    };

    const handleBlur = (field) => {

        setIsFocused({ ...isFocused, [field]: false });
    };

    const handleLogin = async () => {
        console.log('Login attempted with:', email, password);
        const result = await login(email, password)
        setUser(result.user)
        setIsLoggedIn(true);
    };

    return (
        <LinearGradient
            colors={['#ffffff', '#e6f5ec']} // light greenish-white background
            style={tw`flex-1`}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1 justify-center`}
            >
                <View style={tw`px-8`}>
                    {/* Header */}
                    <View style={tw`items-center mb-12`}>
                        <Image
                            source={logo}
                            style={[
                                tw`w-[70%]`,
                                {
                                    height: 70,
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12
                                }
                            ]}
                            resizeMode="cover"
                        />
                        <Text style={tw`text-green-600 mt-5 text-lg`}>Login to Your Account </Text>
                    </View>

                    {/* Email Input */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-green-700 mb-2 text-sm font-medium`}>EMAIL</Text>
                        <View style={tw`relative`}>
                            <TextInput
                                style={tw`bg-white border-b-2 ${isFocused.email ? 'border-green-600' : 'border-green-300'} text-green-900 p-3 rounded-t-lg`}
                                placeholder="your@email.com"
                                placeholderTextColor="#A0A0A0"
                                value={email}
                                onChangeText={setEmail}
                                onFocus={() => handleFocus('email')}
                                onBlur={() => handleBlur('email')}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={tw`mb-8`}>
                        <Text style={tw`text-green-700 mb-2 text-sm font-medium`}>PASSWORD</Text>
                        <View style={tw`relative`}>
                            <TextInput
                                style={tw`bg-white border-b-2 ${isFocused.password ? 'border-green-600' : 'border-green-300'} text-green-900 p-3 rounded-t-lg`}
                                placeholder="••••••••"
                                placeholderTextColor="#A0A0A0"
                                value={password}
                                onChangeText={setPassword}
                                onFocus={() => handleFocus('password')}
                                onBlur={() => handleBlur('password')}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        style={tw`bg-green-600 rounded-full py-2 mb-6 shadow-lg shadow-green-300`}
                    >
                        <Text style={tw`text-white text-center font-bold text-lg`}>Login</Text>
                    </TouchableOpacity>

                    {/* Footer Links */}
                    <View style={tw`flex-row justify-between`}>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={tw`text-green-600 text-sm`}>Create Account</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Forgetpassword')}>
                            <Text style={tw`text-green-600 text-sm`}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Decorative Elements */}
                    {/* <View style={tw`absolute -bottom-20 -right-20 w-40 h-40 bg-green-200 rounded-full opacity-20`} /> */}
                    <View style={tw`absolute -top-20 -left-20 w-60 h-60 bg-green-100 rounded-full opacity-20`} />
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

export default Login;
