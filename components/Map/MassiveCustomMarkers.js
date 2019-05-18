import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform
} from 'react-native';

import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import flagPinkImg from '../../assets/star.png';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

export default class MassiveCustomMarkers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [],
      yolo: null,
    };

    this.onMapPress = this.onMapPress.bind(this);
  }

  animate(marker) {
    const { region } = this.state;
    const newCoordinate = {
      latitude: 37.414292,
      longitude: -122.089062,
      latitudeDelta: 0,
      longitudeDelta: 0,
    };

    if (Platform.OS === 'android') {
      if (this.marker) {
        marker._component.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      region.timing(newCoordinate).start();
    }
  }

  generateMarkers(fromCoordinate) {
    const result = [];
    const { latitude, longitude } = fromCoordinate;
    for (let i = 0; i < 5; i++) {
      const newMarker = {
        coordinate: {
          latitude: latitude + 0.001 * i,
          longitude: longitude + 0.001 * i,
        },
        key: `foo${id++}`,
      };
      result.push(newMarker);
    }
    return result;
  }

  onMapPress(e) {
    this.setState({
      markers: [
        ...this.state.markers,
        ...this.generateMarkers(e.nativeEvent.coordinate),
      ],
    });
  }

  getProp(ob) {
    for (var key in data.messages) {
      var obj = data.messages[key];
      // ...
  }
    return asd;
  }

  refsCollection = {};

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
          onPress={this.onMapPress}
        >
          {this.state.markers.map(marker => (
            <Marker.Animated
              title={marker.key}
              image={flagPinkImg}
              key={marker.key}
              coordinate={marker.coordinate}
              ref={(instance)=>{this.refsCollection[marker.key] = instance}}
            />
          ))}
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.setState({ markers: [] })}
            style={styles.bubble}
          >
            <Text>{this.state.markers.map(a => a.key)}</Text>
            
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.refsCollection['foo1']._component.animateMarkerToCoordinate({
              latitude: 37.414292,
              longitude: -122.089062,
              latitudeDelta: 0,
              longitudeDelta: 0,
            }, 500)}
            style={styles.bubble}
          >
            <Text>{this.state.yolo}</Text>
            
          </TouchableOpacity>
        </View>
        
      </View>
    );
  }
}

MassiveCustomMarkers.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});