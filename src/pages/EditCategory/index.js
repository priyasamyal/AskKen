import React, { Component } from 'react';
import commonData from '../../common/data.js';
import {
  postApiRequestWithHeaders,
  setItem,
  getItem,
  showToast,
  errorHandler,
} from '../../common/user';
import Load from 'react-native-loading-gif';
import { colors } from '../../common/index';
import MultipleCategory from '../../components/MultipleCategory';
import HeaderComponent from "@custom_components/HeaderComponent";
import { StackActions, NavigationActions } from 'react-navigation';
import styles from './styles';
// import Load from 'react-native-loading-gif';
//import { StackActions, NavigationActions } from 'react-navigation';
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
import { connect } from "react-redux";
import { setUserData, setAllTickets } from "../../actions";
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
const header_logo = require('../../assets/imgs/header_logo.jpg');
class EditCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: '',
      selectedSkill: '',
      userName: '',
      showSkill: false,
      showNext: false,
      userName: commonData.signUpObj.name,
      filter_category: [],
      codeFetched: false,
      skill_text: ''
    };
    this.checkBoxes = React.createRef();

    
  }
  componentDidMount() {
    commonData.categories.map(m => {
      return m.isSelected = false
    })
    commonData.categories.map(m => {
      this.props.user.categories.map(m1 => {
        if (m.category_id == m1.category_id) {
          console.log('match');
          m.isSelected = true;
        }
      });
    });

    console.log(commonData.categories,"kkllll");  
    this.setState({ codeFetched: true });
   
  }

  navigator = (page, data) => {
    console.log(page, data, 'values from child');

    switch (page) {
      case 'nextPage': {

        
        this.updateCategories(data);
      
        break;
      }
      case 'back': {
        this.props.navigation.goBack();
        break;
      }
    }
  };
 
  updateCategories = data => {
    console.log(this.state.categories, 'this.state.categories');
    //this.setState({ loader: true });
    this.refs.Load.OpenLoad();
    let images = [];
    const param = {
      user_id: this.props.user.user_id,
      categories: data,
    };
    console.log(param);
    postApiRequestWithHeaders(
      commonData.api_endpoint.update_profile,
      param,this.props.user.access_token
    ).then(
      res => {
        console.log(res, "user_detail");
        res.loggedInStatus = true;
        if (res.user.user_type != "owner") {
          this.setState({
            all_job: res.all_tickets
          })
          console.log(this.state)
          this.props.setAllTickets(res.all_tickets)
        } else {
          this.setState({
            current_ticket: res.user.current_ticket,
            push_enable:res.user.push_enable
          })
        }
        this.props.setUserData(res.user);
        this.refs.Load.CloseLoad();
       // this.props.navigation.goBack();
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: "HomePage", params: { from: 'edit' } })],
        });
        this.props.navigation.dispatch(resetAction);
      },
      error => {
        this.refs.Load.CloseLoad();
        errorHandler(error, this.props);
      },

    );
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
        <Load ref="Load" Image={0}></Load>
        <HeaderComponent clickHandler={() => this.navigator('back')} />
        <View style={styles.mainContainer}>
          <View style={[styles.mainContent, {justifyContent: 'space-between'}]}>
          <View style={{}}>
            {!this.state.showSkill && (
              <Text style={styles.headingText}>
                Edit the categories that {'\n'}you are an expert in.
              </Text>
            )}
            </View>
            {this.state.codeFetched && (
              <MultipleCategory
              is_edit={true}
                ref={this.checkBoxes}
                clickHandler={this.navigator}
                showNext={
                 true
                }
                selectedCategory={this.props.user.categories}
               ></MultipleCategory>
            )}
          </View>
        </View>
      </Container>
    );
  }
}


function mapStateToProps(state) {
  console.log(state, "state in Edit Category")
  return {
    user: state.user.userData,
    signUp_data: state.user,
    all_tickets: state.all_tickets
  }
}
export default connect(mapStateToProps, { setUserData, setAllTickets })(EditCategory);

