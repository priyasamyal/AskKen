//import liraries
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
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
import { Dimensions } from 'react-native';
import { colors } from '../../common/index';

// create a component
var { width, height } = Dimensions.get('window');

const Sound = require('react-native-sound');

const success = require('../../assets/imgs/check_success.png');
import * as Animatable from 'react-native-animatable';

const hello = new Sound('https://www.askkenapp.com/api/sucess.mp3', null, error => {
  if (error) {
    console.log(error);
  }
});
class RegisterSuccess extends Component {
  animationHandler = ref => (this.view = ref);
  constructor(props) {
    super(props);
    console.log(props, 'props');
    setTimeout(() => {
      hello.play(success => {
        this.view.zoomOut().then(endState => {
          if (endState.finished) console.log(endState, 'endsate');
          //  this.props.onDone('final');
          this.props.onDone('last');
        });

        console.log('aaaaaa');
        if (!success) {
          console.log('Sound did not play');
        }
      });
    }, 200);

    // setTimeout(() => {
    //   //   // this.props.onDone('final');
    //   hello.play(success => {
    //     // this.props.onDone('final');
    //     if (!success) {
    //       console.log('Sound did not play');
    //     }
    //   });
    // }, 5000);
  }
  componentDidMount() {

  }

  // navigator = () => {

  // };
  render() {
    return (
      <Container>
        <Animatable.View
          animation={'zoomIn'}
          duration={1000}
          ref={this.animationHandler}
          style={styles.container}>
          <View style={styles.container}>
            <Image style={styles.image} source={success} />
          </View>
        </Animatable.View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    alignItems: 'center',
  },
  btncontainer: {
    width: width,
    paddingRight: 40,
    paddingLeft: 40,
    marginBottom: 30,
  },
  btn_inner: {
    backgroundColor: colors.THEME_YELLOW,
    height: 55,
  },
  btn_txt: {
    color: colors.LIGHT_COLOR,
    fontFamily: 'PTSans-Regular',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

//make this component available to the app
export default RegisterSuccess;
