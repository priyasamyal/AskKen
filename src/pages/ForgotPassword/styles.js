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
        fontFamily: 'PTSans-Bold',
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 10,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        //marginTop: 10,
        height: Dimensions.get('window').height,
    },
    heading: {
        // fontFamily: 'PTSans-Bold',
        // fontWeight: 'bold',
        // fontSize: 25,
        // paddingTop: 0,
        // textAlign: 'center',
        // letterSpacing: 0.7
        paddingTop: 0,
        textAlign: 'center',
        fontFamily: 'Avenir-Heavy',
        fontSize: 23,
    },
    headingText: {
        // margin: 40,
        // marginTop: 15,
        // marginBottom: 80,
        // fontFamily: 'PTSans-Regular',
        // fontSize: 18,
        // textAlign: 'center',
        // color: colors.grey_heading,
        // letterSpacing: 0.7
        margin: 40,
        marginTop: 15,
        marginBottom: 80,
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 16,
        textAlign: 'center',
        color: colors.grey_heading,
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
        paddingBottom: 3,

        padding: 5,
    },
    numberContainer: {
        width: '20%',
        alignItems: 'center',
        borderRightWidth: 0.8,
        borderColor: colors.PLACEHOLDER_TEXT,
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
        padding: 5,
        fontSize: 18,
        paddingTop:10,
        fontFamily: 'AvenirLTStd-Medium',
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
        paddingLeft: 7,
    },
    nextButtonContainer: {
        justifyContent: 'flex-end',
        width: '100%',
        alignSelf: 'flex-end',
        paddingTop: 10,
        position: 'absolute',
        bottom: '10%',
    },
    nextButton: {
        color: colors.THEME_YELLOW,
        fontFamily: 'PTSans-Regular',
        fontSize: 22,
        fontWeight: 'bold',
        opacity: 0.4,
        letterSpacing: 0.8,
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
        fontFamily: 'PTSans-Bold',
        fontSize: 20,
    }
});