
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView, Linking
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
import { AppEventsLogger } from "react-native-fbsdk";
// create a component
import { colors } from '../../common/index';
import crashlytics from '@react-native-firebase/crashlytics';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import styles from './styles';
import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'
import commonData from '../../common/data.js';
import Modal from 'react-native-modal';
import SideMenu from '../../components/SideMenu';
import { SwipeableModal } from 'react-native-swipeable-modal';
import {
  postApiRequestWithHeaders,
  openUrl,
  clearLocalStorage,
  showToast,
  errorHandler,
  postApiRequestWithHeadersServerEoor
} from '../../common/user';
import { RNS3 } from 'react-native-aws3';
import { connect } from "react-redux";
import Load from 'react-native-loading-gif';
import { setTicketPhoto, setUserData } from "../../actions";
import ImagePicker from 'react-native-image-crop-picker';
import CommonToast from "@custom_components/CommonToast";
import { StackActions, NavigationActions } from 'react-navigation';
import CameraScreen from '../../components/camera';
import VideoScreen from '../../components/Video';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import Video from 'react-native-video';
import analytics from '@react-native-firebase/analytics';
const header_logo = require('../../assets/imgs/header_logo.jpg');
const side_menu_black = require('../../assets/imgs/side_menu_black.png');
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
const video_options = [
  {
    component: <Text style={{ color: colors.BLACK_TEXT, fontSize: 18, fontFamily: 'Avenir-Heavy', padding: 10 }}>Cancel</Text>,
    height: 50,
  },
  {
    component: <Text style={{ color: colors.BLACK_TEXT, fontSize: 16, fontFamily: 'AvenirLTStd-Medium', padding: 10, paddingTop: 10, paddingBottom: 10, }}>Record a Video</Text>,
    height: 60,
  },
]

class TicketMediaType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      count: 140,
      uri: '',
      type: '',
      showCamera: false,
      showVideo: false,
      image_selected: false,
      showCustomToast: false,
      message: "",
      type: "",
      toggle_menu: false
    };

  }
  getActionSheetRef = ref => (this.actionSheet = ref);
  getVideoActionSheetRef = ref => (this.video_actionSheet = ref);
  showVideoActionSheet = () => {
    this.video_actionSheet.show()
  }
  showActionSheet = () => {
    this.actionSheet.show()
  }
  handleImagePress = index => {
    if (index == 2) {
      setTimeout(() => {
        this.chooseAction("gallery")
      }, 500);
    }
    else if (index == 1) {
      this.setState({ showCamera: true });
    }
  }
  setImages = (data) => {
    console.log(data, "set Images...");
    this.setState({ type: 'photo', showCamera: false, image_selected: true, uri: data.uri.path });
    this.props.setTicketPhoto({
      type: 'photo',
      uri: data.uri.path
    })

    this.props.navigation.navigate('Preview')

  }

  /**Create Ticket API */
  createTicket = (param) => {
    console.log("create para", this.props.ticket_data, param);
    var param = {
      categories: this.props.ticket_data.categories,
      description: this.props.ticket_data.description,
      //fees: "1",
      fees: "45",
      type: this.props.ticket_data.type,
      ticket_file: this.props.ticket_data.uri,
      card_id: this.props.user.cards[0].card_id,
      time_zone: commonData.time_zone
    }
    console.log(param, "parammmm123..........");

    postApiRequestWithHeadersServerEoor(commonData.api_endpoint.post_ticket, param, this.props.user.access_token).then(
      data => {

        AppEventsLogger.logEvent("Ticket Created", { type: 'owner' });
        if (this.props.user.phone_number == undefined || this.props.user.phone_number == '') {
          crashlytics().log("TicketCreated");
        } else {
          crashlytics().log("TicketCreated " + this.props.user.phone_number.split(" ").join(""));
        }
        console.log(data, "post ticket.....");
        var user_data = this.props.user;
        user_data.cards = data.card;
        user_data.current_ticket = data.current_ticket;
        this.props.setUserData(user_data);
        this.refs.Load.CloseLoad();
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: "HomePage" })],
        });
        this.props.navigation.dispatch(resetAction);
      },
      error => {
        console.log('error....', error);
        this.refs.Load.CloseLoad();
        errorHandler(error, this.props);
      },
    );
  }

  uploadVideo = () => {
    this.refs.Load.OpenLoad();
    console.log("Upload video......");
    var file_name = Date.now() + this.props.user.user_id + '.mov'
    console.log("Upload video......", file_name);
    // this.props.setTicketPhoto({
    //   type: 'video',
    //   uri: file_name
    // })
    const file = {
      uri: this.state.uri,
      name: file_name,
      type: "video/mov"
    }
    const options = {
      keyPrefix: "uploads/",
      bucket: "askkenvideos",
      region: "us-east-2",
      accessKey: "AKIAX4SCEJIN7DVDY4AD",
      secretKey: "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",
      successActionStatus: 201
    }
    RNS3.put(file, options).then(response => {
      console.log(response, "S3 respo...")
      if (response.status !== 201) {
        throw new Error("Failed to upload image to S3");
        this.refs.Load.CloseLoad();
      } else {
        this.props.setTicketPhoto({
          type: 'video',
          uri: response.body.postResponse.location
        })
        this.props.user.cards.length == 0 ?
          this.props.navigation.navigate('OwnerPayment', {
            view: "intro",
            is_exist: false,
            action: 'post_ticket'
          }) : this.createTicket()
      }
      console.log(response.body);
    });
  }


  uploadPhoto = () => {
    var file_name = Date.now() + this.props.user.user_id + '.jpeg'
    this.props.setTicketPhoto({
      type: 'photo',
      uri: file_name
    })
    console.log("upload phot..", this.state);
    const file = {
      uri: this.state.uri,
      name: file_name,
      type: "image/jpeg"
    }
    const options = {
      keyPrefix: "uploads/",
      bucket: "askkenvideos",
      region: "us-east-2",
      accessKey: "AKIAX4SCEJIN7DVDY4AD",
      secretKey: "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",
      successActionStatus: 201
    }
    console.log(file, options);
    RNS3.put(file, options).then(response => {
      console.log(response, "S3 respo...")
      if (response.status !== 201) {
        throw new Error("Failed to upload image to S3");
      } else {
        this.props.setTicketPhoto({
          type: 'photo',
          uri: response.body.postResponse.location
        })
        this.createTicket();
      }
      console.log(response.body);
    });
  }

  setVideo = (data) => {
    console.log(data, "set Images...");
    this.setState({ image_selected: true, uri: data.uri, type: 'video' });
    setTimeout(() => {
      this.setState({ showVideo: false, });
    }, 500);
  }

  chooseAction = action => {
    console.log(this.props.user.cards, "this.props.user.cards")
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
                  cropperCancelText: 'Retake',
                  mediaType: 'photo',
                  cropping: true,
                  cropperChooseText: 'Next',
                  compressImageQuality: 0.8,
                  cropperToolbarTitle: 'Crop',
                  cropperCircleOverlay: false,
                  includeBase64: true,
                  cropperToolbarTitle: 'Move and Scale',
                  avoidEmptySpaceAroundImage: true,
                }).then(
                  image => {
                    console.log(image.path, "response....", image);
                    console.log("file://" + image.path, "response....");
                    this.props.setTicketPhoto({
                      type: 'photo',
                      uri: "file://" + image.path
                    })
                    this.setState({ type: 'photo', image_selected: true, uri: "file://" + image.path });
                    this.props.navigation.navigate('Preview')
                    // this.props.user.cards.length == 0 ?
                    //   this.props.navigation.navigate('OwnerPayment', {
                    //     view: "intro",
                    //     is_exist: false,
                    //     action: 'post_ticket'
                    //   }) : this.uploadPhoto();
                    // if (this.props.user.cards.length != 0) {
                    //   this.refs.Load.OpenLoad();
                    // }
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
                cropperCancelText: 'Retake',
                mediaType: 'photo',
                cropping: true,
                cropperChooseText: 'Next',
                compressImageQuality: 0.8,
                cropperToolbarTitle: 'Crop',
                cropperCircleOverlay: false,
                //includeBase64: true,
                cropperToolbarTitle: 'Move and Scale',
                avoidEmptySpaceAroundImage: true,
              }).then(
                image => {
                  console.log(image.path, "response....", image);
                  console.log("file://" + image.path, "response....");
                  this.props.setTicketPhoto({
                    type: 'photo',
                    uri: "file://" + image.path
                  })
                  this.setState({ type: 'photo', image_selected: true, uri: "file://" + image.path });
                  // this.props.setTicketPhoto({
                  //   type: 'photo',
                  //   uri: 'data:image/jpeg;base64,' + image.data
                  // })
                  // this.setState({ type:'photo',image_selected: true, uri: 'data:image/jpeg;base64,' + image.data });
                  this.props.navigation.navigate('Preview')

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
  chooseVideoAction = action => {
    console.log("hooose video")
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
                  title: 'Video Picker',
                  mediaType: 'video',
                  storageOptions: {
                    skipBackup: true,
                    path: 'images'
                  }
                  // cropping: true,
                  // cropperChooseText: 'Next',
                  // compressImageQuality: 0.8,
                  // cropperToolbarTitle: 'Crop',
                  // cropperCircleOverlay: false,
                  // includeBase64: true,
                  // cropperToolbarTitle: 'Move and Scale',
                  // avoidEmptySpaceAroundImage: true,
                }).then(
                  image => {
                    console.log("video selects", image)
                    this.setVideo({ uri: image.path });
                    // this.props.setTicketPhoto({
                    //   type: 'image',
                    //   uri: 'data:image/jpeg;base64,' + image.data
                    // })
                    // this.setState({ image_selected: true, uri: 'data:image/jpeg;base64,' + image.data });
                    // this.props.user.cards.length == 0 ?
                    //   this.props.navigation.navigate('OwnerPayment', {
                    //     view: "intro",
                    //     is_exist: false,
                    //     action: 'post_ticket'
                    //   }) : this.props.navigation.goBack()
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
                title: 'Video Picker',
                mediaType: 'video',
                storageOptions: {
                  skipBackup: true,
                  path: 'images'
                }
              }).then(
                image => {
                  console.log("video selects", image);
                  this.setVideo({ uri: image.path });
                  // this.props.setTicketPhoto({
                  //   type: 'image',
                  //   uri: 'data:image/jpeg;base64,' + image.data
                  // })
                  // this.setState({ image_selected: true, uri: 'data:image/jpeg;base64,' + image.data });
                  // this.props.user.cards.length == 0 ?
                  //   this.props.navigation.navigate('OwnerPayment', {
                  //     view: "intro",
                  //     is_exist: false,
                  //     action: 'post_ticket'
                  //   }) : this.props.navigation.goBack()
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
  handleVideoPress = index => {
    console.log(index, "index")
    // this.setState({ selected: index });
    if (index == 2) {
      setTimeout(() => {
        this.chooseVideoAction("gallery")
      }, 500);
    }
    else if (index == 1) {
      this.setState({ showVideo: true });
    }
  }
  navigator = (data) => {
    switch (data) {
      case "back":
        this.props.navigation.goBack();
        break;
      case "video":
        this.showVideoActionSheet();
        break;
      case "image":
        this.showActionSheet();
        break;
      case "next":
        this.props.user.cards.length == 0 ?
          this.props.navigation.navigate('OwnerPayment', {
            view: "intro",
            is_exist: false,
            action: 'post_ticket'
          }) : this.props.navigation.goBack();
        break;
      case 'skip': {
        this.setState({
          showCamera: false,
          showVideo: false
        })
        break;
      }
      case 'side_menu': {
        this.setState({ toggle_menu: true });
        break;
      }
      default:
        break;
    }
  }

  callbackFunction = page => {
    console.log("kkk")
    this.setState({ toggle_menu: !this.state.toggle_menu });
    switch (page) {
      case 'close': {
        this.setState({ toggle_menu: !this.state.toggle_menu });
        break;
      }
      case 'help': {
        //  console.log('help');
        this.props.navigation.navigate('CommonPage', {
          page: 'help',
          headerText: 'Help!',
        });
        break;
      }
      case 'callHistory': {
        // console.log('callHistory');
        this.props.navigation.navigate('CommonPage', {
          page: 'callHistory',
          headerText: 'Call History',
        });

        break;
      }
      case 'account': {
        this.props.navigation.navigate('EnterName', { type: 'edit' });
        break;
      }
      case 'updateProfile': {
        //  console.log('updateProfile');
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

      case 'editCategory': {
        this.props.navigation.navigate('EditCategory');

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
        //  console.log('updatePassword');
        this.props.navigation.navigate('CommonPage', {
          page: 'updatePassword',
          headerText: 'Update Password',
        });

        break;
      }
      case 'updatePhoneNumber': {
        //  console.log('updatePhoneNumber');
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
        //  console.log('pushToggle');
        this.setState({ toggle_menu: !this.state.toggle_menu });
        break;
      }
      case 'video': {
        // console.log('video');
        openUrl('https://www.askkenapp.com/askken_video.mp4');

        break;
      }
      case 'logout': {
        const param = {
          user_id: this.props.user.user_id,
        };
        postApiRequestWithHeaders(commonData.api_endpoint.log_out, param, this.props.user.access_token).then(
          data => {
            this.refs.Load.CloseLoad();
            this.logOutFunc();
          },
          error => {
            this.logOutFunc();
            // errorHandler(error, this.props);
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
          //   console.log(data);
          if (data) {
            this.deleteApiCall();
          }
        });
        break;
      }
      case 'report': {
        console.log("rporp")
        var url = 'mailto:help@askkenapp.com?subject=Report a problem&body=&cc=';
        Linking.openURL(url);
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
  onLoad = (data) => {
    console.log(data, "onLoad");
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
      var file_name = Date.now() + this.props.user.user_id + '.mov'
      console.log("Upload video......", file_name);
      this.props.setTicketPhoto({
        type: 'video',
        uri: this.state.uri
      })

      this.props.navigation.navigate('Preview')
      // //this.uploadVideo();
      // this.props.user.cards.length == 0 ?
      //   this.props.navigation.navigate('OwnerPayment', {
      //     view: "intro",
      //     is_exist: false,
      //     action: 'post_ticket'
      //   }) : this.uploadVideo();
    }
  };
  render() {
    return (
      <Container>
        <Load ref="Load"></Load>
        <Header transparent style={styles.header}>
          <Left style={{ flex: 1 }}>
            <Button
              transparent
              hitSlop={hitSlop}
              onPress={() => this.navigator('back')}>
              <Icon style={[styles.black_text]} name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Image
              style={[
                {
                  marginLeft: 0,
                  height: 30,
                  width: 30,
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

        <View style={styles.mainContainer}>
          <KeyboardAvoidingView
            style={styles.mainContent}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 77 : 50}>
            <View style={styles.mainContent}>
              <Text style={styles.heading}>
                {' '}
                Now show us your{'\n'}problem with a picture{'\n'}or up to 15 seconds of{'\n'}video.
              </Text>
              {this.state.uri != '' && this.state.type == "video" && (
                <Video source={{ uri: this.state.uri }}
                  onLoad={this.onLoad}
                  paused={true} />
              )}
            </View>

            <View style={styles.continueBtnContainer}>

              <Button
                onPress={() => {
                  this.navigator("image")
                }}
                style={[styles.continueBtn, { backgroundColor: colors.LIGHT_COLOR, borderWidth: 1, borderColor: colors.btn_border }]} >
                <Text style={[styles.continueBtnTxt, { color: colors.BLACK_TEXT }]}>Take a Picture</Text>
              </Button>
            </View>
            <View style={styles.continueBtnContainer}>
              <Button style={styles.continueBtn}
                onPress={() => {
                  this.setState({ showVideo: true });
                }}>

                <Text style={styles.continueBtnTxt}>Record a Video</Text>
              </Button>
            </View>
          </KeyboardAvoidingView>
          <Modal isVisible={this.state.toggle_menu}
            hideModalContentWhileAnimating={true}
            onSwipeComplete={() => this.setState({ toggle_menu: !this.state.toggle_menu })}
            swipeDirection="down">
            <SideMenu
              parentCallback={this.callbackFunction}
            ></SideMenu>
          </Modal>

          <Modal hasBackdrop={true} backdropColor={"black"} backdropOpacity={1} transparent={true} presentationStyle="pageSheet" isVisible={this.state.showCamera} hideModalContentWhileAnimating={true}>
            <CameraScreen
              text={'Upload your \n problem with picture'}
              type={"ticket"}
              canSkip={false}
              getImageUri={this.setImages}
              skip={this.navigator}
              backButton={this.navigator}></CameraScreen>
          </Modal>
          <Modal hasBackdrop={true} backdropColor={"black"} backdropOpacity={1} transparent={true} presentationStyle="pageSheet" isVisible={this.state.showVideo} hideModalContentWhileAnimating={true}>
            <VideoScreen
              from={'ticket'}
              text={'Upload your \n problem with picture'}
              canSkip={false}
              getImageUri={this.setVideo}
              skip={this.navigator}
              backButton={this.navigator}></VideoScreen>
          </Modal>
        </View>
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
      </Container>
    );

  }
}

function mapStateToProps(state) {
  return {
    user: state.user.userData,
    ticket_data: state.post_ticket
  }
}
export default connect(mapStateToProps, { setTicketPhoto, setUserData })(TicketMediaType);




/*

*/