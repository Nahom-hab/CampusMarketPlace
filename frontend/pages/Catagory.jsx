import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import tw from 'twrnc';
import ProductCard from '../component/ProductCard';
import { Ionicons } from '@expo/vector-icons';
import useUser from '../zustand/useUser';


const Category = () => {
    const { products } = useUser()
    const route = useRoute();
    const { category } = route.params;

    // Mock category data - replace with your actual data
    const categoryData = {
        name: category,
        description: 'Discover the latest in audio technology with our premium collection of headphones, earbuds, and speakers. Perfect for music lovers and professionals alike.',
        image: 'https://via.placeholder.com/350x150',
    };
    const navigation = useNavigation()

    return (
        <ScrollView style={tw`bg-gray-50 mb-16`}>
            {/* Category Header */}
            <View style={tw`relative mb-6`}>
                <Image
                    source={{ uri: categoryData.image }}
                    style={tw`w-full h-48`}
                    resizeMode="cover"
                />
                <View style={tw`absolute inset-0 bg-black opacity-30`} />
                <View style={tw`absolute inset-0 flex items-center justify-center`}>
                    <Text style={tw`text-white text-3xl font-bold`}>{categoryData.name}</Text>
                </View>
                <TouchableOpacity
                    style={tw`absolute top-3 left-3 bg-white/90 p-2 rounded-full`}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            {/* Category Description */}
            <View style={tw`px-4 mb-4`}>
                <Text style={tw`text-sm text-gray-700`}>{categoryData.description}</Text>
            </View>

            {products.length > 0 ? (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={tw`p-2`}
                    numColumns={2}
                    columnWrapperStyle={tw`justify-between mb-1`}
                    renderItem={({ item }) => (
                        <View style={tw`w-[49%]`}>
                            <ProductCard key={item._id} product={item} gridView={true} />
                        </View>
                    )}
                />
            ) : (
                <View style={tw`flex-1 items-center justify-center mt-10 p-8`}>

                    <Text style={tw`text-xl font-bold text-gray-700 mb-2`}>
                        {searchQuery ? 'No results found' : 'Search for items'}
                    </Text>
                    <Text style={tw`text-gray-500 text-center`}>
                        {searchQuery
                            ? 'Try different keywords or categories'
                            : 'Type in the search bar or browse by category'}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

export default Category;