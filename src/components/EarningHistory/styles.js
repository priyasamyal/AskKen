import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding:20
       
    },
    mainContent: {
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: colors.BORDER_COLOR,
        justifyContent: 'center',
    },
    btncontainer: {
        flex: 1,
        justifyContent: 'flex-end',
        width: '100%',
        //position: 'absolute',
        //alignSelf: 'flex-end',
        width: width,
        paddingRight: 22,
        paddingLeft: 22,
        //   marginBottom: 10,
    },
    btn_inner: {
        //  backgroundColor: 'transparent'
        height: 55,
        //   marginBottom: 30,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        marginBottom: 40,
    },
    btn_txt: {
        color: colors.BLACK_TEXT,
        fontFamily: 'PTSans-Regular',
        fontSize: 20,
        fontWeight: 'bold',
    },

    top_container:{
            alignItems:'center'
    },
    earningHeading:{
        color: colors.BLACK_TEXT,
        fontSize: 40,
        fontFamily: 'Avenir-Black',
        textAlign:'center'
    },
    total_earning:{
        //fontFamily: 'Avenir-Light',
        color:colors.grey_heading,
        fontSize: 17,
        fontFamily: 'Avenir-Heavy',
    },
    cash_out:{
        color: colors.blue,
        fontSize: 18,
        marginTop:10,
        fontFamily: 'Avenir-Black',
        textAlign:'center',
       textDecorationLine:'underline',
       marginBottom:30,
    },
    history:{
        padding:5,
        paddingTop:30,
        paddingBottom:30,
        backgroundColor: colors.grey_bg,
        borderWidth: 1,
        borderColor: colors.card_border_outline,
        borderRadius:10, 
        flexDirection:'row'  ,
        alignItems:'center'   ,
        justifyContent:'space-between'
    },
    history_inner:{
        padding:5,
    },
    trophy_image:{
        alignItems:'center'   ,
        height:50,
        width:60,
        resizeMode:'contain',
      //  alignItems:'center'  ,
        alignSelf:'center'
    },
    status_text:{
        color: colors.BLACK_TEXT,
        fontSize: 14,
        marginTop:10,
        fontFamily: 'Avenir-Heavy',
        textAlign:'center',
    },
    category_name:{
        color: colors.BLACK_TEXT,
        fontSize: 17,
        fontFamily: 'Avenir-Heavy',
        textAlign: 'center',
        
    },
    category_desc:{
        color: colors.earnings,
        fontSize: 14,
       fontFamily: 'Avenir-Light',
       // fontFamily: 'Avenir-Heavy',
        //textAlign:'center'
    },
    ticket_image:{
        height:130,
      //  width:100,
     //   resizeMode:'contain',
      //  alignItems:'center'  ,
     
    },
    backgroundVideo: {
        height: 130, width: 130,
        backgroundColor: colors.grey_bg,
        borderRadius: 5,
      },

})