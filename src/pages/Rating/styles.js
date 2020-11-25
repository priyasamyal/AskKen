import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    mainContent: {
        flex: 1,
        padding: 20,
        paddingLeft: 30,
        height: Dimensions.get('window').height,
        marginTop: "35%"

    },
    problem_text: {
        fontFamily: 'PTSans-Bold',
        fontSize: 25,
        letterSpacing: 0.8,
        paddingBottom: 10
    },
    description_text: {

        fontFamily: 'PTSans-Regular',
        fontSize: 18,
        letterSpacing: 0.8,
        marginBottom: "10%"
    },
    numberInputContainer: {
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        marginTop: 30,
        width: width - 60,
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
    btm_btncontainer: {
        width: width,
        paddingRight: 30,
        paddingTop: 30,
        paddingLeft: 30,
        marginBottom: 30,
        borderTopColor: colors.BORDER_COLOR,
        borderTopWidth: 1,
        alignItems: 'center',

    },
    btn_inner1: {
        backgroundColor: colors.THEME_YELLOW,
        height: 55,
    },

    btn_txt1: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'PTSans-Regular',
        fontSize: 20,
        fontWeight: 'bold',
    },











    header: {
        margin: 5,
    },
    pageTitle: {
        fontFamily: 'Avenir-Heavy',
        fontWeight: "100",
        fontSize: 18,
        paddingTop: 10
    },
    containers: {
        flex: 1,

        //justifyContent: 'center',
        alignItems: 'center'
    },
    container1: {
        flex: 1,
        width: width - 120,
        alignSelf: 'center',
        marginBottom: 50,
        justifyContent: 'space-between',

    },
    headingText: {
        marginTop: 10,
        marginBottom: 20,
        fontFamily: 'Avenir-Heavy',
        fontSize: 32,
        textAlign: 'center',
        letterSpacing: 0.8,
    },
    value: {
        marginTop:20,
        //marginBottom: 10,
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 25,
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
       fontSize:40
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
        borderRadius:15
    },
    btn_txt: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'Avenir-Heavy',
        fontSize: 20,
    },
    icon_img: {
        alignSelf: 'center',
        width: 280,
        height: 190,
        resizeMode: 'contain',
        margin: 40
    }
});
