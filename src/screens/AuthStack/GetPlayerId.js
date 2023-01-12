import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import CustomButton from "../../components/CustomButton";
import CookieManager from "@react-native-cookies/cookies";
import React, { useState, useEffect } from "react";

const GetPlayerId = (props) => {
  const [entitlementToken, setEntitlementToken] = useState("");
  const [statePlayerToken, setStatePlayerToken] = useState("");
  const [ownID, setOwnID] = useState("");
  const [storeID, setStoreID] = useState([]);
  const [skin, setSkin] = useState("");

  // GETS ENTITLEMENT TOKEN

  // IT IS NOT GETTING ENTITLEMENT TOKEN FOR SOME REASON MAYBE NOT PASSING FROM GETAUTH IN NAVIGATEION
  const getEntitlement = async (playerToken) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${playerToken}`);
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
      .then((response) => {
        // console.log(response.entitlements_token);
        setEntitlementToken(response.entitlements_token);
        console.log("this is from getEntitlement function: ", entitlementToken);
      })
      .catch((error) => console.log("error", error));
  };

  //GETS OWN USERS ID
  const getOwnId = async (playerToken) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${playerToken}`);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch("https://auth.riotgames.com/userinfo", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.sub);
        setOwnID(result.sub);
      })
      .catch((error) => console.log("error", error));
  };

  //GETS USERS ITEMS IN SHOP
  const getStore = async (playerToken, playerEntitlement) => {
    console.log(
      "This is player token: ",
      playerToken,
      "this is ownID: ",
      ownID,
      "this is entitlement token: ",
      entitlementToken
    );
    const myHeaders = new Headers();
    myHeaders.append("X-Riot-Entitlements-JWT", playerEntitlement);
    myHeaders.append("Authorization", `Bearer ${playerToken}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `https://pd.na.a.pvp.net/store/v2/storefront/${ownID}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.FeaturedBundle.Bundle.DataAssetID);

        // console.log(result.SkinsPanelLayout.SingleItemOffers);
        setStoreID(result.SkinsPanelLayout.SingleItemOffers);
      })
      //   .then(() => getSkinLevel())
      .catch((error) => console.log("error", error));
  };

  //GETS IMAGES FOR SKINS IN SHOP **** NEEDS WORK
  const getSkinLevel = async () => {
    // await getStore();
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const promises = storeID.map((item) => {
      return fetch(
        `https://valorant-api.com/v1/weapons/skinlevels/${item}`,
        requestOptions
      ).then((response) => {
        return response.json();
      });
    });

    Promise.all(promises).then((results) => {
      const videos = results.map((result) => result.data.displayIcon);
      console.log(videos);
      setSkin(videos);
    });
  };

  // CLEARS COOKIES
  const clearCookie = () => {
    CookieManager.clearAll().then((success) => {
      console.log("CookieManager.clearAll =>", success);
    });
  };

  useEffect(() => {
    (async () => {
      let playerToken = props.route.params.playerToken;
      let playerEntitlement = props.route.params.playerEntitlement;
      //   setStatePlayerToken(playerToken);
      await getEntitlement(playerToken);

      await getOwnId(playerToken);
      await getStore(playerToken, playerEntitlement);
    })();
    return () => {};
  }, [props.route.params.playerToken, props.route.params.playerEntitlement]);

  return (
    <View>
      <Text>GetPlayerId</Text>
      {/* <CustomButton text="Shop" onPress={getStore} /> */}
      <CustomButton text="Skins" onPress={getSkinLevel} />
      <CustomButton text="clear" onPress={clearCookie} />
      <FlatList
        data={skin}
        // keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <View>
            <Image style={{ width: 150, height: 50 }} source={{ uri: item }} />
          </View>
        )}
      />
    </View>
  );
};

export default GetPlayerId;

const styles = StyleSheet.create({});
