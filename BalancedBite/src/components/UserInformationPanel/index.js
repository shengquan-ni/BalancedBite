import React, { Component } from "react";

import { View, Text, Button, Input, StyleSheet } from "react-native";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
    return {
      currentUserName : state.currentUserName
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(UserInformationComponent);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})