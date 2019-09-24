import React, { Component } from "react";
import {
  StyleSheet,
  Alert,
  ToastAndroid,
  KeyboardAvoidingView
} from "react-native";
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Button,
  Item,
  Input
} from "native-base";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userText: "",
      emailText: "",
      passwordText: "",
      response: ""
    };
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  register = () => {
    if (
      this.state.userText === "" ||
      this.state.emailText === "" ||
      this.state.passwordText === ""
    ) {
      Alert.alert(
        "Por favor no llenar todos los campos para poder registrar un nuevo usuario"
      );
    } else {
      fetch("https://intelliweight-server.herokuapp.com/users/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: this.state.userText,
          email: this.state.emailText,
          password: this.state.passwordText
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.mensaje === "Usuario registrado") {
            ToastAndroid.show("Usuario Registrado", ToastAndroid.SHORT);
            this.props.navigation.navigate("Login");
          } else {
            Alert.alert(responseJson.mensaje);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  render() {
    if (this.state.loading) {
      return <Text style={styles.loadingApp}>Cargando Aplicacion</Text>;
    }
    return (
      <KeyboardAvoidingView style={styles.keyboard} behavior="padding">
        <Container style={styles.container}>
          <Content padder contentContainerStyle={styles.content}>
            <Card>
              <CardItem header bordered>
                <Text style={styles.textCenter}>Registro de usarios</Text>
              </CardItem>
              <CardItem bordered>
                <Body>
                  <Item inlineLabel>
                    <MaterialIcons name="email" size={20}></MaterialIcons>
                    <Input
                      placeholder="Correo electrónico"
                      onChangeText={emailText =>
                        this.setState({ emailText: emailText })
                      }
                    />
                  </Item>
                  <Item inlineLabel>
                    <FontAwesome name="user-circle" size={20}></FontAwesome>
                    <Input
                      placeholder="Usuario"
                      onChangeText={userText =>
                        this.setState({ userText: userText })
                      }
                    />
                  </Item>
                  <Item inlineLabel last>
                    <FontAwesome name="lock" size={20}></FontAwesome>
                    <Input
                      secureTextEntry={true}
                      placeholder="Contraseña"
                      onChangeText={passwordText =>
                        this.setState({ passwordText: passwordText })
                      }
                    />
                  </Item>
                </Body>
              </CardItem>
              <CardItem footer bordered>
                <Button primary style={styles.button} onPress={this.register}>
                  <Text>Registrarse</Text>
                </Button>
              </CardItem>
            </Card>
          </Content>
        </Container>
      </KeyboardAvoidingView>
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
    marginLeft: "55%"
  },
  container: {
    backgroundColor: "white"
  },
  keyboard: {
    flex: 1
  }
});

export default Register;
