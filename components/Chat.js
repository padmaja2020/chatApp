import React, { Component } from 'react';
import {View, Button, Text, KeyboardAvoidingView, Platform} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';


export default class Chat extends Component{
    constructor(props){
        super(props);
        this.state={
            messages:[],
        }
    }
  
    
    componentDidMount(){
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({title:name});
        this.setState({
            messages:[{
                _id:1,
                text:'Hello Developer',
                createdAt:new Date(),
                user:{
                    id:2,
                    name:'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
            {
                _id:2,
                text:"Welcome to the chat room  " + name,
                createdAt:new Date(),
                system:true,
            },
         ],

        })

    }
    onSend(messages=[]){

        this.setState(previousState=>({

            messages:GiftedChat.append(previousState.messages, messages),
        }))
    }
    renderBubble(props) {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: '#000'
              }
            }}
          />
        )
      }

    render(){

        return(
                <View style = {{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:this.props.route.params.color}}>
                <GiftedChat 
                  renderBubble={this.renderBubble.bind(this)}
                    messages= {this.state.messages}
                    onSend ={messages=> this.onSend(messages)}
                    user={{
                        _id: 1,
                     }}
                />
                    {Platform.OS==='android'?<KeyboardAvoidingView behaviour = 'height'/>:null}
                    
                </View>
                

        );
    }
}