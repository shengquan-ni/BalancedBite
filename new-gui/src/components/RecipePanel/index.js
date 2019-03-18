import { mapStateToProps, mapDispatchToProps } from "../../commons/redux";
import { connect } from "react-redux";

import React, { Component } from "react";
import { Text, Image } from "react-native-elements";
import { View, ScrollView, StyleSheet, Dimensions, Platform } from "react-native";

class RecipePanel extends Component
{
    componentWillMount()
    {
        const { navigation } = this.props;
        const food = navigation.getParam('food', null);
        this.setState({"food":food});
    }

    static navigationOptions = {
        title: "Recipe",
        headerTitleStyle: {
          fontWeight: 'bold',
        }
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

    getRecipe(recipe)
    {
        return recipe.map(function(item,i){
            return (
                <View style={styles.recipeView} key={i}>
                    <Text style={styles.foodDescription}>{item}</Text>
                </View>
            )
        })
    }

    render()
    {
        if(this.state.food)
        {
            return (
                <ScrollView style={styles.scrollContainer}>
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
                        <Text style={styles.descriptionTitle}>Servings</Text>
                    </View>
                    <View><Text style={styles.foodDescription}>{this.state.food.servings}</Text></View>
                    <View style={styles.descriptionView}>
                        <Text style={styles.descriptionTitle}>Ingredients:</Text>
                    </View>
                    <View style={styles.foodIngredientsView}>
                        {this.getIngredients(this.state.food.ingredients)}
                    </View>
                    <View style={styles.descriptionView}>
                        <Text style={styles.descriptionTitle}>Instructions:</Text>
                    </View>

                    {this.getRecipe(this.state.food.instructions)}
                </ScrollView>
            );
        }
        else
        {
            return (
            <View style={styles.centerContainer}>
                <Text>Failed to load food Infomation.</Text>
            </View>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipePanel);
const paddingValue = 4;
const styles = StyleSheet.create({
    centerContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleView: {
        justifyContent:'center',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#F0963D'
    },
    foodTitle: {
        fontSize: 24, 
        fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'ArialMT', 
        fontWeight: 'bold',
        textAlign: 'center'
    },
    imageStyle: {
        width: Dimensions.get('screen').width, 
        height: Dimensions.get('screen').width
    },
    descriptionView : {
        padding: 2,
        backgroundColor: '#C9E055',
    },
    descriptionTitle: {
        fontSize: 22,
        fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'ArialMT', 
        fontWeight: 'bold',
    },
    foodDescription: {
        fontSize: 20,
        fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'ArialMT', 
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
    scrollContainer: {
        flex: 1
    },
    recipeView: {
        borderBottomWidth: 1,
        borderBottomColor: 'black'
    },
})