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
import CountryCodeModal from '../CountryCodeModal';
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Icon,
  Toast,
} from 'native-base';
import commonData from '../../common/data.js';
import {
  postApiRequest,
  showToast,
  setItem,
  postApiRequestWithHeaders,
  errorHandler,
} from '../../common/user';
import CarrierInfo from 'react-native-carrier-info';
import Load from 'react-native-loading-gif';

const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { connect } from "react-redux";
import { setUserPhoneNumber } from "../../actions";
import HeaderComponent from "@custom_components/HeaderComponent";
import CommonToast from "@custom_components/CommonToast";
import * as Animatable from "react-native-animatable";
import TimeZone from 'react-native-timezone';
const defaultCountry = {
  country_code: 'US',
  country_id: 8,
  country_name: 'United States',
  currency_code: 'USD',
  currency_name: 'US Dollar',
  currency_symbol: '&#36;',
  phone_code: '1',
};
class EnterPhoneNumber extends Component {
  constructor(props) {
    super(props);
    console.log('inside constructor ');
    this.state = {
      phoneNo: '',
      modalVisible: false,
      disabled: true,
      selectedCountry: '',
      text: "this.props.navigation.state.params.text",
      message: "",
      type: "",
      showCustomToast: false
    };
    this.modalRef = React.createRef();
  }

  componentDidMount() {
    //  if (this.state.text == 'Enter') {
    CarrierInfo.isoCountryCode().then(
      result => {
        console.log('ISO', result, commonData.country_codes);
        commonData.country_codes.map(item => {
          if (item.country_code.trim().toLowerCase() == result) {
            this.setState({ selectedCountry: item });
          }
        });
      },
      error => {
        this.setState({
          selectedCountry: defaultCountry,
        });
      },
      commonData.categories.map(m => {
        return m.isSelected = false
      })
    );
    
    TimeZone.getTimeZone().then(zone => 
      {commonData.time_zone = zone   
      });
  }
  // setModalVisible(visible) {
  //   this.setState({ modalVisible: visible });
  // }456546
  maskNumber(text) {
    //console.log(text, 'text from input dfield ');
    var x = text.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,6})/);
    let maskedValue = !x[2]
      ? x[1]
      : '(' + x[1] + ') ' + x[2] + (x[3] ? ' ' + x[3] : '');

    this.setState({ phoneNo: maskedValue }, () => {
      this.state.phoneNo.length >= 6
        ? this.setState({ disabled: false })
        : this.setState({ disabled: true });
    });
  }

  nextClicked() {
    if (this.state.phoneNo == "") {
      Keyboard.dismiss();
      setTimeout(() => {
        this.setState({
          message: commonData.ToastMessages.phone_number,
          type: "error",
          showCustomToast: true
        })
      }, 450);

      setTimeout(() => {
        this.setState({
          showCustomToast: false
        });
        this.textInputRef.focus();
      }, 3100);
    }
    else if (this.textInputRef._lastNativeText.length <= 6) {
      if (this.textInputRef._lastNativeText.length != 0)
        Keyboard.dismiss();
      setTimeout(() => {
        this.setState({
          message: commonData.ToastMessages.phone_number_validation,
          type: "error",
          showCustomToast: true
        })
      }, 450);

      setTimeout(() => {
        this.setState({
          showCustomToast: false
        });
        this.textInputRef.focus();
      }, 3100);
    }

    else {
      if (this.props.navigation.state.params === undefined) {
        const param = {
          phone_number: this.state.phoneNo.replace(/[() ]/g, ''),
          phone_code: this.state.selectedCountry.phone_code,
        };
        this.verfiyUser(param);
      } else {
        this.updatePhoneNumber({
          phone_number: this.state.phoneNo,
          user_id: commonData.user_details.user_id,
        });
      }
    }

    //else {
    //   this.refs.Load.OpenLoad();
    //   if (this.state.text == 'Enter') {
    //     Keyboard.dismiss();
    //     console.log('verify user');
    //     const param = {
    //       phone_number: this.state.phoneNo,
    //       phone_code: this.state.selectedCountry.phone_code,
    //     };
    //     this.verfiyUser(param);
    //   } else {
    //     console.log('update api call');
    //     Keyboard.dismiss();
    //     this.updatePhoneNumber({
    //       phone_number: this.state.phoneNo,
    //       user_id: commonData.user_details.user_id,
    //     });
    //   }
    // }


    // console.log(this.refs, 'refss');
  }

  //   Verfiy user api call

  verfiyUser = param => {
    postApiRequest(commonData.api_endpoint.verfiy_user, param).then(
      data => {
        // commonData.signUpObj.phone_number = this.state.phoneNo;
        // commonData.signUpObj.phone_code = this.state.selectedCountry;
        this.props.setUserPhoneNumber({
          phone_number: this.state.phoneNo.replace(/[() ]/g, ''),
          phone_code: this.state.selectedCountry.phone_code,
          verification_code: data.verification_code.toString()
        })
        if (data.is_registerd) {
          this.props.navigation.navigate('EnterPassword',
            {
              onGoBack: () => this.refresh(),

            });
        } else {

          this.props.navigation.navigate('VerifyNumber', {
            onGoBack: () => this.refresh(),
          });
        }
      },
      error => {
        this.refs.Load.CloseLoad();
        console.log(error, 'error111');
        // showToast(error);
        Keyboard.dismiss();
        setTimeout(() => {
          this.setState({
            message: error,
            type: "error",
            showCustomToast: true
          })
        }, 450);

        setTimeout(() => {
          this.setState({
            showCustomToast: false
          });
          this.textInputRef.focus();
        }, 3100);
      },
    );
  };

  // Update Phone number api call
  updatePhoneNumber = param => {
    postApiRequestWithHeaders(
      commonData.api_endpoint.update_profile,
      param,
    ).then(
      data => {
        commonData.user_details.phone_number = data.phone_number;
        setItem('user_details', JSON.stringify(commonData.user_details)).then(
          res => {
            if (res) {
              console.log('Storage set', res);

              // commonData.user_phone_number = 'vgsdfgsdgfhj';
              commonData.user_phone_number = [
                '(',
                commonData.user_details.phone_number.slice(0, 3),
                ')',
                commonData.user_details.phone_number.slice(3),
              ].join('');
              this.props.navigation.state.params.updateState();
              this.refs.Load.CloseLoad();

              this.props.navigation.goBack();
              setTimeout(() => {
                showToast(commonData.ToastMessages.update_profile);
              }, 600);
            }
          },
          err => { },
        );
      },
      error => {
        this.refs.Load.CloseLoad();

        errorHandler(error, this.props);
      },
    );
  };

  refresh = () => {
    if (this.textInputRef) {
      setTimeout(() => {
        this.textInputRef.focus();
      }, 200);
    }
  };
  openOrCloseCountryCodes = () => {
    console.log('as');
    //  if (this.state.text == 'Enter') {
    Keyboard.dismiss();

    this.modalRef.current.setModalVisibility(
      true,
      this.state.selectedCountry,
    );
    //  }
  };

  navigator(page) {
    switch (page) {
      case 'back': {
        console.log('back');
        this.props.navigation.goBack();
        break;
      }
    }
  }
  render() {
    return (
      <Container>
        <Load ref="Load" Image={0}></Load>
        <HeaderComponent clickHandler={() => this.navigator('back')} />
        <View style={styles.mainContainer}>
          {this.state.showCustomToast ? (
            <View style={{
              position: "absolute",
              bottom: 0
            }}>
              <CommonToast type={this.state.type} message={this.state.message} />
            </View>
          ) : null}

          <KeyboardAvoidingView
            keyboardShouldPersistTaps="handled"
            style={styles.mainContent}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 65 : 50}>       
            <View style={styles.mainContent}>
              <Text style={styles.heading}>
                {' '}
                What's your number?
              </Text>
              <Text style={styles.headingText}>
                {' '}
                Whether you're creating an {'\n'}account or signing back in, lets{'\n'}start with your number.
              </Text>

              <View style={styles.numberInputContainer}>
                <View style={styles.numberContainer}>
                  <Text
                    style={styles.countryCodeText}
                    onPress={() => {
                      this.openOrCloseCountryCodes();
                    }}>
                    +{this.state.selectedCountry.phone_code}
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="(123) 456 7890"
                    ref={ref => (this.textInputRef = ref)}
                    style={styles.numberInput}
                    keyboardType="number-pad"
                    autoFocus={true}
                    maxLength={16}
                    selectionColor={colors.BLACK_TEXT}
                    onChangeText={phoneNo => this.maskNumber(phoneNo)}
                    // blurOnSubmit={true}
                    blurOnSubmit={false}
                    value={this.state.phoneNo}></TextInput>
                </View>
              </View>
              <View style={styles.continueBtnContainer}>
                <Button style={styles.continueBtn} onPress={this.nextClicked.bind(this)}>
                  <Text style={styles.continueBtnTxt}>Continue</Text>
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
        <CountryCodeModal
          ref={this.modalRef}
          modalVisible={this.state.modalVisible}
          itemName={this.state.selectedCountry}
          closeModal={selectedCountry => {
            if (selectedCountry) {
              this.setState({ selectedCountry: selectedCountry });
            }

            // do something with selectedCountry
            console.log(selectedCountry);
          }}></CountryCodeModal>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  console.log(state, "state Phone number...")
  return {
    user: state.user
  }
}
export default connect(mapStateToProps, { setUserPhoneNumber })(EnterPhoneNumber);