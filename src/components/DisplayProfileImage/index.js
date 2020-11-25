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
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
import {
  postApiRequestWithHeaders,
  setItem,
  getItem,
  showToast,
  errorHandler,
} from '../../common/user';
import commonData from '../../common/data.js';
var { width, height } = Dimensions.get('window');
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { connect } from "react-redux";
import { setUserData, setAllTickets } from "../../actions";
import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'
import CameraScreen from '../../components/camera';
import Load from 'react-native-loading-gif';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
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
class DisplayProfileImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      showModal: 'display',
      uri: "",
      btnText: props.btnText,
      image_selected: false,
      showCamera: false,
      profile_image:''
    };

    
  }

  componentDidMount() {
    this.getUserDetails();
    console.log(commonData.profile_picture_url + this.props.user.profile_image,"lookoko");
  }
  /**
	 * Fetch user details from local storage
	 */
	getUserDetails = () => {
		var param = {}
		postApiRequestWithHeaders(commonData.api_endpoint.user_details, param, this.props.user.access_token).then(
			data => {
        this.setState({
          profile_image:data.user.profile_image
        })
				// data.loggedInStatus = true;
				// if (data.user.user_type != "owner") {         
				// 	this.setState({
				// 		all_job: data.all_tickets
				// 	})
				// 	let user_data = this.props.user;
				// 	user_data.earning_count = data.user.earning_count;
				// 	this.props.setUserData(user_data);
				// 	this.props.setAllTickets(data.all_tickets);
					
				// } else {
				// 	this.props.setCurrentTicket(data.user.current_ticket);
				// 		this.setState({
				// 		current_ticket: data.user.current_ticket,
				// 		push_enable:data.user.push_enable,
				// 		 })
				// }
			 
				// this.props.setUserData(data.user)
			},
			error => {
				errorHandler(error, this.props);
			},
		);
	};
  
  navigator = navigateTo => {
    switch (navigateTo) {
      case 'next': {
       if (!this.state.image_selected) {
        this.showActionSheet()
      } else {
        this.props.clickHandler('editProfileImageApiCall', this.state.uri);
      }
       
        break;
      }
      case 'edit': {
        this.props.clickHandler('editProfileImage');
        break;
      }
      case 'last': {
        break;
      }
      case 'back': {
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
  showActionSheet = () => {
    this.actionSheet.show()
  }
  getActionSheetRef = ref => (this.actionSheet = ref)
  render() {
    return (
      <Container>
         <Load ref="Load" Image={0}></Load>
        <View style={styles.container}>
          
        <View style={{ flex: 1, alignItems: 'center', marginTop:"30%" }}>
          
        {!this.state.image_selected && (
            <Image
              style={styles.image}
              source={{
                uri: commonData.profile_picture_url + this.state.profile_image
              }}
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
                </View>
              )}  
            {/* <Button
                    transparent
                    style={styles.edit_container}
                    onPress={() => this.showActionSheet()}>
                    <Text style={styles.edit_text}>Edit</Text>
                  </Button> */}
                  {/* <Text style={styles.heading}>
                {' '}
                Edit a pic
                </Text>   */}
          </View> 
          <View style={[styles.continueBtnContainer, {}]}>
              <Button style={styles.continueBtn} onPress={() => this.navigator('next')}>
                <Text style={styles.continueBtnTxt}>{this.state.image_selected ? "Save Changes" : "Edit Photo"}</Text>
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
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.input_border,
   // paddingTop: 35,
},
header: {
    margin: 5,
    marginBottom: 0
},
pageTitle: {
    fontFamily: 'PTSans-Bold',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 10
},
heading: {
    fontFamily: 'AvenirLT-Black',
    fontWeight: 'bold',
    fontSize: 23,
    paddingTop: 0,
    textAlign: 'center',
},
headingText: {
    margin: 40,
    marginTop: 15,
    marginBottom: 0,
    fontFamily: 'AvenirLTStd-Medium',
    fontSize: 17,
    textAlign: 'center',
    color: colors.grey_heading,
    // letterSpacing: 0.7
},
btncontainer: {
    width: width,
    paddingRight: 40,
    paddingLeft: 40,
    marginBottom: 30,
},
btn_inner: {
    backgroundColor: colors.THEME_YELLOW,
    height: 55,
},
btn_txt: {
    color: colors.LIGHT_COLOR,
    fontFamily: 'PTSans-Regular',
    fontSize: 20,
    fontWeight: 'bold',
},
black_text: {
    color: colors.GREY_TEXT,
    paddingLeft: 10,
},
image: {

    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 200 / 2,
    backgroundColor:colors.grey_bg
},
edit_container: {
    justifyContent: 'center'
    // paddingTop: 30,
},
edit_text: {
    textAlign: 'center',
    fontSize: 18,
    textDecorationLine: 'underline',
    color: colors.PLACEHOLDER_TEXT,
    fontFamily: 'AvenirLTStd-Medium',
},
continueBtnContainer: {
    width: width - 60,
    marginBottom: 35,
},
mainContainer: {
    flex: 1,

},
continueBtn: {
    backgroundColor: colors.BLACK_TEXT,
    justifyContent: 'center',
    height: 55,
    borderRadius: 15
},
continueBtnTxt: {
    color: colors.LIGHT_COLOR,
    fontFamily: 'Avenir-Heavy',
    fontSize: 18,
}
});


function mapStateToProps(state) {
  console.log(state, "state in Home")
  return {
    user: state.user.userData,
    signUp_data: state.user,
    all_tickets: state.all_tickets
  }
}
export default connect(mapStateToProps, { setUserData,setAllTickets })(DisplayProfileImage);

