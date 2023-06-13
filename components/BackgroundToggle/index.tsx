import type { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import {
  Button,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useState } from "react";

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  serverIP: string;
}

const BackgroundToggle = (props: Props) => {
  const [hex, setHex] = useState<string | null>();

  const handleSelection = (result: string) => {
    console.log(result);
    setHex(result);
  };

  const submitSelection = () => {
    if (hex) {
      console.log("sending: ", hex);
      props.socket.emit("toggle-background", { color: hex });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
    },
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
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 10,
    },
    submitButton: {
      padding: 10,
      backgroundColor: "#5067FF",
      margin: 10,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontSize: 20,
      color: "white",
      textAlign: "center",
    },
    colorBox: {
      width: 40,
      height: 40,
      margin: 5,
      borderColor: "#000000",
      borderWidth: 1,
      borderRadius: 20,
    },
    input: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      margin: 10,
      width: "80%",
      alignSelf: "center",
      borderRadius: 30,
      paddingLeft: 5,
    },
  });

  const COLORS = [
    "#e6194b",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#f032e6",
    "#bcf60c",
    "#fabebe",
    "#008080",
    "#e6beff",
    "#9a6324",
    "#fffac8",
    "#800000",
    "#aaffc3",
    "#808000",
    "#ffd8b1",
    "#000075",
    "#808080",
    "#ffffff",
    "#000000",
  ];

  const renderColorBoxes = COLORS.map((color, index) => (
    <TouchableOpacity
      key={index}
      style={{ ...styles.colorBox, backgroundColor: color }}
      onPress={() => handleSelection(color)}
    />
  ));

  return (
    <View style={styles.container}>
      <ScrollView style={styles.cardContainer}>
        <Text style={styles.title}>Background</Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            padding: 10,
          }}
        >
          {renderColorBoxes}
        </View>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setHex(text)}
          value={hex || ""}
          placeholder="Enter color hex code"
        />
        <TouchableOpacity onPress={submitSelection} style={styles.submitButton}>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default BackgroundToggle;
