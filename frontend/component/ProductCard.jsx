import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import tw from 'twrnc';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useCartStore from '../zustand/useProduct';

const ProductCard = ({
    product,
    gridView = false
}) => {
    const navigation = useNavigation();
    const { cartProducts, addToCart, removeFromCart } = useCartStore();

    // Calculate original price based on discount
    const originalPrice = Math.round(product.price / (1 - product.discount / 100));

    const isInCart = cartProducts?.some(item => item._id === product._id);

    const handleCartAction = (e) => {
        e.stopPropagation();
        if (isInCart) {
            removeFromCart(product._id);
        } else {
            addToCart({
                ...product,
                quantity: 1,
                imageUrl: product.images[0] // Adding imageUrl for backward compatibility
            });
        }
    };
    console.log(product.sellerId)

    // Render star ratings
    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => {
            const starValue = i + 1;
            if (starValue <= Math.floor(rating)) {
                return <Ionicons key={`full-${i}`} name="star" size={14} color="#F59E0B" />;
            }
            if (starValue - 0.5 <= rating) {
                return <Ionicons key={`half-${i}`} name="star-half" size={14} color="#F59E0B" />;
            }
            return <Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#F59E0B" />;
        });
    };

    // Format price with currency
    const formatPrice = (price) => `ETB ${price}`;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                tw`bg-white overflow-hidden shadow-xl rounded-xl p-2 `,
                !product.isActive && tw`opacity-70`
            ]}
            onPress={() => navigation.navigate('ProductDetail', { productId: product._id })}
            activeOpacity={0.9}
            disabled={!product.isActive}
        >
            <View style={tw`flex-row ${gridView ? 'hidden' : ''} justify-between pr-10 items-start`}>
                <View style={tw`flex-row items-center mb-2`}>
                    <Image
                        source={
                            { uri: product.sellerId.image }
                        }
                        style={tw`w-10 h-10 mr-3 rounded-full`}
                        resizeMode="cover"
                    />
                    <View style={tw`flex-1`}>
                        <Text
                            style={tw`font-medium text-gray-900`}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {product?.sellerId?.name || 'Unknown Seller'}
                        </Text>
                        <Text
                            style={tw`text-gray-500 text-xs`}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {product?.sellerId?.university || 'Unknown University'}
                        </Text>
                    </View>
                </View>
                <Text style={tw`text-3xl -mt-3 text-gray-500`}>...</Text>
            </View>


            {/* Product Image with Status Badge */}
            <View style={tw`relative`}>
                <Image
                    source={{ uri: product.images[0] }}
                    style={[
                        tw`w-full rounded-xl`,
                        {
                            height: gridView ? 130 : 220,
                        }
                    ]}
                    resizeMode="cover"
                />


                {/* Category Tag */}
                {/* <View style={tw`absolute top-2 ${gridView ? 'right-2' : 'left-2'} bg-white/90 px-2 py-1 rounded-full`}>
                    <Text style={tw`text-gray-800 text-xs font-medium capitalize`}>
                        {product.productCategory}
                    </Text>
                </View> */}

                {/* Cart Button */}


                {/* Like Button */}
                <TouchableOpacity
                    style={tw`absolute ${gridView ? 'top-2 right-2' : 'top-2 right-2'} bg-gray-400 p-1 rounded-full`}
                    onPress={(e) => {
                        e.stopPropagation();
                        console.log('Liked product');
                    }}
                >
                    <MaterialIcons
                        name="favorite-border"
                        size={20}
                        color="#ffffff"
                    />
                </TouchableOpacity>
            </View>

            {/* Product Details */}
            <View style={tw`p-1 pt-2`}>
                <View style={tw`flex-row items-start justify-between`}>
                    <Text
                        style={[tw`font-semibold text-[14px] leading-[20px] max-w-[70%] text-gray-900 mb-1`]}
                    >
                        {product.name}

                    </Text>
                    <View style={tw`flex-row leading-[20px]  items-center`}>
                        <MaterialIcons name="star" size={24} style={tw`text-yellow-400 `} />
                        <Text style={tw`text-sm`}>(5.0)</Text>
                    </View>
                </View>
                {/* Title */}





                {/* {!gridView && product.tags.length > 0 && (
                    <View style={tw`flex-row flex-wrap mb-2`}>
                        {product.tags.slice(0, 3).map((tag, index) => (
                            <View key={index} style={tw`bg-gray-100 px-2 py-1 rounded-full mr-1 mb-1`}>
                                <Text style={tw`text-gray-700 text-xs`}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )} */}
                <View style={tw`${gridView ? 'flex-row justify-between  items-center' : 'justify-start'} w-full`}>
                    <View style={tw``}>
                        <Text
                            style={[tw` text-sm  text-gray-400 mb-1`]}
                            numberOfLines={gridView ? 1 : 2}
                        >
                            {product.description}
                        </Text>
                        {/* Price Section */}
                        <View style={tw` ${gridView ? 'flex-col' : 'hidden'} mb-2`}>
                            <Text style={[tw` text-green-700`, { fontSize: gridView ? 14 : 18 }]}>
                                {formatPrice(product.price)}
                            </Text>

                        </View>


                    </View>

                    <View style={tw`${gridView ? 'flex-col' : 'flex-row items-center justify-between w-full'}`}>
                        <View style={tw` ${gridView ? 'hidden' : 'flex-col'} mb-2`}>
                            <Text style={[tw` text-green-700`, { fontSize: gridView ? 14 : 18 }]}>
                                {formatPrice(product.price)}
                            </Text>

                        </View>
                        <TouchableOpacity
                            style={[
                                tw`${gridView ? 'w-9 h-9 ' : 'flex-row px-4 py-1'} justify-center rounded-full flex-row items-center`,
                                isInCart ? tw`bg-red-600` : tw`bg-green-600`,
                                (!product.isActive || product.stock === 0) && tw`bg-gray-400`
                            ]}
                            onPress={handleCartAction}

                        >


                            <View style={tw`${gridView ? '' : 'flex-row items-center '}`}>
                                <MaterialIcons
                                    name={isInCart ? "remove-shopping-cart" : "shopping-cart"}
                                    color={'#fff'}
                                    style={tw`pt-1`}
                                    size={20}
                                />
                                <Text style={tw`${gridView ? 'hidden' : ' '} text-white text-xs font-semibold ml-1`}>
                                    {isInCart ? 'Remove' : 'Add Cart'}
                                </Text>
                            </View>

                        </TouchableOpacity>
                    </View>

                    {/* Price Section */}

                </View>




                {/* Seller and Delivery Info */}
                {/* <View style={tw`flex-row items-center justify-between pt-2 border-t border-gray-100`}>
                    <View style={tw`flex-row items-center`}>
                        <MaterialIcons name="person-outline" size={12} color="#6B7280" />
                        <Text style={[tw`text-gray-700 ml-1`, { fontSize: gridView ? 10 : 12 }]}>
                            {gridView ? product.sellerName?.split(' ')[0] : product.sellerName}
                        </Text>
                    </View>

                    <View style={tw`flex-row items-center`}>
                        <MaterialIcons
                            name={product.deliveryMethod === 'pickup' ? 'store' :
                                product.deliveryMethod === 'delivery' ? 'local-shipping' : 'swap-horiz'}
                            size={12}
                            color="#6B7280"
                        />
                        <Text style={[tw`text-gray-400 ml-1`, { fontSize: gridView ? 10 : 12 }]}>
                            {product.postedDate}
                        </Text>
                    </View>
                </View> */}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({

    gradient: {
        backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 30%)',
    }
});

export default ProductCard;