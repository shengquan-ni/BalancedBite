import React, { Component } from "react";

import { View, Text, Button, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";

import { SERVER_URL } from "../../commons/serverRequest";
import { mapDispatchToProps, mapStateToProps } from "../../commons/redux";

const FETCH_URL  = SERVER_URL + "/user/fetch-user";
const UPDATE_URL = SERVER_URL + "/user/update-user";

class UserInformationComponent extends Component {

    componentWillReceiveProps(nextProps) {
        console.warn("netProp token = " + nextProps.currentToken);
        fetch(FETCH_URL, {
            method: "POST",
            body: JSON.stringify({token: nextProps.currentToken, stepCount: 0.42, distanceTraveled: 1055}),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then(res => res.json())
        .then(res => {
            console.warn(res);
            if (res.code == 0) {
                console.warn("Error in getting user info");
            } else {
                // console.warn("Get user");
                console.warn(res);
            }
        })
        .catch(
            error => console.warn(error)
        )
    }

    testUpdate() {
        fetch(UPDATE_URL, {
            method : "POST",
            body: JSON.stringify({token: "testToken" , Test : "SUSHI"}),
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