import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    header: {
        margin: 5,
    },
    pageTitle: {
        fontFamily: 'PTSans-Bold',
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 10,
        paddingLeft: 0,
        letterSpacing: 0.7

    },
    black_text: {
        color: colors.BLACK,
        paddingLeft: 10,
    },
})