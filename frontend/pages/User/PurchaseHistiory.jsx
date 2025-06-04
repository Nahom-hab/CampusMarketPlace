import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import tw from 'twrnc';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const PurchaseHistoryScreen = () => {
    const navigation = useNavigation()
    const purchaseData = [
        {
            id: '1',
            date: '2023-10-15',
            items: [
                { name: 'Premium Subscription', price: 9.99 },
                { name: 'Extra Storage', price: 4.99 },
            ],
            total: 14.98,
            status: 'Completed',
        },
        {
            id: '2',
            date: '2023-09-28',
            items: [
                { name: 'E-book: React Native Guide', price: 12.99 },
            ],
            total: 12.99,
            status: 'Completed',
        },
        {
            id: '3',
            date: '2023-08-10',
            items: [
                { name: 'Monthly Membership', price: 5.99 },
                { name: 'Custom Theme Pack', price: 2.99 },
            ],
            total: 8.98,
            status: 'Refunded',
        },
    ];

    const renderItem = ({ item }) => (
        <View style={tw`mb-4 border border-gray-200 rounded-lg p-4 bg-white`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`text-gray-500`}>{item.date}</Text>
                <View style={tw`px-2 py-1 rounded-full ${item.status === 'Completed' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Text style={tw`text-xs ${item.status === 'Completed' ? 'text-green-800' : 'text-red-800'}`}>
                        {item.status}
                    </Text>
                </View>
            </View>

            {item.items.map((product, index) => (
                <View key={index} style={tw`flex-row justify-between py-1`}>
                    <Text style={tw`text-gray-700`}>{product.name}</Text>
                    <Text style={tw`text-gray-700`}>ETB{product.price.toFixed(2)}</Text>
                </View>
            ))}

            <View style={tw`border-t border-gray-100 mt-2 pt-2 flex-row justify-between`}>
                <Text style={tw`font-bold`}>Total</Text>
                <Text style={tw`font-bold`}>ETB {item.total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
                style={tw`mt-3 py-2 border border-blue-500 rounded-lg items-center`}
                onPress={() => console.log('View details for order', item.id)}
            >
                <Text style={tw`text-blue-500 font-medium`}>View Details</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={tw`flex-1 bg-gray-50  pb-20`}>

            <View style={tw`px-4  pb-4`}>
                <View style={tw` flex-row items-center gap-5 py-3 border-b border-gray-200`}>

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={tw`text-2xl font-bold text-gray-800`}>Purchase History</Text>
                </View>

                <Text style={tw`text-gray-500 mt-1`}>Your recent orders and transactions</Text>
            </View>


            {purchaseData.length > 0 ? (
                <FlatList
                    data={purchaseData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={tw`px-4 pb-4`}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={tw`flex-1 items-center justify-center px-4`}>
                    <Text style={tw`text-gray-500 text-lg mb-2`}>No purchases yet</Text>
                    <Text style={tw`text-gray-400 text-center`}>
                        Your purchase history will appear here when you make transactions.
                    </Text>
                </View>
            )}
        </View>
    );
};


export default PurchaseHistoryScreen;
