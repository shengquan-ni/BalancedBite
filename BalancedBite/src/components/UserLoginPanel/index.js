import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, Alert
} from 'react-native';

import Logo from "../BalancedBiteLogo";

// the http url is the IPv4 address of your machine, different developers should use different address
// IPv4 will be constantly changing based on your local and DNS server, you should modify this whenever
//  you switch a location (as well as the development port used by android studio)

const HOST = "192.168.0.3";


const SERVER_URL = "http://" + HOST + ":8080/sign-in";

class UserLoginPanel extends Component {

    state = { username: "", password : ""};

    static navigationOptions = {

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

    signup() {

        this.props.navigation.navigate("signupPanel");

    }

	render(){
		return(
            <View style={styles.container}>
                <Logo/>
                <View style={styles.formContainer}>
                    <TextInput style={styles.inputBox} 
                        underlineColorAndroid='rgba(0,0,0,0)' 
                        placeholder="Username"
                        placeholderTextColor = "#ffffff"
                        selectionColor="#fff"
                        keyboardType="email-address"
                        onChangeText={(text) => this.setState({username: text})}
                        />
                    <TextInput style={styles.inputBox} 
                        underlineColorAndroid='rgba(0,0,0,0)' 
                        placeholder="Password"
                        secureTextEntry={true}
                        placeholderTextColor = "#ffffff"
                        onChangeText={(text)=> this.setState({password : text})}
                        />  
                    <TouchableOpacity style={styles.button} onPress={() => this.onClickLogin()}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>     
                </View>

                <View style={styles.signupTextCont}>
                    <Text style={styles.signupText}>Don't have an account yet?</Text>
                    <TouchableOpacity onPress={() => this.signup()}>
                        <Text style={styles.signupButton}> Signup</Text>
                    </TouchableOpacity>
                </View>
            </View> 
		);
	}
}

export default UserLoginPanel;

const styles = StyleSheet.create({
  formContainer : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center'
  },

  inputBox: {
    width:300,
    backgroundColor:'rgba(255, 255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10
  },
  button: {
    width:300,
    backgroundColor:'#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  },
  container : {
    backgroundColor:'#455a64',
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
    color:'rgba(255,255,255,0.6)',
    fontSize:16
  },
  signupButton: {
    color:'#ffffff',
    fontSize:16,
    fontWeight:'500'
  }
  
});
