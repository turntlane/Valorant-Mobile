import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useMemo, useReducer } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import CookieManager from "@react-native-cookies/cookies";
import CustomTextInput from "./src/components/CustomTextInput";
import Navigation from "./src/navigation/Navigation";
import { AuthContext } from "./src/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import { COOKIE_URL, AUTH_URL, ENTITLEMENT_URL } from "./src/config";
import GetPlayerId from "./src/screens/AuthStack/GetPlayerId";
import AuthStackNavigator from "./src/navigation/AuthStackNavigator";

const initialAuthState = {
  user: null,
  token: null,
  isLoading: true,
};

const authReducer = (previousState, action) => {
  switch (action.type) {
    case "RETRIEVE_TOKEN":
      return {
        ...previousState,
        user: action.user,
        token: action.token,
        isLoading: false,
      };
    case "LOGIN":
      return {
        ...previousState,
        user: action.user,
        token: action.token,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...previousState,
        user: null,
        token: null,
        isLoading: false,
      };
    case "REGISTER":
      return {
        ...previousState,
        user: action.user,
        token: action.token,
        isLoading: false,
      };
    default:
      return previousState;
  }
};

export default function App(props) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  // const [token, setToken] = useState('')

  const authContext = useMemo(
    () => ({
      login: async (data) => {
        try {
          // console.log(data);
          await AsyncStorage.setItem("token", data);
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGIN", user: data.user, token: data });
      },
      logout: async () => {
        await AsyncStorage.removeItem("token");
        dispatch({ type: "LOGOUT" });
      },
      register: async (data) => {
        try {
          await AsyncStorage.setItem("token", data);
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "REGISTER", user: data.user, token: data });
      },
    }),
    []
  );

  // CLEARS COOKIES
  const clearCookie = () => {
    CookieManager.clearAll().then((success) => {
      console.log("CookieManager.clearAll =>", success);
    });
  };

  //GETS COOKIES
  const getCookies = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      client_id: "play-valorant-web-prod",
      nonce: "1",
      redirect_uri: "https://playvalorant.com/opt_in",
      response_type: "token id_token",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://auth.riotgames.com/api/v1/authorization", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  //GETS AUTH
  const getAuth = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      type: "auth",
      username: "Turnlane",
      password: "",
      remember: true,
      language: "en_US",
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(
      "https://auth.riotgames.com/api/v1/authorization",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        let newRes = result.response.parameters.uri;
        let userToken = newRes.slice(
          newRes.indexOf("=") + 1,
          newRes.indexOf("&")
        );
        // console.log(userToken);
        setToken(userToken);
      })
      // .then(getEntitlement())
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    clearCookie();
    getCookies();
    const verifyAuthStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem("token");
        // console.log(userToken);
        if (userToken === undefined) {
          dispatch({ type: "LOGOUT" });
        }
        if (userToken !== undefined) {
          return <GetPlayerId />;
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    // verifyAuthStatus();
    // const verifyAuthStatus = async () => {
    //   try {
    //     const myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
    //     const raw = JSON.stringify({
    //       type: "auth",
    //       // username: username,
    //       // password: password,
    //       username: "Turnlane",
    //       password: "",
    //       remember: true,
    //       language: "en_US",
    //     });

    //     const requestOptions = {
    //       method: "PUT",
    //       headers: myHeaders,
    //       body: raw,
    //       redirect: "follow",
    //     };

    //     await fetch(`${AUTH_URL}`, requestOptions)
    //       .then((response) => response.json())
    //       .then((result) => {
    //         let newRes = result.response.parameters.uri;
    //         let userToken = newRes.slice(
    //           newRes.indexOf("=") + 1,
    //           newRes.indexOf("&")
    //         );
    //         console.log(userToken)
    //       })
    //       .catch((error) => console.log("error", error));
    //   } catch (error) {
    //     Alert.alert("Error", error.message);
    //   }
    // };
    // (async () => {
    //   setTimeout(() => {
    //     verifyAuthStatus();
    //   }, 500);
    // })();
    return () => {};
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {/* {state.token !== null ? <BottomTabNavigator /> : <AuthStackNavigator />} */}
        <AuthStackNavigator />
      </NavigationContainer>
    </AuthContext.Provider>
    // <NavigationContainer style={styles.container}>
    //   <Navigation />
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
