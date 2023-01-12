import { StyleSheet, Text, View,  } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import CustomButton from "../../components/CustomButton";
import CookieManager from "@react-native-cookies/cookies";
import CustomTextInput from "../../components/CustomTextInput";
import IonIcons from "react-native-vector-icons/Ionicons";
import {AuthContext} from '../../contexts/AuthContext';

const GetAuth = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [entitlement, setEntitlement] = useState("");

  const {login} = useContext(AuthContext)

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
      username: username,
      password: password,
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
        console.log(userToken)
        setToken(userToken);
        login(userToken)
        // console.log(userToken);

        // try {
        //   if (token.length !== 0) {
        //     getEntitlement();
        //   }
        // } catch (err) {
        //   console.log(err);
        // }
      })
      // .then(getEntitlement())
      .catch((error) => console.log("error", error));
  };


    // GETS ENTITLEMENT TOKEN
    // TRYING TO GET THIS TO PASS TOKEN AND ENTITLEMENT TOKEN ??
  const getEntitlement = async (token) => {
    // await getAuth()
    console.log(token)
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      "https://entitlements.auth.riotgames.com/api/token/v1",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.entitlements_token);
        let userEntitlement = result.entitlements_token;
        // setEntitlementToken(result.entitlements_token);
        props.navigation.navigate("PlayerID", {
          playerToken: token,
          playerEntitlement: userEntitlement,
        });
      })
      .catch((error) => console.log("error", error));
  };





  const handleUsername = (value) => {
    setUsername(value);
    console.log(username);
  };
  const handlePassword = (value) => {
    setPassword(value);
    console.log(password);
  };

  // CLEARS COOKIES
  const clearCookie = () => {
    CookieManager.clearAll().then((success) => {
      console.log("CookieManager.clearAll =>", success);
    });
  };

  // useEffect(() => {
  //   (async () => {
  //     clearCookie();
  //     await getCookies();
  //   })();
  //   return () => {};
  // }, []);

  return (
    <View style={styles.container}>
      <CustomTextInput
        value={username}
        onChangeText={handleUsername}
        placeholder="Enter Username"
      />

      <CustomTextInput
        value={password}
        onChangeText={handlePassword}
        placeholder="Enter Password"
        secureTextEntry={true}
      />
      <CustomButton text="Auth" onPress={getAuth} />

      <CustomButton text="Valorant" onPress={getEntitlement} />
      {/* <CustomButton text="Entitlement" onPress={getEntitlement} /> */}
    </View>
  );
};

export default GetAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
