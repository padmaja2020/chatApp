import React, { Component } from 'react';
import { render } from 'react-dom';

import PropTypes from 'prop-types';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import firebase from "firebase";
import "firebase/firestore";



export default class CustomActions extends Component{


/**
 * requests permission and  allows user to pick an image from the image library and send url to upLoadImage and onSend
 * @async
 * @function pickImage
 */


  pickImage = async()=>{
   
    const {status} =await Permissions.askAsync(Permissions.CAMERA_ROLL);
    try{
      if (status === 'granted'){

        let result = await ImagePicker.launchImageLibraryAsync({mediaTypes:'Images'}).catch(error =>console.log(error));
        if(!result.cancelled){
       
         const imageUrl= await  this.upLoadImage(result.uri);
       
         this.props.onSend({image:imageUrl});
       
        }
      }

    }catch (error) {
      console.log(error.message);

    }
   
  }

  /**
   * requests permission and allows  user to take photo and send url to upLoadImage and onSend
   * @async
   * @function takePhoto
   */

  takePhoto = async() =>{
    const {status} = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    try{
      if (status === 'granted'){
        let result = await ImagePicker.launchCameraAsync({mediaTypes:'Images'}).catch(error => console.log(error)); 
        if(!result.cancelled){
          const imageUrl= await  this.upLoadImage(result.uri);
       
          this.props.onSend({image:imageUrl});
        }
      }

    }catch(error){
      console.log(error.message);
    }
    
  }

  /**
   * requests permission to get users location and send location to onSend
   * @async
   * @function getLocation
   */

  getLocation = async() =>{
    const {status} = await Permissions.askAsync(Permissions.LOCATION);
    try{
      if (status === 'granted'){
        let result = await Location.getCurrentPositionAsync({});
        if (result){
          this.props.onSend({
            location:{
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            }
          })
        }
      }

    }catch(error){
      console.log(error.message);
    }
    
  }

  /**
   * Uploads the image as a blob to cloud storage
   * @async
   * @function upLoadImage
   * @param {string} uri
   * @returns {string} imageUrl
   */


  upLoadImage = async(uri)=>{

      const response = await fetch(uri);
      const blob = await response.blob();
      var ref = firebase.storage().ref().child('my-image');
      
      const snapshot = await ref.put(blob);
      blob.close();
      const imageUrl = await snapshot.ref.getDownloadURL();
      return imageUrl;

      

  }

  /**
   * Allows user to pick an action
   * @function onActionPress
   * @returns  {actionSheet}
   */

    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          async (buttonIndex) => {
            switch (buttonIndex) {
              case 0:
                this.pickImage();
                 return;
                
              case 1:
               this.takePhoto();
                return;
              case 2:
                this.getLocation();
                return;
              default:
            }
          },
        );
      };

    render(){

        return(

            
            
               <TouchableOpacity
               accessible={true}
               accessibilityLabel="More options"
               accessibilityHint="Let’s you choose to send an image or your geolocation."
               accessibilityRole="button"
            onPress={this.onActionPress}
                 style = {[styles.container]}>
              <View style={[styles.wrapper, this.props.wrapperStyle]}>
         <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>


                 </TouchableOpacity>


            
        )
    }

}


const styles = StyleSheet.create({
    container: {
      width: 26,
      height: 26,
      marginLeft: 10,
      marginBottom: 10,
    },
    wrapper: {
      borderRadius: 13,
      borderColor: '#b2b2b2',
      borderWidth: 2,
      flex: 1,
    },
    iconText: {
      color: '#b2b2b2',
      fontWeight: 'bold',
      fontSize: 16,
      backgroundColor: 'transparent',
      textAlign: 'center',
    },
   });
   

   CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
   };