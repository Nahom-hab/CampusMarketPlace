import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';

const HelpCenterScreen = () => {
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const faqCategories = [
        {
            title: "Ordering & Payments",
            icon: "shopping-cart",
            questions: [
                {
                    question: "How do I place an order?",
                    answer: "To place an order:\n1. Browse products and add items to your cart\n2. Go to your cart and review items\n3. Proceed to checkout\n4. Select payment method and delivery option\n5. Confirm your order"
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept:\n- Telebirr\n- Bank transfers (CBE, Awash, Dashen, etc.)\n- Cash on delivery (Addis Ababa only)\n- Mobile banking"
                },
                {
                    question: "How can I track my order?",
                    answer: "After placing an order:\n1. Go to 'My Orders' in your account\n2. Select the order you want to track\n3. You'll see the current status and tracking information\n4. You'll also receive SMS updates"
                }
            ]
        },
        {
            title: "Delivery & Shipping",
            icon: "truck",
            questions: [
                {
                    question: "What are the delivery options?",
                    answer: "We offer:\n1. Standard Delivery (3-5 business days)\n2. Express Delivery (1-2 business days, Addis only)\n3. Campus Pickup (Selected universities)\n4. Store Pickup (Our location in Addis)"
                },
                {
                    question: "How much does delivery cost?",
                    answer: "Delivery costs vary:\n- Standard: ETB 25-50 depending on location\n- Express: ETB 75\n- Campus/Store Pickup: Free\nDelivery fees are calculated at checkout."
                },
                {
                    question: "Do you deliver outside Addis Ababa?",
                    answer: "Yes! We deliver to major cities across Ethiopia including:\n- Bahir Dar\n- Dire Dawa\n- Hawassa\n- Mekelle\n- Gondar\nDelivery times may be longer outside Addis."
                }
            ]
        },
        {
            title: "Returns & Refunds",
            icon: "refresh",
            questions: [
                {
                    question: "What is your return policy?",
                    answer: "You may return items within 7 days of delivery if:\n- Item is defective/damaged\n- Wrong item was delivered\n- Item doesn't match description\nOriginal tags must be attached and item unused."
                },
                {
                    question: "How do I request a refund?",
                    answer: "To request a refund:\n1. Contact our support team within 7 days\n2. Provide order details and reason\n3. We'll arrange pickup of returned item\n4. Refund processed within 3-5 business days after inspection"
                },
                {
                    question: "How long do refunds take?",
                    answer: "Refund processing times:\n- Bank transfers: 3-5 business days\n- Telebirr: 1-2 business days\n- Credit cards: 5-7 business days\nYou'll receive notification when processed."
                }
            ]
        },
        {
            title: "Account & Security",
            icon: "user-shield",
            questions: [
                {
                    question: "How do I reset my password?",
                    answer: "To reset your password:\n1. Go to Login screen\n2. Tap 'Forgot Password'\n3. Enter your registered phone number\n4. You'll receive an OTP to reset\n5. Create new password"
                },
                {
                    question: "Is my payment information secure?",
                    answer: "Absolutely! We use:\n- SSL encryption for all transactions\n- Payment processors compliant with PCI DSS\n- Never store full payment details\n- Two-factor authentication for sensitive actions"
                },
                {
                    question: "How do I update my account information?",
                    answer: "To update your account:\n1. Go to 'My Account'\n2. Select 'Profile Settings'\n3. Edit your details\n4. Save changes\nFor phone number changes, contact support."
                }
            ]
        }
    ];

    const contactOptions = [
        {
            title: "Call Support",
            icon: "phone",
            action: () => Linking.openURL('tel:+251911234567')
        },
        {
            title: "Email Us",
            icon: "envelope",
            action: () => Linking.openURL('mailto:support@yourstore.com')
        },
        {
            title: "Live Chat",
            icon: "comments",
            action: () => console.log("Open live chat")
        },
        {
            title: "Visit Store",
            icon: "map-marker",
            action: () => Linking.openURL('https://maps.google.com/?q=Your+Store+Addis+Ababa')
        }
    ];

    const supportHours = [
        { day: "Monday-Friday", hours: "8:00 AM - 6:00 PM" },
        { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
        { day: "Sunday", hours: "Closed" }
    ];

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <ScrollView contentContainerStyle={tw`pb-32 px-4`}>
                {/* Header */}
                <View style={tw`py-6`}>
                    <Text style={tw`text-3xl font-bold text-center text-gray-800`}>Help Center</Text>
                    <Text style={tw`text-center text-gray-500 mt-2`}>We're here to help you</Text>
                </View>

                {/* Search Bar */}
                <View style={tw`bg-white rounded-lg shadow-sm p-3 mb-6 flex-row items-center border border-gray-200`}>
                    <Icon name="search" size={20} color="#228B22" style={tw`mr-3`} />
                    <Text style={tw`text-gray-500`}>Search help articles...</Text>
                </View>

                {/* Contact Options */}
                <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Quick Help</Text>
                <View style={tw`flex-row flex-wrap justify-between mb-6`}>
                    {contactOptions.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={tw`bg-white w-[48%] p-4 rounded-lg shadow-sm mb-3 items-center border border-gray-100`}
                            onPress={option.action}
                        >
                            <Icon2 name={option.icon} size={24} color="#228B22" style={tw`mb-2`} />
                            <Text style={tw`text-center font-medium text-gray-700`}>{option.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Support Hours */}
                <View style={tw`bg-green-50 rounded-lg p-4 mb-6 border border-green-100`}>
                    <Text style={tw`font-bold text-green-800 mb-2`}>Support Hours</Text>
                    {supportHours.map((item, index) => (
                        <View key={index} style={tw`flex-row justify-between py-1 border-b border-green-100 last:border-b-0`}>
                            <Text style={tw`text-green-700`}>{item.day}</Text>
                            <Text style={tw`text-green-700`}>{item.hours}</Text>
                        </View>
                    ))}
                </View>

                {/* FAQ Sections */}
                <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Frequently Asked Questions</Text>
                {faqCategories.map((category, catIndex) => (
                    <View key={catIndex} style={tw`mb-4`}>
                        <TouchableOpacity
                            style={tw`bg-white p-4 rounded-lg shadow-sm flex-row justify-between items-center border border-gray-200`}
                            onPress={() => toggleSection(catIndex)}
                        >
                            <View style={tw`flex-row items-center`}>
                                <Icon2 name={category.icon} size={18} color="#228B22" style={tw`mr-3`} />
                                <Text style={tw`font-bold text-gray-800`}>{category.title}</Text>
                            </View>
                            <Icon
                                name={expandedSections[catIndex] ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                size={24}
                                color="#228B22"
                            />
                        </TouchableOpacity>

                        {expandedSections[catIndex] && (
                            <View style={tw`mt-1 bg-white rounded-b-lg border border-t-0 border-gray-200`}>
                                {category.questions.map((item, qIndex) => (
                                    <View key={qIndex} style={tw`p-4 border-b border-gray-100 last:border-b-0`}>
                                        <Text style={tw`font-medium text-gray-800 mb-2`}>{item.question}</Text>
                                        <Text style={tw`text-gray-600`}>{item.answer}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}

                {/* Additional Help Section */}
                <View style={tw`bg-white rounded-lg shadow-sm p-5 mt-2 border border-gray-200`}>
                    <View style={tw`flex-row items-center mb-3`}>
                        <Icon3 name="help-circle-outline" size={24} color="#228B22" style={tw`mr-2`} />
                        <Text style={tw`text-lg font-bold text-gray-800`}>Still Need Help?</Text>
                    </View>
                    <Text style={tw`text-gray-600 mb-4`}>
                        Our customer support team is ready to assist you with any questions or issues you may have.
                    </Text>
                    <TouchableOpacity
                        style={tw`bg-green-600 py-3 px-4 rounded-lg flex-row items-center justify-center`}
                        onPress={() => Linking.openURL('tel:+251911234567')}
                    >
                        <Icon name="phone" size={18} color="white" style={tw`mr-2`} />
                        <Text style={tw`text-white font-bold`}>Contact Support Now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default HelpCenterScreen;