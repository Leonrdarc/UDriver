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
import io from 'socket.io-client';
import MassiveCustomMarkers from './components/Map/MassiveCustomMarkers';
import AccountKitnative from './components/AccountKitnative';
import { NavigationActions } from 'react-navigation';
import DropDown from './components/DropDrown';

import DrawerNavigation from './navigation/DrawerNavigation';

type Props = {};

const AppSwitchNavigator = createSwitchNavigator({
  Welcome:LoginScreen,
  Maps: {screen:DrawerNavigation} 
});

const AppContainer = createAppContainer(AppSwitchNavigator);

export default class App extends Component<Props> {

  state = {
    authenticated: null,
  }

  async componentWillMount(){
    try {
      const auth = await AsyncStorage.getItem('JWT');
      if (auth !== null) {
        // We have data!!
        this.setState({authenticated: auth})
      }
    } catch (error) {
      // Error retrieving data
    }
  }
  componentDidMount(){
    if(this.state.authenticated){
      this.navigator.dispatch(
        NavigationActions.navigate({ routeName: 'Maps' })
      );
    }
    
  }
  render() {
    return (
      // <DropDown/>
      <AppContainer
        ref={nav => {
          this.navigator = nav;
        }}
      />
      // <AccountKitnative/>
      
    );
  }
}

