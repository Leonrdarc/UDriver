import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {Icon} from 'native-base';
import Map from '../components/Map';
import MenuButton from '../components/MenuButton';

export default class MapScreen extends Component {

  _toggleDrawer = async () => {
    this.props.navigation.toggleDrawer();
  };

  render() {
    return (
          <Map navigation={this.props.navigation}>
            
          </Map>
      
    );
  }
}

