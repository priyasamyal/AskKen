import React, { Component } from 'react';
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
import { connect } from "react-redux";
import Slider from 'react-native-slider';
import { colors } from '../../common/index';
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import commonData from '../../common/data.js';
import LinearGradient from 'react-native-linear-gradient';
const end_call_image = require('../../assets/imgs/end-call1.png');
const videoOn = require('../../assets/imgs/video-on.png');
const videoOff = require('../../assets/imgs/video-off.png');
const audioOn = require('../../assets/imgs/speaker-on.png');
const audioOff = require('../../assets/imgs/speaker-off.png');
const switch_camera = require('../../assets/imgs/swap_camera.png');
const selfie_on = require('../../assets/imgs/selfie-on.png');
const selfie_off = require('../../assets/imgs/selfie-off.png');
const lightOn = require('../../assets/imgs/light-on.png');
const lightOff = require('../../assets/imgs/light-off.png');
const mute_off = require('../../assets/imgs/mute-icon.png');
const mute_on = require('../../assets/imgs/mute-on.png');
// create a component

// this.props.parentCallback(this.props.current_uuid);
class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      footer_display: true
    }
    console.log(this.props.sessionData,"llll")
  }
  actionHandler(action) {
    console.log('state footer callback..', this.props.stateParams);
    console.log('state..', this.props.subscriber_info);
    console.log('state..', this.props.subscriber_info.name);
  
    this.props.parentCallback(action);
  }

  showSkill() {
    if (this.props.user.user_type == 'expert') {
      return (

        <Text style={styles.designation}>
          {this.props.stateParams.category}
          {this.props.stateParams.price}
        </Text>


      );
    } else {
      return (


        <Text style={styles.designation}>
          {this.props.stateParams.category}
        </Text>



      );
    }
  }

  updateHeight = status => {
    console.log("Update Height", status);
    status == "hide" ? this.setState({ footer_display: false }) : this.setState({ footer_display: true })
  }
  render() {
    return (
      <View style={styles.footerOuter}>
        <Text style={styles.name}>{this.props.user.user_type=="expert"?this.props.sessionData.current_ticket.owner_name: this.props.sessionData.current_ticket.expert_name}-{this.props.sessionData.current_ticket.category_name}</Text>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footer_container}
            onPress={() => this.actionHandler('switchCamera')}>
            <Image style={styles.footer_icon}
              source={this.props.stateParams.cameraPosition == "front" ? selfie_on : selfie_off}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footer_container}
            onPress={() => this.actionHandler('endCall')}>
            <Image style={styles.footer_icon_end} source={end_call_image} />
          </TouchableOpacity>

          {this.props.user.user_type == "expert" && (
            <TouchableOpacity
              style={styles.footer_container}
              onPress={() => this.actionHandler('toggleVideo')}>
              <Image
                style={styles.footer_icon}
                source={this.props.stateParams.publishVideo ? videoOn : videoOff}
              />
            </TouchableOpacity>
          )}
          {this.props.user.user_type != "expert" && (
            <TouchableOpacity
              style={styles.footer_container}
              onPress={() => this.actionHandler('toggleTorch')}>
              <Image
                style={styles.footer_icon}
                source={this.props.stateParams.showFlash ? lightOn : lightOff}
              />
            </TouchableOpacity>
          )}     
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  console.log(state)
  return {
    user: state.user.userData,
    ticket_data: state.user,
    sessionData: state.sessionData.session
  }
}
export default connect(mapStateToProps, { })(Footer);