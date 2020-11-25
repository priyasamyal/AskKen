//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Linking, Image, Share } from 'react-native';
import {
    Button,

} from 'native-base';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width } = Dimensions.get('window');
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
const invite = require('../../assets/imgs/invite.jpg');

class Invite extends Component {

    navigator = (action) => {
        switch (action) {
            case 'invite': {
                Share.share({
                    message:
                        "Follow me on Ask Ken, an app I'm using. https://www.askkenapp.com/api/invite.php",
                });
                break;
            }

            default:
                break;
        }

    };
    render() {
        return (
            <View style={styles.container}>
                <View>

                    <Image
                        style={styles.invite_image}
                        source={invite}
                    />
                    <Text style={styles.higlight} >Spread the word!</Text>
                    <Text style={styles.description}>Earn perks and special bonuses {'\n'} when you refer friends who join {'\n'} Ask Ken's community of experts! </Text>
                </View>
                <View style={styles.btncontainer}>
                    <Button
                        hitSlop={hitSlop}
                        block
                        style={styles.btn_inner}
                        onPress={() => this.navigator('invite')}>
                        <Text style={styles.btn_txt}>Invite a Friend </Text>
                    </Button>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    btncontainer: {
        width: width,
        paddingRight: 40,
        paddingLeft: 40,
        marginBottom: 30,
    },
    btn_inner: {
        backgroundColor: colors.THEME_YELLOW,
        height: 55,
    },
    btn_txt: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'PTSans-Regular',
        fontSize: 20,
        fontWeight: 'bold',
    },
    black_text: {
        color: colors.BLACK_TEXT,
        paddingLeft: 10,
    },
    higlight: {
        fontFamily: 'PTSans-Bold',
        fontSize: 27,
        textAlign: 'center',
        letterSpacing: 0.8,
        color: colors.BLACK_TEXT
    },
    description: {
        marginTop: 8,
        fontFamily: 'PTSans-Regular',
        fontSize: 16,
        textAlign: 'center',
        color: colors.GREY_TEXT
        //letterSpacing: 0.8,
    },
    invite_image: {
        alignSelf: 'center',
        width: 400,
        height: 200,
        resizeMode: 'contain',
        marginTop: 30, marginBottom: 10
    }
});

//make this component available to the app
export default Invite;
