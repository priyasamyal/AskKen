
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView
  ,Keyboard,Linking
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import {
  Container,
  Header,
  Left,
  Button,
  Body,
  Right,
  Icon,
  Textarea,
} from 'native-base';
// create a component
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import styles from './styles';
import CommonToast from "@custom_components/CommonToast";
import { connect } from "react-redux";
import { setDescription } from "../../actions";
import { StackActions, NavigationActions } from 'react-navigation';
import Modal from 'react-native-modal';
import SideMenu from '../../components/SideMenu';
import { SwipeableModal } from 'react-native-swipeable-modal';

import {
  postApiRequestWithHeaders,
  openUrl,
  clearLocalStorage,
  showToast,
  errorHandler,
} from '../../common/user';
const header_logo = require('../../assets/imgs/header_logo.jpg');
const side_menu_black = require('../../assets/imgs/side_menu_black.png');
class TicketDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      count: 140,
      toggle_menu: false,
      message: "",
      type: "",
      showCustomToast: false
    };
  //  console.log(height,"hiiiiii")
  }

  navigator = (data) => {
    switch (data) {
      case "back":
        this.props.navigation.goBack();
        break;
      case "next":
        console.log("next")
        if(this.state.description.trim() != "" ){
          this.props.setDescription(this.state.description)
          this.props.navigation.navigate('TicketMediaType')   
        }else{
          Keyboard.dismiss();
          setTimeout(() => {
            this.setState({
              message: "Please enter description.",
              type: "error",
              showCustomToast: true
            })
          }, 100);
          setTimeout(() => {
            this.setState({
              showCustomToast: false
            });
          }, 3100);
        }
        break;
      case 'side_menu': {
        this.setState({ toggle_menu: true });
        break;
      }
      default:
        break;
    }
  }

  callbackFunction = page => {
    console.log("kkk")
    this.setState({ toggle_menu: !this.state.toggle_menu });
    switch (page) {
      case 'close': {
        this.setState({ toggle_menu: !this.state.toggle_menu });
        break;
      }
      case 'help': {
        //  console.log('help');
        this.props.navigation.navigate('CommonPage', {
          page: 'help',
          headerText: 'Help!',
        });
        break;
      }
      case 'callHistory': {
        // console.log('callHistory');
        this.props.navigation.navigate('CommonPage', {
          page: 'callHistory',
          headerText: 'Call History',
        });

        break;
      }
      case 'account': {
        this.props.navigation.navigate('EnterName',{type:'edit'});
        break;
      }
      case 'updateProfile': {
        //  console.log('updateProfile');
        this.props.navigation.navigate('CommonPage', {
          page: 'updateProfileImage',
          headerText: 'Update Profile',
        });

        break;
      }
      case 'cardInfo': {
        let view =
          commonData.user_details.cards.length == 0 ? 'intro' : 'addCard';
        let is_exist = commonData.user_details.cards.length == 0 ? false : true;
        this.props.navigation.navigate('OwnerPayment', {
          view: view,
          is_exist: is_exist,
        });
        break;
      }

      case 'paymentInfo': {
        let view =
          this.props.user.cards.length == 0 ? 'intro' : 'addCard';
        let is_exist = this.props.user.cards.length == 0 ? false : true;
        this.props.navigation.navigate('OwnerPayment', {
          view: view,
          is_exist: is_exist,
        });
        break;
      }

      case 'editCategory': {
        this.props.navigation.navigate('EditCategory');

        break;
      }
      case 'editLicense': {
        this.props.navigation.navigate('TicketDescription', {
          page: 'TicketDescription',
          categories: commonData.user_details.categories,
        });

        break;
      }
      case 'updatePassword': {
        //  console.log('updatePassword');
        this.props.navigation.navigate('CommonPage', {
          page: 'updatePassword',
          headerText: 'Update Password',
        });

        break;
      }
      case 'updatePhoneNumber': {
        //console.log('updatePhoneNumber');
        this.props.navigation.navigate('EnterPhoneNumber', {
          text: 'Update',
          onGoBack: () => this.refresh(),
        });
        break;
      }
      case 'rating': {
        this.setState({ toggle_menu: !this.state.toggle_menu });
        break;
      }
      case 'pushToggle': {
        //  console.log('pushToggle');
        this.setState({ toggle_menu: !this.state.toggle_menu });
        break;
      }
      case 'video': {
        // console.log('video');
        openUrl('https://www.askkenapp.com/askken_video.mp4');

        break;
      }
      case 'logout': {
        const param = {
          user_id: this.props.user.user_id,
        };
        postApiRequestWithHeaders(commonData.api_endpoint.log_out, param,this.props.user.access_token).then(
          data => {
            this.logOutFunc();
          },
          error => {
            this.logOutFunc();
          },
        );
        break;
      }

      case 'terms': {
        setTimeout(() => {
          openUrl('https://www.askkenapp.com/terms');
        }, 1000);
        break;
      }

      case 'deleteAccount': {
        alertWithTwoBtn(
          'Delete Account',
          commonData.ToastMessages.delete_account,
          'No',
          'Yes',
        ).then(data => {
          if (data) {
            this.deleteApiCall();
          }
        });
        break;
      }
      case 'report': {
        console.log("rporp")
        var url = 'mailto:help@askkenapp.com?subject=Report a problem&body=&cc=';
        Linking.openURL(url);
        break;
      }
    }
  };
/**
   * Log Out User
   */
  logOutFunc = () => {
    clearLocalStorage('user_details').then(data => {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'SelectUser' })],
      });
      this.props.navigation.dispatch(resetAction);
    });
  };
  addingDescription = (txt) => {
   // console.log(txt,"txt....");
    if(this.state.count =="0" && txt ==''){

    }else{
      var current_count = parseInt(this.state.count);
      if(current_count >0)
      this.setState({ description: txt });
    }
   // return false;
    
  }
  onOtpKeyPress = (e) => {
  //console.log(e.nativeEvent,"ee")
    var current_count = parseInt(this.state.count);
    if (current_count >= 0) {
      if (e.nativeEvent.key == "Backspace") {
        current_count++;
        this.setState({ count: current_count })
      }
    
      else {
        if (current_count > 0) {
          current_count--;
          this.setState({ count: current_count })
        }

      }
    }
  }

  render() {
    return (
      <Container>
       {this.state.showCustomToast ? (
              <View style={{
                position: "absolute",
                bottom: 0,
                zIndex:2
              }}>
                <CommonToast type={this.state.type} message={this.state.message} />
              </View>
            ) : null}
        <Header transparent style={styles.header}>
          <Left style={{ flex: 1 }}>
            <Button
              transparent
              hitSlop={hitSlop}
              onPress={() => this.navigator('back')}>
              <Icon style={[styles.black_text]} name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Image
              style={[
                {
                  marginLeft: 0,
                  height: 30,
                  width: 30,
                  resizeMode: 'contain',
                },
              ]}
              source={header_logo}
            />
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.navigator('side_menu')}>
              <Image style={styles.image} source={side_menu_black} />
            </Button>
          </Right>
        </Header>
        <View style={[styles.mainContainer,{paddingTop: height < 787? 30: 35}]}>
        <KeyboardAvoidingView
                                        style={styles.mainContent}
                                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                                        keyboardVerticalOffset={Platform.OS === 'ios' ? height < 787? 53: height > 810? 80: 55 : 120}> 
          {/* <KeyboardAwareScrollView
            contentContainerStyle={[styles.mainContent]}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
          > */}
            <View style={styles.mainContent}>
              <Text style={[styles.heading,{marginTop: height < 787? 0: 15}]}>
                {' '}
                Now briefly describe{'\n'}your issue in one or {'\n'}two sentences.
              </Text>

              <View style={[styles.numberInputContainer,{}]}>
                <Textarea
                  blurOnSubmit={true}
                  ref={ref => (this.textInputRef = ref)}
                  placeholder="Ex: My dishwasher is on the fritz!"
                  selectionColor={colors.BLACK_TEXT}
                  style={styles.textAreaStyle}
                  rowSpan={5} 
                  maxLength={140}
                  value={this.state.description}
                  onChangeText={(value) => { this.addingDescription(value) }}
                  onKeyPress={(e) => {
                    this.onOtpKeyPress(e)
                  }}
                  returnKeyType = {"done"}
                  //returnKeyType = {"next"}
                  onSubmitEditing={() => {  this.navigator("next")}}
                />
                <Text style={[styles.heading, { textAlign: 'right', fontSize: 15, marginTop: 5, marginRight: 20 }]}>
                  {this.state.count}
                </Text>

              </View>

            </View>
            {this.state.description.trim() != "" && (
              <View style={styles.continueBtnContainer}>
                <Button style={[styles.continueBtn,{height: height < 787?50: 55}]}
                  onPress={() => {
                    this.navigator("next")
                  }}
                >
                  <Text style={styles.continueBtnTxt}>Next</Text>
                </Button>
              </View>
            )}

          </KeyboardAvoidingView>
          <Modal isVisible={this.state.toggle_menu}
            hideModalContentWhileAnimating={true}
            onSwipeComplete={() => this.setState({ toggle_menu: !this.state.toggle_menu })}
            swipeDirection="down">
            <SideMenu
              parentCallback={this.callbackFunction}
            ></SideMenu>
          </Modal>
        </View>
      </Container>
    );

  }
}



function mapStateToProps(state) {
  return {
    user: state.user.userData
  }
}
export default connect(mapStateToProps, { setDescription })(TicketDescription);

