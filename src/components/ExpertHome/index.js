//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
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
import { colors } from '../../common/index';
import commonData from '../../common/data.js';

// create a component

class ExpertHome extends Component {
  constructor(props) {
    super(props);
    //  console.log('profile dfsdfsdfdsd');
    this.state = {
      user_rating: commonData.user_details.user_rating,
      user_earning: commonData.user_details.earnings,
    };
    // console.log('Expert constprofile imaeg');
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }
  updateEarning = () => {
    // console.log('updating... earning', commonData.user_details.user_rating);
    this.setState({
      user_rating: commonData.user_details.user_rating,
      user_earning: commonData.user_details.earnings
    });
  }
  navigator = page => {
    //console.log(page, "pp...")
    switch (page) {
      case 'help': {
        this.props.expertNavigator('help');
        break;
      }
      case 'invite': {
        this.props.expertNavigator('invite');
        break;
      }
      case 'rating':
        this.props.expertNavigator('rating');
        break;
      case 'earning':
        this.props.expertNavigator('earning');
        break;
    }
  };

  render() {
    return (
      <Container>
        {/* <ScrollView> */}
        <View style={styles.container}>
          <Image
            style={[styles.profile_image, { marginLeft: 30 }]}
            source={{
              uri:
                commonData.profile_picture_url +
                commonData.user_details.profile_image,
            }}
          />
          <Text style={[styles.user_name, { paddingLeft: 30 }]}>
            Hi {commonData.user_details.name}!
          </Text>
          <Text style={[styles.description, { paddingLeft: 30 }]}>
            Thanks for being an important part of the Ask Ken expert community!
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 40, paddingLeft: 30 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                this.navigator('earning')}
            >
              <View style={{ marginRight: 30 }}>
                <Text style={styles.earning}>Earnings</Text>

                <View
                  style={{
                    borderBottomColor: colors.THEME_YELLOW,
                    borderBottomWidth: 3,
                    width: '100%',
                  }}>
                  <Text ellipsizeMode='tail' numberOfLines={1}
                    style={[styles.value, {}]}>

                    $ {this.state.user_earning}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                this.navigator('rating')}
            >
              <View>
                <Text style={styles.earning}>Rating</Text>
                <View
                  style={{
                    borderBottomColor: colors.THEME_YELLOW,
                    borderBottomWidth: 3,
                  }}>

                  <Text style={styles.value}>
                    {(() => {
                      if (this.state.user_rating == null) {
                        return "You've haven't been rated";
                      } else {
                        return this.state.user_rating + ' out of 5';
                      }
                    })()}
                  </Text>

                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.btncontainer}>
            <Button
              transparent
              block
              onPress={() => this.navigator('invite')}
              style={styles.btn_inner}>
              <Text style={styles.btn_txt}>Invite Friends</Text>
            </Button>
            <Button
              transparent
              block
              onPress={() => this.navigator('help')}
              style={styles.btn_inner}>
              <Text style={styles.btn_txt}>Help</Text>
            </Button>
          </View>
        </View>
        {/* </ScrollView> */}
      </Container>
    );
  }
}
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingRight: 50,
    //  paddingLeft: 20,
    height: height,
    width: width,
  },
  profile_image: {
    height: 130,
    width: 120,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 10,
    borderWidth: 1,
    backgroundColor: colors.GRAY_BACKGROUND,
    borderColor: colors.GRAY_BACKGROUND,
    //resizeMode: 'contain'
  },
  user_name: {
    fontSize: 27,
    fontFamily: 'PTSans-Regular',
    fontWeight: 'bold',
    letterSpacing: 0.8,
    marginBottom: 25,
  },
  description: {
    fontFamily: 'PTSans-Bold',
    fontSize: 15,
    letterSpacing: 0.5,
    // fontWeight: '300',
  },
  earning: {
    color: colors.rating_heading,
    fontSize: 16,
    fontFamily: 'PTSans-Bold',
    letterSpacing: 1,
    marginBottom: 5,
    //fontWeight: 'bold',
  },
  value: {
    fontFamily: 'PTSans-Bold',
    fontSize: 18,
    //  fontWeight: 'bold',
    // textDecorationLine: 'underline',
  },
  btncontainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    //position: 'absolute',
    //alignSelf: 'flex-end',
    width: width,
    paddingRight: 40,
    paddingLeft: 40,
    //   marginBottom: 10,
  },
  btn_inner: {
    //  backgroundColor: 'transparent'
    height: 55,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  btn_txt: {
    color: colors.BLACK_TEXT,
    fontFamily: 'PTSans-Regular',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

//make this component available to the app
export default ExpertHome;
