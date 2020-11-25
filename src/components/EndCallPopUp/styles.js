import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        padding: 20,
       
    },
    inner_container: {
        backgroundColor: "rgba(255, 255, 255, 1)",
        alignItems: 'center',
        borderRadius: 20,
        paddingBottom:0,
        width: "90%",
        alignSelf: 'center',
    },
    header_text: {
        fontSize: 25,
      fontFamily: 'AvenirLTStd-Medium',
        color: colors.BLACK_TEXT,
        paddingBottom: 5
    },
    description_text: {
        fontSize: 16,
        fontFamily: 'AvenirLTStd-Medium',
        color: colors.BLACK_TEXT,
       // paddingBottom: 15,
        paddingRight: 25,
        paddingLeft: 25,
        alignSelf: 'center',
        textAlign: 'center'
    },
    description_text_pay: {
        fontSize: 14,
        fontFamily: 'Avenir-Medium',
        color: colors.BLACK_TEXT,
       // paddingBottom: 15,
        paddingRight: 10,
        paddingLeft: 10,
        color: colors.chat_placeholder,
        alignSelf: 'center',
        textAlign: 'center'
    },
    back_btn: {
        borderWidth: 2,
        borderColor: colors.GREY_TEXT,
        backgroundColor: 'transparent',
        width: "95%",
        justifyContent: 'center',
        margin: 8,
        height: 55
    },
    back_btn_txt: {
        color: colors.GREY_TEXT,
        fontFamily: 'PTSans-Bold',
        fontSize: 18,
    },

    end_btn: {
        borderWidth: 1,
        borderColor: colors.THEME_YELLOW,
        backgroundColor: colors.THEME_YELLOW,
        width: "95%",
        justifyContent: 'center',
        margin: 8,
        height: 55
    },
    end_btn_txt: {
        color: colors.blue,
        fontFamily: 'Avenir-Heavy',
        fontSize: 18,
       // padding:15
    },
    end_btn_txt_pay: {
        color: colors.danger,
        fontFamily: 'Avenir-Light',
        fontSize: 16,
    },
    info_icon:{
        fontSize:60
    }


})