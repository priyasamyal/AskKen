import React, { Component } from 'react';
import commonData from '../../common/data.js';
import Video from 'react-native-video';
import { StackActions, NavigationActions } from 'react-navigation';
import { View, Image, Text, Linking, Dimensions, TouchableWithoutFeedback ,AppState} from 'react-native';
import { postApiRequest, postApiRequestWithHeaders,setItem,socket,errorHandler } from '../../common/user';
import RegisterSuccess from '../../components/RegisterSuccess';
import HeaderComponent from "@custom_components/HeaderComponent";
import Modal from 'react-native-modal';
import styles from './styles';
import { setTicketPhoto, setUserData,setChatLists,setCurrentTicket } from "../../actions";
import TicketChat from '@components/TicketChat';
import {
  Container,
  Header,
  Content,
  Left,
  Button,
  Body,
  Right,
  Icon,
  Title,
} from 'native-base';
import { colors } from '../../common/index.js';
import { connect } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
const no_jobs = require('../../assets/imgs/no_jobs.png');
const done = require('../../assets/imgs/done.png');
const cancel = require('../../assets/imgs/cancel.png');
const blue = require('../../assets/imgs/blue.png');
const gray = require('../../assets/imgs/gray.png');
const flash_on = require('../../assets/imgs/thunder.png');
class ChatList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSucess: false,
      chatArray: [],
      isVisible:false,
      show_msg:false
    };
    socket.on('new_chat_message', (messages) => {  
      if(this.props.user.user_type =='expert'){      
        console.log("socket new_chat_message...",messages);    
        if(messages.last_message =="I am not satisfied yet, we are still working"){
          console.log("pleasee",messages)
          this.getChatList()
        }  
        this.test =  this.state.chatArray.findIndex(x=>
             x.chat_room_id.toString() == messages.chat_room_id.toString())
          if(this.test >-1){
            this.state.chatArray[this.test].unread_count=messages.unread;
            this.state.chatArray[this.test].last_message=messages.last_message;
            this.setState({
              chatArray: this.state.chatArray
            })        
          }
          else{
            this.getChatList()
          }     
        } 
    });  
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState != "active") {  
      this.sendSilentPush(0);
    }
  };
  
  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    if(this.props.user.phone_number == undefined || this.props.user.phone_number == ''){
      crashlytics().log("EnterChatList");
    }else{
      crashlytics().log("EnterChatList "+this.props.user.phone_number.split(" ").join(""));
    }
    this.getChatList();
  }

  getChatList = () => {
    let param = { page_no: 0,time_zone: commonData.time_zone };
   
    postApiRequestWithHeaders(
      commonData.api_endpoint.chatList,
      param, this.props.user.access_token
    ).then(
      data => {
       
        this.props.setChatLists(data.chat_list);
       this.setState({chatArray: data.chat_list,show_msg:true})
      },
      error => {
        this.setState({
          show_msg:true
        })
        errorHandler(error, this.props);
      },
    );
  }

  sendSilentPush=(count)=>{
   
    let param={
      "device_token": this.props.user.device_token,
      "count": count
    }
    postApiRequestWithHeaders(
      commonData.api_endpoint.silent_push,
      param,this.props.user.access_token
    ).then(
      data => {
        console.log("send Push")
      },
      error => {
        errorHandler(error, this.props);
      },
    );
  }

  navigator=(page, data)=>{
    switch (page) {
      case 'next': {
        console.log(page,data,"chatlist")
        crashlytics().log('Click Ticket Chat to go Chat View Page');
        if(data.unread_count > 0){
          this.sendSilentPush(data.unread_count);
        }
        //if(data.job_status=="inprogress"){
          var  user_data = this.props.user;
          user_data.current_ticket = data;
          this.props.setUserData(user_data);
          this.props.setCurrentTicket(user_data.current_ticket);
          this.props.navigation.navigate('TicketChat',  {
            onGoBack: () => this.refresh(),
          });     
      // }
        break;
      }
      case 'back': {
        if(this.props.navigation.state.params != undefined){
          this.props.navigation.state.params.onGoBack();
        }
        this.props.navigation.goBack();    
        break;
      }
      case "hide":{
        this.setState({isVisible: !this.state.isVisible})
        break;
      }
    }
  }

  refresh=()=>{
    console.log("Chat referesh...")
    this.getChatList();
  }

  _renderItem = (item) => {
    return (
      <TouchableWithoutFeedback onPress={() => this.navigator("next",item)} style={{flex:1}}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 20 }}>
        <View style={{flex:0.5, height: 60, width: 50,marginRight:10, backgroundColor:colors.grey_heading , borderRadius: 10,}}>
          {item.file_type =="photo" &&(
            <Image   source={{
              uri: item.file_name
            }} style={{ borderRadius: 10,resizeMode: 'cover', height: "100%", width: "100%", justifyContent: 'center' }} />
          )}

          {item.file_type !="photo" &&(
            <Video 
            paused={"true"}
            resizeMode="cover"
            source={{ uri: item.file_name }}
            style={[styles.backgroundVideo,{zIndex:1, backgroundColor:colors.card_border_outline}]} />
          )}  

        </View>

        <View style={{ flex: 2, }}>
          <Text style={[styles.name,  { color: (item.assigned_status !="inprogress"  && item.job_status !="marked_by_expert")?colors.chat_disable:colors.BLACK_TEXT }]}>{item.owner_name} - {item.category_name}</Text>
  
          {item.unread_count ==0 && (item.assigned_status =="inprogress" || item.job_status =="marked_by_expert") &&(
            <Text style={[styles.msg_no, { color: colors.chat_gray }]}> No new messages</Text>
          )}
          
          {item.unread_count !=0 && (item.assigned_status =="inprogress" || item.job_status =="marked_by_expert") &&(
              <Text style={styles.msg_no}> {item.unread_count} new messages{' - '} 
               <Text style={{ color: colors.chat_gray}}>{moment(moment().format("YYYY-MM-DD")).isSame(moment(item.last_message).format("YYYY-MM-DD")) ? moment(item.last_message).format("h:mma"):
              moment(item.last_message).format("MMM DD, h:mma")}
              </Text>
              
              </Text>
          )}
            {item.assigned_status =="cancelled" &&(
              <Text style={[styles.msg_no, { color: colors.chat_disable }]}>Job cancelled</Text>
          )}
            { item.assigned_status =="completed" &&(
               <Text style={[styles.msg_no, { color: colors.chat_disable }]}>Job Completed</Text>
          )}
          
        </View>

          <View style={{ flex: 0.3, alignItems: 'center', }}>
            
          {item.unread_count !=0 && item.assigned_status =="inprogress" &&(
           <Image source={blue} style={{ resizeMode: 'contain', height: 10, width: 10, justifyContent: 'center' }} />
           )}
           {item.unread_count ==0 && item.assigned_status =="inprogress" && item.job_status !="marked_by_expert" &&(
           <Image source={gray} style={{ resizeMode: 'contain', height: 10, width: 10, justifyContent: 'center' }} />
          )}
            {item.assigned_status =="cancelled" &&(
          <Image source={cancel} style={{ resizeMode: 'contain', height: 25, width: 25, justifyContent: 'center' }} />
          )}
          {item.assigned_status =="completed" &&(
         <Image source={done} style={{ resizeMode: 'contain', height: 25, width: 25, justifyContent: 'center' }} />
            )}
           {item.job_status =="marked_by_expert" && item.unread_count ==0 &&(
         <Image source={flash_on} style={{ resizeMode: 'contain', height: 25, width: 25, justifyContent: 'center' }} />
            )}
            
        </View>
      </View>
      </TouchableWithoutFeedback>
    )
  }

 
  listEmptyComponent = () => {
    return (
        <View style={{alignItems:'center'}}>
          {this.state.show_msg == true &&(
              <Text style={[styles.name,{}]}>No Messages Available</Text>
          )}
          
        </View>
    )
}
render() {
    return (
      <Container>
        <HeaderComponent clickHandler={() => this.navigator('back')} />
        <View style={styles.mainContainer}>
          <View style={[styles.mainContent, { padding: 20, }]}>
            <FlatList
            ListEmptyComponent={
              this.listEmptyComponent()
            } 
              data={this.state.chatArray}
              renderItem={({ item }) => this._renderItem(item)}
              keyExtractor={(item, index) => item + index}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
        <Modal
             transparent={true}
            //  onSwipeComplete={() => this.setState({ isVisible: !this.state.isVisible })}
            //  swipeDirection="down"
            //  onBackdropPress={() => this.setState({ isVisible: !this.state.isVisible })}
             presentationStyle="pageSheet" 
            isVisible={this.state.isVisible}
            hideModalContentWhileAnimating={true} >
            <TicketChat navigation={this.props.navigation} 
             parentCallback={this.navigator}
            >
            </TicketChat>
          </Modal>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  //console.log(state, "state in Chat")
  return {
    chatList: state.post_ticket.chatList,
    user: state.user.userData,
  }
}
//make this component available to the app
export default connect(mapStateToProps,{setUserData,setChatLists,setCurrentTicket})(ChatList);
