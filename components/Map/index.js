import React, {Component} from 'react';
import {StyleSheet, View, PermissionsAndroid, TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import {Icon} from 'native-base';
import Search from '../Search';
import Directions from '../Directions';



export default class Map extends Component{
  state = {
    region: null,
    destination: null,
  };

  async requestLocationPermission() {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )
    return granted === PermissionsAndroid.RESULTS.GRANTED
  }

  async componentDidMount() {
    const granted = this.requestLocationPermission();
      if (granted) {
        Geolocation.getCurrentPosition(
          ({coords: { latitude, longitude}}) => {
              this.setState({ region:{ 
                latitude,
                longitude,
                latitudeDelta:0.0143,
                longitudeDelta:0.0134
              } 
            });
          },
          () => {},
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
        );
        
      }
        
  }
  
  handleLocationSelected = (data, {geometry}) => {
    const {location: {lat: latitude, lng:longitude} }=geometry;
    this.setState({
      destination: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text,
      },
    })
  }

  _toggleDrawer = async () => {
    this.props.navigation.toggleDrawer();
  };

  render() {
    let { region, destination } = this.state;

    return (
      <View style={styles.container}>
      <View
          style={{
            position:'absolute',
            height:54,width:54,
            top:40,
            left:20,
            backgroundColor:'white',
            zIndex:100,
            alignItems:'center',
            justifyContent: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { x:0 , y:0 },
            shadowRadius: 15,
            borderWidth: 1,
            borderColor: "#DDD",
            borderRadius:10
          }}
        >
          <TouchableOpacity
            onPress={()=>this._toggleDrawer()}
            style={{height:54, width:54, justifyContent:'center', alignItems:'center'}}
          >
            <Icon name="md-menu" style={{color:'black', fontSize: 30}}/>
          </TouchableOpacity>
      </View>
      <MapView
        region={region}
        showsCompass={true}
        rotateEnabled={false}
        style={styles.map}
        showsUserLocation
        showsMyLocationButton={false}
        loadingEnabled
        ref={el => this.mapView = el}
      >
        { destination && (
          <Directions 
            origin={region}
            destination={destination}
            onReady={result =>{
              this.mapView.fitToCoordinates(result.coordinates,{
                edgePadding:{
                  right: 25,
                  left: 25,
                  top:25,
                  bottom: 25,
                }
              });
            }}
          />
        )}
      </MapView>
      < Search onLocationSelected={this.handleLocationSelected}/>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,  
  },
});