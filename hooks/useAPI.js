import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "https://yjsoon2.pythonanywhere.com";
const API_WHOAMI = "/whoami";
const API_LOGIN = "/auth";
const API_SIGNUP = "/newuser";

export function useUsername() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (token == null) {
        setError(true);
        setUsername(null);
      } else {
        try {
          const response = await axios.get(API + API_WHOAMI, {
            headers: { Authorization: `JWT ${token}` },
          });
          setUsername(response.data.username);
        } catch (e) {
          setError(true);
          setUsername(null);
        } finally {
          // this is run regardless of error or not
          setLoading(false);
        }
      }
    })();
    setRefresh(false);
  }, [refresh]);

  return [username, loading, error, setRefresh];
}

export function useAuth(username, password, navigationCallback) {
  [loading, setLoading] = useState(false);
  [errorText, setErrorText] = useState("");

  async function login() {
    console.log(" ----- Login ----- ");

    try {
      setLoading(true);
      const response = await axios.post(API + API_LOGIN, {
        username,
        password,
      });
      console.log("Success logging in!");
      console.log(response);
      await AsyncStorage.setItem("token", response.data.access_token);
      navigationCallback();
    } catch (error) {
      console.log("Error logging in!");
      console.log(error.response);
      setErrorText(error.response.data.description);
    } finally {
      setLoading(false);
    }
  }

  async function signup() {
    console.log(" ----- Sign up ----- ");

    try {
      setLoading(true);
      const response = await axios.post(API + API_SIGNUP, {
        username,
        password,
      });
      if (response.data.Error === "User already exists") {
        setErrorText("This user exists");
        return;
      }
      console.log("Success signing up");
      console.log(response);
      login();
    } catch (error) {
      console.log("Error signing up");
      console.log(error);
      setErrorText(error.response.data.description);
    } finally {
      setLoading(false);
    }
  }

  return [login, signup, loading, errorText];
}
