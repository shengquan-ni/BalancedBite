import React, { Component } from "react";
import { View, Text, StyleSheet, SafeAreaView, AsyncStorage, Button, Platform } from "react-native";

import { createMaterialTopTabNavigator, createAppContainer, withNavigation } from "react-navigation";

import { Ionicons } from '@expo/vector-icons';

import { SERVER_URL } from "../../commons/serverRequest";

import UserInformationComponent from "../UserInformationPanel";
import ClickSuggestionComponent from "../ClickSuggestionPanel";

import { connect } from "react-redux";

const SESSION_URL = SERVER_URL + "/check-session";

const AppTabNavigator = createMaterialTopTabNavigator({
    UserInformation: {
        screen: UserInformationComponent,
        navigationOptions: {
            tabBarLabel: 'User',
            tabBarIcon: ({ tintColor }) => {
                if (Platform.OS === 'ios') {
                    return (<Ionicons name="ios-person" color={tintColor} size={24}></Ionicons>)
                } else {
                    return (<Ionicons name="md-person" color={tintColor} size={24}></Ionicons>)
                }
            }
        }
    },
    ClickSuggestion: {
        screen: ClickSuggestionComponent,
        navigationOptions: {
            tabBarLabel: "Suggest",
            tabBarIcon: ({ tintColor }) => {
                if (Platform.OS === 'ios') {
                    return (<Ionicons name="ios-search" color={tintColor} size={24}></Ionicons>)
                } else {
                    return (<Ionicons name="md-search" color={tintColor} size={24}></Ionicons>)
                }
            }
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

    checkTokenStatus(UItoken) {
        // console.warn("Current UItoken = " + UItoken);
        fetch(SESSION_URL, {
            method: "POST",
            body : UItoken,
            headers: {
                "Content-Type" : "text/plain"
            }
        })
        .then(backendRes => backendRes.json())
        .then(backendRes => {
            if (backendRes.code == 0) {
                // console.warn("backendRes code = 0");
                this.props.navigation.navigate("loginPanel");
            } else {
                // change token in redux storage
                this.props.changeCurrentToken(UItoken);
            }
        })
        .catch(error => {
            throw error;
        });
    }

    handleUserSessionCall() {
        // fetch user data from async storage in react-native
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

        fetchAsyncTokenData().then(UItoken => {
            if (UItoken == 'none'){
                // console.warn("UI token = none");
                this.props.navigation.navigate("loginPanel");
            } else {
                // check if token is valid in db
                this.checkTokenStatus(UItoken);
            }
        });
    }
    
    componentDidMount(){
        const { navigation } = this.props;
        // listen to navigation focus on this screen
        this.focusListener = navigation.addListener("didFocus", () => {
            this.handleUserSessionCall();
        })
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    render() {
        return (
            <SafeAreaView style={{flex : 1, backgroundColor: '#f2f2f2' }}>
                <AppTabContainer></AppTabContainer>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentToken: state.currentToken
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeCurrentToken: (token) => dispatch({type : 'CHANGE_TOKEN', token: token})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(MainTab));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})