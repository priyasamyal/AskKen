import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  header: {
    margin: 5,
    marginBottom: 0
  },
  black_text: {
    color: colors.BLACK,
    paddingLeft: 10,
    fontSize: 28
  },
  image: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginLeft: 5
  },
  mainContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: colors.input_border,
    paddingTop: 35,
    marginBottom: 20
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
  },
  heading: {
    marginTop: 15,
    //fontFamily: 'PTSans-Bold',
    //fontFamily: 'Avenir-Heavy',
    fontFamily: 'AvenirLT-Black',
    //fontFamily: 'AvenirLTStd-Medium',

    paddingTop: 0,
    textAlign: 'center',
    fontSize: 22,

  },
  numberInputContainer: {
    //marginTop: 80,
    marginTop: height < 813? 30: 80
  },
  textAreaStyle: {
   paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    //fontFamily: 'PTSans-Regular',
  // fontFamily: 'AvenirLTStd-Medium',
    borderRadius: 15,
    width: width - 40, //need to give the width of the text area so that I use ' Width 'this there is no other option 
    color: colors.BLACK_TEXT,
    borderColor: colors.GREY_TEXT,
    borderWidth:1
  //  lineHeight:10
  },
  continueBtnContainer: {
    width: width - 40,
    marginBottom: 20,

  },
  continueBtn: {
    backgroundColor: colors.BLACK_TEXT,
    justifyContent: 'center',
    height: 55,
    borderRadius: 15
  },
  continueBtnTxt: {
    color: colors.LIGHT_COLOR,
    fontFamily: 'Avenir-Heavy',
    fontSize: 18,
    letterSpacing: 0.6
  },
});
