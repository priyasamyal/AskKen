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
import commonData from '../../common/data.js';
import * as Animatable from "react-native-animatable";
import { colors } from '../../common';

const info = require('../../assets/imgs/info_icon.png');
const userImage = require("../../assets/imgs/default_profile.png");
const checkImg = require("../../assets/imgs/job-done.png");
// create a component
class CommonAlert extends Component {

    componentDidMount() {
        //console.log(this.props)
    }

    handleViewRef = ref => this.view = ref;
    navigator = page => {
        switch (page) {
            case "back":
                this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
                setTimeout(() => {
                    this.props.clickHandler('back');
                }, 420);
                //  
                break;
            case "end":
                this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
                setTimeout(() => {
                    this.props.clickHandler('end');
                }, 420);
                break;
            default:
                this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
                setTimeout(() => {
                    this.props.clickHandler(page);
                }, 420);
                break;
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
                    {this.props.type == "home_alert" && (
                        <View style={[styles.inner_container, {}]}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, marginBottom: 5 }}>

                                <Image
                                    style={[
                                        {
                                            height: 40,
                                            width: 40,
                                            marginBottom: 15,
                                            marginTop: 10,
                                            resizeMode: 'contain',
                                        },
                                    ]}
                                    source={info}
                                />


                                <Text style={styles.header_text}>{this.props.title}</Text>
                                <Text style={styles.description_text}>{this.props.msg}</Text>
                            </View>
                            <View style={{ borderTopWidth: 1, width: "110%", alignItems: 'center', justifyContent: 'center', borderColor: colors.receiver_color, padding: 5 }}>
                                {this.props.title != "Refund" && (
                                    <Button full transparent onPress={() => this.navigator('cancel')} >
                                        <Text style={styles.end_btn_txt} >Continue</Text>
                                    </Button>
                                )}
                            </View>
                        </View>
                    )}

                    {this.props.type == "common_alert" && (
                        <View style={[styles.inner_container, {}]}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, marginBottom: 5 }}>

                                <Image
                                    style={[
                                        {
                                            height: 35,
                                            width: 35,
                                            marginBottom: 15,
                                            marginTop: 10,
                                            resizeMode: 'contain',
                                        },
                                    ]}
                                    source={info}
                                />


                                <Text style={[styles.header_text, { fontSize: 23 }]}>{this.props.title}</Text>
                                <Text style={styles.description_text}>{this.props.msg}</Text>
                            </View>
                            <View style={{ borderTopWidth: 1, width: "110%", alignItems: 'center', justifyContent: 'center', borderColor: colors.receiver_color, padding: 5 }}>
                                {this.props.title != "Refund" && (
                                    <Button full transparent onPress={() => this.navigator('cancel')} >
                                        <Text style={styles.end_btn_txt} >Close</Text>
                                    </Button>
                                )}
                            </View>
                        </View>
                    )}


            {this.props.type == "wait" && (
                        <View style={[styles.inner_container, {}]}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, marginBottom: 5 }}>

                                <Image
                                    style={[
                                        {
                                            height: 35,
                                            width: 35,
                                            marginBottom: 15,
                                            marginTop: 10,
                                            resizeMode: 'contain',
                                        },
                                    ]}
                                    source={info}
                                />


                                <Text style={[styles.header_text, { fontSize: 23 }]}>{this.props.title}</Text>
                                <Text style={styles.description_text}>{this.props.msg}</Text>
                            </View>
                            <View style={{ borderTopWidth: 1, width: "110%", alignItems: 'center', justifyContent: 'center', borderColor: colors.receiver_color, padding: 5 }}>
                                {this.props.title != "Refund" && (
                                    <Button full transparent onPress={() => this.navigator('cancel')} >
                                        <Text style={styles.end_btn_txt} >Okay</Text>
                                    </Button>
                                )}
                            </View>
                        </View>
                    )}

                    {this.props.type == "job_cancel" && (
                        <View style={[styles.inner_container, { paddingTop: 20, paddingBottom: 10 }]}>
                            <Image
                                style={[
                                    {
                                        height: 35,
                                        width: 35,
                                        marginBottom: 15,
                                        marginTop: 10,
                                        resizeMode: 'contain',
                                    },
                                ]}
                                source={info}
                            />
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, }}>
                                <Text style={[styles.header_text, { fontSize: 22 }]}>{this.props.title}</Text>
                                <Text style={[styles.description_text_pay, {}]}>{this.props.msg}</Text>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: colors.receiver_color, width: "110%", marginTop: 20 }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Button full transparent onPress={() => this.navigator('over')} >
                                    <Text style={[styles.end_btn_txt_pay, { fontFamily: 'Avenir-Heavy', }]} >Start Over</Text>
                                </Button>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: colors.receiver_color, width: "110%" }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Button style={{}} full transparent onPress={() => this.navigator('cancel')} >
                                    <Text style={[styles.end_btn_txt_pay, { color: colors.BLACK_TEXT, fontFamily: 'Avenir-Heavy' }]} >Cancel</Text>
                                </Button>
                            </View>
                        </View>
                    )}
                     {this.props.type == "job_cancel_by_pro" && (
                        <View style={[styles.inner_container, { paddingTop: 20, paddingBottom: 10 }]}>
                            <Image
                                style={[
                                    {
                                        height: 35,
                                        width: 35,
                                        marginBottom: 15,
                                        marginTop: 10,
                                        resizeMode: 'contain',
                                    },
                                ]}
                                source={info}
                            />
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, }}>
                                <Text style={[styles.header_text, { fontSize: 22 }]}>{this.props.title}</Text>
                                <Text style={[styles.description_text_pay, {}]}>{this.props.msg}</Text>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: colors.receiver_color, width: "110%", marginTop: 20 }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Button full transparent onPress={() => this.navigator('cancel_pro')} >
                                    <Text style={[styles.end_btn_txt_pay, { fontFamily: 'Avenir-Heavy', }]} >Can't help</Text>
                                </Button>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: colors.receiver_color, width: "110%" }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Button style={{}} full transparent onPress={() => this.navigator('cancel')} >
                                    <Text style={[styles.end_btn_txt_pay, { color: colors.BLACK_TEXT, fontFamily: 'Avenir-Heavy' }]} >Cancel</Text>
                                </Button>
                            </View>
                        </View>
                    )}
                    {this.props.type == "find_pro" && (
                        <View style={[styles.inner_container, { paddingTop: 20, paddingBottom: 10 }]}>
                            <Image
                                style={[
                                    {
                                        height: 35,
                                        width: 35,
                                        marginBottom: 15,
                                        marginTop: 10,
                                        resizeMode: 'contain',
                                    },
                                ]}
                                source={info}
                            />
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, }}>
                                <Text style={[styles.header_text, { fontSize: 22 }]}>{this.props.title}</Text>
                                <Text style={[styles.description_text_pay, {}]}>{this.props.msg}</Text>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: colors.receiver_color, width: "110%", marginTop: 20 }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Button full transparent onPress={() => this.navigator('find')} >
                                    <Text style={[styles.end_btn_txt_pay, { fontFamily: 'Avenir-Heavy', }]} >Replace Pro</Text>
                                </Button>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: colors.receiver_color, width: "110%" }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Button style={{}} full transparent onPress={() => this.navigator('cancel')} >
                                    <Text style={[styles.end_btn_txt_pay, { color: colors.BLACK_TEXT, fontFamily: 'Avenir-Heavy' }]} >Cancel</Text>
                                </Button>
                            </View>
                        </View>
                    )}
                    {this.props.type == "pay_pro" && (
                        <View style={[styles.inner_container, { paddingTop: 20, paddingBottom: 10 }]}>
                            <Image
                                style={[
                                    {   height: 55,
                                        width: 55,
                                        marginBottom: 15,
                                        marginTop: 10,
                                        resizeMode: 'contain',
                                        borderRadius:30
                                    },
                                ]}
                               source={{ uri: commonData.profile_picture_url + this.props.expert_profile }}
                            />
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, }}>
                                <Text style={[styles.header_text, { fontSize: 22 }]}>{this.props.title}</Text>
                                <Text style={[styles.description_text_pay, {}]}>{this.props.msg}</Text>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: colors.receiver_color, width: "110%", marginTop: 20 }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Button full transparent onPress={() => this.navigator('job_done')} >
                                    <Text style={[styles.end_btn_txt_pay, { fontFamily: 'Avenir-Heavy', }]} >I'm Satisfied</Text>
                                </Button>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: colors.receiver_color, width: "110%" }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Button style={{}} full transparent onPress={() => this.navigator('still_work')} >
                                    <Text style={[styles.end_btn_txt_pay, { color: colors.BLACK_TEXT, fontFamily: 'Avenir-Heavy' }]} >We're Still Working</Text>
                                </Button>
                            </View>
                          
                        </View>
                    )}

{this.props.type == "pay_pro_by_owner" && (
                        <View style={[styles.inner_container, { paddingTop: 20, paddingBottom: 10 }]}>
                            <Image
                                style={[
                                    {   height: 55,
                                        width: 55,
                                        marginBottom: 15,
                                        marginTop: 10,
                                        resizeMode: 'contain',
                                        borderRadius:30
                                    },
                                ]}
                               source={{ uri: commonData.profile_picture_url + this.props.expert_profile }}
                            />
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, }}>
                                <Text style={[styles.header_text, { fontSize: 22 }]}>{this.props.title}</Text>
                                <Text style={[styles.description_text_pay, {}]}>{this.props.msg}</Text>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: colors.receiver_color, width: "110%", marginTop: 20 }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Button full transparent onPress={() => this.navigator('pay_pro')} >
                                    <Text style={[styles.end_btn_txt_pay, { fontFamily: 'Avenir-Heavy', }]} >I'm Satisfied</Text>
                                </Button>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: colors.receiver_color, width: "110%" }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Button style={{}} full transparent onPress={() => this.navigator('cancel')} >
                                    <Text style={[styles.end_btn_txt_pay, { color: colors.BLACK_TEXT, fontFamily: 'Avenir-Heavy' }]} >We're Still Working</Text>
                                </Button>
                            </View>
                          
                        </View>
                    )}

                    {this.props.type == "job_done" && (
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
                                source={checkImg}
                            />
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, }}>
                                <Text style={[styles.header_text, { fontSize: 22 }]}>{this.props.title}</Text>
                                <Text style={[styles.description_text_pay, {}]}>{this.props.msg}</Text>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: colors.receiver_color, width: "110%", marginTop: 20 }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Button full transparent onPress={() => this.navigator('job_done')} >
                                    <Text style={[styles.end_btn_txt_pay, { fontFamily: 'Avenir-Heavy', }]} >Job Done</Text>
                                </Button>
                            </View>
                            <View style={{ borderTopWidth: 1, borderColor: colors.receiver_color, width: "110%" }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Button style={{}} full transparent onPress={() => this.navigator('cancel')} >
                                    <Text style={[styles.end_btn_txt_pay, { color: colors.BLACK_TEXT, fontFamily: 'Avenir-Heavy' }]} >Still Working</Text>
                                </Button>
                            </View>
                        </View>
                    )}


                </Animatable.View>

            </View>
        );
    }
}


//make this component available to the app
export default CommonAlert;
