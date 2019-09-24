import React, { Component } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import {
  Container,
  Content,
  Text,
  Body,
  CheckBox,
  ListItem
} from "native-base";
import init from "react_native_mqtt";
import { AsyncStorage } from "react-native";
import { FloatingAction } from "react-native-floating-action";

import AddWeightScale from "./AddWeightScale";
import Config from "../config/config";

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {}
});

const actions = [
  {
    text: "Agregar",
    icon: require("../images/weight-scale.png"),
    name: "bt_add",
    position: 2
  },
  {
    text: "Salir",
    icon: require("../images/log-out.png"),
    name: "bt_exit",
    position: 1
  }
];

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    const client = new Paho.MQTT.Client(
      Config.server,
      Config.port,
      "/ws",
      "web_" + parseInt(Math.random() * 100, 10)
    );
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;

    const options = {
      useSSL: true,
      userName: Config.userName,
      password: Config.password,
      onSuccess: this.onConnect,
      onFailure: this.doFail
    };

    client.connect(options);

    this.state = {
      client,
      placa1State: true,
      placa2State: true,
      message_placa1: "",
      message_placa2: "",
      modalMessage: "",
      weightArray: [
        { idWeight: "placa1", itemType: "Tomates" },
        { idWeight: "placa2", itemType: "Tomates", itemWeight: "50" },
        { idWeight: "placa3", itemType: "Tomates", itemWeight: "50" }
      ]
    };
  }

  onConnect = () => {
    const { client } = this.state;
    console.log("onConnect");

    const topic = "/board_1/weight_1";
    client.subscribe(topic);
    message = new Paho.MQTT.Message("0");
    message.destinationName = topic;
    client.send(message);
  };

  onConnectionLost = responseObject => {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  };

  onMessageArrived = message => {
    if (message.destinationName == "/board_1/weight_1") {
      console.log("Placa 1:" + message.payloadString);
      this.setState({ message_placa1: message.payloadString });
    }
    if (message.destinationName == "/board_1/weight_2") {
      console.log("Placa 2:" + message.payloadString);
      this.setState({ message_placa2: message.payloadString });
    }
  };

  doFail = e => {
    console.log("error", e);
  };

  renderWeight = id => {
    if (id == "placa1") {
      return this.state.message_placa1;
    }
    if (id == "placa2") {
      return this.state.message_placa2;
    }
  };

  check = id => {
    if (id == "placa1") {
      return this.state.placa1State;
    } else {
      return this.state.placa2State;
    }
  };

  setStateWeight = id => {
    if (id == "placa1") {
      if (this.state.placa1State) {
        this.setState({ placa1State: false });
      } else {
        this.setState({ placa1State: true });
      }
    } else {
      if (this.state.placa2State) {
        this.setState({ placa2State: false });
      } else {
        this.setState({ placa2State: true });
      }
    }
  };

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.content}>
          <FlatList
            data={this.state.weightArray}
            keyExtractor={item => item.idWeight}
            extraData={this.state}
            renderItem={({ item }) => (
              <WeightRow
                parentComponent={this}
                itemType={item.itemType}
                idWeight={item.idWeight}
              />
            )}
          />
          <Text>{this.state.modalMessage}</Text>
          <FloatingAction
            actions={actions}
            onPressItem={name => {
              if (name == "bt_add") {
                this.myModal.show();
              }
            }}
          />
          <AddWeightScale
            ref={modal => (this.myModal = modal)}
            parentComponent={this}
          />
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  textCenter: {
    textAlign: "center",
    width: "100%"
  },
  content: {
    flex: 1,
    justifyContent: "center"
  },
  loadingApp: {
    textAlign: "center",
    width: "100%",
    justifyContent: "center"
  },
  button: {
    marginLeft: "38%"
  },
  container: {
    backgroundColor: "white"
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15
  },
  itemValue: {
    color: "gray",
    fontSize: 15,
    marginLeft: 15,
    marginTop: 10
  }
});

const WeightRow = ({ itemType, idWeight, parentComponent }) => (
  <View>
    <Text style={styles.itemTitle}>{itemType}</Text>
    <Text style={styles.itemValue}>
      {parentComponent.renderWeight(idWeight)}
    </Text>
    <ListItem>
      <CheckBox
        checked={parentComponent.check(idWeight)}
        onPress={() => parentComponent.setStateWeight(idWeight)}
      />
      <Body>
        <Text>Notificame</Text>
      </Body>
    </ListItem>
  </View>
);
