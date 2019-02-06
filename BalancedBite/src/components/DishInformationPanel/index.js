import React, { Component } from "react";
import { Image,View, StyleSheet, Text,Alert,Button } from "react-native";
import {StaggeredMotion, spring, presets} from 'react-motion';

class PopUpAnimation extends Component {

    render() {
        let childrenArray=React.Children.toArray(this.props.children);
        let start=[]
        for(i=0;i<childrenArray.length;++i)
            start.push({scale:0})
        return (
            <StaggeredMotion defaultStyles={start}
             styles={prevStyles => {
              return prevStyles.map((_, i) => i === 0
                ? {scale: spring(1)}
                : {scale: spring(prevStyles[i - 1].scale)});
            }}>
            {interpolatingStyle => <View style={
              {flex: 1,
              justifyContent: 'flex-start',
              alignItems:'center'}}>
              {interpolatingStyle.map((item,i)=>{return <View key={i} style={{transform:[item]}}>{childrenArray[i]}</View>})}
            </View>}
          </StaggeredMotion>
        );
    }
}

class DishInformationPanel extends Component {

    static navigationOptions = {
        title: "DishInformation"
    }
    render() {
        return (
            <PopUpAnimation>
                <Image  roundAsCircle={true}
                        resizeMode={'stretch'}
                        style={styles.dishImage}
                        source={{uri:"https://www.tasteofhome.com/wp-content/uploads/2018/03/exps6086_HB133235C07_19_4b_WEB-696x696.jpg"}}>
                        </Image>
                <Text style={styles.dishTitle}>{this.props.navigation.getParam('dish_name', 'NULL pie')}</Text>
                <Text style={styles.calTag}>{this.props.navigation.getParam('cal', '0')} cals</Text>
                <View style={styles.buttonContainer}>
              <Button style={styles.button} title="Recipe"></Button>
              <Button style={styles.button} title="Get it fast!"></Button>
                </View>
               </PopUpAnimation>
        );
    }
}


const font_size = 18;
const styles = StyleSheet.create({
    dishImage:
    {
        width:300,
        height:300,
        borderRadius: 15
    },
    dishTitle:
    {
        fontSize: 30,
        fontWeight:'bold',
        color:'#000000',
        textAlign:'center'
    },
    calTag:
    {
        fontSize: font_size,
        color:'#000000',
        textAlign:'center'
    },
    buttonContainer:
    {
        width:300, height:200,
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    button:
    {
        
    }


});




export default DishInformationPanel;