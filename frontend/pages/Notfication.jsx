import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import tw from 'twrnc';

// Mock notification data
const mockNotifications = [
    {
        id: 1,
        type: 'sale',
        title: 'Your textbook was purchased!',
        message: 'John Doe bought "Introduction to Algorithms" for $45. Arrange meetup.',
        time: '2 mins ago',
        read: false,
        icon: '💰',
    },
    {
        id: 2,
        type: 'message',
        title: 'New message about your listing',
        message: 'Sarah: "Is the Calculus textbook still available? I can meet tomorrow."',
        time: '1 hour ago',
        read: false,
        icon: '💬',
    },
    {
        id: 3,
        type: 'interest',
        title: 'Someone liked your item',
        message: 'Alex showed interest in your "Psychology 101 Notes".',
        time: '3 hours ago',
        read: true,
        icon: '❤️',
    },
    {
        id: 4,
        type: 'system',
        title: 'Marketplace reminder',
        message: 'Don\'t forget to mark your "Economics Textbook" as sold if it\'s no longer available.',
        time: '1 day ago',
        read: true,
        icon: 'ℹ️',
    },
    {
        id: 5,
        type: 'warning',
        title: 'Payment received',
        message: 'You received $25 from Michael for the "Linear Algebra Solutions".',
        time: '2 days ago',
        read: true,
        icon: '✅',
    },
    {
        id: 6,
        type: 'event',
        title: 'New marketplace event',
        message: 'Textbook swap meet this Friday at the Student Center!',
        time: '1 week ago',
        read: true,
        icon: '📅',
    },
    {
        id: 7,
        type: 'sale',
        title: 'Your textbook was purchased!',
        message: 'John Doe bought "Introduction to Algorithms" for $45. Arrange meetup.',
        time: '2 mins ago',
        read: false,
        icon: '💰',
    },
    {
        id: 8,
        type: 'message',
        title: 'New message about your listing',
        message: 'Sarah: "Is the Calculus textbook still available? I can meet tomorrow."',
        time: '1 hour ago',
        read: false,
        icon: '💬',
    },
    {
        id: 9,
        type: 'interest',
        title: 'Someone liked your item',
        message: 'Alex showed interest in your "Psychology 101 Notes".',
        time: '3 hours ago',
        read: true,
        icon: '❤️',
    },
    {
        id: 10,
        type: 'system',
        title: 'Marketplace reminder',
        message: 'Don\'t forget to mark your "Economics Textbook" as sold if it\'s no longer available.',
        time: '1 day ago',
        read: true,
        icon: 'ℹ️',
    },
    {
        id: 11,
        type: 'warning',
        title: 'Payment received',
        message: 'You received $25 from Michael for the "Linear Algebra Solutions".',
        time: '2 days ago',
        read: true,
        icon: '✅',
    },
    {
        id: 12,
        type: 'event',
        title: 'New marketplace event',
        message: 'Textbook swap meet this Friday at the Student Center!',
        time: '1 week ago',
        read: true,
        icon: '📅',
    },
];

const NotificationPage = () => {
    return (
        <View style={tw`flex-1 bg-gray-50 pb-20`}>
            {/* Header */}
            <View style={tw`px-4 py-4 bg-white border-b border-gray-200`}>
                <Text style={tw`text-2xl font-bold text-gray-900`}>Notifications</Text>
                <View style={tw`flex flex-row justify-between mt-2`}>
                    <Text style={tw`text-gray-500`}>University Marketplace</Text>
                    <TouchableOpacity>
                        <Text style={tw`text-green-500 font-medium`}>Mark all as read</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Notification List */}
            <ScrollView style={tw`flex-1`}>
                {mockNotifications.map((notification) => (
                    <TouchableOpacity
                        key={notification.id}
                        style={tw`px-4 py-3 border-b border-gray-100 bg-${notification.read ? 'white' : 'blue-50'}`}
                        onPress={() => console.log('Notification pressed', notification.id)}
                    >
                        <View style={tw`flex flex-row`}>
                            {/* Icon/Emoji */}
                            <View style={tw`mr-3`}>
                                <Text style={tw`text-2xl`}>{notification.icon}</Text>
                            </View>

                            {/* Content */}
                            <View style={tw`flex-1`}>
                                <View style={tw`flex flex-row justify-between`}>
                                    <Text style={tw`font-bold text-gray-900 ${!notification.read && 'text-green-800'}`}>
                                        {notification.title}
                                    </Text>
                                    <Text style={tw`text-xs text-gray-400`}>{notification.time}</Text>
                                </View>
                                <Text style={tw`text-gray-600 mt-1`}>{notification.message}</Text>

                                {/* Actions for certain notification types */}
                                {/* {notification.type === 'sale' && (
                                    <View style={tw`flex flex-row mt-2`}>
                                        <TouchableOpacity style={tw`bg-green-500 px-3 py-1 rounded-full mr-2`}>
                                            <Text style={tw`text-white text-sm`}>Confirm</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={tw`border border-gray-300 px-3 py-1 rounded-full`}>
                                            <Text style={tw`text-gray-600 text-sm`}>Message</Text>
                                        </TouchableOpacity>
                                    </View>
                                )} */}
                            </View>

                            {/* Unread indicator */}
                            {!notification.read && (
                                <View style={tw`w-2 h-2 bg-green-500 rounded-full ml-2 mt-1`} />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

        </View>
    );
};

export default NotificationPage;