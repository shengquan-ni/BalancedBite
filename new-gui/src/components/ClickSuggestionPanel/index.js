import React, { Component } from "react";

import { View, StyleSheet, AsyncStorage, Platform, 
    StatusBar, Dimensions, Animated, Image, PanResponder } from "react-native";
import { SERVER_URL } from "../../commons/serverRequest";
import { Button, Text } from "react-native-elements";

import { connect } from "react-redux";
import { withNavigation, SafeAreaView } from "react-navigation";
import { Ionicons } from '@expo/vector-icons';

const SESSION_URL = SERVER_URL + "/check-session";
import { mapDispatchToProps, mapStateToProps } from "../../commons/redux";

const Users = [
    {id : '1', uri: require('../../images/1.jpg')},
    {id : '2', uri: require('../../images/2.jpg')},
    {id : '3', uri: require('../../images/3.jpg')}
]

const SCREEN_HEIGHT = Dimensions.get('screen').height
const SCREEN_WIDTH = Dimensions.get('screen').width

const SCREEN_STATUS_HEIGHT = Platform.OS == "android" ? StatusBar.currentHeight : 0

class ClickSuggestionComponent extends Component {
    
    static navigationOptions = {
        header: null
    }

    constructor(props){
        super(props);
        this.state = {
            checkedToken : false,
            currentIndex: 0
        }

        this.position = new Animated.ValueXY()
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
                this.setState({checkedToken: true})
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

    componentWillMount(){
        const { navigation } = this.props;
        // listen to navigation focus on this screen
        this.focusListener = navigation.addListener("didFocus", () => {
            this.handleUserSessionCall();
        });


        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder:(evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                this.position.setValue({x: gestureState.dx, y: gestureState.dy})
            },
            onPanResponderRelease:(evt, gestureState) => {

            }
        });
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

    renderUsers() {
        return Users.map((item, i) => {
            return (
                <Animated.View 
                {...this.PanResponder.panHandlers}
                key={item.id} style={[{transform: this.position.getTranslateTransform()},
                    {height: SCREEN_HEIGHT - SCREEN_STATUS_HEIGHT - 100
                    ,width: SCREEN_WIDTH, padding: 20, position: 'absolute'}]}>
                    <Image 
                    style={{flex: 1, height: null, width: null, borderRadius: 20, resizeMode:"cover"}}
                    source={item.uri}>
                    </Image>

                </Animated.View>
            );
        }).reverse();
    }

    navigateToFoodConfirm() {
        this.props.navigation.navigate("confirmFoodPanel", {
            food: "Chocolate-Peanut Butter Protein Shake"
        })
    }

    render() {
        if (!this.state.checkedToken) {
            return (<Text>Still checking your token</Text>);
        }
        return (
            <SafeAreaView style={styles.outContainer}>
                <View style={styles.topButtonView}>
                    <Button
                        title="go to user"
                        icon={this.getUserInformationIcon()}
                        onPress={()=>{this.navigateToUserInformation()}}
                        containerStyle={styles.topButton}
                    ></Button>
                    <Button
                        title="go to food"
                        containerStyle={styles.topButton}
                        onPress={()=>{this.navigateToFoodConfirm()}}
                    >
                    </Button>
                </View>
                <View style={styles.container}>
                    <View style={{flex: 1}}>
                        {this.renderUsers()}
                    </View>
                    <View style={{height: 30}}>

                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(ClickSuggestionComponent));

const styles = StyleSheet.create({
    outContainer: {
        flex: 1,
        paddingTop: SCREEN_STATUS_HEIGHT
    },
    container: {
        flex: 1
    },
    topButtonView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    topButton: {
        width: 100
    }
})