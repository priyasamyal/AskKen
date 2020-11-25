import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex: 1,
    },
    inner_container: {
        flex: 1,
    },
    center_item: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    rating_icon: {
        height: 130,
        width: 130,
        resizeMode: 'contain'
    },
    header_text: {
        fontSize: 45,
        fontFamily: 'PTSans-Regular',
        fontWeight: '500',
        paddingTop: 15,
        letterSpacing: 0.7,
    },
    explain: {
        fontSize: 18,
        letterSpacing: 0.7,
        fontFamily: 'PTSans-Bold',
        paddingBottom: 20,
        color: colors.jet_black
    },
    description_text: {
        fontSize: 16,
        letterSpacing: 1,
        lineHeight: 22,
        fontFamily: 'PTSans-Regular',
        color: colors.jet_black,

    }

})