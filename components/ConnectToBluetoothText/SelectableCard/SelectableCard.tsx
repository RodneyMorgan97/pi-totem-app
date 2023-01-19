import { StyleSheet, Text, View, Image } from "react-native";
import SelectableCardData from "../../../interfaces/SelectableCardData";
import { Dimensions } from "react-native";

interface Props {
  data: SelectableCardData;
}
export default function SelectableCard(props: Props) {
  return (
    <View style={styles.cardContainer}>
      <Image
        source={props.data.imagePath}
        style={styles.imageStyle}
        resizeMode="contain"
      />
      <Text>{props.data.cardTitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: "row",
    width: Dimensions.get("window").width,
    backgroundColor: "#ff3",
    height: "20%",
    alignItems: "center",
    // justifyContent: "center",
    borderColor: "#000",
    borderWidth: 2,
  },
  imageStyle: {
    width: "40%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "contain",
  },
});
