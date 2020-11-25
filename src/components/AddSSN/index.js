//import liraries
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TextInput,
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
} from 'native-base';
import commonData from '../../common/data.js';
import {
  postApiRequest,
  showToast,
  setItem,
  postApiRequestWithHeaders,
  errorHandler,
} from '../../common/user';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { connect } from "react-redux";
import styles from './styles';
import CommonToast from "@custom_components/CommonToast";

const lock_icon = require('../../assets/imgs/lock_card.png');
// create a component
class AddSSN extends Component {
  err = undefined;
  constructor(props) {
    super(props);
    console.log(props, 'props in card ');
    this.state = {
      social: '',
      ssn_full: '',
      message: "",
      type: "",
      showCustomToast: false
    };
  }
    //Function for validations check
    callToastFunction = (msg) => {
      setTimeout(() => {
        this.setState({
          message: msg,
          type: "error",
          showCustomToast: true
        })
      }, 400);
  
      setTimeout(() => {
        this.setState({
          showCustomToast: false
        });
      }, 3000);
    }
  componentDidMount() {
    if (this.props.user.user_type == 'expert' && this.props.user.cards.length > 0) {
      this.setState({
        social:1234,
      });

      this.err = commonData.stripe_status.errors.find(ind => {
        return ind == "id_number";
      })

      console.log(this.err, "erroo...")
    }
  }
  navigator = navigateTo => {
    switch (navigateTo) {
      case 'next': {
        Keyboard.dismiss();
        this.Validator();
        break;
      }
      case 'work': {
        Keyboard.dismiss();
        this.props.handler('work');
        break;
      }

      case 'back': {
        //  Keyboard.dismiss();
        // setTimeout(() => {
        this.props.handler('back');
        // }, 6000);

        break;
      }
    }
  };

  //Function to set the input value to state
  setSocial = number => {
    this.setState({ social: number });
  };

  setFullSocial = number => {
    this.setState({ ssn_full: number });
  };
  //Function to validate SSN number
  Validator = () => {
    const numberPattern = /[0-9]/g;
    ssn = numberPattern.test(this.state.social);
    ssn_full = numberPattern.test(this.state.ssn_full);
    if (!this.state.social) {
      this.callToastFunction(commonData.ToastMessages.ssn);
    } else if (!ssn) {
      this.callToastFunction(commonData.ToastMessages.ssn);
    } else if (this.state.social.length < 4) {
      this.callToastFunction(commonData.ToastMessages.ssn);
    }
    else if (this.state.ssn_full.length < 9 && this.err != undefined) {
      this.callToastFunction(commonData.ToastMessages.ssn_full);
    }
    else {
      let param = this.props.navigation.state.params.param;
      param.ssn = this.state.social;
      if (this.err != undefined) {
        param.ssn_full = this.state.ssn_full;
        param.ssn = this.state.ssn_full.substring(this.state.ssn_full.length - 1, 4);
      }

      console.log(param, "Param")
      this.props.handler('expertApiCall', param);
    }
  };

  render() {
    return (
      <Container>
         {this.state.showCustomToast ? (
          <View style={{
            position: "absolute",
            bottom: 0,
          }}>
            <CommonToast type={this.state.type} message={this.state.message} />
          </View>
        ) : null}
        <Header transparent style={styles.header}>
          <Left>
            <Button
              transparent
              hitSlop={hitSlop}
              onPress={() => this.navigator('back')}>
              <Icon style={[styles.black_text]} name="arrow-back" />
            </Button>
          </Left>
          <Body></Body>
          <Right style={{ flex: 3 }}>
            <TouchableOpacity onPress={() => this.navigator('work')}>
              <Title style={styles.pageTitle}>How does this work?</Title>
            </TouchableOpacity>
          </Right>
        </Header>

        <View style={styles.mainContainer}>
          <KeyboardAvoidingView
            keyboardShouldPersistTaps="never"
            style={styles.mainContent}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 50}>
            <View style={styles.mainContent}>
              {this.err == undefined && (<Text style={styles.headingText}>Last 4 of your social</Text>)}
              {this.err != undefined && (<Text style={styles.headingText}>9 digit of your social</Text>)}
              {this.err == undefined && (<Text style={styles.heading_description}>
                This helps the bank check that you’re {'\n'}really you.
                Verifying the last 4 of your{'\n'}social security number is a
                bank{'\n'}required step.
              </Text>)}

              {this.err != undefined && (<Text style={styles.heading_description}>
                This helps the bank check that you’re {'\n'}really you.
                Verifying the 9 digit of your{'\n'}social security number is a
                bank{'\n'}required step.
              </Text>)}
              <View>
                {this.err == undefined && (
                  <Item
                    stackedLabel
                    style={{
                      marginBottom: 20,
                      marginTop: 35,
                      borderColor: colors.card_border,
                      width: width,
                    }}>
                    <View style={{ width: width, flexDirection: 'row', alignItems: 'center', }}>
                      <Text style={styles.label_text}>
                        Last 4 of your social
                    </Text>
                      <Image
                        style={{
                          height: 15,
                          width: 13,
                          // marginTop: 8,
                          marginLeft: 5,
                        }}
                        source={lock_icon}
                      />
                    </View>

                    {this.props.user.cards.length == 0 && (
                      <Input
                        style={styles.inputText}
                        placeholder=""
                        placeholderTextColor={colors.card_placeholder}
                        keyboardType="number-pad"
                        selectionColor={colors.BLACK_TEXT}
                        onChangeText={social => this.setSocial(social)}
                        value={this.state.social}
                        maxLength={4}
                        autoFocus={true}
                      />
                    )}

                    {this.props.user.cards.length > 0 && (
                      <Input
                       editable={false} selectTextOnFocus={false}
                        style={[styles.inputText, { opacity: 0.8 }]}
                        placeholder=""
                        placeholderTextColor={colors.card_placeholder}
                        keyboardType="number-pad"
                        selectionColor={colors.BLACK_TEXT}
                        onChangeText={social => this.setSocial(social)}
                        value="XXXX"
                        maxLength={4}
                        autoFocus={true}
                      />)}
                  </Item>
                )}
                {this.err != undefined && (
                  <Item
                    stackedLabel
                    style={{
                      marginBottom: 20,
                      marginTop: 35,
                      borderColor: colors.card_border,
                      width: width,
                    }}>
                    <View style={{ width: width, flexDirection: 'row', alignItems: 'center', }}>
                      <Text style={styles.label_text}>
                        Enter your 9 digit social
                    </Text>
                      <Image
                        style={{
                          height: 15,
                          width: 13,
                          //   marginTop: 8,
                          marginLeft: 5,
                        }}
                        source={lock_icon}
                      />
                    </View>
                    <Input
                      style={styles.inputText}
                      placeholder=""
                      placeholderTextColor={colors.card_placeholder}
                      keyboardType="number-pad"
                      selectionColor={colors.BLACK_TEXT}
                      onChangeText={social => this.setFullSocial(social)}
                      value={this.state.ssn_full}
                      maxLength={9}
                      autoFocus={true}
                    />
                  </Item>
                )}

              </View>
              <View style={styles.nextButtonContainer}>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    padding: 13,
                    paddingRight: 20,
                    paddingLeft: 20,
                    paddingTop: 11,
                    backgroundColor: colors.BLACK_TEXT,
                    borderRadius: 5,
                  }}
                  hitSlop={hitSlop}
                  onPress={() => this.navigator('next')}
                  disabled={this.state.disabled}>
                  <Text
                    style={[
                      styles.nextButton,
                      { opacity: this.state.disabled ? 0.4 : 1 },
                    ]}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  console.log(state, "state in pay")
  return {
    user: state.user.userData
  }
}
export default connect(mapStateToProps, {})(AddSSN);
