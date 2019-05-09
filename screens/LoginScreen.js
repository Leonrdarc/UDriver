import React, {Component} from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { View, Text, ImageBackground, StyleSheet, Image, TextInput, TouchableOpacity, Animated, Dimensions, Keyboard, AsyncStorage } from 'react-native';
import { placeholder } from '@babel/types';
import * as Animatable from 'react-native-animatable';
import { Icon } from 'native-base';

const SCREEN_HEIGHT = Dimensions.get('window').height

class LoginScreen extends Component {

  static navigationOptions = {
      header : null
  }  
  
  constructor(){
    super()

    this.state={
      placeholderText: 'Ingresa tu numero de celular'
    }
  }

  componentWillMount(){
    this.loginHeight = new Animated.Value(130)

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',
    this.keyboardDidShow)

    this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide",
    this.keyboardDidHide)
    
    
    this.forwardArrowOpacity = new Animated.Value(0)
    this.borderBottomWidth = new Animated.Value(0)
  }

  keyboardDidShow = () =>{

    Animated.parallel([
      Animated.timing(this.forwardArrowOpacity,{
        duration: 600,
        toValue: 1
      }),
      Animated.timing(this.borderBottomWidth,{
        duration: 600,
        toValue: 1
      }),
      

    ]).start()

  }

  keyboardDidHide = () => {

    this.setState({placeholderText:'Ingresa tu numero de celular'})
    Keyboard.dismiss()
    Animated.parallel([
      Animated.timing(this.forwardArrowOpacity,{
        duration: 100,
        toValue: 0
      }),
      Animated.timing(this.borderBottomWidth,{
        duration: 100,
        toValue: 0
      }),
      Animated.timing(this.loginHeight,{
        toValue: 130,
        duration: 500
      })

    ]).start(()=>this.decreaseHeightOfLogin)

  }

  increaseHeightOfLogin = () => {
    this.setState({placeholderText:'312-3456789'})
    Animated.timing(this.loginHeight,{
      toValue:SCREEN_HEIGHT,
      duration:500
    }).start(()=>{
      this.refs.textInputMobile.focus()
    })
  }

  decreaseHeightOfLogin = () =>{
    this.setState({placeholderText:'Ingresa tu numero de celular'})
    Keyboard.dismiss()
    Animated.timing(this.loginHeight,{
      toValue: 130,
      duration: 500
    }).start()
  }

  _goMapsAsync = async () => {
    this.props.navigation.navigate('Maps');
  };

  render() {

    const headerTextOpacity= this.loginHeight.interpolate({
      inputRange:[130,SCREEN_HEIGHT],
      outputRange:[1,0]
    })

    const headerMarginTop= this.loginHeight.interpolate({
      inputRange:[130,SCREEN_HEIGHT],
      outputRange:[30,100]
    })

    const headerBackOpacity= this.loginHeight.interpolate({
      inputRange:[130,SCREEN_HEIGHT],
      outputRange:[0,1]
    })

    const marginTop= this.loginHeight.interpolate({
      inputRange:[130,SCREEN_HEIGHT],
      outputRange:[20,100]
    })

    const titleTextLeft= this.loginHeight.interpolate({
      inputRange:[130,SCREEN_HEIGHT],
      outputRange:[100,25]
    })

    const titleTextBottom= this.loginHeight.interpolate({
      inputRange:[130, 400, SCREEN_HEIGHT],
      outputRange:[0,0,100]
    })

    const TitleTextOpacity= this.loginHeight.interpolate({
      inputRange:[130,SCREEN_HEIGHT],
      outputRange:[0,1]
    })

    const LogoOpacity= this.loginHeight.interpolate({
      inputRange:[130,200,SCREEN_HEIGHT],
      outputRange:[1,0,0]
    })
    

    return (
      <View style={{flex:1, backgroundColor:'black'}}>

        <Animated.View
          style={{
            position:'absolute',
            height:30,width:30,
            top:60,
            left:40,
            zIndex:100,
            opacity:headerBackOpacity
          }}
        >
          <TouchableOpacity
            onPress={()=>this.decreaseHeightOfLogin()}
          >
            <Icon name="md-arrow-back" style={{color:'white', fontSize: 30}}/>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={{
            position:'absolute',
            height:40,width:40,
            bottom:40,
            right:20,
            zIndex:100,
            opacity: headerBackOpacity,
            backgroundColor:'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30
          }}
        >  
          <TouchableOpacity
            onPress={()=>this._goMapsAsync()}
          >
            <Icon name="md-arrow-forward" style={{color:'black', fontSize: 30}}/>
          </TouchableOpacity>
            
        </Animated.View>
        

        <Animatable.View 
          animation="zoomIn" 
          iterationCount={1} 
          style={{ 
            flex:1,  
            alignItems:'center', flexDirection:'column',
            top: 90,
            
          }}
        >
          <Animated.View 
            style={{
              backgroundColor: 'transparent',height: 100,
              width: 100, alignItems: 'center',opacity: LogoOpacity
            }}
          >
            <Image source={require('../assets/logo.png')}
                    style={{width: "100%", height: "100%", flex:1}}/>
          </Animated.View>
          <Animated.Text 
          style={{
            justifyContent: 'center', color: 'white', fontWeight: 'bold', opacity: LogoOpacity, 
            fontSize: 30, paddingTop: 10
          }}>
              TransCocuelo
          </Animated.Text>
        </Animatable.View>
        {/** View de numero y redes sociales */}
        <Animatable.View animation="slideInUp" iterationCount={1}>
          <Animated.View style={{height: this.loginHeight, backgroundColor: 'black',}}>
            <Animated.View 
              style={{
                alignItems: 'flex-start', paddingHorizontal: 30, 
                marginTop: headerMarginTop, opacity: headerTextOpacity
              }}
            >
              <Text style={{color:'white', fontSize: 20}}>
                Iniciar Sesión
              </Text>
            </Animated.View>
            <TouchableOpacity
              onPress = {()=> this.increaseHeightOfLogin()}
            >
              <Animated.View 
                style={{ 
                  marginTop: marginTop, paddingHorizontal: 40, 
                  flexDirection: 'row', alignItems:'center'
                }}
              >
                <Animated.Text
                  style={{
                    fontSize: 24, color:'white', fontWeight:'bold',
                    position:'absolute',
                    bottom: titleTextBottom,
                    left: titleTextLeft,
                    opacity: TitleTextOpacity
                  }}
                >
                  Ingrese su numero celular
                </Animated.Text>
                <Image source={require('../assets/colombia-flag.png')} style={{height: 24, width: 24, resizeMode: 'contain'}}></Image>
                <Animated.View 
                  pointerEvents="none" 
                  style={{
                    flexDirection: 'row', flex:1, marginHorizontal: 15, 
                    borderBottomColor: 'white', borderBottomWidth: this.borderBottomWidth
                  }}
                >
                  <TextInput
                    keyboardType='numeric'
                    ref="textInputMobile" 
                    style={{flex:1, color:'white', fontSize: 13, height: 38}} 
                    placeholder={this.state.placeholderText} 
                    placeholderTextColor={'gray'} 
                    maxLength= {10}
                    underlineColorAndroid="transparent"
                    />
                </Animated.View>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
          <View style={{ height: 250, backgroundColor:'black', alignItems:'center'}}>
            <Text style={{color:'white'}}>
              O conectate con una red social
            </Text>
            
          </View>
        </Animatable.View>
      </View>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
    container:{
      
    },
    cocuelo:{
      
    }
    
});


