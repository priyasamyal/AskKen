import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Keyboard, AppState, ActivityIndicator } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AutogrowInput from 'react-native-autogrow-input';
import analytics from '@react-native-firebase/analytics';
import Rating from '@components/Rating';
import Tip from '@components/Tip';
import EndCallPopUp from '@custom_components/EndCallPopUp';
import { AppEventsLogger } from "react-native-fbsdk";
import firebase from 'react-native-firebase';
import {
	Image,
	Linking, RefreshControl, TouchableWithoutFeedback,
} from 'react-native';
import {
	Container,
	Header,
	Left,
	Button,
	Body,
	Right,
	Icon,
} from 'native-base';
import moment from 'moment';
import CommonAlert from '@custom_components/CommonAlert';
import Hyperlink from 'react-native-hyperlink'
// create a component
import { colors, } from '../../common/index';
import { Dimensions } from 'react-native';
import commonData from '../../common/data.js';
var { width, height } = Dimensions.get('window');
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
const hitSlop1 = { top: 30, left: 30, right: 30, bottom: 30 };
import styles from './styles';
import SideMenu from '@custom_components/SideMenu';
import { setUserData, setCurrentTicket, setSession } from "../../actions";
import { StackActions, NavigationActions } from 'react-navigation';
import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'
import {
	postApiRequestWithHeaders, errorHandler,
	clearLocalStorage,
	socket,
	alertWithTwoBtn,
	video_options, options
} from '../../common/user';
import SocketIOClient from 'socket.io-client';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import Load from 'react-native-loading-gif';
import { connect } from "react-redux";
import CameraScreen from '../../components/camera';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import VideoScreen from '../../components/Video';
import { RNS3 } from 'react-native-aws3';
import CommonToast from "@custom_components/CommonToast";
import Video from 'react-native-video';
import FullScreen from '../../components/FullScreen';
import crashlytics from '@react-native-firebase/crashlytics';
import TimeZone from 'react-native-timezone';
const play = require('../../assets/imgs/play.png');
const phone = require('../../assets/imgs/phone.png');
const side_menu_black = require('../../assets/imgs/side_menu_black.png');
const video = require('../../assets/imgs/video_icon.png');
const camera = require('../../assets/imgs/image_icon.png');
const send_off = require('../../assets/imgs/send_off.png');
const send_on = require('../../assets/imgs/send_on.png');
const cross = require('../../assets/imgs/cross.png');
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4

//used to make random-sized messages
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// The actual chat view itself- a ScrollView of BubbleMessages, with an InputBar at the bottom, which moves with the keyboard
class TicketChat extends Component {

	is_refresh = false;
	socket = SocketIOClient('https://www.askkenapp.com:3000/', { jsonp: true, secure: true, transports: ['websocket'] });
	constructor(props) {
		super(props);
		is_refresh = false;

		this.state = {
			messages: [],
			image_selected: false,
			uri: '',
			image_type: '',
			showCamera: false,
			showVideo: false,
			toggle_menu: false,
			msg: '',
			tmp_msg: '',
			isInputFocus: false,
			img_object: {},
			page_no: 0,
			iMaxPages: 0,
			show_full_video: false,
			video_file: '',
			type: "",
			show_full_screen: false,
			full_screen_data: {},
			show_alert: false,
			title: '',
			alert_type: '',
			alert_desc: '',
			inputBarText: '',
			refreshing: false,
			appState: AppState.currentState,
			time_zone: '',
			showRating: "",
			ticket: this.props.ticket_data.current_ticket,
			unsendMedia: []
		}
		socket.on('error', function (err) {
			console.log(err, "Error Socket");
		});

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
				console.log("send Push")
			},
			error => {
				errorHandler(error, this.props);
			},
		);
	}

	/**Handle App foreground and Background State */
	_handleAppStateChange = nextAppState => {
		crashlytics().log('App State ' + nextAppState);
		console.log("App State..", nextAppState);
		console.log("ccalinng", this.props.ticket_data.current_ticket)
		if (nextAppState === "active") {
			this.setState({
				page_no: 0
			})
			if (this.props.user.user_type == "expert" && this.props.ticket_data.current_ticket.job_status == "regenerated" && this.props.ticket_data.current_ticket.assigned_status == null) {
				console.log("no call")
			}
			else if (this.props.user.user_type == "owner" && this.props.ticket_data.current_ticket.assigned_id == null) {
				this.ticketDetailbyOwner();
			}
			else {
				console.log("ccalinng")
				this.getChatList();
			}
		} else {

		}

		if (nextAppState == "background") {
			firebase.notifications().setBadge(0);
			this.sendSilentPush(0);

		}
		this.socket.on('connect', () => {
		}, err => {
		});
		this.socket.emit('join_group', { chat_room_id: this.props.ticket_data.current_ticket.chat_room_id, username: this.props.user.name, time_zone: commonData.time_zone });
		this.setState({ appState: nextAppState });
	};

	ticketDetailbyOwner = () => {
		let param = {
			ticket_id: this.props.ticket_data.current_ticket.ticket_id,
			receiver: "owner"
		}
		console.log(param);
		postApiRequestWithHeaders(
			commonData.api_endpoint.ticket_detail,
			param, this.props.user.access_token
		).then(
			data => {
				console.log(data, "ticket detail ticketDetailbyOwner");
				let user_data = this.props.user;
				user_data.current_ticket = data.current_ticket;
				this.props.setUserData(user_data);
				this.props.setCurrentTicket(data.current_ticket);
				this.getChatList();
			},
			error => {

			},
		);
	}

	/**Common Toast Message*/
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

	/**HGet Chat Data */
	getChatList = () => {
		let param = {};
		if (this.props.ticket_data.current_ticket.assigned_id == null) {
			param = {
				page_no: this.state.page_no,
				chat_room_id: this.props.ticket_data.current_ticket.chat_room_id,
				number_of_result: 25,
				time_zone: commonData.time_zone
			}
		} else {
			param = {
				page_no: this.state.page_no,
				assigned_id: this.props.ticket_data.current_ticket.assigned_id,
				number_of_result: 25,
				time_zone: commonData.time_zone
			}
		}
		postApiRequestWithHeaders(
			commonData.api_endpoint.getChatList,
			param, this.props.user.access_token
		).then(
			data => {
				let chatData = data.chats;
				chatData.map((m, index) => {
					return m.isLoad = false
				})

				this.setState({
					messages: chatData,
					iMaxPages: data.total_pages,
					refreshing: false
				})

				this.socket.emit('read_messages', { chat_room_id: this.props.ticket_data.current_ticket.chat_room_id, type: this.props.user.user_type, assigned_id: this.props.ticket_data.current_ticket.assigned_id });
				setTimeout(() => {
					this.GoTo_bottom_function();
				}, 500);
			},
			error => {

			},
		);
	}
	/**Options when user select gallery or camera to upload photo */
	chooseAction = action => {
		switch (action) {
			case 'gallery': {
				check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {

					switch (result) {
						case RESULTS.DENIED:
							request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {

								if (RESULTS.GRANTED == result) {
									ImagePicker.openPicker({
										// cropperCancelText: 'Retake',
										mediaType: 'photo',
										// cropping: true,
										// cropperChooseText: 'Next',
										// compressImageQuality: 1,
										compressImageQuality: 0.8,
										// cropperToolbarTitle: 'Crop',
										// cropperCircleOverlay: false,
										includeBase64: false,
										// cropperToolbarTitle: 'Move and Scale',
										// avoidEmptySpaceAroundImage: true,
									}).then(
										image => {
											console.log(image, "Image");
											var file_name = Date.now() + image.filename;
											image.file_name = file_name;
											this.setState({ image_selected: true, uri: "file://" + image.path, img_object: image, image_type: 'photo' });
										},
										error => {
											this.setState({ disabled: false });
											//console.log(error, 'eroro');
										},
									);

								}

							});

							break;
						case RESULTS.GRANTED:
							ImagePicker.openPicker({
								// cropperCancelText: 'Retake',
								mediaType: 'photo',
								// cropping: true,
								// cropperChooseText: 'Next',

								compressImageQuality: 0.8,
								// compressImageQuality: 1,
								// compressImageMaxWidth: 15000,
								// compressImageMaxHeight: 10000,
								// cropperToolbarTitle: 'Crop',
								// cropperCircleOverlay: false,
								includeBase64: false,
								// cropperToolbarTitle: 'Move and Scale',
								// avoidEmptySpaceAroundImage: true,
							}).then(
								image => {
									console.log(image, "Image");
									var file_name = Date.now() + image.filename;
									image.file_name = file_name;
									this.setState({ image_selected: true, uri: "file://" + image.path, img_object: image, image_type: 'photo' }, () => {
									});
								},
								error => {
									this.setState({ disabled: false });
									//console.log(error, 'eroro');
								},
							);
							break;
						case RESULTS.BLOCKED:
							alertWithTwoBtn(
								'Permission Required',
								commonData.ToastMessages.access_gallery,
								'Not Now',
								'Open Settings',
							).then(data => {
								//console.log(data);
								if (data) {
									Linking.openSettings();
								}
							});
					}
				});

				break;
			}

			default:
				break;
		}
	};

	/**Set Image variable after selecting */
	setImages = (data) => {
		this.setState({ showCamera: false, image_selected: true, uri: data.uri.path, image_type: 'photo' });
		var file_name = Date.now() + data.uri.filename;
		data.uri.file_name = file_name;
		this.setState({ img_object: data.uri });
	}
	/**Select Video variables after selecting */
	setVideo = (data) => {
		this.setState({ showVideo: false, image_selected: true, uri: data.uri, type: 'video', image_type: 'video' });
	}

	getActionSheetRef = ref => (this.actionSheet = ref);
	showActionSheet = () => {
		this.actionSheet.show()
	}

	getVideoActionSheetRef = ref => (this.video_actionSheet = ref);
	showVideoActionSheet = () => {
		this.video_actionSheet.show()
	}

	/*Event to Load  Video after selecting */
	onLoad = (data) => {
		if (data.duration > 15) {
			setTimeout(() => {
				this.setState({
					message: commonData.ToastMessages.video_duration,
					type: "error",
					showCustomToast: true
				})
			}, 100);

			setTimeout(() => {
				this.setState({
					showCustomToast: false
				});
			}, 3000);
		} else {
			this.setState({ showCamera: false, type: '' });
		}
	};
	/**CHeck which option user has selected */
	handleImagePress = index => {
		if (index == 2) {
			setTimeout(() => {
				this.chooseAction("gallery")
			}, 200);
		}
		else if (index == 1) {
			this.setState({ showCamera: true });
		}
	}

	/**Click Event */
	navigator = (navigateTo, data) => {

		switch (navigateTo) {
			case "image":
				this.showActionSheet();
				break;
			case "video":
				this.setState({ showVideo: true });
				break;
			case 'back': {
				this.socket.emit('leave_group', { chat_room_id: this.props.ticket_data.current_ticket.chat_room_id, username: this.props.user.name });
				this.socket.emit('read_messages', { chat_room_id: this.props.ticket_data.current_ticket.chat_room_id, type: this.props.user.user_type, assigned_id: this.props.ticket_data.current_ticket.assigned_id });
				if (this.props.navigation.state.params != undefined) {
					this.props.navigation.state.params.onGoBack();
				}
				this.props.navigation.goBack();
				break;
			}
			case 'skip': {
				this.setState({
					showCamera: false,
					showVideo: false
				})
				break;

			}
			case 'hide': {
				this.props.parentCallback('hide');
				break;
			}
			case 'logout': {
				const param = {
					user_id: this.props.user.user_id,
				};
				postApiRequestWithHeaders(commonData.api_endpoint.log_out, param, this.props.user.access_token).then(
					data => {
						this.logOutFunc();
					},
					error => {
						this.logOutFunc();
					},
				);
				break;
			}
			case 'side_menu': {
				this.setState({ toggle_menu: true });
				break;
			}
			case 'show_popUp': {
				if (this.props.ticket_data.current_ticket.job_status == "marked_by_expert") {
					Keyboard.dismiss();
					setTimeout(() => {
						this.setState({
							title: 'Satisfied?',
							alert_type: 'pay_pro',
							alert_desc: 'Your Pro has indicated that this job is done. Please confirm and your payment will be securely sent to your Pro.',
							show_alert: true,
						})
					}, 500);
				}

				break;
			}

			case 'send': {
				if (this.props.user.phone_number == undefined || this.props.user.phone_number == '') {
					crashlytics().log("Send Message Function Call");
				} else {
					crashlytics().log("Send Message Function Call " + this.props.user.phone_number.split(" ").join(""));
				}
				if (this.state.msg.trim() != "" && this.state.uri == '') {
					this.sendMessage();
				}
				else if (this.state.uri != '' && this.state.msg.trim() != "" && this.state.image_type == 'photo') {
					this.state.messages.push({
						id: 4,
						url: this.state.uri,
						sender_id: this.props.user.user_id,
						type: 'photo',
						createdAt: new Date(),
						profile_image: this.props.user.user_type == "expert" ? this.props.user.profile_image : '',
						isLoad: true
					},
						{
							msg: this.state.msg,
							url: '',
							sender_id: this.props.user.user_id,
							type: 'text',
							createdAt: new Date(),
							profile_image: this.props.user.user_type == "expert" ? this.props.user.profile_image : '',
							isLoad: false
						});

					let temp_msg = this.state.msg;
					this.setState({ tmp_msg: temp_msg, uri: '', image_selected: false, msg: '', messages: this.state.messages })
					this.uploadPhoto('with_text');
					if (this.scrollView != undefined) {
						this.scrollView.scrollToEnd({ animated: false });
					}
				}
				else if (this.state.uri != '' && this.state.msg.trim() == "" && this.state.image_type == 'photo') {
					console.log(this.state.uri, "uriDum")
					// return;
					this.setState({ uri: '', image_selected: false, msg: '' });
					this.uploadPhoto();
					this.state.messages.push({
						id: 4,
						url: this.state.uri,
						sender_id: this.props.user.user_id,
						type: 'photo',
						createdAt: new Date(),
						profile_image: this.props.user.user_type == "expert" ? this.props.user.profile_image : '',
						isLoad: true
					});
					this.setState({ messages: this.state.messages });
					if (this.scrollView != undefined) {
						this.scrollView.scrollToEnd({ animated: false });
					}
				}
				else if (this.state.uri != '' && this.state.msg.trim() == "" && this.state.image_type == 'video') {
					this.setState({ uri: '', image_selected: false, msg: '' });
					this.uploadVideo();
					this.state.messages.push({
						id: 4,
						url: this.state.uri,
						sender_id: this.props.user.user_id,
						type: 'video',
						createdAt: new Date(),
						profile_image: this.props.user.profile_image,
						isLoad: true
					});
					this.setState({ messages: this.state.messages });
					if (this.scrollView != undefined) {
						this.scrollView.scrollToEnd({ animated: false });
					}
				}
				else if (this.state.uri != '' && this.state.msg.trim() != "" && this.state.image_type == 'video') {

					this.state.messages.push({
						id: 4,
						url: this.state.uri,
						sender_id: this.props.user.user_id,
						type: 'video',
						createdAt: new Date(),
						profile_image: this.props.user.user_type == "expert" ? this.props.user.profile_image : '',
						isLoad: true
					},
						{
							msg: this.state.msg,
							url: '',
							sender_id: this.props.user.user_id,
							type: 'text',
							createdAt: new Date(),
							profile_image: this.props.user.user_type == "expert" ? this.props.user.profile_image : '',
						});
					if (this.scrollView != undefined) {
						this.scrollView.scrollToEnd({ animated: false });
					}
					let temp_msg = this.state.msg;
					this.setState({ tmp_msg: temp_msg, uri: '', image_selected: false, msg: '' })
					this.uploadVideo('with_text');
				}
				break;
			}
			case "image_cancel": {
				this.setState({
					image_selected: false,
					uri: ''
				})
				break;
			}
			case "play": {
				if (data != undefined) {
					this.setState({ video_file: data.url }, () => {
						this.setState({ show_full_video: !this.state.show_full_video })
					})
				} else {
					this.setState({ show_full_video: !this.state.show_full_video })
				}
				break;
			}
			case "view_photo": {
				this.setState({
					full_screen_data: data,
					show_full_screen: true
				})
				break;
			}


		}
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

	handleVideoPress = index => {
		if (index == 2) {
		}
		else if (index == 1) {
			this.setState({ showVideo: true });
		}
	}

	GoTo_bottom_function = () => {
		if (this.scrollView != undefined) {
			this.scrollView.scrollToEnd({ animated: false });
		}
	}

	//fun keyboard stuff- we use these to get the end of the ScrollView to "follow" the top of the InputBar as the keyboard rises and falls
	componentWillMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
	}

	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
		AppState.removeEventListener("change", this._handleAppStateChange);
	}

	//When the keyboard appears, this gets the ScrollView to move the end back "up" so the last message is visible with the keyboard up
	//Without this, whatever message is the keyboard's height from the bottom will look like the last message.
	keyboardDidShow(e) {
		if (this.scrollView != undefined) {
			this.scrollView.scrollToEnd({ animated: false });
		}
	}

	//When the keyboard dissapears, this gets the ScrollView to move the last message back down.
	keyboardDidHide(e) {
		if (this.scrollView != undefined) {
			this.scrollView.scrollToEnd({ animated: false });
		}
	}
	//scroll to bottom when first showing the view. Listen all events and initial API calls
	componentDidMount() {

		console.log(this.props, "lklklklkl....")
		if (this.props.user.user_type == 'owner') {
			this.getUserDetailsfromStart()
		}
		TimeZone.getTimeZone().then(zone => {
			commonData.time_zone = zone
		});
		if (this.props.user.phone_number == undefined || this.props.user.phone_number == '') {
			crashlytics().log("EnterChat");
		} else {
			crashlytics().log("EnterChat " + this.props.user.phone_number.split(" ").join(""));
		}
		AppState.addEventListener("change", this._handleAppStateChange);
		if (this.props.ticket_data.current_ticket.job_status == 'cancelled' || this.props.ticket_data.current_ticket.assigned_status == 'cancelled') {
			this.setState({
				title: 'Job Cancelled',
				alert_type: 'common_alert',
				alert_desc: 'Owner has cancelled this help ticket.',
				show_alert: true,
			})
		}
		if ((this.props.ticket_data.current_ticket.job_status == 'regenerated_by_expert' || this.props.ticket_data.current_ticket.assigned_status == 'cancelled') && this.props.user.user_type == "expert") {
			Keyboard.dismiss();
			this.setState({
				title: 'Job Cancelled',
				alert_type: 'common_alert',
				alert_desc: 'You have cancelled this help ticket.',
				show_alert: true,
			})
		}
		if (this.props.ticket_data.current_ticket.job_status == 'marked_by_expert' && this.props.user.user_type == "expert") {
			Keyboard.dismiss();
			this.setState({
				title: 'Nice job!',
				alert_type: 'wait',
				alert_desc: 'Hang tight while we wait for the homeowner to confirm the job is complete.',
				show_alert: true,
			})
		}
		if (this.props.ticket_data.current_ticket.job_status == 'marked_by_owner' && this.props.user.user_type == "expert") {
			Keyboard.dismiss();
			this.setState({
				title: 'Job Complete',
				alert_type: 'wait',
				alert_desc: 'Your owner has completed this job. Your payment will be securely sent to your account within 5-6 working days.',
				show_alert: true,
			})

		}
		if (this.props.ticket_data.current_ticket.job_status == 'marked_by_expert' && this.props.user.user_type == "owner") {
			Keyboard.dismiss();
			console.log("show piop upp")
			setTimeout(() => {
				this.setState({
					title: 'Satisfied?',
					alert_type: 'pay_pro',
					alert_desc: 'Your Pro has indicated that this job is done. Please confirm and your payment will be securely sent to your Pro.',
					show_alert: true,
				})
			}, 500);

		}
		if (this.props.ticket_data.current_ticket.job_status == 'regenerated_by_expert' && this.props.user.user_type == "owner") {
			Keyboard.dismiss();
			this.setState({
				title: 'Finding Another Pro',
				alert_type: 'common_alert',
				alert_desc: "Your Pro has cancelled this job. We're now finding you the another perfect Pro.",
				show_alert: true,
			})

		}

		this.socket.on('on_request_reject', (data) => {
			Keyboard.dismiss();
			console.log("on_request_reject.....", data);
			this.props.setCurrentTicket(data.current_ticket);
			setTimeout(() => {
				this.setState({
					show_alert: false,
				})
				if (this.scrollView != undefined) {
					this.scrollView.scrollToEnd({ animated: false });
				}
			}, 500);
		})

		this.socket.on('on_request_complete', (data) => {
			console.log("on_request_complete.....", data);

			if (data.current_ticket.job_status == 'marked_by_expert' && this.props.user.user_type == "owner") {
				console.log("hit")
				this.props.setCurrentTicket(data.current_ticket);
				// Keyboard.dismiss();
				// setTimeout(() => {
				// 	this.setState({
				// 		title: 'Satisfied?',
				// 		alert_type: 'pay_pro',
				// 		alert_desc: 'Your Pro has indicated that this job is done. Please confirm and your payment will be securely sent to your Pro.',
				// 		show_alert: true,
				// 	})
				// }, 500);

			} else {
				this.props.setCurrentTicket(data.current_ticket);
				Keyboard.dismiss();
				this.setState({
					title: 'Job Complete',
					alert_type: 'wait',
					alert_desc: 'Your owner has completed this job. Your payment will be securely sent to your account within 5-6 working days.',
					show_alert: true,
				})
			}
		})

		this.socket.on('ticket_cancelled', (data) => {
			console.log("ticket_cancelled.....", data);
			if (this.props.user.user_type == "expert") {
				this.props.setCurrentTicket(data.current_ticket);

				Keyboard.dismiss();
				this.setState({
					title: 'Job Cancelled',
					alert_type: 'common_alert',
					alert_desc: 'Owner has cancelled this help ticket.',
					show_alert: true,
				})
			} else {
				console.log("on ticket calnce", data.current_ticket);

				let user_data = this.props.user;
				user_data.current_ticket = data.current_ticket;
				this.props.setUserData(user_data);
				this.props.setCurrentTicket(data.current_ticket);

				setTimeout(() => {
					this.getChatList();
				}, 1000);
				this.setState({
					messages: data.chat
				});
				Keyboard.dismiss();
				this.setState({
					title: 'Finding Another Pro',
					alert_type: 'common_alert',
					alert_desc: "Your Pro has cancelled this job. We're now finding you the another perfect Pro.",
					show_alert: true,
				})
			}
		})

		this.socket.on('ticket_cancel_response', (data) => {
			console.log("ticket_cancel_response.....", data);
			if (this.props.user.user_type != "expert") {
				let user_data = this.props.user;
				user_data.current_ticket = {};
				this.props.setUserData(user_data);
				this.props.parentCallback('reset');
			}
		})

		this.socket.on('connected', () => {
		})

		this.socket.on('connect', () => {
		}, err => {
		});


		if (this.props.ticket_data.current_ticket.assigned_status == "cancelled" && this.props.user.user_type == "expert") {
			console.log("not Join_param", this.props.ticket_data.current_ticket)
		} else {
			var join_param = {
				chat_room_id: this.props.ticket_data.current_ticket.chat_room_id, username: this.props.user.name
			}
			console.log(join_param, "join_param.", this.props.ticket_data.current_ticket);
			this.socket.emit('join_group', { chat_room_id: this.props.ticket_data.current_ticket.chat_room_id, username: this.props.user.name, time_zone: commonData.time_zone });
		}
		TimeZone.getTimeZone().then(zone => {
			commonData.time_zone = zone
			if (this.props.user.type == "expert" && this.props.ticket_data.current_ticket.job_status == "regenerated" && this.props.ticket_data.current_ticket.assigned_status == null) {

			} else {
				this.getChatList();
			}
		});


		this.socket.on('user_joined', (messages) => {
		});

		this.socket.on('receive_message', (messages) => {
			this.is_refresh = false;
			var date = new Date();
			var usaTime = date.toLocaleString("en-US", { timeZone: commonData.time_zone });
			messages.message[0].createdAt = usaTime
			this.state.messages.push(messages.message[0]);
			this.setState({
				messages: this.state.messages
			})
		});

		if (this.props.user.user_type == 'expert') {
			this.ticketDetail();
		}

	}

	ticketDetail = () => {
		let param = {
			ticket_id: this.props.ticket_data.current_ticket.ticket_id,
			receiver: "expert"
		}
		console.log(param);
		postApiRequestWithHeaders(
			commonData.api_endpoint.ticket_detail,
			param, this.props.user.access_token
		).then(
			data => {
				console.log(data, "ticket detail")
				let tem_ticket = this.props.ticket_data.current_ticket;
				tem_ticket.assigned_status = data.current_ticket.assigned_status;
				tem_ticket.job_status = data.current_ticket.job_status;
				this.props.setCurrentTicket(tem_ticket);
				if (data.current_ticket.job_status == "assigned") {
					this.setState({
						show_alert: false,
					})
				}
			},
			error => {

			},
		);
	}



	//this is a bit sloppy: this is to make sure it scrolls to the bottom when a message is added, but 
	//the component could update for other reasons, for which we wouldn't want it to scroll to the bottom.
	componentDidUpdate() {
		setTimeout(function () {
			if (this.is_refresh == false) {
				if (this.scrollView != undefined) {
					this.scrollView.scrollToEnd({ animated: false });
				}
			}

		}.bind(this))
	}

	_onChangeInputBarText(text) {
		this.setState({ msg: text })
	}

	//This event fires way too often.
	//We need to move the last message up if the input bar expands due to the user's new message exceeding the height of the box.
	//We really only need to do anything when the height of the InputBar changes, but AutogrowInput can't tell us that.
	//The real solution here is probably a fork of AutogrowInput that can provide this information.

	_onInputSizeChange() {
		setTimeout(function () {
			if (this.scrollView != undefined) {
				this.scrollView.scrollToEnd({ animated: false });
			}
		}.bind(this))
	}
	/**Show static message to user */
	showStaticMsg = () => {
		return (
			<View>
				<View style={[this.props.user.user_type == "owner" ? styles.receiverView : styles.senderView, { paddingLeft: 20, }]}>

				</View>
				{this.props.user.user_type == "owner" && (
					<View style={[this.props.user.user_type == "expert" ? styles.receiverView : styles.senderView, { paddingLeft: 20, marginRight: 30 }]}>
						<View style={[styles.profile_container, {}]}>
							<Image
								style={[styles.chatImage, { alignSelf: 'flex-end', marginRight: 10 }]}
								resizeMode="cover"
								source={require("../../assets/imgs/default_profile.png")} />
							<TouchableWithoutFeedback onPress={() => this.navigator('show_popUp')}>
								<View style={[this.props.user.user_type != "expert" ? styles.senderMessageBox : styles.receiverMessageBox, { backgroundColor: colors.BLACK_TEXT, }]}>
									<Hyperlink linkDefault={true}
										linkStyle={{ color: '#34B7F1', }}>
										{this.props.ticket_data.current_ticket.job_status != "regenerated_by_expert" && this.props.ticket_data.current_ticket.job_status != "marked_by_expert" && (
											<Text style={[this.props.user.user_type != "expert" ? styles.sendermessage : styles.message, { color: colors.LIGHT_COLOR }]}><Text style={[this.props.user.user_type != "expert" ? styles.sendermessage : styles.message, { color: colors.LIGHT_COLOR }]}>Hi {this.props.user.name}! Stay tuned, we're finding you the perfect Pro. You will be notified when they join the chat...</Text></Text>
										)}
										{this.props.ticket_data.current_ticket.job_status == "regenerated_by_expert" && (
											<Text style={[this.props.user.user_type != "expert" ? styles.sendermessage : styles.message, { color: colors.LIGHT_COLOR }]}>Hi {this.props.user.name}! Your Pro has cancelled this job. We're now finding you the another perfect Pro. You will be notified when they join the chat...
											</Text>
										)}

										{this.props.ticket_data.current_ticket.job_status == "marked_by_expert" && (
											// <TouchableWithoutFeedback onPress={() => this.navigator('show_popUp')}>
											<Text style={[this.props.user.user_type != "expert" ? styles.sendermessage : styles.message, { color: colors.LIGHT_COLOR }]}>{this.props.ticket_data.current_ticket.expert_name} has indicated this job is complete. Tap here to approve the job as complete.
											</Text>

											// </TouchableWithoutFeedback>
										)}

									</Hyperlink>
								</View>
							</TouchableWithoutFeedback>
						</View>

						<View style={[styles.SubTextContainer, { marginLeft: 40 }]}>
							<Text style={styles.subText}><Text style={{ fontFamily: 'Avenir-Heavy', }}>Ask Ken </Text> {this.props.ticket_data.current_ticket.job_status == "marked_by_expert" ? "" : moment(moment().format("YYYY-MM-DD")).isSame(moment(this.state.messages[0].createdAt).format("YYYY-MM-DD")) ? "Today " + moment(this.state.messages[0].createdAt).format("h:mma") :
								moment(this.state.messages[0].createdAt).format("MMM DD, h:mma")}</Text>
						</View>
					</View>
				)}
			</View>
		)
	}

	/**Show message list */
	_renderChat = (data, key) => {
		//	console.log(key,data,"lll")
		return (
			<View style={{}}>


				<View style={[this.props.user.user_id == data.sender_id ? styles.receiverView : styles.senderView, this.props.user.user_id != data.sender_id ? { paddingLeft: 20 } : {}]}>
					<View style={[styles.messageContainer, {}]}>
						{data.isLoad == true && (
							<View style={{
								position: "absolute", zIndex: 1,
								alignItems: "center",
								width: 130, height: 180,
								backgroundColor: colors.grey_bg, opacity: .5
							}}>
								<ActivityIndicator size="large" color={colors.gray_input} style={{ marginTop: 70, marginLeft: 0 }} />
							</View>
						)}
						{data.type == "text" && this.props.user.user_id != data.sender_id && (this.props.user.user_id != data.sender_id && this.props.user.user_type == "owner") && (
							<View style={[styles.profile_container, {}]}>
								{this.props.user.user_type != "expert" && (
									<Image style={[styles.chatImage, { alignSelf: 'flex-end', marginRight: 10 }]}
										resizeMode="contain"
										source={{ uri: commonData.profile_picture_url + data.profile_image }}
									/>
								)}
								<View style={this.props.user.user_type == "owner" && this.props.user.user_id == data.sender_id ? styles.receiverMessageContainer : {}}>
									<View style={[this.props.user.user_id == data.sender_id ? styles.receiverMessageBox : styles.senderMessageBox, { minWidth: 130 }]}>
										<Hyperlink linkDefault={true} linkStyle={{ color: '#34B7F1', }}
										>
											<Text style={this.props.user.user_id == data.sender_id ? styles.message : styles.sendermessage}>{data.msg}</Text>
										</Hyperlink>
									</View>
								</View>
							</View>
						)}
						{data.type == "text" && ((this.props.user.user_id == data.sender_id) || (this.props.user.user_id != data.sender_id && this.props.user.user_type == "expert")) && (
							<View style={this.props.user.user_type == "owner" && this.props.user.user_id == data.sender_id ? styles.receiverMessageContainer : {}}>
								<View style={[this.props.user.user_id == data.sender_id ? styles.receiverMessageBox : styles.senderMessageBox, { minWidth: 130 }]}>
									<Hyperlink linkDefault={true} linkStyle={{ color: '#34B7F1', }}
									>
										<Text style={this.props.user.user_id == data.sender_id ? styles.message : styles.sendermessage}>{data.msg}</Text>

									</Hyperlink>
								</View>
							</View>
						)}
						{data.type != "text" && this.props.user.user_id != data.sender_id && (this.props.user.user_id != data.sender_id && this.props.user.user_type == "owner") && (
							<View style={[styles.profile_container, {}]}>
								{this.props.user.user_id != data.sender_id && this.props.user.user_type == "owner" && (
									<Image style={[styles.chatImage, { alignSelf: 'flex-end', marginRight: 10 }]}
										resizeMode="cover"
										source={{ uri: commonData.profile_picture_url + data.profile_image }}
									/>
								)}
								<View style={{ alignItems: this.props.user.user_type == "owner" ? 'flex-end' : null }}>
									{data.type != "photo" && (
										<TouchableWithoutFeedback onPress={() => this.navigator('view_photo', data)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 3, width: width - 40 }}>
											<View style={{}}>

												<Image source={play} style={{ zIndex: 1, height: 50, width: 50, top: "35%", position: 'absolute', alignSelf: 'center' }} />
												<Video
													paused={"true"}
													resizeMode="cover"
													source={{ uri: data.url }}
													style={[styles.backgroundVideo, { marginBottom: 0 }]} />

											</View>
										</TouchableWithoutFeedback>
									)}
									{data.type == "photo" && (
										<TouchableWithoutFeedback onPress={() => this.navigator('view_photo', data)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 3, width: width - 40 }}>
											<Image
												style={[styles.backgroundVideo, { marginBottom: 0 }]}
												resizeMode="cover"
												source={{
													uri: data.url
												}} />
										</TouchableWithoutFeedback>
									)}

								</View>
							</View>

						)}
						{data.type != "text" && ((this.props.user.user_id == data.sender_id) || (this.props.user.user_id != data.sender_id && this.props.user.user_type == "expert")) && (
							<View style={{ alignItems: this.props.user.user_type == "owner" ? 'flex-end' : null }}>
								{data.type != "photo" && (
									<TouchableWithoutFeedback onPress={() => this.navigator('view_photo', data)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 3, width: width - 40 }}>
										<View style={{}}>
											<Image source={play} style={{ zIndex: 1, height: 50, width: 50, top: "35%", position: 'absolute', alignSelf: 'center' }} />
											<Video
												paused={true}
												resizeMode="cover"
												source={{ uri: data.url }}
												style={[styles.backgroundVideo, { marginBottom: 0 }]} />

										</View>
									</TouchableWithoutFeedback>
								)}
								{data.type == "photo" && (
									<>
										<TouchableWithoutFeedback onPress={() => this.navigator('view_photo', data)} style={{}}>
											<Image
												style={[styles.backgroundVideo, { marginBottom: 0 }]}
												resizeMode="cover"
												source={{
													uri: data.url
												}} />
										</TouchableWithoutFeedback>
									</>
								)}
							</View>
						)}
					</View>
					<View style={[styles.SubTextContainer, { marginLeft: this.props.user.user_type == "owner" ? 40 : 0 }]}>
						<Text style={styles.subText}><Text style={{ fontFamily: 'Avenir-Heavy', }}>{this.props.user.user_id == data.sender_id ? "Me " : data.sender_name + ' '}</Text>
							{moment(moment().format("YYYY-MM-DD")).isSame(moment(data.createdAt).format("YYYY-MM-DD")) ? "Today " + moment(data.createdAt).format("h:mma") :
								moment(data.createdAt).format("MMM DD, h:mma")}</Text>
					</View>
				</View>
				{/* )} */}
				{key == 1 && this.props.user.user_type == "owner" && this.state.page_no == this.state.iMaxPages && this.state.page_no == "0" && (
					this.showStaticMsg()
				)}
				{key == this.state.messages.length - 1 && this.props.user.user_type == "owner" && this.state.page_no == "0" && this.props.ticket_data.current_ticket.job_status == "marked_by_expert" && (
					this.showStaticMsg()
				)}
			</View>
		)
	}

	render() {
		return (
			<Container>
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

				{this.state.showRating == "rate" && this.props.user.user_type == "owner" && (
					<View style={{
						position: "absolute",
						bottom: 0,
						zIndex: 2
					}}>
						<Rating clickHandler={this.popUpClick} type={this.state.type} message={this.state.message} />
					</View>
				)
				}
				{this.state.showRating == "tip" && this.props.user.user_type == "owner" && (
					<View style={{
						position: "absolute",
						bottom: 0,
						zIndex: 2
					}}>
						<Tip navigation={this.props.navigation} clickHandler={this.popUpClick} tipHandler={this.tipClick} ticket_data={this.state.ticket} />
					</View>
				)
				}
				{this.state.show_alert && (
					<View style={{
						zIndex: 10,
						position: 'absolute',
						left: 0,
						bottom: 0,
						width: width,
						height: height,
					}}>
						<CommonAlert clickHandler={this.popUpClick} type={this.state.alert_type} title={this.state.title} msg={this.state.alert_desc} expert_profile={this.props.ticket_data.current_ticket.expert_profile}></CommonAlert>
					</View>
				)}
				<Load ref="Load" Image={0}></Load>
				{this.props.user.user_type == "expert" && (
					<Header transparent style={[styles.header, {}]}>
						<Left style={{ flex: 0.5, paddingLeft: 4, }}>
							<Button
								transparent
								hitSlop={hitSlop}
								onPress={() => this.navigator("back")}>
								<Icon
									style={[
										styles.black_text,
									]}
									name="arrow-back"
								/>
							</Button>
						</Left>
						<Body>
							<Text style={[styles.pageTitle, { flex: 3, flexShrink: 1, }]}>{this.props.user.user_type == "expert" ? this.props.ticket_data.current_ticket.owner_name + ' - ' : this.props.ticket_data.current_ticket.expert_name != null ? this.props.ticket_data.current_ticket.expert_name + ' - ' : ''}<Text style={{ color: colors.grey_heading }}>{this.props.ticket_data.current_ticket.category_name}</Text></Text>
						</Body>
						<Right style={{ flex: 0.5, paddingLeft: 4 }}>
							{(this.props.ticket_data.current_ticket.job_status == 'assigned' || this.props.ticket_data.current_ticket.job_status == 'inprogress' || this.props.ticket_data.current_ticket.job_status == null || this.props.ticket_data.current_ticket.job_status == "marked_by_expert") && (
								<Button
									transparent
									onPress={() => this.connectToCall()}>
									<Image style={styles.image} source={phone} />
								</Button>
							)}
							{(this.props.ticket_data.current_ticket.job_status == 'assigned' || this.props.ticket_data.current_ticket.job_status == 'inprogress' || this.props.ticket_data.current_ticket.job_status == null || this.props.ticket_data.current_ticket.job_status == 'created') && (
								<Button
									transparent
									onPress={() => this.navigator('side_menu')}>
									<Image style={styles.image} source={side_menu_black} />
								</Button>
							)}
						</Right>
					</Header>
				)}
				{this.props.user.user_type != "expert" && (
					<Header transparent style={[styles.header, {}]}>
						<Left style={{ flex: 4, paddingLeft: 4, flexWrap: 'wrap' }}>
							<Text numberOfLines={1} style={[styles.pageTitle, { flex: 3, flexShrink: 1, }]}>{this.props.user.user_type == "expert" ? this.props.ticket_data.current_ticket.owner_name : this.props.ticket_data.current_ticket.expert_name != null ? this.props.ticket_data.current_ticket.expert_name + ' - ' : ''} <Text style={{ color: colors.grey_heading }}>{this.props.ticket_data.current_ticket.category_name} Pro</Text></Text>
						</Left>
						<Body>

						</Body>
						<Right style={{ flex: 0.5, paddingLeft: 4 }}>
							{this.props.ticket_data.current_ticket.assigned_id != null && (
								<Button
									transparent
									onPress={() => this.connectToCall()}>
									<Image style={styles.image} source={phone} />
								</Button>
							)}
							<Button
								transparent
								onPress={() => this.navigator('side_menu')}>
								<Image style={styles.image} source={side_menu_black} />
							</Button>
						</Right>
					</Header>
				)}
				<View style={styles.outer}>

					<ScrollView
						keyboardDismissMode="on-drag"
						refreshing={false}
						refreshControl={
							<RefreshControl refreshing={this.state.refreshing} onRefresh={() => {
								this.is_refresh = true
								console.log("hit API for paginition...", this.state.page_no, this.state.iMaxPages);
								if (parseInt(this.state.page_no) < parseInt(this.state.iMaxPages)) {
									this.setState({
										refreshing: true
									})
									if (this.state.messages.length > ((parseInt(this.state.page_no) + 1) * 25) && this.state.page_no == 0) {
										let extra_message = Math.abs((25 * (parseInt(this.state.page_no) + 1)) - this.state.messages.length);
										this.state.messages.splice(0, extra_message);
										this.getMoreChatList();
									}

									this.setState({ page_no: parseInt(this.state.page_no) + 1 }, () => {
										console.log(this.state.page_no, "Llll");
										this.is_refresh = true
										this.getMoreChatList();
									})
								} else {
									this.setState({
										refreshing: false
									})
								}
							}} />
						}
						ref={(ref) => { this.scrollView = ref }}
						style={styles.messages}>
						{this.state.messages.length == 0 && (
							<View style={[styles.horizontal]}>
								<ActivityIndicator size="small" color={colors.gray_input} />
							</View>
						)}
						<View style={{ paddingBottom: 20 }}>
							{
								this.state.messages.map((m, index) => {
									return (this._renderChat(m, index))
								})
							}
						</View>

					</ScrollView>
					{((this.props.ticket_data.current_ticket.job_status == 'assigned' && this.props.ticket_data.current_ticket.assigned_status == 'inprogress') || (this.props.ticket_data.current_ticket.assigned_status == null && this.props.ticket_data.current_ticket.job_status == 'created') || this.props.ticket_data.current_ticket.job_status == 'marked_by_expert') && (
						<InputBar
							state_variables={this.state}
							onImageCancel={() => this.navigator("image_cancel")}
							onSendPressed={() => this.navigator("send")}
							onSizeChange={() => this._onInputSizeChange()}
							onPhotoPress={() => this.navigator("image")}
							onVideoPress={() => this.navigator("video")}
							onChangeText={(text) => this._onChangeInputBarText(text)}
							text={this.state.inputBarText}
						/>
					)}

					<KeyboardSpacer />
				</View>
				<Modal hasBackdrop={true} backdropColor={"black"} backdropOpacity={1} transparent={true} presentationStyle="pageSheet" isVisible={this.state.showCamera} hideModalContentWhileAnimating={true}>
					<CameraScreen
						text={'Upload a \n  Picture'}
						type={"chat"}
						canSkip={false}
						skip={this.navigator}
						getImageUri={this.setImages}
						backButton={this.navigator}></CameraScreen>
				</Modal>
				<Modal hasBackdrop={true} backdropColor={"black"} backdropOpacity={1} transparent={true} presentationStyle="pageSheet" isVisible={this.state.showVideo} hideModalContentWhileAnimating={true}>
					<VideoScreen
						text={'Upload your \n video'}
						canSkip={false}
						from={'chat'}
						getImageUri={this.setVideo}
						skip={this.navigator}
						backButton={this.navigator}></VideoScreen>
				</Modal>
				<ActionSheet
					ref={this.getActionSheetRef}
					options={options}
					cancelButtonIndex={CANCEL_INDEX}
					destructiveButtonIndex={DESTRUCTIVE_INDEX}
					onPress={this.handleImagePress}
				/>
				<ActionSheet
					ref={this.getVideoActionSheetRef}
					options={video_options}
					cancelButtonIndex={CANCEL_INDEX}
					destructiveButtonIndex={DESTRUCTIVE_INDEX}
					onPress={this.handleVideoPress}
				/>

				<Modal
					isVisible={this.state.toggle_menu}
					onBackdropPress={() => this.setState({ toggle_menu: !this.state.toggle_menu })}
					hideModalContentWhileAnimating={true}
					onSwipeComplete={() => this.setState({ toggle_menu: !this.state.toggle_menu })}
					swipeDirection="down"
				>
					<SideMenu

						from={"chat"}
						parentCallback={this.callbackFunction}
					></SideMenu>
				</Modal>
				<Modal isVisible={this.state.show_full_video}
					hideModalContentWhileAnimating={true}
					onSwipeComplete={() => this.setState({ show_full_video: !this.state.show_full_video })}
					swipeDirection="down"
					animationIn={"zoomIn"}
					animationOut={"zoomOut"}
					style={{ backgroundColor: colors.grey_bg }}
				>
					<View style={{ flex: 1, backgroundColor: colors.grey_bg }}>
						<Button onPress={() => this.navigator('play')} transparent hitSlop={hitSlop} style={{ zIndex: 4, marginTop: 30, height: 60 }}>
							<Icon style={[
								{ color: colors.LIGHT_COLOR, fontSize: 50 },
							]} name="ios-close" />
						</Button>
						<Video ref={(ref) => {
							this.player = ref
						}}
							resizeMode="cover"
							source={{ uri: this.state.video_file }}
							style={[styles.backgroundFullVideo, { zIndex: 1, backgroundColor: colors.card_border_outline }]} />
					</View>
				</Modal>

				<Modal
					isVisible={this.state.show_full_screen}
					onBackdropPress={() => this.setState({ show_full_screen: !this.state.show_full_screen })}
					hideModalContentWhileAnimating={true}
					onSwipeComplete={() => this.setState({ show_full_screen: !this.state.show_full_screen })}
					swipeDirection="down"
				>
					<FullScreen
						data={this.state.full_screen_data}
						parentCallback={this.fullScreenCallback}>
					</FullScreen>
				</Modal>
			</Container>

		);
	}

	/**Reject Request */
	rejectRequest = () => {
		console.log("rejectRequest", "rejectRequest")
		this.refs.Load.OpenLoad();
		let param = {
			"ticket_id": this.props.ticket_data.current_ticket.ticket_id,
		}
		postApiRequestWithHeaders(
			commonData.api_endpoint.reject_request,
			param, this.props.user.access_token
		).then(
			data => {
				this.props.setCurrentTicket(data.current_ticket);
				console.log("Regenerate Ticket", data);
				var socket_param = {
					"ticket_id": this.props.ticket_data.current_ticket.ticket_id,
					"assigned_id": this.props.ticket_data.current_ticket.assigned_id,
					chat_room_id: this.props.ticket_data.current_ticket.chat_room_id,
					"time_zone": commonData.time_zone,
					sender_id: this.props.user.user_id
				}
				this.socket.emit('reject_ticket_request', socket_param);
				this.state.messages.push({
					id: 4,
					url: "",
					msg: 'I am not satisfied yet, we are still working',
					sender_id: this.props.user.user_id,
					type: 'text',
					createdAt: new Date(),
					profile_image: this.props.user.user_type == "expert" ? this.props.user.profile_image : '',
				});
				this.setState({ messages: this.state.messages, show_alert: false });
				this.refs.Load.CloseLoad();
			},
			error => {
				this.refs.Load.CloseLoad();
				errorHandler(error, this.props);
			},
		);
	}
	/**Find Me New Pro Fnction */
	regenerateTicket = () => {
		this.refs.Load.OpenLoad();
		let temp_assigned_id = this.props.ticket_data.current_ticket.assigned_id;
		let temp_chat_room_id = this.props.ticket_data.current_ticket.chat_room_id;
		let param = {
			"ticket_id": this.props.ticket_data.current_ticket.ticket_id,
			"assigned_id": this.props.ticket_data.current_ticket.assigned_id,
			"time_zone": commonData.time_zone,
			"marked_by": this.props.user.user_type,
		}
		postApiRequestWithHeaders(
			commonData.api_endpoint.regenerate_ticket,
			param, this.props.user.access_token
		).then(
			data => {
				this.props.setCurrentTicket(data.current_ticket);
				console.log("Regenerate Ticket", data);

				if (this.props.user.user_type == "owner") {
					this.setState({
						messages: data.chat
					})
					setTimeout(() => {
						this.getChatList();
					}, 1000);
				}

				if (this.props.ticket_data.current_ticket.job_status == 'regenerated_by_expert' && this.props.user.user_type == "expert") {
					console.log("expert regernat ticket caaling.....")
					this.setState({
						title: 'Job Cancelled',
						alert_type: 'common_alert',
						alert_desc: 'You have cancelled this help ticket.',
						show_alert: true,
					})


				}
				var socket_param = {
					"ticket_id": this.props.ticket_data.current_ticket.ticket_id,
					"assigned_id": temp_assigned_id,
					"time_zone": commonData.time_zone,
					sender_id: this.props.user.user_id,
					"marked_by": this.props.user.user_type,
				}
				this.socket.emit('ticket_regenerate', socket_param);
				this.refs.Load.CloseLoad();

				if (this.props.user.user_type == "owner") {
					setTimeout(() => {
						console.log('leave_group', { chat_room_id: temp_chat_room_id, username: this.props.user.name });
						console.log('join_group', { chat_room_id: data.current_ticket.chat_room_id, username: this.props.user.name, time_zone: commonData.time_zone });


						this.socket.emit('leave_group', { chat_room_id: temp_chat_room_id, username: this.props.user.name });
						this.socket.emit('join_group', { chat_room_id: data.current_ticket.chat_room_id, username: this.props.user.name, time_zone: commonData.time_zone });
					}, 1000);


				}
				if (this.props.user.user_type == "expert") {
					let temp_data = this.props.ticket_data.current_ticket;
					temp_data.job_status = "regenerated_by_expert";
					this.props.setCurrentTicket(temp_data);
					setTimeout(() => {
						this.socket.emit('leave_group', { chat_room_id: temp_chat_room_id, username: this.props.user.name });

					}, 1000);
				}
			},
			error => {
				this.refs.Load.CloseLoad();
				errorHandler(error, this.props);
			},
		);
	}

	/**completeTicket Fnction */
	completeTicket = () => {

		let param = {
			"ticket_id": this.props.ticket_data.current_ticket.ticket_id,
			"marked_by": this.props.user.user_type,
		}
		console.log(param, "return f");
		this.refs.Load.OpenLoad();
		postApiRequestWithHeaders(
			commonData.api_endpoint.complete_ticket,
			param, this.props.user.access_token
		).then(
			data => {
				var socket_param = {
					"expert_id": this.props.ticket_data.current_ticket.expert_id,
					"ticket_id": this.props.ticket_data.current_ticket.ticket_id,
					chat_room_id: this.props.ticket_data.current_ticket.chat_room_id,
					"time_zone": commonData.time_zone,
					sender_id: this.props.user.user_id
				}
				console.log(socket_param);
				this.socket.emit('complete_request', socket_param);
				console.log(data, "complete_ticket")

				this.refs.Load.CloseLoad();
				if (data.current_ticket.job_status == 'marked_by_expert' && this.props.user.user_type == "expert") {
					this.props.setCurrentTicket(data.current_ticket);
					setTimeout(() => {
						this.setState({
							title: 'Nice job!',
							alert_type: 'wait',
							alert_desc: 'Hang tight while we wait for the homeowner to confirm the job is complete.',
							show_alert: true,
						})
					}, 500);
				}
				if (data.current_ticket.job_status == 'marked_by_owner' && this.props.user.user_type == "owner") {
					AppEventsLogger.logPurchase(45, "USD", { param: "Job Completed" });
					setTimeout(() => {
						this.setState({
							showRating: 'rate',
						})
					}, 100);
				}
				// console.log("Regenerate Ticket", data);
				// this.setState({
				//   messages: data.chat
				// })
			},
			error => {
				console.log(error, "error");
				this.refs.Load.CloseLoad();
				this.callToastFunction(error, "error")

				errorHandler(error, this.props);
			},
		);
	}


	tipClick = (param) => {
		this.refs.Load.OpenLoad();
		console.log(param, 'parm tip....');
		postApiRequestWithHeaders(commonData.api_endpoint.add_tip, param, this.props.user.access_token).then(
			res => {
				console.log(res, 'res');
				AppEventsLogger.logPurchase(param.amount, "USD", { param: "Tip Added" });
				postApiRequestWithHeaders(commonData.api_endpoint.user_details, param, this.props.user.access_token).then(
					data => {
						data.loggedInStatus = true;
						if (data.user.user_type != "owner") {
							this.setState({
								all_job: data.all_tickets
							})
							this.props.setAllTickets(data.all_tickets);
						} else {
							this.props.setCurrentTicket(data.user.current_ticket);
							this.setState({
								current_ticket: data.user.current_ticket,
								push_enable: data.user.push_enable
							})
						}
						this.props.setUserData(data.user);

						setTimeout(() => {
							this.refs.Load.CloseLoad();
							const resetAction = StackActions.reset({
								index: 0,
								actions: [NavigationActions.navigate({ routeName: "HomePage" })],
							});
							this.props.navigation.dispatch(resetAction);
						}, 1000);

					},
					error => {
						this.refs.Load.CloseLoad();
						errorHandler(error, this.props);
					},
				);
			},
			error => {
				this.refs.Load.CloseLoad()
				errorHandler(error, this.props);
			},
		);
	}
	/**Pop Upp Click Events */
	popUpClick = (data) => {
		//	console.log(data,"pop Up clikc") 
		this.setState({
			show_alert: false
		})
		//console.log(data, "popUpClick");
		switch (data) {
			case "over":
				var socket_param = {
					ticket_id: this.props.ticket_data.current_ticket.ticket_id,
					sender_id: this.props.user.user_id,
					assigned_id: this.props.ticket_data.current_ticket.assigned_id,
				}
				this.socket.emit('ticket_cancel', socket_param);
				break;
			case "find":
				console.log("find");
				this.regenerateTicket()
				break;
			case "job_done":
				this.completeTicket()
				break;
			case "still_work":
				console.log("still workin")
				this.rejectRequest()
				break;
			case "pay_pro":
				console.log("still workin")
				this.completeTicket()
				break;
			case "Tip":
				console.log("still workin");

				this.setState({
					showRating: "tip"
				})
				break;
			case "home":
				console.log("still workin");
				this.getUserDetails()
				break;
			case "cancel_pro":
				console.log("cancel_pro");
				this.regenerateTicket()
				break;

			case "home_direct":
				console.log("home_direct")
				const resetAction = StackActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({ routeName: "HomePage" })],
				});
				this.props.navigation.dispatch(resetAction);

				break;
			default:
				break;
		}

	}

	getUserDetailsfromStart = () => {
		var param = {}
		// param = {
		// 	device_token: this.props.user.device_token
		// }
		postApiRequestWithHeaders(commonData.api_endpoint.user_details, param, this.props.user.access_token).then(
			data => {
				console.log(data, 'Ticket response')
				data.loggedInStatus = true;
				if (data.user.user_type != "owner") {
					this.setState({
						all_job: data.all_tickets
					})
					this.props.setAllTickets(data.all_tickets);
				} else {
					this.props.setCurrentTicket(data.user.current_ticket);
					let user_data = this.props.user;
					user_data.current_ticket = data.user.current_ticket;
					this.props.setUserData(user_data);
					this.setState({
						current_ticket: data.user.current_ticket,
						push_enable: data.user.push_enable
					})
					if (this.state.show_alert == false) {
						if (data.user.current_ticket.job_status == 'marked_by_expert' && this.props.user.user_type == "owner") {
							Keyboard.dismiss();
							console.log("show piop upp");

						}
					}

				}
				this.props.setUserData(data.user);
				this.getChatList();

			},
			error => {
				this.refs.Load.CloseLoad();
				errorHandler(error, this.props);
			},
		);
	};
	/**
	 * Fetch user details from local storage
	 */

	getUserDetails = () => {
		this.refs.Load.OpenLoad();
		var param = {}

		// param = {
		// 	device_token: this.props.user.device_token
		// }

		postApiRequestWithHeaders(commonData.api_endpoint.user_details, param, this.props.user.access_token).then(
			data => {
				data.loggedInStatus = true;
				if (data.user.user_type != "owner") {
					this.setState({
						all_job: data.all_tickets
					})
					this.props.setAllTickets(data.all_tickets);
				} else {
					this.props.setCurrentTicket(data.user.current_ticket);
					this.setState({
						current_ticket: data.user.current_ticket,
						push_enable: data.user.push_enable
					})
				}
				this.props.setUserData(data.user);

				setTimeout(() => {
					this.refs.Load.CloseLoad();
					const resetAction = StackActions.reset({
						index: 0,
						actions: [NavigationActions.navigate({ routeName: "HomePage" })],
					});
					this.props.navigation.dispatch(resetAction);
				}, 1000);

			},
			error => {
				this.refs.Load.CloseLoad();
				errorHandler(error, this.props);
			},
		);
	};

	onRefresh = () => {
		//console.log("on Refresh calling....")
	}
	/**Connect to Call  */
	connectToCall = () => {
		check(PERMISSIONS.IOS.MICROPHONE).then(result => {
			console.log(result, "resumt")
			switch (result) {
				case RESULTS.DENIED:
					console.log("lo")
					request(PERMISSIONS.IOS.MICROPHONE).then((result) => {
						console.log(result);
						if (result == 'blocked') {
							alertWithTwoBtn(
								'Permission Required',
								commonData.ToastMessages.access_micro_phone,
								'Not Now',
								'Open Settings',
							).then(data => {
								console.log(data);
								if (data) {
									Linking.openSettings();
								}
							});
						} else {
							check(PERMISSIONS.IOS.CAMERA).then(result => {
								switch (result) {
									case RESULTS.GRANTED:
										let param = {
											ticket_id: this.props.ticket_data.current_ticket.ticket_id,
											receiver: this.props.user.user_type == "expert" ? 'owner' : "expert"
										}
										this.props.navigation.navigate("VideoCall", {
											ticket_id: this.props.ticket_data.current_ticket.ticket_id,
											pageFrom: 'card'
										});
										// postApiRequestWithHeaders(
										// 	commonData.api_endpoint.create_session,
										// 	param, this.props.user.access_token
										// ).then(
										// 	data => {
										// 		this.props.setSession(data);
										// 		// setTimeout(() => {
										// 		// 	this.props.navigation.navigate("VideoCall", {
										// 		// 		ticket_id: this.props.ticket_data.current_ticket.ticket_id,
										// 		// 		pageFrom: 'card'
										// 		// 	});
										// 		// }, 1000);

										// 		//   }, 500);

										// 	},
										// 	error => {

										// 	},
										// );
										break;

									case RESULTS.BLOCKED:
										alertWithTwoBtn(
											'Permission Required',
											commonData.ToastMessages.camera_deny_permission,
											'Not Now',
											'Open Settings',
										).then(data => {
											console.log(data);
											if (data) {
												Linking.openSettings();
											}
										});
										break;

									case RESULTS.DENIED:
										request(PERMISSIONS.IOS.CAMERA).then((result) => {
											console.log(result);
											if (result == 'blocked') {
												alertWithTwoBtn(
													'Permission Required',
													commonData.ToastMessages.camera_deny_permission,
													'Not Now',
													'Open Settings',
												).then(data => {
													console.log(data);
													if (data) {
														Linking.openSettings();
													}
												});
											} else {
												this.props.navigation.navigate("VideoCall", {
													ticket_id: this.props.ticket_data.current_ticket.ticket_id,
													pageFrom: 'card'
												});
												let param = {
													ticket_id: this.props.ticket_data.current_ticket.ticket_id,
													receiver: this.props.user.user_type == "expert" ? 'owner' : "expert"
												}
												// postApiRequestWithHeaders(
												// 	commonData.api_endpoint.create_session,
												// 	param, this.props.user.access_token
												// ).then(
												// 	data => {
												// 		this.props.setSession(data);
												// 		// setTimeout(() => {
												// 		// 	this.props.navigation.navigate("VideoCall", {
												// 		// 		ticket_id: this.props.ticket_data.current_ticket.ticket_id,
												// 		// 		pageFrom: 'card'
												// 		// 	});
												// 		// }, 1000);

												// 		//   }, 500);

												// 	},
												// 	error => {

												// 	},
												// );
											}
											// …
										});
										break;
								}

							})
						}
						// …
					});
					break;
				case RESULTS.GRANTED:
					check(PERMISSIONS.IOS.CAMERA).then(result => {
						switch (result) {
							case RESULTS.GRANTED:
								this.props.navigation.navigate("VideoCall", {
									ticket_id: this.props.ticket_data.current_ticket.ticket_id,
									pageFrom: 'card'
								});
								let param = {
									ticket_id: this.props.ticket_data.current_ticket.ticket_id,
									receiver: this.props.user.user_type == "expert" ? 'owner' : "expert"
								}
								// postApiRequestWithHeaders(
								// 	commonData.api_endpoint.create_session,
								// 	param, this.props.user.access_token
								// ).then(
								// 	data => {
								// 		this.props.setSession(data);
								// 		// setTimeout(() => {
								// 		// 	this.props.navigation.navigate("VideoCall", {
								// 		// 		ticket_id: this.props.ticket_data.current_ticket.ticket_id,
								// 		// 		pageFrom: 'card'
								// 		// 	});
								// 		// }, 1000);

								// 		//   }, 500);

								// 	},
								// 	error => {

								// 	},
								// );
								break;

							case RESULTS.BLOCKED:
								alertWithTwoBtn(
									'Permission Required',
									commonData.ToastMessages.camera_deny_permission,
									'Not Now',
									'Open Settings',
								).then(data => {
									console.log(data);
									if (data) {
										Linking.openSettings();
									}
								});
								break;

							case RESULTS.DENIED:
								request(PERMISSIONS.IOS.CAMERA).then((result) => {
									console.log(result);
									if (result == 'blocked') {
										alertWithTwoBtn(
											'Permission Required',
											commonData.ToastMessages.camera_deny_permission,
											'Not Now',
											'Open Settings',
										).then(data => {
											console.log(data);
											if (data) {
												Linking.openSettings();
											}
										});
									} else {
										this.props.navigation.navigate("VideoCall", {
											ticket_id: this.props.ticket_data.current_ticket.ticket_id,
											pageFrom: 'card'
										});
										let param = {
											ticket_id: this.props.ticket_data.current_ticket.ticket_id,
											receiver: this.props.user.user_type == "expert" ? 'owner' : "expert"
										}
										// postApiRequestWithHeaders(
										// 	commonData.api_endpoint.create_session,
										// 	param, this.props.user.access_token
										// ).then(
										// 	data => {
										// 		this.props.setSession(data);
										// 		// setTimeout(() => {
										// 		// 	this.props.navigation.navigate("VideoCall", {
										// 		// 		ticket_id: this.props.ticket_data.current_ticket.ticket_id,
										// 		// 		pageFrom: 'card'
										// 		// 	});
										// 		// }, 1000);

										// 		//   }, 500);

										// 	},
										// 	error => {

										// 	},
										// );
									}
									// …
								});
								break;
						}

					})
					break;
				case RESULTS.BLOCKED:
					alertWithTwoBtn(
						'Permission Required',
						commonData.ToastMessages.access_micro_phone,
						'Not Now',
						'Open Settings',
					).then(data => {
						console.log(data);
						if (data) {
							Linking.openSettings();
						}
					});
					break;
			}

		})
		//return false;

	}
	/**Get Chat List on Pull to refresh */
	getMoreChatList = () => {

		let param = {};
		if (this.props.ticket_data.current_ticket.assigned_id == null) {
			param = {
				page_no: this.state.page_no,
				chat_room_id: this.props.ticket_data.current_ticket.chat_room_id,
				number_of_result: 25,
				time_zone: commonData.time_zone
			}
		} else {
			param = {
				page_no: this.state.page_no,
				assigned_id: this.props.ticket_data.current_ticket.assigned_id,
				number_of_result: 25,
				time_zone: commonData.time_zone
			}
		}
		//console.log(param,"param..")
		postApiRequestWithHeaders(
			commonData.api_endpoint.getChatList,
			param, this.props.user.access_token
		).then(
			data => {
				//console.log(data,"getChatList");  
				this.state.messages = data.chats.concat(this.state.messages);
				//console.log(this.state.messages)
				this.setState({
					messages: this.state.messages,
					iMaxPages: data.total_pages,
					refreshing: false
				})
			},
			error => {
				// this.callToastFunction("error", "error")
				//  errorHandler(error, this.props);
			},
		);
	}

	/**Call back function of Pop Ups */
	callbackFunction = (type) => {
		console.log(type, "calllllll....");

		if (type != 'push') {
			this.setState({ toggle_menu: !this.state.toggle_menu });
		}
		// 
		if (this.props.user.user_type != "expert") {
			switch (type) {
				case "over":
					setTimeout(() => {
						Keyboard.dismiss();
						this.setState({
							title: 'Job Cancel?',
							alert_type: 'job_cancel',
							alert_desc: 'Are you sure you want to cancel the current ticket and start over?',
							show_alert: true,
						})
					}, 600);

					break;
				case "find":
					setTimeout(() => {
						Keyboard.dismiss();
						this.setState({
							title: 'Replace Pro?',
							alert_type: 'find_pro',
							alert_desc: 'Things not working out with this Pro? Connect with a new one by tapping below.',
							show_alert: true,
						})
					}, 600);

					break;
				case "pay":
					setTimeout(() => {
						Keyboard.dismiss();
						this.setState({
							title: 'Satisfied?',
							alert_type: 'pay_pro_by_owner',
							alert_desc: 'Your Pro has indicated that this job is done. Please confirm and your payment will be securely sent to your Pro.',
							show_alert: true,
						})
					}, 700);

					break;


				default:
					this.props.parentCallback(type);
					break;
			}

		} else {
			switch (type) {
				case "call":
					this.connectToCall()
					break;
				case "find":
					setTimeout(() => {
						Keyboard.dismiss();
						this.setState({
							title: 'Job done?',
							alert_type: 'job_done',
							alert_desc: "You're sure this job is done? We'll ask the Homeowner to confirm so payment can be released to you right away.",
							show_alert: true,
						})
					}, 600);
					break;
				case "over":
					setTimeout(() => {
						Keyboard.dismiss();
						this.setState({
							title: "Can't help?",
							alert_type: 'job_cancel_by_pro',
							alert_desc: "Are you sure you can't help. You won't receive any payment and the ticket will be cancelled.",
							show_alert: true,
						})
					}, 600);
					break;
				default:
					break;
			}
		}
	}
	/**FUll Screen Page function callbacks */
	fullScreenCallback = (type, message) => {
		//  console.log(type,"calllllll....",message);
		switch (type) {
			case "close":
				this.setState({
					show_full_screen: false
				})
				break;
			case "send_message":
				this.setState({
					msg: message
				}, () => {
					this.sendMessage()
				})
				break;
			default:
				break;
		}
	}

	/**Send Messages */
	sendMessage = () => {
		if (this.props.user.phone_number == undefined || this.props.user.phone_number == '') {
			crashlytics().log("SendTextMsg");
		} else {
			crashlytics().log("SendTextMsg " + this.props.user.phone_number.split(" ").join(""));
		}
		//console.log(this.props);
		this.state.messages.push({
			msg: this.state.msg,
			url: '',
			sender_id: this.props.user.user_id,
			type: 'text',
			createdAt: new Date(),
			profile_image: this.props.user.user_type == "expert" ? this.props.user.profile_image : '',
			isLoad: false
		});
		//console.log(this.state);
		var socket_param = {
			msg: this.state.msg,
			url: '',
			sender_id: this.props.user.user_id,
			assigned_id: this.props.ticket_data.current_ticket.assigned_id,
			chat_room_id: this.props.ticket_data.current_ticket.chat_room_id,
			type: 'text',
			time_zone: commonData.time_zone
		}
		console.log(socket_param, "param...");
		console.log(this.socket);
		this.socket.emit('send_message', socket_param);
		this.setState({ messages: this.state.messages, msg: '' });
		setTimeout(() => {
			this.GoTo_bottom_function();
		}, 1000);
	}

	/**Upload Photo */
	uploadPhoto = (status) => {
		if (this.props.user.phone_number == undefined || this.props.user.phone_number == '') {
			crashlytics().log("UploadPhoto");
		} else {
			crashlytics().log("UploadPhoto " + this.props.user.phone_number.split(" ").join(""));
		}
		const file = {
			uri: "file://" + this.state.img_object.path,
			name: this.state.img_object.file_name,
			type: this.state.img_object.mime
		}
		const options = {
			keyPrefix: "chat_image/",
			bucket: "askkenvideos",
			region: "us-east-2",
			accessKey: "AKIAX4SCEJIN7DVDY4AD",
			secretKey: "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",
			successActionStatus: 201,
		}
		// console.log(file, options, "fileuploadDebug_1");
		// return;

		RNS3.put(file, options)
			.progress((e) => {
				if (e.percent == 1) {
					let messagesData = this.state.messages;
					let lastObj = messagesData.find(obj => obj.isLoad == true);
					if (lastObj) {
						lastObj.isLoad = false;
						this.setState({
							messages: messagesData
						})
					}
					// let lastObj = messagesData[messagesData.length - 1];
					// lastObj.isLoad = false;
					// this.setState({
					// 	messages: messagesData
					// })
				}
			})
			.then(response => {
				console.log(response, "S3 respo...")
				if (response.status !== 201) {
					throw new Error("Failed to upload image to S3");
				} else {
					//console.log("image uploaded");
					var socket_param = {
						msg: "",
						url: response.body.postResponse.location,
						sender_id: this.props.user.user_id,
						assigned_id: this.props.ticket_data.current_ticket.assigned_id,
						chat_room_id: this.props.ticket_data.current_ticket.chat_room_id,
						type: 'photo',
						time_zone: commonData.time_zone
					}
					//console.log(socket_param,"socket_param...")
					this.socket.emit('send_message', socket_param);

					if (status == 'with_text') {
						setTimeout(() => {
							var socket_param = {
								msg: this.state.tmp_msg,
								url: '',
								sender_id: this.props.user.user_id,
								assigned_id: this.props.ticket_data.current_ticket.assigned_id,
								chat_room_id: this.props.ticket_data.current_ticket.chat_room_id,
								type: 'text',
								time_zone: commonData.time_zone
							}
							console.log(socket_param, "param... with_text")
							this.socket.emit('send_message', socket_param);
						}, 1000);

					}
				}
				//console.log(response.body);
			});
	}

	/**Upload Video */
	uploadVideo = (status) => {
		if (this.props.user.phone_number == undefined || this.props.user.phone_number == '') {
			crashlytics().log("UploadVideo");
		} else {
			crashlytics().log("UploadVideo " + this.props.user.phone_number.split(" ").join(""));
		}
		var file_name = Date.now() + this.props.user.user_id + '.mov'
		//console.log("Upload video......",file_name);
		const file = {
			uri: this.state.uri,
			name: file_name,
			type: "video/mov"
		}
		const options = {
			keyPrefix: "chat_image/",
			bucket: "askkenvideos",
			region: "us-east-2",
			accessKey: "AKIAX4SCEJIN7DVDY4AD",
			secretKey: "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",
			successActionStatus: 201
		}
		RNS3.put(file, options)
			.progress((e) => {
				if (e.percent == 1) {
					let messagesData = this.state.messages;
					// let lastObj = messagesData[messagesData.length - 1];
					let lastObj = messagesData.find(obj => obj.isLoad == true);
					if (lastObj) {
						lastObj.isLoad = false;
						this.setState({
							messages: messagesData
						})
					}
				}
			}).then(response => {
				//console.log(response, "S3 respo...")
				if (response.status !== 201) {
					throw new Error("Failed to upload image to S3");
					this.refs.Load.CloseLoad();
				} else {
					var socket_param = {
						msg: "",
						url: response.body.postResponse.location,
						sender_id: this.props.user.user_id,
						assigned_id: this.props.ticket_data.current_ticket.assigned_id,
						chat_room_id: this.props.ticket_data.current_ticket.chat_room_id,
						type: 'video',
						time_zone: commonData.time_zone
					}
					//console.log(socket_param,"socket_param...")
					this.socket.emit('send_message', socket_param);

					if (status == 'with_text') {
						setTimeout(() => {
							var socket_param = {
								msg: this.state.tmp_msg,
								url: '',
								sender_id: this.props.user.user_id,
								assigned_id: this.props.ticket_data.current_ticket.assigned_id,
								chat_room_id: this.props.ticket_data.current_ticket.chat_room_id,
								type: 'text',
								time_zone: commonData.time_zone
							}
							console.log(socket_param, "param... with_text")
							this.socket.emit('send_message', socket_param);
						}, 1000);

					}
				}
				//console.log(response.body);
			});
	}
}

function mapStateToProps(state) {
	//console.log(state,"state......")
	return {
		user: state.user.userData,
		ticket_data: state.user
	}
}
export default connect(mapStateToProps, { setUserData, setCurrentTicket, setSession })(TicketChat);



//The bar at the bottom with a textbox and a send button.
class InputBar extends Component {

	//AutogrowInput doesn't change its size when the text is changed from the outside.
	//Thus, when text is reset to zero, we'll call it's reset function which will take it back to the original size.
	//Another possible solution here would be if InputBar kept the text as state and only reported it when the Send button
	//was pressed. Then, resetInputText() could be called when the Send button is pressed. However, this limits the ability
	//of the InputBar's text to be set from the outside.
	componentWillReceiveProps(nextProps) {
		if (this.props.state_variables.msg === '') {
			this.autogrowInput.resetInputText();
		}
	}

	render() {
		return (
			<View style={styles.inputBar}>
				<View style={{ paddingRight: 10, paddingLeft: 10, flex: height < 680 ? 0.61 : 0.55, display: this.props.state_variables.isInputFocus ? 'none' : 'flex', justifyContent: 'flex-end' }}>
					<Button transparent style={styles.mediaIconsContainer}
						onPress={() => {
							this.props.onPhotoPress()
						}}>
						<Image style={[styles.mediaIcons, {
							width: 48,
							height: 48,
						}]} source={camera} />
					</Button>
				</View>
				<View style={{ paddingRight: 10, flex: height < 680 ? 0.61 : 0.55, display: this.props.state_variables.isInputFocus ? 'none' : 'flex', justifyContent: 'flex-end' }}>
					<Button transparent style={[styles.mediaIconsContainer, {}]}
						onPress={() => {
							this.props.onVideoPress()
						}}>
						<Image style={[styles.mediaIcons, {
							width: 48,
							height: 48,
						}]} source={video} />
					</Button>
				</View>
				<View style={[styles.textmessageContainer, { flex: height < 680 ? 3.6 : 3, marginRight: 5 }]}>
					<View style={{ height: 150, borderBottomColor: colors.receiver_color, borderBottomWidth: 1, width: "100%", display: this.props.state_variables.image_selected == true ? 'flex' : 'none' }}>
						<View style={{ height: '100%', paddingTop: 10, paddingLeft: 10 }}>
							{this.props.state_variables.uri != '' && this.props.state_variables.image_type == 'photo' && (
								<Image style={[styles.imageSelection, { marginRight: 0 }]}
									resizeMode="cover"
									source={{ uri: this.props.state_variables.uri }}
								/>
							)}
							{this.props.state_variables.uri != '' && this.props.state_variables.image_type == 'video' && (
								<View>
									<Image source={play} style={{ zIndex: 1, top: "37%", left: '11%', position: 'absolute', width: 30, height: 30 }} />
									<Video
										paused={"true"}
										resizeMode="cover"
										source={{ uri: this.props.state_variables.uri }}
										style={[styles.imageSelection, { marginBottom: 0 }]} />
								</View>

							)}
						</View>

						<Button
							style={{ paddingRight: 30, position: 'absolute', left: 60, top: 5 }}
							transparent
							hitSlop={hitSlop1}
							onPress={() => {
								this.props.onImageCancel()
							}}>
							<Image
								style={[
									{ height: 25, width: 25, resizeMode: 'contain', },
								]}
								source={cross}
							/>

						</Button>

					</View>
					<View style={{ flexDirection: 'row', paddingTop: 0, paddingBottom: 0, height: 47, backgroundColor: 'center', justifyContent: 'center' }}>
						<AutogrowInput style={[styles.numberInput, { width: width / 2 + 8, }]}
							ref={(ref) => { this.autogrowInput = ref }}
							selectionColor={colors.BLACK_TEXT}
							multiline={true}
							onFocus={() => {
								this.is_refresh = false;
							}}
							onBlur={() => {
								this.is_refresh = false;
							}}
							placeholderTextColor={colors.chat_placeholder}
							placeholder="Message..."
							defaultHeight={35}
							onChangeText={(text) => this.props.onChangeText(text)}
							onContentSizeChange={this.props.onSizeChange}
							value={this.props.state_variables.msg} />

						<View style={{ padding: 0 }}>

							<Button transparent onPress={() => this.props.onSendPressed()}
								style={[]} iconCenter >
								<Image style={[styles.mediaIcons, { height: 30, width: 30, paddingTop: 5 }]} source={(this.props.state_variables.msg.trim() != "" || this.props.state_variables.image_selected != false) ? send_on : send_off} />
							</Button>
						</View>
					</View>

				</View>
			</View>
		);
	}
}









