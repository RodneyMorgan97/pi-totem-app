import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ConnectionNotice from "./components/ConnectionNotice";
import ConnectionStatus from "./components/ConnectionStatus";
import SelectableCardList from "./components/SelectableCardList";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import BackgroundToggle from "./components/BackgroundToggle";

export default function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  const ip = "http://192.168.86.25:3000";
  // const ip = "http://192.168.4.1:3000"; // raspberry pi static ip address

  useEffect(() => {
    connectToSocket();
  }, []);

  const connectToSocket = () => {
    const newSocket = io(`${ip}`, {
      path: "/api/socket",
    });

    // Handling connect event
    newSocket.on("connect", () => {
      console.log("Connected to the socket server");
      setIsConnected(true);
    });

    // Handling disconnect event
    newSocket.on("disconnect", () => {
      console.log("Disconnected from the socket server");
      setIsConnected(false);
    });

    setSocket(newSocket);
    return () => {
      setIsConnected(false);
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.disconnect();
    };
  };

  const MainPage = () => {
    return (
      <View style={styles.mainPageContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.connectionStatus}>
            <ConnectionStatus isConnected={isConnected} />
          </View>
          <Text style={styles.headerText}>Pi Totem - Bonnaroo 2023</Text>
        </View>

        <View style={{ flex: 16 }}>
          {isConnected && socket ? (
            <View style={{ flex: 1 }}>
              <View style={{ flex: 2, paddingBottom: 5 }}>
                <SelectableCardList socket={socket} serverIP={ip} />
              </View>
              <View style={{ flex: 1 }}>
                <BackgroundToggle socket={socket} serverIP={ip} />
              </View>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
              }}
            >
              <ConnectionNotice />
            </View>
          )}
        </View>
      </View>
    );
  };

  const gradientColors = ["#79C031", "#7EBAB7", "#7A5FB7", "#F2788B"];

  return (
    <LinearGradient
      colors={gradientColors}
      start={[0, 0]}
      end={[0, 1]}
      style={styles.container}
    >
      {MainPage()}
      <StatusBar style="dark" />
    </LinearGradient>
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
  connectionStatus: {
    position: "absolute",
    left: 5,
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
    flexDirection: "row",
  },
  headerText: {
    color: "#79C130",
    fontSize: 30,
  },
});
