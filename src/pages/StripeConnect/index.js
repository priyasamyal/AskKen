import React, {Component} from 'react';
import styles from './styles';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  Text,
  TextInput,
  Modal,
} from 'react-native';
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

import {KeyboardAvoidingView, Keyboard} from 'react-native';
import Load from 'react-native-loading-gif';
import {
  openUrl,
  postApiRequestWithHeaders,
  setItem,
  getItem,
  showToast,
  errorHandler,
} from '../../common/user';
import commonData from '../../common/data.js';
import {colors} from '../../common/index';
import {Dimensions} from 'react-native';

var {width, height} = Dimensions.get('window');
const hitSlop = {top: 20, left: 20, right: 20, bottom: 20};

class StripeConnect extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.navigation.state.params.stripe_status, 'aaa');
    this.state = {
      is_created: this.props.navigation.state.params.stripe_status
        .account_created,
      charges: this.props.navigation.state.params.stripe_status.charge_enabled,
      details: this.props.navigation.state.params.stripe_status
        .details_submited,
      transfer: this.props.navigation.state.params.stripe_status
        .transfer_enabled,
      // loader: false,
    };
  }
  componentDidMount() {
    this.getStatusApiCall();
  }

  navigator(page) {
    switch (page) {
      case 'setupStripe': {
        console.log(
          commonData.stripe_connected_url + commonData.user_details.user_id,
          'stripe connected account url',
        );
        this.props.navigation.goBack();
        openUrl(
          commonData.stripe_connected_url + commonData.user_details.user_id,
        );
        // Linking.openURL(
        //   commonData.stripe_connected_url + commonData.user_details.user_id,
        // ).catch(err => console.error('An error occurred', err));

        break;
      }
      case 'back': {
        console.log('back');
        this.props.navigation.goBack();
        break;
      }
    }
  }
  getStatusApiCall = () => {
    this.setState({loader: true});
    const param = {
      user_id: commonData.user_details.user_id,
    };
    console.log(param, 'param');
    postApiRequestWithHeaders(commonData.api_endpoint.get_status, param,this.props.user.access_token).then(
      res => {
        console.log(res);
        this.setState({
          is_created: res.account_created,
          charges: res.charge_enabled,
          details: res.details_submited,
          transfer: res.transfer_enabled,
          loader: false,
        });
      },
      error => {
        this.setState({loader: false});
        errorHandler(error, this.props);
      },
    );
  };

  render() {
    return (
      <Container
        style={{
          // backgroundColor: colors.THEME_YELLOW
          backgroundColor: !this.state.is_created
            ? colors.THEME_YELLOW
            : 'transparent',
        }}>
        <Load ref="Load" Image={0}></Load>
        <Header transparent style={styles.header}>
          <Left style={{flex: 1}}>
            <Button
              transparent
              hitSlop={hitSlop}
              onPress={() => this.navigator('back')}>
              <Icon
                style={[
                  styles.black_text,
                  {
                    color: !this.state.is_created
                      ? colors.LIGHT_COLOR
                      : colors.black_text,
                  },
                ]}
                name="arrow-back"
              />
            </Button>
          </Left>
          <Body style={{flex: 3}}>
            <Title
              style={[
                styles.pageTitle,
                {
                  color: !this.state.is_created
                    ? colors.LIGHT_COLOR
                    : colors.black_text,
                },
              ]}>
              Payout Info
            </Title>
          </Body>
          <Right />
        </Header>
        <View style={{flex: 1, margin: 10}}>
          {!this.state.is_created && (
            <View
              style={[
                styles.container,
                {
                  justifyContent: 'center',
                },
              ]}>
              <View
                style={[
                  styles.container,
                  {
                    justifyContent: 'center',
                  },
                ]}>
                <Text
                  style={[
                    styles.headingTextTitle,
                    {
                      color: this.state.is_created
                        ? 'black'
                        : colors.LIGHT_COLOR,
                    },
                  ]}>
                  Setup Your Stripe Account to Receive Owners Payments
                </Text>
                <Text style={styles.headingText}>
                  If you already have as Stripe account, click on the{' '}
                  <Text style={{fontWeight: 'bold'}}>
                    "Setup My Account Now"
                  </Text>{' '}
                  button, and then click on{' '}
                  <Text style={{fontWeight: 'bold'}}>"Sign In"</Text> in the{' '}
                  <Text style={{fontWeight: 'bold'}}>
                    UPPER RIGHT HAND CORNER
                  </Text>{' '}
                  of the page.
                </Text>
              </View>
              <View style={styles.btncontainer}>
                <Button
                  block
                  style={styles.btn_inner}
                  onPress={() => this.navigator('setupStripe')}>
                  <Text style={styles.btn_txt}> Setup My Account Now</Text>
                </Button>
              </View>
            </View>
          )}

          {this.state.is_created && (
            <View
              style={[
                styles.container,
                {
                  //  justifyContent: 'center',
                },
              ]}>
              <View
                style={[
                  styles.container,
                  {
                    //  justifyContent: 'center',
                  },
                ]}>
                <Text
                  style={[
                    styles.headingTextTitle,
                    {
                      marginBottom: 30,
                      color: this.state.is_created
                        ? 'black'
                        : colors.LIGHT_COLOR,
                    },
                  ]}>
                  Your Stripe Account Status
                </Text>
                <Text style={styles.list_text}>
                  Transfer Enabled :{' '}
                  <Text
                    style={[
                      styles.list_text,
                      {color: this.state.transfer ? 'green' : 'red'},
                    ]}>
                    {this.state.transfer ? 'Enabled' : 'Disabled'}
                  </Text>
                </Text>
                <Text style={styles.list_text}>
                  Charges Enabled :{' '}
                  <Text
                    style={[
                      styles.list_text,
                      {color: this.state.charges ? 'green' : 'red'},
                    ]}>
                    {this.state.charges ? 'Enabled' : 'Disabled'}
                  </Text>
                </Text>

                <Text style={styles.list_text}>
                  Details Submitted :{' '}
                  <Text
                    style={[
                      styles.list_text,
                      {color: this.state.details ? 'green' : 'red'},
                    ]}>
                    {this.state.details ? 'Enabled' : 'Disabled'}
                  </Text>
                </Text>
              </View>
              {/* <View style={styles.btncontainer}>
                <Button
                  block
                  style={[
                    styles.btn_inner,
                    {backgroundColor: colors.THEME_YELLOW},
                  ]}
                  onPress={() => this.navigator('setupStripe')}>
                  <Text style={[styles.btn_txt, {color: colors.LIGHT_COLOR}]}>
                    {' '}
                    Edit Account
                  </Text>
                </Button>
              </View> */}
            </View>
            // <View style={[styles.container]}>
            //   <View style={[styles.container]}>
            //     <Text
            //       style={[
            //         styles.headingTextTitle,
            //         {
            //           color: this.state.is_created
            //             ? 'black'
            //             : colors.LIGHT_COLOR,
            //         },
            //       ]}>
            //       Account Status
            //     </Text>
            //   </View>
            //   <View style={[styles.container, { paddingBottom: 150 }]}>
            //     <Text style={styles.list_text}>
            //       Transfer Enabled :{' '}
            //       <Text
            //         style={[
            //           styles.list_text,
            //           { color: this.state.transfer ? 'green' : 'red' },
            //         ]}>
            //         Good
            //       </Text>
            //     </Text>
            //     <Text style={styles.list_text}>
            //       Charges Enabled :{' '}
            //       <Text
            //         style={[
            //           styles.list_text,
            //           { color: this.state.charges ? 'green' : 'red' },
            //         ]}>
            //         Good
            //       </Text>
            //     </Text>
            //     <Text style={styles.list_text}>
            //       Details Submitted :{' '}
            //       <Text
            //         style={[
            //           styles.list_text,
            //           { color: this.state.details ? 'green' : 'red' },
            //         ]}>
            //         Good
            //       </Text>
            //     </Text>
            //   </View>
            // </View>
          )}
        </View>
      </Container>
    );
  }
}
export default StripeConnect;
