// import React, { Component } from 'react';
// import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, TextInput, TouchableHighlight, Keyboard } from 'react-native';
// import KeyboardSpacer from 'react-native-keyboard-spacer';
// import AutogrowInput from 'react-native-autogrow-input';
// import {
//   Image,
//   FlatList,
//   SafeAreaView,
//   Linking,RefreshControl,TouchableWithoutFeedback,
// } from 'react-native';
// import {
//   Container,
//   Header,
//   Content,
//   Left,
//   Button,
//   Body,
//   Right,
//   Title,
//   Footer,
//   Icon,
//   Textarea
// } from 'native-base';
// import moment from 'moment';
// import CommonAlert from '@custom_components/CommonAlert';
// import Hyperlink from 'react-native-hyperlink'
// // create a component
// import { colors, } from '../../common/index';
// import { Dimensions } from 'react-native';
// import commonData from '../../common/data.js';
// var { width, height } = Dimensions.get('window');
// const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
// import styles from './styles';
// import SideMenu from '@custom_components/SideMenu';
// // import FullScreen from '@custom_components/FullScreen';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import { StackActions, NavigationActions } from 'react-navigation';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
// import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'
// import {
//   postApiRequestWithHeaders,errorHandler,
//   clearLocalStorage,
//  socket,
//   video_options,options,openUrl
// } from '../../common/user';
// import SocketIOClient from 'socket.io-client';
// import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
// import Load from 'react-native-loading-gif';
// import { GiftedChat } from 'react-native-gifted-chat'
// import { connect } from "react-redux";
// import CameraScreen from '../../components/camera';
// import Modal from 'react-native-modal';
// import ImagePicker from 'react-native-image-crop-picker';
// import VideoScreen from '../../components/Video';
// import { RNS3 } from 'react-native-aws3';
// import CommonToast from "@custom_components/CommonToast";
// import Video from 'react-native-video';
// import FullScreen from '../../components/FullScreen';
// import crashlytics from '@react-native-firebase/crashlytics';
// const play = require('../../assets/imgs/play.png');
// const phone = require('../../assets/imgs/phone.png');
// const side_menu_black = require('../../assets/imgs/side_menu_black.png');
// const video = require('../../assets/imgs/video_icon.png');
// const camera = require('../../assets/imgs/image_icon.png');
// const send_off = require('../../assets/imgs/send_off.png');
// const send_on = require('../../assets/imgs/send_on.png');
// const CANCEL_INDEX = 0
// const DESTRUCTIVE_INDEX = 4

// //used to make random-sized messages
// function getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// // The actual chat view itself- a ScrollView of BubbleMessages, with an InputBar at the bottom, which moves with the keyboard
//  class TicketChat extends Component {

//   //   onEndReachedCalledDuringMomentum;
// //   is_refresh= false;
// //   socket = SocketIOClient('https://www.askkenapp.com:3000/',{ jsonp : true, secure: true,transports: ['websocket']});
// //    constructor(props) {
// //     super(props);
// //     this.state = {

// //     };
    
// //   }
//   constructor(props) {
//     super(props);
//   is_refresh= false;
//     var loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ac orci augue. Sed fringilla nec magna id hendrerit. Proin posuere, tortor ut dignissim consequat, ante nibh ultrices tellus, in facilisis nunc nibh rutrum nibh.';

//     //create a set number of texts with random lengths. Also randomly put them on the right (user) or left (other person).
//     var numberOfMessages = 20;

//     var messages = [];

//     for(var i = 0; i < numberOfMessages; i++) {
//       var messageLength = getRandomInt(10, 120);

//       var direction = getRandomInt(1, 2) === 1 ? 'right' : 'left';

//       message = loremIpsum.substring(0, messageLength);
//       messages.push({
//         direction: direction,
//         text: message,

//       })
//     }

//     this.state = {
//       messages: [],
//       image_selected: false,
//       uri: '',
//       showCamera: false,
//       showVideo: false,
//       toggle_menu:false,
//       msg:'',
//       isInputFocus:false,
//       img_object:{},
//       page_no:0,
//       iMaxPages:0,
//       show_full_video: false,
//       video_file:'',
//       type: "",
//       show_full_screen: false,
//       full_screen_data:{},
//       show_alert:false,
//       title:'',
//       alert_type:'',
//       alert_desc:'',
//       messages: messages,
//       inputBarText: '',
//     }
//   }

//   callToastFunction = (msg, status) => {
//     setTimeout(() => {
//       this.setState({
//         message: msg,
//         type: status,
//         showCustomToast: true
//       })
//     }, 400);

//     setTimeout(() => {
//       this.setState({
//         showCustomToast: false
//       });
//     }, 3000);
//   }

//     getChatList=()=>{
//     //console.log({chat_room_id:this.props.user.current_ticket.chat_room_id,username: this.props.user.name},"consolesss");
//     let param={};
//     if(this.props.user.current_ticket.assigned_id == null){
//       param={
//         page_no:this.state.page_no,
//         chat_room_id:this.props.user.current_ticket.chat_room_id,
//         number_of_result:25
//       }
//     }else{   
//       param={
//         page_no:this.state.page_no,
//         assigned_id:this.props.user.current_ticket.assigned_id,
//         number_of_result:25
//       }
//     }
//     //console.log(param,"param..")
//     postApiRequestWithHeaders(
//       commonData.api_endpoint.getChatList,
//       param, this.props.user.access_token
//     ).then(
//       data => {
//         //console.log(data,"getChatList");  
//         // this.setState({
//         //   messages:data.chats,
//         //   iMaxPages:data.total_pages
//         // })
//         // this.socket.emit('read_messages', {chat_room_id:this.props.user.current_ticket.chat_room_id,type: this.props.user.user_type,assigned_id:this.props.user.current_ticket.assigned_id});
//         // setTimeout(() => {
//         //   this.GoTo_bottom_function();
//         //   }, 500);
//       },
//       error => {
//       //  this.callToastFunction("error1111", error)
//       //  errorHandler(error, this.props);
//       },
//     );
//   }
//   static navigationOptions = {
//     title: 'Chat',
//   };

//   //fun keyboard stuff- we use these to get the end of the ScrollView to "follow" the top of the InputBar as the keyboard rises and falls
//   componentWillMount () {
//     this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
//     this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
//   }

//   componentWillUnmount() {
//     this.keyboardDidShowListener.remove();
//     this.keyboardDidHideListener.remove();
//   }

//   //When the keyboard appears, this gets the ScrollView to move the end back "up" so the last message is visible with the keyboard up
//   //Without this, whatever message is the keyboard's height from the bottom will look like the last message.
//   keyboardDidShow (e) {
//     this.scrollView.scrollToEnd();
//   }

//   //When the keyboard dissapears, this gets the ScrollView to move the last message back down.
//   keyboardDidHide (e) {
//     this.scrollView.scrollToEnd();
//   }

//   //scroll to bottom when first showing the view
//   componentDidMount() {
//     crashlytics().log('User signed in.');
//     this.getChatList();
//     setTimeout(function() {
//       this.scrollView.scrollToEnd();
//     }.bind(this))
//   }

//   //this is a bit sloppy: this is to make sure it scrolls to the bottom when a message is added, but 
//   //the component could update for other reasons, for which we wouldn't want it to scroll to the bottom.
//   componentDidUpdate() {
//     setTimeout(function() {
//       this.scrollView.scrollToEnd();
//     }.bind(this))
//   }

//   _sendMessage() {
//     crashlytics().crash();
//     this.state.messages.push({direction: "right", text: this.state.inputBarText});

//     this.setState({
//       messages: this.state.messages,
//       inputBarText: ''
//     });
//   }

//   _onChangeInputBarText(text) {
//     this.setState({
//       inputBarText: text
//     });
//   }

//   //This event fires way too often.
//   //We need to move the last message up if the input bar expands due to the user's new message exceeding the height of the box.
//   //We really only need to do anything when the height of the InputBar changes, but AutogrowInput can't tell us that.
//   //The real solution here is probably a fork of AutogrowInput that can provide this information.
//   _onInputSizeChange() {
//     setTimeout(function() {
//       this.scrollView.scrollToEnd({animated: false});
//     }.bind(this))
//   }
//   showStaticMsg =()=>{
//     return(
//       <View>
//       <View style={[this.props.user.user_type=="owner"? styles.receiverView: styles.senderView,{paddingLeft:20, }]}>
    
//   </View>  
//   {this.props.user.user_type=="owner"&&(
//           <View style={[ this.props.user.user_type=="expert"? styles.receiverView: styles.senderView,{paddingLeft:20, marginRight:30 }]}>
//               <View style={[styles.profile_container, {}]}>
//               <Image
//                   style={[styles.chatImage, { alignSelf:'flex-end', marginRight:10}]}
//                   resizeMode="cover"
//                   source={require("../../assets/imgs/default_profile.png")} />
//                     <View style={[this.props.user.user_type!="expert"? styles.senderMessageBox:styles.receiverMessageBox,{backgroundColor:colors.BLACK_TEXT, }]}>
//                     <Hyperlink linkDefault={ true }
//                     linkStyle={ { color: '#34B7F1', } }
//                     >
//                       <Text style={[this.props.user.user_type!="expert"? styles.sendermessage: styles.message,{color:colors.LIGHT_COLOR}]}>Hi {this.props.user.name}! Stay tuned, we're finding you the perfect Pro. You will be notified when they join the chat...</Text>
//                       </Hyperlink>     
//                     </View>  
//               </View>
//               <View style={[styles.SubTextContainer, {marginLeft:40}]}>
//                   <Text style={styles.subText}><Text style={{ fontFamily: 'Avenir-Heavy', }}>Ask Ken </Text> {moment(moment().format("YYYY-MM-DD")).isSame(moment(this.props.user.current_ticket.created_at).format("YYYY-MM-DD")) ? "Today "+moment(this.props.user.current_ticket.created_at).format("h:mma"):
//                   moment(this.props.user.current_ticket.created_at).format("MMM DD, h:mma")}</Text>
//               </View>  
//           </View>
//   )}
//   </View>
//     )
//   }
//   _renderChat = (data,key) => {
//     return(
//       <View style={{paddingTop:key == 0 ? 80:0 }}>  
//          <View style={[this.props.user.user_id ==data.sender_id? styles.receiverView:styles.senderView,this.props.user.user_id !=data.sender_id? {paddingLeft:20}:{}]}>
//          <View style={[styles.messageContainer,{}]}>
//            {data.type=="text" && this.props.user.user_id !=data.sender_id && (this.props.user.user_id !=data.sender_id && this.props.user.user_type=="owner" ) &&(
//                   <View style={[styles.profile_container, {}]}>
//                 {this.props.user.user_type!="expert" && (
//                   <Image style={[styles.chatImage, { alignSelf:'flex-end', marginRight:10}]}
//                       resizeMode="contain" 
//                       source={{ uri: commonData.profile_picture_url+data.profile_image}}
//                         />
//                 )}
//                   <View style={ this.props.user.user_type=="owner" && this.props.user.user_id ==data.sender_id? styles.receiverMessageContainer :{}}>
//                   <View style={[this.props.user.user_id ==data.sender_id? styles.receiverMessageBox:styles.senderMessageBox,{ minWidth: 130 }]}>
//                               <Hyperlink linkDefault={ true } linkStyle={ { color: '#34B7F1', } }
//                               >
//                                  <Text style={this.props.user.user_id ==data.sender_id? styles.message: styles. sendermessage}>{data.msg}</Text>    
//                               </Hyperlink>
//                         </View>
//                         </View>
//                 </View>
//            )}
//               {data.type=="text" && ((this.props.user.user_id ==data.sender_id) || (this.props.user.user_id !=data.sender_id && this.props.user.user_type=="expert" )) &&(
//                   <View style={ this.props.user.user_type=="owner" && this.props.user.user_id ==data.sender_id? styles.receiverMessageContainer :{}}>
//                   <View style={[this.props.user.user_id ==data.sender_id? styles.receiverMessageBox:styles.senderMessageBox,{ minWidth: 130 }]}>
//                               <Hyperlink linkDefault={ true } linkStyle={ { color: '#34B7F1', } }
//                               >
//                                  <Text style={this.props.user.user_id ==data.sender_id? styles.message: styles. sendermessage}>{data.msg}</Text>    

//                               </Hyperlink>
//                         </View>
//                         </View>         
//            )}
//              {data.type!="text" && this.props.user.user_id !=data.sender_id && (this.props.user.user_id !=data.sender_id && this.props.user.user_type=="owner" ) &&(
//                 <View style={[styles.profile_container, {}]}>
//                    {this.props.user.user_id !=data.sender_id && this.props.user.user_type=="owner"&&(
//                       <Image style={[styles.chatImage, { alignSelf:'flex-end', marginRight:10}]}
//                       resizeMode="cover" 
//                       source={{ uri: commonData.profile_picture_url+data.profile_image}}
//                         />
//                   )}
//                    <View style={{ alignItems:  this.props.user.user_type=="owner"? 'flex-end':null}}>
//                         {data.type !="photo" && (
//                          <TouchableWithoutFeedback onPress={() => this.navigator('view_photo', data)} style={{flex:1, justifyContent:'center', alignItems:'center', zIndex:3, width: width-40}}>
//                          <View style={{}}>
                          
//                              <Image source={play} style={{zIndex:1, height:50, width:50, top:"35%", position:'absolute', alignSelf:'center'}} />
//                              <Video 
//                        paused={"true"}
//                        resizeMode="cover"
//                        source={{ uri: data.url }}
//                        style={[styles.backgroundVideo,{ marginBottom:0}]} /> 

//                          </View>
//                          </TouchableWithoutFeedback>
//                         )}
//                         {data.type =="photo" && (
//                               <TouchableWithoutFeedback onPress={() => this.navigator('view_photo', data)} style={{flex:1, justifyContent:'center', alignItems:'center', zIndex:3, width: width-40}}>
//                             <Image
//                             style={[styles.backgroundVideo,{ marginBottom:0}]} 
//                                 resizeMode="cover"
//                                 source={{
//                                   uri:data.url
//                                 }} />  
//                               </TouchableWithoutFeedback>
//                         )}  
                         
//                         </View>     
//                  </View>
              
//        )}    
//            {data.type!="text"&& ((this.props.user.user_id ==data.sender_id) || (this.props.user.user_id !=data.sender_id && this.props.user.user_type=="expert" )) &&(
//                         <View style={{ alignItems:  this.props.user.user_type=="owner"? 'flex-end':null}}>
//                         {data.type !="photo" && (
//                             <TouchableWithoutFeedback onPress={() => this.navigator('view_photo', data)} style={{flex:1, justifyContent:'center', alignItems:'center', zIndex:3, width: width-40}}>
//                           <View style={{}}>  
//                               <Image source={play} style={{zIndex:1, height:50, width:50, top:"35%", position:'absolute', alignSelf:'center'}} />
//                               <Video 
//                         paused={"true"}
//                         resizeMode="cover"
//                         source={{ uri: data.url }}
//                         style={[styles.backgroundVideo,{ marginBottom:0}]} /> 

//                           </View>
//                           </TouchableWithoutFeedback>
                      
//                         )}
//                         {data.type =="photo" && (
//                             <TouchableWithoutFeedback onPress={() => this.navigator('view_photo', data)} style={{}}>
//                               <Image
//                               style={[styles.backgroundVideo,{ marginBottom:0}]} 
//                                   resizeMode="cover"
//                                   source={{
//                                     uri:data.url
//                                   }} />  
//                              </TouchableWithoutFeedback>
//                         )}
//                         </View>     
//             )}  
//      </View>
//         <View style={[styles.SubTextContainer, {marginLeft:this.props.user.user_type=="owner" ? 40:0}]}>
//                   <Text style={styles.subText}><Text style={{ fontFamily: 'Avenir-Heavy', }}>{this.props.user.user_id ==data.sender_id ?"Me ":data.sender_name+' '}</Text>
//                   {moment(moment().format("YYYY-MM-DD")).isSame(moment(data.createdAt).format("YYYY-MM-DD")) ? "Today "+moment(data.createdAt).format("h:mma"):
//                   moment(data.createdAt).format("MMM DD, h:mma")}</Text>
//               </View>  
//          </View> 

//          {key == 1 && this.props.user.user_type=="owner"&& this.state.page_no == this.state.iMaxPages && this.state.page_no=="0"&&(
//            this.showStaticMsg()
//          )}  
//       </View>
//     )
//   }

//   render() {

//     var messages = [];

//     this.state.messages.forEach(function(message, index) {
//       messages.push(
//           <MessageBubble key={index} direction={message.direction} text={message.text}/>
//         );
//     });

//     return (
//       <Container>
//         {this.props.user.user_type=="expert" &&(
//             <Header transparent style={[styles.header,{}]}>
//             <Left style={{ flex: 0.5, paddingLeft: 4, }}>
//             <Button
//                         transparent
//                         hitSlop={hitSlop}
//                         onPress={() =>this.navigator("back")}>    
//                         <Icon
//                             style={[
//                                 styles.black_text,
//                             ]}
//                             name="arrow-back"
//                         />
//                     </Button>
//              </Left>
//             <Body>
//               <Text style={[styles.pageTitle,{ flex: 3,flexShrink: 1, } ]}>{this.props.user.user_type=="expert"? this.props.user.current_ticket.owner_name+' - ':this.props.user.current_ticket.expert_name!= null ? this.props.user.current_ticket.expert_name+' - ':''}<Text style={{ color: colors.grey_heading }}>{this.props.user.current_ticket.category_name}</Text></Text>
//             </Body>
//             <Right style={{ flex: 0.5, paddingLeft: 4 }}>
//               <Button
//                 transparent
//                 onPress={() => this.callbackFunction("call")}>
//                 <Image style={styles.image} source={phone} />
//               </Button>
//               <Button
//                 transparent
//                 onPress={() => this.navigator('side_menu')}>
//                 <Image style={styles.image} source={side_menu_black} />
//               </Button>
//             </Right>
//           </Header>
//         )}
//         {this.props.user.user_type!="expert" &&(
//             <Header transparent style={[styles.header,{}]}>
//             <Left style={{ flex: 4, paddingLeft: 4,flexWrap:'wrap' }}>
//               <Text numberOfLines={1} style={[styles.pageTitle, { flex: 3,flexShrink: 1, }]}>{this.props.user.user_type=="expert"? this.props.user.current_ticket.owner_name : this.props.user.current_ticket.expert_name!= null ? this.props.user.current_ticket.expert_name+' - ':''} <Text style={{ color: colors.grey_heading }}>{this.props.user.current_ticket.category_name}</Text></Text>
//              </Left>
//             <Body>
           
//             </Body>
//             <Right style={{ flex: 0.5, paddingLeft: 4 }}>
//               {this.props.user.current_ticket.assigned_id != null &&(
//                     <Button
//                     transparent
//                     onPress={() => this.callbackFunction("call")}>
//                     <Image style={styles.image} source={phone} />
//                     </Button>
//               )}
//               <Button
//                 transparent
//                 onPress={() => this.navigator('side_menu')}>
//                 <Image style={styles.image} source={side_menu_black} />
//               </Button>
//             </Right>
//           </Header>
//         )}
//                <View style={styles.outer}>
//                   <ScrollView ref={(ref) => { this.scrollView = ref }} style={styles.messages}>
//                     {messages}
//                   </ScrollView>
//                   <InputBar onSendPressed={() => this._sendMessage()} 
//                             onSizeChange={() => this._onInputSizeChange()}
//                             onChangeText={(text) => this._onChangeInputBarText(text)}
//                             text={this.state.inputBarText}/>
//                   <KeyboardSpacer/>             
//               </View>
//       </Container>
           
//             );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     user: state.user.userData
//   }
// }
// export default connect(mapStateToProps, {})(TicketChat);

// //The bubbles that appear on the left or the right for the messages.
// class MessageBubble extends Component {
//   render() {

//     //These spacers make the message bubble stay to the left or the right, depending on who is speaking, even if the message is multiple lines.
//     var leftSpacer = this.props.direction === 'left' ? null : <View style={{maxWidth:width / 1.5,
//       minWidth: 130, minheight:80, }}/>;
//     var rightSpacer = this.props.direction === 'left' ? <View style={{maxWidth:width / 1.5,
//       minWidth: 130, minheight:80,}}/> : null;

//     var bubbleStyles = this.props.direction === 'left' ? [styles.messageBubble, styles.messageBubbleLeft] : [styles.messageBubble, styles.messageBubbleRight];

//     var bubbleTextStyle = this.props.direction === 'left' ? styles.messageBubbleTextLeft : styles.messageBubbleTextRight;

//     return (
   
//         <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
//             {leftSpacer}
//             <View style={bubbleStyles}>
//               <Text style={bubbleTextStyle}>
//                 {this.props.text}
//               </Text>
//             </View>
//             {rightSpacer}
//           </View>
//       );
//   }
// }

// //The bar at the bottom with a textbox and a send button.
// class InputBar extends Component {

//   //AutogrowInput doesn't change its size when the text is changed from the outside.
//   //Thus, when text is reset to zero, we'll call it's reset function which will take it back to the original size.
//   //Another possible solution here would be if InputBar kept the text as state and only reported it when the Send button
//   //was pressed. Then, resetInputText() could be called when the Send button is pressed. However, this limits the ability
//   //of the InputBar's text to be set from the outside.
//   componentWillReceiveProps(nextProps) {
//     if(nextProps.text === '') {
//       this.autogrowInput.resetInputText();
//     }
//   }

//   render() {
//     return (
//           <View style={styles.inputBar}>
//             <AutogrowInput style={styles.textBox}
//                         ref={(ref) => { this.autogrowInput = ref }} 
//                         multiline={true}
//                         defaultHeight={30}
//                         onChangeText={(text) => this.props.onChangeText(text)}
//                         onContentSizeChange={this.props.onSizeChange}
//                         value={this.props.text}/>
//             <TouchableHighlight style={styles.sendButton} onPress={() => this.props.onSendPressed()}>
//                 <Text style={{color: 'white'}}>Send</Text>
//             </TouchableHighlight>
//           </View> 
//           );
//   }
// }






// // class TicketChat extends Component {
// //   onEndReachedCalledDuringMomentum;
// //   is_refresh= false;
// //   socket = SocketIOClient('https://www.askkenapp.com:3000/',{ jsonp : true, secure: true,transports: ['websocket']});
// //    constructor(props) {
// //     super(props);
// //     this.state = {
// //       messages: [],
// //       image_selected: false,
// //       uri: '',
// //       showCamera: false,
// //       showVideo: false,
// //       toggle_menu:false,
// //       msg:'',
// //       isInputFocus:false,
// //       img_object:{},
// //       page_no:0,
// //       iMaxPages:0,
// //       show_full_video: false,
// //       video_file:'',
// //       type: "",
// //       show_full_screen: false,
// //       full_screen_data:{},
// //       show_alert:false,
// //       title:'',
// //       alert_type:'',
// //       alert_desc:''
// //     };
    
// //   }
  
// //   callToastFunction = (msg, status) => {
// //     setTimeout(() => {
// //       this.setState({
// //         message: msg,
// //         type: status,
// //         showCustomToast: true
// //       })
// //     }, 400);

// //     setTimeout(() => {
// //       this.setState({
// //         showCustomToast: false
// //       });
// //     }, 3000);
// //   }

// //   componentDidMount() {
// //     //console.log("did not.t",this.props.user);
// //     this.socket.on('connected', () => {
// //       //console.warn("connected.....");
// //     })

// //     this.socket.on('connect', () => {
// //       //console.log("connect socket...."); // true
// //     }, err=>{
// //       //console.log(err,"socket...")
// //     });
// //     var join_param={
// //       chat_room_id:this.props.user.current_ticket.chat_room_id,username: this.props.user.name
// //     }
// //     this.socket.emit('join_group', {chat_room_id:this.props.user.current_ticket.chat_room_id,username: this.props.user.name});
// //     //console.log(this.props.user.current_ticket,"lll");
// //     this.getChatList();
   
// //    this.socket.on('user_joined', (messages) => {
// //       //console.log("user_joined",messages)
// //     });

// //     this.socket.on('receive_message', (messages) => {
// //       //console.log("socket receive_message message...",messages);
// //       this.is_refresh = false;
// //       this.state.messages.push(messages.message[0]);
// //       this.setState({
// //         messages: this.state.messages
// //       })
// //     });

// //     this.setState({
// //       messages: [ ],        
// //     })
// //     //console.log(this.state, "kkk");
// //   }
// //   getChatList=()=>{
// //     //console.log({chat_room_id:this.props.user.current_ticket.chat_room_id,username: this.props.user.name},"consolesss");
// //     let param={};
// //     if(this.props.user.current_ticket.assigned_id == null){
// //       param={
// //         page_no:this.state.page_no,
// //         chat_room_id:this.props.user.current_ticket.chat_room_id,
// //         number_of_result:25
// //       }
// //     }else{   
// //       param={
// //         page_no:this.state.page_no,
// //         assigned_id:this.props.user.current_ticket.assigned_id,
// //         number_of_result:25
// //       }
// //     }
// //     //console.log(param,"param..")
// //     postApiRequestWithHeaders(
// //       commonData.api_endpoint.getChatList,
// //       param, this.props.user.access_token
// //     ).then(
// //       data => {
// //         //console.log(data,"getChatList");  
// //         this.setState({
// //           messages:data.chats,
// //           iMaxPages:data.total_pages
// //         })
// //         this.socket.emit('read_messages', {chat_room_id:this.props.user.current_ticket.chat_room_id,type: this.props.user.user_type,assigned_id:this.props.user.current_ticket.assigned_id});
// //         setTimeout(() => {
// //           this.GoTo_bottom_function();
// //           }, 500);
// //       },
// //       error => {
// //       //  this.callToastFunction("error1111", error)
// //       //  errorHandler(error, this.props);
// //       },
// //     );
// //   }
// //   chooseAction = action => {
// //     switch (action) {
// //       case 'gallery': {
// //         //console.log('clik gallery');
// //         check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
// //           //console.log(result, 'result');
// //           switch (result) {
// //             case RESULTS.DENIED:
// //               //console.log('deny case call');
// //               request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
// //                 //console.log(result, 'resul1111t');
// //                 if(RESULTS.GRANTED == result){
// //                   ImagePicker.openPicker({
// //                     mediaType: 'photo',
// //                     cropping: true,
// //                     cropperChooseText: 'Next',
// //                     compressImageQuality: 0.8,
// //                     cropperToolbarTitle: 'Crop',
// //                     cropperCircleOverlay: false,
// //                     includeBase64: false,
// //                     cropperToolbarTitle: 'Move and Scale',
// //                     avoidEmptySpaceAroundImage: true,
// //                   }).then(
// //                     image => {
// //                       //console.log(image,"Image");
// //                       var file_name = Date.now() +image.filename;
// //                       image.file_name= file_name;
// //                       this.setState({ image_selected: true, uri: 'data:image/jpeg;base64,' + image.data,img_object:image });
// //                       this.state.messages.push({
// //                         id: 4,
// //                         url: "file://"+image.path,
// //                         sender_id:'1',
// //                         type:'photo',
// //                         createdAt: new Date(),
// //                         profile_image: this.props.user.profile_image,
// //                       });
// //                      this.setState({messages: this.state.messages})    
// //                       setTimeout(() => {
// //                         this.GoTo_bottom_function();
// //                       }, 1000);
// //                       this.uploadPhoto(); 
// //                     },
// //                     error => {
// //                       this.setState({ disabled: false });
// //                       //console.log(error, 'eroro');
// //                     },
// //                   );

// //                 }
               
// //               });

// //               break;
// //             case RESULTS.GRANTED:
// //               ImagePicker.openPicker({
// //                 mediaType: 'photo',
// //                 cropping: true,
// //                 cropperChooseText: 'Next',
// //                 compressImageQuality: 0.8,
// //                 cropperToolbarTitle: 'Crop',
// //                 cropperCircleOverlay: false,
// //                 includeBase64: false,
// //                 cropperToolbarTitle: 'Move and Scale',
// //                 avoidEmptySpaceAroundImage: true,
// //               }).then(
// //                 image => {  
// //                     //console.log(image,"Image");
// //                     var file_name = Date.now() +image.filename;
// //                     image.file_name= file_name;
// //                     this.setState({ image_selected: true, uri: 'data:image/jpeg;base64,' + image.data,img_object:image });
// //                     this.state.messages.push({
// //                       id: 4,
// //                       url: "file://"+image.path,
// //                       sender_id:this.props.user.user_id,
// //                       type:'photo',
// //                       createdAt: new Date(),
// //                       profile_image:this.props.user.profile_image,
// //                     });
// //                    this.setState({messages: this.state.messages})    
// //                     setTimeout(() => {
// //                       this.GoTo_bottom_function();
// //                     }, 1000);
// //                     this.uploadPhoto();        
// //                 },
// //                 error => {
// //                   this.setState({ disabled: false });
// //                   //console.log(error, 'eroro');
// //                 },
// //               );
// //               break;
// //             case RESULTS.BLOCKED:
// //               alertWithTwoBtn(
// //                 'Permission Required',
// //                 commonData.ToastMessages.access_gallery,
// //                 'Not Now',
// //                 'Open Settings',
// //               ).then(data => {
// //                 //console.log(data);
// //                 if (data) {
// //                   Linking.openSettings();
// //                 }
// //               });
// //           }
// //         });

// //         break;
// //       }

// //       default:
// //         break;
// //     }
// //   };

// setImages = (data) => {
//     //console.log(data, "set Images...","file://"+data.uri.path);
//     this.setState({ showCamera: false });
//     var file_name = Date.now() +data.uri.filename;
//     data.uri.file_name= file_name;
//     this.setState({img_object:data.uri });
//     this.state.messages.push({
//       id: 4,
//       url: "file://"+data.uri.path,
//       sender_id:this.props.user.user_id,
//       type:'photo',
//       createdAt: new Date(),
//       profile_image:this.props.user.profile_image,
//     });
//    this.setState({messages: this.state.messages})    
//     setTimeout(() => {
//       this.GoTo_bottom_function();
//     }, 1000);
//     this.uploadPhoto();  
    
//   }
//   getActionSheetRef = ref => (this.actionSheet = ref);
//   showActionSheet = () => {
//     this.actionSheet.show()
//   }

//   getVideoActionSheetRef = ref => (this.video_actionSheet = ref);
//   showVideoActionSheet = () => {
//     this.video_actionSheet.show()
//   }
//   setVideo = (data) => {
//     //console.log(data, "set Images...");
//     this.setState({ showVideo: false, image_selected: true, uri: data.uri, type: 'video' });
//   }
//   onLoad = (data) => {
//     //console.log(data, "onLoad");
//     if (data.duration > 15) {
//       setTimeout(() => {
//         this.setState({
//           message: commonData.ToastMessages.video_duration,
//           type: "error",
//           showCustomToast: true
//         })
//       }, 100);

//       setTimeout(() => {
//         this.setState({
//           showCustomToast: false
//         });
//       }, 3000);
//     } else {
//       this.setState({ showCamera: false ,type:''});
//       this.uploadVideo(); 
//       this.state.messages.push({
//         id: 4,
//         url: "file://"+this.state.uri,
//         sender_id:this.props.user.user_id,
//         type:'video',
//         createdAt: new Date(),
//         profile_image:this.props.user.profile_image,
//       });
//      this.setState({messages: this.state.messages})    
//       setTimeout(() => {
//         this.GoTo_bottom_function();
//       }, 1000);
     
//     }
//   };
//   handleImagePress = index => {
//     if (index == 2) {
//       setTimeout(() => {
//         this.chooseAction("gallery")
//       }, 200);
//     }
//     else if (index == 1) {
//       this.setState({ showCamera: true });
//     }
//   }

//   navigator = (navigateTo,data) => {
//     switch (navigateTo) {
//       case "image": 
//         this.showActionSheet();
//         break;
//       case "video":
//         this.showVideoActionSheet();
//         break;
//       case 'back': {
//         //console.log(this.props.navigation)
//         //console.log(this.props)
//         this.socket.emit('leave_group', {chat_room_id:this.props.user.current_ticket.chat_room_id,username: this.props.user.name});
//         this.socket.emit('read_messages', {chat_room_id:this.props.user.current_ticket.chat_room_id,type: this.props.user.user_type,assigned_id:this.props.user.current_ticket.assigned_id});
//         if(this.props.navigation.state.params != undefined){
//           this.props.navigation.state.params.onGoBack();
//         }
//         this.props.navigation.goBack();
//         break;
//       }
//       case 'skip': {
//         this.setState({
//           showCamera: false,
//           showVideo: false
//         })
//         break;
//       }
//       case 'hide':{
//         this.props.parentCallback('hide');
//         break;
//       }
//       case 'logout': {
//         const param = {
//           user_id: this.props.user.user_id,
//         };
//         postApiRequestWithHeaders(commonData.api_endpoint.log_out, param,this.props.user.access_token).then(
//           data => {
//             this.logOutFunc();
//           },
//           error => {
//             this.logOutFunc();
//             // errorHandler(error, this.props);
//           },
//         );
//         break;
//       }
//       case 'side_menu':{
//         this.setState({ toggle_menu: true });
//         break;
//       }
//       case 'send':{
//         setTimeout(() => {
//           //console.log("focus calling..")
//           this.textInputRef1.focus();
//         }, 500);
        
//         if(this.state.msg.trim() !=""){
//           this.sendMessage();
//         }
//         break;
//       }
//       case "play": {
//         if(data != undefined){
//           this.setState({video_file:data.url},()=>{
//             this.setState({show_full_video: !this.state.show_full_video})
//            })   
//         }else{
//           this.setState({show_full_video: !this.state.show_full_video})
//         } 
//         break; 
//       }
//       case "view_photo": {
//       console.log("view photo...",data);
//       this.setState({
//          full_screen_data:data, 
//         show_full_screen: true})
//         break; 
//       }

      
//     }
//   };
// /**
//    * Log Out User
//    */
//   logOutFunc = () => {
//     clearLocalStorage('user_details').then(data => {
//       const resetAction = StackActions.reset({
//         index: 0,
//         actions: [NavigationActions.navigate({ routeName: 'SelectUser' })],
//       });
//       this.props.navigation.dispatch(resetAction);
//     });
//   };
  
//   chooseVideoAction = action => {
//     //console.log("hooose video")
//     switch (action) {
//       case 'gallery': {
//         //console.log('clik gallery');
//         check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
//           //console.log(result, 'result');
//           switch (result) {
//             case RESULTS.DENIED:
//               //console.log('deny case call');
//               request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
//                 if(result == RESULTS.GRANTED){
//                   //console.log(result, 'resul1111t');
//                   ImagePicker.openPicker({
//                     title: 'Video Picker',
//                     mediaType: 'video',
//                     storageOptions: {
//                       skipBackup: true,
//                       path: 'images'
//                     }
//                   }).then(
//                     image => {
//                       //console.log("video selects", image)
//                       this.setVideo({ uri: image.path });
//                     },
//                     error => {
//                       this.setState({ disabled: false });
//                       //console.log(error, 'eroro');
//                     },
//                   );       
//                 }             
//               });
//               break;
//             case RESULTS.GRANTED:
//               ImagePicker.openPicker({
//                 title: 'Video Picker',
//                 mediaType: 'video',
//                 storageOptions: {
//                   skipBackup: true,
//                   path: 'images'
//                 }
//               }).then(
//                 image => {
//                   //console.log("video selects", image);
//                   this.setVideo({ uri: image.path });
//                 },
//                 error => {
//                   this.setState({ disabled: false });
//                   //console.log(error, 'eroro');
//                 },
//               );
//               break;
//             case RESULTS.BLOCKED:
//               alertWithTwoBtn(
//                 'Permission Required',
//                 commonData.ToastMessages.access_gallery,
//                 'Not Now',
//                 'Open Settings',
//               ).then(data => {
//                 //console.log(data);
//                 if (data) {
//                   Linking.openSettings();
//                 }
//               });
//             //     break;
//           }
//         });

//         break;
//       }

//       default:
//         break;
//     }
//   };

//   handleVideoPress = index => {
//     //console.log(index, "index")
//     // this.setState({ selected: index });
//     if (index == 2) {
//       setTimeout(() => {
//         this.chooseVideoAction("gallery")
//       }, 500);
//     }
//     else if (index == 1) {
//       this.setState({ showVideo: true });
//     }
//   }

//   GoTo_bottom_function =()=>{
//     ////console.log(this.refs.ListView_Reference,"this.refs.ListView_Reference...")
//     //this.refs.ListView_Reference.scrollToEnd({animated: true});
//  }
// //   showStaticMsg =()=>{
// //     return(
// //       <View>
// //       <View style={[this.props.user.user_type=="owner"? styles.receiverView: styles.senderView,{paddingLeft:20, }]}>
    
// //   </View>  
// //   {this.props.user.user_type=="owner"&&(
// //           <View style={[ this.props.user.user_type=="expert"? styles.receiverView: styles.senderView,{paddingLeft:20, marginRight:30 }]}>
// //               <View style={[styles.profile_container, {}]}>
// //               <Image
// //                   style={[styles.chatImage, { alignSelf:'flex-end', marginRight:10}]}
// //                   resizeMode="cover"
// //                   source={require("../../assets/imgs/default_profile.png")} />
// //                     <View style={[this.props.user.user_type!="expert"? styles.senderMessageBox:styles.receiverMessageBox,{backgroundColor:colors.BLACK_TEXT, }]}>
// //                     <Hyperlink linkDefault={ true }
// //                     linkStyle={ { color: '#34B7F1', } }
// //                     >
// //                       <Text style={[this.props.user.user_type!="expert"? styles.sendermessage: styles.message,{color:colors.LIGHT_COLOR}]}>Hi {this.props.user.name}! Stay tuned, we're finding you the perfect Pro. You will be notified when they join the chat...</Text>
// //                       </Hyperlink>     
// //                     </View>  
// //               </View>
// //               <View style={[styles.SubTextContainer, {marginLeft:40}]}>
// //                   <Text style={styles.subText}><Text style={{ fontFamily: 'Avenir-Heavy', }}>Ask Ken </Text> {moment(moment().format("YYYY-MM-DD")).isSame(moment(this.props.user.current_ticket.created_at).format("YYYY-MM-DD")) ? "Today "+moment(this.props.user.current_ticket.created_at).format("h:mma"):
// //                   moment(this.props.user.current_ticket.created_at).format("MMM DD, h:mma")}</Text>
// //               </View>  
// //           </View>
// //   )}
// //   </View>
// //     )
// //   }
//   _renderChat = (data,key) => {
//     return(
//       <View style={{paddingTop:key == 0 ? 80:0 }}>  
//          <View style={[this.props.user.user_id ==data.sender_id? styles.receiverView:styles.senderView,this.props.user.user_id !=data.sender_id? {paddingLeft:20}:{}]}>
//          <View style={[styles.messageContainer,{}]}>
//            {data.type=="text" && this.props.user.user_id !=data.sender_id && (this.props.user.user_id !=data.sender_id && this.props.user.user_type=="owner" ) &&(
//                   <View style={[styles.profile_container, {}]}>
//                 {this.props.user.user_type!="expert" && (
//                   <Image style={[styles.chatImage, { alignSelf:'flex-end', marginRight:10}]}
//                       resizeMode="contain" 
//                       source={{ uri: commonData.profile_picture_url+data.profile_image}}
//                         />
//                 )}
//                   <View style={ this.props.user.user_type=="owner" && this.props.user.user_id ==data.sender_id? styles.receiverMessageContainer :{}}>
//                   <View style={[this.props.user.user_id ==data.sender_id? styles.receiverMessageBox:styles.senderMessageBox,{ minWidth: 130 }]}>
//                               <Hyperlink linkDefault={ true } linkStyle={ { color: '#34B7F1', } }
//                               >
//                                  <Text style={this.props.user.user_id ==data.sender_id? styles.message: styles. sendermessage}>{data.msg}</Text>    
//                               </Hyperlink>
//                         </View>
//                         </View>
//                 </View>
//            )}
//               {data.type=="text" && ((this.props.user.user_id ==data.sender_id) || (this.props.user.user_id !=data.sender_id && this.props.user.user_type=="expert" )) &&(
//                   <View style={ this.props.user.user_type=="owner" && this.props.user.user_id ==data.sender_id? styles.receiverMessageContainer :{}}>
//                   <View style={[this.props.user.user_id ==data.sender_id? styles.receiverMessageBox:styles.senderMessageBox,{ minWidth: 130 }]}>
//                               <Hyperlink linkDefault={ true } linkStyle={ { color: '#34B7F1', } }
//                               >
//                                  <Text style={this.props.user.user_id ==data.sender_id? styles.message: styles. sendermessage}>{data.msg}</Text>    

//                               </Hyperlink>
//                         </View>
//                         </View>         
//            )}
//              {data.type!="text" && this.props.user.user_id !=data.sender_id && (this.props.user.user_id !=data.sender_id && this.props.user.user_type=="owner" ) &&(
//                 <View style={[styles.profile_container, {}]}>
//                    {this.props.user.user_id !=data.sender_id && this.props.user.user_type=="owner"&&(
//                       <Image style={[styles.chatImage, { alignSelf:'flex-end', marginRight:10}]}
//                       resizeMode="cover" 
//                       source={{ uri: commonData.profile_picture_url+data.profile_image}}
//                         />
//                   )}
//                    <View style={{ alignItems:  this.props.user.user_type=="owner"? 'flex-end':null}}>
//                         {data.type !="photo" && (
//                          <TouchableWithoutFeedback onPress={() => this.navigator('view_photo', data)} style={{flex:1, justifyContent:'center', alignItems:'center', zIndex:3, width: width-40}}>
//                          <View style={{}}>
                          
//                              <Image source={play} style={{zIndex:1, height:50, width:50, top:"35%", position:'absolute', alignSelf:'center'}} />
//                              <Video 
//                        paused={"true"}
//                        resizeMode="cover"
//                        source={{ uri: data.url }}
//                        style={[styles.backgroundVideo,{ marginBottom:0}]} /> 

//                          </View>
//                          </TouchableWithoutFeedback>
//                         )}
//                         {data.type =="photo" && (
//                               <TouchableWithoutFeedback onPress={() => this.navigator('view_photo', data)} style={{flex:1, justifyContent:'center', alignItems:'center', zIndex:3, width: width-40}}>
//                             <Image
//                             style={[styles.backgroundVideo,{ marginBottom:0}]} 
//                                 resizeMode="cover"
//                                 source={{
//                                   uri:data.url
//                                 }} />  
//                               </TouchableWithoutFeedback>
//                         )}  
                         
//                         </View>     
//                  </View>
              
//        )}    
//            {data.type!="text"&& ((this.props.user.user_id ==data.sender_id) || (this.props.user.user_id !=data.sender_id && this.props.user.user_type=="expert" )) &&(
//                         <View style={{ alignItems:  this.props.user.user_type=="owner"? 'flex-end':null}}>
//                         {data.type !="photo" && (
//                             <TouchableWithoutFeedback onPress={() => this.navigator('view_photo', data)} style={{flex:1, justifyContent:'center', alignItems:'center', zIndex:3, width: width-40}}>
//                           <View style={{}}>  
//                               <Image source={play} style={{zIndex:1, height:50, width:50, top:"35%", position:'absolute', alignSelf:'center'}} />
//                               <Video 
//                         paused={"true"}
//                         resizeMode="cover"
//                         source={{ uri: data.url }}
//                         style={[styles.backgroundVideo,{ marginBottom:0}]} /> 

//                           </View>
//                           </TouchableWithoutFeedback>
                      
//                         )}
//                         {data.type =="photo" && (
//                             <TouchableWithoutFeedback onPress={() => this.navigator('view_photo', data)} style={{}}>
//                               <Image
//                               style={[styles.backgroundVideo,{ marginBottom:0}]} 
//                                   resizeMode="cover"
//                                   source={{
//                                     uri:data.url
//                                   }} />  
//                              </TouchableWithoutFeedback>
//                         )}
//                         </View>     
//             )}  
//      </View>
//         <View style={[styles.SubTextContainer, {marginLeft:this.props.user.user_type=="owner" ? 40:0}]}>
//                   <Text style={styles.subText}><Text style={{ fontFamily: 'Avenir-Heavy', }}>{this.props.user.user_id ==data.sender_id ?"Me ":data.sender_name+' '}</Text>
//                   {moment(moment().format("YYYY-MM-DD")).isSame(moment(data.createdAt).format("YYYY-MM-DD")) ? "Today "+moment(data.createdAt).format("h:mma"):
//                   moment(data.createdAt).format("MMM DD, h:mma")}</Text>
//               </View>  
//          </View> 

//          {key == 1 && this.props.user.user_type=="owner"&& this.state.page_no == this.state.iMaxPages && this.state.page_no=="0"&&(
//            this.showStaticMsg()
//          )}  
//       </View>
//     )
//   }


//   popUpClick =(data)=>{
//     this.setState({
//       show_alert:false
//     })
//     console.log(data)
//   }
  
//   render() {
//     return (
//       <Container keyboardShouldPersistTaps='always'>
//          {this.state.showCustomToast ? (
//           <View style={{
//             position: "absolute",
//             bottom: 0,
//             zIndex: 2
//           }}>
//             <CommonToast type={this.state.type} message={this.state.message} />
//           </View>
//         ) : null
//         }
//           {this.state.show_alert && (
//           <View style={{
//             zIndex: 10,
//             position: 'absolute',
//             left: 0,
//             bottom: 0,
//             width: width,
//             height: height,
//           }}>
//             <CommonAlert clickHandler={this.popUpClick} type={this.state.alert_type} title={this.state.title} msg={this.state.alert_desc}></CommonAlert>
//           </View>
//         )}
//         <Load ref="Load" Image={0}></Load>
//         {this.props.user.user_type=="expert" &&(
//             <Header transparent style={[styles.header,{}]}>
//             <Left style={{ flex: 0.5, paddingLeft: 4, }}>
//             <Button
//                         transparent
//                         hitSlop={hitSlop}
//                         onPress={() =>this.navigator("back")}>    
//                         <Icon
//                             style={[
//                                 styles.black_text,
//                             ]}
//                             name="arrow-back"
//                         />
//                     </Button>
//              </Left>
//             <Body>
//               <Text style={[styles.pageTitle,{ flex: 3,flexShrink: 1, } ]}>{this.props.user.user_type=="expert"? this.props.user.current_ticket.owner_name+' - ':this.props.user.current_ticket.expert_name!= null ? this.props.user.current_ticket.expert_name+' - ':''}<Text style={{ color: colors.grey_heading }}>{this.props.user.current_ticket.category_name}</Text></Text>
//             </Body>
//             <Right style={{ flex: 0.5, paddingLeft: 4 }}>
//               <Button
//                 transparent
//                 onPress={() => this.callbackFunction("call")}>
//                 <Image style={styles.image} source={phone} />
//               </Button>
//               <Button
//                 transparent
//                 onPress={() => this.navigator('side_menu')}>
//                 <Image style={styles.image} source={side_menu_black} />
//               </Button>
//             </Right>
//           </Header>
//         )}

//        {this.props.user.user_type!="expert" &&(
//             <Header transparent style={[styles.header,{}]}>
//             <Left style={{ flex: 4, paddingLeft: 4,flexWrap:'wrap' }}>
//               <Text numberOfLines={1} style={[styles.pageTitle, { flex: 3,flexShrink: 1, }]}>{this.props.user.user_type=="expert"? this.props.user.current_ticket.owner_name : this.props.user.current_ticket.expert_name!= null ? this.props.user.current_ticket.expert_name+' - ':''} <Text style={{ color: colors.grey_heading }}>{this.props.user.current_ticket.category_name}</Text></Text>
//              </Left>
//             <Body>
           
//             </Body>
//             <Right style={{ flex: 0.5, paddingLeft: 4 }}>
//               {this.props.user.current_ticket.assigned_id != null &&(
//                     <Button
//                     transparent
//                     onPress={() => this.callbackFunction("call")}>
//                     <Image style={styles.image} source={phone} />
//                     </Button>
//               )}
//               <Button
//                 transparent
//                 onPress={() => this.navigator('side_menu')}>
//                 <Image style={styles.image} source={side_menu_black} />
//               </Button>
//             </Right>
//           </Header>
//         )}
//     <View style={{flex:1,}}>
//         <KeyboardAwareScrollView
//            ref='ListView_Reference1'
//             contentContainerStyle={[{ flex: 1, justifyContent:'flex-end', marginTop:5}]}
//             keyboardDismissMode="on-drag"
//             keyboardShouldPersistTaps={'always'}
//             showsVerticalScrollIndicator={false}
//             refreshControl={
//               <RefreshControl refreshing={false} onRefresh={()=>{
//                 //console.log("hit API for paginition...");
//                // this.onRefresh()
//                   if (parseInt(this.state.page_no) < parseInt(this.state.iMaxPages)) {
//                   //console.log("hit API for paginition...");
//                   this.setState({page_no: parseInt(this.state.page_no)+1},()=>{
//                     this.is_refresh = true
//                     this.getMoreChatList();
//                   })
//                 }
//               }} />
//             }  
//            alwaysBounceVertical={false}
//             >
//           {this.state.uri != '' && this.state.type == "video" && (
//                 <Video source={{ uri: this.state.uri }}
//                   onLoad={this.onLoad}
//                   paused={true} />
//          )}

//          <View style={{}}>
//          <FlatList  
//         alwaysBounceVertical={false}
//         // initialScrollIndex={this.state.messages.length -1}
//         // getItemLayout={(data, index) => (
//         //   {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
//         // )}
//         //keyboardDismissMode="on-drag"
//         style={{marginBottom:10,}}
//        // keyboardShouldPersistTaps={'always'}
//         showsVerticalScrollIndicator={false}
//            ref='ListView_Reference'
//           //  onContentSizeChange={()=> {
//           //    setTimeout(() => {
//           //      if(this.refs.ListView_Reference != undefined && this.is_refresh== false){
//           //       this.refs.ListView_Reference.scrollToEnd()
//           //      }  
//           //    }, 500);    
//           //   }}
//             data={this.state.messages}
//             renderItem={({ item, index }) => (
//               this._renderChat(item,index)
//             )}
//             refreshing={false}
//             refreshControl={
//               <RefreshControl refreshing={false} onRefresh={()=>{
//                 console.log("hit API for paginition...",this.state.page_no,this.state.iMaxPages);
//                   if (parseInt(this.state.page_no) < parseInt(this.state.iMaxPages)) {
//                   console.log("hit API for paginition...");
//                   this.setState({page_no: parseInt(this.state.page_no)+1},()=>{
//                     this.is_refresh = true
//                     this.getMoreChatList();
//                   })
//                 }
//               }} />
//             }
// //             keyExtractor={(item, index) => item + index}
// //             showsVerticalScrollIndicator={true}
          
          
// //           />
// //            {/* <TextInput
// //              multiline={true}
// //            >

// //            </TextInput> */}
// //          </View>
        

// //           <View style={{
// //             bottom: height < 786? 10: 0,
// //             alignItems: "flex-start",
// //             padding: 10,
// //             paddingBottom: 10, 
// //             paddingTop: 5,
// //             borderTopWidth: 0,
// //             backgroundColor:'red',
// //             backgroundColor: colors.LIGHT_COLOR
// //           }}>
// //             {/* {this.props.user.current_ticket.assigned_id != null && ( */}
// //                   <View style={[styles.flexRow, { justifyContent: "space-between" , minHeight:60}]}>
// //                   <View style={{ paddingRight: 10, paddingLeft: 10 , flex: height < 680? 0.71: 0.55, display: this.state.isInputFocus ? 'none':'flex'}}>
// //                     <Button transparent style={styles.mediaIconsContainer}
// //                       onPress={() => {
// //                         this.navigator("image")
// //                       }}>
// //                           <Image style={styles.mediaIcons} source={camera} />  
// //                     </Button>
// //                   </View>
// //                   <View style={{ paddingRight: 10, flex: height < 680? 0.72: 0.55, display: this.state.isInputFocus ? 'none':'flex'}}>
// //                     <Button transparent style={[styles.mediaIconsContainer,{}]}
// //                       onPress={() => {
// //                         this.navigator("video")
// //                       }}>
// //                           <Image style={[styles.mediaIcons,]} source={video} />
// //                     </Button>
// //                   </View>

// //                   <View style={[styles.textmessageContainer,{ flex: height < 680? 3.6: 3,  marginRight:5}]}>
                
// //                   <TextInput
// //                   //autoCorrect={false}
// //                   //multiline={true}
// //                    placeholderTextColor = {colors.chat_placeholder}
// //                   ref={ref => (this.textInputRef1 = ref)}
// //                  // blurOnSubmit={false} 
// //                   value={this.state.msg}
// //                   onChangeText={value => {
// //                       this.setState({msg : value})
// //                   }
// //                   }
// //                     onFocus={() => {  
// //                       this.is_refresh = false;
// //                       this.setState({isInputFocus: true});      
// //                     setTimeout(() => {
// //                       if(this.refs.ListView_Reference != undefined){
// //                         this.refs.ListView_Reference.scrollToEnd()
// //                        }  
// //                     }, 500);
// //                   }}
// //                   onBlur={()=>{
// //                     this.setState({isInputFocus: false}); 
// //                   }}
// //                     onSubmitEditing={() => {Keyboard.dismiss(); }}
// //                     style={[styles.numberInput, { width: width / 2, height:20 }]}
// //                     selectionColor={colors.BLACK_TEXT}
// //                     placeholder="Message..." />
// //                   <View style={{ padding: 0 }}>
// //                    <Button  transparent onPress={() => {
// //                       this.navigator("send")
// //                     }}
// //                     style={[]}  iconCenter >
// //                        <Image style={[styles.mediaIcons,{height:25, width:25}]} source={this.state.msg.trim()==""? send_off:send_on} />
// //                    </Button>          
// //                   </View>
// //                 </View>              
// //                 </View>
        
// //           </View>     
         
// //         </KeyboardAwareScrollView>
// //         </View>
        
// //         <Modal hasBackdrop={true} backdropColor={"black"} backdropOpacity={1} transparent={true} presentationStyle="pageSheet" isVisible={this.state.showCamera} hideModalContentWhileAnimating={true}>
// //           <CameraScreen
// //             text={'Upload a \n  Picture'}
// //             type={"chat"}
// //             canSkip={false}
// //             skip={this.navigator}
// //             getImageUri={this.setImages}
// //             backButton={this.navigator}></CameraScreen>
// //         </Modal>
// //         <Modal hasBackdrop={true} backdropColor={"black"} backdropOpacity={1} transparent={true} presentationStyle="pageSheet" isVisible={this.state.showVideo} hideModalContentWhileAnimating={true}>
// //           <VideoScreen
// //             text={'Upload your \n problem with picture'}
// //             canSkip={false}
// //             getImageUri={this.setVideo}
// //             skip={this.navigator}
// //             backButton={this.navigator}></VideoScreen>
// //         </Modal>
// //         <ActionSheet
// //           ref={this.getActionSheetRef}
// //           options={options}
// //           cancelButtonIndex={CANCEL_INDEX}
// //           destructiveButtonIndex={DESTRUCTIVE_INDEX}
// //           onPress={this.handleImagePress}
// //         />
// //         <ActionSheet
// //           ref={this.getVideoActionSheetRef}
// //           options={video_options}
// //           cancelButtonIndex={CANCEL_INDEX}
// //           destructiveButtonIndex={DESTRUCTIVE_INDEX}
// //           onPress={this.handleVideoPress}
// //         />     

// //         <Modal
// //         isVisible={this.state.toggle_menu}
// //          onBackdropPress={() => this.setState({ toggle_menu: !this.state.toggle_menu })}
// //          hideModalContentWhileAnimating={true}
// //           onSwipeComplete={() => this.setState({ toggle_menu: !this.state.toggle_menu })}
// //           swipeDirection="down"
// //           >
// //           <SideMenu
// //             from={"chat"}
// //             parentCallback={this.callbackFunction}></SideMenu>
// //         </Modal>
    
// //         <Modal isVisible={this.state.show_full_video}
// //           hideModalContentWhileAnimating={true}
// //           onSwipeComplete={() => this.setState({ show_full_video: !this.state.show_full_video })}
// //           swipeDirection="down"
// //           animationIn={"zoomIn"}
// //           animationOut={"zoomOut"}
// //           style={{backgroundColor:colors.grey_bg}}
// //         >
// //         <View style={{flex:1, backgroundColor:colors.grey_bg}}>
// //             <Button  onPress={() => this.navigator('play')} transparent hitSlop={hitSlop} style={{zIndex:4, marginTop:30, height:60}}>
// //                         <Icon style={[
// //                                {color:colors.LIGHT_COLOR, fontSize:50},
// //                             ]}  name="ios-close"/>
// //             </Button>
// //             <Video ref={(ref) => {
// //                   this.player = ref
// //                 }}
// //                 resizeMode="cover"
// //                 source={{ uri: this.state.video_file }}
// //                 style={[styles.backgroundFullVideo,{zIndex:1, backgroundColor:colors.card_border_outline}]} />
// //         </View>
// //         </Modal>
// //         <Modal
// //         isVisible={this.state.show_full_screen}
// //          onBackdropPress={() => this.setState({ show_full_screen: !this.state.show_full_screen })}
// //          hideModalContentWhileAnimating={true}
// //           onSwipeComplete={() => this.setState({ show_full_screen: !this.state.show_full_screen })}
// //           swipeDirection="down"
// //           >
// //           <FullScreen
// //             data={this.state.full_screen_data}
// //             parentCallback={this.fullScreenCallback}>
// //             </FullScreen>
// //         </Modal>
// //       </Container>
// //     );

// //   }


// //   onRefresh=()=>{
// // //console.log("on Refresh calling....")
// //   }
// //   getMoreChatList=()=>{
// //     //console.log({chat_room_id:this.props.user.current_ticket.chat_room_id,username: this.props.user.name},"consolesss");
// //     let param={};
// //     if(this.props.user.current_ticket.assigned_id == null){
// //       param={
// //         page_no:this.state.page_no,
// //         chat_room_id:this.props.user.current_ticket.chat_room_id,
// //         number_of_result:25
// //       }
// //     }else{   
// //       param={
// //         page_no:this.state.page_no,
// //         assigned_id:this.props.user.current_ticket.assigned_id,
// //         number_of_result:25
// //       }
// //     }
// //     //console.log(param,"param..")
// //     postApiRequestWithHeaders(
// //       commonData.api_endpoint.getChatList,
// //       param, this.props.user.access_token
// //     ).then(
// //       data => {
// //         //console.log(data,"getChatList");  
// //         this.state.messages= data.chats.concat(this.state.messages);
// //         //console.log(this.state.messages)
// //         this.setState({
// //           messages:this.state.messages,
// //           iMaxPages:data.total_pages
// //         })
     
// //       },
// //       error => {
// //        // this.callToastFunction("error", "error")
// //       //  errorHandler(error, this.props);
// //       },
// //     );
// //   }
// //   callbackFunction=(type)=>{
// //     console.log(type,"calllllll....")
// //     if(type != 'push'){
// //       this.setState({ toggle_menu: !this.state.toggle_menu });
// //     }
// //    // 
// //     if(this.props.user.user_type!="expert"){
// //       switch (type) {
// //         case "over":
// //          setTimeout(() => {
// //           this.setState({
// //             title:'Job Cancel?',
// //             alert_type:'job_cancel',
// //             alert_desc:'Are you sure you want to cancel the current ticket and start over?',
// //             show_alert:true,
// //           })
// //          }, 500);
         
// //           break;
      
// //         default:
// //           this.props.parentCallback(type);
// //           break;
// //       }
     
// //     }else{   
// //         switch (type) {
// //             case "pay":
// //               this.callToastFunction("Will Done in Milestone 3", "success");
// //               break;
// //             case "find":
// //               this.callToastFunction("Will Done in Milestone 3", "success")
// //                 break;
// //             case "over":
// //               this.callToastFunction("Will Done in Milestone 3", "success")
// //                   break;
// //             default:
// //               break;
// //        }
// //     }
// //   }
// //   fullScreenCallback=(type,message)=>{
// //     console.log(type,"calllllll....",message);
// //     switch (type) {
// //       case "close":
// //         this.setState({
// //           show_full_screen:false
// //         })      
// //         break;
// //         case "send_message":
// //           this.setState({
// //             msg:message
// //           },()=>{
// //             this.sendMessage()
// //           })      
// //           break;
// //       default:
// //         break;
// //     }
// //   }

// //   sendMessage=()=>{
// //     //console.log(this.props);
// //       this.state.messages.push({
// //         msg: this.state.msg,
// //         url:'',
// //         sender_id: this.props.user.user_id,
// //         type:'text',
// //         createdAt: new Date(),
// //         profile_image: this.props.user.user_type=="expert"?this.props.user.profile_image:'',
// //       });
// //      //console.log(this.state);
// //         var socket_param={
// //           msg: this.state.msg,
// //           url:'',
// //           sender_id: this.props.user.user_id,
// //           assigned_id:this.props.user.current_ticket.assigned_id,
// //           chat_room_id:this.props.user.current_ticket.chat_room_id,
// //           type:'text',
// //         }
// //         //console.log(socket_param,"param...")
// //       this.socket.emit('send_message', socket_param);
// //     //   //console.log("send Message function", this.state);
// //      this.setState({messages: this.state.messages, msg:''});
// //       setTimeout(() => {
// //         this.GoTo_bottom_function();
// //       }, 1000);
// //   }

// //   uploadPhoto=()=>{
// //     //console.log("upload phot..", this.state);
// //     const file = {
// //       uri: "file://"+this.state.img_object.path,
// //       name: this.state.img_object.file_name,
// //       type: this.state.img_object.mime
// //     }
// //     const options = {
// //       keyPrefix: "chat_image/",
// //       bucket: "askkenvideos",
// //       region: "us-east-2",
// //       accessKey: "AKIAX4SCEJIN7DVDY4AD",
// //       secretKey: "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",
// //       successActionStatus: 201
// //     }
// //     //console.log(file,options);
// //     RNS3.put(file, options).then(response => {
// //       //console.log(response, "S3 respo...")
// //       if (response.status !== 201) {
// //         throw new Error("Failed to upload image to S3");
// //       } else {
// //          //console.log("image uploaded");
// //          var socket_param={
// //           msg: "",
// //           url:response.body.postResponse.location,
// //           sender_id: this.props.user.user_id,
// //           assigned_id:this.props.user.current_ticket.assigned_id,
// //           chat_room_id:this.props.user.current_ticket.chat_room_id,
// //           type:'photo',
// //         }
// //         //console.log(socket_param,"socket_param...")
// //         this.socket.emit('send_message', socket_param);
// //       }
// //       //console.log(response.body);
// //     });
// //   }

// //   uploadVideo = () => {
// //     var file_name = Date.now() + this.props.user.user_id + '.mov'
// //     //console.log("Upload video......",file_name);
// //     const file = {
// //       uri: this.state.uri,
// //       name: file_name,
// //       type: "video/mov"
// //     }
// //     const options = {
// //       keyPrefix: "chat_image/",
// //       bucket: "askkenvideos",
// //       region: "us-east-2",
// //       accessKey: "AKIAX4SCEJIN7DVDY4AD",
// //       secretKey: "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",
// //       successActionStatus: 201
// //     }
// //     RNS3.put(file, options).then(response => {
// //       //console.log(response, "S3 respo...")
// //       if (response.status !== 201) {
// //         throw new Error("Failed to upload image to S3");
// //         this.refs.Load.CloseLoad();
// //       } else {
// //         var socket_param={
// //           msg: "",
// //           url:response.body.postResponse.location,
// //           sender_id: this.props.user.user_id,
// //           assigned_id:this.props.user.current_ticket.assigned_id,
// //           chat_room_id:this.props.user.current_ticket.chat_room_id,
// //           type:'video',
// //         }
// //         //console.log(socket_param,"socket_param...")
// //         this.socket.emit('send_message', socket_param);
// //       }
// //       //console.log(response.body);
// //     });
// //   }
// // }

// // function mapStateToProps(state) {
// //   //console.log(state, "state in Home")
// //   return {
// //     user: state.user.userData
// //   }
// // }
// // export default connect(mapStateToProps, {})(TicketChat);

