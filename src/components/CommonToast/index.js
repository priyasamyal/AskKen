//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './styles';
import {
    Icon
} from 'native-base';
import { colors } from '../../common/index';
import * as Animatable from "react-native-animatable";

// create a component
class CommonToast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: this.props.type == "error" ? colors.notify_error : colors.notify_success,
            icon: this.props.type == "error" ? "ios-close" : "ios-checkmark"
        }

        // setTimeout(() => {
        //     this.view.fadeOutDown(600).then(endState => console.log(endState));
        // }, 3000);
    }

    handleViewRef = ref => this.view = ref;

    render() {
        console.log(this.view)
        console.log(this.handleViewRef)
        return (
            <Animatable.View animation="fadeInUp"
                ref={this.handleViewRef}
                duration={450} style={[styles.container, { backgroundColor: this.state.color }]}>
                <View style={styles.inner_container}>
                    <Icon
                        style={[
                            styles.icon_image, { fontSize: 30 }
                        ]}
                        name={this.state.icon}
                    />
                    <Text style={styles.header_text}>
                        {this.props.message}
                    </Text>
                </View>
            </Animatable.View>
        );
    }
}


//make this component available to the app
export default CommonToast;




