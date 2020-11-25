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
  ActivityIndicator,
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
  Icon,
  Button,
} from 'native-base';
import commonData from '../../common/data.js';
import { postApiRequest, showToast } from '../../common/user';
import CarrierInfo from 'react-native-carrier-info';
import Load from 'react-native-loading-gif';
import HeaderComponent from "@custom_components/HeaderComponent";
import { connect } from "react-redux";
import { setUserPhoneNumber } from "../../actions";
import CommonToast from "@custom_components/CommonToast";
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
const defaultCountry = {
  country_code: 'US',
  country_id: 8,
  country_name: 'United States',
  currency_code: 'USD',
  currency_name: 'US Dollar',
  currency_symbol: '&#36;',
  phone_code: '1',
};
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    console.log('inside constructor ');

    this.state = {
      phoneNo: '',
      modalVisible: false,
      disabled: true,
      activeItemName: { country: 'in', id: 2, code: 2 },
      selectedCountry: '',
      message: "",
      type: "",
      showCustomToast: false
      // loader: false,
    };
    this.modalRef = React.createRef();
  }
  componentDidMount() {
    console.log('component did update');
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
        console.log("ISO error")
        this.setState({
          selectedCountry: defaultCountry,
        });
      },
    );
  }
  // componentDidMount() {
  //   console.log('component did mount');

  //   // this.textInputRef1.focus();
  //   // this.textInputRef1.focus();
  //   this.setState({ selectedCountry: commonData.signUpObj.phone_code });

  //   this.setState({ phoneNo: commonData.signUpObj.phone_number });
  //   this.setState({ disabled: false });
  // }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  maskNumber(text) {
    console.log(text, 'text  from input dfield ');
    var x = text.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,6})/);
    let maskedValue = !x[2]
    ? x[1]
    : '(' + x[1] + ') ' + x[2] + (x[3] ? ' ' + x[3] : '');
    this.setState({ phoneNo: maskedValue });

    this.state.phoneNo.length >= 6
      ? this.setState({ disabled: false })
      : this.setState({ disabled: true });
  }
  goBack = () => {
    console.log('go baclkkkkk');
    this.props.navigation.goBack();
  };
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
        this.textInputRef1.focus();
      }, 3100);
    }else{
      console.log(this.props, 'next clicked');

      this.setState({ loader: true });
      const param = {
        phone_number: this.state.phoneNo.replace(/[() ]/g, ''),
        country_code: this.state.selectedCountry.phone_code,
      };
      postApiRequest(commonData.api_endpoint.forgot_password, param).then(
        data => {
          console.log(data, 'data in forgot password ');
          this.setState({ loader: false });
          setTimeout(() => {
            this.setState({
              message: data.message,
              type: "success",
              showCustomToast: true
            })
          }, 100);
    
          setTimeout(() => {
            this.setState({
              showCustomToast: false
            });
            this.props.navigation.navigate('EnterPassword', {
              onGoBack: () => this.refresh(),
            });
          }, 3100);
         
         
        },
        error => {
          console.log(error, 'error');
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
            this.textInputRef1.focus();
          }, 3100);
        },
      );
      console.log(this.refs, 'refss');
    }
   

   
  }
 
  refresh = () => {
    console.log('I have asasa');
    setTimeout(() => {
      console.log('aaaaa');
      this.textInputRef1.focus();
    }, 100);
  };
  openOrCloseCountryCodes = () => {
    console.log('as');
    Keyboard.dismiss();
    this.modalRef.current.setModalVisibility(
      true,
      this.state.selectedCountry,
    );
  //  this.modalRef.current.setModalVisibility(true);
  };
  render() {
    return (
      <Container>
        <Load ref="Load" Image={0}></Load>
        <HeaderComponent clickHandler={() => this.goBack()} />


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
            style={styles.mainContent}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 77 : 50}>
            <View style={styles.mainContent}>
              <Text style={styles.heading}>
                {' '}
                Enter your Number
              </Text>
              <Text style={styles.headingText}>
                {' '}
                Forgot your password? Enter {'\n'} your mobile number and we'll{' '}
                {'\n'}send you a code to login
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
                    placeholder="Mobile Number"
                    ref={ref => (this.textInputRef1 = ref)}
                    style={styles.numberInput}
                    keyboardType="number-pad"
                    autoFocus={true}
                    maxLength={14}
                    selectionColor={colors.BLACK_TEXT}
                    onChangeText={phoneNo => this.maskNumber(phoneNo)}
                    blurOnSubmit={true}
                    value={this.state.phoneNo}></TextInput>
                </View>
              </View>
              <View style={styles.continueBtnContainer}>
                <Button style={styles.continueBtn} onPress={this.nextClicked.bind(this)}>
                  <Text style={styles.continueBtnTxt}>Continue</Text>
                </Button>
              </View>

              {/* <View style={styles.nextButtonContainer}>
                <TouchableOpacity
                  style={{ alignSelf: 'flex-end', padding: 10 }}
                  hitSlop={hitSlop}
                  onPress={this.nextClicked.bind(this)}
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
          </KeyboardAvoidingView>
        </View>
        <CountryCodeModal
          ref={this.modalRef}
          modalVisible={this.state.modalVisible}
          itemName={this.state.selectedCountry}
          closeModal={selectedCountry => {
            if (selectedCountry) {
              console.log("killll")
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
  console.log(state, "state")
  return {
  }
}
export default connect(mapStateToProps, { setUserPhoneNumber })(ForgotPassword);