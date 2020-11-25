import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    header: {
        margin: 5,
    },
    pageTitle: {
        fontFamily: 'AvenirLTStd-Medium',
        color: colors.BLACK_TEXT,
        textAlign: 'right',
        fontSize: 18,
        paddingTop: 0,
        marginRight: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    container1: {
        flex: 1,
        width: width - 120,
        alignSelf: 'center',
        marginBottom: 50,
        justifyContent: 'space-between',

    },
    headingText: {
        fontFamily: 'Avenir-Heavy',
        fontSize: 25,
        textAlign: 'center',
        letterSpacing: 0.8,
    },
    value: { 
        fontFamily: 'PTSans-Regular',
        fontSize: 20,
        textAlign: 'center',
        letterSpacing: 0.8,
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
        color: colors.BLACK,
        paddingLeft: 10,
    },
    btncontainer: {
        width: width,
        paddingRight: 40,
        paddingLeft: 40,
        marginBottom: 30,
    },
    btn_inner: {
        backgroundColor: colors.BLACK_TEXT,
        height: 55,
        borderRadius:15
    },
    btn_txt: {
        color: colors.LIGHT_COLOR,
        fontSize: 20, fontFamily: 'Avenir-Heavy',

    },
    icon_img: {
        alignSelf: 'center',
        width: 100,
        height: 120,
        borderRadius: 4,
        //resizeMode: 'contain',
        margin: 20
    },
    tipcontainer: { flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between', width: width - 120 },
    innerTip: {
        // padding: 17,
        paddingBottom: 18,
        paddingTop: 18,
        paddingRight: 20,
        paddingLeft: 20,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        borderRadius: 50,
    },
    tip_text: {
        fontFamily: 'PTSans-Regular',
        fontSize: 20,
        maxWidth: 35,
        fontFamily: 'Avenir-Light',
    }
});
