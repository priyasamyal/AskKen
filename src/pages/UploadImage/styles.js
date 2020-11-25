import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
var { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "transparent"
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },

    skip_text: {
        color: colors.LIGHT_COLOR,
        fontFamily: "PTSans-Regular",
        fontWeight: '400',
        fontSize: 18,
        paddingTop: 9,
        paddingRight: 20
    },



    header: {
        margin: 5,
        flexDirection: "row",
        justifyContent: 'space-between',
        width: width

    },
    pageTitle: {
        fontFamily: "PTSans-Bold",
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 10
    },
    outer_container: {
        flex: 1,
        bottom: "45%"
    },
    top_container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',

    },
    upload_text: {
        fontFamily: "PTSans-Bold",
        fontSize: 20,
        color: colors.LIGHT_COLOR,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 20

    },

    enable_btn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: colors.LIGHT_COLOR,
        borderRadius: 25
    },
    enable_btn_txt: {
        fontFamily: "PTSans-Regular",
        paddingRight: 20,
        paddingLeft: 20
    },
    linearGradient: {
        flex: 1,
        paddingTop: 40
    },
    bottom_container: {
        position: 'absolute',
        bottom: 0,
        flex: 1,
        justifyContent: 'flex-end',
    },
    camera_control: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10
    },
    flash_touch: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: width / 3,
    },
    flip_touch: {
        alignItems: 'flex-start',
        width: width / 3,
        justifyContent: 'center',
        paddingTop: 12
    },
    camera_touch: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    upload_touch: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: width / 2,
        paddingRight: 30,
    },
    photo_touch: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: width / 2,
        paddingLeft: 30
    },
    segment_text: {
        color: colors.LIGHT_COLOR,
        fontFamily: "PTSans-Bold",
        fontSize: 15,
        paddingBottom: 10
    },
    flash_icon: {
        width: 30,
        height: 25,
        resizeMode: 'contain',
    },
    flip_icon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',


    },
    camera_butn: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    iconStyle: {
        color: colors.GRAY_BACK,
        fontSize: 35
    }
});