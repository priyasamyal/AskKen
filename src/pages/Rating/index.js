import React, { Component } from 'react';
import styles from './styles';
import {
  View,
  Image,
  Text, TouchableOpacity, Dimensions
} from 'react-native';
var { width, height } = Dimensions.get('window');
import {
  Container,
  Header,
  Left,
  Button,
  Body,
  Right,
  Icon,
  Title,
  CheckBox,
} from 'native-base';
import { connect } from "react-redux";
import Slider from 'react-native-slider';
import { colors } from '../../common/index';
import commonData from '../../common/data.js';
import {
  postApiRequestWithHeaders,
  errorHandler,
  alertWithTwoBtn,
  showToast
} from '../../common/user';
import Load from 'react-native-loading-gif';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
const frown = require('../../assets/imgs/frown.png');
const green_frown = require('../../assets/imgs/smile.png');
const average = require('../../assets/imgs/average.png');
import CommonPopUp from '@custom_components/CommonPopUp';
import * as Animatable from 'react-native-animatable';

import { StackActions, NavigationActions } from 'react-navigation';
// create a component
class Rating extends Component {
  state = {
    value: 2,
    show_tip: true,
    disabled: true,
    ownerSelected: false,
    expertSelected: false,
    selectedCheckbox: '',
    show_popUp: false,
    show_request_popUp: false,
    showRefund: false
  };

  handleCheckBox = selected => {
    console.log(selected, "selected....")
    this.setState({ disabled: false });
    if (selected == 'yes') {
      if (selected == 'yes' && this.state.selectedCheckbox == 'yes') {
        this.setState({ disabled: true });
        this.setState({
          ownerSelected: false,
          expertSelected: false,
          selectedCheckbox: '',
        });
      } else {
        this.setState({
          ownerSelected: true,
          expertSelected: false,
          selectedCheckbox: 'yes',
        });
      }
    } else {
      if (selected == 'no' && this.state.selectedCheckbox == 'no') {
        this.setState({ disabled: true });
        this.setState({
          ownerSelected: false,
          expertSelected: false,
          selectedCheckbox: '',
        });
      } else {
        this.setState({
          ownerSelected: false,
          expertSelected: true,
          selectedCheckbox: 'no',
        });
      }
    }
  };

  popUpClick = (type) => {
    console.log("tyoe", type);
    // this.setState({ show_popUp: false });
    // this.props.parentCallback('dismiss');
    switch (type) {
      case "refund":
        var param = {
          owner_satisfied: 0,
          owner_refund_asked: 1,
          user_type: commonData.user_details.user_type,
          call_id: this.props.session_call_id,
          name: commonData.user_details.name,
          phone_number: "+" + commonData.user_details.country_code + " " + commonData.user_details.phone_number,
        }
        this.sendMail(param);
        this.setState({ show_request_popUp: false });

        break;

      case "cancel":
        var param = {
          owner_satisfied: 0,
          owner_refund_asked: 0,
          user_type: commonData.user_details.user_type,
          call_id: this.props.session_call_id,
          name: commonData.user_details.name,
          phone_number: "+" + commonData.user_details.country_code + " " + commonData.user_details.phone_number,
        }
        this.sendMail(param);
        this.setState({ show_request_popUp: false, show_tip: true });
        break;

      case "end":
        this.setState({ show_popUp: false });
        this.props.parentCallback('dismiss');
        break;

      default:
        break;
    }
  }
  render() {
    return (

      <View style={{ flex: 1 }}>
        {/* {this.state.show_request_popUp && (
          <View style={{
            zIndex: 10,
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: width,
            height: height,
          }}>
            <CommonPopUp clickHandler={this.popUpClick} title="Refund" msg="Do you want refund?"></CommonPopUp>
          </View>
        )}
        {this.state.show_popUp && (
          <View style={{
            zIndex: 10,
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: width,
            height: height,
          }}>
            <CommonPopUp clickHandler={this.popUpClick} title="Refund Initiated" msg={commonData.ToastMessages.refund_msg}></CommonPopUp>
          </View>
        )} */}

        {/* {!this.state.show_tip && commonData.user_details.user_type != 'expert' && (
          <View style={{ flex: 1 }}>
            <Container>
              <View style={styles.mainContainer}>
                <Animatable.View style={styles.mainContent}>
                  <Text style={styles.problem_text} >
                    Satisfied?
            </Text>
                  <Text style={styles.description_text}>
                    Are you satisfied with your{'\n'}expert’s help on this call?
            </Text>
                  <TouchableOpacity onPress={() => this.handleCheckBox('yes')}>
                    <Animatable.View
                      animation={this.state.ownerSelected ? 'bounceIn' : ''}
                      duration={500}
                      style={[
                        styles.numberInputContainer,
                        this.state.ownerSelected
                          ? {
                            borderColor: colors.BLACK_TEXT,
                          }
                          : {
                            borderColor: colors.BORDER_COLOR,
                          },
                      ]}>
                      <CheckBox
                        checked={this.state.ownerSelected}
                        color={this.state.ownerSelected ? colors.THEME_YELLOW : colors.BORDER_COLOR}
                        style={styles.check_style}
                        onPress={() => this.handleCheckBox('yes')}
                      />
                      <Body style={{ alignItems: 'flex-start' }}>
                        <Text
                          style={[
                            styles.body_style,
                            this.state.ownerSelected
                              ? {
                                fontWeight: '500',
                              }
                              : {
                                fontWeight: '100',
                              },
                          ]}>
                          Yes
                  </Text>
                      </Body>
                    </Animatable.View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.handleCheckBox('no')}>
                    <Animatable.View
                      animation={this.state.expertSelected ? 'bounceIn' : ''}
                      duration={500}
                      style={[
                        styles.numberInputContainer,
                        this.state.expertSelected
                          ? {
                            borderColor: colors.BLACK_TEXT,
                          }
                          : {
                            borderColor: colors.BORDER_COLOR,
                          },
                      ]}>
                      <CheckBox
                        checked={this.state.expertSelected}

                        color={this.state.expertSelected ? colors.THEME_YELLOW : colors.BORDER_COLOR}
                        style={styles.check_style}
                        onPress={() => this.handleCheckBox('no')}
                      />
                      <Body style={{ alignItems: 'flex-start' }}>
                        <Text
                          style={[
                            styles.body_style,
                            this.state.expertSelected
                              ? {
                                fontWeight: '500',
                              }
                              : {
                                fontWeight: '100',
                              },
                          ]}>
                          No {this.state.expertSelected}
                        </Text>
                      </Body>
                    </Animatable.View>
                  </TouchableOpacity>
                </Animatable.View>
              </View>
              {this.state.selectedCheckbox != "" && (
                <View style={styles.btm_btncontainer}>
                  <Button
                    block
                    onPress={() => this.navigator('next')}
                    style={styles.btn_inner1}>
                    <Text style={styles.btn_txt1}>Next</Text>
                  </Button>
                </View>
              )}
            </Container>
          </View>
        )}

        {!this.state.show_tip && commonData.user_details.user_type == 'expert' && !this.state.showRefund && (
          <View style={{ flex: 1 }}>
            <Container>
              <Load ref="Load" Image={0}></Load>
              <View style={styles.mainContainer}>
                <Animatable.View style={styles.mainContent}>
                  <Text style={styles.problem_text} >
                    Problem Solved?
            </Text>
                  <Text style={[styles.description_text, { paddingRight: 20 }]}>
                    Was the problem you were{'\n'}calling about solved to your{'\n'}satisfaction?
            </Text>
                  <TouchableOpacity onPress={() => this.handleCheckBox('yes')}>
                    <Animatable.View
                      animation={this.state.ownerSelected ? 'bounceIn' : ''}
                      duration={500}
                      style={[
                        styles.numberInputContainer,
                        this.state.ownerSelected
                          ? {
                            borderColor: colors.BLACK_TEXT,
                          }
                          : {
                            borderColor: colors.BORDER_COLOR,
                          },
                      ]}>
                      <CheckBox
                        checked={this.state.ownerSelected}
                        color={this.state.ownerSelected ? colors.THEME_YELLOW : colors.BORDER_COLOR}
                        style={styles.check_style}
                        onPress={() => this.handleCheckBox('yes')}
                      />
                      <Body style={{ alignItems: 'flex-start' }}>
                        <Text
                          style={[
                            styles.body_style,
                            this.state.ownerSelected
                              ? {
                                fontWeight: '500',
                              }
                              : {
                                fontWeight: '100',
                              },
                          ]}>
                          Yes
                  </Text>
                      </Body>
                    </Animatable.View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.handleCheckBox('no')}>
                    <Animatable.View
                      animation={this.state.expertSelected ? 'bounceIn' : ''}
                      duration={500}
                      style={[
                        styles.numberInputContainer,
                        this.state.expertSelected
                          ? {
                            borderColor: colors.BLACK_TEXT,
                          }
                          : {
                            borderColor: colors.BORDER_COLOR,
                          },
                      ]}>
                      <CheckBox
                        checked={this.state.expertSelected}

                        color={this.state.expertSelected ? colors.THEME_YELLOW : colors.BORDER_COLOR}
                        style={styles.check_style}
                        onPress={() => this.handleCheckBox('no')}
                      />
                      <Body style={{ alignItems: 'flex-start' }}>
                        <Text
                          style={[
                            styles.body_style,
                            this.state.expertSelected
                              ? {
                                fontWeight: '500',
                              }
                              : {
                                fontWeight: '100',
                              },
                          ]}>
                          No
                        </Text>
                      </Body>
                    </Animatable.View>
                  </TouchableOpacity>
                </Animatable.View>
              </View>
              {this.state.selectedCheckbox != "" && (
                <View style={styles.btm_btncontainer}>
                  <Button
                    block
                    onPress={() => this.navigator('next')}
                    style={styles.btn_inner1}>
                    <Text style={styles.btn_txt1}>Next</Text>
                  </Button>
                </View>
              )}
            </Container>
          </View>
        )}

        {!this.state.show_tip && commonData.user_details.user_type == 'expert' && this.state.showRefund && (
          <View style={{ flex: 1 }}>
            <Container>
              <Load ref="Load" Image={0}></Load>
              <View style={styles.mainContainer}>
                <Animatable.View style={styles.mainContent}>
                  <Text style={styles.problem_text} >
                    Refund?
            </Text>
                  <Text style={[styles.description_text, { paddingRight: 20 }]}>
                    Maintaining a good rating is{'\n'}essential to your success. Since{'\n'} you weren't able to solve the{'\n'} homeowner's problem, would {'\n'}you like to issue a refund?
            </Text>
                  <TouchableOpacity onPress={() => this.handleCheckBox('yes')}>
                    <Animatable.View
                      animation={this.state.ownerSelected ? 'bounceIn' : ''}
                      duration={500}
                      style={[
                        styles.numberInputContainer,
                        this.state.ownerSelected
                          ? {
                            borderColor: colors.BLACK_TEXT,
                          }
                          : {
                            borderColor: colors.BORDER_COLOR,
                          },
                      ]}>
                      <CheckBox
                        checked={this.state.ownerSelected}
                        color={this.state.ownerSelected ? colors.THEME_YELLOW : colors.BORDER_COLOR}
                        style={styles.check_style}
                        onPress={() => this.handleCheckBox('yes')}
                      />
                      <Body style={{ alignItems: 'flex-start' }}>
                        <Text
                          style={[
                            styles.body_style,
                            this.state.ownerSelected
                              ? {
                                fontWeight: '500',
                              }
                              : {
                                fontWeight: '100',
                              },
                          ]}>
                          Yes, issue refund
                  </Text>
                      </Body>
                    </Animatable.View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.handleCheckBox('no')}>
                    <Animatable.View
                      animation={this.state.expertSelected ? 'bounceIn' : ''}
                      duration={500}
                      style={[
                        styles.numberInputContainer,
                        this.state.expertSelected
                          ? {
                            borderColor: colors.BLACK_TEXT,
                          }
                          : {
                            borderColor: colors.BORDER_COLOR,
                          },
                      ]}>
                      <CheckBox
                        checked={this.state.expertSelected}

                        color={this.state.expertSelected ? colors.THEME_YELLOW : colors.BORDER_COLOR}
                        style={styles.check_style}
                        onPress={() => this.handleCheckBox('no')}
                      />
                      <Body style={{ alignItems: 'flex-start' }}>
                        <Text
                          style={[
                            styles.body_style,
                            this.state.expertSelected
                              ? {
                                fontWeight: '500',
                              }
                              : {
                                fontWeight: '100',
                              },
                          ]}>
                          No, do not refund
                        </Text>
                      </Body>
                    </Animatable.View>
                  </TouchableOpacity>
                </Animatable.View>
              </View>
              {this.state.selectedCheckbox != "" && (
                <View style={styles.btm_btncontainer}>
                  <Button
                    block
                    onPress={() => this.navigator('next')}
                    style={styles.btn_inner1}>
                    <Text style={styles.btn_txt1}>Next</Text>
                  </Button>
                </View>
              )}
            </Container>
          </View>
        )} */}


        {this.state.show_tip && (
          <View style={{ flex: 1 }}>
            <Container>
              <Load ref="Load" Image={0}></Load>
              <Header transparent style={styles.header}>
                <Left>
                  <Button
                    transparent
                    hitSlop={hitSlop}
                    onPress={() => this.navigator('back')}>
                    <Icon style={[styles.black_text]} name="ios-close" />
                  </Button>
                </Left>
                <Body style={{flex:2}}>
                  <Title style={styles.pageTitle}>Job Completed</Title>
                </Body>
                <Right />
              </Header>
              <View style={{ flex: 1 }}>
                <View style={styles.container1}>
                  <View style={styles.container}>
                    <Text style={styles.headingText}>How was {'\n'}your Pro?</Text>

                    <Text style={styles.value}>{this.getText()}</Text>
                  </View>

                  <Image style={styles.icon_img} source={this.getImg()} />

                  <Slider
                    minimumValue={0}
                    maximumValue={2}
                    step={1}
                    minimumTrackTintColor={this.getBtnColor()}
                    maximumTrackTintColor={colors.borderColor}
                    thumbTintColor={colors.THEME_YELLOW}
                    thumbTouchSize={{ width: 70, height: 70 }}
                    value={this.state.value}
                    animateTransitions={true}
                    thumbStyle={{
                      borderRadius: 5,
                      width: 50,
                      height: 55,
                      backgroundColor: colors.LIGHT_COLOR,
                      borderWidth: 1,
                      borderColor: colors.BORDER_COLOR,
                    }}
                    onValueChange={value => this.sliderValueChange(value)}
                  />
                </View>
                <View style={styles.btncontainer}>
                  <Button
                    block
                    style={[styles.btn_inner, { backgroundColor: this.getBtnColor() }]}
                    onPress={() => {
                      this.navigator('done');
                    }}>
                    <Text style={styles.btn_txt}>Done </Text>
                  </Button>
                </View>
              </View>
            </Container>
          </View>
        )}
      </View>
    );
  }
  /**
   * Click handling of next back etc
   */
  navigator = page => {
    //  console.log(this.state.value, 'value');
    switch (page) {
      case 'done': {
        this.ratingApiCall();
        break;
      }
      case 'back': {
        this.props.clickHandler('home');
        break;
      }
      case 'next': {
        console.log("next Clik", this.state);
        if (commonData.user_details.user_type == 'expert') {
          if (!this.state.showRefund) {
            if (!this.state.ownerSelected) {
              console.log("calling refund....")
              this.setState({ showRefund: true, ownerSelected: false, expertSelected: false, selectedCheckbox: '' })
            } else {
              this.props.parentCallback('dismiss');
            }
            console.log(this.state.ownerSelected)

          } else {
            var data = {
              call_id: this.props.session_call_id,
              expert_feedback: this.state.ownerSelected
            }
            this.sendMail(data);
          }

        } else {
          if (this.state.expertSelected) {
            this.setState({ show_request_popUp: true })
          }
          else {
            //   console.log("user pressed yes.");
            var param = {
              owner_satisfied: 1,
              owner_refund_asked: 0,
              user_type: commonData.user_details.user_type,
              call_id: this.props.session_call_id,
              name: commonData.user_details.name,
              phone_number: "+" + commonData.user_details.country_code + " " + commonData.user_details.phone_number,
            }
            this.sendMail(param);
            this.setState({ show_tip: true })
          }
        }

        break;
      }
    }
  };
  componentDidMount() {
    console.log(this.props.subscriber_info, 'this.props.subscriber_info...');
  }
  /**
   * Send Email to adim with user details if request for refund
   */
  sendMail = (param) => {
    console.log(param, "ji");
    if (commonData.user_details.user_type == "expert") {
      console.log(param, "refund param");
      if (param.expert_feedback) {
        this.refs.Load.OpenLoad();
        var post_param = {
          call_id: param.call_id
        }
        console.log("hit API", post_param);
        postApiRequestWithHeaders(commonData.api_endpoint.refund_amount, post_param).then(
          res => {
            console.log(res);
            this.refs.Load.CloseLoad();
            this.props.parentCallback('dismiss');
            showToast("Refund Initiated");
          },
          error => {
            this.refs.Load.CloseLoad();
            this.props.parentCallback('dismiss');
          },
        );
      } else {
        console.log("No API");
        this.props.parentCallback('dismiss');
      }

    } else {

      if (param.owner_refund_asked == 1) {
        this.setState({ show_popUp: true })
      }
      postApiRequestWithHeaders(commonData.api_endpoint.request_refund, param).then(
        res => {
          // console.log(res, '');
        },
        error => {
        },
      );
    }

  }
  /**
   * Hit rate API after rating
   */
  ratingApiCall = () => {
    this.refs.Load.OpenLoad();
    const param = {
      user_id: this.props.user.user_id,
      ticket_id:  this.props.ticket_data.current_ticket.ticket_id,
      rating:0
    };
    if (this.state.value == 1) {
      param.rating = 3;
    }
    if (this.state.value == 2) {
      param.rating = 5;
    }
    // console.log(param, 'param');
    postApiRequestWithHeaders(commonData.api_endpoint.review, param,this.props.user.access_token).then(
      res => {
        //  console.log(res, '');
        setTimeout(() => {
          this.refs.Load.CloseLoad();
          if (this.state.value >= 1) {
            this.props.clickHandler('Tip');
          } else {
            this.props.clickHandler('home');
           
          }
        }, 1500);
       
        //  console.log(res);
      },
      error => {
        this.refs.Load.CloseLoad();
        errorHandler(error, this.props);
      },
    );
  };

  /**
   * update rating value when chnaged
   */
  sliderValueChange(value) {
    console.log(value, 'value.....');
    this.setState({ value });
    console.log(this.state, "chnage state....")
  }
  /**
     * Get dynamic rating text based on rating value
     */
  getText() {
    if (this.state.value == 0) {
      return 'Horrendous';
    } else if (this.state.value == 1) {
      return 'Good';
    } else {
      return 'Great';
    }
  }
  /**
   * Get dynamic rating button color based on rating value
   */
  getBtnColor() {
    if (this.state.value == 0) {
      return colors.danger;
    } else if (this.state.value == 1) {
      return colors.THEME_YELLOW;
    } else {
      return colors.BLACK_TEXT;
    }
  }
  /**
   * Get dynamic rating image based on rating value
   */
  getImg() {
    if (this.state.value == 0) {
      return frown;
    } else if (this.state.value == 1) {
      return average;
    } else {
      return green_frown;
    }
  }
}


function mapStateToProps(state) {
  //console.log(state, "state")
  return {
    user: state.user.userData,
    ticket_data: state.user
  }
}
export default connect(mapStateToProps, { })(Rating);