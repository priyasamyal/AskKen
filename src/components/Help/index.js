//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Button } from 'native-base';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
import { openUrl } from '../../common/user';
var { width } = Dimensions.get('window');
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import HeaderComponent from "@custom_components/HeaderComponent";
class Help extends Component {
  navigator = action => {
    switch (action) {
      case 'faq': {
        openUrl('https://www.askkenapp.com/help');
        // var url = 'https://facebook.github.io/react-native/docs/linking';
        // Linking.openURL(url);
        break;
      }
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
      <View style={styles.container}>
        <View>
          <Text style={styles.headingText}>
            How can we help? Check out
            {'\n'}
            <Text
              hitSlop={hitSlop}
              onPress={() => this.navigator('faq')}
              style={styles.higlight}>
              our FAQ
            </Text>
            {''} or contact support
            {'\n'} via the button below.
          </Text>
        </View>
        <View style={styles.btncontainer}>
          <Button
            hitSlop={hitSlop}
            block
            style={styles.btn_inner}
            onPress={() => this.navigator('email')}>
            <Text style={styles.btn_txt}>Email Support </Text>
          </Button>
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.input_border,
  },

  headingText: {
    // margin: 40,
    // fontFamily: 'PTSans-Regular',
    // fontSize: 18,
    // textAlign: 'center',
    // letterSpacing: 0.8,
    margin: 40,
    marginBottom: 20,
    fontFamily: 'AvenirLTStd-Medium',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 80,
  },
  btncontainer: {
    width: width,
    paddingRight: 30,
    paddingLeft: 30,
    marginBottom: 40,
  },
  btn_inner: {
    backgroundColor: colors.BLACK_TEXT,
    height: 55,
    borderRadius: 15
  },
  btn_txt: {
    color: colors.LIGHT_COLOR,
    fontFamily: 'Avenir-Heavy',
    fontSize: 18,
    fontWeight: 'bold',
  },
  black_text: {
    color: colors.BLACK_TEXT,
    paddingLeft: 10,
  },
  higlight: { textDecorationLine: 'underline', color: colors.THEME_YELLOW , fontFamily: 'AvenirLTStd-Medium',},
});

//make this component available to the app
export default Help;
