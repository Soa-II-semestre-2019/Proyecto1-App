import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Login from "./src/components/Login";
import Register from "./src/components/Register";
import Dashboard from "./src/components/Dashboard";

const LoginNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      title: "IntelliWeight"
    }
  },
  Register: {
    screen: Register,
    navigationOptions: {
      title: "IntelliWeight"
    }
  },
  Dashboard: {
    screen: Dashboard,
    navigationOptions: {
      title: "IntelliWeight"
    }
  }
});

export default createAppContainer(LoginNavigator);
