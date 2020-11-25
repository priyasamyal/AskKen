//import liraries
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import styles from './styles';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  Text,
  TextInput,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
  PushNotificationIOS,
  PermissionsAndroid,Dimensions
} from 'react-native';
var { width, height } = Dimensions.get('window');
// import Load from 'react-native-loading-gif';
import Load from 'react-native-loading-gif';
import {
  Radio,
  Container,
  Header,
  Content,
  Left,
  Button,
  Body,
  Right,
  Icon,
  Title,
  ListItem,
  List,
  CheckBox,
  Switch,
} from 'native-base';
import commonData from '../../common/data';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { connect } from "react-redux";
import { checkNotifications } from 'react-native-permissions';
import { alertWithTwoBtn } from '../../common/user';
import {
  postApiRequestWithHeaders,
  setItem,
  getItem,
  showToast,
  errorHandler,
} from '../../common/user';

import * as Animatable from 'react-native-animatable';
import { colors } from '../../common';
const bar = require('../../assets/imgs/bar.png');
const edit_payout = require('../../assets/imgs/edit_payout.png');
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { setUserData, setAllTickets } from "../../actions";
class SideMenu extends Component {
  // bounce = () =>
  //   this.view.slideOutRight(10).then(
  //     endState => {
  //       if (endState.finished) console.log(endState, 'endsate');
  //       this.props.parentCallback('close');
  //     },

  //     //
  //   );
  constructor(props) {
    super(props);
    console.log('inside consutructorrrrrr', this.props, this.props.from);
    this.state = {
      myText: 'I\'m ready to get swiped!',
      gestureName: 'none',
      backgroundColor: '#fff',
      isEnabled: this.props.user.push_enable
    }; 
    this.checkBoxes = React.createRef();
    console.log(this.props.user.current_ticket,"Side Menu ...hhhhhhh")
  }




  updateStripeStatus = (res) => {
    this.setState({ stripe_status: res });
  }

  togglePushApi = param => {
  //  this.navigator('close');
     param.user_id = this.props.user.user_id;
     postApiRequestWithHeaders(
       commonData.api_endpoint.update_profile,
       param, this.props.user.access_token
     ).then(
       data => {
         console.log(data, 'fhhsdghfhgshjgsdh');
         if (data.user.user_type != "owner") {
           this.setState({
             all_job: data.all_tickets
           })
           console.log(this.state)
           this.props.setAllTickets(data.all_tickets)
         } else {
           this.setState({
             current_ticket: data.user.current_ticket,   
           })
         }
        console.log(this.state,"all state,...")
         this.props.setUserData(data.user); 
       },
       error => {
         this.callToastFunction("error", "error");
         errorHandler(error, this.props);
       },
     );
   };
  checkPushPermission = () => {
    checkNotifications().then(({ status, settings }) => {
    });
    return new Promise((resolve, reject) => {
      checkNotifications().then(
        response => {
          resolve(response.status);
        },
        error => {
          reject(error);
        },
      );
    });
  };
  pushHandler = () => {
  
      this.checkPushPermission().then(response => {
        if (response != RESULTS.GRANTED) {
          alertWithTwoBtn(
            'Permission Required',
            commonData.ToastMessages.push_permission,
            'Not Now',
            'Open Settings',
          ).then(data => {
            console.log(data);
            if (data) {
              //this.setState({ isEnabled:false})
              Linking.openSettings();
            }else{
              this.setState({ isEnabled:false})
              let param = { push_enable: false };
              this.togglePushApi(param);
            }
          });
        } else {
          let param = { push_enable: this.state.isEnabled };
          //  console.log(param, 'api call');
          this.setState({ push_enable: true });
          this.togglePushApi(param);
        }
      });
    
  };

  //To display update phone number
  updateState = () => {
    this.setState({ phone_number: commonData.user_phone_number });
  };

  navigator = page => {
    this.props.parentCallback(page);
  };
  componentDidMount() {
    //  console.log(commonData.stripe_status, "dssdgsdgsdg.....")
    // this.view.slideInRight(300);
  }
  componentWillUnmount() {

  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    return (

    <View style={{position:'absolute',bottom:0, left:0, right:0, }} >
      <View style={styles.container} >
        <View style={{
          backgroundColor: 'white', padding: 20, paddingTop: 0, paddingLeft: 10, borderTopRightRadius: 10,
          borderTopLeftRadius: 10, position:'absolute', bottom:0, left:0, alignContent:'flex-end', maxHeight: height < 680? height-50: height
        }}>
          <TouchableOpacity onPress={() => this.navigator('close')}>
            <Image
              style={{ resizeMode: 'contain', height: 28, width: 28, alignSelf: 'center' }}
              source={
                bar
              }
            />
          </TouchableOpacity>
          {this.props.user.user_type == "owner"  && this.props.from !="chat"  && (
            commonData.owner_menu.map(m => {
              return (
                <View style={{ flexDirection: 'row', alignItems: 'center', width:width-30 }}>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10, paddingBottom: 14,
               paddingTop:4 }}
                    onPress={() => this.navigator(m.type)}
                  >
                    <View style={{ marginRight: 10, paddingBottom: 15, paddingTop: 0, alignItems:'center' }}>
                      <Image
                        style={{ resizeMode: 'contain', height: 23, width: 23, marginRight: 10, }}
                        source={m.type == "paymentInfo" && this.props.user.cards.length > 0 ? edit_payout : m.img
                        }
                      />
                    </View>
                    {m.type !="push" &&(
                        <View style={{ borderBottomWidth: 1, borderColor: colors.btn_border, width: '100%' }}>
                        {m.type == "paymentInfo" && this.props.user.cards.length > 0 && (
                          <Text style={[styles.list_text,]}>Edit Credit Card Info</Text>
                        )}
                        {m.type == "paymentInfo" && this.props.user.cards.length == 0 && (
                          <Text style={[styles.list_text, { color: colors.blue }]}>Add Credit Card Info</Text>
                        )}
                        {m.type != "paymentInfo" && (
                          <Text style={[styles.list_text, { color: m.disable ? colors.grey_heading : colors.BLACK_TEXT }]}>{m.name}</Text>
                        )}
                      </View>
                    )}
                      {m.type =="push" &&(
                    <View style={{ borderBottomWidth: 1, borderColor: colors.btn_border, width: '90%', flexDirection:'row'  }}>
                        <Text style={[styles.list_text, { color: m.disable ? colors.grey_heading : colors.BLACK_TEXT }]}>{m.name}</Text>
                      <Right style={{alignItems:'flex-end', marginRight:20}}>
                         <Switch value={this.state.isEnabled} 
                          onValueChange={() => {
                            this.setState({
                              isEnabled: !this.state.isEnabled
                            },()=>{
                              this.togglePushApi({ push_enable: this.state.isEnabled })
                            })
                           
                          }}
                         trackColor={{ false: "#767577", true: colors.blue }}
                         style={{alignItems:'center',justifyContent:'center',marginBottom:12 }} />  
                      </Right>
                        
                       
                    </View>
                     )}
                  
                  </TouchableOpacity>
                </View>
              )
            })
          )}
          {this.props.user.user_type != "owner"  && this.props.from !="chat" && (
            commonData.pro_home_menu.map(m => {
              return (
                <View style={{ flexDirection: 'row', alignItems: 'center', width:width-30}}>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10,  paddingBottom: 14,
               paddingTop:4 }}
                    onPress={() => this.navigator(m.type)}
                  >
                    <View style={{ marginRight: 10, paddingBottom: 15, paddingTop: 0, alignItems:'center' }}>
                      <Image
                        style={{ resizeMode: 'contain', height: 23, width: 23, marginRight: 10, }}
                        source={m.type == "paymentInfo" && this.props.user.cards.length > 0 ? edit_payout : m.img
                        }
                      />
                    </View>
                    {m.type !="push" &&(
                    <View style={{ borderBottomWidth: 1, borderColor: colors.btn_border, width: '100%' , justifyContent:'center'}}>
                      {m.type == "paymentInfo" && this.props.user.cards.length > 0 && (
                        <Text style={[styles.list_text,]}>Edit Payout Info</Text>
                      )}
                      {m.type == "paymentInfo" && this.props.user.cards.length == 0 && (
                        <Text style={[styles.list_text, { color: colors.blue }]}>Add Payout Info</Text>
                      )}
                      {m.type != "paymentInfo" && (
                        <Text style={[styles.list_text, { color: m.disable ? colors.grey_heading : colors.BLACK_TEXT }]}>{m.name}</Text>

                      )}
                    </View>
                     )}

                  {m.type =="push" &&(
                    <View style={{ borderBottomWidth: 1, borderColor: colors.btn_border, width: '90%', flexDirection:'row' ,paddingTop:2 }}>
                        <Text style={[styles.list_text, { color: m.disable ? colors.grey_heading : colors.BLACK_TEXT }]}>{m.name}</Text>
                      <Right style={{alignItems:'flex-end', marginRight:20}}>
                         <Switch value={this.state.isEnabled} 
                          onValueChange={() => {
                            this.setState({
                              isEnabled: !this.state.isEnabled
                            },()=>{
                              this.pushHandler()
                              // this.togglePushApi({ push_enable: this.state.isEnabled })
                            })
                           
                          }}
                         trackColor={{ false: "#767577", true: colors.blue }}
                         style={{alignItems:'center',justifyContent:'center',marginBottom:12}} />  
                      </Right>
                        
                       
                    </View>
                     )}
                  </TouchableOpacity>
                </View>
              )
            })
          )}

        {this.props.user.user_type == "owner" && this.props.from =="chat" && (
            commonData.owner_menu_chat.map(m => {
              return (
                <View style={{ flexDirection: 'row', alignItems: 'center', width:width-30}}>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10,  paddingBottom: height< 680? 8:14,
                  paddingTop:4 }}
                    onPress={() => this.navigator(m.type)}
                  >
                    {m.type !="pay" && m.type !="find"&&(
                    <View style={{ marginRight: 10, paddingBottom:  height< 680? 14:15, paddingTop: 0 }}>
                       <Image
                        style={{ resizeMode: 'contain', height: 23, width: 23, marginRight: 10, }}
                        source={m.type == "paymentInfo" && this.props.user.cards.length > 0 ? edit_payout : m.img
                        }
                      />
                    </View>
                    )}
                    {m.type !="push" && m.type !="pay" && m.type !="find"  &&(
                    <View style={{ borderBottomWidth: 1, borderColor: colors.btn_border, width: '100%' }}>
                      {m.type != "paymentInfo" && (
                        <Text style={[styles.list_text, { color: m.disable ? colors.grey_heading : colors.BLACK_TEXT }]}>{m.name}</Text>

                      )}
                        {m.type == "paymentInfo" && this.props.user.cards.length > 0 && (
                        <Text style={[styles.list_text,{ color: m.disable ? colors.grey_heading : colors.BLACK_TEXT }]}>Edit Credit Card Info</Text>
                      )}
                      {m.type == "paymentInfo" && this.props.user.cards.length == 0 && (
                        <Text style={[styles.list_text, { color: m.disable ? colors.grey_heading : colors.BLACK_TEXT }]}>Add Credit Card Info</Text>
                      )}
                          
                    </View>
                     )} 

                      {m.type =="pay" && this.props.user.current_ticket.assigned_id != null &&(
                        <View style={{ marginRight: 10, paddingBottom:height< 680? 14:15, paddingTop: 0 }}>
                        <Image
                          style={{ resizeMode: 'contain', height: 23, width: 23, marginRight: 10, }}
                          source={ m.img }
                        />
                      </View>
                      )}
                      {m.type =="pay" && this.props.user.current_ticket.assigned_id != null &&(
                           <View style={{ borderBottomWidth: 1, borderColor: colors.btn_border, width: '100%' }}>
                             <Text style={[styles.list_text, { color: m.disable ? colors.grey_heading : colors.BLACK_TEXT }]}>{m.name}</Text>
                           </View>
                      )}

                    {m.type =="find" && this.props.user.current_ticket.assigned_id != null &&(
                        <View style={{ marginRight: 10, paddingBottom:height< 680? 14:15, paddingTop: 0 }}>
                        <Image
                          style={{ resizeMode: 'contain', height: 23, width: 23, marginRight: 10, }}
                          source={ m.img }
                        />
                      </View>
                      )}
                      {m.type =="find" && this.props.user.current_ticket.assigned_id != null &&(
                           <View style={{ borderBottomWidth: 1, borderColor: colors.btn_border, width: '100%' }}>
                             <Text style={[styles.list_text, { color: m.disable ? colors.grey_heading : colors.BLACK_TEXT }]}>{m.name}</Text>
                           </View>
                      )}
                          
                     {m.type =="push" &&(
                       <View style={{ borderBottomWidth: 1, borderColor: colors.btn_border, width: '90%', flexDirection:'row'  }}>
                        <Text style={[styles.list_text, { color: m.disable ? colors.grey_heading : colors.BLACK_TEXT }]}>{m.name}</Text>
                      <Right style={{alignItems:'flex-end', marginRight:20}}>
                         <Switch value={this.state.isEnabled} 
                          onValueChange={() => {
                            this.setState({
                              isEnabled: !this.state.isEnabled
                            },()=>{
                              this.togglePushApi({ push_enable: this.state.isEnabled })
                            })
                           
                          }}
                         trackColor={{ false: "#767577", true: colors.blue }}
                         style={{alignItems:'center',justifyContent:'center',marginBottom:height< 680? 9:13 }} />  
                      </Right>     
                    </View>
                     )}  
                  </TouchableOpacity>
                </View>
              )
            })
          )}

          {this.props.user.user_type == "expert" && this.props.from =="chat" && (
            commonData.expert_menu_chat.map(m => {
              return (
                <View style={{ flexDirection: 'row', alignItems: 'center', width:width-30}}>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10,  paddingBottom: 14,
               paddingTop:4  }}
                    onPress={() => this.navigator(m.type)}
                  >
                    <View style={{ marginRight: 10, paddingBottom: 15, paddingTop: 0, alignItems:'center' }}>
                      <Image
                        style={{ resizeMode: 'contain', height: 23, width: 23, marginRight: 10, }}
                        source={m.type == "paymentInfo" && this.props.user.cards.length > 0 ? edit_payout : m.img
                        }
                      />
                    </View>
                    {m.type !="push" &&(
                    <View style={{ borderBottomWidth: 1, borderColor: colors.btn_border, width: '100%' }}>
                      {m.type != "paymentInfo" && (
                        <Text style={[styles.list_text, { color: m.disable ? colors.grey_heading : colors.BLACK_TEXT }]}>{m.name}</Text>

                      )}
                    </View>
                     )}   
                  </TouchableOpacity>
                </View>
              )
            })
          )}
        </View>
      </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  console.log(state, "state in Home")
  return {
    user: state.user.userData
  }
}
export default connect(mapStateToProps, {setAllTickets,setUserData})(SideMenu);

