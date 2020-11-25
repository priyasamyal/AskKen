//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, ScrollView, FlatList } from 'react-native';
import styles from './styles';
import Video from 'react-native-video';
import moment from 'moment';
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
import { colors } from '../../common/index';
import {
    postApiRequestWithHeaders,
    getItem,
    showToast,
    errorHandler,
} from '../../common/user';
import commonData from '../../common/data.js';
import { connect } from "react-redux";
// create a component
const average = require('../../assets/imgs/average_rate.png');
const poor = require('../../assets/imgs/poor_rate.png');
const home_default = require('../../assets/imgs/home_default.png');
const tips = require('../../assets/imgs/tips.png');
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
const earning_check = require('../../assets/imgs/earning_check.png');
const trophy = require('../../assets/imgs/trophy.png');
class CallHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            callHistory: [],
            life_time_earning: 0,
            totalTipAmount: 0,
            solvedIssue: 0,
            tickets: [],
            rating: "",
            account_link: true,
            show_msg:false
        };

    }
    componentDidMount() {
        this.expertEarningHistory();
        console.log("commonData.user_details", this.props.user);
        this.clearCount();
    }
    /**
     * Clear Notification COunt
     */
    clearCount = () => {
        this.props.showLoader();
        const param = { };
        postApiRequestWithHeaders(commonData.api_endpoint.mark_read, param, this.props.user.access_token).then(
            res => {
              //  console.log(res, "mark_read....");
            },
            error => {
                this.props.closeLoader();
                errorHandler(error, this.props);
            },
        );
    };

    /**
    * expertEarningHistory
    * Method for integarte expert earning history API & save it from state 
    */

    expertEarningHistory = () => {
        this.props.showLoader();
        const param = {
            user_id: this.props.user.user_id,
            "time_zone": commonData.time_zone,
        };
        if (this.props.user.user_type != 'owner') {
            param.is_expert = 1;
        } else {
            param.is_expert = 0;
        }
        //     console.log(param, 'param');
        postApiRequestWithHeaders(commonData.api_endpoint.earningsHistory, param, this.props.user.access_token).then(
            res => {
                console.log(res, "earnres....");
                if (res.tickets.length ==0) {
                    this.setState({
                        show_msg:true
                    })
                }
                this.setState({
                    life_time_earning: res.total_earnings,
                    totalTipAmount: res.tip_amount,
                    solvedIssue: res.solved_issues,
                    tickets: res.tickets,
                    rating: res.rating,
                    account_link:res.account_link
                });
                setTimeout(() => {
                    this.props.closeLoader();
                }, 1000);

            },
            error => {
                this.props.closeLoader();
                errorHandler(error, this.props);
                this.setState({
                    show_msg:true
                })
            },
        );
    };


    navigator = action => {
        switch (action) {
            case 'payment': {
                this.props.clickHandler(action)
                break;
            }
            case 'payment': {
                this.props.clickHandler(payment)
                break;
            } 
            default:
                break;
        }
    };



    render() {
        return (
            <Container style={{borderTopWidth: 1, borderColor: colors.input_border,}}>
                <ScrollView>
                    <View style={styles.mainContainer}>
                 
                    <View style={{alignItems:'center'}}>
          {this.state.show_msg == true &&(
              <Text style={[styles.name,{}]}>No History Available</Text>
          )}     
        </View>

                        <View style={{ marginTop: 20, }}>
                            {this.state.tickets.map(m=>{
                                    return( <View style={{ borderBottomWidth: 0.5, borderColor: colors.card_border_outline, marginBottom: 20 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                          {m.file_type =="photo" &&(
                                                <Image   source={{
                                                uri: m.file_name
                                                }}style={[styles.ticket_image, { flex: 0.4,backgroundColor:colors.card_border_outline }]}/>
                                            )}

                                            {m.file_type !="photo" &&(
                                                <Video 
                                                paused={"true"}
                                                resizeMode="cover"
                                                source={{ uri: m.file_name }}
                                                style={[styles.backgroundVideo,{zIndex:1, backgroundColor:colors.card_border_outline}]} />
                                            )}  
                                            <View style={{ flex: 0.6, alignItems: 'flex-start', paddingLeft: 10 }}>
                                                <Text style={styles.category_name}>{m.category_name}</Text>
                                                <Text style={[styles.category_desc, { fontSize: 17 }]}>{m.description}</Text>
                                                <Text style={[styles.category_desc, { fontSize: 17 }]}>{moment(m.createdAt).format("MMM DD, h:mma")}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 15, paddingTop: 10, borderBottomWidth: 0.5, borderColor: colors.card_border_outline }}>
                                            <Text style={[styles.category_name,]}>Total Paid</Text>
                                            <Text style={[styles.category_name,]}>${parseFloat(m.total_earning).toFixed(2)}</Text>
                                        </View >
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 15, paddingTop: 15, borderBottomWidth: 0.5, borderColor: colors.card_border_outline }}>
                                            <Text style={[styles.category_name,{fontFamily: 'AvenirLTStd-Medium',paddingTop:5}]}>My Pro</Text>
                                            <Text style={[styles.category_name,{fontFamily: 'Avenir-Light',}]}>{m.expert_name != null?m.expert_name:"Not Assigned" }</Text>
                                        </View >
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, }}>
                                            <Text style={styles.category_desc}>Base Fee</Text>
                                            <Text style={styles.category_desc}>${parseFloat(m.base_fee).toFixed(2)}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={styles.category_desc}>Tip</Text>
                                            <Text style={styles.category_desc}>${m.tip != null? parseFloat(m.tip).toFixed(2): "0.00"}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={styles.category_desc}>Status</Text>
                                            <Text style={styles.category_desc}>{m.status =="marked_by_owner"? "Amount paid":m.status =="assigned"?"Amount will pay after job done":"Amount not paid" }</Text>
                                        </View>
                                    
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                            <Text style={styles.category_name}>Total</Text>
                                            <Text style={styles.category_name}>${parseFloat(m.total_earning).toFixed(2)}</Text>
                                        </View>
        
                                    </View>)
                            })}                  
                        </View>
                    </View>


                </ScrollView>
            </Container >
        );
    }
}


function mapStateToProps(state) {
    return {
        user: state.user.userData,
    }
}
//make this component available to the app
export default connect(mapStateToProps, {})(CallHistory);