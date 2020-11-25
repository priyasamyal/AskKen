import React, { Component, } from 'react';
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
  Modal,Dimensions,
  
} from 'react-native';
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
import TimeZone from 'react-native-timezone';
import { AppEventsLogger } from "react-native-fbsdk";
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
var { width, height } = Dimensions.get('window');
import { postApiRequest, setItem,postApiRequestWithHeaders } from '../../common/user';
import { colors } from '../../common/index';
import { KeyboardAvoidingView, Keyboard, SafeAreaView } from 'react-native';
import commonData from '../../common/data.js';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { connect } from "react-redux";
import { setAccountInfo, setUserData,setAllTickets,setDeviceToken } from "../../actions";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { showToast } from '../../common/user';
import HeaderComponent from "@custom_components/HeaderComponent";
import CommonToast from "@custom_components/CommonToast";
import { StackActions, NavigationActions } from 'react-navigation';
import Load from 'react-native-loading-gif';
import firebase from 'react-native-firebase';
import KeyboardListener from 'react-native-keyboard-listener';

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);   
class EnterName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      email: '',
      modalVisible: false,
      disabled: true,
      currentActive: 0,
      message: "",
      type: "",
      showCustomToast: false,
      scrollMarginBottom: 0
    };
    console.log(this.props.navigation.state.params.type,"props...", height)
  }

  componentDidMount() {
    if(this.props.navigation.state.params.type =="edit"){
      console.log(this.props.user.userData,"this.props.user.userData...")
      this.setState({
        name: this.props.user.userData.name,
        email: this.props.user.userData.email,
      })
    }

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
  
  navigator(page) {
    switch (page) {
      case 'next': {
        console.log('next');
        this.validateForm();
        // Keyboard.dismiss();
        // commonData.signUpObj.name = this.state.name;
        // //commonData.signupParam.append('name', this.state.name);
        // this.props.navigation.navigate('SelectUser', {
        //   onGoBack: () => this.refresh(),
        // });

        break;
      }
      case 'back': {
        console.log('back');
        if(this.props.navigation.state.params.type =="edit"){
          this.props.navigation.goBack();
        }else{
          if (this.props.user.user_type == "owner") {
            this.props.navigation.state.params.onGoBack();
          }
              this.props.navigation.goBack();
          
        }
        
      
        break;
      }
      case 'reset': {
        this.props.navigation.navigate('Introduction');
        break;
      }
    }
  }

  validateForm = () => {
    let emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    Keyboard.dismiss();
    if (this.state.name.trim() == "") {
      // showToast(commonData.ToastMessages.first_name);
      setTimeout(() => {
        this.setState({
          message: commonData.ToastMessages.first_name,
          type: "error",
          showCustomToast: true
        })
      }, 450);
    }
    else if (this.state.email.trim() == "") {
      // showToast(commonData.ToastMessages.email);
      setTimeout(() => {
        this.setState({
          message: commonData.ToastMessages.email,
          type: "error",
          showCustomToast: true
        })
      }, 450);
    }
    else if (!emailRegex.test(String(this.state.email).toLowerCase())) {
      setTimeout(() => {
        this.setState({
          message: "Please enter valid email.",
          type: "error",
          showCustomToast: true
        })
      }, 450);
    }
    
    else if (this.state.password.trim() == "" && this.props.navigation.state.params.type !="edit") {
      // showToast(commonData.ToastMessages.password);
      setTimeout(() => {
        this.setState({
          message: commonData.ToastMessages.password,
          type: "error",
          showCustomToast: true
        })
      }, 450);
    }
    else if (this.state.password.trim().length < 6 && this.props.navigation.state.params.type !="edit") {
      // showToast(commonData.ToastMessages.password);
      setTimeout(() => {
        this.setState({
          message: "Password must be alteast 6 characters long.",
          type: "error",
          showCustomToast: true
        })
      }, 450);
    } else {
      this.props.setAccountInfo({
        name: this.state.name,
        password: this.state.password,
        email: this.state.email,
      })
      if(this.props.navigation.state.params.type !="edit"){
      if (this.props.user.user_type == "owner") {
        this.registerUser();
      } else {
        this.props.navigation.navigate('DisplayProfile');
      }
    }else{
      this.editProfile();
    }
    }
    setTimeout(() => {
      this.setState({
        showCustomToast: false
      });
      this.refresh()
    }, 3100);
  }

  editProfile = () => {
    this.refs.Load.OpenLoad();
    const param = {
      user_id: this.props.user.userData.user_id,
      name: this.state.name,
     // password: this.state.password,
      email: this.state.email
    };

    console.log(param, "para");
    postApiRequestWithHeaders(
      commonData.api_endpoint.update_profile,
      param,this.props.user.userData.access_token
    ).then(
      res => {
        console.log(res, "user_detail111");
        res.loggedInStatus = true;
        if (res.user.user_type != "owner") {
          this.setState({
            all_job: res.all_tickets
          })
          console.log(this.state)
          this.props.setAllTickets(res.all_tickets)
        } else {
          this.setState({
            current_ticket: res.user.current_ticket,
            push_enable:res.user.push_enable
          })
        }
        this.props.setUserData(res.user);
        this.refs.Load.CloseLoad();
       this.props.navigation.goBack();
      },
      error => {
        this.refs.Load.CloseLoad();
        errorHandler(error, this.props);
      },

    );
  }
  registerUser = () => {
    this.refs.Load.OpenLoad();
    const param = {
      phone_number: this.props.user.phone_number,
      country_code: this.props.user.phone_code,
      name: this.state.name,
      password: this.state.password,
      profile_image: this.props.user.profile_image,
      user_type: this.props.user.user_type,
      device_token: this.props.user.device_token,
      uuid: this.props.user.uuid,
      email: this.state.email,
      time_zone: commonData.time_zone,
      voip_token: this.props.user.voip_token
    };

    console.log(param, "para");
    postApiRequest(commonData.api_endpoint.signup, param).then(
      data => {
        if(this.props.user.phone_number == undefined || this.props.user.phone_number == ''){
          crashlytics().log('OwnerRegister');
        }else{
          crashlytics().log('OwnerRegister'+this.props.user.phone_number.split(" ").join(""));
        }
        AppEventsLogger.logEvent("fb_mobile_complete_registration", {content_name:"owner",currency:"USD",status:"registered",value:"owner"});
        data.loggedInStatus = true;
        this.props.setUserData(data);
        setTimeout(() => {
          this.refs.Load.CloseLoad();
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "Notification" })],
          });
          this.props.navigation.dispatch(resetAction);
        }, 2000);
      
      },
      error => {
        this.refs.Load.CloseLoad();
        console.log(error, 'error');
      },
    );
  }
  refresh = () => {
    console.log('I have asasa');
    setTimeout(() => {
      console.log('aaaaa');
      // this.textInputRef.focus();
    }, 100);
  };
  nextClicked() {
    console.log('next clicked');
  }

  handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    console.log(scrollPosition, "ScrollPosition")
    // if (scrollPosition > 100 && !showBlueView) {
    //   Animated.timing(animatedOpacityValue, {
    //     toValue: 1,
    //   }).start(() => this.setState({ showBlueView: true }))
    // }

    // if (scrollPosition < 100 && showBlueView) {
    //   Animated.timing(animatedOpacityValue, {
    //     toValue: 0,
    //   }).start(() => this.setState({ showBlueView: false }))
    // }
  }

  render() {
    return (
      <Container>

        <Load ref="Load"></Load>
        {this.state.showCustomToast ? (
              <View style={{
                position: "absolute",
                bottom: 0,
                zIndex:2
              }}>
                <CommonToast type={this.state.type} message={this.state.message} />
              </View>
            ) : null}
        <KeyboardAwareScrollView
          contentContainerStyle={[{ }]}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          onScroll={this.handleScroll}
          style={{marginBottom: this.state.scrollMarginBottom}}
        >
          <HeaderComponent clickHandler={() => this.navigator('back')} />

          <View style={styles.mainContainer}>
           
            <View style={[styles.mainContent, {flex:1, width:'100%',}]}>
              <View style={{}}>
                {this.props.navigation.state.params.type =="edit" &&(
                          <Text style={[styles.heading,{paddingBottom:height < 680? 100: height < 786?200:220, paddingTop:20}]}>Edit Account Info
                        </Text>
                )}
                 {this.props.navigation.state.params.type !="edit" &&(
                    <Text style={[styles.heading,{}]}>
                 
                    {this.props.user.user_type == "expert" ? "Introduce yourself" : "Last Step"}
                  </Text>
                  )}
                {this.props.navigation.state.params.type !="edit" &&(
                <Text style={[styles.headingText,{marginBottom: height < 786 ?0:0}]}>      
                  We'll use this information to{'\n'}communicate with you. Our family{'\n'}and friends use Ask Ken too, so{'\n'} we never spam.
              </Text>
               )}
              </View>
             
              <View style={{ flex:1, padding:20, justifyContent:'space-between' }}>
              <View>
                  <View style={{ marginBottom: 25 }}>
                    <Text style={[styles.heading, { textAlign: 'left', marginBottom: 25, fontSize:19 }]}>
                      First Name
                  </Text>
                    <TextInput
                      placeholder="Your first name"
                      placeholderTextColor = {colors.grey_heading}
                      style={[styles.numberInput, { borderColor: this.state.currentActive == 1 ? colors.BLACK_TEXT : colors.input_border }]}
                      keyboardType="default"
                      returnKeyType = {"next"}
                      maxLength={32}
                      ref={ref => (this.textInputRef = ref)}
                      onSubmitEditing={() => { this.textInputRef1.focus();}}
                      onFocus={() => {
                        this.setState({
                          currentActive: 1
                        })
                      }}
                      onBlur={() => {
                        this.setState({
                          currentActive: 0
                        })
                      }}
                      selectionColor={colors.BLACK_TEXT}
                      onChangeText={name => {
                        this.setState({ name: name });
                      }}
                      value={this.state.name}></TextInput>
                  </View>
                  <View style={{ marginBottom: 25 }}>
                    <Text style={[styles.heading, { textAlign: 'left', marginBottom: 25, fontSize: 19 }]}>
                      Email
                  </Text>
                    <TextInput
                     autoCapitalize="none"
                      placeholder="Your email"
                      placeholderTextColor = {colors.grey_heading}
                      style={[styles.numberInput, { borderColor: this.state.currentActive == 2 ? colors.BLACK_TEXT : colors.input_border }]}
                      keyboardType="email-address"
                      returnKeyType = {this.props.navigation.state.params.type !="edit"? "next" : "go"}
                      maxLength={32}
                      ref={ref => (this.textInputRef1 = ref)}
                      onSubmitEditing={() => { 
                        if(this.props.navigation.state.params.type !="edit"){
                          this.textInputRef2.focus(); 
                        }else{
                          this.navigator('next')
                        }            
                      }}
                      onFocus={() => {
                        this.setState({
                          currentActive: 2
                        })
                      }}
                      onBlur={() => {
                        this.setState({
                          currentActive: 0
                        })
                      }}
                      selectionColor={colors.BLACK_TEXT}
                      onChangeText={name => {
                        this.setState({ email: name });
                      }}
                      value={this.state.email}></TextInput>
                  </View>
                  {this.props.navigation.state.params.type !="edit" &&(  
                  <View style={{ marginBottom: 0 }}>
                    <Text style={[styles.heading, { textAlign: 'left', marginBottom: 25, fontSize: 19 }]}>
                      Password
                  </Text>
                    <TextInput
                      placeholder="Create a password"
                      placeholderTextColor = {colors.grey_heading}
                      style={[styles.numberInput, { borderColor: this.state.currentActive == 3 ? colors.BLACK_TEXT : colors.input_border }]}
                      secureTextEntry={true}
                      ref={ref => (this.textInputRef2 = ref)}
                      returnKeyType = {"go"}
                      onSubmitEditing={() => {this.navigator('next') }}
                      keyboardType="default"
                      maxLength={32}
                      selectionColor={colors.BLACK_TEXT}
                      onChangeText={name => {
                        this.setState({ password: name });
                      }}
                      onFocus={() => {
                        this.setState({
                          currentActive: 3
                        })
                      }}
                      onBlur={() => {
                        this.setState({
                          currentActive: 0
                        })
                      }}
                      value={this.state.password}></TextInput>
                  </View>
                  )}
                    {this.props.navigation.state.params.type =="edit" &&(  
                   <TouchableOpacity style={{alignItems:'flex-end'}} onPress={() => this.navigator('reset')}>
                    <Text style={{fontSize:18,  fontFamily: 'AvenirLTStd-Medium', textDecorationLine:'underline'}}> Reset Passsword</Text>
                  </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.continueBtnContainer}>
                  <Button style={styles.continueBtn} onPress={() => this.navigator('next')}>
                    <Text style={styles.continueBtnTxt}>{this.props.navigation.state.params.type =="edit" ? "Save Changes": "Finish"}</Text>
                  </Button>
                </View>
              </View>
              <KeyboardListener  key={3} onWillShow={() => this.setState({scrollMarginBottom: 20})} onWillHide={() => this.setState({scrollMarginBottom: 0})} />
            </View>
           
          </View>
        </KeyboardAwareScrollView>

      </Container>
    );
  }
}
function mapStateToProps(state) {
  //console.log(state, "state")
  return {
    user: state.user
  }
}
export default connect(mapStateToProps, { setAccountInfo, setUserData,setAllTickets,setDeviceToken })(EnterName);