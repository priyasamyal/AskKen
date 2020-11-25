import React, { Component } from 'react';
import styles from './styles';
import {
  View,
  TouchableOpacity,
  Platform,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { colors } from '../../common/index';

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
import {
  postApiRequestWithHeaders,
  errorHandler,
} from '../../common/user';
import commonData from '../../common/data.js';
import { postApiRequest, showToast } from '../../common/user';
import Ready from '../../components/Ready';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import Load from 'react-native-loading-gif';
import uuid from 'uuid';
class CallReady extends Component {
  constructor(props) {
    super(props);
    //   console.log('inside constructor ');

    this.props.navigation;
    this.state = {
      selectedCategory: this.props.navigation.state.params.select_cat_data,
      is_exists: this.props.navigation.state.params.is_exists,
      call_id: '',
      is_connected: false,
      ready_text: "Connect Me"
    };
  }
  componentDidUpdate() {
    //console.log('component did update');
  }
  componentDidMount() {
    // console.log(
    //   this.props.navigation.getParam('expert_found', ''),
    //   'params navogai',
    // );
  }
  navigator = action => {
    // console.log(action, 'actionnnn');
    switch (action) {
      case 'back': {
        this.props.navigation.goBack();
        break;
      }
    }
  };

  connectMe = () => {
    if (commonData.user_details.cards.length > 0) {
      if (!this.state.is_connected) {
        //showToast("one time toats")
        this.setState({ is_connected: !this.state.is_connected, ready_text: 'Connecting...' })
        this.getSessionDetail();
      }
      //   console.log('connect Me');
    }
    else {
      //  console.log("New type");
      this.props.navigation.navigate('CardDetails', {
        view: 'intro',
        is_exist: false,
        expert_found: this.props.navigation.getParam('expert_found', ''),
        select_cat_data: this.state.selectedCategory,
      });
    }
    // if (commonData.user_details.cards.length > 0) {
    //   this.props.navigation.navigate('CardDetails', {
    //     view: 'connecting',
    //     is_exist: true,
    //     expert_found: this.props.navigation.getParam('expert_found', ''),
    //     select_cat_data: this.state.selectedCategory,
    //     card_id: {card_id: commonData.user_details.cards[0].card_id},
    //   });
    // } else {
    //   //   let view =
    //   //   commonData.user_details.cards.length == 0 ? 'intro' : 'addCard';
    //   // let is_exist = commonData.user_details.cards.length == 0 ? false : true;
    //   this.props.navigation.navigate('CardDetails', {
    //     view: 'intro',
    //     is_exist: false,
    //     expert_found: this.props.navigation.getParam('expert_found', ''),
    //     select_cat_data: this.state.selectedCategory,
    //   });
    // }

    // this.props.navigation.navigate('CardDetails', {
    //   select_cat_data: this.state.selectedCategory,
    //   is_exists: this.state.is_exists,
    //   expert_found: this.props.navigation.getParam('expert_found', ''),
    // });
  };

  getSessionDetail() {
    //this.refs.Load.OpenLoad();
    // console.log(commonData.user_details, 'user....');
    var param = {
      user_id: commonData.user_details.user_id,
      category_id: this.state.selectedCategory.category_id,
    };
    // console.log(param, 'param getSessionDetail..', commonData.user_details);
    postApiRequestWithHeaders(
      commonData.api_endpoint.create_session,
      param,
    ).then(
      data => {

        var card_detail = {
          call_id: data.call_id,
          card_id: commonData.user_details.cards[0].card_id,
          user_id: commonData.user_details.user_id,
        }
        // console.log(data, 'session detail param');
        this.setState({ call_id: data.call_id });
        commonData.payment_card_details = card_detail;
        /**Short Cut... */
        var call_uuid = uuid.v4().toLowerCase();
        this.sendPushNotification(data, call_uuid, "0.2", param);
        // this.initiatePaymentApiCall(data, card_detail);
      },
      error => {
        // console.log('error....', error);
        errorHandler(error, this.props);
      },
    );
  }

  initiatePaymentApiCall = (data, param) => {
    param.fees = this.state.selectedCategory.price;
    ///  console.log(param, 'param....');
    postApiRequestWithHeaders(
      commonData.api_endpoint.intial_payment,
      param,
    ).then(
      res => {
        //  console.log(res.price, 'data.....');
        var call_uuid = uuid.v4().toLowerCase();
        this.sendPushNotification(data, call_uuid, res.price, param);

      },
      error => {
        this.refs.Load.CloseLoad();
        // console.log('error....', error);
        errorHandler(error, this.props);
      },
    );
  };

  sendPushNotification(session, call_uuid, price, param) {
    // console.log(commonData.user_details, 'user....');
    // console.log(this._interval, 'this._interval....');

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
    //  console.log(push_data, 'push_data final ..');
    postApiRequestWithHeaders(
      commonData.api_endpoint.push_payload,
      push_data,
    ).then(
      data => {
        // this.refs.Load.CloseLoad();
        //  console.log('Push send....');
        // this.props.navigation.navigate('CardDetails', {
        //   view: 'connecting',
        //   is_exist: true,
        //   expert_found: this.props.navigation.getParam('expert_found', ''),
        //   select_cat_data: this.state.selectedCategory,
        //   card_id: { card_id: commonData.user_details.cards[0].card_id },
        //   call_id: param.call_id
        // });
        this.props.navigation.navigate("VideoCall", {
          sessionId: session.session_id,
          token: session.token,
          apiKey: session.api_key,
          call_id: session.call_id,
          pageFrom: 'card',
          notify_users: this.props.navigation.getParam('expert_found', ''),
          price: price.toString(),
          category: this.state.selectedCategory.category_name
          // "payload": message._data
        });

        //  console.log(data, 'data.....');
      },
      error => {
        //   console.log('error....', error);
        // this.setState({ loader: false });
        errorHandler(error, this.props);
      },
    );
  }

  render() {
    return (
      // <Ready></Ready>
      <Container style={{ backgroundColor: colors.THEME_YELLOW }}>
        <Load ref="Load" Image={0}></Load>
        <Header transparent style={styles.header}>
          <Left style={{ flex: 1 }}>
            <Button
              transparent
              hitSlop={hitSlop}
              onPress={() => this.navigator('back')}>
              <Icon style={[styles.black_text]} name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            {/* <Title style={styles.pageTitle}>Upload License Pictures</Title> */}
          </Body>
          <Right />
        </Header>
        <View style={{ flex: 1 }}>
          <Ready
            parentCallback={this.connectMe}
            category_data={this.state.selectedCategory}
            ready_text={this.state.ready_text}></Ready>
        </View>
      </Container>
    );
  }
}
export default CallReady;
