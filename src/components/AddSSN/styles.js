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
    },
    mainContainer: {
        flex: 1,
        margin: 20,
    },
    mainContent: {
        flex: 1,
        height: Dimensions.get('window').height,

    },

    headingText: {
        fontFamily: 'AvenirLT-Black',
        fontSize: 25,
        color: colors.jet_black,
        letterSpacing: 0.5,
    },
    heading_description: {
        marginTop: 20,
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 18,
        color: colors.jet_black,
        letterSpacing: 0.5,
    },
    label_text: {
        fontFamily: 'Avenir-Heavy',
        fontSize: 17,
        color: colors.BLACK_TEXT,
        letterSpacing: 0.5,
    },

    inputText: {
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 16,
        color: colors.BLACK_TEXT,
        letterSpacing: 0.5,
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
        color: colors.LIGHT_COLOR,
        fontFamily: 'AvenirLTStd-Medium',
        paddingTop:5,
        fontSize: 20,
        fontWeight: 'bold',
        opacity: 0.4,
        letterSpacing: 0.8
    },


});
