/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {StyleSheet, Text, View, PermissionsAndroid, Alert} from 'react-native';
import { createDrawerNavigator, createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import LoginScreen from './screens/LoginScreen';
import Map from './components/Map';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <AppContainer/>

      
    );
  }
}

const DrawerMaps = createDrawerNavigator({
  Maps : {screen: Map}
})

const AppSwitchNavigator = createSwitchNavigator({
  Welcome:{screen: LoginScreen},
  Maps: {screen: DrawerMaps}
});



const AppContainer = createAppContainer(AppSwitchNavigator);





