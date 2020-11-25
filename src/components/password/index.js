import React, { Component } from 'react';

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

import { colors } from '../../common/index';
import { Dimensions, StyleSheet } from 'react-native';
var { width, height } = Dimensions.get('window');
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import commonData from '../../common/data.js';
import { postApiRequest, setItem } from '../../common/user';
import HeaderComponent from "@custom_components/HeaderComponent";
import CommonToast from "@custom_components/CommonToast";
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
class PasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      modalVisible: false,
      disabled: true,
      text: props.text,
      forgotPassword: props.forgotPassword,
      message: "",
      type: "",
      showCustomToast: false
    };
  }
  disableButton(text) {
    // console.log(text.length, 'text  from input dfield ');
    this.setState({ password: text });
    const passwordPattern = /[^\s]/;
    let password = passwordPattern.test(text);
    // console.log(password, 'state');

    password && text.trim().length >= 5
      ? this.setState({ disabled: false })
      : this.setState({ disabled: true });
  }

  navigator(page) {
    Keyboard.dismiss();
    switch (page) {
      case 'next': {
        console.log('next');
        if (this.state.password.trim().length == 0) {
          setTimeout(() => {
            this.setState({
              message: "Please enter your password.",
              type: "error",
              showCustomToast: true
            })
          }, 450);
        } else {
          this.props.clickHandler({
            action: 'next',
            password: this.state.password,
          });
        }
        break;
      }

      case 'forgot': {
        console.log('back');

        this.props.clickHandler({
          action: 'forgot',
          password: this.state.password,
        });
        break;
      }

      case 'back': {
        console.log('back');
        this.props.clickHandler({
          action: 'back',
          password: this.state.password,
        });
        break;
      }
    }
    setTimeout(() => {
      this.setState({
        showCustomToast: false
      });
      // this.refresh()
    }, 3100);
  }

  nextClicked() {
    console.log('next clicked');
  }

  refresh = () => {
    if (this.textInputPwdRef) {
      setTimeout(() => {
        console.log('psd');
        this.textInputPwdRef.focus();
      }, 200);
    }
  };

  render() {
    return (
      <Container>
        <KeyboardAwareScrollView
          contentContainerStyle={[{ flex: 1 }]}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        >
          <HeaderComponent clickHandler={() => this.navigator('back')} />
          {/* <Header transparent style={styles.header}>
            <Left>
              <Button
                transparent
                hitSlop={hitSlop}
                onPress={() => this.navigator('back')}>
                <Icon
                  style={[
                    styles.black_text,
                    // {fontSize: Platform.OS === 'ios' ? 35 : 30}
                  ]}
                  name="arrow-back"
                />
              </Button>
            </Left>
            <Body>
            </Body>
            <Right />
          </Header> */}
          {this.state.showCustomToast ? (
            <View style={{
              position: "absolute",
              bottom: 0
            }}>
              <CommonToast type={this.state.type} message={this.state.message} />
            </View>
          ) : this.props.showToast ? (
            <View style={{
              position: "absolute",
              bottom: 0
            }}>
              <CommonToast type={this.props.type} message={this.props.message} />
            </View>
          ) : null}
          <View style={styles.mainContainer}>

            <View style={styles.mainContent}>
              {/* <Text style={styles.headingText}>{this.state.text}</Text> */}
              <Text style={styles.heading}>
                {' '}
                {this.state.text}
              </Text>
              <Text style={styles.headingText}>
                {/* {' '}
                Whether you're creating an {'\n'}account or signing back in, lets{'\n'}start with your number. */}
              </Text>

              <View style={styles.numberInputContainer}>
                <TextInput
                  placeholder=""
                  style={styles.numberInput}
                  keyboardType="default"
                  ref={ref => (this.textInputPwdRef = ref)}
                  secureTextEntry={true}
                  maxLength={14}
                  autoFocus={true}
                  selectionColor={colors.BLACK_TEXT}
                  onChangeText={password => this.disableButton(password)}
                  value={this.state.password}></TextInput>
              </View>


              <View style={styles.continueBtnContainer}>
                <Button style={styles.continueBtn}
                  onPress={() => {
                    this.navigator("next")
                  }}
                >
                  <Text style={styles.continueBtnTxt}>Continue</Text>
                </Button>

                <TouchableOpacity hitSlop={hitSlop} onPress={() => this.navigator('forgot')}>
                  <Text style={styles.terms}>Forgot Password?</Text>
                </TouchableOpacity>

              </View>


              {/* <View style={styles.nextButtonContainer}>
                <TouchableOpacity
                  // style={{ alignSelf: 'flex-end', padding: 10 }}
                  style={{ opacity: !this.state.forgotPassword ? 1 : 0 }}
                  disabled={this.state.forgotPassword}
                  hitSlop={hitSlop}
                  >
                  <Text style={[styles.forgotPassword]}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
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
              </View> */}
            </View>

            {/* <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: colors.grey_bg, paddingTop: 30, paddingBottom: 30, width: width }}>
              <View style={styles.continueBtnContainer}>
                <Button style={styles.continueBtn}
                  onPress={() => {
                    this.navigator("next")
                  }}
                >
                  <Text style={styles.continueBtnTxt}>Next</Text>
                </Button>
              </View>
              <View style={styles.continueBtnContainer}>
                <Button
                  onPress={() => {
                    this.navigator("forgot")
                  }}
                  style={[styles.continueBtn, { backgroundColor: colors.LIGHT_COLOR, borderWidth: 1, borderColor: colors.btn_border }]} >
                  <Text style={[styles.continueBtnTxt, { color: colors.BLACK_TEXT }]}>Forgot password?</Text>
                </Button>
              </View>

            </View> */}

          </View>
        </KeyboardAwareScrollView>
      </Container>

    );
  }
}
const styles = StyleSheet.create({
  header: {
    margin: 5,
    marginBottom: 0
  },
  pageTitle: {
    fontFamily: 'PTSans-Bold',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 10,
  },
  mainContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: colors.input_border,
    paddingTop: 35,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    // marginTop: 10,
    height: Dimensions.get('window').height,
  },
  heading: {
    paddingTop: 0,
    textAlign: 'center',
    fontFamily: 'Avenir-Heavy',
    fontSize: 23,
  },
  headingText: {
    margin: 40,
    marginTop: 15,
    marginBottom: 80,
    fontFamily: 'PTSans-Regular',
    fontSize: 18,
    textAlign: 'center',
    color: colors.grey_heading,
    letterSpacing: 0.7
  },
  numberInputContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    paddingBottom: 3,
    padding: 5,
  },
  numberInput: {
    fontFamily: 'AvenirLTStd-Medium',
    fontSize: 18,
    padding: 7,
    paddingBottom: 8,
    width: '80%',
    color: colors.BLACK_TEXT,
    paddingTop: 10,
  },
  nextButtonContainer: {
    justifyContent: 'flex-end',
    width: Dimensions.get('window').width,
    // alignSelf: 'flex-end',
    paddingTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
    position: 'absolute',
    bottom: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nextButton: {
    color: colors.THEME_YELLOW,
    fontFamily: 'PTSans-Regular',
    fontSize: 22,
    fontWeight: 'bold',
    opacity: 0.4,
    letterSpacing: 0.8,
  },
  forgotPassword: {
    color: colors.GREY_TEXT,
    fontFamily: 'PTSans-Regular',
    fontSize: 22,
    fontWeight: 'bold',
  },
  black_text: {
    color: colors.GREY_TEXT,
    paddingLeft: 10,
  },
  continueBtnContainer: {
    width: width - 60,

    marginTop: 35,

  },
  continueBtn: {
    backgroundColor: colors.BLACK_TEXT,
    justifyContent: 'center',
    height: 55,
    borderRadius: 15,
    marginBottom: 25,
  },
  continueBtnTxt: {
    color: colors.LIGHT_COLOR,
    fontFamily: 'Avenir-Heavy',
    fontSize: 18,
  },
  terms: {

    fontFamily: 'Avenir-Heavy',

    fontSize: 16,
    color: colors.BLACK_TEXT,
    textAlign: 'center'
  }
});
export default PasswordScreen;
