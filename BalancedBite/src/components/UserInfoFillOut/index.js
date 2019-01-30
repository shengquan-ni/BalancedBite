import React, { Component } from 'react';
import {
  Card, CardSection, Input, Button
} from '../common';
import {ScrollView, Picker, Text} from 'react-native';


//const HOST = "169.234.15.83";


//const SERVER_URL = "http://" + HOST + ":8080/sign-in";


class UserInfoFillOut extends Component{
	state = { age: "", gender : "", allergies:"", 
	weight:"", height:"", bodyfat:"",
	disease:"", preferfood:"", workoutregularly:"", frequency:"", optional:""};
	render(){
		return (
			<ScrollView>
			<Card>
				<Text style={styles.TextStyle}>Personal Information</Text>
				<CardSection>
					<Input
						label="Age"
						onChangeText={(text) => this.setState({age: text})}
					/>
				</CardSection>

				<CardSection>
					<Picker
						selectedValue={this.state.gender}
  						style={{flex:1}}
  						onValueChange={(itemValue, itemIndex) =>
    					this.setState({gender: itemValue})

					}>
						<Picker.Item label="Gender" value=""/>
						<Picker.Item label="Male" value="Male"/>
						<Picker.Item label="Female" value="Female"/>
					</Picker>
				</CardSection>

				<CardSection>
					<Input
						label="Weight"
						onChangeText={(text) => this.setState({weight: text})}
					/>
				</CardSection>
				<CardSection>
					<Input
						label="Height"
						onChangeText={(text) => this.setState({height: text})}
					/>
				</CardSection>

				<CardSection>
					<Input
						label="Body Fat"
						onChangeText={(text) => this.setState({bodyfat: text})}
					/>
				</CardSection>
				<CardSection>
					<Input
						label="Disease"
						onChangeText={(text) => this.setState({disease: text})}
					/>
				</CardSection>
			</Card>








			<Card>
				<Text style={styles.TextStyle}>Food Restrictions</Text>
				<CardSection>
					<Picker
						selectedValue={this.state.preferfood}
  						style={{flex:1}}
  						onValueChange={(itemValue, itemIndex) =>
    					this.setState({preferfood: itemValue})

					}>
						<Picker.Item label="Preference" value=""/>
						<Picker.Item label="Vegetarian" value="Vegetarian"/>
						<Picker.Item label="Vegan" value="Vegan"/>
					</Picker>
				</CardSection>
				<CardSection>
					<Input
						label="Allergies"
						onChangeText={(text) => this.setState({allergies: text})}
					/>
				</CardSection>

				<CardSection>
					<Input
						label="Others"
					/>
				</CardSection>



				

				
			</Card>



			<Card>
				<Text style={styles.TextStyle}>Work Out</Text>
				
				<CardSection>
					<Picker
						selectedValue={this.state.workoutregularly}
  						style={{flex:1}}
  						onValueChange={(itemValue, itemIndex) =>
    					this.setState({workoutregularly: itemValue})

					}>
						<Picker.Item label="Regularly" value=""/>
						<Picker.Item label="true" value="true"/>
						<Picker.Item label="false" value="false"/>
					</Picker>
				</CardSection>
				<CardSection>
					<Picker
						selectedValue={this.state.frequency}
  						style={{flex:1}}
  						onValueChange={(itemValue, itemIndex) =>
    					this.setState({frequency: itemValue})

					}>
						<Picker.Item label="Frequency" value=""/>
						<Picker.Item label="daily" value="daily"/>
						<Picker.Item label="weekly" value="weekly"/>
						<Picker.Item label="monthly" value="monthly"/>
					
					</Picker>
				</CardSection>
				<CardSection>
					<Picker
						selectedValue={this.state.optional}
  						style={{flex:1}}
  						onValueChange={(itemValue, itemIndex) =>
    					this.setState({optional: itemValue})

					}>
						<Picker.Item label="Optional" value=""/>
						<Picker.Item label="Weight Training" value="Weight Training"/>
						<Picker.Item label="Cardio Training" value="Cardio Training"/>
						<Picker.Item label="Both" value="Both"/>
					
					</Picker>
				</CardSection>
			</Card>

			<CardSection>
					<Button>
						Save
					</Button>
				</CardSection>
			</ScrollView>
			


		);
	}
}


const styles={
	TextStyle:{
		fontSize:20,
		fontWeight: 'bold'
		

	}

};


export default UserInfoFillOut;