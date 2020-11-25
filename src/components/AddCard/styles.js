import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
  header: {
    margin: 5,
    marginBottom: 0
  },
  pageTitle: {
    fontFamily: 'PTSans-Regular',
    fontSize: 17,
    paddingTop: 10,
    paddingLeft: 0,
    marginRight: 8,
    color: colors.THEME_YELLOW,
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
    padding: 20,
    paddingTop:0,
    marginTop: 0,
    borderTopWidth: 1,
    borderColor: colors.input_border,
  },
  mainContent: {
    flex: 1,
    
    // backgroundColor: 'red'
    // marginpBottom: 0,
    // marginTop: 15,
  },
  headingText: {
    fontFamily: 'AvenirLT-Black',
    fontSize: 25,
    color: colors.jet_black,
    paddingLeft: 7,
    marginTop: 15
    // backgroundColor: 'red'
  },
  label_text: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 17,
    color: colors.BLACK_TEXT,
  },
  next_btn: {
    // width: "50%",
    // justifyContent: 'center',
    // textAlign: 'center',
    backgroundColor: colors.BLACK_TEXT,
  },
  next_btn_container: {
    // textAlign: 'right',
    alignSelf: 'flex-end',
  },
  next_btn_txt: {
    color: colors.LIGHT_COLOR,
    fontFamily: 'PTSans-Bold',
    paddingRight: 20,
    fontSize: 16,
    paddingLeft: 20,
    paddingBottom: 2,
  },
  numberInput: {
    fontFamily: 'AvenirLTStd-Medium',
    fontSize: 16,
    color: colors.BLACK_TEXT,
    paddingTop: 8,
  },
  existingCardContainer: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.THEME_YELLOW,
    paddingBottom: 3,
    padding: 5,
    marginTop: 20,
    marginBottom: 5,
    // width: width - 80,
    marginLeft: 7,
    marginRight: 5
  },
  inputText: {
    fontFamily: 'AvenirLTStd-Medium',
    fontSize: 16,
    color: colors.BLACK_TEXT,
  },

  nextButtonContainer: {

    //justifyContent: 'flex-end',
    //  width: "100%",
    alignSelf: 'flex-end',
    // paddingTop: 10,
    // position: 'absolute',
    // bottom: 0,
    marginTop: 10,
    //marginBottom: 30,
  },
  nextButton: {
    color: colors.LIGHT_COLOR,
    fontFamily: 'Avenir-Heavy',
    fontSize: 18,
  },
  existingCardText: {
    fontFamily: 'AvenirLTStd-Medium',
    color: colors.BLACK_TEXT,
    paddingLeft: 10,
    fontSize: 15,
   // paddingTop:3
  },
});
