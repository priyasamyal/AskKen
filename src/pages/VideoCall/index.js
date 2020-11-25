import React, { Component } from 'react';
import styles from './styles';
import {
    View,
    ImageBackground,
    TouchableOpacity,
    Image,
    Linking,
    Platform,
    Text,
    Animated,
} from 'react-native';
import * as Animatable from "react-native-animatable";
import {
    postApiRequestWithHeaders,
    errorHandler,
    errorHandler1,
    getApiRequest,
    showToast,
    networkCheck,
    alertWithTwoBtn,
    alertWithSingleBtn,
    clear_push_interval,socket
} from '../../common/user';
import moment from 'moment';
import { setUserData,setCurrentTicket,setSession } from "../../actions";
import { Dimensions, Keyboard, DeviceEventEmitter } from 'react-native';
import { connect } from "react-redux";
var { width, height } = Dimensions.get('window');
import MovableView from 'react-native-movable-view';
import { colors } from '../../common/index';
import commonData from '../../common/data.js';
import { OTSession, OTPublisher, OTSubscriber, OTSubscriberView } from 'opentok-react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackgroundTimer from 'react-native-background-timer';
import Torch from 'react-native-torch';
import Footer from '@custom_components/Footer';
import Connecting from '@custom_components/Connecting';
import Rating from '@components/Rating';
import RNCallKeep from 'react-native-callkeep';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { StackActions, NavigationActions } from 'react-navigation';
import SystemSetting from 'react-native-system-setting'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
const refresh = require('../../assets/imgs/refresh.png');
const swipe_toggle = require('../../assets/imgs/swipe_down.png');
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import InCallManager from 'react-native-incall-manager';
import Load from 'react-native-loading-gif';
import EndCallPopUp from '@custom_components/EndCallPopUp';

import SocketIOClient from 'socket.io-client';
import { TabHeading } from 'native-base';
BackgroundTimer.start();
// create a component
const onIncomingCallDisplayed = ({ error, callUUID, handle, localizedCallerName, fromPushKit }) => {
    //console.log(`[onIncomingCallDisplayed]`);
};
RNCallKeep.addEventListener('didDisplayIncomingCall', onIncomingCallDisplayed);
count = 0;
timeoutId = '';
end_signal_timer = "";
class VideoCall extends Component {
    socket = SocketIOClient('https://www.askkenapp.com:3000/', { jsonp: true, secure: true, transports: ['websocket'] });
    constructor(props) {

        super(props);
        console.log(this.props,"lklklkl....")
        this.stream_counter = 0;
        this.update_footer = React.createRef();
        this.is_internet = true;
        this.is_session_connected = false;
        this.isRefresh = false;
        this.state = {
            cameraPosition: 'front',
            session: this.props.navigation.getParam('pageFrom', 'hi') =="card" ?'connecting':'connect',
            // session: 'connect',
            timer: null,
            minutes_Counter: '00',
            seconds_Counter: '00',
            publishVideo: true,
            publishAudio: true,
            showFlash: false,
            selfie_on: true,
            signal: {
                type: '',
            },
            speaker_on: true,
            apiKey: this.props.navigation.getParam('pageFrom', 'hi') !="card" ? this.props.sessionData.current_ticket.api_key:'',
            sessionId: this.props.navigation.getParam('pageFrom', 'hi') !="card" ? this.props.sessionData.current_ticket.session_id:'',
            token: this.props.navigation.getParam('pageFrom', 'hi') != "card" ?  this.props.sessionData.current_ticket.token:'',
            subscriber_id: "0",
            // apiKey: '46703982',
            // sessionId: '2_MX40NjcwMzk4Mn5-MTU5NTM0MzI4MzQ3OX53ZlQyWFd1endJdVg5d0JLak9Nb21CUm5-fg',
            // token: 'T1==cGFydG5lcl9pZD00NjcwMzk4MiZzaWc9ZDNmZDQxMGIzMDE5MjM3YmQ4YzgzMjZmNGQ0OWUwMzg0MjNmMjQ4YTpzZXNzaW9uX2lkPTJfTVg0ME5qY3dNems0TW41LU1UVTVOVE0wTXpJNE16UTNPWDUzWmxReVdGZDFlbmRKZFZnNWQwSkxhazlOYjIxQ1VtNS1mZyZjcmVhdGVfdGltZT0xNTk1MzQzMjgzJnJvbGU9bW9kZXJhdG9yJm5vbmNlPTE1OTUzNDMyODMuNTEwMjEzMTA1MDMxNTUmZXhwaXJlX3RpbWU9MTU5NTk0ODA4MyZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PWZvY3Vz',
            endCount: 0,
            subscriber_video_on: true,
            hide_footer: false,
            expert_profile: "",
            isSwipe: false,
            sub_streamId: "",
            isSwipe_New: false,
            streamProperties: {},
            pageFrom: this.props.navigation.getParam('pageFrom', 'hi'),
            is_endCall: false,
            sub_name: "",
            category: '',
            price: '',
            call_id: '',
            all_experts: []
        };
        // console.log(this.props.navigation.getParam('payload', 'hi'), "Payload data");
        // console.log(this.props.navigation.getParam('payload', 'hi').name, "Payload name");
        // console.log(this.props.navigation.getParam('token', ''), "data from payload")
        // console.log(this.props.navigation.getParam('apiKey', ''), "data from apiKey")
        // console.log(this.props.navigation.getParam('sessionId', ''), "data from sessionId")
        this.sessionOptions = {
            // default is false
            // androidZOrder: 'onTop', // Android only - valid options are 'mediaOverlay' or 'onTop'
            // androidOnTop: 'publisher', // Android only - valid options are 'publisher' or 'subscriber'
        };
        this.sessionEventHandlers = {
            signal: event => {
                console.log('signal recived!', event);
                if (event.data == "end_call") {
                    this.props.navigation.pop();
                    if (this.end_signal_timer != "") {
                        clearTimeout(this.end_signal_timer);
                    }
                    this.setState({ endCount: 1 });
                    RNCallKeep.endAllCalls();
                    
                    InCallManager.stop();
                    if (this.props.user.user_type != 'owner') {
                        this.connectDisconnect("disconnect");
                        
                    }
                    
                    else {
                        console.log("endinfdd")
                       
                        this.setState({ session: "disconnect" });
                    }
                }
                if (event.data == "subscriber_video_on") {
                    this.setState({ subscriber_video_on: true })
                }
                if (event.data == "subscriber_video_off") {
                    this.setState({ subscriber_video_on: false })
                }
                if (event.type == "3") {
                    //console.log("event receive of profile..")
                    this.setState({ expert_profile: event.data })
                }
                if (event.type == "4") {
                    //console.log("event receive of profile..")
                    this.setState({ subscriber_id: event.data })
                }
                if (event.type == "5") {
                    //console.log("event receive of profile..")
                    if (this.props.user.name != event.data) {
                        this.setState({ sub_name: event.data })
                    }
                }
                if (event.type == "6") {
                    //console.log("event receive of profile..")
                    this.setState({ category: event.data })
                }
              
                if (event.type == "8") {
                    this.setState({ call_id: event.data })
                }
              
            },
            streamCreated: event => {
                console.log('Stream created1!', event, this.stream_counter);
                InCallManager.stopRingback();
                clear_push_interval();
                if (this.timeoutId) {
                    BackgroundTimer.clearTimeout(this.timeoutId);
                }
                BackgroundTimer.setTimeout(() => {
                    this.setState({ sub_streamId: event.streamId });
                }, 1500);
                if (this.stream_counter == 0) {
                    BackgroundTimer.setTimeout(() => {
                        let timer = setInterval(() => {
                            var num = (Number(this.state.seconds_Counter) + 1).toString(),
                                count = this.state.minutes_Counter;
                            if (Number(this.state.seconds_Counter) == 59) {
                                count = (Number(this.state.minutes_Counter) + 1).toString();
                                num = '00';
                            }
                            this.setState({
                                minutes_Counter: count.length == 1 ? '0' + count : count,
                                seconds_Counter: num.length == 1 ? '0' + num : num
                            });
                        }, 1000);

                        this.setState({ timer });
                    }, 1500);
                }
             
                this.setState({ pageFrom: 'session', publishAudio: true, publishVideo: true })
                const streamProperties = {
                    ...this.state.streamProperties, [event.streamId]: {
                        subscribeToAudio: true,
                        subscribeToVideo: true,
                    }
                };
                this.setState({ streamProperties });
                if (this.props.user.user_type == "expert") {
                    this.sendSignal("3", this.props.user.profile_image);
                    BackgroundTimer.setTimeout(() => {
                        this.sendSignal("4", this.props.user.user_id.toString());
                    }, 1000);
                    if (this.stream_counter == 0) {
                        this.stream_counter = 1;
                        this.connectDisconnect('connect');
                    }
                }
                this.stream_counter = 1;
                InCallManager.start({ media: 'video' });
                InCallManager.setForceSpeakerphoneOn(true);
            },
            streamDestroyed: event => {
                // this.setState({ sub_streamId: "" })
                console.log('Stream destroyed1!', event);
                // if (this.state.endCount == 0) {
                //     this.footerCallback('refresh');
                // }
                // networkCheck().then(data => {
                //     if (data) {
                //         this.is_internet = true;
                //         if (this.state.endCount == 0) {
                //             this.footerCallback('refresh');
                //         }
                //     } else {
                //         //  console.log("not connected.");
                //         if (this.is_internet) {
                //             this.is_internet = false;
                //             alertWithSingleBtn(
                //                 'Connection Lost',
                //                 commonData.ToastMessages.video_no_internet,
                //                 'Reconnect',
                //                 //  'Refresh',
                //             ).then(data => {
                //                 console.log(data, "data on networl", this.state);
                //                 if (data) {

                //                     networkCheck().then(data => {
                //                         if (data) {
                //                             this.is_internet = true;
                //                             this.isRefresh = true
                //                             this.footerCallback('refresh');
                //                             // if (this.state.sub_streamId == "") {
                //                             //     this.footerCallback('refresh')
                //                             // } else {
                //                             //     showToast("Reconnecting.....")
                //                             // }

                //                         } else {
                //                             this.is_internet = true;
                //                             showToast(commonData.ToastMessages.no_internet)
                //                         }
                //                     })

                //                 } else {
                //                     this.is_internet = true;
                //                 }
                //             });
                //         }

                //     }
                // })

            },//
            sessionConnected: event => {
                console.log('session connected1 ', event, this.state);
                // this.setState({ sub_streamId: "1"});   
            },
            sessionDisconnected: event => {
                console.log('session disconnected1', event);
                // this.footerCallback('refresh');
                if (this.state.endCount == 0) {
                    // this.footerCallback('refresh');
                }
                // networkCheck().then(data => {
                //     console.log(data, "network data....")
                //     if (data) {
                //         // this.is_internet = true;
                //         // if (this.state.endCount == 0) {
                //         //     this.footerCallback('refresh');
                //         // }
                //     } else {
                //         this.footerCallback('refresh');
                //         // //  console.log("not connected.");
                //         // if (this.is_internet) {
                //         //     this.is_internet = false;
                //         //     alertWithSingleBtn(
                //         //         'Connection Lost',
                //         //         commonData.ToastMessages.video_no_internet,
                //         //         'Reconnect',
                //         //         //  'Refresh',
                //         //     ).then(data => {
                //         //         console.log(data, "data on networl", this.state);
                //         //         if (data) {
                //         //             this.footerCallback('refresh');
                //         //             //networkCheck().then(data => {
                //         //             //     if (data) {
                //         //             //         console.log("refres calling")
                //         //             //         this.is_internet = true;
                //         //             //         this.footerCallback('refresh');
                //         //             //         // if (this.state.sub_streamId == "") {
                //         //             //         //     this.footerCallback('refresh')
                //         //             //         // } else {
                //         //             //         //     showToast("Reconnecting.....")
                //         //             //         // }

                //         //             //     } else {
                //         //             //         console.log("no refres calling")
                //         //             //         this.is_internet = true;
                //         //             //         showToast(commonData.ToastMessages.no_internet)
                //         //             //     }
                //         //             // })

                //         //         } else {
                //         //             this.is_internet = true;
                //         //         }
                //         //     });
                //         // }

                //     }
                // })
            },
            otrnError: event => {
                console.log('session otrnError', event);
                this.footerCallback('refresh');
            },
            sessionReconnecting: event => {
                console.log('session sessionReconnecting', event);
                if (this.state.endCount == 0) {
                    this.footerCallback('refresh');
                }
            },
            // streamPropertyChanged: event => {
            //     console.log('session streamPropertyChanged', event);
            // },

        };
        // this.subscriberEventHandlers = {
        //     error: (error) => {
        //         console.log(`There was an error with the subscriber: ${error}`);
        //     },
        //     videoNetworkStats: (error) => {
        //         // setTimeout(() => {
        //         //  console.log(`There was an videoNetworkStats with the subscriber: ${error}`, error);
        //         // }, 5000);

        //         // networkCheck().then(data => {
        //         //     if (!data) {
        //         //         console.log(data, "internet chck")
        //         //         if (this.state.endCount == 0) {
        //         //             this.footerCallback('refresh');
        //         //         }
        //         //     }
        //         //else {
        //         //         //  console.log("not connected.");
        //         //         if (this.is_internet) {
        //         //             this.is_internet = false;
        //         //             alertWithSingleBtn(
        //         //                 'Connection Lost',
        //         //                 commonData.ToastMessages.video_no_internet,
        //         //                 'Reconnect',
        //         //                 //  'Refresh',
        //         //             ).then(data => {
        //         //                 console.log(data, "data on networl", this.state);
        //         //                 if (data) {

        //         //                     networkCheck().then(data => {
        //         //                         if (data) {
        //         //                             this.is_internet = true;
        //         //                             this.footerCallback('refresh');
        //         //                             // if (this.state.sub_streamId == "") {
        //         //                             //     this.footerCallback('refresh')
        //         //                             // } else {
        //         //                             //     showToast("Reconnecting.....")
        //         //                             // }

        //         //                         } else {
        //         //                             this.is_internet = true;
        //         //                             showToast(commonData.ToastMessages.no_internet)
        //         //                         }
        //         //                     })

        //         //                 } else {
        //         //                     this.is_internet = true;
        //         //                 }
        //         //             });
        //         //         }

        //         //     }
        //         // })
        //     },
        //     otrnError: (error) => {
        //         //  console.log(`There was an otrnError with the subscriber: ${error}`, error);
        //     },

        // };

        // this.publisherEventHandlers = {
        //     streamCreated: event => {
        //         console.log('Publisher stream created!', event);
        //     },
        //     streamDestroyed: event => {
        //         console.log('Publisher stream destroyed!', event);
        //         this.sendSignal("19", "Hello");
        //     },
        //     otrnError: (error) => {
        //         console.log(`There was an otrnError with the Publisher: ${error}`, error);
        //     },
        //     error: (error) => {
        //         console.log(`There was an otrnError with the Publisher: ${error}`, error);
        //     },
        // };

        BackgroundTimer.setTimeout(() => {
            console.log("Dismming keyboard....")
            Keyboard.dismiss();
        }, 2000);

        RNCallKeep.addEventListener('didPerformDTMFAction', this.didPerformDTMFAction);
        RNCallKeep.addEventListener('didReceiveStartCallAction', this.didReceiveStartCallAction);
        RNCallKeep.addEventListener('didPerformSetMutedCallAction', this.didPerformSetMutedCallAction);
        RNCallKeep.addEventListener('didToggleHoldCallAction', this.didToggleHoldCallAction);
        RNCallKeep.addEventListener('endCall', this.endCall);
        //  DeviceEventEmitter.addListener('Proximity', this.proximityEvent);
        DeviceEventEmitter.addListener('Proximity', (data) => {
            // --- do something with events
            //   console.log("prox data....", data)
        });


        // SystemSetting.getVolume().then((volume) => {
        //     console.log('Current volume is ' + volume);
        // });
        // SystemSetting.setVolume(1.0);
        // const volumeListener = SystemSetting.addVolumeListener((data) => {
        //     const volume = data.value;
        //     console.log(volume, "vol");
        // });
        // this.props.user.user_type = 'owner';
        // if (this.props.user.user_type == 'expert') {
        //     //  console.log("expert callind")
        //     this.state.publishVideo = false;
        //     // this.setState({ publishVideo: false })
        // } else {
        //     this.state.publishVideo = true
        // }
        // console.log(this.props.user, "user_details..");
        // console.log(this.state, "all states....")

    }

    didPerformDTMFAction = ({ callUUID, digits }) => {
        //  console.log(`[didPerformDTMFAction1] ${callUUID}, number: ${digits} `);
    };
    didReceiveStartCallAction = ({ handle }) => {
        //console.log(`[didReceiveStartCallAction1] , number: ${handle}`);
    };
    didPerformSetMutedCallAction = ({ muted, callUUID }) => {
        // console.log(`[didPerformSetMutedCallAction1] ${callUUID}, muted: ${muted} `);
    };
    didToggleHoldCallAction = ({ hold, callUUID }) => {
        // console.log(`[didToggleHoldCallAction1] ${callUUID}, hold: (${hold})`);
    };
    endCall = ({ callUUID }) => {
        // console.log(`[endCall1] ${callUUID}, `);
    };
    onIncomingCallDisplayed = () => {
        // console.log(`[onIncomingCallDisplayed1]`);
    };
    stateUpdated() {
        //  console.log("State Updated;");
        //  console.log(this.state, "All states....");
        //  this.setState(, marginBo{ session: 'connect' });
    }
    componentDidLeave() {
        // console.log('Did Leave');
        //deactivateKeepAwake();
        //remove listener when you need it no more
        //  SystemSetting.removeVolumeListener(volumeListener)
    }
    proximityEvent = (ev) => {
        // console.log(ev, "proximity ev")
    }

    componentDidMount() {
      InCallManager.setSpeakerphoneOn(true);
      InCallManager.setForceSpeakerphoneOn(true)
        if (this.props.navigation.getParam('pageFrom', 'hi') == "card") {
            this.ticketDetailAPI();
        } else {
            var join_param = {
                chat_room_id: this.props.sessionData.current_ticket.chat_room_id, username: this.props.user.name
              }
              this.socket.emit('join_group', { chat_room_id: this.props.sessionData.current_ticket.chat_room_id, username: this.props.user.name, time_zone: commonData.time_zone });
              console.log(this.props.sessionData,"SessionData.....")
        }
        activateKeepAwake();
        var footer_height = (25 / 100) * height;
        this.searchHeight = new Animated.Value(footer_height); 
        this.setState({ startDisable: true });
       
    }

    ticketDetailAPI = () => {
        console.log(this.state,"lll")
        let param = {
            ticket_id: this.props.ticket_data.current_ticket.ticket_id,
            receiver: this.props.user.user_type == "expert" ? 'owner' : "expert"
        }
        postApiRequestWithHeaders(
            commonData.api_endpoint.create_session,
            param, this.props.user.access_token
        ).then(
            data => {
                this.props.setSession(data);
                this.setState({
                    apiKey: data.current_ticket.api_key,
                    sessionId: data.current_ticket.session_id,
                    token: data.current_ticket.token,
                  //  session: 'connect',
                })
                setTimeout(() => {
                    this.setState({
                        session: 'connect',
                    })
                }, 1000);

               var join_param = {
                chat_room_id: this.props.sessionData.current_ticket.chat_room_id, username: this.props.user.name
              }
              this.socket.emit('join_group', { chat_room_id: this.props.sessionData.current_ticket.chat_room_id, username: this.props.user.name, time_zone: commonData.time_zone });
              console.log(this.props.sessionData,"SessionData.....")
            },
            error => {

            },
        );
    }

    notifyOwnerAcceptCall = () => {
        console.log("notifyOwnerAcceptCall")
        var push_data = {
            "data": [
                {
                    "notification": {
                        "body": "Ask Ken Call Accepted",
                        "title": "Call Accepted...",
                        "content_available": true,
                        "priority": "high"
                    },
                    data: {
                        type: 'accept_call',
                        device_token: this.props.user.device_token,
                        user_id: this.props.user.user_id,
                        name: this.props.user.name,
                        uuid: commonData.push_payload.uuid,
                        phone_number: this.props.user.phone_number.replace(/\s/g, ''),
                        sessionId: commonData.push_payload.sessionId,
                        token: commonData.push_payload.token,
                        category: commonData.push_payload.category,
                        apiKey: commonData.push_payload.apiKey,
                        call_id: commonData.push_payload.call_id,
                        notify_users: [{
                            device_token: commonData.push_payload.device_token,
                            user_id: commonData.push_payload.user_id,
                            uuid: commonData.push_payload.uuid
                        }],
                    }

                }
            ]
        }

        console.log(push_data, "push_data..notifyOwnerAcceptCall")
        postApiRequestWithHeaders(
            commonData.api_endpoint.push_payload,
            push_data,
        ).then(
            data => {
                console.log("Push send....");
                console.log(data, 'data.....');
            },
            error => {
                console.log('error....', error);
                // this.setState({ loader: false });
                errorHandler(error, this.props);
            },
        );
    }
    decreaseHeightofSearch = () => {
        var footer_height = (25 / 100) * height;
        //  console.log(this.searchHeight._value, "check..", footer_height);

        // if[] (this.searchHeight._value == 200 || this.searchHeight._value == 20)
        if (this.searchHeight._value == footer_height || this.searchHeight._value == 20)
            if (this.searchHeight._value == footer_height) {
                if (this.update_footer.current != null) {
                    this.update_footer.current.updateHeight("hide");
                }
                Animated.timing(this.searchHeight, {
                    toValue: 20,
                    duration: 400
                }).start(() => {
                    this.setState({ hide_footer: true })
                })
            } else {
                this.setState({ hide_footer: false })
                Animated.timing(this.searchHeight, {
                    toValue: footer_height,
                    duration: 400
                }).start(() => {
                    if (this.update_footer.current != null) {
                        this.update_footer.current.updateHeight("show");

                    }
                })
            }

    }

    sendSignal(code, text) {
        //console.log('send signal', code, text);
        this.setState({
            signal: {
                type: code,
                data: text,
            },
        });
    }
    footerCallback = (action) => {
        //  console.log(action, "Parent callback");
        switch (action) {
            case "toggleVideo":
                this.setState({ publishVideo: !this.state.publishVideo }, () => {
                    //   console.log(this.state.publishAudio, "audioo....")
                    if (this.props.user.user_type != 'owner') {
                        if (this.state.publishVideo) {
                            this.sendSignal("1", "subscriber_video_on");
                        } else {
                            this.sendSignal("1", "subscriber_video_off");
                        }
                    }
                });
                break;
            case "toggleMute":
                this.setState({ speaker_on: !this.state.speaker_on }, () => {
                    //  console.log("speaker changes...", this.state.speaker_on);
                    if (!this.state.speaker_on) {
                        //  console.log("enter")
                        InCallManager.start({ media: 'audio' });
                        InCallManager.setForceSpeakerphoneOn(false);
                        InCallManager.start();
                    } else {
                        InCallManager.setForceSpeakerphoneOn(true);
                        InCallManager.start({ media: 'video' });
                        InCallManager.stop();
                    }
                    if (this.state.speaker_on) {
                        SystemSetting.setVolume(1.0);
                    } else {
                        SystemSetting.setVolume(0.2);
                    }
                })
                break;
            case "toggleAudio":
                //  console.log("toggle audio")
                this.setState({ publishAudio: !this.state.publishAudio }, () => {
                })
                break;
            case "endCall":
                this.setState({
                    is_endCall: !this.state.is_endCall
                })
                break;
            case "toggleTorch": {
                console.log(this.state.showFlash, "toggle")
                if (this.state.showFlash == false) {
                    //   console.log("chaneg camera")
                    this.setState({ cameraPosition: 'back' })
                    BackgroundTimer.setTimeout(() => {
                        this.setState(
                            {
                                showFlash: !this.state.showFlash,
                            },
                            () => {
                                //  console.log(this.state)
                                Torch.switchState(this.state.showFlash);
                            }
                        );
                    }, 500);

                } else {
                    this.setState(
                        {
                            showFlash: !this.state.showFlash,
                        },
                        () => {
                            //  console.log(this.state)
                            Torch.switchState(this.state.showFlash);
                        }
                    );
                }
                break;
            }
            case 'refresh': {
                this.setState({ session: "connecting", isSwipe: false, })
                // BackgroundTimer.setTimeout(() => {
                //     console.log("re connecting keyboard....");
                //     this.setState({ session: "connect" });
                //     console.log(this.state, "all state......")
                // }, 2000);

                // networkCheck().then(data => {
                //     if (data) {
                //         // console.log("refres calling switch")
                //         // console.log("refres..")
                //         this.setState({ session: "connecting", isSwipe: false, })
                //         BackgroundTimer.setTimeout(() => {
                //             console.log("re connecting keyboard....");
                //             this.setState({ session: "connect" });
                //             console.log(this.state, "all state......")
                //         }, 2000);

                //     } else {
                //         ///   console.log("no refres calling")
                //         // this.is_internet = true;
                //         // showToast(commonData.ToastMessages.no_internet);
                //         alertWithSingleBtn(
                //             'Connection Lost',
                //             commonData.ToastMessages.video_no_internet,
                //             'Reconnect',
                //             //  'Refresh',
                //         ).then(data => {
                //             //  console.log(data);
                //             if (data) {
                //                 //  console.log(data, "data");
                //                 networkCheck().then(data => {
                //                     if (data) {
                //                         this.is_internet = true;
                //                         this.footerCallback('refresh')
                //                     } else {
                //                         this.is_internet = true;
                //                         showToast(commonData.ToastMessages.no_internet)
                //                     }
                //                 })

                //             } else {
                //                 this.is_internet = true;
                //             }
                //         });
                //     }
                // })

                break;
            }
            case "switchCamera": {
                //  this.footerCallback('refresh')
                // console.log("refres..")
                // this.setState({ session: "connecting", isSwipe: false, })
                // BackgroundTimer.setTimeout(() => {
                //     console.log("re connecting keyboard....");
                //     this.setState({ session: "connect" });
                //     console.log(this.state, "all state......")
                // }, 1000);
                // break;
                if (this.state.cameraPosition == 'back') {
                    this.setState({ cameraPosition: 'front' })
                } else {
                    this.setState({ cameraPosition: 'back' })
                }
                break;
            }
            case 'dismiss': {
                // console.log("Dismisss");
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'HomePage' })],
                });
                this.props.navigation.dispatch(resetAction);
                break;
            }
            case 'Tip': {
                ///  console.log("Dismisss");
                this.props.navigation.navigate('Tip', {
                    payload: this.props.navigation.getParam('payload', 'hi'),
                    call_id: this.props.navigation.getParam('call_id', 'hi'),
                    expert_id: this.state.subscriber_id,
                    subscriber_name: this.state.sub_name
                });
                break;
            }
            case 'swipe': {
                // console.log("Swipe");
                // this.setState({ isSwipe: !this.state.isSwipe });
                //   if (this.props.user.user_type == 'owner') {
                if (this.state.isSwipe_New) {
                    this.move_sub.resetContainer();
                }
                this.setState({ isSwipe_New: !this.state.isSwipe_New }, () => {
                    // console.log(this.move, "this.move")

                    if (this.state.isSwipe_New) {
                        this.move.resetContainer();
                    } else {
                        //this.move_sub.resetContainer();
                    }
                    this.move.changeDisableStatus();
                    this.move_sub.changeDisableStatus();
                })
                //  }
                // if (this.props.user.user_type == 'owner') {
                //     this.setState({ isSwipe: !this.state.isSwipe })
                // }

            }
            default:
                break;
        }


    }

    connectDisconnect(type) {

              var param = {
                "call_id":this.props.sessionData.call_id,
                type: type,
            } 
            console.log(param,"Connect Disccont", this.props)
            postApiRequestWithHeaders(
                commonData.api_endpoint.connect,
                param, this.props.user.access_token
              ).then(
                data => {
                  console.log(data,"Connect Disccont");  
                
                },
                error => {
                
                },
              )
        // console.log("connectDisconnect call...", type);
        // if ((type == "connect" && this.props.user.user_type != 'owner') || type != "connect") { 
        //     var param = {
        //         "call_id": this.props.navigation.getParam('payload', 'hi').call_id,
        //         user_id: this.props.user.user_id,
        //         type: type,
        //         timer: this.state.minutes_Counter + ":" + this.state.seconds_Counter,
        //     }
        //     if (this.props.user.user_type != 'owner') {
        //         param.expert_id = this.props.user.user_id
        //     }
        //     if (type != "connect") {
        //     }
        //     postApiRequestWithHeaders(
        //         commonData.api_endpoint.connect,
        //         param,
        //     ).then(
        //         data => {
        //             if (type != "connect") {
        //                 this.setState({ session: "disconnect" });
        //                 // const resetAction = StackActions.reset({
        //                 //     index: 0,
        //                 //     actions: [NavigationActions.navigate({ routeName: 'HomePage' })],
        //                 // });
        //                 // this.props.navigation.dispatch(resetAction);
        //             }
        //             if (type == "connect") {
        //                 setTimeout(() => {
        //                     this.notifyOtherRejectCall();
        //                 }, 1000);
        //             }
        //         },
        //         error => {

        //             if (type != "connect") {

        //             }
        //             if (type == "connect") {

        //                 const resetAction = StackActions.reset({
        //                     index: 0,
        //                     actions: [NavigationActions.navigate({ routeName: 'HomePage' })],
        //                 });
        //                 this.props.navigation.dispatch(resetAction);
        //                 showToast("Another expert already connected before you. Next time be quick.");
        //             }
        //             errorHandler1(error, this.props);

        //         },
        //     );
        // }

    }

    onSwipe = (gestureName, gestureState) => {
        const { SWIPE_UP, SWIPE_DOWN } = swipeDirections;
        switch (gestureName) {
            case SWIPE_UP:
                console.log('swipe up');
                this.decreaseHeightofSearch()
                break;
            case SWIPE_DOWN:
                console.log('swipe down');
                this.decreaseHeightofSearch()
                break;
        }
    };

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.BLACK_TEXT, }}>
                {this.renderView()}
            </View>
        );
    }
    subscriberWindowClick = () => {
        console.log()
        if (this.state.isSwipe_New) {
            if (this.props.user.user_type == 'owner') {
                this.footerCallback('swipe')
            }
        } else {
            // this.decreaseHeightofSearch()
        }
    }

    publisherWindowClick = () => {
        if (!this.state.isSwipe_New) {
            if (this.props.user.user_type == 'owner') {
                this.footerCallback('swipe')
            }
        } else {
            // this.decreaseHeightofSearch()
        }
    }
    notifyOtherRejectCall = () => {
        console.log("notifyOtherRejectCall", this.state.all_experts);
        // var notifyuser = JSON.parse(commonData.push_payload.notify_users);
        var notifyuser = this.state.all_experts;
        console.log(notifyuser, "notifyuser..");
        var filter_user = [];
        filter_user = notifyuser.filter(data => {
            return data.user_id != this.props.user.user_id
        })


        var push_data = {
            "data": [
                {
                    "notification": {
                        "body": "Ask Ken Call Missed",
                        "title": "Call Missed",
                        "content_available": true,
                        "priority": "high"
                    },
                    data: {
                        type: 'auto_end_call',
                        device_token: this.props.user.device_token,
                        user_id: this.props.user.user_id,
                        name: this.props.user.name,
                        uuid: commonData.push_payload.uuid,
                        phone_number: this.props.user.phone_number.replace(/\s/g, ''),
                        sessionId: commonData.push_payload.sessionId,
                        token: commonData.push_payload.token,
                        category: commonData.push_payload.category,
                        apiKey: commonData.push_payload.apiKey,
                        call_id: commonData.push_payload.call_id,
                        notify_users: filter_user,
                    }
                },
            ]
        }

        console.log(push_data, "push_data..");
        postApiRequestWithHeaders(
            commonData.api_endpoint.push_payload,
            push_data,
        ).then(
            data => {
                console.log("Push send....");
                console.log(data, 'data.....');
            },
            error => {
                console.log('error....', error);
                // this.setState({ loader: false });
                errorHandler(error, this.props);
            },
        );
    }

    /*****Render subscribers dynamicaly for swapping.. ****/
    renderSubscribers = (subscribers) => {

        networkCheck().then(data => {
            if (data) {
                this.is_internet = true;
            } else {
                //  console.log("not connected.");
                if (this.is_internet) {
                    this.is_internet = false;
                    alertWithSingleBtn(
                        'Connection Lost',
                        commonData.ToastMessages.video_no_internet,
                        'Reconnect',
                        //  'Refresh',
                    ).then(data => {
                        //  console.log(data);
                        if (data) {
                            console.log(data, "data");
                            networkCheck().then(data => {
                                if (data) {
                                    this.is_internet = true;
                                    this.footerCallback('refresh')
                                } else {
                                    this.is_internet = true;
                                    showToast(commonData.ToastMessages.no_internet)
                                }
                            })

                        } else {
                            this.is_internet = true;
                        }
                    });
                }

            }
        })
        //  console.log(subscribers, "subss.....", this.state);
        if (subscribers.length == 0 && this.state.session == 'connect') {
            subscribers = [this.state.sub_streamId];
        }
        console.log(subscribers.length, "subss..... ");
        return subscribers.map((streamId) => (
            <TouchableOpacity
                activeOpacity={1}
                key={streamId}
                onPress={() =>
                    this.subscriberWindowClick()}
            >
                <OTSubscriberView streamId={streamId} style={{ width: "100%", height: !this.state.subscriber_video_on && this.props.user.user_type != 'expert' ? "0%" : "100%", backgroundColor: colors.BLACK_TEXT, }} />

            </TouchableOpacity>
        ));
    };
    renderView() {
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80,
        };

        if (this.state.session == 'connecting') {
            return (
                // <Connecting parentCallback={this.callFailAction} pageFrom="refresh"></Connecting>
                <Connecting parentCallback={this.timeOutScreen1} pageFrom={this.state.pageFrom} onRef={ref => (this.child = ref)} ></Connecting>

            );
        }
        else if (this.state.session == 'connect') {
         
            return (
                <OTSession apiKey={this.state.apiKey} sessionId={this.state.sessionId} token={this.state.token}
                    eventHandlers={this.sessionEventHandlers}
                    signal={this.state.signal}>
                         {/* <OTSubscriber
                                    eventHandlers={this.subscriberEventHandlers}
                                    streamProperties={this.state.streamProperties}
                                    style={{ width: 50, height: 50, backgroundColor: colors.THEME_YELLOW, }}
                                /> */}
                    <MovableView
                        ref={ref => this.move_sub = ref}
                        disabled={true}
                        style={{
                            flex: !this.state.isSwipe_New ? 1 : 0,
                            backgroundColor: colors.THEME_YELLOW,
                            width: !this.state.isSwipe_New ? width : 100,
                            height: !this.state.isSwipe_New ? height : 125,
                            zIndex: !this.state.isSwipe_New ? 1 : 5,
                            marginTop: !this.state.isSwipe_New ? 0 : "10%",
                            marginLeft: !this.state.isSwipe_New ? 0 : "65%",
                            borderWidth: !this.state.isSwipe_New ? 0 : 5,
                            borderColor: colors.LIGHT_COLOR,
                            borderRadius: 5,
                        }}>

                     


                        <View style={{
                              flex: !this.state.isSwipe_New ? 1 : 0,
                            backgroundColor: colors.BLACK_TEXT,
                            height: !this.state.isSwipe_New ? height : 115,
                        }}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() =>
                                    this.subscriberWindowClick()}
                            >

                                <OTSubscriber
                                    eventHandlers={this.subscriberEventHandlers}
                                    streamProperties={this.state.streamProperties}
                                    style={{ width: "100%", height: !this.state.subscriber_video_on && this.props.user.user_type != 'expert' ? "0%" : "100%", backgroundColor: colors.BLACK_TEXT, }}
                                />
                            </TouchableOpacity>
                            {!this.state.subscriber_video_on && this.props.user.user_type != 'expert' && (
                                <TouchableOpacity
                                    style={{ top: "0%" }}
                                    onPress={() =>
                                        this.subscriberWindowClick()}
                                >
                                    <ImageBackground
                                        source={refresh}
                                        source={{
                                            uri:
                                                commonData.profile_picture_url +
                                                this.state.expert_profile,
                                        }}
                                        style={{ width: '100%', height: "100%" }}>
                                    </ImageBackground>
                                </TouchableOpacity>
                            )
                            }
                        </View>

                    </MovableView>
                    <MovableView
                        ref={ref => this.move = ref}
                        disabled={false}
                        style={{
                            width: !this.state.isSwipe_New ? 0 : width,
                            borderRadius: 5,
                            marginLeft: !this.state.isSwipe_New ? "65%" : 0,
                            height: 1,
                            position: 'absolute',
                            zIndex: 3,
                            bottom: 0,
                            marginTop: !this.state.isSwipe_New ? "10%" : 0,
                            display: 'flex',
                            //  display: this.state.publishVideo ? "flex" : 'none',
                            left: 0,
                            top: 0,
                            backgroundColor: colors.BLACK_TEXT
                        }
                        }>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{ top: "0%" }}
                            onPress={() =>
                                this.publisherWindowClick()}
                        >
                            <View
                                style={{
                                    position: 'absolute',
                                    backgroundColor: 'black',
                                    width: !this.state.isSwipe_New ? 100 : width,
                                    height: !this.state.isSwipe_New ? 125 : height,
                                    borderWidth: !this.state.isSwipe_New ? 5 : 0,
                                    borderColor: colors.LIGHT_COLOR,
                                    borderRadius: 5,
                                    left: 0,
                                    top: "0%",
                                    display: this.state.publishVideo ? "flex" : 'none',
                                }}>

                                <OTPublisher
                                    properties={{
                                        publishAudio: this.state.publishAudio,
                                        cameraPosition: this.state.cameraPosition,
                                      
                                        publishVideo: this.state.publishVideo
                                    }} style={{ width: "100%", height: "100%", backgroundColor: 'black', display: 'flex' }} />


                            </View>
                            {!this.state.subscriber_video_on && this.props.user.user_type == 'expert' && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        backgroundColor: 'black',
                                        width: !this.state.isSwipe_New ? 100 : width,
                                        height: !this.state.isSwipe_New ? 125 : height,
                                        borderWidth: !this.state.isSwipe_New ? 5 : 0,
                                        borderColor: colors.LIGHT_COLOR,
                                        borderRadius: 5,
                                        left: 0,
                                        top: "0%",
                                        display: this.state.publishVideo ? "none" : 'flex',
                                    }}
                                >
                                    <ImageBackground
                                        source={refresh}
                                        source={{
                                            uri:
                                                commonData.profile_picture_url +
                                                this.state.expert_profile,
                                        }}
                                        style={{ width: '100%', height: '100%' }}>
                                    </ImageBackground>

                                </View>
                            )}
                        </TouchableOpacity>
                    </MovableView >

                    {this.state.sub_streamId == "" && (
                        <View style={{
                            zIndex: 10,
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: width,
                            height: height,
                        }}>

                            <Connecting parentCallback={this.timeOutScreen1} pageFrom={this.state.pageFrom} onRef={ref => (this.child = ref)} ></Connecting>
                        </View>
                    )}

                    {this.state.is_endCall && (
                        <View style={{
                            zIndex: 10,
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: width,
                            height: height,
                        }}>
                            <EndCallPopUp clickHandler={this.popUpClick}></EndCallPopUp>
                        </View>
                    )}
                    {this.state.sub_streamId != "" && (
                        <View style={styles.timer_container}>
                            <Text style={styles.timer_text}>{this.state.minutes_Counter} : {this.state.seconds_Counter}</Text>
                        </View>
                    )}
                    <View
                        style={{
                            zIndex: 5,
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: '100%',
                            height: 80,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            alignItems: 'center',
                            alignContent: 'space-between',
                            backgroundColor: "transparent",
                            marginBottom: "10%"

                        }}>
                        <LinearGradient
                            colors={['transparent', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 1)',]}
                            style={[styles.linearGradient]}>
                            <Footer parentCallback={this.footerCallback} subscriber_info={this.props.navigation.getParam('payload', 'hi')} stateParams={this.state}></Footer>
                        </LinearGradient>
                    </View>
                </OTSession>


            )

        }
    }

    popUpClick = status => {
        console.log(status, "status");
        switch (status) {
            case "back":
                this.setState({ is_endCall: false })
                break;
            case "end":
                InCallManager.stop();
                clearInterval(this.state.timer);
                 deactivateKeepAwake();
                RNCallKeep.endAllCalls();
                InCallManager.stop();
              
                this.sendSignal(0, "end_call");
              
                // networkCheck().then(data => {
                //     if (data) {
                //         console.log("yes commected...");
                       
                
                //         this.end_signal_timer = setTimeout(() => {
                //             if (this.props.user.user_type != 'owner') {
                //                 this.connectDisconnect("disconnect");
                //                 this.setState({ session: "disconnect" });
                //                 // const resetAction = StackActions.reset({
                //                 //     index: 0,
                //                 //     actions: [NavigationActions.navigate({ routeName: 'HomePage' })],
                //                 // });
                //                 // this.props.navigation.dispatch(resetAction);



                //             }
                //             else {

                //                 console.log("endinfdd")
              
                //                 this.setState({ session: "disconnect" });


                //             }
                //         }, 3000);
                //     } else {
                //         console.log("not connected.");
                //         RNCallKeep.endAllCalls();
                //         InCallManager.stop();
                //         const resetAction = StackActions.reset({
                //             index: 0,
                //             actions: [NavigationActions.navigate({ routeName: 'HomePage' })],
                //         });
                //         this.props.navigation.dispatch(resetAction);
                //     }
                // })

                break

            default:
                break;
        }
    }

    getCommonDetails = (status) => {
        console.log("get....");
        var is_response_get = false;
        getApiRequest(commonData.api_endpoint.get_countries).then(
            data => {
                is_response_get = true
                console.log(data, "all data....");
                if (status == "call_back") {
                    this.setState({ session: "connect" });
                } else {
                    if (this.props.user.user_type != 'owner') {
                        this.connectDisconnect("disconnect");
                        // const resetAction = StackActions.reset({
                        //     index: 0,
                        //     actions: [NavigationActions.navigate({ routeName: 'HomePage' })],
                        // });
                        // this.props.navigation.dispatch(resetAction);
                        this.setState({ session: "disconnect" });
                    } else {
                        console.log("endinfdd")
                     
                        
                        this.setState({ session: "disconnect" });
                    }
                }
            },
            error => {
                // is_response_get = true
                // console.log(error, 'errorrrrrr');
                // showToast(commonData.ToastMessages.no_internet)
            },
        );

        setTimeout(() => {
            console.log(is_response_get, "reps");
            if (!is_response_get) {
                showToast(commonData.ToastMessages.no_internet)
            }
        }, 4000);
    };

    callFailAction = status => {
        //   console.log(status);
        networkCheck().then(data => {
            
            if (data) {
                switch (status) {
                    case "call_back":
                        this.getCommonDetails(status);
                        break;

                    case "end_call":
                        //
                        this.setState({ endCount: 1 });
                        RNCallKeep.endAllCalls();
                        InCallManager.stop();
                        this.getCommonDetails();


                        break;

                    default:
                        break;
                }
            } else {
                showToast(commonData.ToastMessages.no_internet)
            }
        })
    }

    timeOutScreen1 = status => {
        console.log(status,"timeOutScreen11111...")
       
        clear_push_interval();
        if (this.timeoutId) {
            BackgroundTimer.clearTimeout(this.timeoutId);
        }
    
    if (this.state.sub_streamId == "") {
        console.log("timeout....");
        clear_push_interval();
        this.props.navigation.pop();

        if(this.state.pageFrom =="splash"){
            RNCallKeep.endAllCalls();
        } else if (this.props.navigation.getParam('pageFrom', 'hi') =="card" ){
            clear_push_interval();       
            var socket_param = {
                msg: "Missed call from "+this.props.user.name+", "+ moment(new Date()).format("h:mma"),
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
              let param ={
                ticket_id:this.props.sessionData.current_ticket.ticket_id,
                receiver: this.props.user.user_type=="expert"? this.props.sessionData.current_ticket.owner_id: this.props.sessionData.current_ticket.expert_id
                 }   
                 console.log("missed_call",param)
                postApiRequestWithHeaders(
                 commonData.api_endpoint.missed_call,
                 param, this.props.user.access_token
                ).then(
                data => {
              console.log(data,"missed calll")
                },
                error => {
                
                },
              )
            
        }
    } else {
        clear_push_interval();
    }
       

    };

    timeOutScreen = status => {
        console.log(status,"timeOutScreen111112222...")
            BackgroundTimer.stop();
        clear_push_interval();
            if (this.timeoutId) {
                BackgroundTimer.clearTimeout(this.timeoutId);
            }
        
        if (this.state.sub_streamId == "") {
            console.log("timeout....");
            clear_push_interval();
            this.props.navigation.pop();
    
            if(this.state.pageFrom =="splash"){
                RNCallKeep.endAllCalls();
            } else if (this.props.navigation.getParam('pageFrom', 'hi') =="card" ){
                clear_push_interval();       
                var socket_param = {
                    msg: "Missed call from "+this.props.user.name+", "+ moment(new Date()).format("h:mma"),
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
                  let param ={
                    ticket_id:this.props.sessionData.current_ticket.ticket_id,
                    receiver: this.props.user.user_type=="expert"? this.props.sessionData.current_ticket.owner_id: this.props.sessionData.current_ticket.expert_id
                     }   
                     console.log("missed_call",param)
                    postApiRequestWithHeaders(
                     commonData.api_endpoint.missed_call,
                     param, this.props.user.access_token
                    ).then(
                    data => {
                  console.log(data,"missed calll")
                    },
                    error => {
                    
                    },
                  )
                
            }
        } else {
            clear_push_interval();
        }
    
     
       

    };

    refund(status) {
        // console.log("refund....")
        // console.log('Push send for auto end call....', this.props.navigation.getParam('call_id', 'hi'), status, this.props.navigation.getParam('price', ''));
        postApiRequestWithHeaders(commonData.api_endpoint.refund, {
            user_id: this.props.user.user_id,
            call_id: this.props.navigation.getParam('call_id', 'hi'),
        }).then(
            data => {
                //   console.log('Refund API Success', data);
                if (status == "timeout") {
                    showToast(commonData.ToastMessages.call_timeout);
                }
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'HomePage' })],
                });
                this.props.navigation.dispatch(resetAction);
            },
            error => {
                console.log('error....', error);
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'HomePage' })],
                });
                this.props.navigation.dispatch(resetAction);
                // errorHandler(error, this.props);
            },
        );
    }
}


function mapStateToProps(state) {
    console.log(state)
    return {
      user: state.user.userData,
      ticket_data: state.user,
      sessionData: state.sessionData.session
    }
  }
  export default connect(mapStateToProps, {setUserData,setCurrentTicket,setSession })(VideoCall);
  
