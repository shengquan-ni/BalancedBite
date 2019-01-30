import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image 
} from 'react-native';

class Logo extends Component {
	render(){
		return(
				<View style={styles.container}>
					<Image style={{width:70, height: 85}}
									source={require('../../images/BBLogo.png')}/>
          		<Text style={styles.logoText}>BalancedBites</Text>	
  			</View>
			)
	}
}

export default Logo;

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent:'flex-end',
    alignItems: 'center'
  },
  logoText : {
  	marginVertical: 15,
  	fontSize: 28,
		color: 'black',
		fontFamily: 'cursive',
		fontWeight : "bold"
  }
});