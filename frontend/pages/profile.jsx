import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { GetUserInfo, logout } from '../BackEnd_Calls/authentication';
import useUser from '../zustand/useUser';
import { getProductsBySellerId } from '../BackEnd_Calls/product';
import { useEffect, useState } from 'react';

const Profile = () => {
    const navigation = useNavigation();
    const { user } = useUser();
    const [userProducts, setUserProducts] = useState([]);
    const [userData, setUserdata] = useState({})
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);


    const fetchUserProducts = async () => {
        try {
            setLoading(true);
            const products = await getProductsBySellerId(user._id);
            setUserProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchUser = async () => {
        try {
            const res = await GetUserInfo(user._id);
            setUserdata(res);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUserProducts();
        fetchUser()
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchUserProducts();
        fetchUser()
    };

    const handleLogout = () => {
        logout();
        navigation.navigate('Login');
    };

    const stats = [
        { label: 'Products Sold', value: userProducts.filter(p => p.status === 'sold').length },
        { label: 'Positive Ratings', value: '98%' },
        { label: 'Response Rate', value: '100%' }
    ];

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" color="#10B981" />
            </View>
        );
    }

    return (
        <ScrollView
            style={tw`bg-gray-50`}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#10B981']} // Android
                    tintColor="#10B981" // iOS
                    progressBackgroundColor="#ffffff" // iOS
                />
            }
        >
            {/* Profile Header */}
            <View style={tw`bg-white p-6 items-center`}>
                <Image
                    source={{ uri: userData?.image }}
                    style={tw`w-24 h-24 rounded-full mb-4 border-4 border-green-100`}
                />
                <Text style={tw`text-2xl font-bold text-gray-800`}>{userData?.name}</Text>
                <Text style={tw`text-gray-500 mb-1`}>{userData?.email}</Text>

                <View style={tw`flex-row items-center mb-3`}>
                    <Ionicons name="school" size={16} color="#3B82F6" />
                    <Text style={tw`text-blue-600 ml-1`}>{userData?.university}</Text>
                </View>

                <View style={tw`flex-row mb-4`}>
                    {[...Array(5)].map((_, i) => (
                        <Ionicons
                            key={i}
                            name={i < Math.floor(userData?.rating) ? 'star' : 'star-outline'}
                            size={16}
                            color={i < 4.5 ? '#F59E0B' : '#D1D5DB'}
                        />
                    ))}
                    <Text style={tw`text-amber-600 ml-1`}>{4.5}</Text>
                </View>

                <Text style={tw`text-gray-600 text-center mb-4`}>{userData?.bio}</Text>

                <View style={tw`flex-row justify-around w-full mb-4`}>
                    {stats.map((stat, index) => (
                        <View key={index} style={tw`items-center`}>
                            <Text style={tw`text-lg font-bold text-green-700`}>{stat.value}</Text>
                            <Text style={tw`text-xs text-gray-500`}>{stat.label}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Seller Dashboard */}

            <View style={tw`mt-4 bg-white p-5`}>
                <View style={tw`flex-row justify-between items-center mb-4`}>
                    <Text style={tw`text-xl font-bold text-gray-800`}>Seller Dashboard</Text>
                    <TouchableOpacity
                        style={tw`bg-green-600 px-4 py-2 rounded-full flex-row items-center`}
                        onPress={() => navigation.navigate('AddProduct')}
                    >
                        <Ionicons name="add" size={18} color="white" />
                        <Text style={tw`text-white ml-2`}>Add Product</Text>
                    </TouchableOpacity>
                </View>

                <Text style={tw`font-semibold text-gray-700 mb-3`}>Your Products ({userProducts.length})</Text>

                {userProducts.length > 0 ? (
                    userProducts.map(product => (
                        <TouchableOpacity
                            key={product._id}
                            style={tw`flex-row items-center mb-4 p-3 bg-gray-50 rounded-lg`}
                            onPress={() => navigation.navigate('EditProduct', { productId: product._id })}
                        >
                            <Image
                                source={{ uri: product.images[0] }}
                                style={tw`w-16 h-16 rounded-md mr-3`}
                            />
                            <View style={tw`flex-1`}>
                                <Text style={tw`font-medium text-gray-800`}>{product.name}</Text>
                                <Text style={tw`text-green-700 font-bold`}>{product.price}</Text>
                            </View>
                            <View style={[
                                tw`px-2 py-1 rounded-full`,
                                product.status === 'active' ? tw`bg-green-100` : tw`bg-gray-200`
                            ]}>
                                <Text style={product.isActive ? tw`text-green-800` : tw`text-gray-600`}>
                                    {product.isActive ? 'Active' : 'Inactive'}
                                </Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={tw`items-center py-6`}>
                        <Text style={tw`text-gray-500`}>No products listed yet</Text>
                    </View>
                )}
            </View>


            {/* Account Settings */}
            <View style={tw`mt-4 bg-white mb-10 p-5`}>
                <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Account Settings</Text>

                {[
                    { icon: 'edit', label: 'Edit Profile', screen: 'EditProfile' },
                    // { icon: 'lock', label: 'Change Password', screen: 'ChangePassword' },
                    { icon: 'receipt', label: 'Purchase History', screen: 'PurchaseHistory' },
                    { icon: 'help', label: 'Help Center', screen: 'Help' },
                ].map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={tw`flex-row items-center py-4 border-b border-gray-100`}
                        onPress={() => navigation.navigate(item.screen)}
                    >
                        <MaterialIcons name={item.icon} size={24} color="green" />
                        <Text style={tw`ml-4 text-gray-700 flex-1`}>{item.label}</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    style={tw`flex-row items-center py-4 border-b border-gray-100`}
                    onPress={() => navigation.navigate('Login')}
                >
                    <MaterialIcons name={'logout'} size={24} color="green" />
                    <Text style={tw`ml-4 text-gray-700 flex-1`}>Log Out</Text>
                    <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Profile;