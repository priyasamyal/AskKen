//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Linking, Image, TouchableOpacity } from 'react-native';
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
// create a component
import { setUserData,setCurrentTicket,setSession } from "../../actions";
import { connect } from "react-redux";
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import { connecting_interval, networkCheck,socket,short_interval,  clear_push_interval } from '../../common/user';
import Load from 'react-native-loading-gif';
const Sound = require('react-native-sound');
BackgroundTimer.start();
var { width, height } = Dimensions.get('window');
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import commonData from '../../common/data.js';
const loader = require('../../assets/imgs/asken.gif');
const cancel = require('../../assets/imgs/end-call.png');
const call_fail = require('../../assets/imgs/call_fail.png');
const call_back = require('../../assets/imgs/call_back.png');
import InCallManager from 'react-native-incall-manager';

openDialer = () => { };

class Connecting extends Component {
  intervalID = 0;
  componentDidMount() {
    console.log("conecting...")
    if (this.props.pageFrom == "card") {
      this.props.onRef(this);
      console.log("start calll")
      InCallManager.start({ media: 'video', ringback: '_BUNDLE_', auto: true });
      InCallManager.setSpeakerphoneOn(true);
      InCallManager.setForceSpeakerphoneOn(true)
      //this.intervalID = setInterval(this.hello, 1000);
      this.intervalID  = setInterval(e => {
        console.log('1connecting_interval Interval.....', this.intervalID);
        this.props.parentCallback('timeout');
      }, 35000);
      // connecting_interval().then(data => {
      //   clear_push_interval();
      //   this.props.parentCallback('timeout');
      // });
    }
    if (this.props.pageFrom == "splash") {
      this.props.onRef(this);
      console.log("start calll")
    
      short_interval().then(data => {
        this.props.parentCallback('timeout');
      });
    }
  }

  componentWillUnmount() {
    console.log("clear on unmount..")
    clearInterval(this.intervalID);
  }

  test() {
    console.log('testing');
  }
  clearIntervalFun() {
    clearInterval(this._interval1);
  }
  componentDidUnMount() {
    if (this.props.pageFrom == "card") {
      InCallManager.stop({ busytone: '_DTMF_' });
    }
  }
  componentDidLeave() {
    if (this.props.pageFrom == "card") {
      InCallManager.stop({ busytone: '_DTMF_' });
      InCallManager.stop();
    }
   
  }
  navigator = page => {
    switch (page) {
      case 'connect': {
        console.log('next');
        this.props.parentCallback();
        break;
      }
      case 'cancel': {
        InCallManager.stop({ busytone: '_DTMF_' });
        clear_push_interval();
        console.log('cancel');
        this.props.parentCallback('cancel');
        break;
      }
      default:
        this.props.parentCallback(page);
        break;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.pageFrom != 'refresh' && (
          <View style={styles.container}>
            <Image style={styles.image} source={loader} />
              <View style={{ alignItems: 'center', bottom: "5%", position: 'absolute' }}>
                {this.props.pageFrom == 'card' && (
                  <TouchableOpacity hitSlop={hitSlop} onPress={() => this.navigator('cancel')}>
                    <Image style={styles.image_cancel} source={cancel} />
                  </TouchableOpacity>
                )}
              </View>
          </View>
        )}

        {this.props.pageFrom == 'refresh' && (
          <View style={styles.container_fail}>
            <Text style={styles.call_fail}>Call Failed</Text>
            <Text style={styles.call_fail_des}>There is a poor {'\n'} connection.</Text>

            <View style={{ flex: 1, justifyContent: 'flex-end', padding: 40 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 100 }}>
                <TouchableOpacity hitSlop={hitSlop} onPress={() => this.navigator('end_call')}>
                  <Image style={styles.image_cancel_fail} source={call_fail} />
                  <Text style={[styles.btn_txt, { fontFamily: 'PTSans-Bold', }]}>End Call</Text>
                </TouchableOpacity>

                <TouchableOpacity hitSlop={hitSlop} onPress={() => this.navigator('call_back')}>
                  <Image style={styles.image_cancel_fail} source={call_back} />
                  <Text style={[styles.btn_txt, { fontFamily: 'PTSans-Bold', }]}>Call Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#000000",
    
   // backgroundColor: colors.BLACK_TEXT,
  },

  headingTextTitle: {
    fontFamily: 'PTSans-Bold',
    fontSize: 25,
    textAlign: 'center',
    letterSpacing: 0.8,
    color: colors.BLACK_TEXT,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 5,
    resizeMode: "cover",
  },

  image_cancel: {
    width: 80,
    height: 80,
    borderRadius: 5,
    resizeMode: "cover",
  },
  end_btn: {
    borderRadius: 30
  },
  container_fail: {
    flex: 1,
  },
  call_fail: {
    marginTop: "40%",
    fontFamily: 'PTSans-Bold',
    fontSize: 30,
    textAlign: 'center',
    padding: 20
  },
  call_fail_des: {
    fontFamily: 'PTSans-Regular',
    fontSize: 20,
    textAlign: 'center',
    marginTop: "0%",
  },
  image_cancel_fail: {
    width: 70,
    height: 70,
    borderRadius: 5,
    resizeMode: "cover",
    alignSelf: 'center'
  },
  btn_txt: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'PTSans-Regular',
    padding: 10
  }

});


function mapStateToProps(state) {
  console.log(state)
  return {
    user: state.user.userData,
    ticket_data: state.user,
    sessionData: state.sessionData.session
  }
}
export default connect(mapStateToProps, {setUserData,setCurrentTicket,setSession })(Connecting);