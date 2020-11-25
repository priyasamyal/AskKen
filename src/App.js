import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  YellowBox
} from 'react-native';
import { Root } from 'native-base';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import 'react-native-gesture-handler'
import AppContainer from './routes';
import commonData from './common/data';
import { getItem, getApiRequest, showToast } from './common/user';
import SplashScreen from 'react-native-splash-screen';
import uuid from 'uuid';
import TimeZone from 'react-native-timezone';
//import firebase from 'react-native-firebase';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";

console.ignoredYellowBox = ['Warning:', 'Sending', 'Warning'];
YellowBox.ignoreWarnings([
  "Warning: DatePickerIOS has been merged with DatePickerAndroid",
  "Sending `Proximity`",
  "Warning: Sending `Proximity`",
  "Warning: Sending `Proximity` with no listeners registered",
  'Warning: Failed prop type',
  'Warning: Failed prop type: Invalid prop `children` supplied to `OTSession`',
  'Task orphaned',
  'Warning: componentWillMount is deprecated',
  'Warning: Each child in a list should have a unique "key" prop',
  'Warning: Task orphaned for request',
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  "Warning: Can't perform a React state update on an unmounted component",
  "Warning: componentWillReceiveProps has been renamed",
  "Warning: componentWillMount has been renamed",
  "Warning: Task orphaned for request",
  "Warning: Sending `onAnimatedValueUpdate` with no listeners registered",
  "Warning: Sending onAnimatedValueUpdate with no listeners registered",
  "Modal with 'pageSheet' presentation style and 'transparent' value is not supported",
  "Warning: Encountered two children with the same key",
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.",
  "Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date()",
]);
import RNCallKeep from 'react-native-callkeep';

const configure = () => {
  PushNotification.configure({
    // user accepted notification permission - register token
    onRegister: function (tokenData) {
      console.log(tokenData,"tokenData")
      commonData.apn_token=tokenData.token;
      const { token } = tokenData;
      // handle device token
      // send token to server...
      // store in AsyncStorage...
    },
    // notification received / opened in-app event
    onNotification: function (notification) {
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    onRegistrationError: function(err) {
      console.log(err.message, err,"error11");
      commonData.apn_token=err.message;
    },
    // outlining what permissions to accept
    permissions: {
      alert: true,
      badge: true,
      sound: true
    }
  });
}
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeFetched: false,
    };

   // configure();
  }
  componentDidMount() {
    TimeZone.getTimeZone().then(zone => 
      {commonData.time_zone = zone      
    });
    this.getCommonDetails();
    // this.setUpPush();
    //this.setUpPush();
    // PushNotificationIOS.requestPermissions();
    //   PushNotificationIOS.addEventListener('register', (token) => {
    //        console.log("MyAPNSTOKEN", token);
    //        commonData.apn_token=token;
    //     });
  }

  // setUpPush = () => {
  //   console.log("push setup")
  //   firebase.messaging().hasPermission()
  //     .then(enabled => {
  //       if (enabled) {
  //         firebase.messaging().getToken().then(token => {
  //           console.log("LOG Messaging: ", token);
  //           this.messageListener();
  //         })
  //         // user has permissions
  //       } else {
  //         firebase.messaging().requestPermission()
  //           .then(() => {
  //             console.log("User Now Has Permission");
  //             this.messageListener();
  //           })
  //           .catch(error => {
  //             alert("Error", error);
  //             this.messageListener();
  //             // User has rejected permissions  
  //           });
  //       }
  //     });
  // }

  componentWillUnmount() {
    console.log("Unmount")
    //  this.notificationListener();
  }
  // messageListener = async () => {
  //   console.log("Message Listener.....")
  //   this.notificationListener = firebase.notifications().onNotification((notification) => {
  //     const { title, body } = notification;
  //     console.log(notification, "on receive")
  //     console.log(title, body);
  //   });

  //   this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
  //     console.log(notificationOpen, "on onNotificationOpened")
  //     const { title, body } = notificationOpen.notification;

  //     console.log(title, body);
  //   });

  //   const notificationOpen = await firebase.notifications().getInitialNotification();
  //   if (notificationOpen) {
  //     const { title, body } = notificationOpen.notification;
  //     console.log(title, body);
  //   }

  //   this.messageListener = firebase.messaging().onMessage((message) => {
  //     console.log(JSON.stringify(message), "On FInal Push Message Receive");
  //     RNCallKeep.displayIncomingCall("2780c2df-4a24-450c-abbd-2bfb9f598829", "9914103755", "Ask Ken Customer Call", 'number', false);
  //   });
  // }
  getCommonDetails = () => {
    getApiRequest(commonData.api_endpoint.get_countries).then(
      data => {
        console.log(data, "all data.... from common....")
        const getNewUuid = () => uuid.v4().toLowerCase();
        const callUUID = getNewUuid();
        commonData.country_codes = data.countries;
        commonData.categories = data.categories;
        commonData.states = data.states;
        commonData.signUpObj.uuid = callUUID;
        //  console.log(data, 'data in enter phone 1');
        commonData.country_codes = data.countries;
        commonData.categories = data.categories;
        commonData.latest_version = data.app_version;
        //  console.log(commonData.country_codes, 'commonData.country_codes /////');
        this.setState({ codeFetched: true });
        SplashScreen.hide();
      },
      error => {
        console.log(error, 'errorrrrrr');
        commonData.country_codes = [];
        commonData.categories = [];
        this.setState({ codeFetched: true });
        SplashScreen.hide();
        showToast(error);

      },
    );
  };
  render() {
    if (this.state.codeFetched) {
      return (
        <Root>
          <AppContainer />
        </Root>
      );
    } else {
      return null;
    }
  }
}
