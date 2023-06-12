import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import SelectableCardData from "../../interfaces/SelectableCardData";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";

interface Props {
  data: SelectableCardData;
  setSelected: (id: string) => void;
  isSelected: boolean;
  deleteImage: (filename: string) => void;
}

export default function SelectableCard(props: Props) {
  const styles = StyleSheet.create({
    cardContainer: {
      flex: 1,
      padding: 10,
      flexDirection: "row",
      backgroundColor: "#fff",
      borderColor: "#000",
      borderWidth: 2,
      borderRadius: 10,
      flexWrap: "wrap",
      margin: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      width: "90%",
      height: "30%",
      alignItems: "center",
      justifyContent: "center",
    },
    imageStyle: {
      width: "40%",
      height: undefined,
      aspectRatio: 1,
      resizeMode: "contain",
      marginRight: 10,
    },
    title: {
      width: `40%`,
      fontSize: 20,
      textAlign: "center",
    },
    deleteIcon: {
      position: "absolute",
      right: 10,
      bottom: 10,
    },
    placeholder: {
      width: "40%",
      height: undefined,
      aspectRatio: 1,
    },
    placeholderImage: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      marginTop: "10%",
      marginBottom: "10%",
    },
  });

  const isLoading = props.data.name === "Loading..." && !props.data.image;

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => {
        if (!isLoading) props.setSelected(props.data.id);
      }}
    >
      {!isLoading ? (
        <Image
          source={{ uri: props.data.image }}
          style={styles.imageStyle}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <AntDesign name="picture" size={100} color="black" />
        </View>
      )}
      <Text style={styles.title} textBreakStrategy="simple">
        {!isLoading
          ? props.data.name.split(".").slice(0, -1).join(".")
          : "Loading..."}
      </Text>
      {!isLoading && (
        <FontAwesome5
          name="trash-alt"
          size={30}
          color="black"
          style={styles.deleteIcon}
          onPress={() => props.deleteImage(props.data.name)}
        />
      )}
    </TouchableOpacity>
  );
}
