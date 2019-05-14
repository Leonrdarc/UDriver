import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {Rating, Avatar} from 'react-native-elements';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const starCustom = require('../assets/star.png')

export default class MenuDrawer extends React.Component{

    navLink(nav, text) {
        return(
            <TouchableOpacity style={{ height:50 }} onPress={()=>{this.props.navigation.navigate(nav)}}>
                <Text style={styles.link}>
                    {text}
                </Text>
            </TouchableOpacity>
        )
    }

    
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.user}>
                    <View style={{backgroundColor:'transparent', flexDirection: 'row'}}>
                        <View style={{paddingHorizontal:15, paddingTop:15}}>
                            <Avatar
                                rounded
                                source={require('../assets/avatar.jpg')}
                                size={70}
                                
                            />
                        </View>
                        <View style={{flexDirection:'column', justifyContent:'center', flex:1}}>
                            <Text style={{color: 'white', fontWeight:'bold', fontSize: 16}}>
                                Leonardo Archila Contreras
                            </Text>
                            <Rating
                                type='custom'
                                startingValue={4.3}
                                readonly 
                                ratingBackgroundColor='transparent' 
                                style={{backgroundColor: 'transparent'}}
                                ratingImage={starCustom}
                                imageSize={15}
                                style={{paddingTop:5, alignItems: 'flex-start',}}
                            />
                        </View>

                    </View>
                    
                </View>
                <View style={styles.bottomLinks}>
                    {this.navLink('Mapa','Mapa')}
                    {this.navLink('Rides','Mis Viajes')}
                    {this.navLink('Config','Configuración')}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'lightgray',
    },
    user:{
        height:100,
        backgroundColor:'black',
    },
    bottomLinks:{
        flex:1,
        backgroundColor: 'white',
        paddingBottom: 450,
    },
    link:{
        fontSize:20,
        padding:6,
        paddingLeft:14,
        margin:6,
        textAlign: 'left',        
    }
})