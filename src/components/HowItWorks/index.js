//import liraries
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
var { width, height } = Dimensions.get('window');
import { openUrl } from '../../common/user';
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
  FlatList,
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
  Title
} from 'native-base';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import commonData from '../../common/data.js';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
const crossImage = require('../../assets/imgs/cross-icon.png');
import { connect } from "react-redux";
const expertArr = [
  {
    id: '1',
    que: 'Who collects the customer payments?',
    answer:
      "We securely collect the customer's payment on your behalf.",
  },
  {
    id: '2',
    que: 'Why do you need my debit card info?',
    answer:
      'Our secure platform uses your debit card to ensure your money always gets to your bank account safely. Rest assured, your security is our priority! Our family and friends use Ask Ken too! That’s why we use industry leading technology to encrypt all sensitive information.',
  },
  {
    id: '3',
    que: 'Why do I have to get paid through Ask Ken directly?',
    answer:
      "Getting paid directly through the Ask Ken app helps ensure that you get paid, and that you're protected under our terms of service. Collecting payments or communicating outside of Ask Ken puts you at risk for fraud and other security issues.",
  },
  {
    id: '4',
    que: 'I have a question, who can I contact?',
    answer: 'Email help@askkenapp.com 24/7/365',
  },
];
const ownerArr = [
  {
    id: '1',
    que: 'Is my information secure?',
    answer:
      'Yes! Your privacy is our priority. Our secure platform ensures your payment gets to the expert, without anyone ever seeing your information—this is why we require that you always pay through Ask Ken and never wire money or pay an expert directly.',
  },
  {
    id: '2',
    que: 'Why do I have to pay through Ask Ken directly?',
    answer:
      "Paying directly through the Ask Ken app helps ensure that you're protected under our terms of service, refund policies, and other safeguards. It also makes it easy to find and reference important call history details.\n\nPaying or communicating outside of Ask Ken also makes it harder for us to protect your information and puts you at greater risk of fraud and other security issues.",
  },
];
class HowItWorks extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'props in card ');
    this.state = {
      user: this.props.user.user_type,
    };
  }
  goBack = () => {
    //  this.props.navigation.pop();
    this.props.handler('back');
  };
  navigator = action => {
    switch (action) {

      case 'email': {
        var url = 'mailto:help@askkenapp.com?subject=&body=&cc=';
        Linking.openURL(url);
        break;
      }
      default:
        break;
    }
  };

  render() {
    return (

      <Container>
        <Header transparent style={styles.header}>
          <Left>
            <Button
              transparent
              hitSlop={hitSlop}
              onPress={() => this.goBack()}>
              <Icon style={[styles.black_text]} name="ios-close" />
            </Button>
          </Left>
          <Body></Body>
          <Right style={{ flex: 3 }}>

          </Right>
        </Header>
        <View style={styles.container}>

          <View style={{ marginTop: 0 }}>
            <Text style={styles.headingText}>
              {this.state.user == 'expert'
                ? 'How this Works'
                : 'Security by design'}
            </Text>
          </View>

          {this.state.user == 'expert' && (
            <FlatList
              data={expertArr}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View style={{ marginTop: 30, paddingRight: 25 }}>
                  <Text style={styles.question}>{item.que}</Text>
                  {/* <Text style={styles.answer}>{item.answer}</Text> */}
                  {index != 3 && (
                    <View>
                      <Text style={styles.answer}>{item.answer}</Text>
                    </View>
                  )}
                  {index == 3 && (
                    <View>
                      <Text hitSlop={hitSlop} onPress={() => this.navigator('email')} style={[styles.answer, { paddingBottom: 10 }]}>Email <Text style={{ textDecorationLine: 'underline' }}>help@askkenapp.com</Text> 24/7/365</Text>
                    </View>
                  )}

                </View>
              )}
              keyExtractor={item => item.id}
            />
          )}

          {this.state.user == 'owner' && (
            <FlatList
              data={ownerArr}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View style={{ marginTop: 30, paddingRight: 25 }}>
                  <Text style={styles.question}>{item.que}</Text>
                  <Text style={styles.answer}>{item.answer}</Text>
                  {index != 1 && (
                    <View>
                      <Text style={styles.answer}>{item.answer}</Text>
                    </View>
                  )}
                  {index == 1 && (
                    <View>
                      <Text style={[styles.answer, { paddingBottom: 10 }]}>{item.answer}</Text>
                    </View>
                  )}
                </View>
              )}
              keyExtractor={item => item.id}
            />
          )}
        </View>

      </Container>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  header: {
    margin: 5,
  },
  black_text: {
    color: colors.BLACK_TEXT,
    paddingLeft: 10,
    fontSize: 40,
  },

  container: {
    flex: 1,
    margin: 20,
    paddingBottom: 20
    // marginBottom: 50
  },
  headingText: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 25,
    color: colors.jet_black,
    letterSpacing: 0.9,
  },
  question: {
    fontSize: 18,
    color: colors.BLACK_TEXT,
    fontFamily: 'Avenir-Heavy',
    letterSpacing: 0.9,
  },
  answer: {
    fontSize: 16,
    marginTop: 30,
    fontFamily: 'Avenir-Light',
    letterSpacing: 0.9,
  },
});


function mapStateToProps(state) {
   return {
     user: state.user.userData,
   }
 }
 export default connect(mapStateToProps, {  })(HowItWorks);
 
 