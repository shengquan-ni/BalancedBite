import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Picker, Alert, AsyncStorage } from "react-native";

import { Button, CheckBox, Input, Text } from "react-native-elements";

import { SERVER_URL } from "../../commons/serverRequest";

const SIGNUP_URL = SERVER_URL + "/sign-up";

class UserSignupPanel extends Component {

    state = {
        username : "",
        usernameError : "",
        password : "",
        passwordError: "",
        weight: null,
        weightError: "",
        height: null,
        heightError: "",
        age: null,
        ageError: "",
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
        title: "Sign Up",
        headerStyle: {
            backgroundColor: "#808080"
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
    }

    // save user data in frontend storage
    _storeTokenData = async(token) => {
        try {
            await AsyncStorage.setItem('token', token);
        } catch (error) {
            // Error saving data
        }
    }

    onSubmitSignUpForm() {
        let noErrorEncountered = true;

        if (this.state.username.trim().length < 1) {
            this.setState({usernameError : "Username must be at least 8 characters"});
            noErrorEncountered = false;
        } else {
            this.setState({usernameError: ""});
        }

        if (this.state.password.trim().length < 1) {
            this.setState({passwordError: "Password must be at least 8 characters"});
            noErrorEncountered = false;
        } else {
            this.setState({passwordError: ""});
        }

        if (this.state.weight == null) {
            this.setState({weightError: "Weight field is required"});
            noErrorEncountered = false;
        } else {
            this.setState({weightError: ""});
        }

        if (this.state.height == null) {
            this.setState({heightError: "Height field is required"});
            noErrorEncountered = false;
        } else {
            this.setState({heightError: ""});
        }

        if (this.state.age == null) {
            this.setState({ageError : "Age field is required"});
            noErrorEncountered = false;
        } else {
            this.setState({ageError: ""});
        }

        if (!noErrorEncountered) {
            return;
        }
        let currentState = {
            username : this.state.username,
            password : this.state.password,
            weight: this.state.weight,
            height: this.state.height,
            age: this.state.age,
            sexes: this.state.sexes,
            bodyFat: this.state.bodyFat,
            foodRestriction: this.state.foodRestriction,
            workoutBoolean: this.state.workoutBoolean,
            workoutFrequency: this.state.workoutFrequency,
            workoutType: this.state.workoutType,            
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
                this._storeTokenData(res.token).then(
                    () => {
                        this.props.navigation.navigate("clickSuggestionPanel");
                    }
                );  
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
            <ScrollView style={styles.scrollViewContainer}>
                <View style={styles.sectionView}>
                    <Text h4
                        style={styles.sectionTitle}
                    >Account Information</Text>

                    <Input
                        placeholder=" Username"
                        leftIcon={{type: "material-community", name:"account-box"}}
                        onChangeText = {(text) => this.setState({username: text})}
                        containerStyle={styles.inputBox}
                        inputContainerStyle={styles.inputBoxContainer}
                        errorStyle={{ color: 'red' }}
                        errorMessage={this.state.usernameError}
                    ></Input>

                    <Input
                        placeholder=" Password"
                        leftIcon={{type: "material-community", name:"lock"}}
                        onChangeText = {(text) => this.setState({password: text})}
                        secureTextEntry= {true}
                        containerStyle={styles.inputBox}
                        inputContainerStyle={styles.inputBoxContainer}
                        errorStyle={{ color: 'red' }}
                        errorMessage={this.state.passwordError}
                    ></Input>
                </View>

                <View style={styles.sectionView}>
                    <Text h4
                        style={styles.sectionTitle}                
                    >Personal Information</Text>
                    <Input
                        placeholder=" Weight (kg)"
                        leftIcon={{type: "material-community", name: "weight-kilogram"}}
                        onChangeText = {(text) => this.setState({weight: text})}
                        keyboardType="numeric"
                        containerStyle={styles.inputBox}
                        inputContainerStyle={styles.inputBoxContainer}
                        errorStyle={{ color: 'red' }}
                        errorMessage={this.state.weightError}
                    ></Input>

                    <Input
                        placeholder=" Height (cm)"
                        leftIcon={{type: "material-community", name: "human-male"}}
                        onChangeText = {(text) => this.setState({height : text})}
                        keyboardType="numeric"
                        containerStyle={styles.inputBox}
                        inputContainerStyle={styles.inputBoxContainer}
                        errorStyle={{ color: 'red' }}
                        errorMessage={this.state.heightError}
                    ></Input>

                    <Input
                        placeholder=" Age"
                        leftIcon={{type: "material-community", name: "clock-outline"}}
                        onChangeText= {(text) => this.setState({age: text})}
                        keyboardType="numeric"
                        containerStyle={styles.inputBox}
                        inputContainerStyle={styles.inputBoxContainer}
                        errorStyle={{ color: 'red' }}
                        errorMessage={this.state.ageError}
                    >
                    </Input>

                    <Input
                        placeholder=" Body Fat %"
                        leftIcon={{type: "material-community", name: "dumbbell"}}
                        onChangeText= {(text) => this.setState({bodyFat: text})}
                        keyboardType="numeric"
                        containerStyle={styles.inputBox}
                        inputContainerStyle={styles.inputBoxContainer}

                    >
                    </Input>

                    <Input
                        placeholder=" Health Problems (separate by commas)"
                        leftIcon={{type: "material-community", name: "pharmacy"}}
                        onChangeText={(text) => this.setState({healthProblems: text})}
                        containerStyle={styles.inputBox}
                        inputContainerStyle={styles.inputBoxContainer}

                    ></Input>

                    <Text>Select Gender</Text>
                    <Picker
                        selectedValue={this.state.sexes}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({sexes: itemValue})
                        }}
                        style={styles.pickerBox}
                    >
                        <Picker.Item label="Male" value="male"></Picker.Item>
                        <Picker.Item label="Female" value="female"></Picker.Item>
                    </Picker>
                </View>
                <View style={styles.sectionView}>
                    <Text h4
                        style={styles.sectionTitle}
                    >Food Restrictions</Text>
                    <Text>Select Restriction Type</Text>
                    <Picker
                        selectedValue={this.state.foodRestriction}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({foodRestriction: itemValue})
                        }}
                        style = {styles.pickerBox}
                    >
                        <Picker.Item label="None" value="None"></Picker.Item>  
                        <Picker.Item label="Vegetarian" value="Vegetarian"></Picker.Item>
                        <Picker.Item label="Vegan" value="Vegan"></Picker.Item>
                    </Picker>

                    <Input
                        placeholder=" Allergies (separate by commas)"
                        leftIcon={{type: "material-community", name:"food-variant"}}
                        onChangeText={(text) => this.setState({allergies: text})}
                        containerStyle={styles.inputBox}
                        inputContainerStyle={styles.inputBoxContainer}

                    ></Input>

                    <Input
                        placeholder=" Dislike Foods (separate by commas)"
                        leftIcon={{type: "material-community", name:"food-off"}}
                        onChangeText={(text) => this.setState({dislikeFoods: text})}
                        containerStyle={styles.inputBox}
                        inputContainerStyle={styles.inputBoxContainer}

                    ></Input>
                </View>
                <View style={styles.sectionView}>
                    <Text h4
                        style={styles.sectionTitle}
                    >Workout Information</Text>

                    <CheckBox
                        title="Do Workout Regularly"
                        center={true}
                        checked={this.state.workoutBoolean}
                        onPress={() => this.setState({workoutBoolean: !this.state.workoutBoolean})}
                        containerStyle={styles.checkBox}
                    ></CheckBox>

                    <Input
                        placeholder=" Workout Frequency Weekly (days)"
                        leftIcon={{type : "material-community", name:"timelapse"}}
                        onChangeText={(text)=> this.setState({workoutFrequency: text})}
                        keyboardType="numeric"
                        containerStyle={styles.inputBox}
                        inputContainerStyle={styles.inputBoxContainer}

                    ></Input>

                    <Text>Select Training Type</Text>
                    <Picker
                        selectedValue={this.state.workoutType}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({workoutType: itemValue})
                        }}
                        style = {styles.pickerBox}
                    >
                        <Picker.Item label="None" value="None"></Picker.Item>
                        <Picker.Item label="Weight Training" value="Weight"></Picker.Item>  
                        <Picker.Item label="Cardio Training" value="Cardio"></Picker.Item>
                        <Picker.Item label="Both" value="Both"></Picker.Item>
                    </Picker>
                </View>
                <Button
                    raised
                    icon={{type: 'material-community', name: 'account-check', color: "white"}}
                    title='Submit'
                    buttonStyle={styles.submitButton}
                    containerStyle={styles.submitButtonContainer}
                    titleStyle={styles.submitButtonTitle}
                    onPress={() => this.onSubmitSignUpForm()}
                ></Button>
            </ScrollView>

        );
    }
}

export default UserSignupPanel

const borderRadius = 25;
const styles = StyleSheet.create({
    sectionView: {
        padding: 12,
        borderColor: 'black',
        borderBottomWidth: 1
    },
    submitButton: {
        backgroundColor : '#1A8900',
        borderRadius: borderRadius
    },
    submitButtonTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    submitButtonContainer: {
        marginVertical: 15
    },
    scrollViewContainer: {
        backgroundColor: "#d9fff2"
    },
    inputBox : {
        backgroundColor: 'white',
        borderRadius: borderRadius,
        marginVertical: 10
    },
    inputBoxContainer: {
        borderBottomColor: 'transparent'
    },
    sectionTitle: {
        color: 'black'
    },
    checkBox : {
        backgroundColor: "white",
        borderRadius: borderRadius
    },
    pickerBox: {
        backgroundColor: 'white',
        color: 'black',
        borderColor: 'black',
        borderWidth: 10,
        marginVertical: 5
    }
})