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
import MassiveCustomMarkers from './components/Map/MassiveCustomMarkers';
import AccountKitnative from './components/AccountKitnative';

import DrawerNavigation from './navigation/DrawerNavigation';

type Props = {};
export default class App extends Component<Props> {
  
  render() {
    return (
      <AccountKitnative/>
      
      
    );
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  Welcome:{screen: LoginScreen},
  Maps: {screen: DrawerNavigation}
});

const AppContainer = createAppContainer(AppSwitchNavigator);