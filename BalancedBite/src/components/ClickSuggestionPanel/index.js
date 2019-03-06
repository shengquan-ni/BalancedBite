import React, { Component } from "react";

import { View, Text, Button, Input, StyleSheet } from "react-native";

import { connect } from "react-redux";

const mapStateToProps = (state) => {
    return {
      currentUserName : state.currentUserName
    }
}

class ClickSuggestionComponent extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>ClickSuggestionComponent panel</Text>
                <Text>{this.props.currentUserName}</Text>
            </View>
        );
    }
}

export default connect(mapStateToProps)(ClickSuggestionComponent);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})