import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {Rating, Avatar, Icon} from 'react-native-elements';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const starCustom = require('../assets/star.png')

export default class MenuDrawer extends React.Component{

    navLink(nav, text) {
        return(
            <TouchableOpacity style={{ height:50 }} onPress={()=>{this.props.navigation.navigate(nav)}}>
                <View style={{flexDirection: 'row', paddingLeft:15, alignItems:'center'}}>
                        {nav=='Mapa'&&<Icon name='map' type='font-awesome' size={25} color='#757575'/>}
                        {nav=='Rides'&&<Icon name='taxi' type='font-awesome' size={25} color='#757575'/>}
                    <Text style={styles.link}>
                        {text}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.user}>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('Config')}>
                        <View style={{backgroundColor:'transparent', flexDirection: 'row'}}>
                            <View style={{paddingHorizontal:15, paddingTop:15}}>
                                <Avatar
                                    rounded
                                    source={require('../assets/avatar.jpg')}
                                    size={70}
                                />
                            </View>
                            <View style={{flexDirection:'column', justifyContent:'center', flex:1}}>
                                <Text style={{color: 'white', fontWeight:'300', fontSize: 16, paddingTop:5}}>
                                    Leonardo
                                </Text>
                                <Rating
                                    type='custom'
                                    startingValue={3.7}
                                    readonly 
                                    ratingBackgroundColor='transparent' 
                                    style={{backgroundColor: 'transparent'}}
                                    ratingImage={starCustom}
                                    imageSize={16}
                                    style={{paddingTop:5, alignItems: 'flex-start',}}
                                />
                                <Text style={{color:'#D4D4D4', fontSize:11, paddingLeft:3}}>(3.7)</Text>
                            </View>

                            <View style={{alignItems:'flex-end', justifyContent:'center',paddingTop:10, paddingRight:10}}>
                                <Icon name='chevron-right' type='font-awesome' size={25} color='#FFFFFF'/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomLinks}>
                    {this.navLink('Mapa','Mapa')}
                    {this.navLink('Rides','Mis Viajes')}
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
        backgroundColor:'#2FABB2',
    },
    bottomLinks:{
        flex:1,
        backgroundColor: 'white',
        paddingBottom: 400,
    },
    link:{
        fontSize:20,
        padding:6,
        paddingLeft:14,
        margin:6,
        textAlign: 'left',        
    }
})