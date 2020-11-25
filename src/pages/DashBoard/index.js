import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    magnetometer,
    accelerometer,
    gyroscope,
    setUpdateIntervalForType,
    SensorTypes
} from "react-native-sensors";
import { map, filter } from "rxjs/operators";


setUpdateIntervalForType(SensorTypes.accelerometer, 500); // defaults to 100ms


const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
    //   console.log({ x, y, z, timestamp }, "my values")
}

);

// const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
//     //  console.log({ x, y, z, timestamp })
// }

// );


setTimeout(() => {
    // If it's the last subscription to accelerometer it will stop polling in the native API
    console.log("helloo")
    subscription.unsubscribe();
}, 3000);
class DashBoard extends Component {


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.headline}>
                    Accelerometer values
            </Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    headline: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
    },
    valueContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    valueValue: {
        width: 200,
        fontSize: 20
    },
    valueName: {
        width: 50,
        fontSize: 20,
        fontWeight: 'bold'
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export default DashBoard
