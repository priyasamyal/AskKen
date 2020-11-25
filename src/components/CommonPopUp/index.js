//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

import * as Animatable from "react-native-animatable";
// create a component
class CommonPopUp extends Component {
    handleViewRef = ref => this.view = ref;
    navigator = page => {
        switch (page) {
            case "back":
                console.log("back");
                this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
                setTimeout(() => {
                    this.props.clickHandler('back');
                }, 420);
                //  
                break;
            case "end":
                console.log("end");
                this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
                setTimeout(() => {
                    this.props.clickHandler('end');
                }, 420);
                break;
            default:
                console.log("end");
                this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
                setTimeout(() => {
                    this.props.clickHandler(page);
                }, 420);
                break;
                break;
        }
    }
    bounce = () => this.view.bounce(800).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));

    render() {
        return (
            <View style={styles.container}>
                <Animatable.View animation="fadeInDown"
                    ref={this.handleViewRef}
                    duration={400} style={styles.inner_container}>
                    <Text style={styles.header_text}>{this.props.title}</Text>
                    <Text style={styles.description_text}>{this.props.msg}</Text>
                    {/* <Button style={styles.back_btn} onPress={() => this.navigator('back')}>
                        <Text style={styles.back_btn_txt}> Go Back</Text>
                    </Button> */}

                    {this.props.title == "Refund" && (
                        <Button style={styles.back_btn} onPress={() => this.navigator('refund')} >
                            <Text style={styles.back_btn_txt} >Refund</Text>
                        </Button>
                    )}
                    {this.props.title == "Refund" && (
                        <Button style={styles.end_btn} onPress={() => this.navigator('cancel')} >
                            <Text style={styles.end_btn_txt} >Cancel</Text>
                        </Button>
                    )}
                    {this.props.title != "Refund" && (
                        <Button style={styles.end_btn} onPress={() => this.navigator('end')} >
                            <Text style={styles.end_btn_txt} >Back to Home</Text>
                        </Button>
                    )}
                </Animatable.View>

            </View>
        );
    }
}


//make this component available to the app
export default CommonPopUp;
