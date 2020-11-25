//import liraries
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  TextInput
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
  ListItem,
  CheckBox,
  Footer,
} from 'native-base';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import YearMonthPicker from './yearMonthPicker';
import commonData from '../../common/data.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { showToast, alertWithSingleBtn } from '../../common/user';
import styles from './styles';
const lock_icon = require('../../assets/imgs/lock_card.png');
import { connect } from "react-redux";
const header_logo = require('../../assets/imgs/header_logo.jpg');
const side_menu_black = require('../../assets/imgs/side_menu_black.png');
import Modal from 'react-native-modal';
import SideMenu from '../../components/SideMenu';
import CommonToast from "@custom_components/CommonToast";
import KeyboardListener from 'react-native-keyboard-listener';
// create a component
var name;
var cvvNumber;
class AddCard extends Component {
  constructor(props) {
    super(props);
    // console.log(props, 'props in card ');
    this.state = {
      date: '',
      mode: 'date',
      expiration_month: '',
      expiration_year: '',
      show: false,
      dateText: 'Expiration',
      cardNumber: '',
      cardHolderName: '',
      cvv: '',
      billingZip: '',
      startYear: new Date().getFullYear(),
      endYear: 2085,
      selectedYear: '',
      selectedMonth: '',
      is_exist: this.props.is_exist,
      //is_exist: true,
      cards: this.props.user.cards,
      //  replaceText: this.props.replaceText,
      replaceText: 'Replace Card',
      useExistingText: 'Use Existing Card',
      showNext: this.props.showNext,
      replaceCard: this.props.replaceCard,
      //replaceCard: 'Replace Existing Card',
      isReplaced: false,
      is_connected: false,
      toggle_menu: false,
      message: "",
      type: "",
      showCustomToast: false,
      currentActive: 0,
      scrollMarginBottom: 0
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(null);
  }
  callToastFunction = (msg, type="error") => {
    setTimeout(() => {
      this.setState({
        message: msg,
        type: type,
        showCustomToast: true
      })
    }, 400);

    setTimeout(() => {
      this.setState({
        showCustomToast: false
      });
    }, 3000);
  }
  navigator = navigateTo => {
    const namePattern = /^[a-zA-Z. ]+$/;
    name = namePattern.test(this.state.cardHolderName);
    switch (navigateTo) {
      case 'next': {
        console.log('next');
        Keyboard.dismiss();
        if (this.state.is_exist) {
          const param = {
            card_id: this.state.cards[0].card_id,
            user_id: this.props.user.user_id,
          };
          if (this.props.user.user_type == 'owner') {
            if (!this.state.is_connected) {
              //showToast("one time toats")
              // this.setState({ is_connected: !this.state.is_connected })
              this.props.handler('addCard', param);
            }

          } else {
            param.is_exist = true
            this.props.handler('AddCardHolder', param);
          }
        } else {

          if (this.state.cardHolderName.trim() =="") {
            this.callToastFunction(commonData.ToastMessages.card_holder_name);
            return false;
          }
          else if (this.state.cardHolderName.length < 2) {
            this.callToastFunction(commonData.ToastMessages.card_holder_name);
            return false;
          }
          else if (!this.state.cardNumber) {
            this.callToastFunction(commonData.ToastMessages.card_number);
            return false;
          }
          else if (this.state.cardNumber.length < 18) {
            this.callToastFunction(commonData.ToastMessages.valid_card);
            return false;
          } else if (this.state.selectedYear == '') {
            this.callToastFunction(commonData.ToastMessages.expiration);
            return false;
          } else if (this.state.cvv.length < 3) {
            this.callToastFunction(commonData.ToastMessages.cvv);
            return false;
          } else if (this.state.billingZip.length < 2) {
            this.callToastFunction(commonData.ToastMessages.zip);
            return false;
          } else {
            // console.log('api callll');
            const param = {
              user_id: this.props.user.user_id,
              card_number: this.state.cardNumber,
              cvv: this.state.cvv,
              // card_holder_name: this.state.cardHolderName,
              expiration_month: this.state.selectedMonth,
              expiration_year: this.state.selectedYear,
              billing_zip: this.state.billingZip,
            };
            if (this.state.cards.length > 0) {
              param.is_saved = this.state.isReplaced;
              // param.card_id = this.state.cards[0].card_id;
            }
            if (this.props.user.user_type == 'owner') {
              param.card_holder_name = this.state.cardHolderName;
              this.props.handler('addCard', param);
            } else {
              param.card_holder_name = this.state.cardHolderName;
              param.is_exist = false
              this.props.handler('AddCardHolder', param);
              // let firsName = '';
              // let lastName = '';
              // let splittedName = this.state.cardHolderName.split(' ');
              // if (splittedName.length == 1) {
              //   showToast(commonData.ToastMessages.card_last);
              // } else if (splittedName[splittedName.length - 1] == "") {
              //   showToast(commonData.ToastMessages.card_last);
              // } else {
              //   console.log(splittedName, 'splitted name', splittedName.length);
              //   firsName = splittedName[0];

              //   if (splittedName.length == 2) {
              //     lastName = splittedName[1];
              //   } else if (splittedName.length > 2) {
              //     lastName = splittedName[splittedName.length - 1];
              //   }

              //   param.first_name = firsName;
              //   param.last_name = lastName;




              //   this.props.handler('AddCardHolder', param);
              // }

            }
            console.log(param, 'param in add card ');
          }
        }

        break;
      }
      case 'work': {
        this.props.handler('work');
        break;
      }
      case 'side_menu': {
        this.setState({ toggle_menu: true });
        break;
      }
      case 'back': {
        this.props.handler('back');
        break;
      }
    }
  };

  callbackFunction = page => {
    console.log("kkk")
    this.setState({ toggle_menu: !this.state.toggle_menu });
    switch (page) {
      case 'close': {
        this.setState({ toggle_menu: !this.state.toggle_menu });
        break;
      }
      case 'help': {
        //  console.log('help');
        this.props.navigation.navigate('CommonPage', {
          page: 'help',
          headerText: 'Help!',
        });
        break;
      }
      case 'callHistory': {
        // console.log('callHistory');
        this.props.navigation.navigate('CommonPage', {
          page: 'callHistory',
          headerText: 'Call History',
        });

        break;
      }
      case 'updateProfile': {
        //  console.log('updateProfile');
        this.props.navigation.navigate('CommonPage', {
          page: 'updateProfileImage',
          headerText: 'Update Profile',
        });

        break;
      }
      case 'cardInfo': {
        let view =
          commonData.user_details.cards.length == 0 ? 'intro' : 'addCard';
        let is_exist = commonData.user_details.cards.length == 0 ? false : true;
        this.props.navigation.navigate('OwnerPayment', {
          view: view,
          is_exist: is_exist,
        });
        break;
      }

      case 'paymentInfo': {
        let view =
          this.props.user.cards.length == 0 ? 'intro' : 'addCard';
        let is_exist = this.props.user.cards.length == 0 ? false : true;
        this.props.navigation.navigate('OwnerPayment', {
          view: view,
          is_exist: is_exist,
        });
        break;
      }

      case 'editCategory': {
        this.props.navigation.navigate('EditCategory');

        break;
      }
      case 'editLicense': {
        this.props.navigation.navigate('TicketDescription', {
          page: 'TicketDescription',
          categories: commonData.user_details.categories,
        });

        break;
      }
      case 'updatePassword': {
        //  console.log('updatePassword');
        this.props.navigation.navigate('CommonPage', {
          page: 'updatePassword',
          headerText: 'Update Password',
        });

        break;
      }
      case 'updatePhoneNumber': {
        //  console.log('updatePhoneNumber');
        this.props.navigation.navigate('EnterPhoneNumber', {
          text: 'Update',
          onGoBack: () => this.refresh(),
        });
        break;
      }
      case 'rating': {
        this.setState({ toggle_menu: !this.state.toggle_menu });
        break;
      }
      case 'pushToggle': {
        //  console.log('pushToggle');
        this.setState({ toggle_menu: !this.state.toggle_menu });
        break;
      }
      case 'video': {
        // console.log('video');
        openUrl('https://www.askkenapp.com/askken_video.mp4');

        break;
      }
      case 'logout': {
        const param = {
          user_id: this.props.user.user_id,
        };
        postApiRequestWithHeaders(commonData.api_endpoint.log_out, param).then(
          data => {
            this.refs.Load.CloseLoad();
            this.logOutFunc();
          },
          error => {
            this.logOutFunc();
            // errorHandler(error, this.props);
          },
        );
        break;
      }

      case 'terms': {
        setTimeout(() => {
          openUrl('https://www.askkenapp.com/terms');
        }, 1000);
        break;
      }

      case 'deleteAccount': {
        alertWithTwoBtn(
          'Delete Account',
          commonData.ToastMessages.delete_account,
          'No',
          'Yes',
        ).then(data => {
          //   console.log(data);
          if (data) {
            this.deleteApiCall();
          }
        });
        break;
      }
      case 'report': {
        console.log("rporp")
        var url = 'mailto:help@askkenapp.com?subject=Report a problem&body=&cc=';
        Linking.openURL(url);
        break;
      }
    }
  };

  // Function to set value and validate name
  checkName(text) {
    console.log(text.length, 'text  from input dfield ');
    this.setState({ cardHolderName: text });
    const namePattern = /^[a-zA-Z ]+$/;
    name = namePattern.test(text);
    console.log(name, 'state');
  }
  // Function fro masking and validating card number
  maskNumber(text) {
    //console.log(text, 'text from input dfield ');
    var x = text
      .replace(/\D/g, '')
      .match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,3})/);
    //  console.log(x, 'axxx');
    let maskedValue = !x[2]
      ? x[1]
      : '' +
      x[1] +
      ' ' +
      x[2] +
      (x[3] ? ' ' + x[3] : '') +
      (x[4] ? ' ' + x[4] : '') +
      (x[5] ? ' ' + x[5] : '');
    this.setState({ cardNumber: maskedValue });
  }

  //Function to validate and set value of cvv number
  checkCvv(number) {
    this.setState({ cvv: number });
    const numberPattern = /[0-9]/g;
    cvvNumber = numberPattern.test(number);
    // console.log(cvvNumber, 'zip codse regex');
  }
  //Functions for setting zip code
  setZipcode(code) {
    this.setState({ billingZip: code });
  }

  showPicker = () => {
    Keyboard.dismiss();
    const { startYear, endYear, selectedYear, selectedMonth } = this.state;
    console.log(
      startYear,
      endYear,
      selectedYear,
      selectedMonth,
      'selected year',
    );
    // console.log(this.state, selectedMonth.charAt(0));

    var selectedMonth1 = selectedMonth;
    if (selectedMonth.toString().charAt(0) == '0') {
      selectedMonth1 = selectedMonth.charAt(1);
    }
    console.log(selectedMonth);
    this.picker
      .show({ startYear, endYear, selectedYear, selectedMonth })
      .then(({ year, month }) => {
        //console.log(year, month, 'monthhhhhhh');
        this.setState({
          selectedYear: year,
          selectedMonth: month,
        });
      });
  };
  getExpireDate() {
    if (this.state.selectedYear == '') {
      return 'MM/YY';
    } else {
      return this.state.selectedMonth + '/' + this.state.selectedYear;
    }
  }

  //Function to toggle view  for saved card and add new card
  checkExistCard() {
    console.log('is Esitin');
    this.setState({ is_exist: !this.state.is_exist });
  }

  render() {
    return (
      <Container style={{ flex: 1 }}>
        {this.state.showCustomToast ? (
          <View style={{
            position: "absolute",
            bottom: 0,
          }}>
            <CommonToast type={this.state.type} message={this.state.message} />
          </View>
        ) : null}
        {/* <Header transparent style={styles.header}>
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
              <Title style={styles.pageTitle}>
                {this.props.user.user_type == 'owner'
                  ? 'Is my info secure?'
                  : 'How does this work?'}
              </Title>
            </TouchableOpacity>
          </Right>
        </Header> */}
        <Header transparent style={styles.header}>
          <Left style={{ flex: 1 }}>
            <Button
              transparent
              hitSlop={hitSlop}
              onPress={() => this.navigator('back')}>
              <Icon style={[styles.black_text]} name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Image
              style={[
                {
                  marginLeft: 0,
                  height: 30,
                  width: 30,
                  resizeMode: 'contain',
                },
              ]}
              source={header_logo}
            />
          </Body>
          <Right>
            {/* <Button
              transparent
              onPress={() => this.navigator('side_menu')}>
              <Image style={styles.image} source={side_menu_black} />
            </Button> */}
          </Right>
        </Header>
        <KeyboardAwareScrollView
          style={styles.mainContent}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          style={{ marginBottom: this.state.scrollMarginBottom }}>

          <View style={styles.mainContent}>

            <View style={styles.mainContainer}>
              {this.state.cards.length > 0
                &&
                this.props.user.user_type == 'owner'
                &&
                (
                  <View
                    style={
                      {

                        // alignSelf: 'center',
                      }
                    }>
                    <Label style={styles.headingText}>Card saved</Label>
                    <View
                      style={[
                        styles.existingCardContainer,
                        {
                          borderColor:
                            this.state.is_exist == true
                              ? colors.THEME_YELLOW
                              : colors.BORDER_COLOR,
                        },
                      ]}>
                      <ListItem noBorder>
                        <CheckBox
                          checked={this.state.is_exist}
                          onPress={() => this.checkExistCard()}
                          color={colors.THEME_YELLOW}
                        />
                        <Body>
                          <Text
                            onPress={() => this.checkExistCard()}
                            style={styles.existingCardText}>
                            XXXX-XXXX-XXXX-
                            <Text style={{ fontWeight: 'bold', fontFamily: 'Avenir-Heavy',}}>
                              {this.state.cards[0].card_number}
                            </Text>
                          </Text>
                        </Body>
                      </ListItem>
                    </View>

                    <TouchableOpacity
                      style={{ alignSelf: 'flex-end' }}
                      hitSlop={hitSlop}>
                      <Text
                        hitSlop={hitSlop}
                        onPress={() => this.checkExistCard()}
                        style={{
                          alignSelf: 'flex-end',
                          padding: 5,
                          textDecorationLine: 'underline',
                          fontFamily: 'AvenirLTStd-Medium',
                          fontSize:15
                        }}>
                        {this.state.is_exist
                          ? this.state.replaceText
                          : this.state.useExistingText}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

              {!this.state.is_exist && (
                <Text style={styles.headingText}>Add card details</Text>
              )}

              <KeyboardAvoidingView
                style={[
                  styles.mainContent,
                  {
                    //flex: 1,
                    //   backgroundColor: 'red'
                    // justifyContent: 'center',
                    //  paddingHorizontal: 20,
                    // paddingTop: 20,
                  },
                ]}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                keyboardVerticalOffset={Platform.OS === 'ios' ? -50 : 50}>
                {!this.state.is_exist && (
                  <View>


                    <Item
                      stackedLabel
                      style={{
                        marginTop: 35,
                        marginBottom: 20,
                        borderColor: colors.card_border,
                        width: width,

                      }}>
                      <View style={{ width: width, flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={styles.label_text}> Cardholder name</Text>
                          <Image
                            style={{
                              height: 15,
                              width: 13,
                              resizeMode: 'contain',
                              marginLeft: 5,
                            }}
                            source={lock_icon}
                          />
                        </View>
                      </View>
                      <Input 
                        style={[styles.inputText,{ borderColor: this.state.currentActive == 1 ? colors.BLACK_TEXT : colors.input_border }]}
                        placeholder="Ex. Clark Kent"
                        placeholderTextColor={colors.card_placeholder}
                        selectionColor={colors.BLACK_TEXT}
                        keyboardType="default"          
                        ref={input => {
                          this.numberInput = input;
                        }}
                        onSubmitEditing={() => {
                          this.nameInput._root.focus();
                        }}
                        returnKeyType={"next"}
                        onChangeText={name => this.checkName(name)}
                        value={this.state.cardHolderName}
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
                      />
                    </Item>

                    <Item
                      stackedLabel
                      style={{
                        marginBottom: 20,
                        //  marginTop: commonData.user_details.cards.length == 0 ? 0 : 35,
                        borderColor: colors.card_border,
                        width: width,
                      }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', width: width, }}>
                        <Text style={styles.label_text}> Cardholder number</Text>
                        <Image
                          style={{
                            height: 15,
                            width: 13,
                            resizeMode: 'contain',
                            marginLeft: 5,
                          }}
                          source={lock_icon}
                        />
                      </View>
                     
                      <Input
                      ref={input => {
                        this.nameInput = input;
                      }}
                     
                        style={styles.inputText}
                        placeholder="0000 0000 0000 0000"
                        placeholderTextColor={colors.card_placeholder}
                        keyboardType="number-pad"
                        selectionColor={colors.BLACK_TEXT}
                        maxLength={23}
                        onChangeText={cardNumber => this.maskNumber(cardNumber)}
                        value={this.state.cardNumber}
                      />
                    </Item>

                    <Item
                      style={{
                        borderBottomWidth: 0,
                        marginBottom: 0,
                        paddingBottom: 0,
                      }}>
                      <Grid style={{ borderBottomWidth: 0 }}>
                        <Col style={{ paddingRight: 10, paddingLeft: 2 }}>
                          <Item
                            stackedLabel
                            style={{ borderColor: colors.card_border }}>
                            <Label style={styles.label_text}>Expiration</Label>

                            <Text
                              hitSlop={hitSlop}
                              onPress={() => this.showPicker()}
                              style={[
                                styles.numberInput,
                                {
                                  paddingTop: 20,
                                  // paddingBottom: 13,
                                  width: '100%',
                                  height: 50,
                                  color:
                                    this.state.selectedYear == ''
                                      ? colors.card_placeholder
                                      : colors.BLACK_TEXT,
                                  paddingLeft: 0,
                                },
                              ]}>
                              {this.getExpireDate()}
                            </Text>
                          </Item>
                        </Col>
                        <Col style={{ paddingRight: 5, paddingLeft: 5 }}>
                          <Item
                            stackedLabel
                            style={{ borderColor: colors.card_border }}>
                            <Label style={styles.label_text}>CVV</Label>
                            <Input    
                              style={styles.inputText}
                              placeholder="123"
                              placeholderTextColor={colors.card_placeholder}
                              onChangeText={cvv => this.checkCvv(cvv)}
                              value={this.state.cvv}
                              keyboardType="number-pad"
                              maxLength={4}
                              selectionColor={colors.BLACK_TEXT}
                            />
                          </Item>
                        </Col>
                        <Col style={{ paddingLeft: 10 }}>
                          <Item
                            stackedLabel
                            style={{ borderColor: colors.card_border }}>
                            <Label style={styles.label_text}>Zip code</Label>
                            <Input
                              style={styles.inputText}
                              placeholder="10010"
                              maxLength={8}
                              keyboardType="number-pad"
                              placeholderTextColor={colors.card_placeholder}
                              onChangeText={cvv => this.setZipcode(cvv)}
                              value={this.state.billingZip}
                              selectionColor={colors.BLACK_TEXT}
                            />
                          </Item>
                        </Col>
                      </Grid>
                    </Item>
                  </View>
                )}
                {(!this.state.is_exist || this.props.user.user_type != 'owner') && (
                  <View style={styles.nextButtonContainer}>
                    <Text> </Text>
                    <Button
                      style={[
                        styles.next_btn,
                        {
                          alignSelf: 'flex-end',
                          paddingRight: 20,
                          paddingLeft: 20,
                          opacity: 1,

                        },
                      ]}
                      hitSlop={hitSlop}
                      onPress={() => this.navigator('next')}
                      disabled={this.state.showNext}>
                      <Text
                        style={[
                          styles.nextButton,
                          { opacity: this.state.disabled ? 0.4 : 1 },
                        ]}>
                        Next
                      </Text>
                    </Button>
                  </View>
                )}
                <KeyboardListener key={3} onWillShow={() => this.setState({ scrollMarginBottom: 20 })} onWillHide={() => this.setState({ scrollMarginBottom: 0 })} />
              </KeyboardAvoidingView>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <YearMonthPicker ref={picker => (this.picker = picker)} />
        <Modal isVisible={this.state.toggle_menu}
          hideModalContentWhileAnimating={true}
          onSwipeComplete={() => this.setState({ toggle_menu: !this.state.toggle_menu })}
          swipeDirection="down">
          <SideMenu
            parentCallback={this.callbackFunction}
          ></SideMenu>
        </Modal>
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
export default connect(mapStateToProps, {})(AddCard);

