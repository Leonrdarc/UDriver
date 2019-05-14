import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {Icon} from 'native-base';

export default class MenuButton extends Component {

  render() {
    return (
        <View
            style={{
            position:'absolute',
            height:54,width:54,
            top:40,
            left:20,
            backgroundColor:'white',
            zIndex:100,
            alignItems:'center',
            justifyContent: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { x:0 , y:0 },
            shadowRadius: 15,
            borderWidth: 1,
            borderColor: "#DDD",
            borderRadius:10
            }}
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
