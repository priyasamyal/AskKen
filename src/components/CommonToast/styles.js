import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: colors.notify_success,
        width: width,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 13
        // height: 100
    },
    inner_container: {
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    header_text: {
        fontSize: 16,
        color: colors.LIGHT_COLOR,
        padding: 5,
        alignSelf: "center",
        textAlign: "center",
        paddingLeft: 0,
        fontFamily: 'AvenirLT-Black',
    },
    icon_image: {
        color: colors.LIGHT_COLOR,
        paddingTop: 7,
        padding: 5,
        justifyContent: 'flex-start'
    }



})