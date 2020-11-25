//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import styles from './styles';
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
const average = require('../../assets/imgs/average_rate.png');
const poor = require('../../assets/imgs/poor_rate.png');
const excel = require('../../assets/imgs/excel_rate.png');
const no_rate = require('../../assets/imgs/no_rate.png');
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };

class ShowRating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating_icon: no_rate,
            rating_text: "Excellent",
        };

    }
    componentDidMount() {
        if (commonData.user_details.user_rating == null) {
            this.setState({
                rating_icon: no_rate,
                rating_text: "No Rating",
            })
        }
        else {
            if (Math.round(commonData.user_details.user_rating) <= 2) {
                this.setState({
                    rating_icon: poor,
                    rating_text: "Poor",
                })
            }
            else if (Math.round(commonData.user_details.user_rating) > 2 && Math.round(commonData.user_details.user_rating) <= 4) {
                this.setState({
                    rating_icon: average,
                    rating_text: "Average",
                })
            }
            else if (Math.round(commonData.user_details.user_rating) == 5) {
                this.setState({
                    rating_icon: excel,
                    rating_text: "Excellent",
                })
            }
        }
    }
    navigator = action => {
        switch (action) {
            case 'contact': {
                var url = 'mailto:help@askkenapp.com?subject=&body=&cc=';
                Linking.openURL(url);
                break;
            }
            default:
                break;
        }
    };

    getTextColor = () => {
        if (this.state.rating_text == "Poor")
            return colors.poor_color
        else if (this.state.rating_text == "Excellent")
            return colors.THEME_YELLOW
        else
            return colors.jet_black
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={[styles.inner_container, styles.center_item]}>
                    <Image style={styles.rating_icon} source={this.state.rating_icon} />
                    <Text style={[styles.header_text, { color: this.getTextColor() }]}>{this.state.rating_text}</Text>
                </View>

                <View style={[styles.inner_container, { padding: 20, paddingRight: 25 }]}>
                    <Text style={[styles.explain]}>Your rating explained</Text>
                    <Text style={[styles.description_text]}>After each call, homeowners have the opportunity to rate you based on their call experience. Ratings are anonymous. You won’t see individual ratings tied to a particular call. Your expert rating is an average of the last 25 calls. You are encouraged to maintain at least an average rating. If you're consistently rated poorly, <Text hitSlop={hitSlop}
                        onPress={() => this.navigator('contact')} style={{ color: colors.THEME_YELLOW, textDecorationLine: 'underline', letterSpacing: 0.9, }}>contact us</Text>  for tips on how to improve. If your rating doesn’t improve, you may lose access to the app. </Text>
                </View>
            </View>
        );
    }
}


//make this component available to the app
export default ShowRating;
