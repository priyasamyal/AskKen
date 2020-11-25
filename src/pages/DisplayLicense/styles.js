import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
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
    paddingTop: 10
  },
  headingText: {
    margin: 40,
    fontFamily: 'PTSans-Regular',
    fontSize: 18,
    textAlign: 'center',
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
    color: colors.BLACK,
    paddingLeft: 10,
  },
  main_container: { alignItems: 'center', marginBottom: 20 },
  upload_image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',

  },
  selected_img: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.BORDER_COLOR,
    width: 300,
    height: 300,
    // resizeMode: 'contain',
  },
  img_container: {
    backgroundColor: colors.GRAY_BACKGROUND,
    minWidth: "80%",
    minHeight: 180,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center'
  },
  heading_txt: {
    fontFamily: 'PTSans-Regular',
    fontSize: 18,
    letterSpacing: 1.1,
    fontWeight: 'bold',
    paddingBottom: 15
  },
  edit_container: {
    paddingTop: 30,
  },
  edit_text: {
    textAlign: 'center',
    fontSize: 18,
    textDecorationLine: 'underline',
    color: colors.PLACEHOLDER_TEXT,
  },
  icon_container: {
    flexDirection: 'row', justifyContent: 'flex-end', width: '80%'
  },
  icon_img: {
    height: 20,
    width: 20,
    // color: colors.BORDER_COLOR,
    padding: 5,
    // paddingRight: 50,
    //fontSize: 40,
    //fontWeight: 'bold'
  }
});
