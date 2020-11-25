import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
  header: {
    margin: 5,
    //marginBottom: 4,
    zIndex: 4
  },

  mainContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: colors.input_border,
    // paddingBottom: 35,
    // justifyContent: 'center',
    //alignItems: 'center',
    //  backgroundColor: 'red'
    // height: Dimensions.get('window').height,

  },
  mainContent: {
    //flex: 1,
    // justifyContent: 'flex-start',
    //  height: Dimensions.get('window').height,

  },
  headingText: {
    marginTop: 50,
    //fontFamily: 'Avenir-Heavy',
    fontFamily: 'AvenirLT-Black',
    //fontFamily: 'AvenirLTStd-Medium',
    fontSize: 22,
    textAlign: 'center',
    color: colors.BLACK_TEXT,
    paddingBottom: 15
  },
  headingTextSkill: {
    marginTop: 40,
    marginBottom: 1,
    fontFamily: 'PTSans-Bold',
    fontSize: 27,
    letterSpacing: 0.8,
    paddingLeft: 25
    // textAlign: 'left',
  },
  headingTextSkillDescription: {
    paddingLeft: 25,
    marginBottom: 30,
    fontFamily: 'PTSans-Regular',
    fontSize: 16,
    letterSpacing: 0.8,

  },
  numberInputContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginTop: 30,
    width: width - 80,
    padding: 15,
  },
  body_style: {
    paddingLeft: 25,
    paddingBottom: 2,
    fontFamily: 'PTSans-Regular',
    fontSize: 20,
  },
  check_style: {
    paddingTop: 0,
    paddingLeft: 4,

    fontWeight: 'bold',
    marginTop: 4,
  },
  nextButtonContainer: {
    justifyContent: 'flex-end',
    width: '100%',
    alignSelf: 'flex-end',
    paddingTop: 10,
    paddingRight: 25,
    position: 'absolute',
    bottom: '10%',
    // //backgroundColor: 'red'
  },
  nextButton: {
    color: colors.THEME_YELLOW,
    fontFamily: 'PTSans-Regular',
    fontSize: 22,
    fontWeight: 'bold',
    opacity: 0.4,
  },
  black_text: {
    color: colors.BLACK,
    paddingLeft: 10,
  },
  btncontainer: {
    width: width,
    paddingRight: 40,
    paddingTop: 30,
    paddingLeft: 40,
    marginBottom: 30,
    borderTopColor: colors.BORDER_COLOR,
    borderTopWidth: 1,
  },
  btn_inner: {
    backgroundColor: colors.THEME_YELLOW,
    height: 55,
  },
  btn_txt: {
    color: colors.LIGHT_COLOR,
    //color: '#FCFCFC',
    fontFamily: 'PTSans-Regular',
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: 5
  },
  overlay: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: height,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    zIndex: 1
  },
  card: {
    flex: 0.77,
    marginTop: -25,
    borderRadius: 8,
    shadowRadius: 25,
    shadowColor: '#000',
   // shadowOpacity: 0.05,
   // shadowOffset: { width: 5, height: 5 },
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey_bg,
   // backgroundColor:'#f9f9f9',
  // backgroundColor: "#e9e7e7",
    borderWidth: 1,
    borderColor: colors.card_border_outline,
    // padding: 10,
  },
  cardImage: {
    width: 200,
    height: 400,
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'contain'
  },

  continueBtnContainer: {
    width: width - 40,
    position: 'absolute',
    bottom: 30
  },
  continueBtn: {
    backgroundColor: colors.BLACK_TEXT,
    justifyContent: 'center',
    height: 55,
    borderRadius: 15
  },
  continueBtnTxt: {
    color: colors.card_border,
    fontFamily: 'Avenir-Heavy',
    fontSize: 18,
    // paddingTop: 2
  },
  cardTextConatiner: {
    width: "100%",
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
  },
  cardTextTitle: {
    fontFamily: 'AvenirLT-Black', color: colors.BLACK_TEXT, fontSize: 18
  },
  cardTextPrice: {
    fontFamily: 'AvenirLT-Black', color: colors.blue, fontSize: 18
  },
  cardTextDescription: {
    fontFamily: 'AvenirLTStd-Medium', color: colors.grey_heading, fontSize: 15
  },
  cardBtnContainer: {
    position: 'absolute',
    bottom: 55
  },
  cardBtnImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: "100%", width: "100%",
    backgroundColor: colors.grey_bg,
    borderRadius: 5,
  },
  horizontal:{
    position:'absolute',
    left: width/2,
     marginTop: height/2,
    justifyContent: "center",
    zIndex:5
}
});
