import React, {Component} from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { View, Text, ImageBackground, StyleSheet, Image, TextInput, TouchableOpacity, Animated, Dimensions, Keyboard, AsyncStorage } from 'react-native';
import { placeholder } from '@babel/types';
import * as Animatable from 'react-native-animatable';
import AccountKit from 'react-native-facebook-account-kit'
import io from 'socket.io-client'
import { Overlay } from 'react-native-elements';

const SCREEN_HEIGHT = Dimensions.get('window').height
const API_URL = 'http://192.168.1.72:3000'

export default class LoginScreen extends Component {

  static navigationOptions = {
      header : null
  }  
  
  constructor(){
    super()

    this.state={
      jwt: null,
      loading: false,
    }
  }

  async componentWillMount(){
    this.loginHeight = SCREEN_HEIGHT*0.35
    AccountKit.configure({
      responseType: 'code',
      initialPhoneCountryPrefix: '+57',
      defaultCountry: 'CO',
    })
  }

  handleLoginButtonPress = async () => {
    this.setState({loading:true})
    try {
      const payload = await AccountKit.loginWithPhone()

      if (!payload) {
        return
      }

      const { code } = payload 
      await this.getJWT(code)
      await AsyncStorage.setItem('JWT', JSON.stringify(this.state.jwt));
      this._goMapsAsync();
    } catch (err) {
      this.setState({loading: false})
    }
  }

  getJWT = async code => {
    try {
      const url = `${API_URL}/auth?code=${code}`

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        alert
        alert('No se pudo obtener el JWT')
        return
      }

      const { jwt, user } = await res.json()
      this.setState({jwt: jwt})
    }catch(err){
      alert('No se ha podido autenticar')
      throw err;
    }
  }

  _goMapsAsync = async () => {
    this.props.navigation.navigate('Mapa', {jwt: this.state.jwt});
  };

  render() {
    return (
      <View style={{flex:1, backgroundColor:'black'}}>
        <Animatable.View 
          animation="zoomIn" 
          iterationCount={1} 
          style={{ 
            flex:1,  
            alignItems:'center', flexDirection:'column',
            top: 90,
          }}
        >
          <View 
            style={{
              backgroundColor: 'transparent',height: 100,
              width: 100, alignItems: 'center'
            }}
          >
            <Image source={require('../assets/logo.png')}
                    style={{width: "100%", height: "100%", flex:1}}/>
          </View>
          <Text 
          style={{
            justifyContent: 'center', color: 'white', fontWeight: 'bold',
            fontSize: 30, paddingTop: 10
          }}>
              TransCocuelo
          </Text>
        </Animatable.View>
        {/** View de numero y redes sociales */}
        <Animatable.View animation="slideInUp" iterationCount={1}>
          <View style={{height: 150, backgroundColor: 'black',}}>
            <View 
              style={{
                alignItems: 'flex-start', paddingHorizontal: 30, 
                marginTop: 30
              }}
            >
              <Text style={{color:'white', fontSize: 20}}>
                Iniciar Sesión
              </Text>
            </View>
            <TouchableOpacity
              onPress = {()=> this.handleLoginButtonPress()}
            >
              <View 
                style={{ 
                  marginTop: 20, paddingHorizontal: 40, 
                  flexDirection: 'row', alignItems:'center'
                }}
              >
                <Image source={require('../assets/colombia-flag.png')} style={{height: 24, width: 24, resizeMode: 'contain'}}></Image>
                <View 
                  pointerEvents="none" 
                  style={{
                    flexDirection: 'row', flex:1, marginHorizontal: 15, 
                    borderBottomColor: 'white', borderBottomWidth: 1
                  }}
                >
                  <TextInput
                    keyboardType='numeric'
                    ref="textInputMobile" 
                    style={{flex:1, color:'white', fontSize: 13, height: 38}} 
                    placeholder={'Ingresa tu numero de celular'} 
                    placeholderTextColor={'gray'} 
                    maxLength= {10}
                    underlineColorAndroid="transparent"
                    />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ height: this.loginHeight, backgroundColor:'black', alignItems:'center'}}>
            <Text style={{color:'white'}}>
              O conectate con una red social
            </Text>
          </View>
        </Animatable.View>
        <Overlay 
          isVisible={this.state.loading} 
          fullScreen
          overlayStyle={{alignItems: 'center', justifyContent:'center'}}
          containerStyle={{ alignItems:'center',justifyContent:'center', opacity:1}}
          overlayBackgroundColor="rgba(255,255,255,0.4)"
        >
          <Text style={{fontSize:20}}>Cargando...</Text>
          
        </Overlay>
      </View>
    );
  }
}



