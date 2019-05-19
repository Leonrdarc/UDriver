import React, { Component } from 'react'
import { StyleSheet, View, Button, Text } from 'react-native'
import AccountKit from 'react-native-facebook-account-kit'
import io from 'socket.io-client'

const API_URL = 'http://192.168.1.72:3000'

export default class AccountKitnative extends Component {

  
  state = {
    jwt: null,
    me: null,

  }
  
  componentWillMount() {
    AccountKit.configure({
      responseType: 'code',
      initialPhoneCountryPrefix: '+57',
      defaultCountry: 'CO',
    })
    
  }

  handleLoginButtonPress = async () => {
    // AccountKit.loginWithEmail()
    //   .then((token) => {
    //     if (!token) {
    //       alert('Login cancelled')
    //     } else {
    //       alert(`Logged with phone. Token: ${token}`)
    //     }
    //   })
    try {
      const payload = await AccountKit.loginWithPhone()

      if (!payload) {
        return
      }

      const { code } = payload 
      await this.getJWT(code)
    } catch (err) {
      alert('Error en autenticación con Facebook.')
    }
  }

  handleLogoutPress = () => this.setState({ jwt: null, me: null })

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
      this.setState({jwt: jwt, me: user.phone})
    }catch(err){
      alert('Error en obtener JWT.'+err)
    }
  }

  handleGetMePress = async () => {
    
    var socket = io(API_URL, {query: 'auth_token='+this.state.jwt});
    // Connection failed
    socket.on('error', function(err) {
      alert('No se pudo autenticar')
    });
    // Connection succeeded
    socket.on('success', function(data) {
      alert(data.message)
      alert(data.user.id)
    })
    // const url = `${API_URL}/me`
    // const { jwt } = this.state

    // const res = await fetch(url, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${jwt}`,
    //     'Content-Type': 'application/json',
    //   },
    // })

    // if (res.status === 403) {
    //   alert('Usuario no autorizado')
    //   return
    // } else if (!res.ok) {
    //   alert('No se pudo obtener el perfil')
    //   return
    // }

    // const me = await res.json()
    // this.setState({ me })
  }

  render() {
    const { jwt, me } = this.state

    const authenticated = !!jwt

    return (
      <View style={styles.container}>
        {!authenticated && <Button title="Login" onPress={this.handleLoginButtonPress} />}

        {authenticated && (
          <View style={styles.container}>
            <Text style={styles.title}>Bienvenido!</Text>

            <Text style={styles.jwt}>{jwt}</Text>

            <Text style={styles.phone}>Teléfono:{me.number} </Text>
              
            <Button title="Obtener Perfil" onPress={this.handleGetMePress} />
            <Button title="Salir" onPress={this.handleLogoutPress} />
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontWeight: 'bold',
    padding: 20,
    fontSize: 20,
  },
  phone: {
    padding: 20,
    fontSize: 14,
  },

  phone: {
    padding: 20,
    fontSize: 14,
  },
})