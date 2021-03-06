import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,SafeAreaView,
  Linking
} from 'react-native';
import { colors } from './index';
import NetInfo from '@react-native-community/netinfo';
//import {get} from './apiHandler';
const noNetwork = 'No internet connectivity detected. Please try again.';
const url = 'https://www.askkenapp.com/api/v2/public';
//const url = 'https://www.askkenapp.com/api/public';
import { Alert } from 'react-native';
// import Toast from 'react-native-simple-toast';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { StackActions, NavigationActions } from 'react-navigation';
import commonData from '../common/data';
import { Toast } from 'native-base';
import SocketIOClient from 'socket.io-client';
_interval = 0;
_connect_interval = 0;
_short_interval =0;
// const axios = require('axios');

export const socket = SocketIOClient('https://www.askkenapp.com:3000/',{ jsonp : true, secure: true,transports: ['websocket']});

export const video_options = [
  {
    component: <Text style={{ color: colors.BLACK_TEXT, fontSize: 18, fontFamily: 'Avenir-Heavy', padding: 10 }}>Cancel</Text>,
    height: 50,
  },
  {
    component: <Text style={{ color: colors.BLACK_TEXT, fontSize: 16, fontFamily: 'AvenirLTStd-Medium', padding: 10, paddingTop: 10, paddingBottom: 10, }}>Record a Video</Text>,
    height: 60,
  },
  // {
  //   component: <Text style={{ color: colors.BLACK_TEXT, fontSize: 16, fontFamily: 'AvenirLTStd-Medium', justifyContent: 'center', paddingBottom: 10, paddingTop: 3 }}>Choose from library</Text>,
  //   height: 60,
  // },
];
export const options = [
  {
    component: <Text style={{ color: colors.BLACK_TEXT, fontSize: 18, fontFamily: 'Avenir-Heavy', padding: 10 }}>Cancel</Text>,
    height: 50,
  },
  {
    component: <Text style={{ color: colors.BLACK_TEXT, fontSize: 16, fontFamily: 'AvenirLTStd-Medium', padding: 10, paddingTop: 18 }}>Take a photo</Text>,
    height: 50,
  },
  {
    component: <Text style={{ color: colors.BLACK_TEXT, fontSize: 16, fontFamily: 'AvenirLTStd-Medium', justifyContent: 'center', paddingBottom: 10, paddingTop: 3 }}>Choose from library</Text>,
    height: 60,
  },
];

export const setItem = (USER_KEY, USER_VALUE) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.setItem(USER_KEY, USER_VALUE)
      .then(res => {
        resolve(true);
      })
      .catch(err => reject(err));
  });
};
export const clearLocalStorage = key => {
  return new Promise((resolve, reject) => {
    AsyncStorage.removeItem(key).then(
      res => {
        resolve(true);
      },
      error => {
        reject(false);
      },
    );
  });
};

export const getItem = USER_KEY => {
  return new Promise((resolve, reject) => {
    AsyncStorage.multiGet(USER_KEY)
      .then(res => {
        console.log(res, 'response...');
        if (res !== null) {
          resolve(res);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};

//Alert function
export const alertWithTwoBtn = (title, message, btn1Text, btn2Text) => {
  console.log('alert function ');
  return new Promise((resolve, reject) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: btn1Text,
          onPress: () => resolve(false),
        },
        {
          text: btn2Text,
          onPress: () => resolve(true),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  });
};

export const alertWithSingleBtn = (title, message, btn1Text) => {
  console.log('alert function ');
  return new Promise((resolve, reject) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: btn1Text,
          onPress: () => resolve(true),
        },
      ],
      { cancelable: false },
    );
  });
};
export const showToast = message => {
  // Toast.show(message, Toast.LONG, Toast.BOTTOM);
  Toast.show({
    text: message,
    position: 'bottom',
    textStyle: { textAlign: 'center' },
    duration: 5000,
  });
};

//function for opening in app browsere
export const openUrl = url => {
  InAppBrowser.open(url);
};

//Network check
export const networkCheck = () => {
  return new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      // console.log('Connection type', state.type);
      // console.log('Is connected?', state.isConnected);
      resolve(state.isConnected);
    });
  });
};

//function for get request with out header
export const getApiRequest = endpoint => {
  console.log(url + endpoint)
  return new Promise((resolve, reject) => {
    networkCheck().then(data => {
      if (!data) {
        reject(commonData.ToastMessages.no_internet);
      } else {
        axios
          .get(url + endpoint)
          .then(function (response) {
            console.log(response);
            if (response.data.meta.code == 200) {
              resolve(response.data.data);
            } else if (response.data.meta.code == 401) {
              reject(response.data.meta);
            } else {
              reject(response.data.errors.message);
            }
          })
          .catch(function (error) {
            // reject(error);
            reject("Netowrk Error. Try again after sometime.");
            console.log(error, 'errror');
          });
      }
    });
  });
};
//function for post request with out header
export const postApiRequest = (endpoint, param) => {
  return new Promise((resolve, reject) => {
    networkCheck().then(data => {
      if (!data) {
        reject(commonData.ToastMessages.no_internet);
      } else {
        axios
          .post(url + endpoint, param)
          .then(function (response) {
            console.log(response);
            if (response.data.meta.code == 200) {
              resolve(response.data.data);
            } else if (response.data.meta.code == 401) {
              reject(response.data.meta);
            } else {
              reject(response.data.data.errors.message);
            }
          })
          .catch(function (error) {
            // reject(error);
            console.log(error, 'errror');
            reject("Netowrk Error. Try again after sometime.");
          });
      }
    });
  });
};
//function for post request with  header
export const postApiRequestWithHeadersServerEoor = (endpoint, param, access_token) => {
  return new Promise((resolve, reject) => {
    networkCheck().then(data => {
      if (!data) {
        reject(commonData.ToastMessages.no_internet);
      } else {
        //  console.log(commonData.user_details.access_token, 'acees token', endpoint, commonData.user_details);
        const options = {
          headers: { token: access_token },
        };
        console.log(url + endpoint, 'endpoint');
        axios
          .post(url + endpoint, param, options)
          .then(function (response) {
            console.log(response);
            //console.log(response.data);

            if (response.data.meta.code == 200) {
              resolve(response.data.data);
            } else if (response.data.meta.code == 401) {
              reject(response.data.meta);
            } else {
              reject(response.data.data.errors.message);
            }
          })
          .catch(function (error) {
            //  reject(error);
            reject("Card is not valid. Try again with another card.");
            console.log(error, 'errror');
          });
      }
    });
  });
};
//function for post request with  header
export const postApiRequestWithHeaders = (endpoint, param, access_token) => {
  //console.log(param, "request Param....")
  return new Promise((resolve, reject) => {
    networkCheck().then(data => {
      if (!data) {
        reject(commonData.ToastMessages.no_internet);
      } else {
        // console.log(commonData.user_details.access_token, 'acees token', endpoint, commonData.user_details);
        const options = {
          headers: { token: access_token },
        };
        console.log(url + endpoint, 'endpoint', param, access_token);
        axios
          .post(url + endpoint, param, options)
          .then(function (response) {
            console.log(response);
           // console.log(response.data);

            if (response.data.meta.code == 200) {
              resolve(response.data.data);
            }
            else if (response.data.meta.code == 402) {
              reject(response.data.data.errors.message);
            }
             else if (response.data.meta.code == 401) {
              reject(response.data.meta);
            } else {
              reject(response.data.data.errors.message);
            }
          })
          .catch(function (error) {
            //  reject(error);
            reject("Netowrk Error. Try again after sometime.");
            console.log(error, 'errror');
          });
      }
    });
  });
};
//eroor handler function
export const errorHandler = (error, props) => {
  console.log(error, "error")
  if (error.code == 401) {
    //showToast(commonData.ToastMessages.session_expire);
    clearLocalStorage('user_details').then(data => {
      console.log('aaaaa');
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate(
            { routeName: 'SelectUser' },
            { text: 'Enter' },
          ),
        ],
      });
      props.navigation.dispatch(resetAction);
    });
  } else {
    //showToast(error);
  }
};

export const errorHandler1 = (error, props) => {
  if (error.code == 401) {
    showToast(commonData.ToastMessages.session_expire);
    clearLocalStorage('user_details').then(data => {
      console.log('aaaaa');
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate(
            { routeName: 'SelectUser' },
            { text: 'Enter' },
          ),
        ],
      });
      props.navigation.dispatch(resetAction);
    });
  } else {
    // showToast(error);
  }
};
export const check = () => {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
};



export const clear_push_interval = () => {
  console.log('clear interval.....', this._interval, this._connect_interval);
  clearInterval(this._interval);
  clearInterval(this._connect_interval);
  clearInterval(this._short_interval);
};

export const connecting_interval = data => {
  return new Promise((resolve, reject) => {
    var x = 0;
    this._connect_interval = setInterval(e => {
      console.log('1connecting_interval Interval.....', this._connect_interval);
      resolve(true);
    }, 35000);
  });
};

export const short_interval = data => {
  return new Promise((resolve, reject) => {
    var x = 0;
    this._short_interval = setInterval(e => {
      console.log('1connecting_interval Interval.....', this._connect_interval);
      resolve(true);
    }, 30000);
  });
};

export const push_interval = data => {
  return new Promise((resolve, reject) => {
    var x = 0;
    this._interval = setInterval(e => {
      console.log('Global Interval.....');
      resolve(true);
      this.sendPushNotification(data);
      if (++x === 4) {
        console.log(x);
        clearInterval(this._interval);
      }
    }, 3000);
  });
};

sendPushNotification = data => {
  // console.log(data, "user....sendPushNotification of global");
  postApiRequestWithHeaders(commonData.api_endpoint.push_payload, data).then(
    data => {
      console.log('Push send....');
      //  this.setState({ show_connecting: true })
      console.log(data, 'data.....');
    },
    error => {
      console.log('error....', error);
      // this.setState({ loader: false });
      errorHandler(error, this.props);
    },
  );
};
//api
