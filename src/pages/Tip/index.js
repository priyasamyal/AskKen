import React, { Component } from 'react';
import styles from './styles';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Button,
  Body,
  Right,
} from 'native-base';
import { colors } from '../../common/index';
import {
  postApiRequestWithHeaders,
  errorHandler,
  showToast,
} from '../../common/user';
import Load from 'react-native-loading-gif';
import CommonToast from "@custom_components/CommonToast";
import commonData from '../../common/data.js';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from "react-redux";
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
const profile = require('../../assets/imgs/slider1.jpg');
import { AppEventsLogger } from "react-native-fbsdk";
class Tip extends Component {
  constructor(props) {
    super(props);
   

    this.state = {
      phoneNo: '',
      modalVisible: false,
      disabled: true,
      selectedCountry: '',
      selected: 5,
      showCard: false,
      is_exist: false,
      cards: '',
      showCustomToast: false,
      is_tip_given: false
    };
 
    this.modalRef = React.createRef();
    console.log(this.props.ticket_data)
  }

  /**
   * API to add Tip
   */
  tipApiCall = data => {

   
  // this.refs.Load.OpenLoad();
    const param = {
      ticket_id:  this.props.ticket_data.current_ticket.ticket_id,
      amount: this.state.selected, 
    };
    this.props.tipHandler(param)
    // console.log(param, 'parm tip....');
    // postApiRequestWithHeaders(commonData.api_endpoint.add_tip, param,this.props.user.access_token).then(
    //   res => {
    //     console.log(res, 'res');
    //     AppEventsLogger.logPurchase(this.state.selected, "USD", { param: "Tip Added" });
    //    // this.refs.Load.CloseLoad();
    //     this.callToastFunction(commonData.ToastMessages.tip, "success");
    //     setTimeout(() => {
    //       this.props.clickHandler('home');
    //     }, 900);
    //   },
    //   error => {
    //     this.refs.Load.CloseLoad()
    //     errorHandler(error, this.props);
    //   },
    // );
  };

  /**
   * Back press or skip the tip move to home page
   */
  navigateHomePage = () => {
    this.refs.Load.CloseLoad()
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'HomePage' })],
    });
    this.props.navigation.dispatch(resetAction);
  };
  /**
   * Click events on page
   */
  navigator = action => {
    console.log(action, 'action');
    switch (action) {
      case 'two': {
        console.log('two');
        this.setState({ selected: 3 });
        break;
      }
      case 'five': {
        console.log(this.state.selected, 'five');
        this.setState({ selected: 5 });
        break;
      }
      case 'ten': {
        console.log('ten');
        console.log(this.state.selected, 'five');
        this.setState({ selected: 10 }, () => {
          console.log(this.state.selected, 'after');
        });
        break;
      }
      case 'skip': {
        console.log('home');
        if (this.state.is_tip_given == false) {
          this.props.clickHandler('home');
        }
       
       // this.navigateHomePage();
        break;
      }
      case 'back': {
        if (this.state.showCard) {
          this.setState({ showCard: false });
        } else {
          this.props.navigation.goBack();
        }
        break;
      }
      case 'next': {
        this.setState({
          is_tip_given: true
        })
        this.tipApiCall();
        break;
      }
    }
  };

  /**Common Toast Message*/
  callToastFunction = (msg, status) => {
    setTimeout(() => {
      this.setState({
        message: msg,
        type: status,
        showCustomToast: true
      })
    }, 100);

    setTimeout(() => {
      this.setState({
        showCustomToast: false
      });
    }, 700);
  }
  cardHandler = data => {
    console.log(data, 'data from card');
    data.currency = 'USD';
    (data.amount = this.state.selected), console.log(data, 'parm tip....');
  };
  render() {
    return (
      <Container>
        <Load ref="Load" Image={0} ></Load>
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
        <Header transparent style={styles.header}>
          <Left>
          </Left>
          <Body />
          {!this.state.showCard && (
            <Right>
              <TouchableOpacity
                hitSlop={hitSlop}
                onPress={() => {
                  this.navigator('skip');
                }}>
                <Text style={styles.pageTitle}>Skip</Text>
              </TouchableOpacity>
            </Right>
          )}
        </Header>

        {!this.state.showCard && (
          <View style={styles.container}>
            <View>
              <Image style={styles.icon_img}
              source={{ uri: commonData.profile_picture_url + this.props.ticket_data.current_ticket.expert_profile}}
              />
              <Text style={styles.headingText}>
                Add a tip {'\n'}for{' '}{ this.props.ticket_data.current_ticket.expert_name}?
              </Text>
            </View>

            <View style={styles.tipcontainer}>
              <View
                style={[
                  {
                    borderWidth: 1,
                    borderColor: this.state.selected == 3
                      ? colors.BLACK_TEXT
                      : colors.BORDER_COLOR,
                    borderRadius: 50,

                    paddingTop: 18,
                    paddingBottom: 18,
                    paddingRight: 22,
                    paddingLeft: 22,
                    backgroundColor:
                      this.state.selected == 3
                        ? colors.BLACK_TEXT
                        : 'transparent',
                  
                  },
                ]}>
                <TouchableOpacity
                  hitSlop={hitSlop}
                  onPress={() => {
                    this.navigator('two');
                  }}>
                  <Text style={[styles.tip_text,{  color:
                        this.state.selected == 3
                          ? colors.LIGHT_COLOR
                          : colors.BLACK_TEXT,}]}>$3</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  {
                    borderWidth: 1,
                    borderColor: this.state.selected == 2
                      ? colors.BLACK_TEXT
                      : colors.BORDER_COLOR,
                    borderRadius: 50,

                    paddingTop: 18,
                    paddingBottom: 18,
                    paddingRight: 22,
                    paddingLeft: 22,
                    backgroundColor:
                      this.state.selected == 5
                        ? colors.BLACK_TEXT
                        : 'transparent',
                  },
                ]}>
                <TouchableOpacity
                  hitSlop={hitSlop}
                  onPress={() => {
                    this.navigator('five');
                  }}>
                  <Text style={[styles.tip_text,{  color:
                        this.state.selected == 5
                          ? colors.LIGHT_COLOR
                          : colors.BLACK_TEXT,}]}>$5</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  {
                    borderWidth: 1,
                    borderColor: this.state.selected == 2
                      ? colors.BLACK_TEXT
                      : colors.BORDER_COLOR,
                    borderRadius: 50,

                    paddingTop: 18,
                    paddingBottom: 18,
                    paddingRight: 17,
                    paddingLeft: 17,
                    backgroundColor:
                      this.state.selected == 10
                        ? colors.BLACK_TEXT
                        : 'transparent',
                  },
                ]}>
                <TouchableOpacity
                  hitSlop={hitSlop}
                  onPress={() => {
                    this.navigator('ten');
                  }}>
                  <Text style={[styles.tip_text,{  color:
                        this.state.selected == 10
                          ? colors.LIGHT_COLOR
                          : colors.BLACK_TEXT,}]}>$10</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.btncontainer}>
              <Button
                block
                style={[styles.btn_inner]}
                onPress={() => {
                  this.navigator('next');
                }}>
                <Text style={styles.btn_txt}>Finish</Text>
              </Button>
            </View>
          </View>
        )}
      </Container>
    );
  }
}


function mapStateToProps(state) {
  //console.log(state, "state")
  return {
    user: state.user.userData,
    ticket_data: state.user
  }
}
export default connect(mapStateToProps, { })(Tip);