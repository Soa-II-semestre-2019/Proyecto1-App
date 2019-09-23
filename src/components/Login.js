import React, { Component } from 'react';
import {StyleSheet} from 'react-native';
import { Container, Content, Card, CardItem, Text, Body, Button, Item, Input } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { loading: true };
    }

    async componentWillMount() {
        await Expo.Font.loadAsync({  
          Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf"),
        });
        this.setState({ loading: false });
    }

    register = () => {
        this.props.navigation.navigate('Register'); 
    }

    dashboard = () => {
        this.props.navigation.navigate('Dashboard'); 
    }
       

    render () {
        if (this.state.loading) {
            return <Text style={styles.loadingApp}>Cargando Aplicacion</Text>;
        }
        return (
            <Container style={styles.container} >
            <Content padder contentContainerStyle={styles.content}>
              <Card style={styles.carta}>
                <CardItem header bordered>
                  <Text style={styles.textCenter}>Inicio de Sesión</Text>
                </CardItem>
                <CardItem bordered>
                    <Body>
                    <Item inlineLabel>
                        <FontAwesome name='user-circle' size={20}></FontAwesome>
                        <Input placeholder='Usuario'/>
                    </Item>
                    <Item inlineLabel last>
                    <FontAwesome name='lock' size={20}></FontAwesome>
                        <Input secureTextEntry={true} placeholder='Contraseña'/>
                    </Item>
                  </Body>
                </CardItem>
                <CardItem footer bordered>
                    <Button primary onPress={this.register}>
                         <Text>Registro</Text> 
                    </Button> 
                    <Button success style={styles.button} onPress={this.dashboard}>
                        <Text>Entrar</Text> 
                    </Button>
                </CardItem>
              </Card>
            </Content>
          </Container>
        ); 
    }
}

const styles = StyleSheet.create({
    textCenter: {
        textAlign: 'center', 
        width: '100%'
    },
    content: {
        flex: 1,
        justifyContent: 'center'
    },
    loadingApp: {
        textAlign: 'center', 
        width: '100%',
        justifyContent: 'center'
    },
    button: {
        marginLeft: '38%'
    },
    container: {
        backgroundColor: 'white' 
    },
    carta: {
        backgroundColor: 'gray'
    }
    })

export default Login
