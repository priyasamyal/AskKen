//import liraries
//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import styles from './styles';
import {
    Container,
    Header,
    Content,
    Left,
    Button,
    Body,
    Right,
    Icon,
    Title,
} from 'native-base';

import * as Animatable from "react-native-animatable";
import { colors } from '../../common';

const info = require('../../assets/imgs/pop_end.png');
const userImage = require("../../assets/imgs/default_profile.png");
const checkImg = require("../../assets/imgs/job-done.png");
// create a component
class EndCallPopUp extends Component {
    handleViewRef = ref => this.view = ref;
    navigator = page => {
        switch (page) {
            case "back":
                console.log("back");
                this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
                setTimeout(() => {
                    this.props.clickHandler('back');
                }, 420);
                //  
                break;
            case "end":
                console.log("end");
                this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
                setTimeout(() => {
                    this.props.clickHandler('end');
                }, 420);
                break;
            default:
                break;
        }
    }
    bounce = () => this.view.bounce(800).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));

    render() {
        return (
            <View style={styles.container}>
                <Animatable.View animation="fadeInDown"
                    ref={this.handleViewRef}
                    duration={400} style={styles.inner_container}>
                         <View style={[styles.inner_container, { paddingTop: 20, paddingBottom: 2 }]}>
                            <Image
                                style={[
                                    {
                                        height: 50,
                                        width: 50,
                                        marginBottom: 15,
                                        marginTop: 10,
                                        resizeMode: 'contain',
                                    },
                                ]}
                                source={info}
                            />
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, }}>
                                <Text style={[styles.header_text, { fontSize: 22 }]}>End call?</Text>
                                <Text style={[styles.description_text_pay, {}]}>Are you sure you{'\n'}want to end this call?</Text>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: colors.receiver_color, width: "110%", marginTop: 20 }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center',padding:3 ,width:'100%'}}>
                                <Button full transparent onPress={() => this.navigator('end')} >
                                    <Text style={[styles.end_btn_txt_pay, { fontFamily: 'Avenir-Heavy', }]} >End Call</Text>
                                </Button>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: colors.receiver_color, width: "110%" }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center',padding:3 , width:'100%'}}>
                                <Button style={{}} full transparent onPress={() => this.navigator('back')} >
                                    <Text style={[styles.end_btn_txt_pay, { color: colors.BLACK_TEXT, fontFamily: 'Avenir-Heavy' }]} >Keep talking</Text>
                                </Button>
                            </View>
                        </View>
                  
                </Animatable.View>

            </View>
        );
    }
}


//make this component available to the app
export default EndCallPopUp;
