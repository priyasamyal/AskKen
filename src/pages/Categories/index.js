import React, { Component } from 'react';
import commonData from '../../common/data.js';
import { showToast } from '../../common/user';
import MultipleCategory from '../../components/MultipleCategory';
import styles from './styles';
import { StackActions, NavigationActions } from 'react-navigation';
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

const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { connect } from "react-redux";
import { setCategory } from "../../actions";
import HeaderComponent from "@custom_components/HeaderComponent";
class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: '',
      selectedSkill: '',
      userName: '',
      showSkill: false,
      showNext: false,
      userName: commonData.signUpObj.name,
      skill_text: ''
    };
    this.checkBoxes = React.createRef();
  }

  navigator = (page, data) => {
    // console.log(page, data, 'values from child');

    switch (page) {
      
      case 'nextPage': {
        console.log(data, "categories")
        // commonData.signUpObj.categories = data;
        this.props.setCategory(data);
        this.props.navigation.navigate('EnterName',{type:'add'});
        break;
      }
      case 'back': {
        this.checkBoxes.current.navigator('back');
        this.props.navigation.goBack();
        this.setState({ showSkill: false, selectedCategory: '' })

        break;
      }
    }
  };
  handleCheckBox = (selected, index, checkbox) => {
    if (checkbox == 'category') {
      this.setState({ selectedCategory: selected, showNext: true });
    } else {
      this.setState({ selectedSkill: selected, showNext: true });
    }
  };

  render() {
    return (
      <Container>
        <HeaderComponent clickHandler={() => this.navigator('back')}/>

        <View style={styles.mainContainer}>
          <View style={[styles.mainContent, { justifyContent: 'space-between' }]}>
            <View style={{}}>
              <Text style={styles.heading}>
                {' '}
                Your Pro status
              </Text>
              <Text style={styles.headingText}>
                {' '}
                Select the areas that you are{'\n'}an expert in. This is how we'll{'\n'}determine which customers {'\n'} to send your way.
              </Text>
            </View>


            <MultipleCategory
              is_edit={false}
              ref={this.checkBoxes}
              clickHandler={this.navigator}
              showNext={false}
              selectedCategory={[]}></MultipleCategory>


          </View>
        </View>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  console.log(state, "state")
  return {
    user: state.user
  }
}
export default connect(mapStateToProps, { setCategory })(Categories);