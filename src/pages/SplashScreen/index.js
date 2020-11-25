import React, { Component } from 'react';
import Introduction from '@components/Introduction';
import { View, Image, Text, Dimensions, TouchableWithoutFeedback, AppState, ActivityIndicator } from 'react-native';
import HomePage from '@components/HomePage';
import messaging from '@react-native-firebase/messaging';
import {
	Linking,
} from 'react-native';
import { Container, Header, Left, Button, Body, Right, Icon, Badge } from 'native-base';
import SelectUser from '@components/SelectUser';
import commonData from '../../common/data';
import { getItem, getApiRequest, clear_push_interval, alertWithTwoBtn, setItem } from '../../common/user';
import RNCallKeep from 'react-native-callkeep';
import { StackActions, NavigationActions } from 'react-navigation';
import { checkNotifications } from 'react-native-permissions';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
	postApiRequestWithHeaders,
	errorHandler,
} from '../../common/user';
import firebase from 'react-native-firebase';
import { connect } from "react-redux";
import VoipPushNotification from 'react-native-voip-push-notification';
import { setDeviceToken, setUserData, setCurrentTicket, setVoipToken, setSession } from "../../actions";
import uuid from 'uuid';
import Load from 'react-native-loading-gif';
RNCallKeep.setup({
	ios: {
		appName: `Ask Ken`,
		imageName: 'pizza',
		ringtoneSound: 'ask_ken_new.wav'
	},
	android: {
		alertTitle: 'Permissions required',
		alertDescription: 'This application needs to access your phone accounts',
		cancelButton: 'Cancel',
		okButton: 'ok',
	},
});
//  PushNotification.configure({
//       // (optional) Called when Token is generated (iOS and Android)
//       onRegister: function (token) {
//         console.log("PushNotification_TOKEN:", token);
//       },
//       permissions: {
//         alert: true,
//         badge: true,
//         sound: true,
//       },
//    })
const getNewUuid = () => uuid.v4().toLowerCase();

const format = uuid => uuid.split('-')[0];
class SplashScreeen extends Component {
	session_ticket = "";
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn: false,
			is_first_time: 'false',
			codeFetched: false,
			payload: "",
			heldCalls: {},
			calls: {},
			incoming_call_data: {},
			manual_end_uuid: ''
		};
		RNCallKeep.addEventListener('answerCall', this.answerCall);
		RNCallKeep.addEventListener('endCall', this.endCall);


	}

	endCall = ({ }) => {
		console.log("end calls..")
		RNCallKeep.endAllCalls();
	};

	addCall = (callUUID, number) => {
		this.setState((state, props) => {
			return {
				heldCalls: {
					...this.state.heldCalls,
					[callUUID]: false
				}
			};
		}, this.afterStateUpdate);
		this.setState((state, props) => {
			return {
				calls: {
					...this.state.calls,
					[callUUID]: number
				}
			};
		}, this.afterStateUpdate);
	};

	removeCall = (callUUID) => {

		const { [callUUID]: _, ...updated } = this.state.calls;
		const { [callUUID]: __, ...updatedHeldCalls } = this.state.heldCalls;
		this.setState((state, props) => {
			return {
				calls: updated,
				heldCalls: updatedHeldCalls
			};
		}, this.afterStateUpdate);
	};
	afterStateUpdate = () => {
	}
	/**
	 * Register push token
	 */
	setUpPush = () => {
		console.log("setUp  Push")
		firebase.messaging().hasPermission()
			.then(enabled => {
				if (enabled) {
					firebase.messaging().getToken().then(token => {
						console.log("LOG Messaging: ", token);
						this.props.setDeviceToken({
							device_token: token,
							uuid: commonData.signUpObj.uuid
						})
						this.messageListener();
					})
					// user has permissions
				} else {
					firebase.messaging().requestPermission()
						.then(() => {
							//console.log("User Now Has Permission");
							this.setUpPush();
							//this.messageListener();
						})
						.catch(error => {
							this.pushHandler()
							//  this.messageListener();
							// User has rejected permissions  
						});
				}
			});
	}
	checkPushPermission = () => {
		checkNotifications().then(({ status, settings }) => {
		});
		return new Promise((resolve, reject) => {
			checkNotifications().then(
				response => {
					resolve(response.status);
				},
				error => {
					reject(error);
				},
			);
		});
	};

	pushHandler = () => {
		console.log("push handler....")
		this.checkPushPermission().then(response => {
			console.log(response, "lll")
			if (response != RESULTS.GRANTED) {
				console.log(response, "lll")
				alertWithTwoBtn(
					'Permission Required',
					commonData.ToastMessages.push_permission,
					'Not Now',
					'Open Settings',
				).then(data => {
					console.log(data);
					if (data) {
						Linking.openSettings();
						setTimeout(() => {
							this.setUpPush();
						}, 4000);
						// 
					} else {
						this.setUpPush();
					}
				});
			} else {
				this.setUpPush();
			}
		});

	};


	componentWillUnmount() {
		// console.log("un,ount..");
		this.setState({ payload: "" })
	}

	sendSilentPush = (count) => {
		// console.log("silent Push...",this.props.user)
		// let param={
		//   "device_token": this.props.user.device_token,
		//   "count": count
		// }
		// postApiRequestWithHeaders(
		//   commonData.api_endpoint.silent_push,
		//   param,this.props.user.access_token
		// ).then(
		//   data => {
		//     console.log("send Push")
		//   },
		//   error => {
		//     errorHandler(error, this.props);
		//   },
		// );
	}

	/**
	 * Push notification listener events
	 */
	messageListener = async () => {
		this.getUserDetails();

		messaging().getInitialNotification().then((remoteMessage) => {
			console.log("App Closed Push Notification opened");
		});

		messaging().setBackgroundMessageHandler(async remoteMessage => {
			console.log('Message handled in the background1122!', remoteMessage);
			if (remoteMessage.data.type == 'new_ticket' || remoteMessage._data.type == 'accept_ticket') {
				this.props.setCurrentTicket(JSON.parse(remoteMessage.data.current_ticket))
				const resetAction = StackActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({ routeName: "HomePage" })],
				});
				this.props.navigation.dispatch(resetAction);
			}
			// getItem(['user_details', 'is_first_time']).then(
			// 	res => {
			// 		if (res[0][1] != null) {
			// 			// if (remoteMessage.data.type == 'new_ticket' || remoteMessage._data.type == 'accept_ticket') {
			// 			// 	this.props.setCurrentTicket(JSON.parse(remoteMessage.data.current_ticket))
			// 			// 	const resetAction = StackActions.reset({
			// 			// 		index: 0,
			// 			// 		actions: [NavigationActions.navigate({ routeName: "HomePage" })],
			// 			// 	});
			// 			// 	this.props.navigation.dispatch(resetAction);
			// 			// }
			// 		}
			// 	}
			// )

		});
		messaging().onMessage(async remoteMessage => {
			console.log('Message handled in the background22222!', remoteMessage);
			getItem(['user_details', 'is_first_time']).then(
				res => {
					if (res[0][1] != null) {
						this.props.setCurrentTicket(JSON.parse(remoteMessage.data.current_ticket))
						if (remoteMessage.data.type == 'new_ticket' || remoteMessage.data.type == 'accept_ticket') {
							const resetAction = StackActions.reset({
								index: 0,
								actions: [NavigationActions.navigate({ routeName: "HomePage" })],
							});
							this.props.navigation.dispatch(resetAction);
						}
					}
				}
			)
			this.getUserDetails()
		});
		messaging().onNotificationOpenedApp((message) => {

			console.log('Notification caused app to open from background state:', message);


			getItem(['user_details', 'is_first_time']).then(
				res => {
					console.log("okay comingg...")
					if (res[0][1] != null) {
						console.log("okay comingg123...")
						if (message.data.type == 'new_message' || message.data.type == 'ticket_cancel') {

							console.log("okay comingg123456...")
							if (this.props.user.user_type != 'expert') {
								this.props.setCurrentTicket(JSON.parse(message.data.type.current_ticket))
								const resetAction = StackActions.reset({
									index: 0,
									actions: [NavigationActions.navigate({ routeName: "HomePage" })],
								});
								this.props.navigation.dispatch(resetAction);
							}
							else if (this.props.user.user_type == 'expert') {
								console.log("okay comingg123456...")

								console.log("coming inside111111..");
								this.props.setCurrentTicket(JSON.parse(message.data.current_ticket))
								this.refs.Load.OpenLoad();
								setTimeout(() => {

									this.props.navigation.push("TicketChat");
									this.refs.Load.CloseLoad();
								}, 500);
							}
						}
						else if (message.data.type == 'new_ticket' || message.data.type == 'job_completed') {
							const resetAction = StackActions.reset({
								index: 0,
								actions: [NavigationActions.navigate({ routeName: "HomePage" })],
							});
							this.props.navigation.dispatch(resetAction);
						}
						else if (message.data.type == 'accept_ticket') {
							this.props.setCurrentTicket(JSON.parse(message.data.current_ticket))
							const resetAction = StackActions.reset({
								index: 0,
								actions: [NavigationActions.navigate({ routeName: "HomePage" })],
							});
							this.props.navigation.dispatch(resetAction);
						}
					}

					firebase.notifications().getBadge()
						.then(count => {
							console.log(count, "lounf,,,,,,");
							firebase.notifications().setBadge(0);
						})
				},
				err => {
				},

			);
		});

	}

	/**Connect to Call  */
	connectToCall = () => {
		let param = {
			ticket_id: this.session_ticket,
			receiver: this.props.user.user_type == "expert" ? 'owner' : "expert"
		}
		//	console.log(param);
		// this.props.navigation.navigate("VideoCall", {
		//   ticket_id:this.session_ticket
		//   });
		postApiRequestWithHeaders(
			commonData.api_endpoint.ticket_detail,
			param, this.props.user.access_token
		).then(
			data => {
				//	console.log(data,"ticket_detail");  
				this.props.setSession(data);
				setTimeout(() => {
					this.props.navigation.navigate("VideoCall", {
						pageFrom: 'splash',
						ticket_id: this.session_ticket
					});
				}, 1000);

			},
			error => {

			},
		);
	}
	//***Call Kit Event Listeners when  user picks the call ** *//
	answerCall = ({ callUUID }) => {
		//console.log("Answer Calll....",this.session_ticket);
		this.connectToCall();
	}

	/**
	 * Called when App Loads
	 */
	componentDidMount() {

		this.setUpPush();
		VoipPushNotification.requestPermissions();
		VoipPushNotification.registerVoipToken();
		VoipPushNotification.addEventListener('register', (token) => {
			// --- send token to your apn provider server
			console.log("Voip Register token", token);
			this.props.setVoipToken({
				voip_token: token,
			})
		}, err => {
			console.log("eeror in register", err)
		});

		VoipPushNotification.addEventListener('notification', (notification) => {
			console.log("notification receive", notification);
			console.log(notification.getMessage(), "hello");
			this.session_ticket = notification.getMessage();
			// this.getSessionDetails(notification.getMessage());28b48eaf8f87e48b2c66d85a155f765bf4193e7c43208cc091664f3f2ee7d312
			// --- when receive remote voip push, register your VoIP client, show local notification ... etc
			//this.doRegisterOrSomething();

			// --- This  is a boolean constant exported by this module
			// --- you can use this constant to distinguish the app is launched by VoIP push notification or not
			if (VoipPushNotification.wakeupByPush) {
				// this.doSomething()
				// --- remember to set this static variable back to false
				// --- since the constant are exported only at initialization time, and it will keep the same in the whole app
				VoipPushNotification.wakeupByPush = false;
			}
			// --- optionally, if you `addCompletionHandler` from the native side, once you have done the js jobs to initiate a call, call `completion()`
			VoipPushNotification.onVoipNotificationCompleted(notification.getData().uuid);
		});

		getItem(['ad_index']).then(
			res => {
				console.log(res, "res get index", res[0][1]);
				if (res[0][1] != null) {
					commonData.ad_index = res[0][1];
					let value = "0";
					value = res[0][1] == "0" ? "1" : "0"
					setItem('ad_index', value).then(
						res => {
							if (res) {
								console.log(res, "set item add index")
							}
						},
						err => {
							console.log(err, "set err")
						},
					);
				}
			}
		)
	}

	/**
	 * Get user details from local storage and update global the variable
	 */
	getUserDetails = () => {
		console.log("kkkk")
		getItem(['user_details', 'is_first_time']).then(
			res => {
				console.log(JSON.parse(res[0][1]), "res.......11111");
				commonData.user_details = JSON.parse(res[0][1]);
				//	console.log(res,"lkllklkl.....")
				if (res[0][1] != null) {
					//commonData.user_details.current_ticket ={}
					this.props.setUserData(JSON.parse(res[0][1]));
					//console.log(commonData.user_details, "commonData.user_details")
					setTimeout(() => {
						this.UserDetails();
					}, 1000);

					this.setState({ isLoggedIn: true });

				}
			},
			err => {
			},
		);
	};

	promiseUserdetail = () => {
		console.log("props", this.props)
		var param = {}
		// if (this.props.signUp_data == "") {
		// 	param = {
		// 		device_token: ""
		// 	}
		// } else {
		// 	param = {
		// 		device_token: this.props.signUp_data.device_token,
		// 		voip_token: this.props.signUp_data.voip_token
		// 	}
		// }
		console.log("usr paramm", param)
		return new Promise((resolve, reject) => {
			postApiRequestWithHeaders(commonData.api_endpoint.user_details, param, this.props.user.access_token).then(
				data => {
					console.log(data, "user_detail");
					data.loggedInStatus = true;
					this.props.setUserData(data.user);
					resolve(true)
				},
				error => {
					resolve(false)
				},
			);
		})
	};
	UserDetails = () => {
		console.log("props", this.props)
		var param = {}
		console.log("usr paramm", param)
		postApiRequestWithHeaders(commonData.api_endpoint.user_details, param, this.props.user.access_token).then(
			data => {
				console.log(data, "user_detail");
				data.loggedInStatus = true;
				this.props.setUserData(data.user)
			},
			error => { },
		);
	};
	render() {
		if (this.state.isLoggedIn) {
			return (
				<Container>
					<Load ref="Load"></Load>
					<HomePage navigation={this.props.navigation} />
				</Container>
			)
		} else {
			//return <SelectUser navigation={this.props.navigation} />;
			return (
				<Container>
					<Load ref="Load"></Load>
					<SelectUser navigation={this.props.navigation} />
				</Container>
			)
		}
	}
}

function mapStateToProps(state) {
	//console.log(state, "state")
	return {
		signUp_data: state.user,
		user: state.user.userData,
	}
}
export default connect(mapStateToProps, { setDeviceToken, setUserData, setCurrentTicket, setVoipToken, setSession })(SplashScreeen);