import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, Linking  } from 'react-native';
import { SERVER_URL } from "../../commons/serverRequest";
import { Button } from "react-native-elements";

import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import { Ionicons } from '@expo/vector-icons';


const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const Foods = [
  { id: "1", uri: require('./assets/1.jpg') },
  { id: "2", uri: require('./assets/2.jpg') },
  { id: "3", uri: require('./assets/3.jpg') },
  { id: "4", uri: require('./assets/4.jpg') },
  { id: "5", uri: require('./assets/5.jpg') },
]
const SESSION_URL = SERVER_URL + "/check-session";
import { mapDispatchToProps, mapStateToProps } from "../../commons/redux";

class ClickSuggestionComponent extends Component {
     constructor(props) {
    super(props);
    this.renderFoods = this.renderFoods.bind(this);



    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0
    }
    this.rotate = this.position.x.interpolate({
      inputRange:[-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange:['-10deg', '0deg', '10deg'],
      extrapolate:'clamp'
    })

    this.rotateAndTranslate = {
      transform:[{
        rotate:this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange:[-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange:[0, 0, 1],
      extrapolate:'clamp'
    })



    this.dislikeOpacity = this.position.x.interpolate({
      inputRange:[-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange:[1, 0, 0],
      extrapolate:'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
       inputRange:[-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
       outputRange:[1, 0, 1],
       extrapolate:'clamp'
    })

    this.nextCardScale = this.position.x.interpolate({
       inputRange:[-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
       outputRange:[1, 0.8, 1],
       extrapolate:'clamp'
    })
  
  }
    static navigationOptions = {
        header: null
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

    componentDidMount(){
        const { navigation } = this.props;
        // listen to navigation focus on this screen
        this.focusListener = navigation.addListener("didFocus", () => {
            this.handleUserSessionCall();
        })
    }

    componentWillUnmount() {
        this.focusListener.remove();

        this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {

        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {
        if(gestureState.dx>150){
          Animated.spring(this.position, {
            toValue:{x:SCREEN_WIDTH+100,y:gestureState.dy }
          }).start(()=>Linking.openURL('google.navigation:q=100+101')
             //{

            // this.setState({currentIndex:this.state.currentIndex+1}, ()=>{
            //   this.position.setValue({x:0, y:0})

            //})
          //}
        )
          

        }//yelp!!
        else if(gestureState.dx<-150){
          Animated.spring(this.position, {
            toValue:{x:-SCREEN_WIDTH-100,y:gestureState.dy }
          }).start(()=>{
            this.setState({currentIndex:this.state.currentIndex+1}, ()=>{
              this.position.setValue({x:0, y:0})
            })
          })

        }//next!!
        else{
          Animated.spring(this.position, {
            toValue:{x:0, y:0},
            friction:4
          }).start()
        }
      }
    })
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

    renderFoods = () => {

    return Foods.map((item, i) => {
      if(i<this.state.currentIndex){
        return null
      }
      else if(i==this.state.currentIndex){
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id}
            style={[this.rotateAndTranslate,
            { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
            
            <Animated.View style={{opacity:this.likeOpacity, transform:[{rotate:'-30deg'}], position:'absolute', top:50, left:40, zIndex:1000}}>
              <Text style={{borderWidth:1, borderColor:'green', color:'green', fontSize:32, fontWeight:'800', padding:10}}>
                YELP!
              </Text>
            </Animated.View>

             <Animated.View style={{opacity:this.dislikeOpacity,transform:[{rotate:'30deg'}], position:'absolute', top:50, right:40, zIndex:1000}}>
              <Text style={{borderWidth:1, borderColor:'red', color:'red', fontSize:32, fontWeight:'800', padding:10}}>
                NEXT!
              </Text>
            </Animated.View>
            
            <Image
              style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
              source={item.uri} />

          </Animated.View>
        )
      }
      else{
         return (
          <Animated.View
           
            key={item.id} style={[{opacity:this.nextCardOpacity, transform:[{scale:this.nextCardScale}], height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>

            <Image
              style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
              source={item.uri} />

          </Animated.View>
        )
      }

      
    }).reverse()
  }

   render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 60 }}>

        </View>
        <View style={{ flex: 1 }}>
          {this.renderFoods()}
        </View>
        <View style={{ height: 60 }}>

        </View>


      </View>

    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(ClickSuggestionComponent));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

