import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class rideScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Text style={{fontSize:20, fontWeight:'bold', padding:20}}> Aún no tiene viajes registrados </Text>
      </View>
    );
  }
}
