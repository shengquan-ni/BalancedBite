import { mapDispatchToProps, mapStateToProps } from "../../commons/redux";
import React, { Component } from "react";
import { Platform,StatusBar,View,SafeAreaView, Text,Alert, Button, SectionList, StyleSheet, TouchableHighlight,Image,TextInput,Dimensions,ImageBackground } from "react-native";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import { Ionicons } from '@expo/vector-icons';
import { SERVER_URL } from "../../commons/serverRequest";
import Expo from "expo";
import { Pedometer } from "expo";
import Svg from 'react-native-svg';
import { CheckBox,Input } from "react-native-elements";

const FETCH_URL  = SERVER_URL + "/user/fetch-user";
const UPDATE_URL = SERVER_URL + "/user/update-user";

const scaleAvatar=0.4

class EditableLabel extends Component{

    componentWillMount(){
        this.setState({editable:false,myText:this.props.value});
    }

    renderInput()
    {
        if(this.props.type === "number" || this.props.type === "string")
        {
            return (<TextInput 
                        ref={component => this._input = component}
                        textAlign="right"
                        keyboardType={this.props.type==="number"?"numeric":"default"}
                        style={styles.infoText}
                        onChangeText={(text) =>{this.setState({myText:text})}}
                        editable = {this.state.editable}
                        multiline = {false}
                        onEndEditing={()=>{
                            this.setState({editable:false});
                            if(this.props.checker==null || this.props.checker(this.state.myText))
                                this.props.receiver(this.props.fieldName,this.props.type==="number"?parseInt(this.state.myText):this.state.myText);
                            else{
                                this.state.myText=this.props.value;
                                Alert.alert("Error", this.props.errorMessage, [{
                                    text: "Okay"
                                }]);
                            }
                            }}
                        value={this.state.myText}
                    />);
        }
        else if(this.props.type === "boolean")
        {
            return (<View style={{width:"40%"}}>
                    <CheckBox
                        ref={component => this._input = component}
                        right={true}
                        iconRight
                        onPress={()=>{
                            const val=!this.state.myText;
                            this.setState({editable:false,myText:!this.state.myText});
                            if(this.props.checker==null || this.props.checker(val))
                                this.props.receiver(this.props.fieldName,val);
                            else{
                                this.state.myText=this.props.value;
                                Alert.alert("Error", this.props.errorMessage, [{
                                    text: "Okay"
                                }]);
                            }
                            }}
                        checked={this.state.myText}
                        disabled={!this.state.editable}
                    /></View>
            );
        }
        else if(this.props.type === "list")
        {
            return(<TextInput 
                        ref={component => this._input = component}
                        textAlign="right"
                        style={styles.infoText}
                        onChangeText={(text) =>{this.setState({myText:text})}}
                        editable = {this.state.editable}
                        multiline = {false}
                        onEndEditing={()=>{
                            this.setState({editable:false});
                            if(this.props.checker==null || this.props.checker(this.state.myText))
                                this.props.receiver(this.props.fieldName,this.state.myText.split(",").filter(element => element.trim().length > 0));
                            else{
                                this.state.myText=this.props.value;
                                Alert.alert("Error", this.props.errorMessage, [{
                                    text: "Okay"
                                }]);
                            }
                            }}
                        value={this.state.myText}
                    />);
        }
        return null;
    }


    render() {
        return (
            <View style={styles.sectionListItem}>
            <TextInput style={{width:"40%"}} textAlign="left" editable={false} value={this.props.title+": "}></TextInput>
            {this.renderInput()}
            <TextInput style={{width:"10%"}} textAlign="right" editable={false} value={this.props.unit+" "}></TextInput>
            <TouchableHighlight style={{width:"10%",alignSelf:"center"}} onPress={()=>{this.setState({editable:true});this._input.focus?this._input.focus():null;}}>
                <Ionicons style={{alignSelf:"center"}} name="md-create" color='#333333' size={24}></Ionicons>
            </TouchableHighlight>
            </View>
        );
        //else
        //    return ;
    }
}



class UserInformationComponent extends Component {


    fetchStepCountThenGetInformation(){
        const now = new Date();
        const todayMidnight = new Date();
        todayMidnight.setHours(0,0,0,0);
        Pedometer.getStepCountAsync(todayMidnight,now).then(
            result => {
                this.setState({ pastStepCount: result.steps });
                this.getInformation(result.steps);
              },
              error => {
                this.setState({ pastStepCount: "N/A"});
                this.getInformation(0);
              }
            );
    }



    getInformation(stepCount){
        fetch(FETCH_URL, {
            method: "POST",
            body: JSON.stringify({token: this.props.currentToken, stepCount: stepCount}),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.code == 0) {
                console.warn("Error in getting user info");
            } else {
                console.warn(res);
                this.setState({userInfo:res},()=>{this.forceUpdate();});
            }
        })
        .catch(
            error => console.warn(error)
        )
    }

    updateInformation(fieldName,fieldValue){
        fetch(UPDATE_URL, {
            method : "POST",
            body: JSON.stringify({token: this.props.currentToken,fieldName:fieldName,fieldValue:fieldValue}),
            headers : {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(res => {
            if(res.code==0){
                console.warn("Fail to update");
            }else{
                this.fetchStepCountThenGetInformation();
            }
        })
    }

    componentWillMount(){
        Pedometer.isAvailableAsync();
        this.fetchStepCountThenGetInformation();
    }

    isNormalInteger(str) {
        return /^\+?(0|[1-9]\d*)$/.test(str);
    }


    render() {
        if(this.state && this.state.userInfo)
        return (
            <SafeAreaView style={styles.container}>
                <Svg alignSelf="center" width={300*scaleAvatar} height={486*scaleAvatar}>
                <Svg.Rect
                    scale={scaleAvatar}
                    x={0}
                    y={(this.state.userInfo.caloriesNeeded-this.state.userInfo.caloriesTakenCurrently)/this.state.userInfo.caloriesNeeded*486}
                    width={300}
                    height={this.state.userInfo.caloriesTakenCurrently/this.state.userInfo.caloriesNeeded*486}
                    strokeWidth={0}
                    fill="#3CB371"
                />
                <Image style={styles.avatarImage}  source={require('../../images/person.png')}></Image>
                </Svg>
                <Text style={styles.userName}>{this.state.userInfo.username}</Text>
                <SectionList
                    stickySectionHeadersEnabled={true}
                    renderItem={({item, index, section}) => {
                    if(section.title==="Health Infomation")
                    return (<View>
                                <View style={styles.sectionListItem}>
                                <Text style={{width:"40%"}} key={index}>{item[0]+": "}</Text>
                                <Text style={{width:"50%", textAlign:"right"}}>{item[1]+" "+item[2]}</Text>
                                </View>
                                <View style={styles.sectionPadding}></View>
                            </View>);
                    else
                    return (<View>
                            <EditableLabel 
                                title={item[0]} 
                                value={item[1]} 
                                unit={item[2]} 
                                fieldName={item[3]} 
                                checker={item[4]}
                                errorMessage={item[5]}
                                type={item[6]}
                                receiver={(k,v)=>this.updateInformation(k,v)}>
                            </EditableLabel>
                            <View style={styles.sectionPadding}></View>
                        </View>);
                }}
                    renderSectionHeader={({section: {title}}) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                    sections={[
                        {title: 'Health Infomation', data: [["BMI",this.state.userInfo.bmi?this.state.userInfo.bmi.toFixed(2):0,""],
                                                         ["Calories Needed",this.state.userInfo.caloriesNeeded,"Cal(s)"],
                                                         ["Calories Taken",this.state.userInfo.caloriesTakenCurrently,"Cal(s)"],
                                                         ["Foods Eaten",this.state.userInfo.foodsEatenCurrently.join(),""],
                                                         ["Step Count",this.state.pastStepCount,""]]},
                        {title: 'User Infomation', data: [['Age',this.state.userInfo.age.toString(),'','age',(x)=>this.isNormalInteger(x) && parseInt(x)<150,"Age is not valid(1-150)!","number"],
                                                        ['Weight',this.state.userInfo.weight.toString(),'kg','weight',(x)=>this.isNormalInteger(x) && parseInt(x)<1000,"Weight is not valid(1-1000)!","number"],
                                                        ['Height',this.state.userInfo.height.toString(),'cm','height',(x)=>this.isNormalInteger(x) && parseInt(x)<1000,"Height is not valid(1-1000)!","number"],
                                                        ['HealthProblems',this.state.userInfo.healthProblems.join(),"","healthProblems",null,null,"list"],
                                                        ['DislikeFoods',this.state.userInfo.dislikeFoods.join(),"","dislikeFoods",null,null,"list"],
                                                        ['Allergies',this.state.userInfo.allergies.join(),"","alleriges",null,null,"list"],
                                                        ['Workout',this.state.userInfo.workoutBoolean,"","workoutBoolean",null,null,"boolean"],
                                                        ['WorkoutFrequency',this.state.userInfo.workoutFrequency.toString(),"","workoutFrequency",(x)=>this.isNormalInteger(x) && parseInt(x)<=7,"Workout Frequency should be an integer between 0 and 7!","number"],
                                                        ['WorkoutType',this.state.userInfo.workoutType,"","workoutType",null,null,"string"]]},
                    ]}
                    keyExtractor={(item, index) => item + index}
                />
            </SafeAreaView>
        );
        else
        return (
            <View style={styles.centerContainer}>
                <Text>Waiting for data...</Text>
            </View>
        );
    }
}

// connecting props defined in mapState to the component
export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(UserInformationComponent));


const styles = StyleSheet.create({
    centerContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    userName:{
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    },
    infoTitle:
    {
        fontSize: 20,
        fontWeight: 'bold',
    },
    infoText:{
        alignSelf: 'center',
        fontSize: 15,
        width:"40%"
    },
    avatarImage:{
        width:300*scaleAvatar,
        height:486*scaleAvatar
    },
    sectionHeader:{
        backgroundColor : '#20B2AA',
        fontSize : 20,
        padding: 5,
        color: '#fff',
        fontWeight: 'bold'
     },
    sectionListItem:{
        fontSize : 16,
        padding: 10,
        color: '#000',
        backgroundColor : '#FAFAFA',
        flexDirection: 'row',
        shadowOffset:{  width: 10,  height: 10,  },
        shadowColor: 'black',
        shadowOpacity: 1.0,
    },
    sectionPadding:{
        height:1,
        backgroundColor:'#00000088'
    }
})