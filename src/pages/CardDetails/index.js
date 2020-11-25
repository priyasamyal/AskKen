import React, { Component } from 'react';
import commonData from '../../common/data.js';
import Card from '@custom_components/Card';
import {
  postApiRequestWithHeaders,
  errorHandler,
  showToast,
  push_interval,
  clear_push_interval,
  setItem,
} from '../../common/user';
import PasswordScreen from '../../components/password';
import { StackActions, NavigationActions } from 'react-navigation';
import {
  Container,
  Header,
  Left,
  Button,
  Body,
  Right,
  Icon,
  Title,
} from 'native-base';
import styles from './styles';
import { colors } from '../../common/index';
import Load from 'react-native-loading-gif';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { View, Keyboard, AppState, Text, Image } from 'react-native';
import Connecting from '@custom_components/Connecting';
import AddCard from '@custom_components/AddCard';
import PaymentIntro from '@custom_components/PaymentIntro';
import HowItWorks from '@custom_components/HowItWorks';
import uuid from 'uuid';
import BackgroundTimer from 'react-native-background-timer';
const lock_icon = require('../../assets/imgs/lock_icon.png');
BackgroundTimer.start();
timeoutId = '';
// import Load from 'react-native-loading-gif';
class CardDetails extends Component {
  _interval = 0;
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      modalVisible: false,
      disabled: true,
      loader: false,
      is_exist: this.props.navigation.state.params.is_exists,
      cards: commonData.user_details.cards,
      selectedCategory: this.props.navigation.state.params.select_cat_data,
      show_connecting: false,
      payment_detail: {},
      call_id: this.props.navigation.getParam('call_id', ''),
      view: this.props.navigation.state.params.view,
      userType: commonData.user_details.user_type,
    };
    console.log(
      this.props.navigation.getParam('expert_found', ''),
      'params navogai',
      this.props.navigation.getParam('select_cat_data', ''),
      this.props.navigation.state.params.select_cat_data
    );
    console.log(this.state.selectedCategory, "select");
    // console.log(global.text, 'global data...');
    // console.log(this.state.selectedCategory, 'se;e');
  }
  // navigator = action => {
  //   console.log(action, 'actionnnn');
  //   switch (action) {
  //     case 'back': {
  //       this.props.navigation.goBack();
  //       break;
  //     }
  //   }
  // };
  //Navigator Function
  navigator = (navigateTo, param) => {
    console.log(this.state, "state....")
    switch (navigateTo) {
      case 'next': {
        console.log('next in owner', this.state);

        console.log(this.state.userType, 'userType');
        this.state.userType == 'owner';
        this.setState({
          view: "addCard"
        })
        // view: 'addCard'
        //   ? this.props.navigation.push('CardDetails', {
        //     view: 'addCard',
        //   })
        //   : this.props.navigation.push('CardDetails', {
        //     view: 'addCard',
        //   });
        break;
      }
      case 'work': {
        this.props.navigation.push('CardDetails', {
          view: 'work',
        });
        break;
      }
      case 'addCard': {
        console.log(param, 'param add card ');
        this.getSessionDetail(param);
        // this.addCardApiCall(param);
        break;
      }
      case 'back': {
        this.props.navigation.goBack();
        break;
      }
    }
  };
  componentDidMount() {
    console.log('did mount card details');
  }

  componentWillUnmount() {
    console.log('Un Mount Car detailss...');
    clear_push_interval();
    if (this.timeoutId) {
      BackgroundTimer.clearTimeout(this.timeoutId);
    }
    BackgroundTimer.stop();
    // clearInterval(this._interval);
    // this.child.clearIntervalFun();
  }
  // componentDidUpdate() {
  //   console.log("componentDidUpdate unmount....", Component.displayName);
  //   console.log(this.props.navigation.state.routeName, "route mame")
  //   console.log(this._interval, "mm.....")
  //   clearInterval(this._interval);
  //   this.child.clearIntervalFun();
  // }
  cardHandler = data => {
    console.log(data, 'data from card');
    //  this.setState({ loader: true });
    this.getSessionDetail(data);
  };
  initiatePaymentApiCall = (data, param) => {
    param.fees = this.state.selectedCategory.price;
    console.log(param, 'param....');
    postApiRequestWithHeaders(
      commonData.api_endpoint.intial_payment,
      param,
    ).then(
      res => {
        //   this.setState({ loader: false });
        console.log(res.price, 'data.....');

        if (param.card_id == undefined && param.is_saved == true) {
          commonData.user_details.cards = res.card;
          setItem('user_details', JSON.stringify(commonData.user_details)).then(
            res => {
              if (res) {
                console.log('Storage set', res);
              }
            },
            err => { },
          );
        }
        var call_uuid = uuid.v4().toLowerCase();
        this.sendPushNotification(data, call_uuid, res.price);
        // var push_data = {
        //   data: [
        //     {
        //       notification: {
        //         body: 'Earn $' + price + ' answering',
        //         title: 'Incoming ' + this.state.selectedCategory.category_name + ' Call...',
        //         content_available: true,
        //         priority: 'high',
        //         sound: 'ask_ken_new.wav',
        //       },
        //       data: {
        //         type: 'incoming_call',
        //         device_token: commonData.user_details.device_token,
        //         user_id: commonData.user_details.user_id,
        //         name: commonData.user_details.name,
        //         category: this.state.selectedCategory.category_name,
        //         price: this.state.selectedCategory.price,
        //         //uuid: commonData.user_details.uuid,
        //         uuid: call_uuid,
        //         sessionId: data.session_id,
        //         token: data.token,
        //         apiKey: data.api_key,
        //         call_id: data.call_id,
        //         phone_number: commonData.user_details.phone_number.replace(
        //           /\s/g,
        //           '',
        //         ),
        //         notify_users: this.props.navigation.getParam(
        //           'expert_found',
        //           '',
        //         ),
        //       },
        //     },
        //   ],
        // };
        // push_interval(push_data).then(data => {
        //   console.log('int callback...', data);
        // });
      },
      error => {
        this.refs.Load.CloseLoad();
        console.log('error....', error);
        //this.setState({ loader: false });
        errorHandler(error, this.props);
      },
    );
  };

  sendPushNotification = (session, call_uuid, price) => {
    console.log(commonData.user_details, 'user....');
    console.log(this._interval, 'this._interval....');

    var push_data = {
      data: [
        {
          notification: {
            body: `Earn $${price} answering`,
            title:
              'Incoming ' +
              this.state.selectedCategory.category_name +
              ' Call...',
            content_available: true,
            priority: 'high',
            sound: 'ask_ken_new.wav',
          },
          data: {
            type: 'incoming_call',
            device_token: commonData.user_details.device_token,
            user_id: commonData.user_details.user_id,
            name: commonData.user_details.name,
            category: this.state.selectedCategory.category_name,
            price: price,
            //uuid: commonData.user_details.uuid,
            uuid: call_uuid,
            sessionId: session.session_id,
            token: session.token,
            apiKey: session.api_key,
            call_id: session.call_id,
            phone_number: commonData.user_details.phone_number.replace(
              /\s/g,
              '',
            ),
            notify_users: this.props.navigation.getParam('expert_found', ''),
          },
        },
      ],
    };
    console.log(push_data, 'push_data final ..');
    postApiRequestWithHeaders(
      commonData.api_endpoint.push_payload,
      push_data,
    ).then(
      data => {
        this.refs.Load.CloseLoad();
        console.log('Push send....');
        this.props.navigation.navigate("VideoCall", {
          sessionId: session.session_id,
          token: session.token,
          apiKey: session.api_key,
          call_id: session.call_id,
          pageFrom: 'card',
          notify_users: this.props.navigation.getParam('expert_found', ''),
          // "payload": message._data
        });
        //  this.setState({ show_connecting: true, view: "connecting" });
        console.log(data, 'data.....');
      },
      error => {
        console.log('error....', error);
        // this.setState({ loader: false });
        errorHandler(error, this.props);
      },
    );
  }

  getSessionDetail = (card_detail) => {
    this.refs.Load.OpenLoad();
    console.log(commonData.user_details, 'user....', this.props.navigation.state.params.select_cat_data);
    console.log(this.state.selectedCategory.category_id, "bbbb...")
    var param = {
      user_id: commonData.user_details.user_id,
      category_id: this.state.selectedCategory.category_id,
    };
    console.log(param, 'param getSessionDetail..');
    postApiRequestWithHeaders(
      commonData.api_endpoint.create_session,
      param,
    ).then(
      data => {
        console.log(data, 'session detail param');
        this.setState({ call_id: data.call_id });
        card_detail.call_id = data.call_id;
        card_detail.is_saved = true
        commonData.payment_card_details = card_detail;
        console.log(card_detail, 'param....');
        console.log('Push send11....');
        this.initiatePaymentApiCall(data, card_detail);
      },
      error => {
        this.refs.Load.CloseLoad();
        console.log('error....', error);
        errorHandler(error, this.props);
      },
    );
  }

  timeOutScreen = status => {
    clearInterval(this._interval);
    console.log(status, 'timeout');
    console.log(commonData.user_details, 'user....');
    var push_data = {
      data: [
        {
          notification: {
            body: 'Ask Ken Call Missed',
            title: 'Call Missed',
            content_available: true,
            priority: 'high',
          },
          data: {
            type: 'auto_end_call',
            device_token: commonData.user_details.device_token,
            user_id: commonData.user_details.user_id,
            name: commonData.user_details.name,
            category: this.state.selectedCategory.category_name,
            uuid: commonData.user_details.uuid,
            // sessionId: session.session_id,
            // token: session.token,
            // apiKey: session.api_key,
            // call_id: session.call_id,
            phone_number: commonData.user_details.phone_number.replace(
              /\s/g,
              '',
            ),
            notify_users: this.props.navigation.getParam('expert_found', ''),
          },
        },
      ],
    };
    console.log(push_data, 'push_data..');
    postApiRequestWithHeaders(
      commonData.api_endpoint.push_payload,
      push_data,
    ).then(
      data => {
        this.timeoutId = BackgroundTimer.setTimeout(() => {
          this.refund(push_data)
        }, 10000);
        // console.log('Push send for auto end call....', this.state.call_id);
        // postApiRequestWithHeaders(commonData.api_endpoint.refund, {
        //   user_id: commonData.user_details.user_id,
        //   call_id: this.state.call_id,
        // }).then(
        //   data => {
        //     console.log('Refund API Success', data);
        //     showToast(commonData.ToastMessages.call_timeout);
        //     const resetAction = StackActions.reset({
        //       index: 0,
        //       actions: [NavigationActions.navigate({ routeName: 'HomePage' })],
        //     });
        //     this.props.navigation.dispatch(resetAction);
        //     //showToast(data.message);
        //   },
        //   error => {
        //     console.log('error....', error);
        //     // this.setState({ loader: false });
        //     errorHandler(error, this.props);
        //   },
        // );
      },
      error => {
        console.log('error....', error);
        // this.setState({ loader: false });
        errorHandler(error, this.props);
      },
    );

  };

  refund() {

    console.log('Push send for auto end call....', this.state.call_id);
    postApiRequestWithHeaders(commonData.api_endpoint.refund, {
      user_id: commonData.user_details.user_id,
      call_id: this.state.call_id,
    }).then(
      data => {
        console.log('Refund API Success', data);
        showToast(commonData.ToastMessages.call_timeout);
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'HomePage' })],
        });
        this.props.navigation.dispatch(resetAction);
        //showToast(data.message);
      },
      error => {
        console.log('error....', error);
        // this.setState({ loader: false });
        errorHandler(error, this.props);
      },
    );

  }
  render() {
    return (
      // <Container>
      //   <Load ref="Load" Image={0}></Load>
      //   {!this.state.show_connecting && (
      //     <View style={{flex: 1}}>
      //       <Header transparent style={styles.header}>
      //         <Left style={{flex: 1}}>
      //           <Button
      //             style={{}}
      //             transparent
      //             hitSlop={hitSlop}
      //             onPress={() => this.navigator('back')}>
      //             <Icon style={[styles.black_text]} name="arrow-back" />
      //           </Button>
      //         </Left>
      //         <Body style={{flex: 2}}>
      //           <View
      //             style={{
      //               flexDirection: 'row',
      //               justifyContent: 'center',
      //               marginTop: 9,
      //             }}>
      //             <Text style={styles.pageTitle}>
      //               Add Credit Card
      //               {/* {this.state.show == 'card' && (
      //             <Image style={{ width: 30, height: 30, margi }} source={lock_icon} />
      //           )} */}
      //             </Text>

      //             <Button
      //               transparent
      //               style={{paddingBottom: 9, paddingLeft: 4}}>
      //               <Image style={{width: 23, height: 22}} source={lock_icon} />
      //             </Button>
      //           </View>
      //         </Body>
      //         <Right />
      //       </Header>
      //       <View style={{flex: 1}}>
      //         {/* <Spinner
      //           visible={this.state.loader}
      //           color={colors.THEME_YELLOW}
      //         /> */}
      //         <Card
      //           clickHandler={this.cardHandler}
      //           replaceText={'Use Another Card'}
      //           replaceCard={true}
      //           cards={this.state.cards}
      //           showNext={true}
      //           is_exist={this.state.is_exist}></Card>
      //       </View>
      //     </View>
      //   )}
      //   {this.state.show_connecting && (
      //     <View style={{flex: 1}}>
      //       <Connecting
      //         onRef={ref => (this.child = ref)}
      //         parentCallback={this.timeOutScreen}
      //         pageFrom="card"></Connecting>
      //     </View>
      //   )}
      // </Container>
      <View style={{ flex: 1 }}>
        <Load ref="Load" Image={0}></Load>
        {this.state.view == 'addCard' && (
          <AddCard
            handler={this.navigator}
            is_exist={this.state.is_exist}></AddCard>
        )}

        {this.state.view == 'intro' && (
          <PaymentIntro handler={this.navigator}></PaymentIntro>
        )}
        {this.state.view == 'work' && (
          <HowItWorks handler={this.navigator}></HowItWorks>
        )}
        {this.state.view == 'connecting' && (
          <View style={{ flex: 1 }}>
            <Connecting
              onRef={ref => (this.child = ref)}
              parentCallback={this.timeOutScreen}
              pageFrom="card"></Connecting>
          </View>
        )}
      </View>
    );
  }
}

export default CardDetails;
