//import liraries

import React, { Component } from 'react';
import SwipeablePanel from 'rn-swipeable-panel';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, LayoutAnimation, ScrollView, Animated, Platform } from 'react-native';
import * as Animatable from "react-native-animatable";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
// create a component
class swipeFooter extends Component {
    constructor() {
        super();
        this.state = {

        }

    }

    componentWillMount() {
        this.searchHeight = new Animated.Value(100);
    }

    increaseHeightofSearch = () => {
        Animated.timing(this.searchHeight, {
            toValue: deviceHeight,
            duration: 500
        }).start(() => {
        })
    }
    decreaseHeightofSearch = () => {
        console.log(this.searchHeight._value);
        if (this.searchHeight._value == 100) {
            Animated.timing(this.searchHeight, {
                toValue: 50,
                duration: 500
            }).start()
        } else {
            Animated.timing(this.searchHeight, {
                toValue: 100,
                duration: 500
            }).start()
        }

    }

    render() {
        const searchMarginTop = this.searchHeight.interpolate({
            inputRange: [0, deviceHeight],
            outputRange: [20, 90],
            extrapolate: "clamp"
        });
        return (
            <View style={styles.container}>
                <Animatable.View animation="slideInUp" style={[styles.overlay]} iterationCount={1}>
                    <Animated.View style={{ height: this.searchHeight }} >

                        <TouchableOpacity
                            onPress={() => this.decreaseHeightofSearch()}>
                            <Animated.View style={{
                                flex: 1,
                                margin: 15,
                                justifyContent: 'center',
                                marginTop: searchMarginTop,
                            }}>
                                <View
                                    pointerEvents='none'
                                    style={[styles.searchBar]}>
                                    <Text>Hii</Text>

                                </View>
                            </Animated.View>
                        </TouchableOpacity>

                    </Animated.View>
                </Animatable.View>
            </View>

        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: 'red',
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0
    },

    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        bottom: 0,
        borderRadius: 15,
        backgroundColor: 'white',
        width: deviceWidth,
        paddingRight: 10,
        borderWidth: 1,
        borderColor: "#e0e0e1",

    },
});

//make this component available to the app
export default swipeFooter;
