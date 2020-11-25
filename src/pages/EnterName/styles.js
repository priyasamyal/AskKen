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
        paddingTop: 10
    },
    mainContainer: {
        flex: 1,
        borderTopWidth: 1,
        borderColor: colors.input_border,
        paddingTop: 35,
       // backgroundColor:'red'
    },
    mainContent: {
        flex: 1,
       // alignItems: 'center',

        // marginTop: 10,
       // width: Dimensions.get('window').width,

    },
    heading: {
        fontFamily: 'Avenir-Heavy',
        fontWeight: 'bold',
        fontSize: 23,
        paddingTop: 0,
        textAlign: 'center',
    },
    headingText: {
        margin: 40,
        marginTop: 15,
        paddingBottom: 100,
        fontFamily: 'AvenirLTStd-Medium',
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
        marginTop: 20,
        width: width - 70
    },
    numberInput: {
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 18,
        // padding: 7,
        paddingBottom: 7,
        //  width: "70%",
        color: colors.BLACK_TEXT,
        borderBottomWidth: 1,
        borderColor: colors.input_border,
        //backgroundColor:'red'
    },
    nextButtonContainer: {
       // justifyContent: 'flex-end',
        width: "100%",
       // alignSelf: 'flex-end',
        paddingTop: 10,
        // position: 'absolute',
        //  bottom: "20%",
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
        alignSelf: 'center',
        width: width - 40,
        marginTop: 55,
        justifyContent:'flex-end',
        
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