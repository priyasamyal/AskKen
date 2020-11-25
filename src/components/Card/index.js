//import liraries
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
var { width, height } = Dimensions.get('window');
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
  ScrollView,
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
  ListItem,
  CheckBox,
} from 'native-base';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import commonData from '../../common/data.js';
import YearMonthPicker from './yearMonthPicker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import DatePicker from 'react-native-datepicker';
// import MonthSelectorCalendar from 'react-native-month-selector';

const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
// create a component
var name;
var cvvNumber;
var currentYear = new Date()
  .getFullYear()
  .toString()
  .substr(-2);

console.log(currentYear, 'year');
class Card extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'props in card ');
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
      cards: this.props.cards,
      replaceText: this.props.replaceText,
      useExistingText: 'Use Existing Card',
      showNext: this.props.showNext,
      replaceCard: this.props.replaceCard,
      isReplaced: false,
    };
  }

  openDatePicker = () => {
    this.setState({ show: true });
  };
  fixCardText = text => {
    if (text.length == 2 && this.state.date.length == 1) {
      text += '/';
    } else if (text.length == 2 && this.state.date.length == 3) {
      text = text.substring(0, text.length - 1);
    }
    this.setState({ date: text }, () => {
      if (this.state.date.length > 2) {
        let split = this.state.date.split('/');
        this.setState({ expiration_month: split[0], expiration_year: split[1] });
        console.log(split[0].toString(), 'split');
      }
    });
  };

  checkName(text) {
    console.log(text.length, 'text  from input dfield ');
    this.setState({ cardHolderName: text });
    const namePattern = /^[a-zA-Z ]+$/;
    name = namePattern.test(text);
    console.log(name, 'state');

    // name && text.trim().length > 2
    //   ? this.setState({disabled: false})
    //   : this.setState({disabled: true});
  }
  checkCvv(number) {
    this.setState({ cvv: number });
    const numberPattern = /[0-9]/g;
    cvvNumber = numberPattern.test(number);
    console.log(cvvNumber, 'zip codse regex');
  }
  setZipcode(code) {
    this.setState({ billingZip: code });
  }
  maskNumber(text) {
    //console.log(text, 'text from input dfield ');
    var x = text
      .replace(/\D/g, '')
      .match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,3})/);
    console.log(x, 'axxx');
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
  nextClicked() {
    console.log('aaa');
    if (this.state.is_exist) {
      const param = {
        card_id: this.state.cards[0].card_id,
        user_id: commonData.user_details.user_id,
      };
      this.props.clickHandler(param);
    } else {
      if (
        this.state.cardNumber.length >= 19 &&
        this.state.cardHolderName.length > 2 &&
        this.state.cvv.length >= 3 &&
        name &&
        this.state.selectedYear != '' &&
        cvvNumber &&
        this.state.billingZip.length > 2
      ) {
        console.log('api callll');
        const param = {
          user_id: commonData.user_details.user_id,
          card_number: this.state.cardNumber,
          cvv: this.state.cvv,
          card_holder_name: this.state.cardHolderName,
          expiration_month: this.state.selectedMonth,
          expiration_year: this.state.selectedYear,
          billing_zip: this.state.billingZip,
        };
        if (this.state.replaceText == 'Use Another Card') {
          param.is_saved = this.state.isReplaced;
        }
        this.props.clickHandler(param);
      }
    }
  }
  checkExistCard() {
    console.log('is Esitin');
    this.setState({ is_exist: !this.state.is_exist });
  }
  checkReplaceCard() {
    console.log('is Esitin');
    this.setState({ isReplaced: !this.state.isReplaced });
  }
  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.mainContent}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 50}>
          <ScrollView>
            <View style={[{ flex: 1, marginTop: 20 }, styles.container]}>
              <View style={[{ alignItems: 'center' }]}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 17,
                    fontFamily: 'PTSans-Regular',
                  }}>
                  Your information is secure {'\n'}and all payments are backed{' '}
                  {'\n'}by a satisfaction gurantee.
                </Text>

                {this.state.cards.length > 0 && (
                  <View>
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
                            <Text style={{ fontWeight: 'bold' }}>
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
                        }}>
                        {this.state.is_exist
                          ? this.state.replaceText
                          : this.state.useExistingText}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {!this.state.is_exist && (
                  <View>
                    <View style={styles.numberInputContainer}>
                      <TextInput
                        placeholder="Card Holder Name"
                        style={styles.numberInput}
                        keyboardType="default"
                        selectionColor={colors.THEME_YELLOW}
                        onChangeText={name => this.checkName(name)}
                        value={this.state.cardHolderName}></TextInput>
                    </View>
                    <View style={styles.numberInputContainer}>
                      <TextInput
                        placeholder="Card Number"
                        style={styles.numberInput}
                        keyboardType="number-pad"
                        maxLength={23}
                        selectionColor={colors.THEME_YELLOW}
                        onChangeText={cardNumber => this.maskNumber(cardNumber)}
                        value={this.state.cardNumber}></TextInput>
                    </View>
                    <View style={[{ flexDirection: 'row' }]}>
                      <View style={[styles.numberInputContainerDivider]}>
                        <Text
                          onPress={() => this.showPicker()}
                          style={[
                            styles.numberInput,
                            {
                              width: '100%',
                              color:
                                this.state.selectedYear == ''
                                  ? colors.BORDER_COLOR
                                  : colors.BLACK_TEXT,
                              paddingLeft: 0,
                            },
                          ]}>
                          {' '}
                          {this.getExpireDate()}
                        </Text>
                      </View>
                      <View style={[styles.numberInputContainerDivider2]}>
                        <TextInput
                          placeholder="Sec Code"
                          style={[styles.numberInput, { width: '100%' }]}
                          keyboardType="number-pad"
                          secureTextEntry={true}
                          maxLength={4}
                          onChangeText={cvv => this.checkCvv(cvv)}
                          value={this.state.cvv}
                          selectionColor={colors.THEME_YELLOW}></TextInput>
                      </View>
                    </View>
                    <View style={styles.numberInputContainer}>
                      <TextInput
                        placeholder="Billing Zip"
                        maxLength={12}
                        style={styles.numberInput}
                        keyboardType="number-pad"
                        selectionColor={colors.THEME_YELLOW}
                        onChangeText={cvv => this.setZipcode(cvv)}
                        value={this.state.billingZip}></TextInput>
                    </View>
                  </View>
                )}

                {this.state.replaceCard && !this.state.is_exist && (
                  <View
                    style={[
                      styles.existingCardContainer1,

                      {
                        borderColor:
                          this.state.isReplaced == true
                            ? colors.THEME_YELLOW
                            : colors.BORDER_COLOR,

                        width: "100%",
                        paddingLeft: "15%"

                      },
                    ]}>
                    <ListItem
                      noBorder
                      style={{
                        marginLeft: -15,
                      }}>
                      <CheckBox
                        style={{
                          borderRadius: 2,
                        }}
                        checked={this.state.isReplaced}
                        onPress={() => this.checkReplaceCard()}
                        color={colors.THEME_YELLOW}
                      />
                      <Text
                        onPress={() => this.checkReplaceCard()}
                        style={styles.existingCardText}>
                        {this.state.cards.length > 0
                          ? 'Replace the old card with this card?'
                          : 'Save Card?'}
                      </Text>
                      {/* <Body>
                        <Text
                          onPress={() => this.checkReplaceCard()}
                          style={styles.existingCardText}>
                          {this.state.cards.length > 0
                            ? 'Replace the old card with this card'
                            : 'Save Card?'}
                        </Text>
                      </Body> */}
                    </ListItem>
                  </View>
                )}

                {(!this.state.is_exist || this.state.showNext) && (
                  <View style={styles.nextButtonContainer}>
                    <TouchableOpacity
                      style={{ alignSelf: 'flex-end' }}
                      hitSlop={hitSlop}
                      onPress={() => {
                        this.nextClicked();
                      }}>
                      <Text
                        style={[
                          styles.nextButton,
                          {
                            opacity:
                              (this.state.cardNumber.length >= 18 &&
                                this.state.cardHolderName.length > 2 &&
                                this.state.cvv.length >= 3 &&
                                name &&
                                cvvNumber &&
                                this.state.selectedYear != '' &&
                                this.state.billingZip.length > 2) ||
                                this.state.is_exist
                                ? 1
                                : 0.4,
                          },
                        ]}>
                        Next
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <YearMonthPicker ref={picker => (this.picker = picker)} />
      </View>
    );
  }

  getExpireDate() {
    if (this.state.selectedYear == '') {
      return 'Expiration';
    } else {
      return this.state.selectedMonth + '/' + this.state.selectedYear;
    }
  }
  showPicker = () => {
    const { startYear, endYear, selectedYear, selectedMonth } = this.state;
    this.picker
      .show({ startYear, endYear, selectedYear, selectedMonth })
      .then(({ year, month }) => {
        this.setState({
          selectedYear: year,
          selectedMonth: month,
        });
      });
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    // marginBottom: 210,
    // height: height
  },
  existingCardContainer: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.THEME_YELLOW,
    paddingBottom: 3,
    padding: 5,
    marginTop: 20,
    width: width - 80,
  },
  existingCardContainer1: {
    borderRadius: 5,
    // borderWidth: 2,
    // borderColor: colors.THEME_YELLOW,
    paddingBottom: 3,
    //padding: 5,
    marginTop: 20,
    //   width: width - 80,
  },
  existingCardText: {
    fontFamily: 'PTSans-Regular',
    color: colors.BLACK_TEXT,
    paddingLeft: 10,
    fontSize: 15,
  },
  numberInputContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    paddingBottom: 3,
    padding: 5,
    marginTop: 20,
    width: width - 80,
  },
  numberInput: {
    fontFamily: 'PTSans-Regular',
    fontSize: 18,
    paddingTop: 8,
    paddingBottom: 10,
    paddingLeft: 7,
    width: '100%',
  },
  numberInputContainerDivider: {
    flex: 3,
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    paddingBottom: 3,
    padding: 5,
    marginTop: 20,
    marginRight: 15,
    //   width: width - 50
  },
  numberInputContainerDivider2: {
    flex: 2,
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    paddingBottom: 3,
    padding: 5,
    marginTop: 20,
    // width: width - 80
  },
  nextButtonContainer: {
    //flex: 1,
    marginTop: 10,
    marginRight: 35,
    justifyContent: 'flex-end',
    //width: width,
    alignSelf: 'flex-end',
    paddingTop: 10,
    paddingBottom: 20,
    // marginBottom: 10
    // position: 'absolute',
    // right: 0,
    // bottom: 0,
    // backgroundColor: 'red'
  },
  nextButton: {
    color: colors.THEME_YELLOW,
    fontFamily: 'PTSans-Regular',
    fontSize: 22,
    fontWeight: 'bold',
    opacity: 0.4,
    letterSpacing: 0.8,
  },
});

//make this component available to the app
export default Card;
