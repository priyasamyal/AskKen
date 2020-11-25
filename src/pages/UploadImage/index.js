import React, { Component } from 'react';
import { RNCamera } from 'react-native-camera';
import commonData from '../../common/data.js';
import CameraScreen from '../../components/camera';

class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flash: RNCamera.Constants.FlashMode.on,
      cameraToggle: RNCamera.Constants.Type.back,
    };
  }
  /**
   * Pass image url to next page
   */
  navigator = uri => {
    console.log(uri, 'uri of the selected image');
    commonData.signUpObj.profile_image = uri.uri;
    this.props.navigation.navigate('DisplayProfile');
  };

  /**
   * Click event of screen linke next, back
   */
  navigationHandler = data => {
    console.log(data, 'data from skip handler');
    if (data == 'skip') {
      console.log('skipppppppppp');
    } else {
      this.props.navigation.goBack();
    }
  };

  render() {
    return (
      <CameraScreen
        text={'Upload a \n profile picture'}
        canSkip={false}
        header={true}
        getImageUri={this.navigator}
        skip={this.navigationHandler}
        backButton={this.navigationHandler}></CameraScreen>
    );
  }
}

//make this component available to the app
export default UploadImage;
