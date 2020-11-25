import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: colors.input_border,
       // paddingTop: 35,
    },
    header: {
        margin: 5,
        marginBottom: 0
    },
    pageTitle: {
        fontFamily: 'PTSans-Bold',
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 10
    },
    heading: {
        fontFamily: 'AvenirLT-Black',
        fontWeight: 'bold',
        fontSize: 23,
        paddingTop: 0,
        textAlign: 'center',
    },
    headingText: {
        margin: 40,
        marginTop: 15,
        marginBottom: 0,
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 17,
        textAlign: 'center',
        color: colors.grey_heading,
        // letterSpacing: 0.7
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
        color: colors.GREY_TEXT,
        paddingLeft: 10,
    },
    image: {

        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
        borderRadius: 200 / 2,
    },
    edit_container: {
        justifyContent: 'center'
        // paddingTop: 30,
    },
    edit_text: {
        textAlign: 'center',
        fontSize: 18,
        textDecorationLine: 'underline',
        color: colors.PLACEHOLDER_TEXT,
        fontFamily: 'AvenirLTStd-Medium',
    },
    continueBtnContainer: {
        width: width - 60,
        marginBottom: 35,
    },
    mainContainer: {
        flex: 1,

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
    }
});