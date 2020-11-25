import React, { Component } from 'react';
import styles from './styles';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import {
  Container,
  Left,
  Header,
  Item,
  Input,
  Icon,
  Button,
  Text,
  Radio,
  Right,
} from 'native-base';
import { black } from 'ansi-colors';
import { colors } from '../../common/index';
import commonData from '../../common/data';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };

class BusinessType extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'props');
    this.state = {
      business_type: this.temp_business_type,
      modalVisible: false,
      searchedText: '',
      selectedType: props.itemName,
      noResutFound: false,
      searchIcon: false,
      value: '',
    };
    console.log(commonData, 'itemnameProp');

    this.temp_business_type = commonData.business_type;
  }

  setModalVisibility = (visibility, selectedType) => {
    console.log('set modal visibility', visibility);
    this.setState({ modalVisible: visibility, selectedType: selectedType });
  };
  hideModal = item => {
    this.props.closeModal(item);
    this.setState({ modalVisible: false });
  };
  clearText = () => {
    console.log('sssssssssssss');
    this.temp_business_type = commonData.business_type;
    this.setState({ value: '', business_type: commonData.business_type });
    this.setState({ noResutFound: false });
    this.setState({ searchIcon: false });
  };
  selectCountry = item => {
    this.setState({ selectedType: item });
    this.hideModal(item);
  };
  onChangeSearchText = text => {
    console.log(this.state.value, 'textttttt');

    text
      ? this.setState({ searchIcon: true })
      : this.setState({ searchIcon: false });
    this.setState({ value: text });
    this.temp_business_type = commonData.business_type;

    // set val to the value of the ev target

    var val = text;
   if (val && val.trim() != '') {
      this.temp_business_type = this.temp_business_type.filter(item => {
        return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
    this.setState({ business_type: this.temp_business_type });
    if (this.temp_business_type.length == 0) {
      this.setState({ noResutFound: true });
    } else {
      this.setState({ noResutFound: false });
    }
  };

  render() {
    const { isVisible, message, textValue, itemName } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        itemName={itemName}
        visible={this.state.modalVisible}
        backdropColor={'white'}
        onRequestClose={() => this.props.closeModal(this.state.selectedType)}
        style={{ margin: 0 }}>
        <Container>
          <Header searchBar transparent rounded>
            <Left style={{ flex: 0.2 }}>
              <Button
                transparent
                hitSlop={hitSlop}
                // style={{ backgroundColor: '#b8b8' }}
                onPress={() => this.hideModal()}>
                <Icon
                  style={[
                    styles.black_text,
                    // {fontSize: Platform.OS === 'ios' ? 35 : 30}
                  ]}
                  name="arrow-back"
                />
              </Button>
            </Left>
            <Item style={styles.search_container}>
              <Icon name="ios-search" />
              <Input
                style={styles.search_txt}
                placeholder="Search"
                value={this.state.value}
                selectionColor={colors.THEME_YELLOW}
                onChangeText={text => this.onChangeSearchText(text)}
              />
              {this.state.searchIcon && (
                <TouchableOpacity onPress={() => this.clearText()}>
                  <Icon name="ios-close-circle" />
                </TouchableOpacity>
              )}
            </Item>
          </Header>

          <View style={styles.mainContainer}>
            {this.state.noResutFound && (
              <View style={{ alignContent: 'center' }}>
                <Text
                  style={{ textAlign: 'center', fontFamily: 'PTSans-Regular' }}>
                  No Result Found
                </Text>
              </View>
            )}
            {!this.state.noResutFound && (
              <View>
                <Text style={styles.headingText}>Select Business Type</Text>
              </View>
            )}

            {!this.state.noResutFound && (
              <View style={{ paddingTop: 20, marginBottom: 100 }}>
                <FlatList
                  data={this.temp_business_type}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={styles.list_container}>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                        }}
                        onPress={() => this.selectCountry(item)}>
                        <Text
                          style={
                          
                            item.id === this.state.selectedType.id
                              ? {
                                color: colors.THEME_YELLOW,
                                fontFamily: 'AvenirLTStd-Medium',
                                paddingTop:5,
                              }
                              : {
                                color: colors.BLACK_TEXT,
                                fontFamily: 'AvenirLTStd-Medium',
                                paddingTop:5,
                              }
                          }>
                          {item.name}
                        </Text>
                        <Right>
                          <Radio
                            color={'#f0ad4e'}
                            selectedColor={colors.THEME_YELLOW}
                            selected={item.id === this.state.selectedType.id}
                          />
                        </Right>
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={item => item.id}
                />
              </View>
            )}
          </View>
        </Container>
      </Modal>
    );
  }
}
export default BusinessType;
