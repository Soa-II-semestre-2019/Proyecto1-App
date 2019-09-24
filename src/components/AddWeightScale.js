import React, { Component } from "react";
import {
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  AsyncStorage
} from "react-native";
import { View } from "native-base";
import Modal from "react-native-modalbox";
import Button from "react-native-button";

let weightArray = [];

export default class AddWeightScale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idWeight: "",
      itemType: "",
      weightLimit: "1"
    };
  }

  show = () => {
    this.myModal.open();
  };

  getData = async () => {
    try {
      this.props.parentComponent.setState({ modalMessage: this.state.topic });
      weightArray.push(JSON.stringify(this.state));
      AsyncStorage.setItem("weightArray", JSON.stringify(this.weightArray));
      console.log(weightArray);
      alert(weightArray);
      this.setState({
        idWeight: "",
        itemType: "",
        weightLimit: "1"
      });
      this.myModal.close();
    } catch (error) {
      alert(error);
    }
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
          <Text>Agregar Medición</Text>
          <TextInput
            onChangeText={text => this.setState({ idWeight: text })}
            placeholder="Topic"
            value={this.state.idWeight}
          />
          <TextInput
            onChangeText={text => this.setState({ itemType: text })}
            placeholder="scaleName"
            value={this.state.itemType}
          />
          <TextInput
            onChangeText={text => this.setState({ weightLimit: text })}
            placeholder="weightLimit"
            value={this.state.weightLimit}
          />
          <Button
            onPress={() => {
              if (this.state.idWeight.length == 0) {
                alert("No puede haber campos vacios");
                return;
              } else {
                this.getData();
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
    height: 500
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
