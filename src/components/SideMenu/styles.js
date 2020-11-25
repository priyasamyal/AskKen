import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
  header: {
    margin: 5,
  },
  container: {
    flex: 2,
    justifyContent: 'flex-end',
   
//backgroundColor:'red'
  },
  black_text: {
    color: colors.BLACK,
    paddingLeft: 5,
    fontSize: 40,
  },

  bottom_list: {
    marginTop: 50,
    borderTopWidth: 1.5,
    borderTopColor: colors.BORDER_COLOR,
    marginLeft: 20,
    marginRight: 50,
    paddingTop: 30,
    marginBottom: 80
  },
  bottom_list_item: {
    marginLeft: 0,
  },
  bottom_list_text: {
    fontFamily: 'AvenirLTStd-Medium',
    letterSpacing: 1,
    color: colors.GREY_TEXT,
    fontWeight: '500',
    fontSize: 15,
  },
  list_text: {
    fontFamily: 'Avenir-Light',
    letterSpacing: 1,
    fontSize: 17,
    paddingBottom: 15
  },
  rating_text: {
    textDecorationLine: 'underline',
    paddingLeft: 5,
    textDecorationStyle: 'solid',
    textDecorationColor: colors.GREY_TEXT,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
    resizeMode: 'contain',
    borderRadius: 15,
  },
  payment_status: {
    color: colors.geen_txt,
    margin: 0,
    padding: 0,
    paddingLeft: 10,
    //  backgroundColor: 'red',
    fontSize: 25,
    // paddingTop: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: -3

  },
});
