import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';

export default function MQTTClient() {
  init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync : {}
  });
  
  function onConnect() {
    console.log("onConnect");

    const topic = "imagine/acuario"
    client.subscribe(topic);
    message = new Paho.MQTT.Message("apagarluz,0,");
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
  
  const client = new Paho.MQTT.Client('m10.cloudmqtt.com', 32692, "web_" + parseInt(Math.random() * 100, 10));
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  const options = {
    useSSL: true,
    userName: "kfmxnwjy",
    password: "KG_sRW8_RVpw",
    onSuccess: onConnect,
    onFailure: doFail
  };

  client.connect(options);
  
  return client
}
