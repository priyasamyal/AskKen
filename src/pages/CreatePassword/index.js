import React, { Component } from 'react';
import commonData from '../../common/data.js';
import { postApiRequest, setItem } from '../../common/user';
import PasswordScreen from '../../components/password';
import RegisterSuccess from '../../components/RegisterSuccess';
import { StackActions, NavigationActions } from 'react-navigation';
//import Load from 'react-native-loading-gif';
import Load from 'react-native-loading-gif';
import { colors } from '../../common/index';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { View } from 'react-native';
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

class CreatePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      modalVisible: false,
      disabled: true,
      showSucess: false,
      // loader: false,
    };
    console.log(commonData.categories, 'categories in create password');
  }
  signupApiCall = () => {
    console.log('signup api call ');
    // this.setState({showSucess: true});
    // this.props.navigation.navigate('Notification');
    console.log();
    this.refs.Load.OpenLoad();
    //  this.refs.Load.OpenLoad();;

    const param = {
      phone_number: commonData.signUpObj.phone_number,
      country_code: commonData.signUpObj.phone_code.phone_code,
      name: commonData.signUpObj.name,
      password: commonData.signUpObj.password,
      profile_image: commonData.signUpObj.profile_image,
      user_type: commonData.signUpObj.user_type,
      device_token: commonData.signUpObj.device_token,
      uuid: commonData.signUpObj.uuid,
    };
    console.log(param, 'param util');
    postApiRequest(commonData.api_endpoint.signup, param).then(
      data => {
        this.refs.Load.CloseLoad();
        //  this.refs.Load.CloseLoad();
        data.loggedInStatus = true;
        setItem('user_details', JSON.stringify(data)).then(
          res => {
            if (res) {
              console.log('aaaa');
              commonData.user_details = data;
              this.setState({ showSucess: true });
            }
          },
          err => { },
        );
      },
      error => {
        console.log(error, 'error');
        this.refs.Load.CloseLoad();
        //  this.refs.Load.CloseLoad();;
      },
    );
  };
  navigaeteToHomePage = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'HomePage' })],
    });
    this.props.navigation.dispatch(resetAction);
    console.log(commonData.categories, 'categories after reset stack');
    // this.props.navigation.navigate('HomePage');
  };
  navigator = navigate => {
    console.log(navigate, 'navigate in enter password page');
    switch (navigate.action) {
      case 'next': {
        console.log('next');

        commonData.signUpObj.password = navigate.password;

        // commonData.signupParam.append('password', this.state.password);
        if (commonData.signUpObj.user_type == 'owner') {
          this.signupApiCall();
        } else {
          console.log('aaaa');

          this.props.navigation.navigate('Categories');
        }

        break;
      }

      case 'back': {
        console.log('back');

        this.props.navigation.goBack();
        break;
      }
    }
  };

  render() {
    if (!this.state.showSucess) {
      return (
        <Container>
          <Load ref="Load" Image={0}></Load>
          {/*<Load ref="Load" Image={0}></Load> */}
          <PasswordScreen
            text={'Create a password'}
            forgotPassword={true}
            clickHandler={this.navigator}></PasswordScreen>
        </Container>
      );
    } else {
      return (
        <Container>
          <Load ref="Load" Image={0}></Load>
          {/*<Load ref="Load" Image={0}></Load> */}
          <RegisterSuccess onDone={this.navigaeteToHomePage}></RegisterSuccess>
        </Container>
      );
    }
  }
}

export default CreatePassword;
