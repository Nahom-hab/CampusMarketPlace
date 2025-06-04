import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Keyboard,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator,
    Alert
} from 'react-native';
import tw from 'twrnc';
import { Ionicons, MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import EmojiPicker from 'rn-emoji-keyboard';
import useUser from '../zustand/useUser';
import { getMessages, sendMessage } from '../BackEnd_Calls/message';

const ChatScreen = ({ route, navigation }) => {
    const { user } = useUser();
    const { partnerId, partnerName, partnerAvatar, conversationId, university } = route.params;

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageCaption, setImageCaption] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const scrollViewRef = useRef();
    const textInputRef = useRef();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoadingMessages(true);
                const fetchedMessages = await getMessages(user._id, partnerId);

                if (JSON.stringify(fetchedMessages) !== JSON.stringify(messages)) {
                    setMessages(fetchedMessages);
                }
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 15000);

        return () => clearInterval(interval);
    }, [user._id, partnerId]);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to upload images!');
                }
            }
        })();
    }, []);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' && !imagePreview) return;

        try {
            setIsUploading(true);

            const messageData = {
                senderId: user._id,
                reciverId: partnerId,
                caption: imageCaption,
                IsImg: !!imagePreview,
                message: imagePreview ? '' : newMessage,
                ReplyMessageID: null
            };

            const response = await sendMessage({
                ...messageData,
                image: imagePreview || null
            });

            setMessages(prev => [...prev, {
                _id: response._id,
                senderId: user._id,
                reciverId: partnerId,
                message: response.message,
                IsImg: response.IsImg,
                caption: response.caption,
                createdAt: new Date().toISOString(),
                isRead: false,
                replyTo: replyingTo ? {
                    _id: replyingTo._id,
                    message: replyingTo.message,
                    IsImg: replyingTo.IsImg,
                    senderId: replyingTo.senderId
                } : null
            }]);

            setNewMessage('');
            setImagePreview(null);
            setImageCaption('');
            setReplyingTo(null);
            setShowEmojiPicker(false);
            Keyboard.dismiss();

        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message');
        } finally {
            setIsUploading(false);
        }
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });

            if (!result.canceled) {
                setImagePreview(result.assets[0]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleEmojiPick = (emoji) => {
        setNewMessage(prev => prev + emoji.emoji);
    };

    const handleReply = (message) => {
        setReplyingTo(message);
        textInputRef.current?.focus();
    };

    const cancelReply = () => {
        setReplyingTo(null);
    };

    useEffect(() => {
        navigation.setOptions({
            title: partnerName,
            headerRight: () => (
                <View style={tw`flex-row items-center`}>
                    <TouchableOpacity style={tw`mr-4`}>
                        <Ionicons name="call" size={22} color="#15803d" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24} color="#15803d" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, partnerName]);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    if (loadingMessages) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
                <ActivityIndicator size="large" color="#15803d" />
                <Text style={tw`mt-4 text-gray-600`}>Loading messages...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={tw`flex-1 bg-gray-50`}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
        ><View style={tw`bg-white flex-row items-center py-3 px-4 shadow-md`}>
                <TouchableOpacity
                    style={tw`p-1 mr-2   active:bg-indigo-700`}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={22} color="#000000" />
                </TouchableOpacity>

                <Image
                    source={{ uri: partnerAvatar }}
                    style={tw`w-12 h-12 rounded-full border-2 border-white shadow-sm`}
                    resizeMode="cover"
                />

                <View style={tw`flex-1 ml-3`}>
                    <Text style={tw`text-black font-semibold text-sm`}>{partnerName}</Text>
                    <Text style={tw`text-black text-xs`}>{university}</Text>
                </View>
            </View>
            <ScrollView
                ref={scrollViewRef}
                style={tw`flex-1 p-4`}
                contentContainerStyle={tw`pb-2`}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map((message) => {
                    const isMe = message.senderId === user._id;
                    const messageTime = new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return (
                        <View
                            key={message._id}
                            style={[
                                tw`mb-3 max-w-3/4`,
                                isMe ? tw`self-end` : tw`self-start`,
                            ]}
                        >
                            {/* Reply preview */}
                            {message.replyTo && (
                                <View style={[
                                    tw`p-2 mb-1 rounded-t-lg border-l-4`,
                                    isMe ? tw`border-l-green-700 bg-green-100` : tw`border-l-gray-400 bg-gray-100`
                                ]}>
                                    <Text style={tw`text-xs text-gray-500`}>
                                        Replying to {message.replyTo.senderId === user._id ? 'yourself' : partnerName}
                                    </Text>
                                    <Text
                                        style={tw`text-xs mt-1 ${isMe ? 'text-gray-700' : 'text-gray-600'}`}
                                        numberOfLines={1}
                                    >
                                        {message.replyTo.IsImg ? '📷 Image' : message.replyTo.message}
                                    </Text>
                                </View>
                            )}

                            <TouchableOpacity
                                onLongPress={() => handleReply(message)}
                                activeOpacity={0.8}
                            >
                                <View
                                    style={[
                                        tw`rounded-lg p-3`,
                                        isMe
                                            ? tw`bg-green-700 rounded-br-none`
                                            : tw`bg-white rounded-bl-none border border-gray-200`,
                                    ]}
                                >
                                    {message.IsImg ? (
                                        <View>
                                            <Image
                                                source={{ uri: message.message }}
                                                style={tw`w-64 h-48 rounded-lg mb-2`}
                                                resizeMode="cover"
                                            />
                                            {message.caption && (
                                                <Text style={tw`text-sm ${isMe ? 'text-white' : 'text-gray-800'}`}>
                                                    {message.caption}
                                                </Text>
                                            )}
                                        </View>
                                    ) : (
                                        <Text style={tw`text-sm ${isMe ? 'text-white' : 'text-gray-800'}`}>
                                            {message.message}
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                            <View
                                style={[
                                    tw`mt-1 flex-row items-center`,
                                    isMe ? tw`justify-end` : tw`justify-start`,
                                ]}
                            >
                                <Text style={tw`text-xs text-gray-500 mr-1`}>{messageTime}</Text>
                                {isMe && (
                                    <Ionicons
                                        name={message.isRead ? 'checkmark-done' : 'checkmark'}
                                        size={14}
                                        color={message.isRead ? '#15803d' : '#9ca3af'}
                                    />
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            {/* Image preview before sending */}
            {imagePreview && (
                <View style={tw`bg-gray-100 p-3 border-t border-gray-200`}>
                    <View style={tw`flex-row items-center bg-white rounded-lg p-2 border border-gray-300`}>
                        <Image
                            source={{ uri: imagePreview.uri }}
                            style={tw`w-16 h-16 rounded-lg`}
                            resizeMode="cover"
                        />
                        <TextInput
                            style={tw`flex-1 ml-3 bg-gray-50 rounded-lg px-3 py-2`}
                            placeholder="Add a caption..."
                            value={imageCaption}
                            onChangeText={setImageCaption}
                        />
                        <TouchableOpacity
                            onPress={() => setImagePreview(null)}
                            style={tw`ml-2 p-2`}
                        >
                            <Ionicons name="close" size={20} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Reply preview */}
            {replyingTo && (
                <View style={tw`bg-gray-100 p-3 border-t border-gray-200 flex-row justify-between items-center`}>
                    <View style={tw`flex-1`}>
                        <Text style={tw`text-xs text-gray-500`}>
                            Replying to {replyingTo.senderId === user._id ? 'yourself' : partnerName}
                        </Text>
                        <Text
                            style={tw`text-sm text-gray-700 mt-1`}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {replyingTo.IsImg ? '📷 Image' : replyingTo.message}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={cancelReply} style={tw`p-2`}>
                        <Ionicons name="close" size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Input area */}
            <View style={tw`bg-gray-200 mb-16 border-t border-gray-200 p-3`}>
                <View style={tw`flex-row items-center`}>
                    <TouchableOpacity
                        onPress={() => setShowEmojiPicker(true)}
                        style={tw`p-2 mr-1`}
                    >
                        <FontAwesome name="smile-o" size={24} color="#6b7280" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={pickImage}
                        style={tw`p-2 mr-1`}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <ActivityIndicator size="small" color="#6b7280" />
                        ) : (
                            <Entypo name="attachment" size={24} color="#6b7280" />
                        )}
                    </TouchableOpacity>

                    <TextInput
                        ref={textInputRef}
                        style={tw`flex-1 bg-gray-100 rounded-full px-4 py-2 max-h-20`}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChangeText={setNewMessage}
                        multiline
                        onSubmitEditing={handleSendMessage}
                    />

                    <TouchableOpacity
                        onPress={handleSendMessage}
                        disabled={(newMessage.trim() === '' && !imagePreview) || isUploading}
                        style={tw`ml-2 p-2`}
                    >
                        <Ionicons
                            name="send"
                            size={24}
                            color={(newMessage.trim() !== '' || imagePreview) ? '#15803d' : '#9ca3af'}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <EmojiPicker
                open={showEmojiPicker}
                onClose={() => setShowEmojiPicker(false)}
                onEmojiSelected={handleEmojiPick}
                theme={{
                    knob: '#15803d',
                    container: '#f3f4f6',
                    header: '#15803d',
                    skinTonesContainer: '#e5e7eb',
                    category: {
                        icon: '#6b7280',
                        iconActive: '#15803d',
                    },
                    search: {
                        background: '#f9fafb',
                        placeholder: '#9ca3af',
                        text: '#111827',
                    },
                }}
                styles={{
                    container: {
                        borderRadius: 0,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                    },
                    header: {
                        height: 50,
                    },
                }}
            />
        </KeyboardAvoidingView>
    );
};

export default ChatScreen;