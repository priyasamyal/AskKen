import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    header: {
        margin: 5,
    },
    pageTitle: {
        fontFamily: "PTSans-Bold",
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 10
    },
    mainContainer: {
        flex: 1,
        // height: height
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        marginTop: "50%",
        // height: Dimensions.get('window').height,

    },
    image: {
        height: 90,
        width: 90,
        // borderColor: colors.BORDER_COLOR,
        // borderWidth: 1,
        borderRadius: 5, marginBottom: 20
    },
    headingText: {
        fontFamily: 'Avenir-Heavy',
        fontWeight: 'bold',
        fontSize: 23,
        paddingTop: 0,
        textAlign: 'center',
        color: colors.BLACK_TEXT,

    },
    numberInputContainer: {
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        marginTop: 30,
        width: width - 80,
        //width: "70%",
        padding: 15
    },
    body_style: {
        paddingLeft: 25,
        paddingBottom: 2,
        fontFamily: 'PTSans-Regular',
        fontSize: 20,
    },
    check_style: {
        paddingTop: 0,
        paddingLeft: 4,

        fontWeight: 'bold',
        marginTop: 4
    },
    nextButtonContainer: {
        justifyContent: 'flex-end',
        width: "100%",
        alignSelf: 'flex-end',
        paddingTop: 10,
        paddingRight: 25,
        position: 'absolute',
        bottom: "10%"
    },
    nextButton: {
        color: colors.THEME_YELLOW,
        fontFamily: 'PTSans-Regular',
        fontSize: 22,
        fontWeight: 'bold',
        opacity: 0.4,
    },
    black_text: {
        color: colors.BLACK,
        paddingLeft: 10,
    },

    continueBtnContainer: {
        width: width - 60,
        marginBottom: 15,

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
    terms: {
        textDecorationLine: 'underline',
        fontFamily: 'PTSans-Regular',
        fontSize: 16,
        color: colors.BLACK_TEXT
    }
});
