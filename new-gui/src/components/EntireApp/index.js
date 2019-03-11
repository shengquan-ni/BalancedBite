import AppContainer from "../AppContainer";
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    StatusBar 
} from 'react-native';

class EntireApp extends Component {
    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#1c313a"
                    barStyle="light-content"
                />
                <AppContainer></AppContainer>
            </View>
        )
    }
}

export default EntireApp



const styles = StyleSheet.create({
    container : {
      flex: 1,
    }
  });