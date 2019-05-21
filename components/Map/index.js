import React, {Component} from 'react';
import {StyleSheet, View, PermissionsAndroid, TouchableOpacity, Dimensions, Text, Platform, Image} from 'react-native';
import MapView, {AnimatedRegion, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import io from 'socket.io-client';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {NavigationEvents} from 'react-navigation';

import Search from '../Search';
import Directions from '../Directions';
import MenuButton from '../MenuButton';

import taxi from '../../assets/taxi.png';
import originMark from '../../assets/location-pin.png'
import flagMark from '../../assets/flag.png'


const screen = Dimensions.get('window');
const API_URL = 'http://192.168.1.72:3000'
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.414978;
const LONGITUDE = -122.058499;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const items = [
  //name key is must.It is to show the text in front
  //Suerte, la necesitarás (?)
  { id: 1, name: 'Circunvalar-Universidades' },
  { id: 2, name: 'Miramar-Universidades' },
];

export default class Map extends Component{

  constructor(props) {
    super(props);
    this.state = {
      region: null,
      origin:null,
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
      routeDrivers:[

      ],
      routeSelected: null,
    };

    this.updateDriver = this.updateDriver.bind(this);
    this.socket = this.props.socket;
    
  }

  updateDriver(location){
    alert(this.state.routeSelected)
    let index = this.state.markers.findIndex(x => x.key === location.key);
    if(!this.state.routeSelected){
      if(index===-1){
      this.setState({
        markers: [
          ...this.state.markers,
          ...this.generateMarkers(location),
        ],
      })
        this._animateMarker(location);
    }else{
      marker =this.state.markers
      C = marker.filter(function(val) {
        // return this.state.routeDrivers.indexOf(val.key) != -1;
       });
      this.setState({markers: C})
      this._animateMarker(location);
      }
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
    this.socket = await io(API_URL, {reconnection: false ,query: 'auth_token='+this.props.jwt});
    // Connection failed
    this.socket.on('error', function(err) {
      alert('No se pudo autenticar')
    });
    
    this.socket.on('connect_error', () => {alert('No se pudo autenticar')});

    // Connection succeeded
    this.socket.on('success',()=>{})

    this.socket.on('updateLocationDriver', this.updateDriver);

    const granted = await this.requestLocationPermission();
      if (granted) {
        await Geolocation.getCurrentPosition(
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

  componentWillUnmount(){
    this.socket.close();
  }
  
  // handleLocationSelected = (data, {geometry}) => {
  //   const {location: {lat: latitude, lng:longitude} }=geometry;
  //   this.setState({
  //     destination: {
  //       latitude,
  //       longitude,
  //       title: data.structured_formatting.main_text,
  //     },
  //   })
  // }

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

  async handleSelectedRoute(item){
    const {id}= item;
    if(id===1){
      this.setState({
        origin:{
          latitude:11.020221, 
          longitude:-74.871427
        },
        destination:{
          latitude:10.923450, 
          longitude:-74.799546
        },
        routeSelected: true,
      });
    }else{
      this.setState({
        origin:{
          latitude:11.020221, 
          longitude:-74.871427
        },
        destination:{
          latitude:11.003087, 
          longitude:-74.834960
        },
        routeSelected: true,
      });
    }
    this.socket.emit('GetRouteDrivers', id)
    await this.socket.on('RouteDrivers', (drivers)=>{
      
      C = this.state.markers.filter(function(val) {
        return drivers.indexOf(val.key) != -1;
      });
      this.setState({
        routeDrivers: drivers
      })
    })
    
  }

  refsCollection = {};

  render() {
    const {destination, origin} = this.state;
    return (
      <View style={styles.container}>
      {/* <NavigationEvents onDidFocus={() => this._mountc()} /> */}
      <MenuButton style={{
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
            navigation={this.props.navigation}/>
      <MapView
        initialRegion={this.state.region}
        showsCompass={true}
        rotateEnabled={false}
        style={styles.map}
        showsUserLocation
        showsMyLocationButton={false}
        followsUserLocation
        loadingEnabled
        ref={el => this.mapView = el}
      >
        {destination && (
          <Directions 
            origin={origin}
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
          
        )
        }
        {destination && (<Marker  coordinate={this.state.origin} style={{alignItems: 'center',justifyContent:'center'}}><Image
          source={originMark}
          style={{height:40, width:40, resizeMode:'contain'}}/>
          </Marker>)}
        {destination &&(<Marker anchor={{x:0.42,y:0.8}} coordinate={this.state.destination}><Image
          source={flagMark}
          style={{height:40, width:80, resizeMode:'contain'}}/>
          </Marker>)}
        {this.state.markers.map(marker => (
            <Marker.Animated
              title={marker.key}
              anchor={{x:0.5,y:0.5}}
              key={marker.key}
              coordinate={marker.coordinate}
              ref={(instance)=>{this.refsCollection[marker.key] = instance;}}
            >
              <Image
              source={taxi}
              style={{height:40, width:80, resizeMode:'contain'}}/>
            </Marker.Animated>
        ))}

      </MapView>
      {/* < Search onLocationSelected={this.handleLocationSelected}/> */}
      <SearchableDropdown
          //On text change listner on the searchable input
          onItemSelect={item => this.handleSelectedRoute(item)}
          //onItemSelect called after the selection from the dropdown
          containerStyle={{ padding: 5 }}
          //suggestion container style
          textInputStyle={{
            //inserted text style
            marginTop:35,
            paddingHorizontal: 20,
            marginRight: 15,
            marginLeft: 75,
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#FAF7F6',
            borderRadius: 10,
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { x:0 , y:0 },
            shadowRadius: 15,
            borderWidth: 1,
            borderColor: "#DDD",
            fontSize: 18,
            height:54
          }}
          itemStyle={{
            //single dropdown item style
            padding: 10,
            backgroundColor: '#FAF7F6',
            borderBottomColor: '#bbb',
            borderBottomWidth: 1,
            marginHorizontal:10,
            paddingTop:10
          }}
          itemTextStyle={{
            //text style of a single dropdown item
            color: '#222',
            fontSize:16
          }}
          itemsContainerStyle={{
            //items container style you can pass maxHeight
            //to restrict the items dropdown hieght
            maxHeight: '50%',
            borderWidth: 1,
                borderColor: "#DDD",
                backgroundColor: "#FAF7F6",
                marginHorizontal: 20,
                elevation: 5,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowOffset: { x:0 , y:0 },
                shadowRadius: 15,
                marginTop: 10,
                borderRadius:10,
          }}
          items={items}
          //mapping of item array
          placeholder="Busca tu ruta"
          //place holder for the search input
          resetValue={false}
          //reset textInput Value with true and false state
          underlineColorAndroid="transparent"
          //To remove the underline from the android input
        />
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