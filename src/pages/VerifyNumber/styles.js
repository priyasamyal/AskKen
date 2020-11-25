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
        fontFamily: "PTSans-Bold",
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 7,
    },
    mainContainer: {
        flex: 1,
        borderTopWidth: 1,
        borderColor: colors.input_border,
        paddingTop: 35,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        height: Dimensions.get('window').height
    },
    heading: {
        fontFamily: 'Avenir-Heavy',
        fontWeight: 'bold',
        fontSize: 23,
        paddingTop: 0,
    },
    headingText: {
        margin: 40,
        marginTop: 15,
        marginBottom: 80,
        fontFamily: 'AvenirLTStd-Medium',
        //fontSize: 18,
        lineHeight:19,
        fontSize: 18,
        textAlign: 'center',
        color: colors.grey_heading,
    },
    numberInputContainer: {
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        paddingBottom: 3,
        padding: 5,
        width: 50,
        marginRight: 10,
        marginLeft: 10
    },
    numberInput: {
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 20,
        padding: 8,
        textAlign: 'center',
        justifyContent: 'center',
        //paddingBottom: 9,
        width: "100%",

    },
    nextButtonContainer: {
        justifyContent: 'flex-end',
        width: "100%",
        alignSelf: 'flex-end',
        paddingTop: 10,
        position: 'absolute',
        bottom: "10%",
    },
    nextButton: {
        color: colors.THEME_YELLOW,
        fontFamily: 'PTSans-Regular',
        fontSize: 22,
        fontWeight: 'bold',
        opacity: 0.4,
        letterSpacing: 0.8
    },
    black_text: {
        color: colors.GREY_TEXT,
        paddingLeft: 10,
    },
    continueBtnContainer: {
        width: width - 60,
        marginTop: 35,

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
    resendText: {
        color: colors.BLACK_TEXT,
        fontFamily: 'Avenir-Heavy',
        fontSize: 18,

    }
});