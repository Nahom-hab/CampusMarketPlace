// screens/HomeScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, RefreshControl } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ProductCard from '../component/ProductCard';
import { getAllProducts } from '../BackEnd_Calls/product';
import useUser from '../zustand/useUser';

const categories = [
    { name: 'books', icon: 'menu-book' },
    { name: 'electronics', icon: 'computer' },
    { name: 'Furniture', icon: 'chair' },
    { name: 'clothing', icon: 'checkroom' },
    { name: 'home', icon: 'handyman' },
    { name: 'beauty', icon: 'confirmation-number' },
    { name: 'food', icon: 'handyman' },
    { name: 'beauty', icon: 'confirmation-number' },
];

function HomeScreen() {
    const navigation = useNavigation();
    const { setProducts } = useUser();
    const [products, setProduct] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(50);

    // Function to shuffle array randomly
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const fetchProducts = async () => {
        try {
            const products = await getAllProducts();
            setProducts(products);
            setProduct(shuffleArray(products)); // Shuffle on initial load
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProducts().then(() => {
            // Add slight delay to show refresh animation
            setTimeout(() => setRefreshing(false), 1000);
        });
    }, []);

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Slide up animation
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start();

        fetchProducts();
    }, []);

    // Refresh when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchProducts();
        }, [])
    );

    return (
        <ScrollView
            style={tw`bg-gray-50 mb-8`}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#15803d']} // Green color to match your theme
                    tintColor="#15803d"
                    progressBackgroundColor="#ffffff"
                />
            }
        >
            {/* Header */}
            <View style={tw`relative bg-green-700 h-32 p-4`}>
                <View style={tw`flex-row justify-between items-center`}>
                    <Text style={tw`text-white text-2xl font-bold`}>CampusMarket</Text>
                </View>

                <Animated.View
                    style={[
                        tw`absolute -bottom-4 z-50 left-3 right-3`,
                    ]}
                >
                    <TouchableOpacity
                        style={tw`bg-gray-50 text-black rounded-full p-2 mb-10 flex-row items-center`}
                        onPress={() => navigation.navigate('Search')}
                    >
                        <Ionicons name="search" size={20} style={tw`ml-2 text-green-600`} />
                        <Text style={tw`text-green-600 ml-2`}>Search for items...</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* Categories */}
            <View style={tw`p-4`}>
                <Text style={tw`text-xl font-bold mb-4`}>Categories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map((category, index) => (
                        <View key={index} style={tw`mr-4 items-center`}>
                            <TouchableOpacity
                                style={tw`bg-white p-4 rounded-full shadow-md`}
                                onPress={() => navigation.navigate('Category', { category: category.name })}
                            >
                                <MaterialIcons
                                    name={category.icon}
                                    size={24}
                                    color="#15803d"
                                />
                            </TouchableOpacity>
                            <Text style={tw`mt-2 text-sm`}>{category.name}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Featured Items */}
            <View style={tw`p-4`}>
                <View style={tw`flex-row justify-between items-center mb-4`}>
                    <Text style={tw`text-xl font-bold`}>Featured Items</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Featured')}>
                        <Text style={tw`text-blue-500`}>See all</Text>
                    </TouchableOpacity>
                </View>
                <View >
                    {products?.map(product => (
                        <View style={tw`mb-4`} key={product._id}>
                            <ProductCard key={product._id} product={product} />
                        </View>
                    ))}
                </View>
            </View>

        </ScrollView>
    );
}

export default HomeScreen;