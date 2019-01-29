import React, { Component } from "react";

import { View, Text, TextInput } from "react-native";


class UserSignupPanel extends Component {

    static navigationOptions = {
        title : "Sign Up",
        headerStyle: {
            backgroundColor: '#F5934B',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }

    render() {
        return(
            <View>
                <Text>Signup Panel</Text>
            </View>
        );
    }
}


export default UserSignupPanel;