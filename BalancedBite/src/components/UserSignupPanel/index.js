import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, Alert
} from 'react-native';

import Logo from "../BalancedBiteLogo";

//const HOST = "169.234.15.83";


//const SERVER_URL = "http://" + HOST + ":8080/sign-in";


class UserSignupPanel extends Component{
	state = {username:"", password:""};


	onClickSignup(){
		


		
		this.props.navigation.navigate("infoFillOut");
	}

	goback(){
		 this.props.navigation.navigate("loginPanel");
	}

	render() {
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
                    <TouchableOpacity style={styles.button} onPress={() => this.onClickSignup()}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>     
                </View>

				<View style={styles.signupTextCont}>
					<Text style={styles.signupText}>Already have an account?</Text>
					<TouchableOpacity onPress={()=>this.goback()}><Text style={styles.signupButton}> Sign in</Text></TouchableOpacity>
				</View>
			</View>	
			)
	}



}


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



export default UserSignupPanel;