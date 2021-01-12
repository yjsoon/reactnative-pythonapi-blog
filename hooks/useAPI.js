import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "https://yjsoon2.pythonanywhere.com";
const API_WHOAMI = "/whoami";

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
