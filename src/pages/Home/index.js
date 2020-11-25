// import React, { Component } from 'react';
// //import React from 'react';
// import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
// import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native';
// import MovableView from 'react-native-movable-view'
// import CalKit from '../CalKit';
// // import { current_uuid } from '../CalKit';
// import { RNCamera } from 'react-native-camera';
// import BackgroundTimer from 'react-native-background-timer';
// const end_call_image = require('../../assets/imgs/end_call.png');
// const videoOn = require('../../assets/imgs/video_on.png');
// const videoOff = require('../../assets/imgs/video_off.png');
// const audioOn = require('../../assets/imgs/audio_on.png');
// const audioOff = require('../../assets/imgs/audio_off.png');
// const switch_camera = require('../../assets/imgs/flip_camera.png');
// BackgroundTimer.start();
// class Home extends Component {

//     constructor(props) {
//         super(props);
//         //  callkit = new CalKit();
//         this.apiKey = '46458752';
//         this.sessionId = '1_MX40NjQ1ODc1Mn5-MTU3NDA1NzUxNjQ1NH41ZWJwOTk3V2I0L3hibFRJVytUUEdZQTN-fg';
//         this.token = 'T1==cGFydG5lcl9pZD00NjQ1ODc1MiZzaWc9MmQwN2FhZjk4YWQwOThmY2E0NzEwMDBhZjgwZDk2MDk0Mzg1NjE0MDpzZXNzaW9uX2lkPTFfTVg0ME5qUTFPRGMxTW41LU1UVTNOREExTnpVeE5qUTFOSDQxWldKd09UazNWMkkwTDNoaWJGUkpWeXRVVUVkWlFUTi1mZyZjcmVhdGVfdGltZT0xNTc0MDU3NTI2Jm5vbmNlPTAuNTA2OTQ5MDg1MDc2ODU5NyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTc2NjQ5NTI1JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';

//         this.state = {
//             cameraPosition: 'front',
//             session: 'connect',
//             publishVideo: true,
//             publishAudio: true,
//             signal: {
//                 data: '',
//                 type: '',
//             },

//         };
//         this.sessionOptions = {
//             // default is false
//             // androidZOrder: 'onTop', // Android only - valid options are 'mediaOverlay' or 'onTop'
//             // androidOnTop: 'publisher', // Android only - valid options are 'publisher' or 'subscriber'
//         };
//         this.sessionEventHandlers = {
//             signal: event => {
//                 console.log('signal recived!', event);
//             },
//             streamCreated: event => {
//                 console.log('Stream created1!', event);
//             },
//             streamDestroyed: event => {
//                 console.log('Stream destroyed1!', event);
//             },
//             sessionConnected: event => {
//                 console.log('session connected1 ');
//             },
//             sessionDisconnected: event => {
//                 console.log('session disconnected1');
//             },
//         };
//     }
//     sendSignal() {
//         console.log('send signal');
//         this.setState({
//             signal: {
//                 type: '1',
//                 data: 'This is a demo signal!!',
//             },
//         });
//     }

//     actionHandler(action) {
//         console.log(action, 'action');
//         switch (action) {
//             case 'toggleCamera': {
//                 console.log('toggleCamera');
//                 if (this.state.cameraPosition == 'back') {
//                     this.setState((state, props) => {
//                         return {
//                             cameraPosition: 'front',
//                             session: this.state.session,
//                             publishVideo: this.state.publishVideo,
//                             publishAudio: this.state.publishAudio,
//                         };
//                     });
//                 } else {
//                     this.setState((state, props) => {
//                         return {
//                             cameraPosition: 'back',
//                             session: this.state.session,
//                             publishVideo: this.state.publishVideo,
//                             publishAudio: this.state.publishAudio,
//                         };
//                     });
//                 }

//                 break;
//             }
//             case 'diconnectSession': {
//                 this.setState((state, props) => {
//                     return {
//                         cameraPosition: this.state.cameraPosition,
//                         session: 'disconnect',
//                         publishVideo: this.state.publishVideo,
//                         publishAudio: this.state.publishAudio,
//                     };
//                 });
//                 console.log("disconnect.", this.props.current_uuid)

//                 BackgroundTimer.setTimeout(() => {
//                     this.props.parentCallback(this.props.current_uuid);
//                 }, 1000);

//                 break;
//             }
//             case 'toggleVideo': {
//                 if (this.state.publishVideo) {
//                     this.setState((state, props) => {
//                         return {
//                             cameraPosition: this.state.cameraPosition,
//                             session: this.state.session,
//                             publishVideo: false,
//                             publishAudio: this.state.publishAudio,
//                         };
//                     });
//                 } else {
//                     this.setState((state, props) => {
//                         return {
//                             cameraPosition: this.state.cameraPosition,
//                             session: this.state.session,
//                             publishVideo: true,
//                             publishAudio: this.state.publishAudio,
//                         };
//                     });
//                 }
//                 break;
//             }
//             case 'toggleAudio': {
//                 if (this.state.publishAudio) {
//                     this.setState((state, props) => {
//                         return {
//                             cameraPosition: this.state.cameraPosition,
//                             session: this.state.session,
//                             publishVideo: this.state.publishVideo,
//                             publishAudio: false,
//                         };
//                     });
//                 } else {
//                     this.setState((state, props) => {
//                         return {
//                             cameraPosition: this.state.cameraPosition,
//                             session: this.state.session,
//                             publishVideo: this.state.publishVideo,
//                             publishAudio: true,
//                         };
//                     });
//                 }
//                 break;
//             }

//             default:
//                 break;
//         }
//     }

//     viewHandler() {
//         if (this.state.session == 'connect') {
//             return (
//                 <OTSession apiKey={this.apiKey} sessionId={this.sessionId} token={this.token}
//                     eventHandlers={this.sessionEventHandlers}
//                     signal={this.state.signal}
//                 >
//                     <View style={{
//                         flex: 1,
//                         backgroundColor: 'purple',
//                     }}>
//                         <OTSubscriber style={{ width: "100%", height: "100%", backgroundColor: 'purple' }} />
//                     </View>

//                     <MovableView
//                         style={{
//                             width: 120,
//                             height: 120,
//                             position: 'absolute',
//                             paddingRight: 350,
//                         }}>
//                         <View
//                             style={{
//                                 position: 'absolute',
//                                 backgroundColor: 'orange',
//                                 alignSelf: 'flex-end',
//                                 width: 150,
//                                 height: 200,
//                             }}>
//                             <OTPublisher properties={this.state} style={{ width: "100%", height: "100%", backgroundColor: 'black', }} />
//                         </View>
//                     </MovableView>

//                     <View
//                         style={{
//                             width: '100%',
//                             height: 80,
//                             flexDirection: 'row',
//                             justifyContent: 'center',
//                             backgroundColor: 'white',
//                             alignItems: 'center',
//                             alignContent: 'space-between',
//                             paddingBottom: 15
//                         }}>
//                         <TouchableOpacity
//                             style={{
//                                 flexDirection: 'row',
//                                 justifyContent: 'space-between',
//                                 margin: 20,
//                             }}
//                             onPress={() => this.actionHandler('toggleAudio')}>
//                             <Image
//                                 style={{ height: 40, width: 40 }}
//                                 source={this.state.publishAudio ? audioOn : audioOff}
//                             />
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={{
//                                 flexDirection: 'row',
//                                 justifyContent: 'space-between',
//                                 margin: 20,
//                             }}
//                             onPress={() => this.actionHandler('toggleVideo')}>
//                             <Image
//                                 style={{ height: 40, width: 40 }}
//                                 source={this.state.publishVideo ? videoOn : videoOff}
//                             />
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={{
//                                 flexDirection: 'row',
//                                 justifyContent: 'space-between',
//                                 margin: 20,
//                             }}
//                             onPress={() => this.actionHandler('toggleCamera')}>
//                             <Image style={{ height: 40, width: 40 }} source={switch_camera} />
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={{
//                                 flexDirection: 'row',
//                                 justifyContent: 'space-between',
//                                 margin: 20,
//                             }}
//                             onPress={() => this.actionHandler('diconnectSession')}>
//                             <Image style={{ height: 40, width: 40 }} source={end_call_image} />
//                         </TouchableOpacity>
//                     </View>
//                 </OTSession>
//             );
//         }
//         // else if (this.state.session == 'connect1') {
//         //     return (
//         //         <View style={styles.container}>
//         //             <RNCamera
//         //                 ref={ref => {
//         //                     this.camera = ref;
//         //                 }}
//         //                 style={styles.preview}
//         //                 type={RNCamera.Constants.Type.front}
//         //                 flashMode={RNCamera.Constants.FlashMode.on}

//         //             />
//         //             <View style={styles.capture}>
//         //                 <Text style={{ fontSize: 14 }}> SNAP </Text>
//         //             </View>


//         //             {/* <TouchableOpacity style={styles.capture}>
//         //                 <Text style={{ fontSize: 14, textAlign: 'center' }}> SNAP </Text>
//         //             </TouchableOpacity> */}
//         //             {/* <View style={{ position: "absolute", flexDirection: 'row', justifyContent: 'center' }}>
//         //                 <TouchableOpacity style={styles.capture}>
//         //                     <Text style={{ fontSize: 14 }}> SNAP </Text>
//         //                 </TouchableOpacity>
//         //             </View> */}
//         //         </View>
//         //     )
//         // }
//         else {
//             return null;
//         }

//     }
//     render() {
//         return (
//             <View style={{ flex: 1, flexDirection: 'row' }}>
//                 {this.viewHandler()}
//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'column',
//         backgroundColor: 'red',

//     },
//     preview: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//         backgroundColor: 'red',
//         //opacity: 0.4
//     },
//     capture: {
//         position: 'absolute',
//         left: 0,
//         right: 0,
//         bottom: 0,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'transparent',
//         borderRadius: 5,
//         padding: 15,
//         paddingHorizontal: 20,
//         margin: 20,
//     },
// });

// export default Home;