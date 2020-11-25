import React, {Component} from 'react';
import commonData from '../../common/data.js';
import CameraScreen from '../../components/camera';
import {StackActions, NavigationActions} from 'react-navigation';

import {postApiRequest, setItem} from '../../common/user';
import RegisterSuccess from '../../components/RegisterSuccess';

class uploadLicence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSucess: false,
    };
  }
  navigator = uri => {
    console.log(uri, 'uri of the selected image');
    commonData.signUpObj.license_image = uri.uri;
    // this.props.navigation.navigate('DisplayProfile',{src: uri.path})
    this.props.navigation.navigate('DisplayLicense');
  };
  signupApiCall = () => {
    console.log('signup api call ');
    this.setState({showSucess: true});
    // this.props.navigation.navigate('Notification');
    //  this.refs.Load.OpenLoad();;

    // const param = {
    //   phone_number: commonData.signUpObj.phone_number,
    //   phone_code: commonData.signUpObj.phone_code,
    //   name: commonData.signUpObj.name,
    //   password: commonData.signUpObj.password,
    //   profile_image: commonData.signUpObj.profile_image,
    //   user_type: commonData.signUpObj.user_type,
    //   device_token: commonData.signUpObj.device_token,
    // license_image=  commonData.signUpObj.device_token
    // };
    // postApiRequest(commonData.api_endpoint.signup, commonData.signUpObj ).then(
    //   data => {
    //      this.refs.Load.CloseLoad();;
    //     setItem('user_details', data).then(
    //       res => {
    //         if (res) {
    //           console.log('Storage set', res);
    //           this.props.navigation.navigate('Notification');
    //         }
    //       },
    //       err => {},
    //     );
    //   },
    //   error => {
    //     console.log(error, 'error');
    //      this.refs.Load.CloseLoad();;
    //   },
    // );
  };
  navigationHandler = data => {
    console.log(data, 'data from skip handler');
    if (data == 'skip') {
      console.log('skipppppppppp');
      this.signupApiCall();
    } else if (data == 'final') {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'HomePage'})],
      });
      // this.props.navigation.navigate('HomePage');
    } else {
      this.props.navigation.goBack();
    }
  };

  render() {
    if (!this.state.showSucess) {
      return (
        <CameraScreen
          text={'Upload a picture \n of your license'}
          canSkip={true}
          header={false}
          getImageUri={this.navigator}
          skip={this.navigationHandler}
          backButton={this.navigationHandler}></CameraScreen>
      );
    } else {
      return (
        <RegisterSuccess onDone={this.navigationHandler}></RegisterSuccess>
      );
    }
  }
}

//make this component available to the app
export default uploadLicence;
