import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Alert, TouchableWithoutFeedback, Keyboard, AsyncStorage
} from 'react-native';

import { Input } from "react-native-elements";

import { SERVER_URL } from "../../commons/serverRequest";

import Logo from "../BalancedBiteLogo";

// the http url is the IPv4 address of your machine, different developers should use different address
// IPv4 will be constantly changing based on your local and DNS server, you should modify this whenever
//  you switch a location (as well as the development port used by android studio)

const SIGNIN_URL = SERVER_URL +　"/sign-in";

class UserLoginPanel extends Component {

    state = { username: "", password : ""};

    static navigationOptions = {
        header: null
    }

    // save user data in frontend storage
    _storeTokenData = async(token) => {
        try {
            await AsyncStorage.setItem('token', token);
        } catch (error) {
            // Error saving data
        }
    }

    onClickLogin() {
        Keyboard.dismiss();

        const { username, password } = this.state;
        if (username.length == 0 || password.length == 0) {
            Alert.alert("Error", "Username or Password is empty", [{
                text: "Okay"
            }]);
        } else {
            fetch(SIGNIN_URL, {
                method: "POST",
                body: JSON.stringify({username: username, password: password}),
                headers: {
                    "Content-Type" : "application/json"
                }
            })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                if (res.code == 1) {
                    this._storeTokenData(res.token);
                    this.props.navigation.navigate("mainTab");
                } else {
                    Alert.alert("Error", "Username or Password does not match", [{
                        text : "Okay"
                    }]);
                }
            })
            .catch(error => {
                throw error;
            });
        }
    }

    onClickSignup() {
        this.props.navigation.navigate("userSignupPanel");
    }

	render(){
		return(
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    <Logo/>
                    <View style={styles.formContainer}>
                        <Input
                            placeholder="Username"
                            placeholderTextColor = "black"
                            leftIcon={{type: "material-community", name:"account-box"}}
                            onChangeText = {(text) => this.setState({username: text})}
                            containerStyle={styles.inputBox}
                            inputContainerStyle={styles.inputBoxContainer}
                        ></Input>
                        <Input
                            placeholder="Password"
                            placeholderTextColor = "black"
                            leftIcon={{type: "material-community", name:"lock"}}
                            onChangeText={(text)=> this.setState({password : text})}
                            containerStyle={styles.inputBox}
                            inputContainerStyle={styles.inputBoxContainer}
                            secureTextEntry={true}
                        ></Input>

                        <TouchableOpacity style={styles.button} onPress={() => this.onClickLogin()}>
                            <Text style={styles.buttonText}> Sign In</Text>
                        </TouchableOpacity>     
                    </View>

                    <View style={styles.signupTextCont}>
                        <Text style={styles.signupText}>Don't have an account yet? </Text>
                        <TouchableOpacity onPress={() => this.onClickSignup()}>
                            <Text style={styles.signupButton}>Signup</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
		);
	}
}
export default UserLoginPanel;


const font_size = 18;
const styles = StyleSheet.create({
    inputBoxContainer: {
        borderBottomColor: 'transparent' 
    },
    formContainer : {
        flexGrow: 1,
        justifyContent:'center',
        alignItems: 'center'
    },
    inputBox: {
        width:300,
        backgroundColor: "white",
        borderRadius: 25,
        paddingHorizontal:16,
        marginVertical: 8
    },

    button: {
        width:300,
        backgroundColor:'#1A8900',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13
    },

    buttonText: {
        fontSize: font_size,
        fontWeight:'bold',
        color:'#ffffff',
        textAlign:'center'
    },
    container : {
        backgroundColor:'#d9fff2',
        flex: 1,
        alignItems:'center',
        justifyContent :'center'
    },
    signupTextCont : {
        flexGrow: 1,
        justifyContent :'center',
        flexDirection:'row'
    },
    signupText: {
        color:'black',
        fontSize: font_size
    },
    signupButton: {
        color: '#1C74CA',
        fontSize: font_size,
        fontWeight: 'bold'
    }
});