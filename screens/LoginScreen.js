import React, {Component} from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { View, Text, ImageBackground, StyleSheet, Image, TextInput, TouchableOpacity, Animated, Dimensions, ToastAndroid, AsyncStorage } from 'react-native';
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
      ToastAndroid.show('Por favor intente nuevamente!', ToastAndroid.SHORT);
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
        throw err;
      }

      const { jwt } = await res.json()
      this.setState({jwt: jwt})
    }catch(err){
      throw err;
    }
  }

  _goMapsAsync = async () => {
    this.props.navigation.navigate('Mapa', {jwt: this.state.jwt});
  };

  render() {
    return (
      <View style={{flex:1, backgroundColor:'#2FABB2'}}>
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
            <Image source={require('../assets/udriver_logo21.png')}
                    style={{width: 170, height: 170, resizeMode:'contain'}}/>
          </View>
          
        </Animatable.View>
        {/** View de numero y redes sociales */}
        <Animatable.View animation="slideInUp" iterationCount={1}>
          <View style={{height: 150, backgroundColor: '#2FABB2',}}>
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
                    style={{flex:1, color:'#2FABB2', fontSize: 13, height: 38}} 
                    placeholder={'Ingresa tu numero de celular'} 
                    placeholderTextColor={'#C6D1D2'} 
                    maxLength= {10}
                    underlineColorAndroid="transparent"
                    />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ height: this.loginHeight, backgroundColor:'#00ADB4', alignItems:'center'}}>
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
          overlayBackgroundColor="rgba(255,255,255,0.8)"
        > 
          <View>
          <Image source={require('../assets/loading.gif')} style={{height: 50, width: 50, resizeMode: 'contain'}}></Image>
          <Text style={{ fontSize:12, marginTop:10}}>
                  Cargando...
          </Text>
          </View>
        </Overlay>
      </View>
    );
  }
}



