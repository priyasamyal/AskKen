import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    header: {
        margin: 5,
        // marginBottom: 0
    },
    pageTitle: {
        fontFamily: 'PTSans-Bold',
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 10
    },
    heading: {
        fontFamily: 'Avenir-Heavy',
        fontWeight: 'bold',
        fontSize: 23,
        paddingTop: 0,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        height: Dimensions.get('window').height
    },
    headingText: {
        margin: 40,
        marginTop: 15,
        marginBottom: 80,
        fontFamily: 'AvenirLTStd-Medium',
       
        textAlign: 'center',
        color: colors.grey_heading,
        lineHeight:19,
        fontSize: 18,
    },
    mainContainer: {
        flex: 1,
        borderTopWidth: 1,
        borderColor: colors.input_border,
        paddingTop: 35,
    },
    numberInputContainer: {
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        padding: 5,
        paddingBottom: 4,
        //paddingTop: 7,
        width: width - 80
    },
    numberContainer: {
        width: '20%',
        alignItems: 'center',
        borderRightWidth: 0.8,
        borderColor: colors.PLACEHOLDER_TEXT,
        padding: 4,
        marginRight: 5,
        paddingRight: 3,
        marginTop: 5,
        marginBottom: 6,
    },
    inputContainer: {
        marginLeft: 6,
        width: '60%',
        justifyContent: 'center',
        paddingBottom: 1,
    },
    countryCodeText: {
        color: colors.BLACK_TEXT,
        // padding: 5,
        fontSize: 18,
        paddingTop: 5,
        fontFamily: 'AvenirLTStd-Medium',
        alignSelf: 'center'
    },
    numberInputInnerContainer: {
        width: 1,
        borderLeftWidth: 1,
        borderColor: colors.GREY_TEXT,
        backgroundColor: 'red',
    },
    numberInput: {
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 18,
        color: colors.BLACK_TEXT,
        paddingTop: 5,
        paddingLeft: 7,
        // paddingTop: 3
    },
    nextButtonContainer: {
        justifyContent: 'flex-end',
        width: width,
        alignSelf: 'flex-end',
        paddingTop: 10,
        position: 'absolute',
        right: 0,
        bottom: '10%',
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
    }
});