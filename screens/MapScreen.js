import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {Icon} from 'native-base';
import Map from '../components/Map';
import MenuButton from '../components/MenuButton';

export default class MapScreen extends Component {

  render() {
    return (
          <Map navigation={this.props.navigation} jwt={this.props.navigation.getParam('jwt')}>
            
          </Map>
      
    );
  }
}

