import React, { Component } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

import { createMaterialTopTabNavigator, createAppContainer } from "react-navigation";

import Icon from "react-native-vector-icons/Ionicons";

class HomeComponent extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>HomeComponent panel</Text>
            </View>
        );
    }
}


class SettingComponent extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>SettingComponent panel</Text>
            </View>
        );
    }
}

const AppTabNavigator = createMaterialTopTabNavigator({
    Home: {
        screen: HomeComponent,
        navigationOptions: {
            tabBarLabel: 'Home',
            tabBarIcon: ({ tintColor }) => <Icon name="md-home" color={tintColor} size={24}></Icon>
        }
    },
    Setting: {
        screen: SettingComponent,
        navigationOptions: {
            tabBarLabel: "Setting",
            tabBarIcon: ({ tintColor }) => <Icon name="md-settings" color={tintColor} size={24}></Icon>
        }
    }
},
{
    initialRouteName: 'Setting',
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