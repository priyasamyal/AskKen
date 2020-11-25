
import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	KeyboardAvoidingView,Linking,ActivityIndicator,Keyboard
} from 'react-native';
import {
	Container,
	Header,
	Left,
	Button,
	Body,
	Right,
	Icon,
	Textarea,
} from 'native-base';
import FastImage from 'react-native-fast-image'
// create a component
import { colors } from '../../common/index';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { setTicketPhoto, setUserData } from "../../actions";
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
import CommonToast from "@custom_components/CommonToast";
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import styles from './styles';
import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'
import commonData from '../../common/data.js';
import Modal from 'react-native-modal';
import SideMenu from '../SideMenu';
import { SwipeableModal } from 'react-native-swipeable-modal';
import { StackActions, NavigationActions } from 'react-navigation';
import {
	postApiRequestWithHeaders,
	openUrl,
	clearLocalStorage,
	showToast,
	errorHandler,
	postApiRequestWithHeadersServerEoor
} from '../../common/user';
import Video from 'react-native-video';
import { RNS3 } from 'react-native-aws3';
import { connect } from "react-redux";
import Load from 'react-native-loading-gif';
const dot_icon = require('../../assets/imgs/dots.png');
const send_on = require('../../assets/imgs/send_on.png');
class FullScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			image_selected: false,
			uri: '',
			showCamera: false,
			showVideo: false,
			toggle_menu:false,
			msg:'',
			isInputFocus:false,
			img_object:{},
			page_no:0,
			iMaxPages:0,
			show_full_video: false,
			video_file:'',
			type: "",
			show_full_screen: true,
			showCustomToast:false,
			message: '',
			is_load: this.props.data.type != 'photo' ? true : false,
			
		};
		console.log(this.props,"props....")
	}
	callToastFunction = (msg, status) => {
		setTimeout(() => {
			this.setState({
				message: msg,
				type: status,
				showCustomToast: true
			})
		}, 400);

		setTimeout(() => {
			this.setState({
				showCustomToast: false
			});
		}, 3000);
	}
	navigator = (data,msg) => {
		switch (data) {
			case "back":
				Keyboard.dismiss();
			    this.props.parentCallback('close');
				break;
			case "send":
				Keyboard.dismiss();
				this.props.parentCallback('send_message',this.state.msg);
				this.setState({
					msg:''
				})
				this.callToastFunction("Sent", 'success')
				break; 
			default:
				break;
		}
	}
		render() {
				return (
					<Container style={{backgroundColor:colors.BLACK_TEXT}}>
						 {this.state.showCustomToast ? (
					<View style={{
						position: "absolute",
						bottom: 0,
						zIndex: 2
					}}>
						<CommonToast type={this.state.type} message={this.state.message} />
					</View>
				) : null
				}
							<Header transparent style={styles.header}>
					<Left style={{ flex: 1 }}>
					 
					</Left>
					<Body>  
					</Body>
					<Right>
					<Button
							transparent
							hitSlop={hitSlop}
							onPress={() => this.navigator('back')}>
							<Icon style={[styles.black_text]} name="close" type="EvilIcons" />
						</Button>
					</Right>
				</Header>
				<View style={{alignItems:'center', flex:1, justifyContent:'space-between'}}>
				<KeyboardAwareScrollView
					 ref='ListView_Reference1'
						contentContainerStyle={[{ flex: 1,alignItems:'center', marginTop:5}]}
						keyboardDismissMode="on-drag"
						keyboardShouldPersistTaps={'handled'}
						showsVerticalScrollIndicator={false} 
					 alwaysBounceVertical={false}
					>
								<View style={{flex:1, width:width}}>
										{this.props.data.type=='photo'&&(
												 <FastImage
											style={[styles.backgroundVideo, { marginBottom: 0 }]} 
											
											 resizeMode={FastImage.resizeMode.cover}
													source={{
														uri:this.props.data.url,
														priority: FastImage.priority.normal,
													}} />  
										)}
									{this.props.data.type != 'photo' && (
										<View>		
											<Video 
										     	repeat={true}
											    onLoad={(data)=>this.onBuffer(data)}    
												resizeMode="cover"
												source={{ uri:this.props.data.url }}
												style={[styles.backgroundVideo1,{ marginBottom:0}]} /> 
											</View>
									)}
									{this.state.is_load && (
										<View style={[styles.horizontal]}>
										 	<ActivityIndicator size="large" color={colors.gray_input} />
						     			</View>
									)}
						
								</View>
					 
						</KeyboardAwareScrollView>
						</View>
					
					</Container>
					
				)
		}
	
	onBuffer = (data) => {
		setTimeout(() => {
			this.setState({
				is_load: false
			 })
		}, 300);
	
		}
}

export default FullScreen
