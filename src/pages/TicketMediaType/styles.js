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
    fontFamily: 'AvenirLT-Black',
    fontSize: 20,
    paddingTop: 0,
    textAlign: 'center',

  },
  continueBtnContainer: {
    width: width - 40,
    marginBottom: 15,

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
    fontSize: 17,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
