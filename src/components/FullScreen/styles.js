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
    fontSize: 30
  },
  continueBtnContainer: {
    width: width - 40,
    marginBottom: 40
  },
  textmessageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
   
    padding: 8,
    borderRadius: 30,
    maxHeight:49
},
numberInput: {
    fontFamily: 'AvenirLTStd-Medium',
    fontSize: 18,
    color: colors.LIGHT_COLOR,
    paddingLeft: 7
},
mediaIcons: {
  width:15,
  height: 15,
  resizeMode:'contain',   
},
//   continueBtn: {
//     backgroundColor: colors.BLACK_TEXT,
//     justifyContent: 'center',
//     height: 55,
//     borderRadius: 15
//   },
//   continueBtnTxt: {
//     color: colors.LIGHT_COLOR,
//     fontFamily: 'Avenir-Heavy',
//     fontSize: 17,
//   },
  backgroundVideo:{
    height:"85%",
    width:"100%",
    borderRadius:15,
    marginTop:30,
    backgroundColor:colors.home_gray
  },
  backgroundVideo1: {
    marginTop:30,
    height:"85%",
    width:"100%",
    backgroundColor: colors.grey_bg,
    borderRadius:15,
  },
   horizontal:{
      position:'absolute',
      left: width/2,
       marginTop: height/2.7,
      justifyContent: "center"
  }
})