import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import SelectableCardData from "../../../interfaces/SelectableCardData";

interface Props {
  data: SelectableCardData;
  setSelected: (id: string) => void;
  isSelected: boolean;
}

export default function SelectableCard(props: Props) {
  const styles = StyleSheet.create({
    cardContainer: {
      flex: 1,
      padding: 10,
      flexDirection: "row",
      width: `100%`,
      backgroundColor: props.isSelected ? "#F5F5F5" : "#DEDEDE",
      height: "20%",
      alignItems: "center",
      borderColor: "#000",
      borderWidth: 2,
      flexWrap: "wrap",
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
  });

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => {
        props.setSelected(props.data.id);
      }}
    >
      <Image
        source={props.data.imagePath}
        style={styles.imageStyle}
        resizeMode="contain"
      />
      <Text style={styles.title} textBreakStrategy="simple">
        {props.data.cardTitle}
      </Text>
    </TouchableOpacity>
  );
}
