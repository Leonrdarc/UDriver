import React, {Component} from 'react';
import {StyleSheet, View, PermissionsAndroid, TouchableOpacity, Dimensions, Text, Platform} from 'react-native';
import MapView, {AnimatedRegion, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import Search from '../Search';
import Directions from '../Directions';
import MenuButton from '../MenuButton';

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
      lat: null,
      long: null,
      coordinate: new AnimatedRegion({
	    latitude: LATITUDE,
	    longitude: LONGITUDE,
	    latitudeDelta: 0,
	    longitudeDelta: 0,
      }),
    };

    this.updateDriver = this.updateDriver.bind(this);

    this.socket = SocketIOClient('http://localhost:3000');
    this.socket.on('updateLocationDriver', this.updateDriver);
  }

  updateDriver(location){
    this.setState({lat: location.lat, long: location.long })
  }

  animate() {
    const { coordinate } = this.state;
    const newCoordinate = {
      latitude: 37.414292,
      longitude: -122.089062,
      latitudeDelta: 0,
      longitudeDelta: 0,
    };

    if (Platform.OS === 'android') {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
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
        <Marker.Animated
          ref={marker => { this.marker = marker; }}
          coordinate={this.state.coordinate}
        />
        
      </MapView>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
            onPress={() => this.animate()}
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 18,
              paddingVertical: 12,
              borderRadius: 20, width: 80,
              paddingHorizontal: 12,
              alignItems: 'center',
              marginHorizontal: 10,}}
          >
            <Text>Animate</Text>
        </TouchableOpacity>
      </View>
      < Search onLocationSelected={this.handleLocationSelected}/>
      <View style={{justifyContent: 'center', alignItems:'center', backgroundColor:'black'}}>
          <Text style={{color:'white', fontSize:20}}>
            {this.state.lat}/{this.state.long}
          </Text>
      </View>
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