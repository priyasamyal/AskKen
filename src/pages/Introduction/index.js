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
  Modal, Dimensions,

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
var { width, height } = Dimensions.get('window');
import { postApiRequest, setItem, postApiRequestWithHeaders, errorHandler } from '../../common/user';
import { colors } from '../../common/index';
import { KeyboardAvoidingView, Keyboard, SafeAreaView } from 'react-native';
import commonData from '../../common/data.js';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { connect } from "react-redux";
import { setAccountInfo, setUserData, setAllTickets } from "../../actions";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { showToast } from '../../common/user';
import HeaderComponent from "@custom_components/HeaderComponent";
import CommonToast from "@custom_components/CommonToast";
import { StackActions, NavigationActions } from 'react-navigation';
import Load from 'react-native-loading-gif';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import KeyboardListener from 'react-native-keyboard-listener';

class Introduction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      email: '',
      modalVisible: false,
      disabled: true,
      currentActive: 0,
      message: "",
      type: "",
      showCustomToast: false,
      scrollMarginBottom: 0
    };
    //  console.log(this.props.navigation.state.params.type,"props...", height)
  }

  componentDidMount() {

  }

  navigator(page) {
    switch (page) {
      case 'next': {
        console.log('next');
        this.validateForm();
        break;
      }
      case 'back': {
        console.log('back');
        this.props.navigation.goBack();
        break;
      }
    }
  }

  validateForm = () => {
    Keyboard.dismiss();
    if (this.state.name.trim() == "") {
      setTimeout(() => {
        this.setState({
          message: commonData.ToastMessages.old_password,
          type: "error",
          showCustomToast: true
        })
      }, 450);
    }
    else if (this.state.email.trim() == "") {
      // showToast(commonData.ToastMessages.email);
      setTimeout(() => {
        this.setState({
          message: commonData.ToastMessages.new_password,
          type: "error",
          showCustomToast: true
        })
      }, 450);
    }

    else if (this.state.email.trim().length < 6) {
      setTimeout(() => {
        this.setState({
          message: "Password must be alteast 6 characters long.",
          type: "error",
          showCustomToast: true
        })
      }, 450);
    }

    else if (this.state.password.trim() == "") {
      setTimeout(() => {
        this.setState({
          message: commonData.ToastMessages.confirm_password,
          type: "error",
          showCustomToast: true
        })
      }, 450);
    }
    else if (this.state.password != this.state.email) {
      setTimeout(() => {
        this.setState({
          message: commonData.ToastMessages.pass_not_match,
          type: "error",
          showCustomToast: true
        })
      }, 450);
    }
    else {
      this.editProfile();
    }
    setTimeout(() => {
      this.setState({
        showCustomToast: false
      });
    }, 3100);
  }

  editProfile = () => {
    this.refs.Load.OpenLoad();
    const param = {
      user_id: this.props.user.userData.user_id,
      new_password: this.state.email,
      old_password: this.state.name,
    };

    console.log(param, "para");
    postApiRequestWithHeaders(
      commonData.api_endpoint.change_password,
      param, this.props.user.userData.access_token
    ).then(
      res => {
        console.log(res, "user_detail111");
        res.loggedInStatus = true;
        if (res.user.user_type != "owner") {
          this.setState({
            all_job: res.all_tickets
          })
          console.log(this.state)
          this.props.setAllTickets(res.all_tickets)
        } else {
          this.setState({
            current_ticket: res.user.current_ticket,
            push_enable: res.user.push_enable
          })
        }
        this.props.setUserData(res.user);
        this.refs.Load.CloseLoad();
        this.props.navigation.goBack();
      },
      error => {
        console.log(error, "lllll")
        this.refs.Load.CloseLoad();
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
        }, 3100);
        // errorHandler(error, this.props);
      },
    );
  }


  nextClicked() {
    console.log('next clicked');
  }

  render() {
    return (
      <Container>
        <Load ref="Load"></Load>
        {this.state.showCustomToast ? (
          <View style={{
            position: "absolute",
            bottom: 0,
            zIndex: 2
          }}>
            <CommonToast type={this.state.type} message={this.state.message} />
          </View>
        ) : null}
        <KeyboardAwareScrollView
          contentContainerStyle={[{}]}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          style={{ marginBottom: this.state.scrollMarginBottom }}>
          <HeaderComponent clickHandler={() => this.navigator('back')} />
          <View style={styles.mainContainer}>
            <View style={[styles.mainContent, { flex: 1, width: '100%', }]}>
              <View style={{}}>
                <Text style={[styles.heading, { paddingBottom: height < 680 ? 50 : height < 786 ? 200 : 170, paddingTop: 20 }]}>Reset Password
                        </Text>
              </View>
              <View style={{ flex: 1, padding: 20, justifyContent: 'space-between' }}>
                <View>
                  <View style={{ marginBottom: 25 }}>
                    <Text style={[styles.heading, { textAlign: 'left', marginBottom: 25, fontSize: 19 }]}>
                      Old Password
                  </Text>
                    <TextInput
                      placeholder="Your old password"
                      secureTextEntry={true}
                      placeholderTextColor={colors.grey_heading}
                      style={[styles.numberInput, { borderColor: this.state.currentActive == 1 ? colors.BLACK_TEXT : colors.input_border }]}
                      keyboardType="default"
                      returnKeyType={"next"}
                      maxLength={32}
                      ref={ref => (this.textInputRef = ref)}
                      onSubmitEditing={() => { this.textInputRef1.focus(); }}
                      onFocus={() => {
                        this.setState({
                          currentActive: 1
                        })
                      }}
                      onBlur={() => {
                        this.setState({
                          currentActive: 0
                        })
                      }}
                      selectionColor={colors.BLACK_TEXT}
                      onChangeText={name => {
                        this.setState({ name: name });
                      }}
                      value={this.state.name}></TextInput>
                  </View>
                  <View style={{ marginBottom: 25 }}>
                    <Text style={[styles.heading, { textAlign: 'left', marginBottom: 25, fontSize: 19 }]}>
                      New Password
                  </Text>
                    <TextInput
                      placeholder="Your new password"
                      secureTextEntry={true}
                      placeholderTextColor={colors.grey_heading}
                      style={[styles.numberInput, { borderColor: this.state.currentActive == 2 ? colors.BLACK_TEXT : colors.input_border }]}
                      keyboardType="email-address"
                      returnKeyType={"next"}
                      maxLength={32}
                      ref={ref => (this.textInputRef1 = ref)}
                      onSubmitEditing={() => { this.textInputRef2.focus(); }}
                      onFocus={() => {
                        this.setState({
                          currentActive: 2
                        })
                      }}
                      onBlur={() => {
                        this.setState({
                          currentActive: 0
                        })
                      }}
                      selectionColor={colors.BLACK_TEXT}
                      onChangeText={name => {
                        this.setState({ email: name });
                      }}
                      value={this.state.email}></TextInput>
                  </View>

                  <View style={{ marginBottom: 0 }}>
                    <Text style={[styles.heading, { textAlign: 'left', marginBottom: 25, fontSize: 19 }]}>
                      Confirm Password
                  </Text>
                    <TextInput
                      placeholder="Confirm password"
                      placeholderTextColor={colors.grey_heading}
                      style={[styles.numberInput, { borderColor: this.state.currentActive == 3 ? colors.BLACK_TEXT : colors.input_border }]}
                      secureTextEntry={true}
                      ref={ref => (this.textInputRef2 = ref)}
                      returnKeyType={"go"}
                      onSubmitEditing={() => { this.navigator('next') }}
                      keyboardType="default"
                      maxLength={32}
                      selectionColor={colors.BLACK_TEXT}
                      onChangeText={name => {
                        this.setState({ password: name });
                      }}
                      onFocus={() => {
                        this.setState({
                          currentActive: 3
                        })
                      }}
                      onBlur={() => {
                        this.setState({
                          currentActive: 0
                        })
                      }}
                      value={this.state.password}></TextInput>
                  </View>


                </View>

                <View style={styles.continueBtnContainer}>
                  <Button style={styles.continueBtn} onPress={() => this.navigator('next')}>
                    <Text style={styles.continueBtnTxt}>Save Changes</Text>
                  </Button>
                </View>
                <KeyboardListener key={3} onWillShow={() => this.setState({ scrollMarginBottom: 20 })} onWillHide={() => this.setState({ scrollMarginBottom: 0 })} />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>

      </Container>
    );
  }
}
function mapStateToProps(state) {
 // console.log(state, "state")
  return {
    user: state.user
  }
}
export default connect(mapStateToProps, { setAccountInfo, setUserData, setAllTickets })(Introduction);