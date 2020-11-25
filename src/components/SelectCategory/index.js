import React, { Component } from 'react';

import {
  View,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Linking,
  Platform,
  Text,
  TextInput,
  Modal,
  FlatList,
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
var { width, height } = Dimensions.get('window');
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import commonData from '../../common/data.js';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import * as Animatable from 'react-native-animatable';

class SelectCategory extends Component {
  constructor(props) {
    //  console.log(commonData.categories, 'categories');
    super(props);

    this.state = {
      disabled: true,
      categories: commonData.categories,
      expertSelected: false,
      ownerSelected: false,
      selectedCheckbox: '',
      selectedCategory: '',
      selectedSkill: '',
      userName: '',
      showSkill: false,
      showNext: false,
    };
  }

  navigator = page => {
    switch (page) {
      case 'next': {
        //  console.log('next');
        //  console.log(this.state.selectedCategory, 'selected skill');
        if (!this.state.selectedSkill) {
          this.props.clickHandler('showSkill', this.state.selectedCategory);
          this.setState({ showSkill: true });
          !this.state.selectedCategory.skills.find(o => o.isSelected == true)
            ? this.setState({ showNext: false })
            : this.setState({ showNext: true });
        } else {
          this.props.clickHandler('nextPage', this.state.selectedCategory);
        }
        break;
      }
      case 'back': {
        //  console.log('back...... op');
        this.setState({ showSkill: false, selectedSkill: '', showNext: true });
        break;
      }
      case "reset": {
        //  console.log("rest");
        this.setState({ showSkill: false, selectedCategory: '', showNext: false });
      }
    }
  };
  handleCheckBox = (selected, index, checkbox) => {
    //  console.log(selected, index, checkbox)
    if (checkbox == 'category') {
      selected.skills.map(item => {
        item.isSelected = false;
        //   console.log(item, 'item in skills loops');
      });

      if (this.state.selectedCategory != "") {
        if (this.state.selectedCategory.category_id == selected.category_id) {
          this.setState({ selectedCategory: "", showNext: false });
        } else {
          this.setState({ selectedCategory: selected, showNext: true });
        }
      } else {
        this.setState({ selectedCategory: selected, showNext: true });
      }

      // this.setState({ selectedCategory: selected, showNext: true });
    } else {
      this.state.selectedCategory.skills[index].isSelected = !this.state
        .selectedCategory.skills[index].isSelected;
      !this.state.selectedCategory.skills.find(o => o.isSelected == true)
        ? this.setState({ showNext: false })
        : this.setState({ showNext: true });
      // if (!this.state.selectedCategory.skills.find(o => o.isSelected == true)) {
      //   this.setState({showNext: false});
      // } else {
      //   this.setState({showNext: true});
      // }

      this.setState({
        selectedSkill: selected,
        selectedCategory: this.state.selectedCategory,
      });
    }
  };

  render() {
    return (
      <Container >
        <View style={[styles.mainContainer,]}>
          <View
            style={{
              paddingBottom: 0,
              alignSelf: 'center',
            }}>
            <View style={{
              // backgroundColor: 'red',
              // flex: 1,
              // height: "50%"
            }}>
              {!this.state.showSkill && (
                <FlatList
                  data={this.state.categories}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() =>
                        this.handleCheckBox(item, index, 'category')
                      }>
                      <View onPress={() =>
                        this.handleCheckBox(item, index, 'category')
                      } style={{ flex: 1, width: width, alignItems: 'center' }}>

                        <Animatable.View
                          duration={500}
                          animation={
                            this.state.selectedCategory == item ? 'bounceIn' : ''
                          }
                          ref={ref => (this.AnimationRef = ref)}
                          style={[
                            styles.numberInputContainer,
                            // {
                            //   borderColor: colors.BLACK_TEXT,
                            // },
                            this.state.selectedCategory == item
                              ? {
                                borderColor: colors.BLACK_TEXT,
                              }
                              : {
                                borderColor: colors.BORDER_COLOR,
                              },
                          ]}>
                          <CheckBox
                            checked={item == this.state.selectedCategory}
                            color={colors.THEME_YELLOW}
                            style={styles.check_style}
                            onPress={() =>
                              this.handleCheckBox(item, index, 'category')
                            }
                          />
                          <Body style={{ alignItems: 'flex-start' }}>
                            <Text
                              style={[
                                styles.body_style,
                                this.state.selectedCategory == item
                                  ? {
                                    fontWeight: '500',
                                  }
                                  : {
                                    fontWeight: '100',
                                  },
                              ]}>
                              {item.category_name}
                            </Text>
                          </Body>
                        </Animatable.View>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.category_name}
                />
              )}
            </View>

            {this.state.showSkill && (
              <FlatList
                data={this.state.selectedCategory.skills}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.handleCheckBox(item, index, 'skill')}>
                    <View onPress={() =>
                      this.handleCheckBox(item, index, 'category')
                    } style={{ flex: 1, width: width, alignItems: 'center' }}>
                      <Animatable.View
                        duration={500}
                        animation={item.isSelected ? 'bounceIn' : ''}
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
                        <CheckBox
                          checked={item.isSelected}
                          color={colors.THEME_YELLOW}
                          style={styles.check_style}
                          onPress={() =>
                            this.handleCheckBox(item, index, 'skill')
                          }
                        />
                        <Body style={{ alignItems: 'flex-start' }}>
                          <Text
                            style={[
                              styles.body_style,
                              item.isSelected
                                ? {
                                  fontWeight: '500',
                                }
                                : {
                                  fontWeight: '100',
                                },
                            ]}>
                            {item.skill_name}
                          </Text>
                        </Body>
                      </Animatable.View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.skill_name}
              />
            )}
          </View>
        </View>
        {this.state.showNext && (
          <View style={styles.btncontainer}>
            <Button
              block
              onPress={() => this.navigator('next')}
              style={styles.btn_inner}>
              <Text style={styles.btn_txt}>Next</Text>
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
    paddingLeft: 30,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'flex-start',
    //paddingBottom: 20,
    //paddingLeft: 0
  },
  mainContent: {
    flex: 1,

    //  alignItems: 'center',
    // marginTop: 10,
    height: Dimensions.get('window').height,
  },
  headingText: {
    // margin: 40,
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
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginTop: 30,
    width: width - 50,
    justifyContent: 'flex-end',
    //width: "70%",
    padding: 15,
  },
  body_style: {
    paddingLeft: 25,
    paddingBottom: 2,
    fontFamily: 'PTSans-Regular',
    fontSize: 20,
  },
  check_style: {
    paddingTop: 0,
    paddingLeft: 4,

    fontWeight: 'bold',
    marginTop: 4,
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
    paddingTop: 30,
    paddingLeft: 30,
    marginBottom: 10,
    borderTopColor: colors.BORDER_COLOR,
    borderTopWidth: 1,
    alignItems: 'center',
    //backgroundColor: 'red'
    // borderColor: colors.BORDER_COLOR,
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
export default SelectCategory;
