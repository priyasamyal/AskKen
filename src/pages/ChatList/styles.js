import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        borderTopWidth: 1,
        borderColor: colors.input_border,
        paddingTop: 10,
    },
    mainContent: {
        flex: 1,
    },
    name:{
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 17,
        color: colors.BLACK_TEXT,
    },
    msg_no:{
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 15,
        color: colors.BLACK_TEXT,
    },
    backgroundVideo: {
        height: 57, width: 58,
        backgroundColor: colors.grey_bg,
        borderRadius: 5,
      },
});