import React, { Component } from "react";
import {
  Text,
  Dimensions,
  StyleSheet,
  ToastAndroid,
  Alert,
  AsyncStorage
} from "react-native";
import { View, CardItem, Body, Item, Input } from "native-base";
import Modal from "react-native-modalbox";
import Button from "react-native-button";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

export default class AddWeightScale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idWeight: "",
      itemType: "",
      weightLimit: "1",
      storeUser: "",
      weightArray: []
    };
  }

  async componentDidMount() {
    let storeUser = await AsyncStorage.getItem("user");
    this.setState({ storeUser });
  }

  show = () => {
    this.myModal.open();
  };

  openModal = (idWeight, itemType, weightLimit) => {
    this.setState({ idWeight, itemType, weightLimit });
    this.myModal.open();
  };

  /*Obtención de dispositivos asociados a un usuario*/
  getData = () => {
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
      });
  };

  /*Registro de dispositivos asociados a un usuario*/
  sendData = () => {
    fetch("https://intelliweight-server.herokuapp.com/userDevice", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: this.state.storeUser,
        idWeight: this.state.idWeight,
        itemType: this.state.itemType,
        weightLimit: this.state.weightLimit
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.mensaje === "Dispositivo agregado") {
          ToastAndroid.show("Agregado", ToastAndroid.SHORT);
          this.getData();
          this.props.parentComponent.setState({
            weightArray: this.state.weightArray
          });
          this.myModal.close();
        } else {
          Alert.alert(responseJson.mensaje);
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert(error);
      });
  };

  render() {
    return (
      <Modal
        ref={modal => (this.myModal = modal)}
        position="center"
        backdrop={true}
        style={styles.modal}
      >
        <View>
          <Text style={styles.titulo}>Agregar Medición</Text>
          <CardItem bordered>
            <Body>
              <Item inlineLabel>
                <FontAwesome name="barcode" size={20}></FontAwesome>
                <Input
                  placeholder="Código del Dispositivo"
                  onChangeText={text => this.setState({ idWeight: text })}
                  value={this.state.idWeight}
                />
              </Item>
              <Item inlineLabel>
                <FontAwesome name="balance-scale" size={20}></FontAwesome>
                <Input
                  placeholder="Producto medición"
                  onChangeText={text => this.setState({ itemType: text })}
                  value={this.state.itemType}
                />
              </Item>
              <Item inlineLabel last>
                <MaterialCommunityIcons
                  name="scale"
                  size={20}
                ></MaterialCommunityIcons>
                <Input
                  onChangeText={text => this.setState({ weightLimit: text })}
                  placeholder="Peso mínimo"
                  //value={this.state.weightLimit}
                />
              </Item>
            </Body>
          </CardItem>
          <Button
            onPress={() => {
              if (this.state.idWeight.length == 0) {
                alert("No puede haber campos vacios");
                return;
              } else {
                this.sendData();
              }
            }}
          >
            OK
          </Button>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    shadowRadius: 10,
    width: Dimensions.get("screen").width - 30,
    height: 310,
    borderRadius: 20
  },
  titulo: {
    textAlign: "center",
    width: "100%",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 30
  }
});
