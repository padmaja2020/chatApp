import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';

import { BackHandler, StyleSheet, Text, View, Button} from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';
import 'react-native-gesture-handler';
//import react navigation
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import { FlatList } from 'react-native-gesture-handler';


// create the navigator
const Stack = createStackNavigator();


export default class App extends Component {
  constructor(props){

    super();
    this.state = {
      lists: [],
      uid: 0,
      loggedInText: 'Please wait, you are getting logged in',
    };
  }
 

 
  render(){
  return (

      <NavigationContainer>
      <Stack.Navigator initialRouteName = 'Start'>
      <Stack.Screen name = 'Start' component = {Start}/>
      <Stack.Screen name = 'Chat' component = {Chat}/>

  
      </Stack.Navigator>
      </NavigationContainer>
    );

}


}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});





