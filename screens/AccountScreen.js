import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
  Switch,
} from "react-native";
import { commonStyles } from "../styles/commonStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUsername } from "../hooks/useAPI";
import { useDispatch } from "react-redux";
import { signOutAction } from "../redux/ducks/blogAuth";

export default function AccountScreen({ navigation }) {
  const [username, loading, error, refresh] = useUsername();
  const [isEnabled, setIsEnabled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      signOut();
    }
  }, [error]); // monitor the error state variable

  useEffect(() => {
    console.log("Setting up navlistener");
    const removeListener = navigation.addListener("focus", () => {
      refresh(true);
    });
    return removeListener;
  }, []); // run this once on start

  function signOut() {
    AsyncStorage.removeItem("token");
    dispatch(signOutAction());
  }

  return (
    <View style={commonStyles.container}>
      <Text>Account Screen</Text>
      {loading ? <ActivityIndicator /> : <Text>{username}</Text>}
      <Switch
        value={isEnabled}
        onValueChange={() => setIsEnabled(!isEnabled)}
      />
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({});
