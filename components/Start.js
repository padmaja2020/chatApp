import React, { Component } from 'react';
import { render } from 'react-dom';
import {StyleSheet, View, Button, TextInput, Text, ImageBackground, TouchableOpacity} from 'react-native';

export default class Start extends Component{
    constructor(props){

        super(props);
        this.state= {text:'',
    color:''};
    }
    render(){

        return(
            <ImageBackground  style={{flex:1}}
             source= {require('../assets/backgroundImage.png')}>
               <Text style = {{fontSize:45, fontWeight:'600', color:'#FFFFFF', alignItems:'center'}}>Chat App</Text>

        <View style = {{flex:1, justifyContent:'center', alignItems:'center'}}>
           
            <View>
                <TextInput style = {{width: 100, fontSize:16, fontWeight:'300', color:'#757083',height: 40, borderWidth:1, borderColor:'black'}} 
                value={this.state.value} 
                placeholder='Your Name'
                onChangeText= {(text)=>this.setState({text})}
            
                >

                </TextInput>
                <Text style = {{ fontSize: 16, fontWeight: '300', color: '#757083'}}>Choose Background Color:</Text>
        
                <TouchableOpacity
            onPress={() => this.setState({ color: '#090C08'})}
                 style = {[styles.colorOptions, styles.color1]}/>

                <TouchableOpacity
                         onPress={() => this.setState({ color: '#474056'})}
                 style = {[styles.colorOptions, styles.color2]}/>

                <TouchableOpacity
                         onPress={() => this.setState({ color: '#8A95A5'})}
                        style = {[styles.colorOptions, styles.color3]}/>
             <TouchableOpacity
                         onPress={() => this.setState({ color: '#B9C6AE'})}
                        style = {[styles.colorOptions, styles.color4]}/>

                 <Button style = {{fontSize:16, fontWeight:'600', fontColor:'#FFFFFF', color:'#757083' }}title = "Start Chatting" 
                 onPress ={()=>this.props.navigation.navigate('Chat', {name:this.state.text, color:this.state.color})}></Button>
                
                 
            </View>
           
        </View>
        </ImageBackground>
        
          );

    }
   


}

const styles = StyleSheet.create({
    colorOptions:{
        width:50,
        height:50,
        borderRadius:50/2,
    },
    color1:{
        backgroundColor:'#090C08'
    },
    color2:{backgroundColor:'#474056'},
    color3:{backgroundColor:'#8A95A5' },
    color4:{backgroundColor:'#B9C6AE'}


})