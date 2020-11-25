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
    color: colors.LIGHT_COLOR,
    paddingLeft: 10,
    fontSize: 28
  },
  continueBtnContainer: {
    width: width - 40,
    marginBottom: 40,
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
  backgroundVideo:{
    height:"85%",
    width:"100%",
    borderRadius:15,
    marginTop:30
  },
  backgroundVideo1: {
    marginTop:30,
    height:"85%",
    width:"100%",
    backgroundColor: colors.grey_bg,
    borderRadius:15,
  },
})