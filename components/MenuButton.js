import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {Icon} from 'native-base';

export default class MenuButton extends Component {

  render() {
    return (
        <View
            style={this.props.style}
        >
            <TouchableOpacity
                onPress={()=> this.props.navigation.toggleDrawer()}
                style={{height:54, width:54, justifyContent:'center', alignItems:'center'}}
            >
                <Icon name="md-menu" style={{color:'black', fontSize: 30}}/>
            </TouchableOpacity>  
        </View>
    );
  }
}
