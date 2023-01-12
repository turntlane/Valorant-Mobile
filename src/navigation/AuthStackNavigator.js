import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetAuth from "../screens/AuthStack/GetAuth";
import GetPlayerId from "../screens/AuthStack/GetPlayerId";

const AuthStack = createNativeStackNavigator();

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name={"Login"} component={GetAuth} />
      <AuthStack.Screen name={"PlayerID"} component={GetPlayerId} />
      {/* <AuthStack.Screen
                name={'Register'}
                component={RegisterScreen}
            /> */}
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
