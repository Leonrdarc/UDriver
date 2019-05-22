import React, { Component } from 'react';
import { View, Text, ToastAndroid } from 'react-native';
import { Avatar, Input, Button } from 'react-native-elements';

export default class configScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  save(){
    this.props.navigation.navigate('Mapa')
    ToastAndroid.show('Guardado', ToastAndroid.SHORT)
  }

  render() {
    return (
      <View style={{alignItems: 'center',flex:1}}>
        <Avatar
          rounded
          containerStyle={{marginVertical:50}}
          source={require('../assets/avatar.jpg')}
          size={150}
        />
        <Input
          placeholder='Leonardo'
          label={'Nombre'}
          containerStyle={{marginBottom:15}}
          leftIcon={{ type: 'font-awesome', name: 'user' }}
        />
        <Input
          placeholder='3058172395'
          label={'Telefono'}
          containerStyle={{marginBottom:15}}
          leftIcon={{ type: 'font-awesome', name: 'user' }}
        />
        <Input
          placeholder='03-10-1999'
          label={'Birthday'}
          leftIcon={{ type: 'font-awesome', name: 'user' }}
        />


        
        <Button
          title="Guardar"
          onPress={()=>this.save()}
          type="solid"
          containerStyle={{position:'absolute',justifyContent:'center', alignItems:'center', width:'100%', bottom:0}}
          buttonStyle={{backgroundColor:'#2FABB2', borderRadius: 30, width: 300, marginBottom:30}}
        />
        
      </View>
    );
  }
}
