import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import ConnectionText from "./components/ConnectionNotice";
import SelectableCardList from "./components/SelectableCardList";
import NetInfo from "@react-native-community/netinfo";
import UploadImageButton from "./components/UploadImageButton/UploadImageButton";

export default function App() {
  const skipWifiConnection = true; // DEV Flag - remove before production
  const [isConnectedToTotem, setIsConnectedToTotem] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(checkWifiConnection);
    checkWifiConnection();
    return () => {
      unsubscribe();
    };
  }, []);

  const checkWifiConnection = () => {
    NetInfo.fetch().then((state) => {
      if (
        state.isConnected
        // &&
        // state.type === "wifi" &&
        // state.details.ssid === "TOTEM"
        // state.details.ssid === "FBI Van #2"
      ) {
        setIsConnectedToTotem(true);
        console.log("connected to totem wifi");
      } else {
        setIsConnectedToTotem(false);
        console.log("not connected to totem wifi");
      }
    });
  };

  const MainPage = () => {
    return (
      <View style={styles.mainPageContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Pi Totem: Bonnaroo 2023</Text>
        </View>

        <View style={{ flex: 16 }}>
          <SelectableCardList />
        </View>
        <UploadImageButton />
      </View>
    );
  };

  const ConnectPage = () => {
    return (
      <View style={styles.container}>
        <ConnectionText />
      </View>
    );
  };

  const choosePageToShow = () => {
    return skipWifiConnection || isConnectedToTotem
      ? MainPage()
      : ConnectPage();
  };

  return (
    <View style={styles.container}>
      {choosePageToShow()}
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mainPageContainer: {
    flex: 1,
    flexDirection: "column",
  },
  headerContainer: {
    backgroundColor: "#000",
    marginTop: "10%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 30,
  },
});
