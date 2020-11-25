import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    header: {
        margin: 5,
    },
    pageTitle: {
        fontFamily: 'Avenir-Light',
        fontSize: 17,
        paddingTop: 10,
        paddingLeft: 0,
        marginRight: 8,
        color: colors.info_color,
    },
    black_text: {
        color: colors.BLACK_TEXT,
        paddingLeft: 10,
    },

    mainContainer: {
        flex: 1,

        // margin: 20,
    },
    mainContent: {
        flex: 1,
        //  padding: 20,
    },
    headingText: {
        fontFamily: 'AvenirLT-Black',
        fontSize: 25,
        color: colors.jet_black,
        letterSpacing: 0.5,
        paddingLeft: 7
        // backgroundColor: 'red'
    },
    label_text: {
        fontFamily: 'AvenirLT-Black',
        fontSize: 17,
        color: colors.BLACK_TEXT,
        letterSpacing: 0.5,
    },
    next_btn: {
        // width: "50%",
        // justifyContent: 'center',
        // textAlign: 'center',
        backgroundColor: colors.THEME_YELLOW,
    },
    next_btn_container: {
        // textAlign: 'right',
        alignSelf: 'flex-end',
    },
    next_btn_txt: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'AvenirLT-Black',
        paddingRight: 20,
        fontSize: 18,
        paddingLeft: 20,
        paddingBottom: 2,
    },
    numberInput: {
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 16,
        color: colors.BLACK_TEXT,
        letterSpacing: 0.5,
        paddingTop: 8,
    },
    existingCardContainer: {
        borderRadius: 5,
        borderWidth: 2,
        borderColor: colors.THEME_YELLOW,
        paddingBottom: 3,
        padding: 5,
        marginTop: 20,
        marginBottom: 5,
        // width: width - 80,
        marginLeft: 7,
        marginRight: 5
    },
    inputText: {
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 16,
        color: colors.BLACK_TEXT,
        letterSpacing: 0.5,
    },

    nextButtonContainer: {

        //justifyContent: 'flex-end',
        //  width: "100%",
        alignSelf: 'flex-end',
        // paddingTop: 10,
        // position: 'absolute',
        // bottom: 0,
        marginTop: 50,
        //marginBottom: 30,
    },
    nextButton: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'Avenir-Heavy',
        fontSize: 20,
        fontWeight: 'bold',
        //  opacity: 0.4,
        letterSpacing: 0.8,
        paddingBottom: 15,
        paddingTop: 1,
    },
    existingCardText: {
        fontFamily: 'AvenirLTStd-Medium',
        color: colors.BLACK_TEXT,
        paddingLeft: 10,
        fontSize: 15,
    },

    btncontainer: {
        flex: 1,
        justifyContent: 'flex-end',
        width: '100%',
        //position: 'absolute',
        //alignSelf: 'flex-end',
        width: width,
        paddingRight: 30,
        paddingLeft: 30,
        marginBottom: 30,
    },
    btn_inner: {
        //  backgroundColor: 'transparent'
        height: 55,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
    },
    btn_txt: {
        color: colors.BLACK_TEXT,
        fontFamily: 'Avenir-Heavy',
        fontSize: 20,
    },
});
