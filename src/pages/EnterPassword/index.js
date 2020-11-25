import React, { Component } from 'react';
import commonData from '../../common/data.js';
import { postApiRequest, setItem, showToast,getItem } from '../../common/user';
import PasswordScreen from '../../components/password';
import { StackActions, NavigationActions } from 'react-navigation';
import { colors } from '../../common/index';
import Load from 'react-native-loading-gif';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { View, Keyboard } from 'react-native';
import { connect } from "react-redux";
import { setUserData, setAllTickets,setDeviceToken } from "../../actions";
import CommonToast from "@custom_components/CommonToast";
import crashlytics from '@react-native-firebase/crashlytics';
import firebase from 'react-native-firebase';
class EnterPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '123456',
      modalVisible: false,
      disabled: true,
      loader: false,
      message: "",
      type: "",
      showCustomToast: false
    };

  }

  componentDidMount() {
    // firebase.messaging().hasPermission()
    // .then(enabled => {
    //   if (enabled) {
    //     firebase.messaging().getToken().then(token => {
    //       console.log("token...", token)
    //       this.props.setDeviceToken({
    //         device_token: token,
    //         uuid: commonData.signUpObj.uuid
    //       })
    //     })
    //   } else {
    //     firebase.messaging().requestPermission()
    //       .then(() => {
           
    //       })
    //       .catch(error => {

    //       });
    //   }
    // });
  }
  
  
  loginApiCall(password) {
    Keyboard.dismiss();
    const param = {
      phone_number: this.props.user.phone_number,
      country_code: this.props.user.phone_code,
      password: password,
      device_token: this.props.user.device_token,
      time_zone: commonData.time_zone,
      voip_token:this.props.user.voip_token
    };
    console.log(param, 'param');
    postApiRequest(commonData.api_endpoint.login, param).then(
      data => {
        if(this.props.user.phone_number == undefined || this.props.user.phone_number == ''){
          crashlytics().log("LoginApi");
        }else{
          crashlytics().log("LoginApi "+this.props.user.phone_number.split(" ").join(""));
        }
        console.log(data, 'login response111');
        data.loggedInStatus = true;
        if (data.user.user_type != "owner") {
          this.props.setAllTickets(data.all_tickets);
          getItem(['ad_index']).then(
            res => {
              console.log(res, "res get index",res[0][1]);
              if (res[0][1] == null) {
                setItem('ad_index', "0").then(
                  res => {  
                      if (res) {
                          
                      }
                  },
                  err => {
                      console.log(err, "set err")
                  },
                );
               }
            }
          )
        
        }
        this.props.setUserData(data.user);
        setItem('is_first_time', "true").then(
          res => {  
              if (res) {
                  
              }
          },
          err => {
              console.log(err, "set err")
          },
        );
        if (data.user.push_enable == false) {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "Notification" })],
          });
          this.props.navigation.dispatch(resetAction);
        } else {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "HomePage", params: { from: 'login' } })],
          });
          this.props.navigation.dispatch(resetAction);
        }

      },
      error => {
        console.log(error, 'error');
        // showToast(error);
        this.setState({
          message: error,
          type: "error",
          showCustomToast: true
        })

        setTimeout(() => {
          this.setState({
            showCustomToast: false
          });
        }, 4200);
      },
    );

  }
  navigator = navigate => {
    console.log(navigate, 'navigate in enter password page');
    if (navigate.action == 'forgot') {
      console.log('forgot');

      this.props.navigation.navigate('ForgotPassword');
    } else if (navigate.action == 'back') {
      this.props.navigation.goBack();
    } else {
      this.loginApiCall(navigate.password);
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Load ref="Load" Image={0}></Load>
        <PasswordScreen
          text={"Enter your Password"}
          forgotPassword={false}
          clickHandler={this.navigator}
          showToast={this.state.showCustomToast}
          type={this.state.type} message={this.state.message}></PasswordScreen>
      </View>
    );
  }
}

function mapStateToProps(state) {
  //console.log(state, "state in for")
  return {
    user: state.user
  }
}
export default connect(mapStateToProps, { setUserData, setAllTickets ,setDeviceToken})(EnterPassword);