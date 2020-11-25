//import liraries

/* You have to add `compile 'com.facebook.fresco:animated-gif:1.10.0` under dependencies in your android/app/build.gradle'*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
var { width } = Dimensions.get('window');
import { colors } from '../../common/index';
import { Container, Header, Left, Button, Right, } from 'native-base';
import { connect } from "react-redux";
const bell = require('../../assets/imgs/notify.png');
import { StackActions, NavigationActions } from 'react-navigation';
import {
  postApiRequestWithHeaders,
  errorHandler,
  showToast,
  alertWithTwoBtn,
  alertWithSingleBtn,
  clear_push_interval
} from '../../common/user';
import commonData from '../../common/data.js';
import { setUserData, setAllTickets } from "../../actions";
import Load from 'react-native-loading-gif';
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "I'm ready to get swiped!",
    };
  }

  navigator = (status) => {
    switch (status) {
      case "skip_notification":
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: "HomePage", params: { from: 'login' } })],
        });
        this.props.navigation.dispatch(resetAction);

        break;
      case "notify_me":
        let param = { push_enable: true };
        this.togglePushApi(param);

        break;
      default:
        break;
    }
  }


  togglePushApi = param => {
    console.log(param);
    param.user_id = this.props.user.user_id;
    this.refs.Load.OpenLoad();
    postApiRequestWithHeaders(
      commonData.api_endpoint.update_profile,
      param, this.props.user.access_token
    ).then(
      data => {
        console.log(data, 'fhhsdghfhgshjgsdh');
        if (data.user.user_type != "owner") {
          this.setState({
            all_job: data.all_tickets
          })
          console.log(this.state)
          this.props.setAllTickets(data.all_tickets)
        }
        else {
          this.setState({
            current_ticket: data.user.current_ticket
          })
        }
        this.props.setUserData(data.user);
        setTimeout(() => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "HomePage", params: { from: 'login' } })],
          });
          this.props.navigation.dispatch(resetAction);
        }, 2000);
        
     



      },
      error => {
        // console.log('error....', error);
        this.refs.Load.CloseLoad();
        this.callToastFunction("error", "error")
        // this.setState({ loader: false });
        errorHandler(error, this.props);
      },
    );
  };

  render() {

    return (
      <Container>
        <Load ref="Load"></Load>
        <Header transparent style={styles.header}>
          <Left />
          <Right>
            <Button
              transparent
              onPress={() => this.navigator('skip_notification')}>
              <Text style={styles.headerText}>Skip</Text>
            </Button>

          </Right>
        </Header>
        <View style={styles.mainContainer}>
          <View style={{ flex: 1, alignItems: 'center', }}>
            <Text style={styles.headingText}>Accept Notifications</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', }}>
            <Image style={styles.image} source={bell} />
            {this.props.user.user_type != "expert"&&(
               <Text style={styles.message}>Get notified as soon as{'\n'}Pro sends you a message.</Text>
            )}
            {this.props.user.user_type == "expert"&&(
               <Text style={styles.message}>Get notified as soon as you{'\n'}have a new message or job{'\n'}opportunity</Text>
            )}
           
          </View>
          <View style={{ flex: 0.9, alignItems: 'center', }}>
            <View style={[styles.continueBtnContainer, {}]}>
              <Button style={styles.continueBtn} onPress={() => this.navigator('notify_me')}>
                <Text style={styles.continueBtnTxt}>Yes, Notify Me</Text>
              </Button>
            </View>
          </View>
        </View>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    margin: 5,
    marginBottom: 0,
  },
  headerText: {
    fontFamily: 'AvenirLTStd-Medium',
    color: colors.grey_heading,
    fontSize: 18,
  },
  headingText: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 20,
    textAlign: 'center',
    color: colors.BLACK_TEXT,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',

  },
  message: {
    marginTop: 25,
    fontFamily: 'AvenirLTStd-Medium',
    fontSize: 22,
    textAlign: 'center',
    color: colors.BLACK_TEXT,
  },
  continueBtnContainer: {
    width: width - 40,
    position: 'absolute',
    bottom: 30
  },
  continueBtn: {
    backgroundColor: colors.BLACK_TEXT,
    justifyContent: 'center',
    height: 55,
    borderRadius: 15
  },
  continueBtnTxt: {
    color: colors.card_border,
    fontFamily: 'Avenir-Heavy',
    fontSize: 18,
    // paddingTop: 2
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
});

function mapStateToProps(state) {
  console.log(state, "state in Home")
  return {
    user: state.user.userData,
    signUp_data: state.user,
    all_tickets: state.all_tickets
  }
}
export default connect(mapStateToProps, { setUserData, setAllTickets })(Notification);

