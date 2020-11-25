//import liraries
import React, { Component } from 'react';
import Card from '@custom_components/Card';
import Help from '@custom_components/Help';
import Invite from '@custom_components/Invite';
import UpdatePassword from '@custom_components/UpdatePassword';
import DisplayProfileImage from '@custom_components/DisplayProfileImage';
import CameraScreen from '@custom_components/camera';
import MultipleCategory from '@custom_components/MultipleCategory';
import CallHistory from '@custom_components/CallHistory';
import ShowRating from '@custom_components/ShowRating';
import EarningHistory from '@custom_components/EarningHistory';

import HeaderComponent from "@custom_components/HeaderComponent";
import { connect } from "react-redux";
import { setUserData, setAllTickets } from "../../actions";
import { Image, View, Text } from 'react-native';
import {
  postApiRequestWithHeaders,
  setItem,
  getItem,
  showToast,
  errorHandler,
} from '../../common/user';
import commonData from '../../common/data.js';
// import Load from 'react-native-loading-gif';
import Load from 'react-native-loading-gif';
import { colors } from '../../common/index';
import {
  Container,
  Header,
  Left,
  Button,
  Body,
  Right,
  Icon,
  Title,
} from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import styles from './styles';
const lock_icon = require('../../assets/imgs/lock_icon.png');
class CommonPage extends Component {
  constructor(props) {
    super(props);
    console.log(
      this.props,

      'inside constructor ',
    );
    this.state = {
      show: this.props.navigation.state.params.page,
      headerText: this.props.navigation.state.params.headerText,
      loader: false,
      is_exist: this.props.navigation.state.params.is_exists,
      // cards: commonData.user_details.cards,
      cards: [],
      callHistory: [],
      imageUri:
      "",
  };
    //   imageUri:
    //     commonData.profile_picture_url + commonData.user_details.profile_image,
    // };
  }
  //Update Password api call
  updatePasswordApiCall = data => {
    console.log('update profile call');
    //this.props.navigation.navigate('HomePage');
    // this.props.navigation.goBack();
    this.refs.Load.OpenLoad();
    //  this.refs.Load.OpenLoad();;
    const param = {
      user_id: commonData.user_details.user_id,
      password: data.password,
    };
    console.log(param, 'param');
    postApiRequestWithHeaders(
      commonData.api_endpoint.update_profile,
      param,
    ).then(
      res => {
        this.refs.Load.CloseLoad();
        //  this.refs.Load.CloseLoad();;
        console.log(res);
        showToast(commonData.ToastMessages.update_profile);

        this.props.navigation.goBack();
      },
      error => {
        this.refs.Load.CloseLoad();
        //  this.refs.Load.CloseLoad();;
        errorHandler(error, this.props);
      },
    );
  };

  //Add  card api call
  addCardApiCall = data => {
    console.log(data, 'Add Cardddddd call');
    //this.props.navigation.navigate('HomePage');
    // this.props.navigation.goBack();
    this.refs.Load.OpenLoad();
    //  this.refs.Load.OpenLoad();;

    postApiRequestWithHeaders(commonData.api_endpoint.add_card, data).then(
      data => {
        commonData.user_details.cards = data.cards;
        setItem('user_details', JSON.stringify(commonData.user_details)).then(
          res => {
            if (res) {
              console.log('Storage set', res);

              showToast(data.message);
              this.refs.Load.CloseLoad();
              //  this.refs.Load.CloseLoad();;
              this.props.navigation.goBack();
            }
          },
          err => { },
        );

        console.log(data, 'data.....');
      },
      error => {
        console.log('error....', error);
        this.refs.Load.CloseLoad();
        //  this.refs.Load.CloseLoad();;
        errorHandler(error, this.props);
      },
    );
  };

  //Update profile image api block
  updateProfileImageApiCall = (url) => {
    console.log('this.state.categories innn');
   this.refs.Load.OpenLoad();
    const param = {
      user_id: this.props.user.user_id,
      profile_image: url,
    };
    console.log(param);
    postApiRequestWithHeaders(
      commonData.api_endpoint.update_profile,
      param,this.props.user.access_token
    ).then(
      res => {
        // console.log(res, "user_detail");
        this.refs.Load.CloseLoad();
        this.navigator('back');
        res.loggedInStatus = true;
        if (res.user.user_type != "owner") {
          this.setState({
            all_job: res.all_tickets
          })
          console.log(this.state)
          this.props.setAllTickets(res.all_tickets)
        } else {
          this.setState({
            current_ticket: res.user.current_ticket,
            push_enable:res.user.push_enable
          })
        }
        this.props.setUserData(res.user);
    
      // this.props.clickHandler('back');
      },
      error => {
      this.refs.Load.CloseLoad();
        errorHandler(error, this.props);
      },

    );
  };

  // call history api block
  callHistoryApiCAll = () => {
    this.refs.Load.OpenLoad();
    //  this.refs.Load.OpenLoad();;
    const param = {
      user_id: commonData.user_details.user_id,
    };
    console.log(param, 'param');
    postApiRequestWithHeaders(commonData.api_endpoint.call_history, param).then(
      res => {
        this.refs.Load.CloseLoad();
        //  this.refs.Load.CloseLoad();;
        this.setState({ callHistory: res });
      },
      error => {
        this.refs.Load.CloseLoad();
        //  this.refs.Load.CloseLoad();;
        errorHandler(error, this.props);
      },
    );
  };
  hideCamera = () => {
    this.setState({ show: 'updateProfileImage' });
  };
  getImageUri = data => {
    console.log(data);
    this.setState({ imageUri: data.uri, show: 'updateProfileImage' });
  };

  //Navigator function
  navigator = (action,url) => {
    console.log(action, 'actionnnn');
    switch (action) {
      case 'back': {
        console.log(this.props.navigation,"llll",)
        if (this.props.navigation.state.params != undefined) {
          console.log(typeof this.props.navigation.state.params.onGoBack)
          if (typeof this.props.navigation.state.params.onGoBack != "undefined") {
            this.props.navigation.state.params.onGoBack();
           }
        }
        
        this.props.navigation.goBack();
        break;
      }
      case 'home': {
      
        this.props.navigation.goBack();
        break;
      }
      case 'editProfileImage': {
        console.log('open camera');
        this.setState({ show: 'openCamera' });
        break;
      }
      case 'editProfileImageApiCall': {
        console.log('api call');
        this.updateProfileImageApiCall(url);
        break;
      }

      case 'payment': {
        console.log('payment call');
        let view =
          this.props.user.cards.length == 0 ? 'intro' : 'addCard';
        let is_exist = this.props.user.cards.length == 0 ? false : true;
        this.props.navigation.navigate('OwnerPayment', {
          view: view,
          is_exist: is_exist,
        });
        break;
      }
    }
  };
  render() {
    return (
      <Container>
        <Load ref="Load" Image={0}></Load>
        <HeaderComponent clickHandler={() => this.navigator('back')} />
       
        {this.state.show == 'help' && <Help></Help>}
        {this.state.show == 'invite' && <Invite></Invite>}
        {this.state.show == 'card' && (
          <Card
            clickHandler={this.addCardApiCall}
            cards={this.state.cards}
            replaceText={'Replace Existing Card'}
            replaceCard={false}
            showNext={false}
            is_exist={this.state.is_exist}></Card>
        )}
        {this.state.show == 'updatePassword' && (
          <UpdatePassword
            text={'Enter a new Password'}
            forgotPassword={true}
            clickHandler={this.updatePasswordApiCall}></UpdatePassword>
        )}
        {this.state.show == 'updateProfileImage' && (
          <DisplayProfileImage
            imageUri={this.state.imageUri}
            btnText={'Update'}
            clickHandler={this.navigator}></DisplayProfileImage>
        )}
        {this.state.show == 'callHistory' && (
          <CallHistory
            callHistory={this.state.callHistory}
            showLoader={() => this.refs.Load.OpenLoad()}
            closeLoader={() => this.refs.Load.CloseLoad()}></CallHistory>
        )}
        {this.state.show == 'openCamera' && (
          <CameraScreen
            text={'Edit \n profile picture'}
            canSkip={false}
            header={false}
            getImageUri={this.getImageUri}
            skip={this.navigator}
            backButton={this.hideCamera}></CameraScreen>
        )}
        {this.state.show == 'editCategories' && (
          <MultipleCategory clickHandler={this.navigator}
          selectedCategory={this.props.user.categories}
          ></MultipleCategory>
        )}
        {this.state.show == 'showRating' && (
          <ShowRating clickHandler={this.navigator}></ShowRating>
        )}

        {this.state.show == 'showEarning' && (
          <EarningHistory clickHandler={this.navigator}
            showLoader={() => this.refs.Load.OpenLoad()}
            closeLoader={() => this.refs.Load.CloseLoad()}
          ></EarningHistory>
        )}
      </Container>
    );
  }
}


function mapStateToProps(state) {
  console.log(state, "state in Home")
  return {
    user: state.user.userData,
    signUp_data: state.user,
    all_tickets: state.all_tickets
  }
}
export default connect(mapStateToProps, { })(CommonPage);

