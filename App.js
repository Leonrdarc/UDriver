/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, PermissionsAndroid, Alert, PropTypes, TouchableOpacity} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoginScreen from './screens/LoginScreen';
import SocketIOClient from 'socket.io-client';


import DrawerNavigation from './navigation/DrawerNavigation'

type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);

    this.socket = SocketIOClient('http://localhost:3000');
  }
  render() {
    return (
      <AppContainer/>
      
      
    );
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  Welcome:{screen: LoginScreen},
  Maps: {screen: DrawerNavigation}
});

const AppContainer = createAppContainer(AppSwitchNavigator);