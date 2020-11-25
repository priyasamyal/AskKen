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
        borderTopWidth: 1,
        borderColor: colors.input_border,
        paddingTop: 35,
        marginBottom: height < 680? 20:30
    },
    mainContent: {
        flex: 1,
        margin: 20,
        marginTop: 15,
        marginLeft: 30,

        // alignItems: 'center',

    },
    headingText: {
        marginTop: 0,
      //  fontFamily: 'AvenirLT-Black',
        fontFamily: 'Avenir-Heavy',
        fontSize:height < 680? 19: 23,
        color: colors.BLACK_TEXT,
        marginBottom: 10
    },
    heading_description: {
        fontFamily: 'Avenir-Light',
        fontWeight:'300',
      //  fontFamily: 'AvenirLTStd-Medium',
        fontSize:height < 680? 16: 18,
        color: colors.BLACK_TEXT,
    },
    private_info: {
        marginTop: 0,
        fontFamily: 'Avenir-Light',
        fontSize:height < 680? 13: 15,
    //   fontSize: 13,
        color: colors.GRAY_BACK,
    },
    next_btn: {
        // width: "50%",
        // justifyContent: 'center',
        // textAlign: 'center',
        backgroundColor: colors.THEME_YELLOW,
        marginRight: 10,
        marginBottom: 10,
    },
    next_btn_container: {
        // textAlign: 'right',
        alignSelf: 'flex-end',
    },
    next_btn_txt: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'PTSans-Bold',
        paddingRight: 20,
        fontSize: 18,
        paddingLeft: 20,
        paddingBottom: 20,
    },
    continueBtnContainer: {
        width: width - 30,
        alignSelf: 'center',
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
        fontSize: 18,
    },
});
