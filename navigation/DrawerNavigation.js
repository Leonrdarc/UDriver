import React from 'react';
import { Dimensions } from 'react-native';
import {createDrawerNavigator} from 'react-navigation';

import MapScreen from '../screens/MapScreen';
import rideScreen from '../screens/rideScreen'
import configScreen from'../screens/configScreen';

import MenuDrawer from '../components/MenuDrawer'


const WIDTH = Dimensions.get('window').width;

const DrawerConfiguration = {
    drawerWidth: WIDTH*0.60,
    contentComponent: ({ navigation }) => {
        return(<MenuDrawer 
            navigation={navigation}/>)
    }

}

const DrawerMaps = createDrawerNavigator(
    {
        Mapa : {screen: MapScreen},
        Rides: {screen: rideScreen},
        Config: {screen: configScreen}
    },
    DrawerConfiguration
    
);

export default DrawerMaps;