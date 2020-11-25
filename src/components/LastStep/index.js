//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
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
// create a component
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };

openDialer = () => { };

class LastStep extends Component {
  render() {
    return (
      <Container>
        <Header transparent style={styles.header}>
          <Left />
          <Body>
            <Title style={styles.pageTitle}>Payments</Title>
          </Body>
          <Right />
        </Header>

        <View style={styles.container}>
          <View>
            <Text style={styles.headingText}>
              We collect payment from the homeowner before your phone even rings. Then at the end of each day, all of the money you have earned will automatically transfer to your bank account. And security is our highest priority so all your data is encrypted using industry leading technology.
              {/* We collect payment from the {'\n'} homeowner before your phone{' '}
              {'\n'}
              even rings. Then at the end of each day, all of the money you have
              earned will automatically transfer to your bank account. {'\n'}

              {'\n'} And security is our highest priority so all your data is
              encrypted using industry leading technology. */}
              {/* <Text
                style={{ textDecorationLine: 'underline' }}
                onPress={() => {
                  Linking.openURL(`tel:${'8001234567'}`);
                }}>
                (800) 123 4567
              </Text> */}
            </Text>
          </View>
          <View style={styles.btncontainer}>
            <Button
              block
              style={styles.btn_inner}
              onPress={() => {
                this.props.onDone('last');
              }}>
              <Text style={styles.btn_txt}>Continue </Text>
            </Button>
          </View>
        </View>
      </Container>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    margin: 5,
  },
  pageTitle: {
    fontFamily: 'PTSans-Bold',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 10,
    letterSpacing: 0.8,
  },
  headingText: {
    margin: 40,
    fontFamily: 'PTSans-Regular',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  btncontainer: {
    width: width,
    paddingRight: 40,
    paddingLeft: 40,
    marginBottom: 30,
  },
  btn_inner: {
    backgroundColor: colors.THEME_YELLOW,
    height: 55,
  },
  btn_txt: {
    color: colors.LIGHT_COLOR,
    fontFamily: 'PTSans-Regular',
    fontSize: 20,
    fontWeight: 'bold',
  },
  black_text: {
    color: colors.BLACK_TEXT,
    paddingLeft: 10,
  },
});

//make this component available to the app
export default LastStep;
