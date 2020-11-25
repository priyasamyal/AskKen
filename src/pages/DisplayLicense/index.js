//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
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
// create a component
import {colors} from '../../common/index';
import {Dimensions} from 'react-native';
import commonData from '../../common/data.js';
var {width, height} = Dimensions.get('window');
const hitSlop = {top: 20, left: 20, right: 20, bottom: 20};
import styles from './styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StackActions, NavigationActions} from 'react-navigation';
import {postApiRequest, setItem} from '../../common/user';
import RegisterSuccess from '../../components/RegisterSuccess';
import CameraScreen from '../../components/camera';
import LastStep from '../../components/LastStep';
const upload = require('../../assets/imgs/upload.png');
const file = require('../../assets/imgs/slider1.jpg');
const edit = require('../../assets/imgs/edit.png');
const delete_icon = require('../../assets/imgs/delete.png');

class DisplayLicense extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'props');
    this.state = {
      showModal: 'display',
      currentIndex: '',
      openCamera: false,
      categories: commonData.signUpObj.categories,
    };
    console.log(props.itemName, 'itemnameProp');
  }

  openCamera = index => {
    console.log(index, 'index');
    this.setState({currentIndex: index, openCamera: true});
  };
  handleImage = (action, index) => {
    console.log(action, 'handle image', index);
    switch (action) {
      case 'delete': {
        this.state.categories[index].license_image = null;
        this.setState({categories: this.state.categories}, () => {
          console.log(this.state.categories);
        });
        break;
      }
    }
  };
  setImages = image => {
    console.log(image, 'image');
    this.state.categories[this.state.currentIndex].license_image = image.uri;
    this.setState({openCamera: false, categories: this.state.categories});
  };
  navigator = navigateTo => {
    switch (navigateTo) {
      case 'next': {
        // this.signupApiCall();
        commonData.signUpObj.categories = this.state.categories;
        this.props.navigation.navigate('UploadImage');
        break;
      }
      case 'skip': {
        console.log('finallllll');
        this.setState({openCamera: false});
        break;
      }
      case 'last': {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'HomePage'})],
        });
        this.props.navigation.dispatch(resetAction);
        //this.props.navigation.navigate('HomePage');
        break;
      }
      case 'back': {
        this.setState({openCamera: false});
        break;
      }
      case 'navigationBack': {
        this.props.navigation.goBack();
        break;
      }
    }
  };

  render() {
    if (!this.state.openCamera) {
      return (
        <Container>
          <Header transparent style={styles.header}>
            <Left style={{flex: 1}}>
              <Button
                transparent
                hitSlop={hitSlop}
                onPress={() => this.navigator('navigationBack')}>
                <Icon style={[styles.black_text]} name="arrow-back" />
              </Button>
            </Left>
            <Body style={{flex: 3}}>
              <Title style={styles.pageTitle}>Upload License Pictures</Title>
            </Body>
            <Right />
          </Header>
          <View style={styles.container}>
            {/* <ScrollView> */}
            <View style={{height: height - 170, paddingBottom: 10}}>
              <FlatList
                data={this.state.categories}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => (
                  <View>
                    {!item.license_image && (
                      <View style={[styles.main_container, {paddingTop: 20}]}>
                        <Text style={styles.heading_txt}>
                          {item.category_name}
                        </Text>
                        <Button
                          style={{marginTop: 70, marginBottom: 70}}
                          onPress={() => {
                            this.openCamera(index);
                          }}>
                          <View style={styles.img_container}>
                            <Image
                              style={styles.upload_image}
                              source={upload}
                            />
                          </View>
                        </Button>
                      </View>
                    )}

                    {item.license_image && (
                      <View style={[styles.main_container, {paddingTop: 20}]}>
                        <Text style={styles.heading_txt}>
                          {item.category_name}
                        </Text>
                        <View style={styles.img_container}>
                          <Image
                            style={styles.selected_img}
                            source={{uri: item.license_image}}
                          />
                        </View>
                        <View style={styles.icon_container}>
                          <Button
                            hitSlop={hitSlop}
                            onPress={() => {
                              this.openCamera(index);
                            }}
                            transparent
                            style={{marginRight: 20}}>
                            {/* <Image style={styles.icon_img} source={edit} /> */}
                            <Text
                              style={{
                                color: colors.GREY_TEXT,
                                textDecorationLine: 'underline',
                              }}>
                              Edit
                            </Text>
                          </Button>
                          <Button
                            hitSlop={hitSlop}
                            transparent
                            onPress={() => {
                              this.handleImage('delete', index);
                            }}
                            style={{marginRight: 5}}>
                            {/* <Image
                              style={styles.icon_img}
                              source={delete_icon}
                            /> */}
                            <Text
                              style={{
                                color: colors.GREY_TEXT,
                                textDecorationLine: 'underline',
                              }}>
                              Delete
                            </Text>
                          </Button>
                        </View>
                      </View>
                    )}
                  </View>
                )}
                keyExtractor={item => item.category_name}
              />
            </View>

            {/* <View style={styles.btncontainer}>
              <Button
                block
                onPress={() => this.navigator('next')}
                style={styles.btn_inner}>
                <Text style={styles.btn_txt}>Next</Text>
              </Button>
            </View> */}
            {/* </ScrollView> */}
          </View>
          <View style={styles.btncontainer}>
            <Button
              block
              onPress={() => this.navigator('next')}
              style={styles.btn_inner}>
              <Text style={styles.btn_txt}>Next</Text>
            </Button>
          </View>
        </Container>
      );
    } else {
      return (
        <CameraScreen
          text={'Upload a picture \n of your license'}
          canSkip={true}
          getImageUri={this.setImages}
          skip={this.navigator}
          backButton={this.navigator}></CameraScreen>
      );
    }
  }
}

//make this component available to the app
export default DisplayLicense;
