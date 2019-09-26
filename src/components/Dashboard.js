import React, { Component } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Alert,
  KeyboardAvoidingView
} from "react-native";
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
import { TouchableOpacity } from "react-native-gesture-handler";

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

    this.state = {
      client,
      options,
      placa1State: true,
      placa2State: true,
      message_placa1: "",
      message_placa2: "",
      modalMessage: "",
      storeUser: "",
      weightArray: []
    };
  }

  async componentDidMount() {
    await this.state.client.connect(this.state.options);
    let storeUser = await AsyncStorage.getItem("user");
    this.setState({ storeUser });
    try {
      fetch("https://intelliweight-server.herokuapp.com/userDevice/findUser", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: this.state.storeUser
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({ weightArray: responseJson.mensaje });
        })
        .catch(error => {
          console.error(error);
          Alert.alert(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async componentWillUnmount() {
    await this.state.client.disconnect(this.state.options);
  }

  getUser = () => {
    alert(this.state.storeUser);
  };

  changeData = key => {
    for (i = 0; i < this.state.weightArray.length; i++) {
      if (this.state.weightArray[i].idWeight == key) {
        this.myModal.openModal(
          this.state.weightArray[i].idWeight,
          this.state.weightArray[i].itemType,
          1
        );
      }
    }
  };

  onConnect = () => {
    const { client } = this.state;
    console.log("onConnect");
    const topic = "/board_1/weight_1";
    client.subscribe(topic);
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
    if (id == "/board_1/weight_1") {
      return this.state.message_placa1;
    }
    if (id == "/board_1/weight_2") {
      return this.state.message_placa2;
    }
  };

  check = id => {
    if (id == "/board_1/weight_1") {
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

  displayData = async () => {
    Alert.alert(await AsyncStorage.getItem("pruebaArray"));
    return (weightArray = JSON.parse(
      await AsyncStorage.getItem("pruebaArray")
    ));
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.keyboard} behavior="padding">
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
                if (name == "bt_exit") {
                  this.getUser();
                }
              }}
            />
            <AddWeightScale
              ref={modal => (this.myModal = modal)}
              parentComponent={this}
            />
          </Content>
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

const WeightRow = ({ itemType, idWeight, parentComponent }) => (
  <View>
    <TouchableOpacity onLongPress={() => parentComponent.changeData(idWeight)}>
      <ListItem>
        <View style={styles.View}>
          <Text style={styles.itemTitle}>{itemType}</Text>
          <Text style={styles.itemValue}>
            {parentComponent.renderWeight(idWeight)} kg
          </Text>
        </View>
      </ListItem>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  textCenter: {
    textAlign: "center",
    width: "100%"
  },
  content: {
    flex: 1,
    padding: 20
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
    position: "absolute",
    right: 15,
    alignSelf: "flex-end"
  },
  keyboard: {
    flex: 1
  },
  View: {
    flex: 1,
    flexDirection: "row"
  }
});
