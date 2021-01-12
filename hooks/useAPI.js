import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "https://yjsoon2.pythonanywhere.com";
const API_WHOAMI = "/whoami";

export function useUsername(signOutCallback) {
  async function getUsername() {
    console.log("---- Getting user name ----");
    const token = await AsyncStorage.getItem("token");
    if (token == null) {
      signOutCallback();
      return null;
    }
    console.log(`Token is ${token}`);
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got user name!");
      return response.data.username;
    } catch (error) {
      console.log("Error getting user name");
      signOutCallback();
      return null;
    }
  }

  return getUsername;
}
