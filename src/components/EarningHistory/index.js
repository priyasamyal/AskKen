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
class EarningHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            callHistory: [],
            life_time_earning: 0,
            totalTipAmount: 0,
            solvedIssue: 0,
            tickets: [],
            rating: "",
            account_link: true
        };

    }
    componentDidMount() {
        this.expertEarningHistory();
       // console.log("commonData.user_details", this.props.user);
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
        }
        //     console.log(param, 'param');
        postApiRequestWithHeaders(commonData.api_endpoint.earningsHistory, param, this.props.user.access_token).then(
            res => {
              //console.log(res, "earnres....");
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
                        <View style={styles.top_container}>
                            <Text style={styles.earningHeading}>${this.state.life_time_earning}</Text>
                            <Text style={styles.total_earning}>Total Earnings</Text>
                            {!this.state.account_link &&(
                                    <TouchableOpacity onPress={() => this.navigator("payment")}>
                                    <Text style={styles.cash_out}>Cash Out Now</Text>
                                    </TouchableOpacity>
                            )}
                          
                        </View>
                        <View style={[styles.history,{marginTop:10}]}>
                            <View style={styles.history_inner}>
                                <Image style={styles.trophy_image} source={trophy} resizeMode='contain' />
                                <Text style={styles.status_text}>
                                    {
                                        this.state.rating == null ? "No Rating" : this.state.rating <= 2 ? "Poor" : this.state.rating > 2 && this.state.rating <= 4 ? "Average" : "Excellent"
                                    }
                                
                                </Text>
                            </View>
                            <View style={styles.history_inner}>
                                <Image style={styles.trophy_image} source={earning_check} resizeMode='contain' />
                                <Text style={styles.status_text}>{this.state.solvedIssue} Solved {this.state.solvedIssue!=1?"Issues" :"Issue"}</Text>
                            </View>
                            <View style={styles.history_inner}>
                                <Image style={styles.trophy_image} source={tips} resizeMode='contain' />
                                <Text style={styles.status_text}>${this.state.totalTipAmount} Tips</Text>
                            </View>
                        </View>
                        <View>
                        </View>

                        <View style={{ marginTop: 20,  }}>
                            {this.state.tickets.map(m=>{
                                    return( <View style={{ borderBottomWidth: 0.5, borderColor: colors.card_border_outline, marginBottom: 15 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                          {m.file_type =="photo" &&(
                                                <Image   source={{
                                                uri: m.file_name
                                                }}style={[styles.ticket_image, { flex: 0.4, }]}/>
                                            )}

                                            {m.file_type !="photo" &&(
                                                <Video 
                                                paused={"true"}
                                                resizeMode="cover"
                                                source={{ uri: m.file_name }}
                                                style={[styles.backgroundVideo,{zIndex:1, backgroundColor:colors.card_border_outline}]} />
                                            )}  
                                            <View style={{ flex: 0.6, alignItems: 'flex-start', paddingLeft: 10 ,}}>
                                                <Text style={styles.category_name}>{m.category_name}</Text>
                                                <Text style={[styles.category_desc, { fontSize: 17 ,fontFamily: 'Avenir-Light',}]}>{m.description}</Text>
                                                <Text style={[styles.category_desc, { fontSize: 17 ,fontFamily: 'Avenir-Light',}]}>{moment(m.completedAt).format("MMM DD, h:mma")}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 15, paddingTop: 10, borderBottomWidth: 0.5, borderColor: colors.card_border_outline }}>
                                            <Text style={[styles.category_name,]}>Total Earned</Text>
                                            <Text style={[styles.category_name,]}>${parseFloat(m.total_earning).toFixed(2)}</Text>
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
                                            <Text style={styles.category_desc}>{m.status =="pending"? "Account not linked":"Sent to account ending in "+m.account }</Text>
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
export default connect(mapStateToProps, {})(EarningHistory);