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
        color: colors.info_color,
    },
    black_text: {
        color: colors.BLACK_TEXT,
        paddingLeft: 10,
        fontSize: 28,
       // paddingBottom:15
    },
    mainContent: {
        flex: 1,
        //   height: Dimensions.get('window').height ,

    },
    mainContainer: {
        flex: 1,

        //  height: Dimensions.get('window').height - 100,
        margin: 20,
        marginTop:10,
        marginBottom:10
    },
    headingText: {
        fontFamily: 'AvenirLT-Black',
        fontSize: 25,
        color: colors.jet_black,
        letterSpacing: 0.8,
    },
    label_text: {
        fontFamily: 'Avenir-Heavy',
        fontSize: 17,
        color: colors.BLACK_TEXT,
        letterSpacing: 0.5,
        //  paddingBottom: 10
    },
    next_btn: {
        // width: "50%",
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: colors.THEME_YELLOW,
    },
    next_btn_container: {
        justifyContent: 'space-between',
        alignSelf: 'flex-end',
        bottom: "10%",
        position: 'absolute',
        // marginBottom: "10%"
    },
    next_btn_txt: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'PTSans-Bold',
        paddingRight: 20,
        fontSize: 18,
        paddingLeft: 20,
        paddingBottom: 2
    },

    inputText: {
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 16,
        color: colors.BLACK_TEXT,
        letterSpacing: 0.5,
        // backgroundColor:'red',
        paddingLeft: 0
    },


    nextButtonContainer: {
        justifyContent: 'flex-end',
        width: "100%",
        alignSelf: 'flex-end',
        marginBottom: 50
        // paddingTop: 10,
        //  position: 'absolute',
        // bottom: "10%",
    },
    nextButton: {
        paddingTop:5,
        color: colors.LIGHT_COLOR,
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 20,
        fontWeight: 'bold',
        opacity: 0.4,
        letterSpacing: 0.8
    },



});
