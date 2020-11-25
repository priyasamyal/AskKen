import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import {
  ImageBackground,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  Text,
  TextInput,
  Modal,
} from 'react-native';
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

import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-crop-picker';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';
import commonData from '../../common/data.js';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { alertWithTwoBtn } from '../../common/user';
var { width, height } = Dimensions.get('window');
var opacityValue = 0.4;
// create a component
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
const flash_off = require('../../assets/imgs/flash-off.png');
const flash_on = require('../../assets/imgs/flash-on.png');
const camera_flip = require('../../assets/imgs/camera-flip.png');
const camera_btn = require('../../assets/imgs/camera_btn.png');
const cross = require('../../assets/imgs/cross.png');
const selfie = require('../../assets/imgs/selfie.png');
class CameraScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flash: RNCamera.Constants.FlashMode.off,
      cameraToggle: this.props.is_profile != undefined ? RNCamera.Constants.Type.front: RNCamera.Constants.Type.back,
      text: props.text,
      disabled: false,
      canSkip: props.canSkip,
      header: props.header,
    };
  }

  componentWillUnmount() {
   // console.log("componentWillUnmount",this.props.type);
  }
  takePicture = async () => {
   // console.log('take');
    this.setState({ disabled: true });
    if (this.camera) {
      const options = { quality: 0.4, base64: true };
      const data = await this.camera.takePictureAsync(options);
      if(this.props.type!=undefined){
        this.props.getImageUri({
          uri: {
            path:data.uri,
            filename:Date.now()+'.jpg',
            mime:'image/jpeg',            
          }
        });
      }else{
              ImagePicker.openCropper({
                      cropperCancelText:'Retake',
                      path: data.uri,
                      includeBase64: this.props.type!=undefined?false:true,
                      cropperCircleOverlay: !this.state.canSkip ? false : true,
                      cropperToolbarTitle: 'Move and Scale',
                      avoidEmptySpaceAroundImage: true,
                    }).then(
                      image => {
                         // console.log(image);
                        this.setState({ disabled: false });
                      
                          this.props.getImageUri({
                            uri: 'data:image/jpeg;base64,' + image.data,
                            path: image.path,
                          });
                        
                      },
                      error => {
                        this.setState({ disabled: false });
                       // console.log(error, 'eroro');
                      },
                    );
      }
      
     
    }
  };

  cameraHandler = feature => {
    switch (feature) {
      case 'flash': {
        //.log('flash');
        if (this.state.flash == RNCamera.Constants.FlashMode.on) {
          this.setState({ flash: RNCamera.Constants.FlashMode.off });
        } else {
          this.setState({ flash: RNCamera.Constants.FlashMode.on });
        }
        break;
      }
      case 'camera': {
        if (this.state.cameraToggle == RNCamera.Constants.Type.back) {
          this.setState({ cameraToggle: RNCamera.Constants.Type.front });
        } else {
          this.setState({ cameraToggle: RNCamera.Constants.Type.back });
        }
        break;
      }
      case 'enableAcess': {
        alertWithTwoBtn(
          'Permission Required',
          commonData.ToastMessages.camera_deny_permission,
          'Not Now',
          'Open Settings',
        ).then(data => {
        //  console.log(data);
          if (data) {
            Linking.openSettings();
          } else {
          }
        });
        break;
      }
      case 'skip': {
        this.props.skip('skip');
        break;
      }
      case 'back': {
        this.props.backButton('back');
        break;
      }
    }
  };
  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return (

      <TouchableWithoutFeedback
        onPress={() => {
          this.backCount++
          if (this.backCount == 2) {
            clearTimeout(this.backTimer)
            this.cameraHandler('camera');
          } else {
            this.backTimer = setTimeout(() => {
              this.backCount = 0
            }, 3000)
          }
        }}   >
        <View style={styles.container}>
          <View
            style={[
              {
                position: 'absolute',
                top: "3%",
                flex: 1,
                zIndex: 1,
              },
              styles.header,
            ]}>
              <View style={{flexDirection:'row'}}>
              <Button
              style={{ paddingLeft: 20 }}
              transparent
              disabled={this.state.disabled}
              hitSlop={hitSlop}
              onPress={() => {
                this.cameraHandler('flash');
              }}>
              <Image
                style={[
                  { height: 25, width: 25, resizeMode: 'contain', },
                ]}
                source={
                  this.state.flash == RNCamera.Constants.FlashMode.on
                    ? flash_on
                    : flash_off
                }
              />
            </Button>
            <Button
              style={{ paddingLeft: 20 }}
              transparent
              disabled={this.state.disabled}
              hitSlop={hitSlop}
              onPress={() => {
                this.cameraHandler('camera');
              }}>
              <Image
                style={[
                  { height: 25, width: 25, resizeMode: 'contain', },
                ]}
                source={selfie}
              />
            </Button>
              </View>
           
            {this.state.header && (
              <Button
                transparent
                disabled={this.state.disabled}
                hitSlop={hitSlop}
                onPress={() => { }}>
                <Text
                  style={{
                    paddingRight: 90,
                    color: colors.LIGHT_COLOR,
                    fontFamily: 'PTSans-Bold',
                    paddingTop: 5,
                    fontSize: 20,
                  }}>
                  Upload Profile Picture
              </Text>
              </Button>
            )}

            <Button
              style={{ paddingRight: 30 }}
              transparent
              disabled={this.state.disabled}
              hitSlop={hitSlop}
              onPress={() => {
                this.cameraHandler('skip');
              }}>
              <Image
                style={[
                  { height: 30, width: 30, resizeMode: 'contain', },
                ]}
                source={cross}
              />
            </Button>

          </View>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            captureAudio={false}
            style={styles.preview}
            type={this.state.cameraToggle}
            flashMode={this.state.flash}
            ratio="4:3"
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            onGoogleVisionBarcodesDetected={({ barcodes }) => {
              console.log(barcodes);
            }}>
            {({ camera, status }) => {
              console.log(status, 'camera status...');
              if (status !== 'READY') {
                return (
                  <View style={styles.outer_container}>
                    <View style={styles.top_container}>
                      <Text style={styles.upload_text}>{this.state.text}</Text>
                      <Button
                        hitSlop={hitSlop}
                        style={styles.enable_btn}
                        onPress={() => {
                          this.cameraHandler('enableAcess');
                        }}>
                        <Text style={styles.enable_btn_txt}>Enable Access</Text>
                      </Button>
                    </View>
                  </View>
                );
              }
            }}
          </RNCamera>

          <View style={styles.bottom_container}>
            <Text style={{ color: colors.LIGHT_COLOR, justifyContent: 'center', textAlign: 'center', fontFamily: 'PTSans-Regular', fontSize: 18 }}>Tap to take a photo</Text>
            <LinearGradient
              colors={['transparent', '#000']}
              style={styles.linearGradient}>
              <View style={[styles.camera_control, { justifyContent: 'center', alignItems: 'center' }]}>
                <TouchableOpacity
                  style={[styles.camera_touch]}
                  disabled={this.state.disabled}
                  onPress={() => {
                    this.takePicture();
                  }}>
                  <Image
                    style={[
                      styles.camera_butn,
                      { opacity: this.state.disabled ? 0.4 : 1 },
                    ]}
                    source={camera_btn}
                  />
                </TouchableOpacity>
              </View>

              <View style={[styles.camera_control, { marginBottom: 25 }]}>
                <TouchableOpacity
                  hitSlop={hitSlop}
                  style={styles.upload_touch}
                >
                </TouchableOpacity>
                <TouchableOpacity hitSlop={hitSlop} style={styles.photo_touch}>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

        </View>
      </TouchableWithoutFeedback>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    //zIndex: 2

  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },

  skip_text: {
    color: colors.LIGHT_COLOR,
    fontFamily: 'PTSans-Bold',
    fontSize: 18,
    paddingTop: 5,
    paddingRight: 20,
    letterSpacing: 0.8,
  },

  header: {
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width,
    marginTop: 0
  },
  pageTitle: {
    fontFamily: 'PTSans-Bold',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 10,
  },
  outer_container: {
    flex: 1,
    bottom: '45%',
  },
  top_container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  upload_text: {
    fontFamily: 'PTSans-Bold',
    fontSize: 23,
    color: colors.LIGHT_COLOR,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: 0.8,
  },

  enable_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: colors.LIGHT_COLOR,
    borderRadius: 25,
    paddingTop: 10,
    paddingBottom: 10,
  },
  enable_btn_txt: {
    fontFamily: 'PTSans-Regular',
    fontSize: 18,
    letterSpacing: 0.7,
    paddingRight: 30,
    paddingLeft: 30,
  },
  linearGradient: {
    flex: 1,
    paddingTop: 40,
  },
  bottom_container: {
    position: 'absolute',
    bottom: 0,
    flex: 1,
    justifyContent: 'flex-end',
  },
  camera_control: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  flash_touch: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: width / 3,
  },
  flip_touch: {
    alignItems: 'flex-start',
    width: width / 3,
    justifyContent: 'center',
    paddingTop: 20,
  },
  camera_touch: {
    // alignItems: 'center',
    //justifyContent: 'center',
  },
  upload_touch: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: width / 2,
    paddingRight: 30,
  },
  photo_touch: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: width / 2,
    paddingLeft: 30,
  },
  segment_text: {
    color: colors.LIGHT_COLOR,
    fontFamily: 'PTSans-Bold',
    fontSize: 17,
    paddingBottom: 10,
    letterSpacing: 0.8,
  },
  flash_icon: {
    width: 30,
    height: 25,
    resizeMode: 'contain',
    //marginLeft: 19,
    //  left: 0,
    //  backgroundColor: 'red'
  },
  flip_icon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  camera_butn: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  iconStyle: {
    color: colors.GRAY_BACK,
    fontSize: 35,
  },
});

//make this component available to the app
export default CameraScreen;
