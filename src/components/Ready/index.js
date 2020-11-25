//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
// create a component
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';

import * as Animatable from "react-native-animatable";
var { width, height } = Dimensions.get('window');
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };

openDialer = () => { };

class Ready extends Component {
  handleViewRef = ref => this.view = ref;
  componentDidMount() {
    //  console.log(this.props.category_data, "all......")
  }
  navigator = page => {
    switch (page) {
      case 'connect': {
        this.props.parentCallback('connect');
        // console.log('next');
        // this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
        // setTimeout(() => {
        //   this.props.parentCallback('connect');
        // }, 420);

        break;
      }

      case 'back': {
        console.log('next');
        if (this.props.ready_text == 'Connect Me') {
          this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
          setTimeout(() => {
            this.props.parentCallback('back');
          }, 420);

        }

        break;
      }
    }
  };
  render() {
    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={() =>
          this.navigator('back')}
      >
        <View style={styles.container}>

          <Animatable.View animation="fadeInDown"
            ref={this.handleViewRef}
            duration={400} style={styles.inner_container}>
            <Text style={styles.header_text}>Ready?</Text>
            <Text style={styles.description_text}>An expert is standing by to help you now! If you're not completely satisfied with expert, you will be refunded.</Text>
            {/* {this.props.ready_text == 'Connect Me' && (
            <Button style={styles.back_btn} onPress={() => this.navigator('back')}>
              <Text style={styles.back_btn_txt}>Cancel</Text>
            </Button>
          )} */}
            <Button style={styles.end_btn} onPress={() => this.navigator('connect')} >
              <Text style={styles.end_btn_txt} >{this.props.ready_text} (${this.props.category_data.price})</Text>
            </Button>
          </Animatable.View>

        </View>
      </TouchableOpacity>
      // <View style={styles.container}>
      //   <View style={styles.container}>
      //     <Text style={styles.headingTextTitle}>Ready?</Text>
      //     <Text style={styles.headingText}>
      //       An expert is standing by to
      //       {'\n'} help for ${this.props.category_data.price} - if you're not
      //       {'\n'} completely satisfied, you will
      //       {'\n'} be refunded - no hassels.
      //     </Text>
      //   </View>
      //   <View style={styles.btncontainer}>
      //     <Button
      //       block
      //       style={styles.btn_inner}
      //       onPress={() => this.navigator('connect')}>
      //       <Text style={styles.btn_txt}>{this.props.ready_text}</Text>
      //     </Button>
      //   </View>
      // </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20
  },
  inner_container: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    width: "90%",
    alignSelf: 'center',
  },
  header_text: {
    fontSize: 28,
    fontFamily: 'PTSans-Bold',
    // color: colors.BLACK_TEXT,
    paddingBottom: 10
  },
  description_text: {
    fontSize: 18,
    fontFamily: 'PTSans-Regular',
    //  color: colors.GREY_TEXT,
    letterSpacing: 0.8,
    paddingBottom: 15,
    paddingRight: 25,
    paddingLeft: 25,
    alignSelf: 'center',
    textAlign: 'center'
  },
  back_btn: {
    borderWidth: 2,
    borderColor: colors.GREY_TEXT,
    backgroundColor: 'transparent',
    width: "95%",
    justifyContent: 'center',
    margin: 8,
    height: 55
  },
  back_btn_txt: {
    color: colors.GREY_TEXT,
    fontFamily: 'PTSans-Bold',
    fontSize: 18,
  },

  end_btn: {
    zIndex: 2,
    borderWidth: 1,
    borderColor: colors.THEME_YELLOW,
    backgroundColor: colors.THEME_YELLOW,
    width: "95%",
    justifyContent: 'center',
    margin: 8,
    height: 55
  },
  end_btn_txt: {
    color: colors.LIGHT_COLOR,
    fontFamily: 'PTSans-Bold',
    fontSize: 18,
  }

  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },

  // headingText: {
  //   marginBottom: 40,
  //   marginTop: 10,
  //   fontFamily: 'PTSans-Regular',
  //   fontSize: 18,
  //   textAlign: 'center',
  //   letterSpacing: 0.8,
  //   color: colors.LIGHT_COLOR,
  // },
  // headingTextTitle: {
  //   fontFamily: 'PTSans-Bold',
  //   fontSize: 25,
  //   textAlign: 'center',
  //   letterSpacing: 0.8,
  //   color: colors.LIGHT_COLOR,
  // },
  // btncontainer: {
  //   width: width,
  //   paddingRight: 40,
  //   paddingLeft: 40,
  //   marginBottom: 30,
  // },
  // btn_inner: {
  //   backgroundColor: colors.LIGHT_COLOR,
  //   height: 55,
  // },
  // btn_txt: {
  //   color: colors.THEME_YELLOW,
  //   fontFamily: 'PTSans-Regular',
  //   fontSize: 20,
  //   fontWeight: 'bold',
  // },
});

//make this component available to the app
export default Ready;
