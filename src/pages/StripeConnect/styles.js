import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
  },

  headingText: {
    marginBottom: 40,
    marginTop: 15,
    fontFamily: 'PTSans-Regular',
    fontSize: 17,
    textAlign: 'center',
    //letterSpacing: 0,
    color: colors.LIGHT_COLOR,
  },
  headingTextTitle: {
    fontFamily: 'PTSans-Bold',
    fontSize: 23,
    textAlign: 'center',
    letterSpacing: 0.8,
    //color: colors.LIGHT_COLOR,
  },
  btncontainer: {
    width: width,
    paddingRight: 40,
    paddingLeft: 40,
    marginBottom: 30,
  },
  btn_inner: {
    backgroundColor: colors.LIGHT_COLOR,
    height: 55,
  },
  btn_txt: {
    color: colors.THEME_YELLOW,
    fontFamily: 'PTSans-Regular',
    fontSize: 20,
    fontWeight: 'bold',
  },
  //Header css
  header: {
    margin: 5,
  },
  black_text: {
    color: colors.LIGHT_COLOR,
    paddingLeft: 10,
  },
  pageTitle: {
    fontFamily: 'PTSans-Bold',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 10,
    color: colors.LIGHT_COLOR
  },
  list_text: {
    fontFamily: 'PTSans-Regular',
    letterSpacing: 1,
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
});
