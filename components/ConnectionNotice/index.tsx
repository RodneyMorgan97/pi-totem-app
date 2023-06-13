import { StyleSheet, Text, View } from "react-native";

export default function ConnectToBluetoothText() {
  const styles = StyleSheet.create({
    cardContainer: {
      flexDirection: "column",
      backgroundColor: "#fff",
      borderColor: "#000",
      borderWidth: 2,
      borderRadius: 10,
      margin: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      width: "90%",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
  });
  return (
    <View style={styles.cardContainer}>
      <Text>Connect to the TOTEM network in Wi-Fi</Text>
    </View>
  );
}
