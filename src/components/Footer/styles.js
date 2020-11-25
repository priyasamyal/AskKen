import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',

    },

    footerOuter: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: "25%",
        // backgroundColor: 'red'
    },
    footer: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        alignContent: 'space-between',
        backgroundColor: 'transparent',
        paddingBottom: 20,
    },
    footer_icon: {
        height: 40,
        width: 40,
        padding: 30
    },
    footer_icon_end: {
        height: 40,
        width: 40,
        padding: 35
    },
    footer_container: {

        margin: 10,
        marginTop: 10
    },
    name: {
        fontFamily: 'PTSans-Bold',
        fontSize: 25,
        color: colors.LIGHT_COLOR
    },
    designation: {
        fontFamily: 'PTSans-Regular',
        fontSize: 18,
        marginBottom: 10,
        marginTop: 5,
        color: colors.LIGHT_COLOR
    },
    linearGradient: {
        paddingTop: 40,
    },
    // container: {
    //     flex: 1,
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    // },

    // footerOuter: {
    //     width: '100%',
    //     alignItems: 'center',
    //     paddingBottom: "14%",
    //     //marginBottom: 80,
    // },
    // footer: {
    //     width: width,
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     backgroundColor: colors.BLACK_TEXT,
    //     alignItems: 'center',
    //     alignContent: 'space-between',
    //     backgroundColor: 'transparent',
    //     paddingRight: 20,
    //     paddingLeft: 25,

    // },
    // footer_inner: {

    // },
    // footer_icon: {
    //     height: 50,
    //     width: 50,
    //     padding: 35,
    //     // padding: 35
    //     // padding: "20%"
    // },
    // end_call_footer_icon: {
    //     height: 140,
    //     width: 140,
    //     resizeMode: 'contain'
    //     //  padding: 72
    // },
    // footer_text: {
    //     color: colors.LIGHT_COLOR,
    //     fontSize: 15,
    //     paddingTop: 7,
    //     alignSelf: 'center',
    //     fontFamily: 'PTSans-Regular',
    // },
    // footer_container: {

    //     margin: 5,
    //     marginTop: 10
    // },
    // name: {
    //     fontFamily: 'PTSans-Bold',
    //     fontSize: 28,
    //     color: colors.LIGHT_COLOR
    // },
    // designation: {
    //     fontFamily: 'PTSans-Regular',
    //     fontSize: 20,
    //     marginBottom: 10,
    //     color: colors.LIGHT_COLOR
    // },
    // linearGradient: {
    //     paddingTop: 40,
    // },

})