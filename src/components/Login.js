import React, { Component } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  ToastAndroid,
  AsyncStorage
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
import { FontAwesome } from "@expo/vector-icons";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userText: "",
      passwordText: ""
    };
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  register = () => {
    this.props.navigation.navigate("Register");
  };

  /*Almacenar usuario en el local storage */
  _storeData = async () => {
    try {
      await AsyncStorage.setItem("user", this.state.userText);
    } catch (error) {
      alert(error);
    }
  };

  /*Envio de datos para ingresar a la aplicación*/
  login = () => {
    if (this.state.userText === "" || this.state.passwordText === "") {
      Alert.alert("Por favor llenar todos los campos para ingresar");
    } else {
      fetch("https://intelliweight-server.herokuapp.com/users/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: this.state.userText,
          password: this.state.passwordText
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.mensaje === "Login exitoso") {
            ToastAndroid.show("Bienvenido", ToastAndroid.SHORT);
            this._storeData();
            this.props.navigation.navigate("Dashboard");
          } else {
            Alert.alert(responseJson.mensaje);
          }
        })
        .catch(error => {
          console.error(error);
          Alert.alert(error);
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
            <Card style={styles.carta}>
              <CardItem header bordered>
                <Text style={styles.textCenter}>Inicio de Sesión</Text>
              </CardItem>
              <CardItem>
                <Body>
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
              <CardItem footer>
                <Button primary onPress={this.register}>
                  <Text>Registro</Text>
                </Button>
                <Button success style={styles.button} onPress={this.login}>
                  <Text>Entrar</Text>
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
    marginLeft: "38%"
  },
  container: {
    backgroundColor: "white"
  },
  carta: {
    backgroundColor: "gray"
  },
  keyboard: {
    flex: 1
  }
});

export default Login;
