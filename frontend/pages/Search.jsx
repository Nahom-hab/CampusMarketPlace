// screens/Search.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native';
import {
    Ionicons,
    MaterialIcons,
    FontAwesome,
    MaterialCommunityIcons,
    Feather,
    Entypo
} from '@expo/vector-icons';
import tw from 'twrnc';

import ProductCard from '../component/ProductCard';
import useUser from '../zustand/useUser';

const Search = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const [filteredProducts, setFilteredProducts] = useState([]);
    const { products } = useUser();

    const categories = [
        {
            name: 'All',
            icon: <Feather name="grid" size={16} />
        },
        {
            name: 'electronics',
            icon: <MaterialIcons name="devices-other" size={16} />
        },
        {
            name: 'clothing',
            icon: <FontAwesome name="tshirt" size={16} />
        },
        {
            name: 'home',
            icon: <MaterialCommunityIcons name="sofa" size={16} />
        },
        {
            name: 'beauty',
            icon: <MaterialCommunityIcons name="spa" size={16} />
        },
        {
            name: 'food',
            icon: <MaterialCommunityIcons name="food-apple" size={16} />
        },
        {
            name: 'other',
            icon: <Entypo name="dots-three-horizontal" size={16} />
        },
    ];

    // Enhanced search function
    useEffect(() => {
        let results = [...products];

        // Apply category filter
        if (activeCategory !== 'All') {
            results = results.filter(product =>
                product.productCategory.toLowerCase() === activeCategory.toLowerCase()
            );
        }

        // Apply search filter with multiple criteria
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.tags.some(tag => tag.toLowerCase().includes(query)) ||
                (product.sellerId && product.sellerId.toLowerCase().includes(query))
            )
        }

        setFilteredProducts(results);
    }, [searchQuery, activeCategory, products]);

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Search Header */}

            <View style={tw`bg-green-700 p-4`}>
                <View style={tw`flex-row items-center`}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={tw`flex-1 ml-4 bg-white rounded-full px-4 py-[2px] flex-row items-center`}>
                        <Ionicons name="search" size={20} color="gray" />
                        <TextInput

                            style={tw`ml-2 h-10 flex-1 text-base`}
                            placeholder="Search for items..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            
                            autoFocus={true}
                            returnKeyType="search"
                        />
                        {searchQuery ? (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color="gray" />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>

            {/* Category Filter */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={tw`bg-white border-b h-fit border-gray-200 py-3`}
                contentContainerStyle={tw`px-4`}
            >
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            tw`mr-3 px-4 py-2 h-12 rounded-full flex-row items-center`,
                            activeCategory === category.name
                                ? tw`bg-green-600`
                                : tw`bg-gray-100`
                        ]}
                        onPress={() => setActiveCategory(category.name)}
                    >
                        <View style={tw`mr-1`}>
                            {React.cloneElement(category.icon, {
                                color: activeCategory === category.name ? 'white' : '#6B7280'
                            })}
                        </View>
                        <Text
                            style={[
                                tw`text-sm capitalize`,
                                activeCategory === category.name
                                    ? tw`text-white font-semibold`
                                    : tw`text-gray-700`
                            ]}
                        >
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Search Results */}
            {filteredProducts.length > 0 ? (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={tw`p-2 px-4`}
                    numColumns={2}
                    columnWrapperStyle={tw`justify-between`}
                    renderItem={({ item }) => (
                        <View style={tw`w-[48%] mb-2`}>
                            <ProductCard
                                product={item}
                                gridView={true}
                            />
                        </View>
                    )}
                />
            ) : (
                <View style={tw`flex-1 items-center -mt-[700px] justify-center p-8`}>
                    <MaterialIcons
                        name="search-off"
                        size={59}
                        color="#D1D5DB"
                        style={tw`mb-4`}
                    />
                    <Text style={tw`text-xl font-bold text-gray-700 mb-2`}>
                        {searchQuery ? 'No results found' : 'Search for items'}
                    </Text>
                    <Text style={tw`text-gray-500 text-center`}>
                        {searchQuery
                            ? 'Try different keywords or check another category'
                            : 'Type in the search bar or browse by category'}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default Search;