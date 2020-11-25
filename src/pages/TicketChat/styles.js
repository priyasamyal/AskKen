import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'center',
    },
    header: {
        margin: 5,
        alignItems: 'center', justifyContent: 'center'
    },
    image: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        marginLeft: 5
    },
    pageTitle: {
        fontFamily: 'PTSans-Bold',
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 8,
        textAlign: 'center'
    },
    headingText: {
        margin: 40,
        fontFamily: 'PTSans-Regular',
        fontSize: 18,
        textAlign: 'center',
    },
    btncontainer: {
        position: "absolute",
        bottom: 0,
        width: width,
        paddingRight: 40,
        paddingLeft: 40,
        marginBottom: 40,
        //paddingBottom: 60,
    },
    btn_inner: {
        backgroundColor: colors.THEME_YELLOW,
        height: 55,
    },
    btn_txt: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'PTSans-Regular',
        fontSize: 20,
        fontWeight: 'bold',
    },
    black_text: {
        color: colors.BLACK,
        paddingLeft: 10,
    },
    main_container: { alignItems: 'center', marginBottom: 20 },
    upload_image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    selected_img: {
        borderRadius: 15,
        borderWidth: 2,
        borderColor: colors.BORDER_COLOR,
        width: 300,
        height: 300,
        // resizeMode: 'contain',
    },
    img_container: {
        backgroundColor: colors.GRAY_BACKGROUND,
        minWidth: '80%',
        minHeight: 180,
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',
    },
    heading_txt: {
        fontFamily: 'PTSans-Regular',
        fontSize: 18,
        letterSpacing: 1.1,
        fontWeight: 'bold',
        paddingBottom: 15,
    },
    edit_container: {
        paddingTop: 30,
    },
    edit_text: {
        textAlign: 'center',
        fontSize: 18,
        textDecorationLine: 'underline',
        color: colors.PLACEHOLDER_TEXT,
    },
    icon_container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '80%',
        // backgroundColor: 'red'
    },
    icon_img: {
        height: 20,
        width: 20,
        // color: colors.BORDER_COLOR,
        padding: 5,
        // paddingRight: 50,
        //fontSize: 40,
        //fontWeight: 'bold'
    },
    numberInput: {
        fontFamily: 'AvenirLTStd-Medium',
        fontSize: 17,
        color: colors.BLACK_TEXT,
        marginTop: 0,
        paddingLeft: 9,
        maxHeight: 38,
        //textAlignVertical:'top',
        lineHeight: 22,
        //  justifyContent:'center',
        alignSelf: 'center',
        // alignItems:'center',
        // paddingBottom:15,
        //backgroundColor:'red',
        // paddingTop: 5,
        paddingBottom: 0
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 45
    },
    sendBtn: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.btn_background,
        padding: 0,
        borderRadius: 20,
        paddingBottom: 5
    },
    btnText: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'AvenirLT-Black',
        width: 30,
        fontSize: 20,
        fontWeight: '600',

        //letterSpacing: 0.8
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 50
    },
    flexRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        // alignItems: "flex-end",
        // marginBottom:15
    },
    message: {
        color: colors.BLACK_TEXT,
        fontFamily: "AvenirLTStd-Medium",
        fontSize: 16,
        paddingTop: 3
    },
    senderView: {
        padding: 7,
        alignItems: "flex-start"
    },
    receiverView: {
        padding: 7,
        paddingRight: 20,
        alignItems: "flex-end"
    },
    messageContainer: {
        // width: width / 1.5
        maxWidth: width / 1.5,
        minWidth: 130
    },
    receiverMessageContainer: {
        width: width / 1.5,
        alignItems: "flex-end",
    },
    chatImage: {
        width: 30,
        height: 30,
        borderRadius: 25,
    },
    imageSelection: {
        width: 80,
        height: "95%",
        borderRadius: 15,
    },
    imageContainer: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: colors.BORDER_COLOR
    },
    receiverMessageBox: {
        backgroundColor: colors.receiver_color,
        padding: 12,
        // paddingBottom:14,
        borderBottomLeftRadius: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    senderMessageBox: {
        backgroundColor: colors.LIGHT_COLOR,
        padding: 12,
        borderBottomRightRadius: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        // paddingBottom:10,
        borderColor: colors.BORDER_COLOR,
        borderWidth: 1,
    },
    sendermessage: {
        color: colors.BLACK_TEXT,
        fontFamily: "AvenirLTStd-Medium",
        fontSize: 16,
        paddingTop: 3
    },
    subText: {
        color: colors.btn_background,
        fontFamily: "AvenirLTStd-Medium",
        fontSize: 12
    },
    SubTextContainer: {
        paddingTop: 5,
        //marginLeft: 40
    },
    textmessageContainer: {
        // flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        paddingLeft: 0,
        // paddingRight:8,
        borderRadius: 30,
        borderColor: colors.receiver_color,
        //backgroundColor:'red'
        // maxHeight:100
    },
    mediaIcons: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
    mediaIconsContainer: {
        marginRight: 5
        // borderWidth: 1,
        // borderColor: colors.PLACEHOLDER_TEXT,
        // paddingLeft: 0,
        // paddingTop: height < 680? 10: 11,
        // paddingBottom: height < 680? 10: 11,
        // borderRadius: 50,
        // alignItems: "center",
        // justifyContent: "center",
    },
    mediaIconsContainer1: {
        borderWidth: 1,
        borderColor: colors.PLACEHOLDER_TEXT,
        paddingLeft: 0,
        paddingTop: height < 680 ? 7 : 9,
        paddingBottom: height < 680 ? 7 : 9,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    backgroundVideo: {
        height: 180,
        minWidth: 130,
        backgroundColor: colors.grey_bg,
        borderRadius: 5,
    },
    profile_container: {
        flexDirection: 'row',
        width: width / 1.5,
    },
    backgroundFullVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height: "100%", width: "100%",
        backgroundColor: colors.grey_bg,
        borderRadius: 5,
    },
    //   messageBubble: {
    //     borderRadius: 5,
    //     marginTop: 8,
    //     marginRight: 10,
    //     marginLeft: 10,
    //     paddingHorizontal: 10,
    //     paddingVertical: 5,
    //     flexDirection:'row',
    //     flex: 1
    // },

    // messageBubbleLeft: {
    //   backgroundColor: '#d5d8d4',
    // },

    // messageBubbleTextLeft: {
    //   color: 'black',

    // },

    // messageBubbleRight: {
    //   backgroundColor: '#66db30'
    // },

    // messageBubbleTextRight: {
    //   color: 'white'
    // },

    /***New Styles */



    outer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },

    messages: {
        flex: 1
    },

    //InputBar

    inputBar: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingBottom: 20,
        paddingTop: 5
    },

    textBox: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 10
    },

    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 15,
        marginLeft: 5,
        paddingRight: 15,
        borderRadius: 5,
        backgroundColor: '#66db30'
    },

    //MessageBubble

    messageBubble: {
        //  borderRadius: 5,
        marginTop: 8,
        marginRight: 10,
        marginLeft: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },

    messageBubbleLeft: {
        // backgroundColor: '#d5d8d4',
        backgroundColor: colors.LIGHT_COLOR,
        padding: 12,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderColor: colors.BORDER_COLOR,
        borderWidth: 1,
    },

    messageBubbleTextLeft: {
        // color: 'black'
        color: colors.BLACK_TEXT,
        fontFamily: "AvenirLTStd-Medium",
        fontSize: 16,
        paddingTop: 3
    },

    messageBubbleRight: {
        backgroundColor: colors.receiver_color,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        padding: 12,
        // backgroundColor: '#66db30'
    },

    messageBubbleTextRight: {
        //color: 'white',
        color: colors.BLACK_TEXT,
        fontFamily: "AvenirLTStd-Medium",
        fontSize: 16,
        paddingTop: 3
    },
    horizontal: {
        position: 'absolute',
        left: width / 2,
        marginTop: height / 2.7,
        justifyContent: "center"
    }
});