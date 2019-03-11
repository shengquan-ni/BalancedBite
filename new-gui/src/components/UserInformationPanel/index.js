import React, { Component } from "react";

import { View, Text, Button, Input, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";

import { SERVER_URL } from "../../commons/serverRequest";

const FETCH_URL  = SERVER_URL + "/user/fetch-user";
const UPDATE_URL = SERVER_URL + "/user/update-user";

// get the current user name from the redux store, and put it
//  into a new props call 'currentUserName'
const mapStateToProps = (state) => {
    return {
        currentToken : state.currentToken
    }
}

// action dispatcher to change the state of the redux store. This will
//  pass type and name to the reduce in App.js, where the actual change
//  will occur.
const mapDispatchToProps = (dispatch) => {
    return {
        changeCurrentToken: (token) => dispatch({type : 'CHANGE_TOKEN', token: token})
    }
}

class UserInformationComponent extends Component {

    componentWillReceiveProps(nextProps) {
        console.warn(nextProps.currentToken);
        fetch(FETCH_URL, {
            method: "POST",
            body: nextProps.currentToken,
            headers : {
                "Content-Type" : "text/plain"
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.code == 0) {
                console.warn("Error in getting user info");
            } else {
                // console.warn("Get user");
                console.warn(res);
            }
        })
    }

    testUpdate() {
        fetch(UPDATE_URL, {
            method : "POST",
            body: JSON.stringify({"token": "testToken" , "Test" : "SUSHI"}),
            headers : {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(res => {
            console.warn(res);
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>UserInformationComponent panel</Text>
                <Text>{this.props.currentToken}</Text>
                <Button
                    title="Check update"
                    onPress={() => this.testUpdate()}
                ></Button>
            </View>
        );
    }
}

// connecting props defined in mapState to the component
export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(UserInformationComponent));


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})