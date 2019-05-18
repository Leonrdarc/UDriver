import React, {Component} from 'react';
import {StyleSheet, View, PermissionsAndroid, TouchableOpacity, Dimensions, Text, Platform} from 'react-native';
import MapView, {AnimatedRegion, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import io from 'socket.io-client';

import Search from '../Search';
import Directions from '../Directions';
import MenuButton from '../MenuButton';

import flagPinkImg from '../../assets/diomej.jpg';

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.414978;
const LONGITUDE = -122.058499;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Map extends Component{

  constructor(props) {
    super(props);
    this.state = {
      region: null,
      destination: null,
      messages: [],
      userId: null,
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }),
      markers: [

      ],
    };

    this.updateDriver = this.updateDriver.bind(this);

    this.socket = io('http://192.168.1.72:3000');
    this.socket.on('updateLocationDriver', this.updateDriver);
  }

  updateDriver(location){
    let index = this.state.markers.findIndex(x => x.key === location.key);
    if(index === -1){
      this.setState({
        markers: [
          ...this.state.markers,
          ...this.generateMarkers(location),
        ],
      });
    }
    else{
      this._animateMarker(location);
    }
  }

  

  generateMarkers(fromCoordinate) {
    const result = [];
    const newMarker = {
      coordinate: {
        latitude: parseFloat(fromCoordinate.lat),
        longitude: parseFloat(fromCoordinate.lon),
      },
      key: fromCoordinate.key,
    }
    result.push(newMarker);
    return result;
  }

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

  _animateMarker = async (driver) => {
    this.refsCollection[driver.key]._component.animateMarkerToCoordinate({
      latitude: parseFloat(driver.lat),
      longitude: parseFloat(driver.lon),
      latitudeDelta: 0,
      longitudeDelta: 0,
    }, 300)
  };

  refsCollection = {};

  render() {
    let { region, destination } = this.state;

    return (
      <View style={styles.container}>
      <MenuButton navigation={this.props.navigation}/>
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
        {this.state.markers.map(marker => (
            <Marker.Animated
              title={marker.key}
              image={flagPinkImg}
              key={marker.key}
              coordinate={marker.coordinate}
              ref={(instance)=>{this.refsCollection[marker.key] = instance;}}
            />
          ))}
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