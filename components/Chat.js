import React, { Component } from 'react';
import {View, Button, Text} from 'react-native';


export default class Chat extends Component{
    constructor(props){
        super(props);
    }
  
    
    componentDidMount(){
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({title:name});

    }

    render(){

        return(
            <View style = {{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:this.props.route.params.color}}>
                <Text>Hello { this.props.route.params.name} Welcome to Chat!!</Text>
            </View>

        );
    }
}