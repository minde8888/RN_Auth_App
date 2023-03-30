import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { FC, useContext } from "react";
import HomeScreen from "../components/pages/HomeScreen";
import LoginScreen from "../components/pages/LoginScreen";
import Signup from "../components/pages/SignupScreen";
import { AuthContext } from "./context/AuthContext";

const Stack = createStackNavigator();

const Routes: FC = () => {
  const { isAuth } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {isAuth ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={Signup} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Routes;