import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API = "https://yjsoon2.pythonanywhere.com";
const API_WHOAMI = "/whoami";

export default function AccountScreen({ navigation }) {
  const [username, setUsername] = useState("");

  async function getUsername() {
    console.log("---- Getting user name -----");

    /// get my token
    const token = await AsyncStorage.getItem("token");
    console.log(`Token is ${token}`);
    /// send it to the API and save the user name
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
      console.log("Got the user name!");
      console.log(response.data.username);
      setUsername(response.data.username);
    } catch (error) {
      console.log("Error getting user name!");
      console.log(error);
    }

    /// if succeed, we will display the user name
    /// if fail... do nothing?
  }

  useEffect(() => {
    getUsername();
  }, []);

  function signOut() {
    AsyncStorage.removeItem("token");
    navigation.navigate("SignIn");
  }

  return (
    <View style={commonStyles.container}>
      <Text>Account Screen</Text>
      <Text>{username}</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({});
