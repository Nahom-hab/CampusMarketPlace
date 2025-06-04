// screens/ProductDetail.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import tw from 'twrnc';
import { useRoute, useNavigation } from '@react-navigation/native';
import useCartStore from '../zustand/useProduct';
import Shimmer from '../component/shimmer';
import { getProductById } from '../BackEnd_Calls/product';

const { width: screenWidth } = Dimensions.get('window');

const ProductDetail = () => {
    const route = useRoute();
    const { productId } = route.params;
    const navigation = useNavigation();
    const [expanded, setExpanded] = useState(false);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const { cartProducts, addToCart, removeFromCart } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await getProductById(productId);
                console.log(res)
                setProduct(res);
            } catch (err) {
                setError(err.message || 'Failed to fetch product');
                console.error('Fetch product error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const isInCart = () => cartProducts?.some(item => item._id === product?._id);

    const handleCartAction = (e) => {
        e.stopPropagation();
        if (isInCart()) {
            removeFromCart(product._id);
        } else {
            addToCart({
                ...product,
                quantity: 1,
                imageUrl: product.images[0]
            });
        }
    };

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => {
            const starValue = i + 1;
            if (starValue <= Math.floor(rating)) {
                return <Ionicons key={`full-${i}`} name="star" size={16} color="#F59E0B" style={tw`mr-0.5`} />;
            }
            if (starValue - 0.5 <= rating) {
                return <Ionicons key={`half-${i}`} name="star-half" size={16} color="#F59E0B" style={tw`mr-0.5`} />;
            }
            return <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#F59E0B" style={tw`mr-0.5`} />;
        });
    };

    const calculateOriginalPrice = (price, discount) => {
        return Math.round(price / (1 - discount / 100));
    };

    if (loading) {
        return (
            <ScrollView style={tw`bg-white`}>
                <View style={tw`relative`}>
                    <Shimmer style={tw`w-full h-96`} />
                    <View style={tw`absolute bottom-4 left-0 right-0 flex-row justify-center`}>
                        {[0, 1, 2].map((i) => (
                            <Shimmer key={i} style={tw`w-3 h-3 rounded-full mx-1`} />
                        ))}
                    </View>
                </View>

                <View style={tw`bg-white p-6`}>
                    <Shimmer style={tw`h-8 w-3/4 mb-4 rounded-lg`} />
                    <Shimmer style={tw`h-6 w-1/2 mb-6 rounded-lg`} />

                    <View style={tw`flex-row items-center mb-6`}>
                        <Shimmer style={tw`h-8 w-24 mr-2 rounded-lg`} />
                        <Shimmer style={tw`h-6 w-16 rounded-lg`} />
                    </View>

                    <Shimmer style={tw`h-4 w-full mb-2 rounded-lg`} />
                    <Shimmer style={tw`h-4 w-5/6 mb-2 rounded-lg`} />
                    <Shimmer style={tw`h-4 w-2/3 mb-6 rounded-lg`} />

                    <Shimmer style={tw`h-12 w-full rounded-full`} />
                </View>
            </ScrollView>
        );
    }

    if (error) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-white p-6`}>
                <View style={tw`bg-red-100 p-6 rounded-xl items-center`}>
                    <Feather name="alert-circle" size={48} color="#EF4444" style={tw`mb-4`} />
                    <Text style={tw`text-lg text-red-600 font-medium mb-4 text-center`}>{error}</Text>
                    <TouchableOpacity
                        style={tw`bg-blue-600 px-6 py-3 rounded-full flex-row items-center`}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={20} color="white" style={tw`mr-2`} />
                        <Text style={tw`text-white font-medium`}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-white p-6`}>
                <View style={tw`bg-gray-100 p-6 rounded-xl items-center`}>
                    <Feather name="package" size={48} color="#6B7280" style={tw`mb-4`} />
                    <Text style={tw`text-lg text-gray-700 font-medium mb-4`}>Product not found</Text>
                    <TouchableOpacity
                        style={tw`bg-blue-600 px-6 py-3 rounded-full flex-row items-center`}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={20} color="white" style={tw`mr-2`} />
                        <Text style={tw`text-white font-medium`}>Browse Products</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const originalPrice = calculateOriginalPrice(product.price, product.discount);

    return (
        <View style={tw`flex-1 bg-white`}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Carousel */}
                <View style={tw`relative`}>
                    <View style={tw`relative h-96`}>
                        <Animated.FlatList
                            data={product.images}
                            keyExtractor={(_, index) => index.toString()}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                { useNativeDriver: false }
                            )}
                            scrollEventThrottle={16}
                            renderItem={({ item: image }) => (
                                <View style={{ width: screenWidth }}>
                                    <Image
                                        source={{ uri: image }}
                                        style={tw`w-full h-full`}
                                        resizeMode="cover"
                                    />
                                </View>
                            )}
                        />

                        {/* Image Indicators */}
                        <View style={tw`absolute bottom-4 left-0 right-0 flex-row justify-center`}>
                            {product.images.map((_, i) => {
                                const inputRange = [
                                    (i - 1) * screenWidth,
                                    i * screenWidth,
                                    (i + 1) * screenWidth,
                                ];

                                const dotWidth = scrollX.interpolate({
                                    inputRange,
                                    outputRange: [6, 12, 6],
                                    extrapolate: 'clamp',
                                });

                                const opacity = scrollX.interpolate({
                                    inputRange,
                                    outputRange: [0.3, 1, 0.3],
                                    extrapolate: 'clamp',
                                });

                                return (
                                    <Animated.View
                                        key={i}
                                        style={[
                                            tw`h-2 rounded-full bg-white mx-1`,
                                            {
                                                width: dotWidth,
                                                opacity,
                                            },
                                        ]}
                                    />
                                );
                            })}
                        </View>
                    </View>

                    {/* Back Button */}
                    <TouchableOpacity
                        style={tw`absolute top-8 left-4 bg-white/80 p-2 rounded-full shadow-md`}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={20} color="#1F2937" />
                    </TouchableOpacity>

                    {/* Like Button */}
                    <TouchableOpacity
                        style={tw`absolute top-8 right-4 bg-white/80 p-2 rounded-full shadow-md`}
                    >
                        <MaterialIcons
                            name="favorite-border"
                            size={20}
                            color="#EF4444"
                        />
                    </TouchableOpacity>

                    {/* Status Badge */}
                    {!product.isActive && (
                        <View style={tw`absolute top-24 right-4 bg-red-500 px-3 py-1 rounded-full shadow`}>
                            <Text style={tw`text-white text-xs font-bold`}>SOLD OUT</Text>
                        </View>
                    )}
                </View>


                {/* Product Info */}
                <View style={tw`p-6`}>
                    {/* Title and Category */}
                    <View style={tw`flex-row justify-between items-start mb-3`}>
                        <Text style={tw`text-2xl font-bold text-gray-900 leading-tight`}>
                            {product.name}
                        </Text>
                        <View style={tw`bg-blue-50 px-3 py-1 rounded-full`}>
                            <Text style={tw`text-blue-600 text-xs font-medium capitalize`}>
                                {product.productCategory}
                            </Text>
                        </View>
                    </View>
                    <View style={tw`mb-6`}>
                        <Text
                            style={tw`text-gray-600 leading-6`}
                            numberOfLines={expanded ? undefined : 4}
                        >
                            {product.description}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setExpanded(!expanded)}
                            style={tw`mt-2`}
                        >
                            <Text style={tw`text-blue-600 font-medium`}>
                                {expanded ? 'Show less' : 'Read more'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* Rating and Reviews */}
                    <View style={tw`flex-row items-center mb-4`}>
                        <View style={tw`flex-row items-center mr-2`}>
                            {renderStars(product.rating || 4.5)}
                        </View>
                        <Text style={tw`text-amber-600 text-sm font-medium`}>
                            {product.rating?.toFixed(1) || '4.5'}
                        </Text>
                        <Text style={tw`text-gray-400 text-sm ml-1`}>
                            ({(product.reviewsCount || 24)}+ reviews)
                        </Text>
                    </View>
                    {/* Delivery Info */}
                    <View style={tw`mb-6 bg-gray-50 p-4 rounded-xl`}>
                        <Text style={tw`text-gray-500 text-sm font-medium mb-2`}>DELIVERY</Text>
                        <View style={tw`flex-row items-center`}>
                            <View style={tw`bg-blue-100 p-2 rounded-full mr-3`}>
                                <MaterialIcons
                                    name={
                                        product.deliveryMethod === 'pickup' ? 'store' :
                                            product.deliveryMethod === 'delivery' ? 'local-shipping' : 'swap-horiz'
                                    }
                                    size={20}
                                    color="#3B82F6"
                                />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`font-medium text-gray-900`}>
                                    {product.deliveryMethod === 'pickup' ? 'Campus Pickup' :
                                        product.deliveryMethod === 'delivery' ? 'Home Delivery' :
                                            'Pickup or Delivery'}
                                </Text>
                                <Text style={tw`text-gray-500 text-sm`}>
                                    {product.deliveryMethod === 'pickup' ? 'Pick up at your convenience' :
                                        product.deliveryMethod === 'delivery' ? 'Fast delivery within 1-2 days' :
                                            'Flexible delivery options'}
                                </Text>
                            </View>
                        </View>
                    </View>




                    {/* Price Section */}
                    <View style={tw`mb-6`}>
                        <View style={tw`flex-row items-center mb-2`}>
                            <Text style={tw`text-3xl font-bold text-gray-900`}>
                                ETB {product.price.toLocaleString()}
                            </Text>
                            {product.discount > 0 && (
                                <View style={tw`ml-3 px-2 py-0.5 rounded-full bg-green-100 border border-green-300`}>
                                    <Text style={tw`text-green-700 text-xs font-semibold`}>
                                        {product.discount}% OFF
                                    </Text>
                                </View>
                            )}
                        </View>

                        {product.discount > 0 && (
                            <Text style={tw`text-gray-400 text-base line-through`}>
                                ETB {originalPrice.toLocaleString()}
                            </Text>
                        )}
                    </View>

                    {/* Stock Indicator */}
                    {product.stock > 0 && product.stock <= 5 && (
                        <View style={tw`mb-6 bg-amber-50 border border-amber-100 p-3 rounded-lg`}>
                            <View style={tw`flex-row items-center`}>
                                <Ionicons name="warning" size={18} color="#D97706" style={tw`mr-2`} />
                                <Text style={tw`text-amber-700 text-sm font-medium`}>
                                    Only {product.stock} left in stock - order soon!
                                </Text>
                            </View>
                        </View>
                    )}


                    {/* Seller Info */}
                    <View style={tw`mb-6 bg-gray-50 p-4 rounded-xl`}>
                        <Text style={tw`text-gray-500 text-sm font-medium mb-2`}>SELLER</Text>
                        <View style={tw`flex-row items-center`}>
                            <View style={tw`bg-blue-100 p-2 rounded-full mr-3`}>
                                <Image
                                    source={{ uri: product.sellerId.image }}
                                    style={[
                                        tw`w-7 h-7 rounded-xl`,

                                    ]}
                                    resizeMode="cover"
                                />

                            </View>
                            <View style={tw`flex-1`}>


                                <Text style={tw`font-medium text-gray-900`}>
                                    {product.sellerId.name}
                                </Text>
                                <Text style={tw`text-gray-500 text-sm`}>
                                    Active seller • 98% positive ratings
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={tw`bg-white border border-gray-200 p-2 rounded-full shadow-sm`}
                                onPress={() => navigation.navigate('Chat', {
                                    partnerId: product.sellerId._id,
                                    partnerName: product.sellerId.name,
                                    partnerAvatar: product.sellerId.image,
                                    productId: product._id, // Optional: pass product info if you want to reference it in chat
                                    productName: product.name,
                                    productImage: product.images[0]
                                })}
                            >
                                <MaterialIcons name="chat" size={20} color="#3B82F6" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Description */}

                    {/* Tags */}
                    {product.tags?.length > 0 && (
                        <View style={tw`mb-28`}>
                            <Text style={tw`text-gray-900 text-lg font-bold mb-3`}>Product Tags</Text>
                            <View style={tw`flex-row flex-wrap`}>
                                {product.tags.map((tag, index) => (
                                    <View
                                        key={index}
                                        style={tw`bg-gray-100 px-3 py-2 rounded-lg mr-2 mb-2`}
                                    >
                                        <Text style={tw`text-gray-700 text-sm`}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Fixed Bottom Button */}
            <View style={tw`absolute bottom-16 left-0 right-0 bg-white border-t px-4 border-gray-100  shadow-lg`}>
                <TouchableOpacity
                    style={[
                        tw`py-2 rounded-xl flex-row items-center justify-center shadow-sm`,
                        isInCart() ? tw`bg-red-500` : tw`bg-green-700`,
                        (!product.isActive || product.stock === 0) && tw`bg-gray-400`
                    ]}
                    onPress={handleCartAction}
                    disabled={!product.isActive || product.stock === 0}
                >
                    {product.stock === 0 ? (
                        <Text style={tw`text-white text-base font-semibold`}>Out of Stock</Text>
                    ) : !product.isActive ? (
                        <Text style={tw`text-white text-base font-semibold`}>Not Available</Text>
                    ) : (
                        <>
                            <MaterialIcons
                                name={isInCart() ? "remove-shopping-cart" : "shopping-cart"}
                                color={'#fff'}
                                size={20}
                                style={tw`mr-2`}
                            />
                            <Text style={tw`text-white text-base font-semibold`}>
                                {isInCart() ? 'Remove from Cart' : 'Add To Cart'}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProductDetail;