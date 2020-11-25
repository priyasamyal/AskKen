import React, { Component } from 'react';
import styles from './styles';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Clipboard
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Button,
  Body,
  Right,
  Icon,
  Title,
  CheckBox,
} from 'native-base';

import { colors } from '../../common/index';
import commonData from '../../common/data.js';
import { connect } from "react-redux";
const logo = require('../../assets/imgs/logo.png');
import { setUserType } from "../../actions";
import { AppEventsLogger } from "react-native-fbsdk";
class SelectUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      expertSelected: false,
      ownerSelected: false,
      selectedCheckbox: '',
    };
   
  }
  /**
   * Click handle of next and back
   */
  navigator(page) {
    console.log(page);
    this.props.setUserType(page);
    this.props.navigation.navigate('EnterPhoneNumber');
  }

  render() {
    return (
      <Container>
        <View style={[styles.mainContainer]}>
          <View style={styles.mainContent}>
            <Image style={styles.image} source={logo} />
            <Text style={styles.headingText}>
              Instant home{'\n'}help, whenever{'\n'}you need it.        
             
            </Text>
            {/* <TouchableOpacity onPress={() =>  Clipboard.setString(commonData.apn_token)}>
          <Text> {commonData.apn_token}</Text>
        </TouchableOpacity> */}
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: colors.grey_bg, paddingTop: 30, paddingBottom: 30 }}>
            <View style={styles.continueBtnContainer}>
              <Button
                onPress={() => {
                  this.navigator("owner")
                }}
                style={[styles.continueBtn, { backgroundColor: colors.LIGHT_COLOR, borderWidth: 1, borderColor: colors.btn_border }]} >
                <Text style={[styles.continueBtnTxt, { color: colors.BLACK_TEXT }]}>I'm a Homeowner</Text>
              </Button>
            </View>
            <View style={styles.continueBtnContainer}>
              <Button style={styles.continueBtn}
                onPress={() => {
                  this.navigator("expert")
                }}
              >
                <Text style={styles.continueBtnTxt}>I'm a Pro</Text>
              </Button>
            </View>
          </View>
        </View>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
  }
}
export default connect(mapStateToProps, { setUserType })(SelectUser);
