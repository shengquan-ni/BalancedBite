import React, { Component } from "react";

import { View, StyleSheet, AsyncStorage, Platform } from "react-native";
import { SERVER_URL } from "../../commons/serverRequest";
import { Button, Text } from "react-native-elements";

import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import { Ionicons } from '@expo/vector-icons';

const SESSION_URL = SERVER_URL + "/check-session";
import { mapDispatchToProps, mapStateToProps } from "../../commons/redux";

class ClickSuggestionComponent extends Component {
    
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

    navigateToUserInformation() {
        this.props.navigation.navigate("userInformationPanel");
    }

    getUserInformationIcon() {
        if (Platform.OS === 'ios') {
            return (<Ionicons name="ios-person" size={24}></Ionicons>)
        } else {
            return (<Ionicons name="md-person" size={24}></Ionicons>)
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>ClickSuggestionComponent panel</Text>
                <Text>{this.props.currentToken}</Text>
                <Button
                    title="go to user information"
                    icon={this.getUserInformationIcon()}
                    onPress={()=>{this.navigateToUserInformation()}}
                ></Button>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(ClickSuggestionComponent));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})