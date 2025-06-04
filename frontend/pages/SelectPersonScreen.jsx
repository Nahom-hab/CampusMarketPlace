import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import useUser from '../zustand/useUser';
import { getConversationPartners } from '../BackEnd_Calls/message';

const SelectPersonScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [conversationPartners, setConversationPartners] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        const fetchConversationPartners = async () => {
            try {
                setLoading(true);
                const partners = await getConversationPartners(user._id);
                setConversationPartners(partners);
            } catch (error) {
                console.error('Failed to fetch conversation partners:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversationPartners();
    }, [user._id]);

    // Filter people based on search query
    const filteredPeople = conversationPartners.filter(person =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (person.email && person.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleSelectPerson = (partner) => {
        navigation.navigate('Chat', {
            partnerId: partner._id,
            partnerName: partner.name,
            partnerAvatar: partner.image,
            bio: partner.bio,
            conversationId: partner.conversationId,
            university: partner.university
        });
    };

    const formatMessagePreview = (message) => {
        if (!message) return 'No messages yet';
        if (message.isImage) return message.caption || '📷 Photo';
        return message.message.length > 30
            ? `${message.message.substring(0, 30)}...`
            : message.message;
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={tw`mt-4 text-gray-600`}>Loading conversations...</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <View style={tw`px-4 py-4 bg-white border-b border-gray-200`}>
                <Text style={tw`text-2xl font-bold text-gray-900`}>Messages</Text>
                <Text style={tw`text-gray-500 mt-1`}>Your conversations</Text>
            </View>

            {/* Search Bar */}
            <View style={tw`px-4 py-3 bg-white`}>
                <View style={tw`flex-row items-center bg-gray-100 rounded-lg px-3 py-2`}>
                    <Ionicons name="search" size={20} color="gray" />
                    <TextInput
                        style={tw`flex-1 ml-2 text-gray-700`}
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="gray" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* People List */}
            <ScrollView style={tw`flex-1`}>
                {filteredPeople.map(person => (
                    <TouchableOpacity
                        key={person._id}
                        style={tw`flex-row items-center px-4 py-3 bg-white border-b border-gray-100`}
                        onPress={() => handleSelectPerson(person)}
                    >
                        {/* Avatar */}
                        <View style={tw`relative`}>
                            <Image
                                source={{ uri: person.image || 'https://via.placeholder.com/150' }}
                                style={tw`w-12 h-12 rounded-full`}
                                defaultSource={{ uri: 'https://via.placeholder.com/150' }}
                            />
                            {/* Unread count badge */}
                            {person.unreadCount > 0 && (
                                <View style={tw`absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center`}>
                                    <Text style={tw`text-white text-xs`}>{person.unreadCount}</Text>
                                </View>
                            )}
                        </View>

                        {/* Person Info */}
                        <View style={tw`flex-1 ml-3`}>
                            <View style={tw`flex-row justify-between items-center`}>
                                <Text style={tw`font-semibold text-gray-800`}>{person.name}</Text>
                                {person.lastMessage && (
                                    <Text style={tw`text-xs text-gray-400`}>
                                        {formatTime(person.lastMessage.createdAt)}
                                    </Text>
                                )}
                            </View>
                            <View style={tw`flex-row justify-between items-center`}>
                                <Text
                                    style={[
                                        tw`text-sm`,
                                        person.unreadCount > 0
                                            ? tw`font-semibold text-gray-800`
                                            : tw`text-gray-500`
                                    ]}
                                    numberOfLines={1}
                                >
                                    {formatMessagePreview(person.lastMessage)}
                                </Text>
                                {/* Seen indicator could be added here */}
                            </View>
                        </View>

                        {/* Chevron */}
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Empty State */}
            {!loading && filteredPeople.length === 0 && (
                <View style={tw`flex-1 items-center justify-center p-8`}>
                    <Ionicons name="chatbubbles-outline" size={48} color="#9CA3AF" />
                    <Text style={tw`text-lg text-gray-500 mt-4 text-center`}>
                        {searchQuery ? `No matches for "${searchQuery}"` : 'No conversations yet'}
                    </Text>
                    <Text style={tw`text-gray-400 mt-2 text-center`}>
                        {searchQuery ? 'Try a different search' : 'Start a new conversation'}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default SelectPersonScreen;