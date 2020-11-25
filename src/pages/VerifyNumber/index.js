import React, { Component } from 'react';
import styles from './styles';
import {
  View,
  TouchableOpacity,
  Platform,
  Text,
  TextInput,
  Image
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
  Toast,
} from 'native-base';
import {
  postApiRequest,
  showToast,
  setItem,
  postApiRequestWithHeaders,
  errorHandler,
} from '../../common/user';
import { colors } from '../../common/index';
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import commonData from '../../common/data.js';
import { connect } from "react-redux";
import { setUserPhoneNumber } from "../../actions";
import HeaderComponent from "@custom_components/HeaderComponent";
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import CommonToast from "@custom_components/CommonToast";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
class VerifyNumber extends Component {
  componentDidMount() {
  }
  constructor(props) {
    super(props);
    this.state = {
      verificationCode: '',
      modalVisible: false,
      loader: false,
      currentActive: 1,
      otp1: '',
      otp2: '',
      otp3: '',
      otp4: '',
      message: "",
      type: "",
      showCustomToast: false
    };
  }

  /**
   * Action when user clicks back or next button
   */
  navigator(page) {
    switch (page) {
      case 'next': {
       

        if (this.state.otp1 === '' || this.state.otp2 === '' || this.state.otp3 == '' || this.state.otp4 == '') {
          Keyboard.dismiss();
          setTimeout(() => {
            this.setState({
              message: commonData.ToastMessages.verfication_otp,
              type: "error",
              showCustomToast: true
            })
          }, 450);

          setTimeout(() => {
            this.setState({
              showCustomToast: false
            });
            this.refresh();
          }, 3000);
        } else {
          this.verfiyApiCall(this.state.otp1 + this.state.otp2 + this.state.otp3 + this.state.otp4);
        }
        //
        break;
      }
      case 'back': {
      
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
        break;
      }
      case 'resend': {
        const param = {
          phone_number: this.props.user.phone_number,
          phone_code: this.props.user.phone_code,
        };
        this.verfiyUser(param);
        break;
      }
    }
  }
  refresh = () => {
    
    setTimeout(() => {
     
      this.textInputRef1.focus();
    }, 100);
  };

  /**
   * Check if entered code is corrent or wrong
   */
  verfiyApiCall = (verificationCode) => {
    
    if (verificationCode == this.props.user.verification_code) {
      if (this.props.user.user_type == "owner") {
        this.props.navigation.navigate('EnterName', {type:'add',
          onGoBack: () => this.refresh(),
        });
      } else {
        this.props.navigation.navigate('Categories', {
          onGoBack: () => this.refresh(),
        });
      }

    } else {
      Keyboard.dismiss();
      setTimeout(() => {
        this.setState({
          message: commonData.ToastMessages.verfication_error,
          type: "error",
          showCustomToast: true
        })
      }, 450);

      setTimeout(() => {
        this.setState({
          showCustomToast: false
        });
      }, 3000);


    }
  };

  verfiyUser = param => {
    postApiRequest(commonData.api_endpoint.verfiy_user, param).then(
      data => {
        this.props.setUserPhoneNumber({
          phone_number: this.props.user.phone_number,
          phone_code: this.props.user.phone_code,
          verification_code: data.verification_code.toString()
        })
      },
      error => {
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
        }, 3000);
      },
    );
  };

  render() {
    return (
      <Container>
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
          {/* <View>
            <Image source={no_jobs} style={{ borderWidth: 1, borderRadius: 10, resizeMode: 'contain', height: 60, width: 60, justifyContent: 'center' }} />
          </View> */}
          <KeyboardAwareScrollView
            contentContainerStyle={[{ flex: 1, }]}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
          >
            {/* <KeyboardAvoidingView
            style={styles.mainContent}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 65 : 50}> */}
            <View style={styles.mainContent}>
              <Text style={styles.heading}>
                {' '}
                Verify your number
              </Text>
              <Text style={styles.headingText}>
                {' '}
                Enter the 4 digit code we just {'\n'} sent you to verify your account.
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={[styles.numberInputContainer, { borderColor: this.state.currentActive == 1 ? colors.BLACK_TEXT : colors.BORDER_COLOR }]}>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="number-pad"
                    ref={ref => (this.textInputRef1 = ref)}
                    autoFocus={true}
                    maxLength={1}
                    selectionColor={colors.BLACK_TEXT}
                    onKeyPress={(e) => {
                      this.onOtpKeyPress(1, e)
                    }}
                    onFocus={() => {
                      this.setState({
                        currentActive: 1
                      })
                    }}
                    onChangeText={verificationCode => {
                      if (verificationCode != '') {
                        this.textInputRef2.focus();
                        this.setState({
                          otp1: verificationCode,
                          currentActive: 2,
                        })
                      } else {
                        this.setState({
                          otp1: verificationCode,
                        })
                      }

                    }
                    }
                    value={this.state.otp1}></TextInput>
                </View>
                <View style={[styles.numberInputContainer, { borderColor: this.state.currentActive == 2 ? colors.BLACK_TEXT : colors.BORDER_COLOR }]}>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="number-pad"
                    ref={ref => (this.textInputRef2 = ref)}
                    maxLength={1}
                    selectionColor={colors.BLACK_TEXT}
                    onKeyPress={(e) => {
                      this.onOtpKeyPress(2, e)
                    }}
                    onFocus={() => {
                      this.setState({
                        currentActive: 2
                      })
                    }}
                    onChangeText={verificationCode => {
                    
                      if (verificationCode != '') {
                        this.textInputRef3.focus();
                        this.setState({
                          otp2: verificationCode,
                          currentActive: 3,

                        })
                      }
                      else {
                        this.setState({
                          otp2: verificationCode,
                        })
                      }
                    }

                    }
                    value={this.state.otp2}></TextInput>
                </View>
                <View style={[styles.numberInputContainer, { borderColor: this.state.currentActive == 3 ? colors.BLACK_TEXT : colors.BORDER_COLOR }]}>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="number-pad"
                    ref={ref => (this.textInputRef3 = ref)}
                    maxLength={1}
                    selectionColor={colors.BLACK_TEXT}
                    onKeyPress={(e) => {
                      this.onOtpKeyPress(3, e)
                    }}
                    onFocus={() => {
                      this.setState({
                        currentActive: 3,
                       
                      })
                    }}
                    onChangeText={verificationCode => {
                      if (verificationCode != '') {
                        this.textInputRef4.focus();
                        this.setState({
                          otp3: verificationCode,
                         currentActive: 4,

                        })
                      }
                      else {
                        this.setState({
                          otp3: verificationCode,
                        })
                      }
                    }

                    }
                    value={this.state.otp3}></TextInput>
                </View>
                <View style={[styles.numberInputContainer, { borderColor: this.state.currentActive == 4 ? colors.BLACK_TEXT : colors.BORDER_COLOR }]}>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="number-pad"
                    ref={ref => (this.textInputRef4 = ref)}
                    onKeyPress={(e) => {
                      this.onOtpKeyPress(4, e)
                    }}

                    onFocus={() => {
                      this.setState({
                        currentActive: 4,
                      })
                    }}
                    maxLength={1}
                    selectionColor={colors.BLACK_TEXT}
                    onChangeText={verificationCode => {
                  
                      if (verificationCode != '') {
                        this.setState({
                          otp4: verificationCode,
                        
                        })
                      }
                      else {
                        this.setState({
                          otp4: verificationCode,
                        })
                      }
                    }
                    }
                    value={this.state.otp4}></TextInput>
                </View>
              </View>


              <View style={styles.continueBtnContainer}>
                <Button style={styles.continueBtn} onPress={() => this.navigator('next')}>
                  <Text style={styles.continueBtnTxt}>Verify</Text>
                </Button>
              </View>
              <TouchableOpacity hitSlop={hitSlop} style={{ marginTop: 20 }} onPress={() => this.navigator('resend')}>
                <Text style={[styles.resendText]}>I didn't get the text</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </Container>
    );
  }

  onOtpKeyPress = (index, e) => {
    if (e.nativeEvent.key == "Backspace") {
      if (index == 4) {
        this.setState({
          currentActive: 3,
          otp4:'',
          
        })
        this.textInputRef3.focus();
       
      }
      if (index == 3) {
        this.setState({
          currentActive: 2,
          otp3:''
        })
        this.textInputRef2.focus();
      }
      if (index == 2 && this.state.otp4 == "") {
        this.setState({
          currentActive: 1,
        })
        this.textInputRef1.focus();
      }
    }
    else if (index == 1 && this.state.otp1 != "" && e.nativeEvent.key != "Backspace") {
     
      this.setState({
        currentActive: 2,
        otp2:e.nativeEvent.key,
      })

     
      this.textInputRef2.focus();
    }
    else if (index == 2 && this.state.otp2 != "" && e.nativeEvent.key != "Backspace") {
      this.textInputRef3.focus();
      this.setState({
        currentActive: 3,
        otp3:e.nativeEvent.key,
      })
    
    
    }
    else if (index == 3 && this.state.otp3 != "" && e.nativeEvent.key != "Backspace") {
      this.setState({
        currentActive: 4,
        otp4:e.nativeEvent.key,
      })
      this.textInputRef4.focus();
    }
    // auto focus to previous InputText if value is blank and existing value is also blank
    // if (value === 'Backspace' && otpArray[index] === '') {
    //   if (index === 1) {
    //     firstTextInputRef.current.focus();
    //   } else if (index === 2) {
    //     secondTextInputRef.current.focus();
    //   } else if (index === 3) {
    //     thirdTextInputRef.current.focus();
    //   }

    //   /**
    //    * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
    //    * doing this thing for us
    //    * todo check this behaviour on ios
    //    */
    //   if (isAndroid && index > 0) {
    //     const otpArrayCopy = otpArray.concat();
    //     otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
    //     setOtpArray(otpArrayCopy);
    //   }
    // }
    //};
  };
}
function mapStateToProps(state) {
  
  return {
    user: state.user
  }
}
export default connect(mapStateToProps, { setUserPhoneNumber })(VerifyNumber);