import React, { Component } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import { Avatar, Button, CheckBox, Input, Icon, Text } from "react-native-elements";

class UserSignupPanel extends Component {

    state = {
        username : "",
        password : "",
        weight: null,
        height: null,
        hasWorkOut: false
    }

    navigationOptions = {
        header: null
    }

    onSubmitSignUpForm() {
        console.warn("Submitted signup form");
        console.warn(this.state);
    }

    render() {
        return (
            <ScrollView>
                <Text h4>Account Information</Text>
                <Input
                    placeholder=" User Name"
                    leftIcon={{type: "material-community", name:"account-box"}}
                    onChangeText = {(text) => this.setState({username: text})}
                ></Input>

                <Input
                    placeholder=" Password"
                    leftIcon={{type: "material-community", name:"lock"}}
                    onChangeText = {(text) => this.setState({password: text})}
                    secureTextEntry= {true}
                ></Input>

                <Text h4>Personal Information</Text>
                <Input
                    placeholder=" Weight"
                    leftIcon={{type: "material-community", name: "weight-kilogram"}}
                    onChangeText = {(text) => this.setState({weight: text})}
                    keyboardType="numeric"
                ></Input>

                <Input
                    placeholder=" Height"
                    leftIcon={{type: "material-community", name: "human-male"}}
                    onChangeText = {(text) => this.setState({heihgt : text})}
                    keyboardType="numeric"
                ></Input>



                <CheckBox
                    title="Do Workout Regularly"
                    center={true}
                    checked={this.state.hasWorkOut}
                    onPress={() => this.setState({hasWorkOut: !this.state.hasWorkOut})}
                ></CheckBox>

                <Button
                    raised
                    icon={{name: 'send', color: "white"}}
                    title='Submit'
                    buttonStyle={styles.submitButton}
                    onPress={() => this.onSubmitSignUpForm()}
                ></Button>
            </ScrollView>

        );
    }
}

export default UserSignupPanel

const styles = StyleSheet.create({
    submitButton: {
        backgroundColor : '#254A91'
    }
})