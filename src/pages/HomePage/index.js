import React, { Component } from 'react';
import styles from './styles';
import { View, Image, Text, Linking, Dimensions,TouchableWithoutFeedback ,AppState,ActivityIndicator} from 'react-native';
import { Container, Header, Left, Button, Body, Right, Icon,Badge } from 'native-base';
import {
	postApiRequestWithHeaders,
	errorHandler,
	showToast,
	alertWithTwoBtn,
	alertWithSingleBtn,
	clear_push_interval
} from '../../common/user';
import firebase from 'react-native-firebase';
var { width, height } = Dimensions.get('window');
import { colors } from '../../common/index';
import commonData from '../../common/data.js';
import { connect } from "react-redux";
import { selectedCategory,setChatLists,setCurrentTicket } from "../../actions";
import { openUrl, clearLocalStorage, getApiRequest ,socket,getItem,setItem} from '../../common/user';
const hitSlop = { top: 4, left: 4, right: 4, bottom: 4 };
import TicketChat from '@components/TicketChat';
import CommonAlert from '@custom_components/CommonAlert';
import SideMenu from '../../components/SideMenu';
import { StackActions, NavigationActions } from 'react-navigation';
import Load from 'react-native-loading-gif';
import { } from '../../common/user';
import Video from 'react-native-video';
import uuid from 'uuid';
import Modal from 'react-native-modal';
import crashlytics from '@react-native-firebase/crashlytics';
const side_menu = require('../../assets/imgs/side_menu.png');
const side_menu_black = require('../../assets/imgs/side_menu_black.png');
const home_ask = require('../../assets/imgs/home_askken.png');
const bag_menu = require('../../assets/imgs/bag_menu.png');
const chat = require('../../assets/imgs/chat.png');
const no_jobs = require('../../assets/imgs/no_jobs.png');
const header_logo = require('../../assets/imgs/header_logo.jpg');
const accept = require('../../assets/imgs/accept.png');
const reject = require('../../assets/imgs/reject.png');
const play = require('../../assets/imgs/play.png');
import CommonToast from "@custom_components/CommonToast";
import { setUserData, setAllTickets } from "../../actions";
import MultipleCategory from '../../components/MultipleCategory';
import Swiper from 'react-native-refreshed-deck-swiper'
import analytics from '@react-native-firebase/analytics';
import TimeZone from 'react-native-timezone';
import { AppEventsLogger } from "react-native-fbsdk";
const swiperRef = React.createRef();
class HomePage extends Component {
	swipe_count = 0;  
	swipe_once_card = false;
	handleViewRef = ref => (this.view = ref);
	constructor(props) {
		super(props);
		this.state = {
			all_job: [],
			card_index: 0,
			toggle_menu: false,
			is_paused: true,
			current_ticket: { id: 1 },
			message: "",
			type: "",
			showCustomToast: false,
			params: this.props.navigation.state.params,
			push_enable:this.props.user.push_enable,
			show_full_video: false,
			video_file:'',
			show_request_popUp:false,
			chatArray: [],
			appState: AppState.currentState,
			is_load: false,
			swipe_count:0,
			ads: [
			{
				file_name: require('../../assets/imgs/ads_profile.png'),
				description: "Save time and close more deals by adding our industry leading all-in-one video appointment software to your website.",
				file_type:'ads'
		    },
			{
				file_name: require('../../assets/imgs/ads_profile.png'),
				description: "The #1 platform for connecting with your customers virtually. Trusted by leading field service businesses everywhere.",
				file_type:'ads'
			 }
			],
			ad_index: commonData.ad_index
		};   
		socket.on('new_chat_message', (messages) => {
			if(this.props.user.user_type =='expert'){
				this.test = this.state.chatArray.findIndex(x =>
				{console.log(x, "xxxx....");
				return x.chat_room_id.toString() == messages.chat_room_id.toString()
					
					}
				)
				if(this.test >-1){
					}else{
						this.getChatList1()
					}  
			 }
		})
	}
 /**Show loader on Video Move */
	onBuffer = (data) => {
		setTimeout(() => {
			this.setState({
				is_load: false
			 })
		}, 300);
	
		}
/**Get Chat list to show count on badge */	
	getChatList1 = () => {
		let param = { page_no: 0,time_zone: commonData.time_zone };
		postApiRequestWithHeaders(
			commonData.api_endpoint.chatList,
			param, this.props.user.access_token
		).then(
			data => {
			var result =data.chat_list.filter(a=>{
					return a.unread_count>0
			})
			 this.setState({chatArray: result})
			},
			error => {
			//	errorHandler(error, this.props);
			},
		);
	}

	refresh=()=>{
		this.getChatList1();
		this.getUserDetails();
	}

	/**Setting data on Page load */
	componentDidMount() {
		//this.refs.Load.OpenLoad();
		this.getUserDetails();
		TimeZone.getTimeZone().then(zone => 
			{commonData.time_zone = zone   
		});
		if(this.props.user.phone_number == undefined || this.props.user.phone_number == ''){
			crashlytics().log("EnterHomePage");
		}else{
			crashlytics().log("EnterHomePage "+this.props.user.phone_number.split(" ").join(""));
		}

		if(this.props.navigation.state != undefined){
			if(this.props.navigation.state.params != undefined){
				if(this.props.navigation.state.params.from != undefined){
					if (this.props.navigation.state.params.from == "login" && this.props.user.user_type == 'expert') {
						getItem(['is_first_time']).then(
							res => {
							//	console.log(res, "checking,,,,,.....", res[0][1]);
								if (res[0][1] != 'true') {
									this.setState({
										show_request_popUp:true
									})
								}
							
							}
						)
							
					}
				}

			}
		}
		if (this.props.user.user_type == 'expert') {
			this.getChatList1();
			this.setState({
				all_job: this.props.all_tickets
			})
			AppState.addEventListener("change", this._handleAppStateChange);
		} else {
			if (this.props.user.current_ticket != undefined) {
				this.setState({
					current_ticket: this.props.user.current_ticket
				})
				this.props.setCurrentTicket(this.props.user.current_ticket);
			}
		}
		if (commonData.current_version < commonData.latest_version) {
			alertWithSingleBtn(
				'Update Required',
				commonData.ToastMessages.update_app_msg,
				'Update',
			).then(data => {
				if (data) {
					openUrl('https://apps.apple.com/us/app/ask-ken/id1492781352?ls=1');
				}
			});
		}

	
		commonData.categories.map(m => {
			return m.isSelected = false
		})   
		this.sendSilentPush(0);
		firebase.notifications().getBadge()
	    	.then( count => {
	    	console.log(count,"lounf,,,,,,");
		     firebase.notifications().setBadge(0);
	      })
	}

	componentWillUnmount() {
		if (this.props.user.user_type == 'expert') { 
			AppState.removeEventListener("change", this._handleAppStateChange);
		}		
	}

	/**Reset Badge Count */
		sendSilentPush = (count) => {
			let param = {
				"device_token": this.props.user.device_token,
				"count": count
			}
			postApiRequestWithHeaders(
				commonData.api_endpoint.silent_push,
				param, this.props.user.access_token
			).then(
				data => {
				//	console.log("send Push")
				},
				error => {
					errorHandler(error, this.props);
				},
			);
	}
	
	/**Handle App foreground and Background State */
		_handleAppStateChange = nextAppState => {
			if (nextAppState === "active") {
				 this.getUserDetails();
				// this.sendSilentPush(0);
			} 
			if(nextAppState =="background"){
				firebase.notifications().setBadge(0);
				this.sendSilentPush(0);			
			}
		};
	/**
	 * Fetch user details from local storage
	 */
	getUserDetails = () => {
		var param = {}
		postApiRequestWithHeaders(commonData.api_endpoint.user_details, param, this.props.user.access_token).then(
			data => {
				data.loggedInStatus = true;
				if (data.user.user_type != "owner") {         
					this.setState({
						all_job: data.all_tickets
					})
					let user_data = this.props.user;
					user_data.earning_count = data.user.earning_count;
					this.props.setUserData(user_data);
					this.props.setAllTickets(data.all_tickets);
					
				} else {
					this.props.setCurrentTicket(data.user.current_ticket);
						this.setState({
						current_ticket: data.user.current_ticket,
						push_enable:data.user.push_enable,
						 })
				}
			 
				this.props.setUserData(data.user)
			},
			error => {
				errorHandler(error, this.props);
			},
		);
	};
	/**
	 * Get expert Stripe status
	 */
	getStatusApiCall = () => {
		if (this.props.user.cards.length > 0) {
			const param = {
				user_id: this.props.user.user_id,
			};
			if (this.state.toggle_menu) {
				this.sidemenu_child.current.updateStripeStatus(commonData.stripe_status);
			}
			postApiRequestWithHeaders(commonData.api_endpoint.get_status, param,this.props.user.access_token).then(
				res => {
					commonData.stripe_status = res;
					if (this.state.toggle_menu) {
						this.sidemenu_child.current.updateStripeStatus(res);
					}
				},
				error => { },
			);
		}

	};

	//Function for getting  states
	getStatesApiCall = () => {
		getApiRequest(commonData.api_endpoint.get_states).then(
			data => {
				commonData.states = data.states;
			},
			error => {
			},
		);
	};



	/**
	 * getChatList
	 * @param string - Pro access Token, Int - Page No.
	 * @return Array - chatList array 
	*/
	getChatList = () => {
		 this.props.navigation.navigate("ChatList",{
					onGoBack: () => this.refresh(),
				});
	}
	/**
	 * Click events on page like backnext etc
	 */
	navigator = (page, data) => {
		switch (page) {
			case 'showSkill': {

				if (commonData.current_version < commonData.latest_version) {
					alertWithSingleBtn(
						'Update Required',
						commonData.ToastMessages.update_app_msg,
						'Update',
					).then(data => {
						if (data) {
							openUrl('https://apps.apple.com/us/app/ask-ken/id1492781352?ls=1');
						}
					});
				} else {
					this.setState({ showSkill: true });
					this.setState({ selectedCategory: data });
				}
				break;
			}
			case 'side_menu': {
				this.setState({ toggle_menu: true });
				break;
			}
			case "chatlist": {
				this.getChatList();
				
				break;
			}
			case 'nextPage': {
				this.props.selectedCategory(data);
				this.props.navigation.navigate('TicketDescription');
				// if (commonData.current_version < commonData.latest_version) {
				//   alertWithSingleBtn(
				//     'Update Required',
				//     commonData.ToastMessages.update_app_msg,
				//     'Update',
				//   ).then(data => {
				//     //  //console.log(data);
				//     if (data) {
				//       openUrl('https://apps.apple.com/us/app/ask-ken/id1492781352?ls=1');
				//     }
				//   });
				// } else {
				//   this.props.navigation.navigate('CallReady');
				// }
				break;
			}
			case 'back': {
				this.checkBoxes.current.navigator('back');
				this.setState({ showSkill: false, selectedSkill: '' });
				break;
			}

			case "push": {
				let param = { push_enable: true };
				this.togglePushApi(param);
				break;
			}
			case "play": {
				if(data != undefined){
					this.setState({video_file:data.file_name},()=>{
						this.setState({show_full_video: !this.state.show_full_video,is_load: true})
					 })   
				}else{
					this.setState({show_full_video: !this.state.show_full_video,is_load: true})
				} 
				break; 
			}
			case "play_ad": {
					this.setState({video_file:"https://www.askkenapp.com/assets/widget_web/video/demo.mp4"},()=>{
						this.setState({show_full_video: !this.state.show_full_video,is_load: true})
					 })   
				
				break; 
			}
		}
	};

/**Common Toast Message called */
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
		}, 2000);
	}

/**Push Notification event */
	togglePushApi = param => {
		param.user_id = this.props.user.user_id;
		this.refs.Load.OpenLoad();
		postApiRequestWithHeaders(
			commonData.api_endpoint.update_profile,
			param, this.props.user.access_token
		).then(
			data => {
				this.setState({
					push_enable:data.user.push_enable
				})
				if (data.user.user_type != "owner") {
					this.setState({
						all_job: data.all_tickets
					})
					//console.log(this.state)
					this.props.setAllTickets(data.all_tickets)
				} else {
					this.setState({
						current_ticket: data.user.current_ticket,							
					})
				}
		    //console.log(this.state,"all state,...")
			 this.props.setCurrentTicket(data.user.current_ticket);
				this.props.setUserData(data.user); 
				setTimeout(() => {
					this.refs.Load.CloseLoad();
					swiperRef.current.renderChildren();
					this.callToastFunction("Push Enabled", "success")
				}, 500);
			},
			error => {
				// //console.log('error....', error);
				this.refs.Load.CloseLoad();
				this.callToastFunction("error", "error")
				// this.setState({ loader: false });
				errorHandler(error, this.props);
			},
		);
	};

	/**
	 * Log Out User
	 */
	logOutFunc = () => {
		clearLocalStorage('user_details').then(data => {
			const resetAction = StackActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: 'SelectUser' })],
			});
			this.props.navigation.dispatch(resetAction);
		});
	};

	/**
	 * Delete Account API call
	 */
	deleteApiCall = () => {
		this.refs.Load.OpenLoad();
		const param = {
			user_id: commonData.user_details.user_id,
		};
		//console.log(param);
		postApiRequestWithHeaders(
			commonData.api_endpoint.delete_account,
			param,
		).then(
			data => {
				this.refs.Load.CloseLoad();
				//console.log(data);
				showToast(data.message);
				this.logOutFunc();
			},
			error => {
				this.refs.Load.CloseLoad();
				this.logOutFunc();
				errorHandler(error, this.props);
			},
		);
	};

	/**
	 * Call back events from children componnets///
	 */
	callbackFunction = page => {
	//	console.log("callback",page)
		if(page != 'push' && page != 'reset'  ){
			this.setState({ toggle_menu: !this.state.toggle_menu });
		}
		switch (page) {
			case 'close': {
				this.setState({ toggle_menu: !this.state.toggle_menu });
				setTimeout(() => {
					console.log("force update")
					this.forceUpdate();
				}, 1000);
				break;
			}
			case 'help': {
				//  //console.log('help');
				this.props.navigation.navigate('CommonPage', {
					page: 'help',
					headerText: 'Help!',
				});
				break;
			}
			case 'callHistory': {
				// //console.log('callHistory');
				this.props.navigation.navigate('CommonPage', {
					page: 'callHistory',
					headerText: 'Call History',
				});

				break;
			}
			case 'call_hitsory': {
				// //console.log('callHistory');
				this.props.navigation.navigate('CommonPage', {
					page: 'callHistory',
					headerText: 'Call History',
				});

				break;
			}
			case 'updateProfile': {
				this.props.navigation.navigate('CommonPage', {
					page: 'updateProfileImage',
					headerText: 'Update Profile',
				});

				break;
			}
			case 'cardInfo': {
				let view =
					commonData.user_details.cards.length == 0 ? 'intro' : 'addCard';
				let is_exist = commonData.user_details.cards.length == 0 ? false : true;
				this.props.navigation.navigate('OwnerPayment', {
					view: view,
					is_exist: is_exist,
				});
				break;
			}

			case 'paymentInfo': {
				let view =
					this.props.user.cards.length == 0 ? 'intro' : 'addCard';
				let is_exist = this.props.user.cards.length == 0 ? false : true;
				this.props.navigation.navigate('OwnerPayment', {
					view: view,
					is_exist: is_exist,
				});
				break;
			}
			case 'expertise': {
				this.props.navigation.navigate('EditCategory');
				break;
			}
			case 'account': {
				this.props.navigation.navigate('EnterName',{type:'edit'});
				break;
			}
			case 'editLicense': {
				this.props.navigation.navigate('TicketDescription', {
					page: 'TicketDescription',
					categories: commonData.user_details.categories,
				});

				break;
			}
			case 'updatePassword': {
				//  //console.log('updatePassword');
				this.props.navigation.navigate('CommonPage', {
					page: 'updatePassword',
					headerText: 'Update Password',
				});

				break;
			}
			case 'updatePhoneNumber': {
				//  //console.log('updatePhoneNumber');
				this.props.navigation.navigate('EnterPhoneNumber', {
					text: 'Update',
					onGoBack: () => this.refresh(),
				});
				break;
			}
			case 'rating': {
				this.setState({ toggle_menu: !this.state.toggle_menu });
				break;
			}
			case 'pushToggle': {
				//  //console.log('pushToggle');
				this.setState({ toggle_menu: !this.state.toggle_menu });
			 
				break;
			}
			case 'video': {
				// //console.log('video');
				openUrl('https://www.askkenapp.com/askken_video.mp4');

				break;
			}
			case 'logout': {
				const param = {
					user_id: this.props.user.user_id,
				};
				postApiRequestWithHeaders(commonData.api_endpoint.log_out, param,this.props.user.access_token).then(
					data => {
						this.logOutFunc();
					},
					error => {
						this.logOutFunc();
					},
				);
				break;
			 }
			case 'terms': {
				setTimeout(() => {
					openUrl('https://www.askkenapp.com/terms');
				}, 1000);
				break;
			}
			case 'deleteAccount': {
				alertWithTwoBtn(
					'Delete Account',
					commonData.ToastMessages.delete_account,
					'No',
					'Yes',
				).then(data => {
					//   //console.log(data);
					if (data) {
						this.deleteApiCall();
					}
				});
				break;
			}
			case 'report': {
				//console.log("rporp")
				var url = 'mailto:help@askkenapp.com?subject=Report a problem&body=&cc=';
				Linking.openURL(url);
				break;
			}

			case "notify_me": {
				let param = { push_enable: true };
				this.togglePushApi(param);
				break;
			}

			case "skip_notification": {
				this.setState({ params: undefined })
				break;
				// this.props.navigation.state.params = undefined;
			}

			case 'reset': {
				this.setState({
					current_ticket: {}
				})
			 // this.getUserDetails();
				break;
			}

		}
	};

	/**Call back from Expert Side Menu */
	expertNavigator = page => {
		////console.log(page, "klll")
		switch (page) {
			case 'help': {
				if (commonData.current_version < commonData.latest_version) {
					alertWithSingleBtn(
						'Update Required',
						commonData.ToastMessages.update_app_msg,
						'Update',
					).then(data => {
						if (data) {
							openUrl('https://apps.apple.com/us/app/ask-ken/id1492781352?ls=1');
						}
					});
				} else {
					this.props.navigation.navigate('CommonPage', {
						page: 'help',
						headerText: 'Help',
					});
				}
				break;
			}

			case "reject_ticket":
				this.rejectTicket() 
				break; 
			case "accept_ticket":
				this.acceptTicket();
				break;
			case 'rating':
				//  //console.log("rating called....");
				this.props.navigation.navigate('CommonPage', {
					page: 'showRating',
					headerText: 'Your Rating',
				});
				break;
				case 'earning':
					//  //console.log("earning called....");
					this.props.navigation.navigate('CommonPage', {
						page: 'showEarning',
						headerText: 'Earning History',
						
					onGoBack: () => this.refresh(),
				
					});
					
				break;
		}
	};

	/*When expert accepts ticket*/
	acceptTicket=()=>{   
			var param={
				ticket_id : this.state.all_job[swiperRef.current.state.firstCardIndex].ticket_id,
				time_zone: commonData.time_zone
			}  

		 this.refs.Load.OpenLoad();
			postApiRequestWithHeaders(
				commonData.api_endpoint.accept_ticket,
				param, this.props.user.access_token
			).then(
				data => {
					if(this.props.user.phone_number == undefined || this.props.user.phone_number == ''){
						crashlytics().log("AcceptTicket");
					}else{
						crashlytics().log("AcceptTicket "+this.props.user.phone_number.split(" ").join(""));
					}  
					AppEventsLogger.logEvent("Ticket accepted", {type:"owner"});
					this.setState({
						all_job: data.all_tickets
					})
					this.props.setAllTickets(data.all_tickets)
					var  user_data = this.props.user;
					user_data.current_ticket = data.ticket_data;
					this.props.setCurrentTicket(data.ticket_data);
					this.props.setUserData(user_data);
					this.refs.Load.CloseLoad();
					setTimeout(() => {           
					this.props.navigation.navigate("TicketChat");     
					}, 500);         
				},
				error => {
				//	console.log(error,"llll");
					this.getUserDetails();
						setTimeout(() => {           
						this.refs.Load.CloseLoad();
						this.callToastFunction("Ticket no longer available", "error");
						}, 1500);
				
				},
			);

	}
/**When expert rejeects the tickets */
	rejectTicket = () => {
		console.log(swiperRef);
		var param={
			ticket_id : this.state.all_job[swiperRef.current.state.firstCardIndex].ticket_id
		}
		postApiRequestWithHeaders(
			commonData.api_endpoint.reject_ticket,
			param, this.props.user.access_token
		).then(
			data => {
				swiperRef.current.swipeRight();
				if(this.props.user.phone_number == undefined || this.props.user.phone_number == ''){
					crashlytics().log("RejectTicket");
				}
				else {
					crashlytics().log("RejectTicket "+this.props.user.phone_number.split(" ").join(""));
				}
				this.setState({
					all_job: data.all_tickets
				})
				this.props.setAllTickets(data.all_tickets)
			},
			error => {
				this.refs.Load.CloseLoad();
				errorHandler(error, this.props);
			},
		);
}


/**when swipe the ticket card */
	getSwiper = (text) => {

		return (
			<Swiper
				ref={swiperRef}
				all_job
				cards={this.state.all_job.length ==0 ? this.state.ads: this.state.all_job}
				renderCard={(card) =>
					this.showCard(card, text)		
				}
				onSwiping={(d,x) => this.onSwiping(d,x)}
				goBackToPreviousCardOnSwipeRight={true}
				cardIndex={this.state.card_index}
				infinite
				backgroundColor={"transparent"}
				stackSize={2}
				stackScale={4}
				stackSeparation={2}
			//	horizontalSwipe={(this.state.all_job.length == 0 && this.state.swipe_count !=0)? false : true}
			//	verticalSwipe={(this.state.all_job.length == 0 && this.state.swipe_count !=0) ? false : true}
				// horizontalSwipe={(this.state.all_job.length == 0 && this.state.swipe_count !=0)? false : true}
				// verticalSwipe={(this.state.all_job.length == 0 && this.state.swipe_count !=0) ? false : true}
			>
			</Swiper>
		)
	}


	/**On Swiping Card */
	onSwiping = (d,x) => {
		//console.log(`on swiped `, d, x );
		//	let swipe_once_card = false;
		if (Math.abs(Math.round(d)) == 0 && Math.abs(Math.round(x)) == 0) {
		//	console.log("truee")
			swipe_once_card = true;
		}
		//	console.log(swipe_once_card,"value")
		if (((Math.abs(d) > 70 && Math.abs(x) > 1) || Math.abs(x) > 100 || (Math.abs(d) > 40 && Math.abs(x) > 11) ||  (Math.abs(d) > 50 && Math.abs(x) > 0)) && swipe_once_card == true) {
			swipe_once_card = false;
			this.swipe_once_card = false;
			this.setState(
				{
					swipe_count :this.state.swipe_count+1
				}, () => {
					console.log(this.state.swipe_count, "hh1");
				}
			)
		}
	}
	
    
	handlePlaying = (isVisible) => {
	}

	dynamicText=()=>{
		if(this.state.push_enable == true){
			return "Push enable"
		}else{
			return "Push Disable"
		}
	}

	getData = ()=>{
		console.log("llll");
         console.log("kll")
	}
	showCard = (card, text) => {
		this.swipe_once_card = true;
		return ( 
		
			<View style={styles.card}>
				  {/**When job length = 0 and swipe count > 0  condition start*/}
				{this.state.all_job.length == 0 && this.state.swipe_count !=0 &&(
					<View>
						<Image style={styles.cardImage} source={no_jobs} />
						<View style={{ alignItems: 'flex-start', marginLeft: 0, padding: 20, paddingLeft:height < 680 ?10:0 ,paddingTop:0, }}>
							<Text style={{ fontFamily: 'AvenirLT-Black', color: colors.BLACK_TEXT, fontSize: 18, paddingBottom: 8 }}>No open jobs </Text>  
							{this.props.user.push_enable  == false && (
								<Text style={{ fontFamily: 'AvenirLTStd-Medium', color: colors.grey_heading, fontSize: 15, lineHeight: 18 }}>{text}</Text>
							)}
							{this.props.user.push_enable == true && (
								<Text style={{ fontFamily: 'AvenirLTStd-Medium', color: colors.grey_heading, fontSize: 15, lineHeight: 18, }}>{text}</Text>
							)}    
						</View>
					</View>
				)}
				{/**When job length = 0 and swipe count > 0  condition ends*/}
				
				 {/**When job length = 0 and swipe count = 0  condition start*/}
				{this.state.all_job.length == 0 && this.state.swipe_count ==0 &&(
					<View style={{ height: "100%", width: "100%", }}>
				
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<TouchableWithoutFeedback onPress={() => this.navigator('play_ad')} style={{flex:1, justifyContent:'center', alignItems:'center', zIndex:3, width: width-40}}>
								<Image source={play} style={{ zIndex: 5, height: 60, width: 60, justifyContent: 'center', position: 'absolute' }} />
								</TouchableWithoutFeedback> 
				   <Image style={[styles.cardImage, { height: "100%", width: '100%', resizeMode: 'cover', borderRadius: 5 }]}
						   source={this.state.ads[0].file_name}
					   />
			   </View>
				   <View style={{ alignItems: 'flex-start', zIndex: 3, position: 'absolute', bottom: 0, width: "100%", flex: 1, marginBottom: 0, padding: 10 }}>
					   <View style={styles.cardTextConatiner}>
						   <View style={{maxHeight: 150, }}>
							   <Text style={[styles.cardTextDescription,{color:colors.BLACK_TEXT, fontFamily:'Avenir-Heavy'}]}>
								   {this.state.ads[this.state.ad_index].description}
							   </Text>
							   
						   </View>
					   </View>
				   </View>
			   </View>
				)}
				{/**When job length = 0 and swipe count = 0 condition ends */}
				
			    {/**When job length > 0 and swipe count != mod 15  condition start*/}
				{this.state.all_job.length != 0 && (this.state.swipe_count%15!=0 || this.state.swipe_count ==0) && (
					<View style={{ height: "100%", width: "100%", }}>
						{card.file_type == "photo" && (
							<Image style={[styles.cardImage, { height: "100%", width: '100%', resizeMode: 'cover', borderRadius: 5 }]}
								source={{
									uri: card.file_name
								}}
							/>
						)}
						{card.file_type != "photo" && (
						 <TouchableWithoutFeedback onPress={() => this.navigator('play', card)} style={{flex:1, justifyContent:'center', alignItems:'center', zIndex:3, width: width-40}}>
							<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
						 <Image source={play} style={{zIndex:5, height:60, width:60, justifyContent:'center'}} />
						 <Video
								ref={(ref) => {
									this.player = ref
								}}
								paused={this.state.is_paused}
								pausedText={'Play'}
								resizeMode="cover"
								source={{ uri: card.file_name }}
								style={[styles.backgroundVideo,{zIndex:1}]} />
								
								</View>
						 </TouchableWithoutFeedback>   
						)}
						<View style={{ alignItems: 'flex-start', zIndex: 3, position: 'absolute', bottom: 0, width: "100%", flex: 1, marginBottom: 0, padding: 10 }}>
							<View style={styles.cardTextConatiner}>
								<View style={{ flexDirection: 'row', paddingBottom: 8, justifyContent: 'space-between' }}>
									<Text style={styles.cardTextTitle}>{card.category_name}</Text>
									<Text style={styles.cardTextPrice}>$45</Text>
								</View>
								<View style={{maxHeight: 50, }}>
									<Text style={[styles.cardTextDescription]}>
										{card.description.substring(0, 30)}
										{card.description.length > 40 ? "......" : null}
									</Text>
									
								</View>
							</View>
						</View>
					</View>
				)}

				 {/**When job length > 0 and swipe count != mod 15  condition start*/}

				 {/**When job length > 0 and swipe count = mod 15  condition start*/}
                {this.state.all_job.length != 0 && (this.state.swipe_count%15 ==0 && this.state.swipe_count!=0 ) && (
					<View style={{ height: "100%", width: "100%", }}>
						
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<TouchableWithoutFeedback onPress={() => this.navigator('play_ad')}  style={{flex:1, justifyContent:'center', alignItems:'center', zIndex:3, width: width-40}}>
								<Image source={play} style={{ zIndex: 5, height: 60, width: 60, justifyContent: 'center', position: 'absolute' }} />
								</TouchableWithoutFeedback>   
					    <Image style={[styles.cardImage, { height: "100%", width: '100%', resizeMode: 'cover', borderRadius: 5 }]}
								source={this.state.ads[0].file_name}
							/>
								
					</View>
						
					
						<View style={{ alignItems: 'flex-start', zIndex: 3, position: 'absolute', bottom: 0, width: "100%", flex: 1, marginBottom: 0, padding: 10 }}>
							<View style={styles.cardTextConatiner}>
								<View style={{maxHeight: 150, }}>
									<Text style={[styles.cardTextDescription,{color:colors.BLACK_TEXT, fontFamily:'Avenir-Heavy'}]}>
										{this.state.ads[this.state.swipe_count%2].description}
									</Text>
									
								</View>
							</View>
						</View>
					</View>
				)}
				 {/**When job length > 0 and swipe count = mod 15  condition ends*/}
			</View>
		
		);
	};

	popUpClick=(status)=>{
		this.setState({
			show_request_popUp:false
		})
		setItem('is_first_time', "false").then(
			res => {  
				if (res) {
					
				}
			},
			err => {
				console.log(err, "set err")
			},
		)
	}
	expertHomePage = () => {
		return (
			<Container>
				<Load ref="Load"></Load>
				{this.state.show_request_popUp && (
					<View style={{
						zIndex: 10,
						position: 'absolute',
						left: 0,
						bottom: 0,
						width: width,
						height: height,
					}}>
						<CommonAlert clickHandler={this.popUpClick} type="home_alert" title="What's next?" msg="Swipe left or right to view open help tickets. Tap the thumbs up to jump in and help. Tap the X to delete a ticket. That's it!"></CommonAlert>
					</View>
				)}
				<Header transparent style={styles.header}>
					<Left style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
						<Image
							style={[
								{
									marginLeft: 0,
									height: 35,
									width: 60,
									marginTop:2,
									resizeMode: 'contain',
								},
							]}
							source={home_ask}
						/>
						<Button
							transparent
							onPress={() => this.navigator('side_menu')}>
							<Image style={styles.image} source={side_menu} />
						</Button>
					</Left>
					<Right>
				 
						<Button
							transparent
							onPress={() => this.expertNavigator('earning')}>
							<Image style={styles.image} source={bag_menu} />
							{this.props.user.earning_count != 0 &&(
									<View style={{position:'absolute',bottom:25,right:13, zIndex:1, borderRadius:50,borderWidth:2, borderColor:colors.LIGHT_COLOR}}>
									<View style={{backgroundColor:colors.blue,borderRadius:50,}}>
									<Text style={{fontSize:13, color:colors.LIGHT_COLOR,fontFamily: 'AvenirLT-Black',paddingLeft:4,paddingRight:4 ,}}>{this.props.user.earning_count}</Text>
									</View>      
								</View>
							)}
					 
						</Button>         
						<Button
							transparent
							onPress={() => this.navigator('chatlist')}>
							<Image style={[styles.image, { marginLeft: 0 }]} source={chat} />         
						</Button>
						{this.state.chatArray.length!= 0 &&(
									<View style={{position:'absolute',bottom:25, zIndex:1, borderRadius:50,  borderWidth:2, borderColor:colors.LIGHT_COLOR}}>
										<View style={{backgroundColor:colors.blue,borderRadius:50,}}>
										<Text style={{fontSize:13, color:colors.LIGHT_COLOR,fontFamily: 'AvenirLT-Black',paddingLeft:4,paddingRight:4 , textAlign:'center'}}>{this.state.chatArray.length== 0 ? '  ': this.state.chatArray.length}</Text>
										</View>
								 
									</View>
						)}
					 
					</Right>
				</Header>

				<View style={[styles.mainContainer, {}]}>
			 
					{this.state.showCustomToast ? (
						<View style={{
							position: "absolute",
							bottom: 0,
							zIndex: 2
						}}>
							<CommonToast type={this.state.type} message={this.state.message} />
						</View>
					) : null}
				
					<View style={{ flex: 1, alignItems: 'center', }}>
					{this.props.user.push_enable == false &&(
							this.getSwiper("More will be available soon. Tap below\nto get notified as soon as they're posted.")
					)}
					{this.props.user.push_enable == true &&(
							this.getSwiper("You'll be notified as soon as more help\ntickets are posted.")
					)}
			
					{this.state.all_job.length == 0 && this.props.user.push_enable == false && this.state.swipe_count!=0 && (
						<View style={[styles.continueBtnContainer, {}]}>
							<Button style={styles.continueBtn} onPress={() => this.navigator('push')}>
								<Text style={styles.continueBtnTxt}>Turn On Notifications</Text>
							</Button>
						</View>
					)}
					{(this.state.all_job.length != 0 && (this.state.swipe_count%15 !=0 || this.state.swipe_count ==0)) && (
						<View style={[styles.cardBtnContainer, { flexDirection: 'row',bottom: height < 680? 30: 55 }]}>
							<Button style={styles.continueBtn1} transparent onPress={() => { this.expertNavigator('reject_ticket') }}>
								<Image style={[styles.cardBtnImage, { marginRight: 15 }]} source={reject} />
							</Button>

							<Button style={styles.continueBtn1} transparent onPress={() => { this.expertNavigator('accept_ticket') }}>
								<Image style={[styles.cardBtnImage, { marginLeft: 15 }]} source={accept} />
								</Button>
								
						</View>
						)}
						
						{(this.state.all_job.length != 0 && this.state.swipe_count%15 ==0 &&  this.state.swipe_count !=0) && (
						<View style={[styles.cardBtnContainer, { flexDirection: 'row',bottom: height < 680? 30: 55 }]}>
							<Button style={[styles.continueBtn1,{padding:20, minHeight:50}]}  onPress={() => { openUrl('https://www.askkenapp.com/plugin') }}>
								<Text style={{color:colors.LIGHT_COLOR, fontFamily: 'Avenir-Heavy',fontSize:20,}}>Free Trial</Text>
							</Button>			
						</View>
						)}
						
						{this.state.all_job.length == 0 && this.state.swipe_count==0 && (
						<View style={[styles.cardBtnContainer, { flexDirection: 'row',bottom: height < 680? 30: 55 }]}>
							<Button style={[styles.continueBtn1,{padding:20, minHeight:50}]}  onPress={() => { openUrl('https://www.askkenapp.com/plugin') }}>
								<Text style={{color:colors.LIGHT_COLOR, fontFamily: 'Avenir-Heavy',fontSize:20,}}>Free Trial</Text>
							</Button>			
						</View>
					)}
				</View>
				</View>
				<Modal isVisible={this.state.toggle_menu}
					hideModalContentWhileAnimating={true}
					onSwipeComplete={() => this.setState({ toggle_menu: !this.state.toggle_menu })}
					swipeDirection="down"
					onBackdropPress={() => this.setState({ toggle_menu: !this.state.toggle_menu })}
				>
					<SideMenu
						parentCallback={this.callbackFunction}
					></SideMenu>
				</Modal>

				<Modal isVisible={this.state.show_full_video}
					hideModalContentWhileAnimating={true}
					onSwipeComplete={() => this.setState({ show_full_video: !this.state.show_full_video })}
					swipeDirection="down"
					animationIn={"zoomIn"}
					animationOut={"zoomOut"}
					style={{backgroundColor:colors.grey_bg}}
				>
				<View style={{flex:1, backgroundColor:colors.grey_bg}}>
						<Button  onPress={() => this.navigator('play')} transparent hitSlop={hitSlop} style={{zIndex:4, marginTop:30, height:60}}>
												<Icon style={[
															 {color:colors.LIGHT_COLOR, fontSize:50},
														]}  name="ios-close"/>
						</Button>
						<Video ref={(ref) => {
									this.player = ref
						}}
						onLoad={(data)=>this.onBuffer(data)}  
						       repeat={true}
								resizeMode="cover"
								source={{ uri:this.state.video_file }}
							style={[styles.backgroundVideo, { zIndex: 1, backgroundColor: colors.card_border_outline }]} />
						
						{this.state.is_load && ( <View style={[styles.horizontal]}>
									<ActivityIndicator size="large" color={colors.gray_input} />
						    </View>
						)}

				</View>
				</Modal>
			
			</Container>
		)
	}

	ownerHomePage = () => {
		return (
			<Container>
					{Object.keys(this.state.current_ticket).length == 0 && (
				<Header transparent style={styles.header}>
					<Left />
					<Body>
						<Image
							style={[
								{
									marginLeft: 0,
									height: 35,
									width: 35,
									resizeMode: 'contain',
								},
							]}
							source={header_logo}
						/>
					</Body>
					<Right>
						<Button
							transparent
							onPress={() => this.navigator('side_menu')}>
							<Image style={styles.image} source={side_menu_black} />
						</Button>
					</Right>
				</Header>
			)}
				{Object.keys(this.state.current_ticket).length == 0 && (
					<View style={[styles.mainContainer,]}>
						<View style={styles.mainContent}>
							<Text style={styles.headingText}>
								Hi {this.props.user.name}! What{'\n'}kind of home help{'\n'}do you need? <Text style={{ color: colors.grey_heading, fontWeight: 'bold' }}>
									Your{'\n'}satisfaction is always{'\n'}guaranteed for $35.
						</Text>
							</Text>
						</View>
						<MultipleCategory
							ref={this.checkBoxes}
							clickHandler={this.navigator}
							showNext={false}
							type={'post_ticket'}
							selectedCategory={[]}></MultipleCategory>
					</View>
				)}
			 

				<Modal
				isVisible={this.state.toggle_menu}
				 onBackdropPress={() => this.setState({ toggle_menu: !this.state.toggle_menu })}
				 hideModalContentWhileAnimating={true}
					onSwipeComplete={() => this.setState({ toggle_menu: !this.state.toggle_menu })}
					swipeDirection="down"
					>
					<SideMenu
						parentCallback={this.callbackFunction}>
					</SideMenu>

				</Modal>


				{Object.keys(this.state.current_ticket).length > 1 && (
						<TicketChat navigation={this.props.navigation}   parentCallback={this.callbackFunction}>
						</TicketChat>
				)}
			</Container>
		)
	}


	render() {
		return (
			this.props.user.user_type == "expert" ? this.expertHomePage() : this.ownerHomePage()
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user.userData,
		signUp_data: state.user,
		all_tickets: state.all_tickets
	}
}
export default connect(mapStateToProps, { selectedCategory, setChatLists, setUserData, setAllTickets,setCurrentTicket })(HomePage);

