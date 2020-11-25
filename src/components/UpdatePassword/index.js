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
import { StackActions, NavigationActions } from 'react-navigation';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };

class UpdatePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      modalVisible: false,
      disabled: true,
      text: props.text,
      forgotPassword: props.forgotPassword,
    };
  }
  disableButton(text) {
    console.log(text.length, 'text  from input dfield ');
    this.setState({ password: text });
    const passwordPattern = /[^\s]/;
    let password = passwordPattern.test(text);
    console.log(password, 'state');

    password && text.trim().length >= 5
      ? this.setState({ disabled: false })
      : this.setState({ disabled: true });
  }

  navigator(page) {
    switch (page) {
      case 'next': {
        console.log('next');
        Keyboard.dismiss();
        this.props.clickHandler({
          action: 'next',
          password: this.state.password,
        });
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
  }

  nextClicked() {
    console.log('next clicked');
  }

  render() {
    return (
      <Container>
        <View style={styles.mainContainer}>
          <KeyboardAvoidingView
            style={styles.mainContent}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 77 : 50}>
            <View style={styles.mainContent}>
              <Text style={styles.headingText}>{this.state.text}</Text>
              <View style={styles.numberInputContainer}>
                <TextInput
                  placeholder="Enter a Password"
                  style={styles.numberInput}
                  keyboardType="default"
                  secureTextEntry={true}
                  maxLength={14}
                  autoFocus={true}
                  selectionColor={colors.THEME_YELLOW}
                  onChangeText={password => this.disableButton(password)}
                  value={this.state.password}></TextInput>
              </View>

              <View style={styles.nextButtonContainer}>
                <TouchableOpacity
                  // style={{ alignSelf: 'flex-end', padding: 10 }}
                  style={{ opacity: !this.state.forgotPassword ? 1 : 0 }}
                  disabled={this.state.forgotPassword}
                  hitSlop={hitSlop}
                  onPress={() => this.navigator('forgot')}>
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
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    margin: 5,
  },
  pageTitle: {
    fontFamily: 'PTSans-Bold',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 10,
  },
  mainContainer: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    // marginTop: 10,
    height: Dimensions.get('window').height,
  },
  headingText: {
    margin: 40,
    fontFamily: 'PTSans-Regular',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  numberInputContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    paddingBottom: 3,
    padding: 5,
    marginTop: 20,
  },
  numberInput: {
    fontFamily: 'PTSans-Regular',
    fontSize: 18,
    padding: 7,
    paddingBottom: 9,
    width: '70%',
    color: colors.BLACK_TEXT,
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
    color: colors.BLACK,
    paddingLeft: 10,
  },
});
export default UpdatePassword;
