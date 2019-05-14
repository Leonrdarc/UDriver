import React, {Component} from 'react';
import {StyleSheet, View, PermissionsAndroid} from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import Search from '../Search';
import Directions from '../Directions';
import MenuButton from '../MenuButton';


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
    };

    this.updateDriver = this.updateDriver.bind(this);

    this.socket = SocketIOClient('http://localhost:3000');
    this.socket.on('updateLocationDriver', this.updateDriver);
  }

  updateDriver(location){
    this.setState({lat: location.lat, long: location.long })
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
      </MapView>
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