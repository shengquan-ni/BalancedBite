import React, { Component } from "react";

import { View, StyleSheet, AsyncStorage, Platform, 
    StatusBar, Dimensions, Animated, Image, PanResponder } from "react-native";
import { SERVER_URL } from "../../commons/serverRequest";
import { Button, Text } from "react-native-elements";

import { connect } from "react-redux";
import { SafeAreaView, withNavigation } from "react-navigation";
import { Ionicons } from '@expo/vector-icons';

import { mapDispatchToProps, mapStateToProps } from "../../commons/redux";

// used for http request to backend
const SESSION_URL = SERVER_URL + "/check-session";
const RECOMMENDATION_URL = SERVER_URL + "/recommendation";

// used for animation
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_STATUS_HEIGHT = Platform.OS == "android" ? StatusBar.currentHeight : 0;

class ClickSuggestionComponent extends Component {
    
    static navigationOptions = {
        header: null
    }

    constructor(props){
        super(props);
        this.state = {
            checkedToken : false,
            currentIndex: 0,
            recommendations: [
                {image_url: '../../images/1.jpg'}
            ],
            recommendationsCount : 0,
            offset: 0
        }

        this.position = new Animated.ValueXY();

        this.rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            outputRange: ['-10deg', '0deg', '10deg'],
            extrapolate: 'clamp'
        });

        this.rotateAndTranslate = {
            transform: [{
                rotate: this.rotate
            },
            ...this.position.getTranslateTransform()
            ]
        }

        this.likeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp'
        });

        this.dislikeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            outputRange: [1, 0, 0],
            extrapolate: 'clamp'
        });


        this.nextCardOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp'
        });

        this.nextCardScale = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            outputRange: [1, 0.8, 1],
            extrapolate: 'clamp'
        });
    }

    getMealType() {
        const hour = new Date().getHours()
        if (hour < 6) {
            return "other";
        } else if (hour < 10) {
            return "breakfast";
        } else if (hour < 14) {
            return "lunch";
        } else if (hour < 18) {
            return "other";
        } else if (hour < 22) {
            return "dinner";
        } else {
            return "other";
        }
    }

    fetchRecommendations() {
        fetch(RECOMMENDATION_URL, {
            method: "POST",
            body: JSON.stringify(
                {
                    token: this.props.currentToken, 
                    mealType: this.getMealType(), 
                    offset: this.state.currentIndex + (this.state.offset * 10)
                }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.code == 1) {
                // console.warn(res);
                this.setState({currentIndex: 0, checkedToken: true, 
                    recommendations: res.recommendations, recommendationsCount: res.recommendationsCount});
            } else {
                console.warn("error in request");
            }
        })
        .catch(error => console.warn(error));
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
                this.fetchRecommendations();
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
        })


        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder:(evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                this.position.setValue({x: gestureState.dx, y: gestureState.dy})
            },
            onPanResponderRelease:(evt, gestureState) => {
                if (gestureState.dx > 120) {
                    this.navigateToFoodConfirm(this.state.recommendations[this.state.currentIndex].title);
                    Animated.spring(this.position, {
                        toValue: {x: 0, y: 0},
                        friction: 5
                    }).start();
                } else if (gestureState.dx < -120) {
                    this.position.setValue({x: 0, y:0});
                    this.setState({currentIndex: this.state.currentIndex + 1}, ()=> {
                        if (this.state.currentIndex == this.state.recommendationsCount) {
                            this.setState({offset: this.state.offset + 1, currentIndex: 0}, () => {
                                this.fetchRecommendations();
                            });
                        }
                    });

                    // Slow animation, about 2 seconds delay every time

                    // console.warn("release");
                    // Animated.spring(this.position, {
                    //     toValue: {x: -SCREEN_WIDTH - 100, y: gestureState.dy}
                    // }).start(() => {
                    //     console.warn("animated");
                    //     this.position.setValue({x: 0, y:0});
                    //     console.warn("set");
                    //     this.setState({currentIndex: this.state.currentIndex + 1}, ()=> {
                    //         if (this.state.currentIndex == this.state.recommendationsCount) {
                    //             this.setState({offset: this.state.offset + 1, currentIndex: 0}, () => {
                    //                 this.fetchRecommendations();
                    //             });
                    //         }
                    //     })
                    //     console.warn("checked");
                    // })
                } else {
                    Animated.spring(this.position, {
                        toValue: {x: 0, y: 0},
                        friction: 4
                    }).start();
                }
            }
        });
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

    renderRecommendations() {
        return this.state.recommendations.map((item, i) => {
            if (i < this.state.currentIndex) {
                return null;
            }
            else if (i == this.state.currentIndex) {
                return (
                    <Animated.View 
                        {...this.PanResponder.panHandlers}
                        key={i} style={[this.rotateAndTranslate,
                        {height: SCREEN_HEIGHT - SCREEN_STATUS_HEIGHT - 100
                        ,width: SCREEN_WIDTH, padding: 10, position: 'absolute'}]}>
                        
                        <View style={styles.imageLabelView}>
                            <Text style={styles.imageLabel}>
                                {item.title}
                            </Text>
                        </View>

                        <Animated.View style={{ opacity: this.likeOpacity, transform: [{rotate: '-30deg'}], 
                            position: 'absolute', top: 100, left: 40, zIndex: 1000}}>
                            <Text style={styles.likeAnimatedText}>
                                LIKE
                            </Text>
                        </Animated.View>
                        <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{rotate: '30deg'}], 
                            position: 'absolute', top: 100, right: 40, zIndex: 1000}}>
                            <Text style={styles.disLikeAnimatedText}>
                                NOPE
                            </Text>
                        </Animated.View>
                        
                        <Image 
                            style={styles.recommendationImage}
                            source={{ uri: item.image_url}}>
                        </Image>
    
                    </Animated.View>
                );    
            } else if (i - 1 == this.state.currentIndex) {
                return (
                    <Animated.View 
                        key={i} style={[
                        {opacity: this.nextCardOpacity, transform: [{scale: this.nextCardScale}], 
                            height: SCREEN_HEIGHT - SCREEN_STATUS_HEIGHT - 100,
                            width: SCREEN_WIDTH, padding: 10, position: 'absolute'}]}>
                        
                        <View style={styles.imageLabelView}>
                            <Text style={styles.imageLabel}>
                                {item.title}
                            </Text>
                        </View>

                        <Image 
                            style={styles.recommendationImage}
                            source={{ uri: item.image_url}}
                            resizeMode="cover"
                        >
                        </Image>
    
                    </Animated.View>
                );
            } else {
                return (
                    <Animated.View 
                        key={i} style={[
                        {opacity: this.nextCardOpacity, transform: [{scale: this.nextCardScale}], 
                            height: SCREEN_HEIGHT - SCREEN_STATUS_HEIGHT - 100,
                            width: SCREEN_WIDTH, padding: 10, position: 'absolute'}]}>

                        <Image 
                            style={styles.recommendationImage}
                            source={{ uri: item.image_url}}
                            resizeMode="cover"
                        >
                        </Image>
    
                    </Animated.View>
                );
            }
        }).reverse();
    }

    navigateToFoodConfirm(foodName) {
        this.props.navigation.navigate("confirmFoodPanel", {
            food: foodName,
            confirmed: false
        })
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    render() {
        if (!this.state.checkedToken) {
            return (<View style={{flex: 1,alignItems: 'center',justifyContent:"center"}}><Text>Still checking your token</Text></View>);
        }
        return (
            <SafeAreaView style={styles.outContainer}>
                <View style={styles.topButtonView}>
                    <Button
                        title=""
                        icon={this.getUserInformationIcon()}
                        onPress={()=>{this.navigateToUserInformation()}}
                        containerStyle={styles.topButton}
                        titleStyle={styles.topButtonTitle}
                        buttonStyle={styles.topButtonStyle}
                    ></Button>
                </View>
                <View style={styles.container}>
                    <View style={{flex: 1}}>
                        {this.renderRecommendations()}
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(ClickSuggestionComponent));

const outPadding = 10;
const styles = StyleSheet.create({
    outContainer: {
        flex: 1,
        paddingTop: SCREEN_STATUS_HEIGHT
    },
    container: {
        flex: 1
    },
    topButtonView: {
        paddingTop: outPadding,
        paddingLeft: outPadding,
        paddingRight: outPadding
    },
    topButton: {
        width: 50
    },
    topButtonStyle: {
        borderRadius: 10,
        backgroundColor: '#52C854'
    },
    topButtonTitle: {
        fontSize: 16
    },
    recommendationImage: {
        flex: 1, 
        height: null, 
        width: null, 
        borderRadius: 20, 
        resizeMode:"cover"
    },
    likeAnimatedText: {
        borderWidth: 1, 
        borderColor: 'green', 
        color:'green',
        fontSize: 32, 
        fontWeight:'800', 
        padding: 10
    },
    disLikeAnimatedText: {
        borderWidth: 1, 
        borderColor: 'red', 
        color:'red',
        fontSize: 32, 
        fontWeight:'800', 
        padding: 10
    },
    imageLabelView: {
        padding: 2,
        position: 'absolute', 
        top: 40, 
        left: 40, 
        zIndex: 1000, 
        width: 300, 
        backgroundColor: 'rgba(164, 166, 164, 0.6)'
    },
    imageLabel: {
        fontWeight: 'bold', 
        fontSize: 28
    }
})