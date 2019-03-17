import React, { Component } from "react";
import { Permissions, Location, MapView } from 'expo';
import { mapStateToProps, mapDispatchToProps } from "../../commons/redux";
import { connect } from "react-redux";
import { ActivityIndicator, View, StyleSheet, Linking, Text, Image, Button } from "react-native";
import axios from "axios"
import getDirections from 'react-native-google-maps-directions';

const searchDelta=0.2
const searchLimit=6;

class YelpMapPanel extends Component
{
    constructor(){
        super();
        this.state={
            isLoading:true,
            deltas:{
                lat:0.5,
                long:0.5
            }
        }
        config = {
            headers: {
                //Authorization: 'Bearer 34zHxFWKDGN7VJvwa1yHknyZkV0Qvg4IgtQI-rpZONWfLsmqGrqFGMXGHE7LeJZ0wWfG7Cpe3t_ef6WtdfujQHJ7jER6w6-kUTRj7HpA2oXN8K3dcQR56Iyn_GmNXHYx',
            },
            params: {
                // term: "food", 
                // radius: 40000, 
                // latitude: 0, 
                // longitude: 0, 
                // sort_by: 'distance', 
                // limit: 10, 
                find_desc:"food"
            },
        };
    }


    async requestLocationPermission() {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({
                enableHighAccuracy: true,
            });
            config.params.l = "g:"+(location.coords.longitude+searchDelta)+","
                                  +(location.coords.latitude+searchDelta)+","
                                  +(location.coords.longitude-searchDelta)+","
                                  +(location.coords.latitude-searchDelta);
            this.setState({origin:location.coords},()=>this.fetchFoodData());
        }
    }

    fetchFoodData() {
        return axios
          .get('https://www.yelp.com/search/snippet', config)
          .then(responseJson => {
            const results=responseJson.data.searchPageProps.searchResultsProps.searchResults;
            const markers=responseJson.data.searchPageProps.searchMapProps.mapState.markers;
            let combined=[];
            for(let x in results)
            {
                let item=results[x];
                if(item.markerKey-1<searchLimit)
                    combined[item.markerKey-1]=item.searchResultBusiness
            }
            for(let x in markers)
            {
                let item=markers[x];
                if(typeof item.key==="number" && item.key-1<searchLimit)
                {
                    combined[item.key-1].location=item.location;
                }
            }

            this.setState({
                isLoading:false,
                markers: combined,
            });
          })
          .catch(error => {
            console.log(error);
          });
      }

    componentWillMount(){
        const { navigation } = this.props;
        const foodName = navigation.getParam('foodName', 'milk');
        config.params.find_desc=foodName;
        this.requestLocationPermission();
    }

    openGoogleMap(destination) {
        const data = {
            source: {
                latitude: this.state.origin.latitude,
                longitude: this.state.origin.longitude
            },
            destination: {
                latitude: destination.latitude,
                longitude: destination.longitude
            },
            params: [
                {
                  key: "travelmode",
                  value: "driving"        // may be "walking", "bicycling" or "transit" as well
                },
                {
                  key: "dir_action",
                  value: "navigate"       // this instantly initializes navigation using the given travel mode 
                }
            ]
        }

        getDirections(data);
    }

    getMapMarkers() {
        if (this.state.isLoading) {
            return null;
        }

        return this.state.markers.map((marker, idx) => {
            if (!marker) return null;
            const coords = {
                latitude: marker.location.latitude,
                longitude: marker.location.longitude
            };
            const nameOfMarker = `${marker.name}(${marker.rating}⭐)`;
            const addressOfMarker = `${marker.formattedAddress}`;
            return (
                <MapView.Marker
                    key = {idx}
                    coordinate={coords}
                    title={nameOfMarker}
                    description={addressOfMarker}
                    onCalloutPress={() => this.openGoogleMap(coords)}
                >
                </MapView.Marker>
            )
        });
    }

    render(){
        if(this.state && this.state.origin)
        {
            if(this.state.isLoading)
                return(
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>);
            else    
                return (
                <MapView
                    style={{ flex: 1 }}
                    provider="google"
                    region={{
                    latitude: this.state.origin.latitude,
                    longitude: this.state.origin.longitude,
                    latitudeDelta: searchDelta,
                    longitudeDelta: searchDelta,
                }}
                >
                    {this.getMapMarkers()}
                    <MapView.Marker coordinate={this.state.origin}>
                        <Image source={require('../../images/icon_man.png')}>
                        </Image>
                    </MapView.Marker>
                </MapView>
                );
        }
        else
        {
            return (
            <View style={styles.centerContainer}>
                <Text style={{textAlign:"center"}}>Trying to get location information...</Text>
                <Text style={{textAlign:"center"}}>Make sure Location Service is available and the permission is granted.</Text>
            </View>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(YelpMapPanel);

const styles = StyleSheet.create({
    centerContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingContainer:{
        width:"40%",
        height:"20%",
        backgroundColor : '#4169E188',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingFont:{
        fontSize: 22,
        fontWeight: 'bold',
        textAlign:"center"
    }
});