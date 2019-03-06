import React, { Component } from "react";
import { View, Text, StyleSheet, SafeAreaView, AsyncStorage, Button } from "react-native";

import { createMaterialTopTabNavigator, createAppContainer } from "react-navigation";

import Icon from "react-native-vector-icons/Ionicons";

import { SERVER_URL } from "../../commons/serverRequest";

import UserInformationComponent from "../UserInformationPanel";
import ClickSuggestionComponent from "../ClickSuggestionPanel";

const SESSION_URL = SERVER_URL + "/check-session";

const AppTabNavigator = createMaterialTopTabNavigator({
    UserInformation: {
        screen: UserInformationComponent,
        navigationOptions: {
            tabBarLabel: 'User',
            tabBarIcon: ({ tintColor }) => <Icon name="md-user" color={tintColor} size={24}></Icon>
        }
    },
    ClickSuggestion: {
        screen: ClickSuggestionComponent,
        navigationOptions: {
            tabBarLabel: "Suggest",
            tabBarIcon: ({ tintColor }) => <Icon name="md-search" color={tintColor} size={24}></Icon>
        }
    }
},
{
    initialRouteName: 'UserInformation',
    tabBarPosition: 'bottom',
    tabBarOptions: {
        activeTintColor : '#2A67BF',
        inactiveTintColor: 'grey',
        style: {
            backgroundColor: '#f2f2f2',
            borderTopWidth : 0.5,
            borderTopColor: 'grey'
        },
        indicatorStyle: {
            height: 0
        },
        showIcon: true,
        showLabel: true
    }
})

const AppTabContainer = createAppContainer(AppTabNavigator)

class MainTab extends Component {

    static navigationOptions = {
        header: null
    }

    componentWillMount() {
        // fetch user data
        const fetchAsyncTokenData = async () => {
            let token = 'none';
            try {
              token = await AsyncStorage.getItem('token') || 'none';
            } catch (error) {
              // Error retrieving data
              console.warn(error.message);
            }
            return token;
        }

        fetchAsyncTokenData().then(res => {
            if (res == 'none'){
                this.props.navigation.navigate("loginPanel");
            } else {
                // check token exist in db
                fetch(SESSION_URL, {
                    method: "POST",
                    body : JSON.stringify({"token": res}),
                    headers: {
                        "Content-Type" : "application/json"
                    }
                })
                .then(res => res.json())
                .then(res => {
                    if (res.code == 0) {
                        this.props.navigation.navigate("loginPanel");
                    } else {
                        // console.warn("Request sent");
                        // // contains username, 
                        // console.warn(res.token);
                    }
                })
                .catch(error => {
                    throw error;
                });
            }
        });
    }
    
    render() {
        return (
            <SafeAreaView style={{flex : 1, backgroundColor: '#f2f2f2' }}>
                <AppTabContainer></AppTabContainer>
            </SafeAreaView>
        );
    }
}

export default MainTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})