import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, Alert
} from 'react-native';

import Logo from "../BalancedBiteLogo";

// the http url is the IPv4 address of your machine, different developers should use different address
// IPv4 will be constantly changing based on your local and DNS server, you should modify this whenever
//  you switch a location (as well as the development port used by android studio)

const HOST = "192.168.1.18";


const SERVER_URL = "http://" + HOST + ":8080/sign-in";

class UserLoginPanel extends Component {

    state = { username: "", password : ""};

    static navigationOptions = {
        header: null
    }

    onClickLogin() {
        const { username, password } = this.state;
        if (username.length == 0 || password.length == 0) {
            Alert.alert("Error", "Username or Password is empty", [{
                text: "Okay"
            }]);
        } else {
            fetch(SERVER_URL, {
                method: "POST",
                body: JSON.stringify({username: username, password: password}),
                headers: {
                    "Content-Type" : "application/json"
                }
            })
            .then(res => res.json())
            .then(res => {
                if (res.code == 1) {
                    this.props.navigation.navigate("clickSuggestionPanel");
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
            <View style={styles.container}>
                <Logo/>
                <View style={styles.formContainer}>
                    <TextInput style={styles.inputBox} 
                        underlineColorAndroid='rgba(0,0,0,0)' 
                        placeholder="Username"
                        placeholderTextColor = "black"
                        selectionColor="#fff"
                        keyboardType="email-address"
                        onChangeText={(text) => this.setState({username: text})}
                        />
                    <TextInput style={styles.inputBox} 
                        underlineColorAndroid='rgba(0,0,0,0)' 
                        placeholder="Password"
                        secureTextEntry={true}
                        placeholderTextColor = "black"
                        onChangeText={(text)=> this.setState({password : text})}
                        />  
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
		);
	}
}
export default UserLoginPanel;


const font_size = 18;
const styles = StyleSheet.create({
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
    fontSize: font_size,
    color:'black',
    marginVertical: 10
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
    alignItems:'flex-end',
    justifyContent :'center',
    paddingVertical:16,
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