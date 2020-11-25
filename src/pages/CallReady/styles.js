import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({

    header: {
        margin: 5,
    },

    black_text: {
        color: colors.LIGHT_COLOR,
        paddingLeft: 10,
    }



});
