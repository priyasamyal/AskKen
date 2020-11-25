import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
  header: {
    margin: 5,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  pageTitle: {
    fontFamily: 'PTSans-Bold',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 10,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    margin: 40,
    marginTop: 10,
  },
  content_block: {},
  title: {
    fontFamily: 'PTSans-Bold',
    fontSize: 24,
    color: colors.LIGHT_COLOR,
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontWeight: 'bold',
    width: width,
  },
  text: {
    paddingTop: 10,
    fontFamily: 'PTSans-Regular',
    fontSize: 18,
    color: colors.LIGHT_COLOR,
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  activeDot: {
    backgroundColor: colors.LIGHT_COLOR,
    borderRadius: 15,
    padding: 6,
  },
  dotStyle: {
    backgroundColor: '#f8d58e',
    borderRadius: 15,
    padding: 6,
    // opacity: 0.6,
  },
  nextBtn: {
    backgroundColor: colors.LIGHT_COLOR,
    fontFamily: 'PTSans-Bold',
    marginRight: 50,
    marginLeft: 50,
    paddingBottom: 2,
    marginBottom: 20,
    borderRadius: 5,
  },
  nextBtnTxt: {
    fontFamily: 'PTSans-Bold',
    fontSize: 20,
    color: colors.THEME_YELLOW,
    fontWeight: 'bold',
  },
});
