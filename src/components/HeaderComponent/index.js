//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
    Header,
    Left,
    Body,
    Right,
    Title,
    Button,
    Icon, Container
} from 'native-base';
import { colors } from '../../common';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
class HeaderComponent extends Component {
    headingStyle = { flex: 5 };
    render() {
        return (
            <Header transparent style={styles.header}>
                <Left>
                    <Button
                        transparent
                        hitSlop={hitSlop}
                        onPress={this.props.clickHandler}>
                        <Icon
                            style={[
                                styles.black_text,
                            ]}
                            name="arrow-back"
                        />
                    </Button>
                </Left>
                <Body style={this.headingStyle}>
                    <Image
                        style={[
                            {
                                marginLeft: 0,
                                height: 30,
                                width: 30,
                                resizeMode: 'contain',
                            },
                        ]}
                        source={require("../../assets/imgs/header_logo.jpg")}
                    />
                </Body>
                <Right />
            </Header>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    header: {
        margin: 5,
    },
    black_text: {
        color: colors.GREY_TEXT,
        paddingLeft: 10,
    },
});

//make this component available to the app
export default HeaderComponent;
