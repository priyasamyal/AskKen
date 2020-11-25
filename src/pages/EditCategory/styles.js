import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
  header: {
    margin: 5,
    marginBottom:0
  },

  mainContainer: {
    flex: 1,
    //paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: colors.input_border,
  },
  mainContent: {
    flex: 1,

    alignItems: 'center',
    // marginTop: 10,
   // height: Dimensions.get('window').height,
  },
  headingText: {
    margin: 40,
    marginBottom: 20,
    fontFamily: 'Avenir-Heavy',
    fontSize: 22,
    textAlign: 'left',
    marginBottom: 80,
  },
  headingTextSkill: {
    margin: 40,
    fontFamily: 'PTSans-Bold',
    fontSize: 20,
    textAlign: 'left',
  },
  numberInputContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginTop: 30,
    width: width - 80,
    //width: "70%",
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
    //backgroundColor: 'red'
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
    fontFamily: 'PTSans-Regular',
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: 25,
    height: 25,
    marginRight: 8,
    resizeMode: 'contain',
  },
});
