import * as React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


// Your screens
import HomeScreen from './pages/Home';
import Search from './pages/Search';
import Cart from './pages/cart';
import Profile from './pages/profile';
import ProductDetail from './pages/productDetail';
import Login from './pages/login';
import Signup from './pages/SignUp';
import useCartStore from './zustand/useProduct';
import Catagory from './pages/Catagory';
import NotificationPage from './pages/Notfication';
import ForgetPassword from './pages/ForgetPassword';
import SelectPersonScreen from './pages/SelectPersonScreen';
import ChatScreen from './pages/ChatScreen';
import PurchaseHistoryScreen from './pages/User/PurchaseHistiory';
import EditProfile from './pages/User/EditProfile';
import AddProduct from './pages/User/AddProduct';
import PaymentScreen from './pages/PaymentScreen';
import HelpCenterScreen from './pages/HelpCenter';
// import EditProductScreen from './pages/User/EditProduct';


const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator(); // New stack for authentication

// Custom Header Component
const CustomHeader = ({ navigation }) => (
  <View style={styles.headerContainer}>
    <View style={styles.logoContainer}>
      <Image
        source={require('./assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>


    <TouchableOpacity
      onPress={() => navigation.navigate('Messages')}
      style={styles.messageIconContainer}
    >
      <Icon name="message" size={28} color="green" />
    </TouchableOpacity>


  </View>
);

// Common screen options for all stack navigators
const commonStackOptions = {
  header: ({ navigation }) => <CustomHeader navigation={navigation} />,
};

function AuthStackScreen({ setIsLoggedIn }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login">
        {(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="Signup" component={Signup} />
      <AuthStack.Screen name="Forgetpassword" component={ForgetPassword} />

    </AuthStack.Navigator>
  );
}

// Stack navigators for main app
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={commonStackOptions}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />


      <HomeStack.Screen name="Messages" component={SelectPersonScreen} options={commonStackOptions} />
      <HomeStack.Screen name="Chat" component={ChatScreen} options={commonStackOptions} />

      <HomeStack.Screen name="Category" component={Catagory} options={commonStackOptions} />
      <HomeStack.Screen name="ProductDetail" component={ProductDetail} options={commonStackOptions} />
    </HomeStack.Navigator>
  );
}

function SearchStackScreen() {
  return (
    <SearchStack.Navigator screenOptions={commonStackOptions}>
      <SearchStack.Screen name="SearchMain" component={Search} />
      <SearchStack.Screen name="ProductDetail" component={ProductDetail} options={commonStackOptions} />

      <SearchStack.Screen name="Messages" component={SelectPersonScreen} options={commonStackOptions} />
      <SearchStack.Screen name="Chat" component={ChatScreen} options={commonStackOptions} />

    </SearchStack.Navigator>
  );
}

const CartStack = createNativeStackNavigator();
function CartStackScreen() {
  return (
    <CartStack.Navigator screenOptions={commonStackOptions}>
      <CartStack.Screen name="CartMain" component={Cart} />
      <CartStack.Screen name="Payment" component={PaymentScreen} />
      <CartStack.Screen name="Messages" component={SelectPersonScreen} options={commonStackOptions} />
      <CartStack.Screen name="Chat" component={ChatScreen} options={commonStackOptions} />
    </CartStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={commonStackOptions}>

      <ProfileStack.Screen name="ProfileMain" component={Profile} />
      <ProfileStack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} options={commonStackOptions} />

      <ProfileStack.Screen name="EditProfile" component={EditProfile} options={commonStackOptions} />
      <ProfileStack.Screen name="AddProduct" component={AddProduct} options={commonStackOptions} />

      <ProfileStack.Screen name="Messages" component={SelectPersonScreen} options={commonStackOptions} />
      <ProfileStack.Screen name="Chat" component={ChatScreen} options={commonStackOptions} />

      <ProfileStack.Screen name="Help" component={HelpCenterScreen} options={commonStackOptions} />
      <ProfileStack.Screen name="Login" component={Login} options={commonStackOptions} >

      </ProfileStack.Screen>
      {/* <ProfileStack.Screen name="EditProduct" component={EditProductScreen} options={commonStackOptions} /> */}

    </ProfileStack.Navigator>
  );
}


function NotficationStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={commonStackOptions}>
      <ProfileStack.Screen name="Notfication" component={NotificationPage} />

      <ProfileStack.Screen name="Messages" component={SelectPersonScreen} options={commonStackOptions} />
      <ProfileStack.Screen name="Chat" component={ChatScreen} options={commonStackOptions} />

    </ProfileStack.Navigator>
  );
}

// Main Tab Navigator
function MainTabNavigator() {
  const cartProducts = useCartStore((state) => state.cartProducts);

  // Handle case when cart is not yet loaded
  const cartCount = cartProducts ? cartProducts.length : 0;
  const badgeText = cartCount > 9 ? '9+' : cartCount > 0 ? String(cartCount) : null;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#15803d',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: 6,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={24} color={color} style={{ marginTop: 6 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="search" size={24} color={color} style={{ marginTop: 6 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Notfication"
        component={NotficationStackScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="notifications" size={24} color={color} style={{ marginTop: 6 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStackScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="shopping-cart" size={24} color={color} style={{ marginTop: 6 }} />
          ),
          tabBarBadge: badgeText,
          tabBarBadgeStyle: {
            backgroundColor: '#ef4444',
            color: 'white',
            fontSize: 10,
            top: 6,
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="person" size={24} color={color} style={{ marginTop: 6 }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const loadCart = useCartStore((state) => state.loadCart);

  React.useEffect(() => {
    loadCart(); // Load cart from AsyncStorage when app starts
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainTabNavigator />
      ) : (
        <AuthStackScreen setIsLoggedIn={setIsLoggedIn} />
      )}
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 28,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 80,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 110,
    height: 44,
  },
  messageIconContainer: {
    padding: 8,
  },
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    backgroundColor: '#fff',
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

