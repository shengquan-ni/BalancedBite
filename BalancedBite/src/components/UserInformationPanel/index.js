import React, { Component } from "react";

import { View, Text, Button, Input, StyleSheet } from "react-native";
import { connect } from "react-redux";

// get the current user name from the redux store, and put it
//  into a new props call 'currentUserName'
const mapStateToProps = (state) => {
    return {
      currentUserName : state.currentUserName
    }
}

// action dispatcher to change the state of the redux store. This will
//  pass type and name to the reduce in App.js, where the actual change
//  will occur.
const mapDispatchToProps = (dispatch) => {
    return {
        changeCurrentUser: (name) => dispatch({type : 'CHANGE_USER', name: name})
    }
}

class UserInformationComponent extends Component {

    testFunc() {
        this.props.changeCurrentUser("Henry");
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>UserInformationComponent panel</Text>
                <Text>a {this.props.currentUserName} a</Text>
                <Button
                    title="test"
                    onPress={() => this.testFunc()}
                >
                </Button>
            </View>
        );
    }
}

// connecting props defined in mapState to the component
export default connect(mapStateToProps, mapDispatchToProps)(UserInformationComponent);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})