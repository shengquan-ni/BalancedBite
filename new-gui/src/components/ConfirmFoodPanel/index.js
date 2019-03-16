import { mapStateToProps, mapDispatchToProps } from "../../commons/redux";
import { SERVER_URL } from "../../commons/serverRequest";
import { connect } from "react-redux";

import React, { Component } from "react";
import { Button, CheckBox, Input, Text, Image } from "react-native-elements";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";

const FETCH_FOOD_URL = SERVER_URL + "/food-detail";

class ConfirmFoodPanel extends Component {

    constructor(props){
        super(props);
        this.state = {
            fetched: false,
            food: null,
            confirmed: false
        }
    }

    loadFoodInfo(foodName) {
        // TODO: get token and food name from previous clickSuggestionPanel
        fetch(FETCH_FOOD_URL, {
            method: "POST",
            body: JSON.stringify({token : this.props.currentToken, name: foodName}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(res => {
            console.warn(res);
            if (res.code == 1) {
                this.setState({food: res.food, fetched: true});
            } else {
                this.props.navigation.navigate("loginPanel");
            }
        })
        .catch(error => console.warn(error));
    }

    getComments(comments) {
        return comments.map(function(item, i) {
            return (
                <View style={styles.commentView} key={i}>
                    <Text style={styles.foodDescription}>Author: {item.author}</Text>
                    <Text style={styles.foodDescription}>Rating: {item.rating}</Text>
                    <Text style={styles.foodDescription}>Date: {item.date}</Text>
                    <Text style={styles.foodDescription}>Comment: {item.comment}</Text>                    
                </View>
                )
        })
    }

    getIngredients(ingredients) {
        return ingredients.map(function(item, i) {
            return (
                <View style={styles.ingredientView} key={i}>
                    <Text style={styles.foodDescription}>{item}</Text>               
                </View>
                )
        })
    }

    confirmFood() {
        // TODO: send request to backend to confirm food and add food, calories to user

        this.setState({confirmed: true});
    }

    navigateToRecipes() {
        // console.warn("go to recipe");
        // TODO: navigate to recipe
        // https://reactnavigation.org/docs/en/params.html
        //
        this.props.navigation.navigate("recipePanel", {
            food: this.state.food
        })
    }

    navigateToMap() {
        console.warn("go to map");
        // TODO: this.props.navigation.navigate("mapPanelName");
    }

    getButtons() {
        if (this.state.confirmed == false) {
            return (
                <Button 
                    title="Confirm"
                    buttonStyle={styles.confirmButton}
                    titleStyle={styles.buttonTitleStyle}
                    onPress={()=> this.confirmFood()}
                >
                </Button>
            )
        } else {
            return (
                <View style={styles.confirmedButtonsView}>
                    <Button
                        title="Recipe"
                        buttonStyle={styles.recipeButton}
                        titleStyle={styles.buttonTitleStyle}
                        onPress={()=>this.navigateToRecipes()}
                    >
                    </Button>
                    <Button
                        title="Location"
                        buttonStyle={styles.mapButton}
                        titleStyle={styles.buttonTitleStyle}
                        onPress={()=>this.navigateToMap()}
                    >
                    </Button>
                </View>
            );
        }
    }

    getLayOut() {
        if (this.state.fetched == false) {
            return (
                <View style={styles.placeHolderContainer}>
                    <Text>Loading Dish Detail</Text>
                </View>
            );
        } else {
            return (
                <View>
                    <View style={styles.titleView}>
                        <Text style={styles.foodTitle}>{this.state.food.title}</Text>
                    </View>
                    <Image
                        style={styles.imageStyle}
                        source={{ uri: this.state.food.image_url}}
                        resizeMode="cover"
                        >
                    </Image>
                    <View style={styles.descriptionView}>
                        <Text style={styles.descriptionTitle}>Summary</Text>
                    </View>
                    <View><Text style={styles.foodDescription}>{this.state.food.summary}</Text></View>
                    <View style={styles.descriptionView}>
                        <Text style={styles.descriptionTitle}>Cals</Text>
                    </View>
                    <View><Text style={styles.foodDescription}>{this.state.food.cals}</Text></View>
                    <View style={styles.descriptionView}>
                        <Text style={styles.descriptionTitle}>Preparation Time:</Text>
                    </View>
                    <View><Text style={styles.foodDescription}>{this.state.food.prep_time}</Text></View>
                    <View style={styles.descriptionView}>
                        <Text style={styles.descriptionTitle}>Total Time:</Text>
                    </View>
                    <View><Text style={styles.foodDescription}>{this.state.food.total_time}</Text></View>
                    <View style={styles.descriptionView}>
                        <Text style={styles.descriptionTitle}>Tags:</Text>
                    </View>
                    <View style={styles.foodIngredientsView}>
                        {this.getIngredients(this.state.food.tags)}
                    </View>

                    <View style={styles.descriptionView}>
                        <Text style={styles.descriptionTitle}>Comments:</Text>
                    </View>
                    <View style={styles.foodCommentsView}>
                        {this.getComments(this.state.food.comments)}
                    </View>
                    {this.getButtons()}
                </View>
            );
        }
    }
    
    componentDidMount() {
        const { navigation } = this.props;
        const foodName = navigation.getParam("food");
        this.loadFoodInfo(foodName);
    }

    render() {
        return (
            <ScrollView style={styles.scrollContainer}>
                {this.getLayOut()}
            </ScrollView>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ConfirmFoodPanel);

const paddingValue = 4;

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1
    },
    placeHolderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        paddingRight: paddingValue,
        paddingLeft: paddingValue,
        paddingBottom: paddingValue,
        flexGrow: 1,
    },
    imageStyle: {
        width: Dimensions.get('screen').width, 
        height: Dimensions.get('screen').width
    },
    titleView: {
        justifyContent:'center',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#F0963D'
    },
    foodTitle: {
        fontSize: 24, 
        fontFamily: 'sans-serif-condensed', 
        fontWeight: 'bold',
        textAlign: 'center'
    },
    descriptionView : {
        padding: 2,
        backgroundColor: '#C9E055',
    },
    descriptionTitle: {
        fontSize: 22,
        fontFamily: 'sans-serif-condensed', 
        fontWeight: 'bold',
    },
    foodDescription: {
        fontSize: 20,
        fontFamily: 'sans-serif-condensed',
        padding: 5
    },
    foodIngredientsView: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    ingredientView: {
        width: Dimensions.get('screen').width / 2 - paddingValue - 10,
        borderRadius: 10,
        margin: 2,
        padding: 1
    },
    foodCommentsView: {

    },
    commentView: {
        borderBottomWidth: 1,
        borderBottomColor: 'black'
    },
    confirmButton: {
        borderRadius: 20,
        backgroundColor: '#65C043',
        marginVertical: 5
    },
    recipeButton: {
        borderRadius: 20,
        backgroundColor: '#F25B3B',
        marginVertical: 5
    },
    mapButton: {
        borderRadius: 20,
        backgroundColor: '#359436',
        marginVertical: 5
    },
    buttonTitleStyle: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    confirmedButtonsView: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly'
    }
})