import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import ConnectToBluetoothText from "./components/ConnectToBluetoothText/ConnectToBluetoothText";
import SelectableCard from "./components/ConnectToBluetoothText/SelectableCard/SelectableCard";
import cardData from "./data/index";
import SelectableCardData from "./interfaces/SelectableCardData";
export default function App() {
  const skipBluetooth = true;

  const MainPage = () => {
    return (
      <View style={styles.mainPageContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Pi Totem: Bonnaroo 2023</Text>
        </View>

        <View style={{ flex: 16 }}>
          <FlatList
            data={cardData}
            renderItem={({ item }: ListRenderItemInfo<SelectableCardData>) => (
              <SelectableCard data={item} />
            )}
            keyExtractor={(item) => item.id}
            style={styles.scrollableCards}
          />
        </View>
      </View>
    );
  };

  const ConnectPage = () => {
    return (
      <View style={styles.container}>
        <ConnectToBluetoothText />
      </View>
    );
  };

  const choosePageToShow = () => {
    return skipBluetooth ? MainPage() : ConnectPage();
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
  scrollableCards: {
    backgroundColor: "#fff",
  },
});
