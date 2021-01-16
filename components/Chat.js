
import React, { Component } from 'react';
import {View, Button, Text, KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import {GiftedChat, Bubble, InputToolbar, } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo'
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
const firebase = require('firebase');
require('firebase/firestore');

const firebaseConfig ={
    apiKey: "AIzaSyDR0NL9mLU4XYOoYZzqh2j8y_JwsbdrBQ4",
    authDomain: "chatapp-e9cc4.firebaseapp.com",
    projectId: "chatapp-e9cc4",
    storageBucket: "chatapp-e9cc4.appspot.com",
    messagingSenderId: "1010887966594"

}


export default class Chat extends Component{
    constructor(props){
        super(props);

        //initialize firebase
        if(!firebase.apps.length){
            firebase.initializeApp(firebaseConfig);
        }
       this.referenceMessageUser = null;
       this.referenceMessageUser = firebase.firestore().collection('messages');

            
        this.state={
            messages:[],
            uid:0,
            user:{
                _id:'',
                name:'',
                avatar:''
            },
            isConnected:false,
        };
     
    }

    
  setUser = (_id, name, avatar = 'https://placeimg.com/140/140/any') => {
      if(!name){
          name = 'Guest User';
      }
    this.setState({
      user: {
        _id: _id,
        name: name,
        avatar: avatar,
      }
    })
  }

    onCollectionUpdate = (querySnapshot)=>{
        const messages = [];
        querySnapshot.forEach(doc=>{
            let data = doc.data();
            messages.push({
                _id:data._id,
                text:data.text,
                createdAt:data.createdAt.toDate(),
                user:data.user,
                image:data.image || '',
                location: data.location || null,
            });

        });
        this.setState({
            messages
        });
    };

    


    getMessages = async () => {
      let messages = '';
      try {
        messages = await AsyncStorage.getItem('messages') || [];
        this.setState({
          messages: JSON.parse(messages)
        });
      } catch (error){
        console.log(error.message);
      }
    };
    
    async saveMessages(){
         try{
             await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
         }catch(error){

            console.log(error.message);
         }  

    }

    async deleteMessages() {
        try {
          await AsyncStorage.removeItem('messages');
          this.setState({
            messages: []
          })
        } catch (error) {
          console.log(error.message);
        }
      }

    addMessage(){
        this.referenceMessageUser.add({

            _id: this.state.messages[0]._id,
        text: this.state.messages[0].text || '',
        createdAt: this.state.messages[0].createdAt,
        user: this.state.user,
        uid: this.state.uid,
        image: this.state.messages[0].image || '',
        location: this.state.messages[0].location || null,
        })
    }
    
    componentDidMount(){
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({title:name});
        NetInfo.fetch().then(connection =>{
        
            if(connection.isConnected){
                console.log("ONLINE");
                this.setState({
                    isConnected: true,
                  })
                   // listen to authentication events
   
         this.referenceMessageUser = firebase.firestore().collection("messages");
         this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
           if (!user) {
             await firebase.auth().signInAnonymously();
           }
           //update user state with currently active user data
           if(!this.props.route.params.name){
          this.setUser(user.uid );
           this.setState({
             uid: user.uid,
             loggedInText: "Hello there"
           });
         }else{
           this.setUser(user.uid, this.props.route.params.name )
           this.setState({
             uid: user.uid,
             loggedInText: "Hello there"
           });
         }
 
       // create a reference to the active user's documents (messages)
         this.referenceMessageUser = firebase.firestore().collection("messages");
         // listen for collection changes for current user
         this.unsubscribeMessageUser = this.referenceMessageUser.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
       // this.unsubscribeMessageUser = this.referenceMessageUser.onSnapshot(this.onCollectionUpdate);
       });

            }else{
                    console.log("offline");
                    isConnected = 'false';
                
            }
            this.getMessages();
        })
      
    }




    onSend(messages=[]){
   

        this.setState(previousState=>({

            messages:GiftedChat.append(previousState.messages, messages),
        }),
        () => {
            this.saveMessages();    
        this.addMessage();
        }
        );
    }


    

      componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribeMessageUser();
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

      renderInputToolbar(props){
        if(this.state.isConnected == false){
                
        }else{
            return(
                    <InputToolbar
                        {...props} />
                )
        }
    
      }

      renderCustomView (props) {
        const { currentMessage} = props;
        if (currentMessage.location) {
          return (

            <View>
          <MapView
            style={{
              width: 150, height: 100, borderRadius: 13, margin: 3,
            }}
          
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
              // <MapView
              //   style={{width: 150,
              //     height: 100,
              //     borderRadius: 13,
              //     margin: 3}}
              //   region={{
              //     latitude: currentMessage.location.latitude,
              //     longitude: currentMessage.location.longitude,
              //     latitudeDelta: 0.0922,
              //     longitudeDelta: 0.0421,
              //   }}
              // />
          );
        }
        return null;
      }


      renderCustomActions = (props) => {
        return <CustomActions {...props} />;
      };


    render(){

        return(
                <View style = {{flex:1,  backgroundColor:this.props.route.params.color}}>
                <GiftedChat 
                 
                  renderBubble={this.renderBubble.bind(this)}
                  renderInputToolbar = {this.renderInputToolbar.bind(this)}
                  renderCustomView = {this.renderCustomView.bind(this)}
                  renderActions = {this.renderCustomActions.bind(this)}
                    messages= {this.state.messages}
                    onSend ={messages=> this.onSend(messages)}
                    user={this.state.user}
                />
                    {Platform.OS==='android'?<KeyboardAvoidingView behaviour = 'height'/>:null}
                    
                </View>
                

        );
    }
}




