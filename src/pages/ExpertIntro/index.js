import React, {Component} from 'react';
import styles from './styles';

import {View, Image, Text} from 'react-native';
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Title,
} from 'native-base';

import AppIntroSlider from 'react-native-app-intro-slider';

import {colors} from '../../common';
import {StackActions, NavigationActions} from 'react-navigation';

const slides = [
  {
    key: 'first',
    title: 'The basics',
    text:
      'Ask Ken matches homeowners \n that have questions with relevant \n experts who have answers — so \n plumbers get plumbing questions \n and electricians get electric \n questions.',
    image: require('../../assets/imgs/tutorial1.png'),
  },
  {
    key: 'second',
    title: 'Accepting call \n requests',
    text:
      'Within 24 hours, you’ll begin \n receiving call requests in your \n area of expertise — your phone \n will sound and show how much \n you’l learn by answering, then \n just swipe to accept.',
    image: require('../../assets/imgs/tutorial2.png'),
  },
  {
    key: 'third',
    title: 'Respond quickly',
    text:
      "If you're accepting the call, do \n it quickly, as other experts are \n getting notified at the same \n time — the first to answer gets \n the job.",
    image: require('../../assets/imgs/tutorial3.png'),
  },
  {
    key: 'fourth',
    title: 'Take calls on \n your schedule',
    text:
      "Answer calls whenever you \n want, and make as much \n money as you want — it's \n always up to you.",
    image: require('../../assets/imgs/tutorial4.png'),
  },
  {
    key: 'fifth',
    title: 'Get paid everyday',
    text:
      'At the end of each day, all \n of your earnings automatically \n transfer to your bank account.',
    image: require('../../assets/imgs/tutorial5.png'),
  },
];

class ExpertIntro extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'in introduction');
    this.state = {switch1Value: false};
  }
  _onDone = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'HomePage'})],
    });
    this.props.navigation.dispatch(resetAction);
  };

  _renderItem = item => {
    return (
      <Container style={{backgroundColor: colors.THEME_YELLOW}}>
        <Header transparent style={styles.header}>
          <Left />
          <Body>{/* <Title style={styles.pageTitle}>Ask Ken</Title> */}</Body>
          <Right />
        </Header>
        <Content>
          <View style={styles.mainContent}>
            <Image style={styles.image} source={item.item.image} />
            <View style={styles.content_block}>
              <Text style={styles.title}>{item.item.title}</Text>
              <Text style={styles.text}>{item.item.text}</Text>
            </View>
          </View>
        </Content>
      </Container>
    );
  };

  render() {
    return (
      <AppIntroSlider
        slides={slides}
        renderItem={this._renderItem}
        doneLabel="Done"
        activeDotStyle={styles.activeDot}
        dotStyle={styles.dotStyle}
        buttonStyle={styles.nextBtn}
        buttonTextStyle={styles.nextBtnTxt}
        onDone={() => this._onDone()}
        bottomButton
      />
    );
  }
}

export default ExpertIntro;
