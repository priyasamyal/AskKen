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
    timer_container: {
        backgroundColor: colors.LIGHT_COLOR,
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 5,
        paddingBottom: 5,
        marginTop: 30,
        borderRadius: 20,
        position: 'absolute',
        top: "6%",
        alignSelf: 'center',
        zIndex: 10
    },
    refresh_container: {
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 5,
        paddingBottom: 0,
        marginTop: 3,
        borderRadius: 20,
        position: 'absolute',
        top: "3%",
        alignSelf: 'center',
        zIndex: 4
    },
    refresh_icon: {
        height: 25,
        width: 25,
        marginTop: 0,
        //padding: 30
    },
    mute_container: {
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 5,
        paddingBottom: 0,
        marginTop: 3,
        borderRadius: 20,
        position: 'absolute',
        top: "14%",
        alignSelf: 'center'
    },
    mute_icon: {
        height: 35,
        width: 35,
        marginTop: 0,
        //padding: 30
    },
    timer_text: {
        fontFamily: 'PTSans-Regular',
        fontSize: 16,
        fontWeight: "500"
    },
    footerOuter: {
        width: '100%',
        alignItems: 'center',
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
    footer_container: {
        margin: 5
    },
    name: {
        fontFamily: 'PTSans-Bold',
        fontSize: 28,
        color: colors.LIGHT_COLOR
    },
    designation: {
        fontFamily: 'PTSans-Regular',
        fontSize: 20,
        marginBottom: 10,
        color: colors.LIGHT_COLOR
    },
    linearGradient: {
        paddingTop: 40,
    },
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        bottom: 0,
        //  borderRadius: 15,
        backgroundColor: colors.footer_color,
        width: "100%",
        paddingRight: 10,
        paddingBottom: 15,
        paddingTop: 5
        //paddingTop: -10

        // borderWidth: 1,
        // borderColor: "#e0e0e1",
    },
})