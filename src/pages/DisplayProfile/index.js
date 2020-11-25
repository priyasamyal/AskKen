//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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
// create a component
import { AppEventsLogger } from "react-native-fbsdk";
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
import commonData from '../../common/data.js';
var { width, height } = Dimensions.get('window');
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RegisterSuccess from '../../components/RegisterSuccess';
import LastStep from '../../components/LastStep';
import { postApiRequest, setItem } from '../../common/user';
import { StackActions, NavigationActions } from 'react-navigation';

import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { RNCamera } from 'react-native-camera';
//import Load from 'react-native-loading-gif';
import Load from 'react-native-loading-gif';
import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'
import { connect } from "react-redux";
import analytics from '@react-native-firebase/analytics';

import crashlytics from '@react-native-firebase/crashlytics';
import CameraScreen from '../../components/camera';
import HeaderComponent from "@custom_components/HeaderComponent";
import { setAccountInfo, setUserData, setAllTickets } from "../../actions";
const defaultt = require('../../assets/imgs/default.png');
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = [
  {
    component: <Text style={{ color: colors.BLACK_TEXT, fontSize: 18, fontFamily: 'Avenir-Heavy', padding: 10 }}>Cancel</Text>,
    height: 50,
  },
  {
    component: <Text style={{ color: colors.BLACK_TEXT, fontSize: 16, fontFamily: 'AvenirLTStd-Medium', padding: 10, paddingTop: 18 }}>Take a photo</Text>,
    height: 50,
  },
  {
    component: <Text style={{ color: colors.BLACK_TEXT, fontSize: 16, fontFamily: 'AvenirLTStd-Medium', justifyContent: 'center', paddingBottom: 10, paddingTop: 3 }}>Choose from library</Text>,
    height: 60,
  },
]

class DisplayProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // loader: false,
      showModal: 'display',
      selected: 1,
      image_selected: false,
      uri: '',
      showCamera: false
    };
  }

  signupApiCall = () => {
    console.log('signup api call ');
    this.refs.Load.OpenLoad();
    const param = {
      phone_number: this.props.user.phone_number,
      country_code: this.props.user.phone_code,
      name: this.props.user.name,
      password: this.props.user.password,
      profile_image: this.state.uri,
      user_type: this.props.user.user_type,
      device_token: this.props.user.device_token,
      categories: this.props.user.categories,
      uuid: this.props.user.uuid,
      email: this.props.user.email,
      time_zone: commonData.time_zone,
      voip_token: this.props.user.voip_token
    };
    //console.log(param, 'param');
    //console.log(JSON.stringify(param));
    postApiRequest(commonData.api_endpoint.signup, param).then(
      data => {
        AppEventsLogger.logEvent("fb_mobile_tutorial_completion", { fb_success: 1 });
        if(this.props.user.name == undefined || this.props.user.name == ''){
          crashlytics().log('ExpertRegister');
        }else{
          crashlytics().log('ExpertRegister'+param.phone_number.split(" ").join(""));
        }
        console.log(data, 'data from signup page');
        data.loggedInStatus = true;
        this.props.setUserData(data);
        if (data.user_type != "owner") {
          this.props.setAllTickets(data.all_tickets);
          setItem('ad_index', "0").then(
            res => {  
                if (res) {
                    
                }
            },
            err => {
                console.log(err, "set err")
            },
          );
          setItem('is_first_time', "false").then(
            res => { 
              console.log("details sett....")
                if (res) {
                    
                }
            },
            err => {
                console.log(err, "set err")
            },
          )
        }
        setTimeout(() => {
          this.refs.Load.CloseLoad();
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "Notification" })],
          });
          this.props.navigation.dispatch(resetAction);
        }, 2000);
       
      },
      error => {
        this.refs.Load.CloseLoad();
        console.log(error, 'error');
      },
    );
  };
  navigator = navigateTo => {
    console.log("kjhkhkhkh")
    switch (navigateTo) {
      case 'next': {
        if (!this.state.image_selected) {
          this.showActionSheet()
        } else {
          this.signupApiCall();
        }
        break;
      }
      case 'final': {
        this.setState({ showModal: 'lastStep' });
        break;
      }
      case 'last': {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'ExpertIntro' })],
        });
        this.props.navigation.dispatch(resetAction);
      }
      case 'back': {
        this.props.navigation.goBack();
        break;
      }
      case 'skip': {
        this.setState({
          showCamera: false
        })
        break;
      }
    }
  };

  showActionSheet = () => {
    this.actionSheet.show()
  }

  getActionSheetRef = ref => (this.actionSheet = ref)

  handlePress = index => {
    console.log(index, "index")
    this.setState({ selected: index });
    if (index == 2) {
      setTimeout(() => {
        this.chooseAction("gallery")
      }, 500);
    } else if (index == 1) {
      this.setState({ showCamera: true });
    }
  }
  chooseAction = action => {
    switch (action) {
      case 'gallery': {
        console.log('clik gallery');
        check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
          console.log(result, 'result');
          switch (result) {
            case RESULTS.DENIED:
              console.log('deny case call');
              request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
                console.log(result, 'resul1111t');
                ImagePicker.openPicker({
                  cropperCancelText:'Retake',
                  mediaType: 'photo',
                  cropping: true,
                  cropperChooseText: 'Next',
                  compressImageQuality: 0.8,
                  cropperToolbarTitle: 'Crop',
                  cropperCircleOverlay: true,
                  includeBase64: true,
                  cropperToolbarTitle: 'Move and Scale',
                  avoidEmptySpaceAroundImage: true,
                }).then(
                  image => {
                    this.setState({ image_selected: true, uri: 'data:image/jpeg;base64,' + image.data });
                  },
                  error => {
                    opacityValue = 0.4;
                    this.setState({ disabled: false });
                    console.log(error, 'eroro');
                  },
                );
              });

              break;
            case RESULTS.GRANTED:
              ImagePicker.openPicker({
                cropperCancelText:'Retake',
                mediaType: 'photo',
                cropping: true,
                cropperChooseText: 'Next',
                compressImageQuality: 0.8,
                cropperToolbarTitle: 'Crop',
                cropperCircleOverlay: true,
                includeBase64: true,
                cropperToolbarTitle: 'Move and Scale',
                avoidEmptySpaceAroundImage: true,
              }).then(
                image => {
                  this.setState({ image_selected: true, uri: 'data:image/jpeg;base64,' + image.data });
                },
                error => {
                  opacityValue = 0.4;
                  this.setState({ disabled: false });
                  console.log(error, 'eroro');
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
                console.log(data);
                if (data) {
                  Linking.openSettings();
                }
              });
            //     break;
          }
        });

        break;
      }

      default:
        break;
    }
  };
  setImages = (data) => {
    console.log(data, "set Images...");
    this.setState({ showCamera: false, image_selected: true, uri: data.uri });
  }
  render() {
    // console.log(flash_off, 'flashhhhh off');
    if (this.state.showModal == 'display') {
      return (
        <Container>
          <Load ref="Load"></Load>

          <HeaderComponent clickHandler={() => this.navigator('back')} />
          <View style={styles.container}>
            <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
              {!this.state.image_selected && (
                <Image
                  style={styles.image}
                  source={
                    defaultt
                  }
                />
              )}
              {this.state.image_selected && (
                <View>
                  <Image
                    style={styles.image}
                    source={{
                      uri: this.state.uri,
                    }}
                  />
                  <Button
                    transparent
                    style={styles.edit_container}
                    onPress={() => this.showActionSheet()}>
                    <Text style={styles.edit_text}>Edit</Text>
                  </Button>
                </View>

              )}

              <Text style={styles.heading}>
                {' '}
                Upload a pic
                </Text>
              <Text style={styles.headingText}>
                {' '}
                Ask Ken is about building real{'\n'}connections between real people.{'\n'}Please add a friendly looking{'\n'}picture of yourself.
              </Text>
            </View>
            <View style={[styles.continueBtnContainer, {}]}>
              <Button style={styles.continueBtn} onPress={() => this.navigator('next')}>
                <Text style={styles.continueBtnTxt}>{this.state.image_selected ? "Finish" : "Add a Photo"}</Text>
              </Button>
            </View>
            <ActionSheet
              ref={this.getActionSheetRef}

              options={options}
              cancelButtonIndex={CANCEL_INDEX}
              destructiveButtonIndex={DESTRUCTIVE_INDEX}
              onPress={this.handlePress}
            />
            <Modal hasBackdrop={true} backdropColor={"black"} backdropOpacity={1} transparent={false} presentationStyle="pageSheet" isVisible={this.state.showCamera} hideModalContentWhileAnimating={true}
              onModalHide={() => { console.log("dismisssss") }}
              onSwipeComplete={() => {
                console.log("swipe down....")
                this.setState({ showCamera: !this.state.showCamera })
              }}
              swipeDirection="down"
            >
              <CameraScreen
                is_profile={true}
                text={'Upload a \n profile picture'}
                canSkip={true}
                getImageUri={this.setImages}
                skip={this.navigator}
                backButton={this.navigator}></CameraScreen>
            </Modal>
          </View>

        </Container>
      );
    } else if (this.state.showModal == 'sucess') {
      return <RegisterSuccess onDone={this.navigator}></RegisterSuccess>;
    } else {
      return <LastStep onDone={this.navigator}></LastStep>;
    }
  }
}


function mapStateToProps(state) {
  console.log(state, "state")
  return {
    user: state.user
  }
}
export default connect(mapStateToProps, { setUserData, setAllTickets })(DisplayProfile);