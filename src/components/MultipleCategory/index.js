import React, { Component } from 'react';

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
  FlatList,
  SectionList,
} from 'react-native';
import {
  Radio,
  Container,
  Header,
  Content,
  Left,
  Button,
  Body,
  Right,
  Icon,
  Title,
  ListItem,
  CheckBox,
} from 'native-base';

import { colors } from '../../common/index';
import { StyleSheet } from 'react-native';

import { Dimensions } from 'react-native';
import { showToast } from '../../common/user';
var { width, height } = Dimensions.get('window');
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import commonData from '../../common/data.js';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
const hitSlop1 = { top: 20, left: 20, right: 120, bottom: 20 };
import * as Animatable from 'react-native-animatable';

class MultipleCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: commonData.categories,
      selectedCategory: this.props.selectedCategory,
      selectedCategoryReplica: '',
      selectedSkill: '',
      userName: '',
      showSkill: false,
      showNext: this.props.showNext,
    };
  }

  componentDidMount() {

    this.setState({
      categories: commonData.categories,
      selectedCategory: this.props.selectedCategory
    })
  }

  navigator = page => {
    switch (page) {
      case 'next': {
       // console.log(this.state.selectedCategory, "this.state.selectedCategory")
        this.props.clickHandler('nextPage', this.state.selectedCategory);
        break;
      }
      case 'back': {
        this.setState({ showSkill: false, selectedSkill: '', showNext: true });
        break;
      }
    }
  };
  handleCheckBox = (selected, index, checkbox) => {
   // console.log("handleCheckBox")
    if (this.props.type != undefined) {
      this.state.categories.map((m, ind) => {
        if (ind != index) {
          return m.isSelected = false;
        } else {
          //this.setState({ selectedCategory: [] });
        }
      })
    }
    this.state.categories[index].isSelected = !this.state.categories[index]
      .isSelected;
    if (this.state.categories[index].isSelected == true) {
      var joined = this.state.selectedCategory.concat(selected);
      this.setState({ selectedCategory: joined }, () => {
        this.state.selectedCategory.length > 0
          ? this.setState({ showNext: true })
          : this.setState({ showNext: false });
      });

    } else {
      console.log("kkk");
      if (this.props.type != undefined) {
        this.setState({ selectedCategory: [], showNext: false });
      } else {
        let index = this.state.selectedCategory.findIndex(
          x => x.category_id == selected.category_id,
        );
        console.log(index, 'index');
        if (index > -1) {
          this.state.selectedCategory.splice(index, 1);
          this.setState(
            {
              selectedCategory: this.state.selectedCategory,
            },
            () => {
              this.state.selectedCategory.length > 0
                ? this.setState({ showNext: true })
                : this.setState({ showNext: false });
            },
          );

        }
      }
    }

    if (this.props.type != undefined) {
      this.state.selectedCategory = [selected]
      this.setState({ selectedCategory: this.state.selectedCategory });
    }
  };

  //**** Handle check box of skill  *****/

  handleSkillCheckbox = (selected, index, innerIndex) => {

    this.state.selectedCategory[index].skills[innerIndex].isSelected = !this
      .state.selectedCategory[index].skills[innerIndex].isSelected;

    this.setState(
      {
        selectedCategory: this.state.selectedCategory,
      },
      () => {
        this.createJson();

      },
    );
  };

  createJson = () => {
    const a = JSON.parse(JSON.stringify(this.state.selectedCategory));
    a.map(item => {
      if (item.skills.length > 0) {
        item.skills = item.skills.filter(x => x.isSelected);
      }
    });
    this.setState({ selectedSkill: a });
    var index = a.find(element => element.skills.length == 0);
    index ? this.setState({ showNext: false }) : this.setState({ showNext: true });
  };



  toggleDropdown = (item, index) => {
    console.log(item, index, 'jj..');
    this.state.selectedCategory[index].is_toggle = !this.state.selectedCategory[
      index
    ].is_toggle;

    this.setState({ selectedCategory: this.state.selectedCategory });
    //this.setState({selectedCategory[index].is_toggle })
    //   console.log("Before convert..",this.state.selectedCategory[index], "hhe");
    // this.setState({)
  };
  render() {
    return (
      <Container>
        <View style={styles.mainContainer}>
          <View
            style={{
              flex: 1,
              paddingBottom: 20,
              alignItems: 'center',
            }}>
            <FlatList
              data={this.state.categories}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    this.handleCheckBox(item, index, 'category')
                  }>
                  <View style={{ flex: 1, width: width, alignItems: 'center', justifyContent: 'center' }}>
                    <Animatable.View
                      animation={item.isSelected ? 'bounceIn' : ''}
                      duration={500}
                      ref={ref => (this.AnimationRef = ref)}
                      style={[
                        styles.numberInputContainer,
                        item.isSelected
                          ? {
                            borderColor: colors.BLACK_TEXT,
                          }
                          : {
                            borderColor: colors.BORDER_COLOR,
                          },
                      ]}>

                      <Body style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text
                          style={[
                            styles.body_style,

                          ]}>
                          {item.category_name}
                        </Text>
                        {item.isSelected && (
                          <CheckBox
                            checked={item.isSelected}
                            color={colors.BLACK_TEXT}
                            style={styles.check_style}
                            onPress={() =>
                              this.handleCheckBox(item, index, 'category')
                            }
                          />
                        )}

                      </Body>
                    </Animatable.View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.category_name}
            />


          </View>
        </View>
        {this.state.showNext && (
          <View style={styles.btncontainer}>
            <Button
              block
              onPress={() => this.navigator('next')}
              style={styles.btn_inner}>
              <Text style={styles.btn_txt}>{this.props.is_edit ? "Save Changes": "Next" }</Text>
            </Button>
          </View>
        )}
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    margin: 5,
  },
  pageTitle: {
    fontFamily: 'PTSans-Bold',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 10,
    //paddingLeft: 30,
  },
  mainContainer: {
    flex: 1,
    //paddingBottom: 20,
  },
  mainContent: {
    flex: 1,
    height: Dimensions.get('window').height,
  },
  headingText: {
    margin: 40,
    marginBottom: 20,
    fontFamily: 'PTSans-Bold',
    fontSize: 27,
    textAlign: 'left',
  },
  headingTextSkill: {
    margin: 40,
    fontFamily: 'PTSans-Bold',
    fontSize: 20,
    textAlign: 'left',
  },
  numberInputContainer: {
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginTop: 20,
    width: width - 80,
    //width: "70%",
    padding: 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  body_style: {
    //  paddingLeft: 25,
    //paddingBottom: 2,
    // fontFamily: 'PTSans-Bold',
    fontFamily: 'Avenir-Heavy',
    //fontFamily: 'AvenirLT-Black',
    // fontFamily: 'AvenirLTStd-Medium',
    fontSize: 16,
    letterSpacing: 0.7,
    color: colors.BLACK_TEXT
  },
  check_style: {
    paddingTop: 0,
    paddingLeft: 3,

    fontWeight: 'bold',
    marginTop: 0,
  },
  nextButtonContainer: {
    justifyContent: 'flex-end',
    width: '100%',
    alignSelf: 'flex-end',
    paddingTop: 10,
    paddingRight: 25,
    position: 'absolute',
    bottom: '10%',
    //backgroundColor: 'red'
  },
  nextButton: {
    color: colors.THEME_YELLOW,
    fontFamily: 'PTSans-Regular',
    fontSize: 22,
    fontWeight: 'bold',
    opacity: 0.4,
  },
  black_text: {
    color: colors.BLACK_TEXT,
    paddingLeft: 10,
  },
  btncontainer: {
    width: width,
    paddingRight: 30,
    paddingTop: 20,
    paddingLeft: 30,
    marginBottom: 30,

  },
  btn_inner: {
    backgroundColor: colors.BLACK_TEXT,
    height: 55,
    borderRadius: 15
  },
  btn_txt: {
    color: colors.LIGHT_COLOR,
    fontFamily: 'Avenir-Heavy',
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    fontFamily: 'PTSans-Bold',
    fontSize: 20,
    letterSpacing: 0.8,
    // marginBottom: 20,
  },
});
export default MultipleCategory;
