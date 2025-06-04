import React from 'react';
import { View, StyleSheet } from 'react-native';
import tw from 'twrnc';

const Shimmer = ({ style }) => {
    return (
        <View style={[styles.shimmer, tw`bg-gray-200 animate-pulse rounded`, style]}>
            <View style={[styles.shimmerInner, tw`bg-gray-300`]} />
        </View>
    );
};

const styles = StyleSheet.create({
    shimmer: {
        overflow: 'hidden',
        position: 'relative',
    },
    shimmerInner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.3,
    },
});

export default Shimmer;