import { useState } from "react";
import { StyleSheet, FlatList, ListRenderItemInfo } from "react-native";

import SelectableCard from "../../components/ConnectToBluetoothText/SelectableCard";
import cardData from "../../data/index";
import SelectableCardData from "../../interfaces/SelectableCardData";

export default function SelectableCardList() {
  // only one card can be selected at a time, so this keeps track of the ID of the last selected card
  const [selectedCardID, setSelectedCardID] = useState<string | undefined>();

  return (
    <FlatList
      data={cardData}
      renderItem={({ item }: ListRenderItemInfo<SelectableCardData>) => (
        <SelectableCard
          data={item}
          setSelected={setSelectedCardID}
          isSelected={item.id === selectedCardID}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
