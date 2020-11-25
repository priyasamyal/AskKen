//import liraries
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Image,
  Dimensions,
} from 'react-native';
import { colors } from '../../common/index';
var { width, height } = Dimensions.get('window');
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
  Item,
  Input,
  Col,
  Grid,
  Label,
  Footer,
} from 'native-base';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import commonData from '../../common/data.js';
import styles from './styles';
import Modal from 'react-native-modal';
import SideMenu from '../../components/SideMenu';
import { SwipeableModal } from 'react-native-swipeable-modal';

import { thisExpression } from '@babel/types';
const payment = require('../../assets/imgs/payment.jpg');
const lock_icon = require('../../assets/imgs/grey_lock.png');
const header_logo = require('../../assets/imgs/header_logo.jpg');
const side_menu_black = require('../../assets/imgs/side_menu_black.png');

import { connect } from "react-redux";
// create a component
class PaymentIntro extends Component {
  constructor(props) {
    super(props);
   // console.log(props, commonData.user_details, 'in introduction');
    this.state = {
      //: commonData.user_details.user_type,
      toggle_menu: false
    };
  }

  navigator = navigateTo => {
    switch (navigateTo) {
      case 'next': {
        this.props.handler('next');
        break;
      }
      case 'work': {
        this.props.handler('work');
        break;
      }
      case 'last': {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'ExpertIntro' })],
        });
        this.props.navigation.dispatch(resetAction);
      }
      case 'side_menu': {
        this.setState({ toggle_menu: true });
        break;
      }
      case 'back': {
        this.props.handler('back');
        break;
      }
    }
  };

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
        this.props.user.cards.length == 0 ? 'intro' : 'addCard';
        let is_exist = this.props.user.cards.length == 0 ? false : true;
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
        //  console.log('updatePhoneNumber');
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
        postApiRequestWithHeaders(commonData.api_endpoint.log_out, param).then(
          data => {
            this.refs.Load.CloseLoad();
            this.logOutFunc();
          },
          error => {
            this.logOutFunc();
            // errorHandler(error, this.props);
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
          //   console.log(data);
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

  render() {
    return (
      <Container>
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
            {/* <Button
              transparent
              onPress={() => this.navigator('side_menu')}>
              <Image style={styles.image} source={side_menu_black} />
            </Button> */}
          </Right>
        </Header>
        {/* <Header transparent style={styles.header}>
          <Left>
            <Button
              transparent
              hitSlop={hitSlop}
              onPress={() => this.navigator('back')}>
              <Icon style={[styles.black_text]} name="ios-close" />
            </Button>
          </Left>
          <Body></Body>
          <Right style={{ flex: 3 }}>
            <TouchableOpacity onPress={() => this.navigator('work')}>
              <Title style={styles.pageTitle}>  {commonData.user_details.user_type == 'owner'
                ? 'Is my info secure?'
                : 'How does this work?'}</Title>
            </TouchableOpacity>
          </Right>
        </Header> */}

        <View style={styles.mainContainer}>
          <View style={styles.mainContent}>
            <Text style={styles.headingText}>
              {this.props.user.user_type == 'expert'
                ? 'Lets add your debit card'
                : `Last step ${this.props.user.name}! Lets add${'\n'}your payment info.`}
            </Text>
            <Text style={styles.heading_description}>
              {this.props.user.user_type == 'expert'
                ? 'This is what we use to securely\nsend money to your bank account \nat the end of each day.'
                : "We'll use your credit card to securely\nsend payment to your Pro AFTER\nyou're satisfied with the help. Paying\nthis way ensures your privacy and\nprotects you under our refund policy."}
            </Text>
            <View style={{ alignItems: 'center' }}>
              <Image
                style={{
                  resizeMode: 'contain',
                  height: height < 680? 180:250,
                  width: height < 680? 200:250,
                  marginTop: 20,
                  marginBottom: 20,
                }}
                source={payment}
              />
            </View>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
              <Image
                style={{
                  resizeMode: 'contain',
                  height: 13,
                  width: 13,
                  marginTop: 0,
                  marginRight: 5,
                  marginBottom:  height < 680? 30:40,
                }}
                source={lock_icon}
              />
              <Text style={styles.private_info}>
                With Ask Ken, data encryption is built into{'\n'}the app so it can't be stolen, even if{'\n'}someone gets into your account. </Text>
            </View>

          </View>
          <View style={styles.continueBtnContainer}>
            <Button style={styles.continueBtn}
              onPress={() => {
                this.navigator("next")
              }}
            >
              <Text style={styles.continueBtnTxt}>Add Card</Text>
            </Button>
          </View>
        </View>
        <Modal isVisible={this.state.toggle_menu}
          hideModalContentWhileAnimating={true}
          onSwipeComplete={() => this.setState({ toggle_menu: !this.state.toggle_menu })}
          swipeDirection="down">
          <SideMenu
            parentCallback={this.callbackFunction}
          ></SideMenu>
        </Modal>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.userData
  }
}
export default connect(mapStateToProps, {})(PaymentIntro);

