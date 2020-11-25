//import liraries
import React, { Component, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
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
import moment from 'moment';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import DatePicker from 'react-native-datepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import styles from './styles';
const lock_icon = require('../../assets/imgs/lock_card.png');
import commonData from '../../common/data.js';
import { showToast } from '../../common/user';
import BusinessType from '../../pages/BusinessType';
import States from '../../pages/States';
import { connect } from "react-redux";
import CommonToast from "@custom_components/CommonToast";
// create a component
class AddCardHolder extends Component {
  error_fields = {
    city: undefined, street: undefined, postal_code: undefined
  }
  constructor(props) {
    super(props);
    console.log(props, 'props in card ');
    this.state = {
      dob: '',
      phoneNo: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      show: false,
      param: this.props.navigation.state.params.param,
      modalVisible: false,
      modalVisibleState: false,
      business_type: {
        name: 'Select Business Type',
        id: '',
      },
      email: '',
      first_name: '',
      last_name: '',
      message: "",
      type: "",
      showCustomToast: false
    };
    this.modalRef = React.createRef();
    this.stateModalRef = React.createRef();
    console.log(this.props.navigation.getParam('param'), 'paraaam');
   
  }
  componentDidMount() {
    if (this.props.user.user_type == 'expert' && this.props.user.cards.length > 0) {
      var index = commonData.business_type.findIndex(x => {
        console.log(x.id, this.props.user.cards[0].business_type)
        if (x.id == this.props.user.cards[0].business_type) {
          return x;
        }
      });
      var stateIndex = commonData.states.findIndex(x => {
        if (x.states_code == this.props.user.cards[0].state) {
          return x;
        }
      });
      console.log(index, "index..")
      this.setState({
        dob: this.props.user.cards[0].dob,
        street: this.props.user.cards[0].street,
        city: this.props.user.cards[0].city,
        state: commonData.states[stateIndex],
        zip: this.props.user.cards[0].zip,
        phoneNo: this.props.user.cards[0].phone,
        email: this.props.user.cards[0].email,
        business_type: commonData.business_type[index],
        first_name: this.props.user.cards[0].first_name,
        last_name: this.props.user.cards[0].last_name,  
      });
      this.error_fields.city = commonData.stripe_status.errors.find(ind => {
        return ind == "city";
      })
      this.error_fields.street = commonData.stripe_status.errors.find(ind => {
        return ind == "line1";
      })    
    }
  }
  openOrCloseCountryCodes = () => {
    Keyboard.dismiss();
    this.modalRef.current.setModalVisibility(true, this.state.business_type);
  };
  openOrCloseState = () => {
    Keyboard.dismiss();
    this.stateModalRef.current.setModalVisibility(true, this.state.state);
  };

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShow(Platform.OS === 'ios' ? true : false);
  };
  showMode = currentMode => {
    this.setState({
      show: true,
      mode: currentMode,
    });
  };
  showDatepicker = () => {
    this.showMode('date');
  };
  showTimepicker = () => {
    this.showMode('time');
  };
  navigator = navigateTo => {
    switch (navigateTo) {
      case 'next': {
        this.validation();
        break;
      }
      case 'work': {
        Keyboard.dismiss();
        this.setState({ show: true });
        this.props.handler('work');
        break;
      }
      case 'back': {
        this.props.handler('back');
        break;
      }
    }
  };
  //Function for masking  mobile number
  maskNumber(text) {
    var x = text.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,6})/);
    let maskedValue = !x[2]
      ? x[1]
      : '' + x[1] + ' ' + x[2] + (x[3] ? ' ' + x[3] : '');
    this.setState({ phoneNo: maskedValue });
  }
  showPicker = () => {
    Keyboard.dismiss();
    this.showMode('date');
    
  };
  getExpireDate() {
    if (this.state.selectedYear == '') {
      return 'MM/YY';
    } else {
      return this.state.selectedMonth + '/' + this.state.selectedYear;
    }
  }

  //Function for setting input values to state
  setValues = (setoff, value) => {
    switch (setoff) {
      case 'dob': {
        this.setState({ dob: value });
        break;
      }
      case 'first_name': {
        this.setState({ first_name: value });
        break;
      }
      case 'last_name': {
        this.setState({ last_name: value });
        break;
      }
      case 'dob': {
        this.setState({ dob: value });
        break;
      }
      case 'street': {
        this.error_fields.street = undefined;
        this.setState({ street: value });
        break;
      }
      case 'city': {
        this.error_fields.city = undefined;
        this.setState({ city: value });
        break;
      }
      case 'state': {
        this.setState({ state: value });
        break;
      }
      case 'zip': {
        this.setState({ zip: value });
        break;
      }
      case 'email': {
        this.setState({ email: value });
        break;
      }
    }
  };
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
  validation = () => {
    console.log(this.state.business_type, "this.state.business_type",this.state.dob);
    console.log(Math.floor(moment(new Date()).diff(moment(this.state.dob, "MM/DD/YYYY"), 'years', true)),"lll");
    Keyboard.dismiss();
    if (!this.state.dob) {
      this.callToastFunction(commonData.ToastMessages.dob);
    }
    else if (Math.floor(moment(new Date()).diff(moment(this.state.dob, "MM/DD/YYYY"), 'years', true)<18)) {
      this.callToastFunction("You should be minimum 18 years old.");
    }
    else if (!this.state.first_name && commonData.user_details.cards.length == 0) {
      this.callToastFunction("Please enter first name.");
    }
    else if (!this.state.last_name && commonData.user_details.cards.length == 0) {
      this.callToastFunction(commonData.ToastMessages.card_last);
    } else if (!this.state.email) {
      this.callToastFunction(commonData.ToastMessages.email);
    } else if (!this.state.phoneNo) {
      this.callToastFunction(commonData.ToastMessages.phone_number);
    } else if (this.state.phoneNo.length <= 6) {
      this.callToastFunction(commonData.ToastMessages.phone_number_validation);
    } else if (this.state.business_type.id =='') {
      this.callToastFunction(commonData.ToastMessages.business_type);
    } else if (!this.state.street) {
      this.callToastFunction(commonData.ToastMessages.street);
    } else if (!this.state.city) {
      this.callToastFunction(commonData.ToastMessages.city);
    } else if (!this.state.state) {
      this.callToastFunction(commonData.ToastMessages.state);
    } else if (!this.state.zip) {
      this.callToastFunction(commonData.ToastMessages.zip_code);
    } else {
      console.log('param');
      let param = this.props.navigation.getParam('param');
      if (this.props.user.cards.length == 0) {
        param.dob = this.state.dob;
      }
      param.first_name = this.state.first_name;
      param.last_name = this.state.last_name;
      param.street = this.state.street;
      param.city = this.state.city;
      param.state = this.state.state.states_code;
      param.zip = this.state.zip;
      param.business_type = this.state.business_type.id;
      param.phone = this.state.phoneNo;
      param.email = this.state.email;
      this.props.handler('AddSSN', param);
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
          <Right style={{ flex: 3 , paddingBottom:5}}>
            <TouchableOpacity onPress={() => this.navigator('work')}>
              <Title style={styles.pageTitle}>How does this work?</Title>
            </TouchableOpacity>
          </Right>
        </Header>
        <KeyboardAwareScrollView
          style={styles.mainContent}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled">
          <View style={styles.mainContainer}>
            <Text style={styles.headingText}>Add cardholder info</Text>
            <View>
              <Item
                style={{
                  marginTop: 30,
                  borderColor: colors.card_border,
                  width: width,
                  borderBottomWidth: 0,
                }}>
                <Text style={styles.label_text}>Date of birth</Text>
              </Item>
              <Item
                style={{
                  borderColor: colors.card_border,
                  marginBottom: 25,
                  fontSize: 30,
                  marginTop: 5,
                }}>
                <DatePicker
                  disabled={this.props.user.cards.length == 0 ? false : true}
                  allowFontScaling={true}
                  style={{ width: '100%', fontSize: 27, fontFamily: 'AvenirLTStd-Medium',}}
                  showIcon={false}
                  date={this.state.dob}
                  mode="date"
                  placeholder="MM/DD/YYYY"
                  format="MM/DD/YYYY"
                  // minDate="01/01/1940"
                   maxDate={new Date()}
                  confirmBtnText="Select"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      fontFamily: 'AvenirLTStd-Medium',
                      alignItems: 'flex-start',
                      borderWidth: 0,
                      fontSize: 27,
                    },
                    btnTextConfirm: {
                      color: colors.THEME_YELLOW,
                      fontSize: 18,
                      fontFamily: 'AvenirLT-Black',
                    },
                    btnTextCancel: {
                      color: colors.jet_black,
                      fontSize: 18,
                      fontFamily: 'AvenirLTStd-Medium',
                    },
                    disabled: {
                      backgroundColor: colors.card_border,
                      borderRadius: 4,
                    }
                  }}
                  onDateChange={date => {
                    this.setValues('dob', date);
                  }}
                />
              </Item>

              {(this.props.user.cards.length == 0 &&
                <View>
                  <Item style={{ borderBottomWidth: 0 }}>
                    <Text style={styles.label_text}>First Name</Text>
                  </Item>
                  <Item
                    style={[{ borderColor: colors.card_border, marginBottom: 25 }]}>
                    <Input
                     placeholder="Clark"
                      onSubmitEditing={() => {
                        this.lastInput._root.focus();
                      }}
                      returnKeyType={"next"}
                      style={styles.inputText}
                      
                      placeholderTextColor={colors.card_placeholder}
                      keyboardType="email-address"
                      value={this.state.first_name}
                      maxLength={35}
                      onChangeText={email => this.setValues('first_name', email)}
                      selectionColor={colors.BLACK_TEXT}
                    />
                  </Item>
                </View>

              )}
              {(this.props.user.cards.length == 0 &&
                <View>
                  <Item style={{ borderBottomWidth: 0 }}>
                    <Text style={styles.label_text}>Last Name</Text>
                  </Item>
                  <Item
                    style={[{ borderColor: colors.card_border, marginBottom: 25 }]}>
                    <Input
                     ref={input => {
                      this.lastInput = input;
                    }}
                    onSubmitEditing={() => {
                      this.emailInput._root.focus();
                    }}
                    returnKeyType={"next"}
                      style={styles.inputText}
                      placeholder="Kent"
                      placeholderTextColor={colors.card_placeholder}
                      keyboardType="email-address"
                      value={this.state.last_name}
                      maxLength={35}
                      onChangeText={email => this.setValues('last_name', email)}
                      selectionColor={colors.BLACK_TEXT}
                    />
                  </Item>
                </View>
              )}

              <Item style={{ borderBottomWidth: 0 }}>
                <Text style={styles.label_text}>Email</Text>
              </Item>
              <Item
                style={[{ borderColor: colors.card_border, marginBottom: 25 }]}>
                <Input
                 ref={input => {
                  this.emailInput = input;
                }}
                onSubmitEditing={() => {
                  this.mobileInput._root.focus();
                }}
                returnKeyType={"next"}
                  autoCapitalize='none'
                  style={styles.inputText}
                  placeholder="abc@gmail.com"
                  placeholderTextColor={colors.card_placeholder}
                  keyboardType="email-address"
                  value={this.state.email}
                  maxLength={35}
                  onChangeText={email => this.setValues('email', email)}
                  selectionColor={colors.BLACK_TEXT}
                />
              </Item>
              <Item style={{ borderBottomWidth: 0 }}>
                <Text style={styles.label_text}>Mobile Number</Text>
              </Item>
              <Item
                style={[{ borderColor: colors.card_border, marginBottom: 25 }]}>
                <Input
                  ref={input => {
                    this.mobileInput = input;
                  }}
                  style={styles.inputText}
                  placeholder="Mobile Number"
                  placeholderTextColor={colors.card_placeholder}
                  keyboardType="number-pad"
                  value={this.state.phoneNo}
                  maxLength={14}
                  onChangeText={phoneNo => this.maskNumber(phoneNo)}
                  selectionColor={colors.BLACK_TEXT}
                />
              </Item>

            <Item style={{ borderBottomWidth: 0 }}>
                <Text style={styles.label_text}>Select Business Type</Text>
              </Item>
              <Item
                style={{
                  borderColor: colors.card_border,
                  marginBottom: 25,
                  marginTop: 15,
                }}>
                {this.state.business_type.name != undefined && (
                  <Text
                    style={[
                      {
                        fontFamily: 'AvenirLTStd-Medium',
                        fontSize: 17,
                        paddingBottom: 12,
                        width: '100%',
                        //maBottom: 10
                      },
                    ]}
                    onPress={() => {
                      this.openOrCloseCountryCodes();
                    }}>
                    {this.state.business_type.name}
                  </Text>
                )}

                {this.state.business_type.name == undefined && (
                  <Text
                    style={[
                      {
                        fontFamily: 'AvenirLTStd-Medium',
                        fontSize: 17,
                        paddingBottom: 14,

                        width: '100%',
                        color: colors.card_placeholder,
                        //maBottom: 10
                      },
                    ]}
                    onPress={() => {
                      this.openOrCloseCountryCodes();
                    }}>
                    Click to Select Business Type
                  </Text>
                )}
                <View>
                  <Icon
                    onPress={() => {
                      this.openOrCloseCountryCodes();
                    }}
                    style={[{ marginLeft: -20, paddingBottom: 4 }]}
                    name="ios-arrow-down"
                  />
                </View>
              </Item> 
              <Item style={{ borderBottomWidth: 0 }}>
                <Text style={styles.label_text}>Address</Text>
              </Item>
              <Item style={{ borderColor: !this.error_fields.street ? colors.card_border : colors.danger }}>
                <Input
                onSubmitEditing={() => {
                  this.citytInput._root.focus();
                }}
                returnKeyType={"next"}
                  style={styles.inputText}
                  placeholder="Street"
                  placeholderTextColor={colors.card_placeholder}
                  onChangeText={street => this.setValues('street', street)}
                  value={this.state.street}
                  selectionColor={colors.BLACK_TEXT}
                />
              </Item>
              <Item style={{ borderColor: !this.error_fields.city ? colors.card_border : colors.danger }}>
                <Input
                 ref={input => {
                  this.citytInput = input;
                }}
                onSubmitEditing={() => {
                  this.openOrCloseState();
                }}
                returnKeyType={"next"}
                  style={styles.inputText}
                  placeholder="City"
                  placeholderTextColor={colors.card_placeholder}
                  onChangeText={city => this.setValues('city', city)}
                  value={this.state.city}
                  selectionColor={colors.BLACK_TEXT}
                />
              </Item>
              <Item style={{ borderBottomWidth: 0, marginBottom: 50 }}>
                <Grid style={{ borderBottomWidth: 0 }}>
                  <Col style={{ paddingRight: 5, paddingLeft: 0, }}>
                    <Item
                      style={{
                        borderColor: colors.card_border,
                        marginBottom: 25,
                        marginTop: 15,
                      }}>
                      {this.state.state.states_name != undefined && (
                        <Text
                          ellipsizeMode='tail' numberOfLines={1}
                          style={[
                            {
                              fontFamily: 'AvenirLTStd-Medium',
                              fontSize: 17,
                              paddingRight: 15,
                              width: '100%',
                              marginLeft: -2,
                              height: 35,
                            },
                          ]}
                          onPress={() => {
                            this.openOrCloseState();
                          }}>
                          {this.state.state.states_name}
                        </Text>
                      )}

                      {this.state.state.states_name == undefined && (
                        <Text
                          style={[
                            {
                              fontFamily: 'AvenirLTStd-Medium',
                              fontSize: 17,
                              marginLeft: -2,
                              //  paddingBottom: 14,
                              height: 35,
                              width: '100%',
                              color: colors.card_placeholder,
                              //maBottom: 10
                            },
                          ]}
                          onPress={() => {
                            this.openOrCloseState();
                          }}>
                          State
                        </Text>
                      )}
                      <View>
                        <Icon
                          onPress={() => {
                            this.openOrCloseState();
                          }}
                          style={[{ left: -20, top: -20 , position: 'absolute',}]}
                          name="ios-arrow-down"
                        />
                      </View>
                    </Item>
                  </Col>
                  <Col style={{ paddingLeft: 10 }}>
                    <Item style={{ borderColor: colors.card_border }}>
                      <Input
                        placeholder="Zip"
                        style={styles.inputText}
                        onChangeText={zip => this.setValues('zip', zip)}
                        value={this.state.zip}
                        placeholderTextColor={colors.card_placeholder}
                        selectionColor={colors.BLACK_TEXT}
                      />
                    </Item>
                  </Col>
                  <Col style={{ paddingRight: 5, paddingLeft: 5 }}></Col>
                </Grid>
              </Item>
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
        </KeyboardAwareScrollView>
        <BusinessType
          ref={this.modalRef}
          modalVisible={this.state.modalVisible}
          itemName={this.state.business_type}
          closeModal={business_type => {
            if (business_type) {
              this.setState({ business_type: business_type });
            }
            console.log(business_type);
          }}></BusinessType>
        <States
          ref={this.stateModalRef}
          modalVisible={this.state.modalVisibleState}
          itemName={this.state.state}
          closeModal={states => {
            if (states) {
              this.setState({ state: states });
            }
            console.log(states, 'asasas');
          }}></States>
      </Container>
    );
  }
}
//make this component available to the app
//export default AddCardHolder;
function mapStateToProps(state) {
  console.log(state, "state in pay")
  return {
    user: state.user.userData
  }
}
export default connect(mapStateToProps, {})(AddCardHolder);

