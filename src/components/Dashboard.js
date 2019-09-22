import React, { Component } from 'react';
import {StyleSheet} from 'react-native';
import { Container, Content, Card, CardItem, Text, Body, Button, Item, Input } from 'native-base'
import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';

class Dashboard extends Component {
    _onPress(){
        init({
            size: 10000,
            storageBackend: AsyncStorage,
            defaultExpires: 1000 * 3600 * 24,
            enableCache: true,
            reconnect: true,
            sync : {}
          });

          const client = new Paho.MQTT.Client('soldier.cloudmqtt.com', 33115,'/ws','AppIntelliWeight');
          client.onConnectionLost = onConnectionLost;
          client.onMessageArrived = onMessageArrived; 

          function onConnect() {
            console.log("onConnect");
        
            const topic = "/board_1/weight_1"
            client.subscribe(topic);
            message = new Paho.MQTT.Message("0");
            message.destinationName = topic;
            client.send(message);
          }
          
          function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
              console.log("onConnectionLost:" + responseObject.errorMessage);
            }
          }
          
          function onMessageArrived(message) {
            console.log("onMessageArrived:" + message.payloadString);
          }
        
          function doFail(e){
            console.log('error', e);
          }
          
 
          const options = {
            useSSL: true,
            userName: "mfoubemo", 
            password: "9oUEiStFQCHU",
            onSuccess: onConnect,
            onFailure: doFail
          }; 
        
          client.connect(options);
          
          return client
        }

    render(){
        return <Button onPress={this._onPress}><Text>Actualizar</Text></Button>

    }

}

export default Dashboard