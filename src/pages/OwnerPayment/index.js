import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Title,
} from 'native-base';
import crashlytics from '@react-native-firebase/crashlytics';
import AddCard from '@custom_components/AddCard';
import PaymentIntro from '@custom_components/PaymentIntro';
import HowItWorks from '@custom_components/HowItWorks';
import AddCardHolder from '@custom_components/AddCardHolder';
import AddSSN from '@custom_components/AddSSN';
import ExpertExistCard from '@custom_components/ExpertExistCard';
import Card from '@custom_components/Card';
import commonData from '../../common/data.js';
import Load from 'react-native-loading-gif';
import { RNS3 } from 'react-native-aws3';
import analytics from '@react-native-firebase/analytics';
import {
  postApiRequestWithHeaders,
  postApiRequestWithHeadersServerEoor,
  setItem,
  showToast,
  errorHandler,
  alertWithSingleBtn
} from '../../common/user';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from "react-redux";
import { setUserData, setTicketPhoto } from "../../actions";
import CommonToast from "@custom_components/CommonToast";
import { AppEventsLogger } from "react-native-fbsdk";
this.add_card_ref = React.createRef();
class OwnerPayment extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'in introduction');
    this.state = {
      view: this.props.navigation.state.params.view,
      userType: this.props.user.user_type,
      is_exist: this.props.navigation.state.params.is_exist,
      action: this.props.navigation.state.params.action,
      message: "",
      type: "",
      showCustomToast: false
    };
  }

  componentDidMount() {
    this.getStripeStatusApiCall()
  };
  /**
   * Callback functions from children components
   */
  navigator = (navigateTo, param) => {
    switch (navigateTo) {
      case 'next': {
        console.log('next in owner');
        this.props.navigation.push('OwnerPayment', {
          view: 'addCard',
        });
        console.log(this.state.userType, 'userType');
        // this.state.userType == 'owner'
        //   ? this.props.navigation.push('OwnerPayment', {
        //     view: 'addCard',
        //   })
        //   : this.props.navigation.push('OwnerPayment', {
        //     view: 'addCard',
        //   });
        break;
      }
      case 'expertCard': {
        this.props.navigation.push('OwnerPayment', {
          view: 'expertCard',
          param: param,
        });
        break;
      }
      case 'work': {
        this.props.navigation.push('OwnerPayment', {
          view: 'work',
        });
        break;
      }
      case 'addCard': {
        console.log(param, 'param add card ', this.child,this.props);
        if(this.props.ticket_data.description !=''){
          if (this.props.ticket_data.type == "photo") {
            this.refs.Load.OpenLoad();
            this.uploadPhoto(param)
          } else {
            this.uploadVideo(param);
          }
        }else{
          this.addCardApiCall(param);
        }
      
        // this.addCardApiCall(param);
        break;
      }
      case 'AddCardHolder': {
        this.props.navigation.push('OwnerPayment', {
          view: 'AddCardHolder',
          param: param,
        });
        break;
      }
      case 'AddSSN': {
        this.props.navigation.push('OwnerPayment', {
          view: 'AddSSN',
          param: param,
        });
        break;
      }
      case 'expertApiCall': {
        this.props.user.cards.length != 0 ? param.type = "edit" : param.type = 'add';
        console.log(param);
        this.addPaymentApiCall(param);
        break;
      }
      case 'back': {
        this.props.navigation.goBack();
        break;
      }
    }
  };

  callToastFunction = (msg, type="error") => {
    setTimeout(() => {
      this.setState({
        message: msg,
        type: type,
        showCustomToast: true
      })
    }, 400);

    setTimeout(() => {
      this.setState({
        showCustomToast: false
      });
    }, 3000);
  }

  getStripeStatusApiCall = (msg, index) => {
    const param = {
      user_id: this.props.user.user_id,
    };
    console.log(param, 'stripe status parammmmmmmmmmmmm');
    postApiRequestWithHeaders(commonData.api_endpoint.get_status, param,this.props.user.access_token).then(
      res => {
        console.log(res, 'ressssss');
        commonData.stripe_status = res;
      },
      error => { },
    );
  };

  /**
   Add expert Payment Detail API
  */
  addPaymentApiCall = data => {
    var index;
    this.props.user.cards.length > 0 ? (index = 3) : (index = 4);
    console.log(data.ssn_full, "ssn_full")
    // if(data.ssn_full != undefined){
    //   index = 4;
    // }

    this.refs.Load.OpenLoad();
    console.log(data, "data to submit for API");
    console.log(commonData.api_endpoint.stripe_connect, "API name");
    postApiRequestWithHeaders(commonData.api_endpoint.stripe_connect, data,this.props.user.access_token).then(
      data => {
        console.log(data, "response");
        this.getStatusApiCall(data.message, index);
      },
      error => {
        console.log('error....', error);
        this.refs.Load.CloseLoad();
        if (error.code != 401) {
          this.callToastFunction(error);
        }
        errorHandler(error, this.props);
      },
    );
  };

  getStatusApiCall = (msg, index) => {
    const param = {
      user_id: this.props.user.user_id,
    };
    console.log(param, 'stripe status parammmmmmmmmmmmm');
    postApiRequestWithHeaders(commonData.api_endpoint.get_status, param,this.props.user.access_token).then(
      res => {
        console.log(res, 'ressssss');
        commonData.stripe_status = res;
        this.refs.Load.CloseLoad();
       // showToast(msg);
        this.callToastFunction(msg,"success");
        setTimeout(() => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "HomePage" })],
          });
          this.props.navigation.dispatch(resetAction);
          alertWithSingleBtn(
            'Verification Pending',
            commonData.ToastMessages.pending_verification_msg,
            'Ok',
          ).then(data => {
            console.log(data);
            if (data) {
            }
          });
        }, 2000);
     
      },
      error => { },
    );
  };
  /**
   * Add function for add card API call
   */
  addCardApiCall = data => {
    var index;
    if (this.props.user.user_type == 'owner') {
      'is_saved' in data ? (index = 1) : (index = 2);
    } else {
      this.props.user.user_type.cards.length > 0 ? (index = 3) : (index = 4);
    }
    console.log(index, 'index');
    this.refs.Load.OpenLoad();
    postApiRequestWithHeadersServerEoor(commonData.api_endpoint.add_card, data,this.props.user.access_token).then(
      data => {
        console.log(data, "response");
        this.refs.Load.CloseLoad();
        this.child.callToastFunction(data.message,"success");
        this.props.setUserData(data.data.user);
        setTimeout(() => {
          this.props.navigation.pop(index);
        }, 1000);
        
      },
      error => {
        console.log('error....', error);
        
        this.refs.Load.CloseLoad();
        this.child.callToastFunction(error,"error");
        errorHandler(error, this.props);
      },
    );
  };


  createTicket = (param) => {

    console.log("create para", this.props.ticket_data, param);
    var param = {
      categories: this.props.ticket_data.categories,
      description: this.props.ticket_data.description,
      fees: "45",
      type: this.props.ticket_data.type,
      ticket_file: this.props.ticket_data.uri,
      card_holder_name: param.card_holder_name,
      card_number: param.card_number,
      cvv: param.cvv,
      expiration_month: param.expiration_month,
      expiration_year: param.expiration_year,
      is_saved: true,
      time_zone: commonData.time_zone
    }
    console.log(param, "parammmm");
    postApiRequestWithHeadersServerEoor(commonData.api_endpoint.post_ticket, param, this.props.user.access_token).then(
      data => {
        AppEventsLogger.logEvent("Ticket Created", { type: 'owner' });
        AppEventsLogger.logEvent("fb_mobile_add_payment_info", {fb_success:1});
        if(this.props.user.phone_number == undefined || this.props.user.phone_number == ''){
          crashlytics().log("TicketCreated");
        }else{
          crashlytics().log("TicketCreated "+this.props.user.phone_number.split(" ").join(""));
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
        this.child.callToastFunction(error);
        errorHandler(error, this.props);
      },
    );
  }

  uploadVideo = (param) => {
    this.refs.Load.OpenLoad();
    console.log("Upload video......",this.props.ticket_data);
    var file_name = Date.now() + this.props.user.user_id + '.mov'
    console.log("Upload video......",file_name);
    
    const file = {
      uri: this.props.ticket_data.uri,
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
        this.refs.Load.CloseLoad();
        this.child.callToastFunction("Uploading Error");
        throw new Error("Failed to upload image to S3");
      } else {
        this.props.setTicketPhoto({
          type: 'video',
          uri: response.body.postResponse.location
        })
        setTimeout(() => {
         this.createTicket(param)
        }, 1000);
        //this.createTicket(param)
      }
      console.log(response.body);
    });
  }

  uploadPhoto=(param)=>{
    var file_name = Date.now() + this.props.user.user_id + '.jpeg'
    this.props.setTicketPhoto({
      type: 'photo',
      uri: file_name
    })
    console.log("upload phot..", this.state);
    const file = {
      uri: this.props.ticket_data.uri,
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
    console.log(file,options);
    RNS3.put(file, options).then(response => {
      console.log(response, "S3 respo...")
      if (response.status !== 201) {
        this.refs.Load.CloseLoad();
        this.child.callToastFunction("Uploading Error");
        throw new Error("Failed to upload image to S3");
      } else {
        this.props.setTicketPhoto({
          type: 'photo',
          uri: response.body.postResponse.location
        })
        setTimeout(() => {
          this.createTicket(param)
         }, 1000);
    
      }
      console.log(response.body);
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
         {this.state.showCustomToast ? (
          <View style={{
            position: "absolute",
            bottom: 0,
            zIndex:4
          }}>
            <CommonToast type={this.state.type} message={this.state.message} />
          </View>
        ) : null}
        <Load ref="Load"></Load>
        {this.props.user.user_type == 'expert' && this.state.view == 'addCard' && (
          this.props.user.cards.length > 0 ? (
            <ExpertExistCard
              handler={this.navigator}
              is_exist={this.state.is_exist}></ExpertExistCard>
          ) :
            <AddCard
              ref={this.add_card_ref}
              onRef={ref => (this.child = ref)}
              handler={this.navigator}
              is_exist={false}></AddCard>


        )}
        {this.state.view == 'addCard' && this.props.user.user_type != 'expert' && (
          <AddCard
            ref={this.add_card_ref}
            onRef={ref => (this.child = ref)}
            handler={this.navigator}
            is_exist={this.state.is_exist}></AddCard>
        )}

        {this.state.view == 'expertCard' && (
          <AddCard
            ref={this.add_card_ref}
            onRef={ref => (this.child = ref)}
            handler={this.navigator}
            is_exist={this.state.is_exist}></AddCard>
        )}

        {this.state.view == 'intro' && (
          <PaymentIntro handler={this.navigator}></PaymentIntro>
        )}
        {this.state.view == 'work' && (
          <HowItWorks handler={this.navigator}></HowItWorks>
        )}
        {this.state.view == 'AddCardHolder' && (
          <AddCardHolder
            handler={this.navigator}
            navigation={this.props.navigation}></AddCardHolder>
        )}
        {this.state.view == 'AddSSN' && (
          <AddSSN
            onRef={ref => (this.child = ref)}
            handler={this.navigator}
            navigation={this.props.navigation}></AddSSN>
        )}
      </View>
    );
  }
}
function mapStateToProps(state) {
 // console.log(state, "state in pay")
  return {
    user: state.user.userData,
    ticket_data: state.post_ticket,

  }
}
export default connect(mapStateToProps, { setUserData, setTicketPhoto })(OwnerPayment);

