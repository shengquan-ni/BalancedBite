import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Picker, Alert } from "react-native";

import { Avatar, Button, CheckBox, Input, Icon, Text } from "react-native-elements";

import { SERVER_URL } from "../../commons/serverRequest";

const SIGNUP_URL = SERVER_URL + "/sign-up";

class UserSignupPanel extends Component {

    state = {
        username : "",
        password : "",
        weight: null,
        height: null,
        age: null,
        sexes: "male",
        bodyFat: null,
        foodRestriction: "None",
        allergies: "",
        dislikeFoods: "",
        healthProblems: "",
        workoutBoolean: false,
        workoutFrequency: 0,
        workoutType: "None"
    }

    static navigationOptions = {

    }

    onSubmitSignUpForm() {
        let currentState = {
            ...this.state,
            allergies: this.state.allergies.split(",").filter(element => element.trim().length > 0),
            dislikeFoods: this.state.dislikeFoods.split(",").filter(element => element.trim().length > 0),
            healthProblems: this.state.healthProblems.split(",").filter(element => element.trim().length > 0)
        }
        

        fetch(SIGNUP_URL, {
            method : "POST",
            body: JSON.stringify(currentState),
            headers: {
                "Content-Type" : "application/json"
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.code == 1) {
                Alert.alert("Success", "User was added successfully", [{
                    text: "Okay"
                }])
            } else {
                Alert.alert("Error", "User was not added successfully", [{
                    text: "Okay"
                }])
            }
        }).catch(error => {
            throw error;
        })
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
                    onChangeText = {(text) => this.setState({height : text})}
                    keyboardType="numeric"
                ></Input>

                <Input
                    placeholder=" Age"
                    leftIcon={{type: "material-community", name: "clock-outline"}}
                    onChangeText= {(text) => this.setState({age: text})}
                    keyboardType="numeric"
                >
                </Input>

                <Input
                    placeholder=" Body Fat Percentage"
                    leftIcon={{type: "material-community", name: "dumbbell"}}
                    onChangeText= {(text) => this.setState({bodyFat: text})}
                    keyboardType="numeric"
                >
                </Input>

                <Input
                    placeholder=" Health Problems (separate by commas)"
                    leftIcon={{type: "material-community", name: "pharmacy"}}
                    onChangeText={(text) => this.setState({healthProblems: text})}
                ></Input>

                <Picker
                    selectedValue={this.state.sexes}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({sexes: itemValue})
                    }}
                >
                    <Picker.Item label="Male" value="male"></Picker.Item>
                    <Picker.Item label="Female" value="female"></Picker.Item>
                </Picker>

                <Text h4>Food Restrictions</Text>
                <Picker
                    selectedValue={this.state.foodRestriction}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({foodRestriction: itemValue})
                    }}
                >
                    <Picker.Item label="None" value="None"></Picker.Item>  
                    <Picker.Item label="Vegetarian" value="Vegetarian"></Picker.Item>
                    <Picker.Item label="Vegan" value="Vegan"></Picker.Item>
                </Picker>

                <Input
                    placeholder=" Allergies (separate by commas)"
                    leftIcon={{type: "material-community", name:"food-variant"}}
                    onChangeText={(text) => this.setState({allergies: text})}
                ></Input>

                <Input
                    placeholder=" Dislike Foods (separate by commas)"
                    leftIcon={{type: "material-community", name:"food-off"}}
                    onChangeText={(text) => this.setState({dislikeFoods: text})}
                ></Input>

                <Text h4>Workout Information</Text>

                <CheckBox
                    title="Do Workout Regularly"
                    center={true}
                    checked={this.state.workoutBoolean}
                    onPress={() => this.setState({workoutBoolean: !this.state.workoutBoolean})}
                ></CheckBox>

                <Input
                    placeholder=" Workout Frequency"
                    leftIcon={{type : "material-community", name:"timelapse"}}
                    onChangeText={(text)=> this.setState({workoutFrequency: text})}
                    keyboardType="numeric"
                ></Input>

                <Picker
                    selectedValue={this.state.workoutType}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({workoutType: itemValue})
                    }}
                >
                    <Picker.Item label="None" value="None"></Picker.Item>
                    <Picker.Item label="Weight Training" value="Weight"></Picker.Item>  
                    <Picker.Item label="Cardio Training" value="Cardio"></Picker.Item>
                    <Picker.Item label="Both" value="Both"></Picker.Item>
                </Picker>

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