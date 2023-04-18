import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, ListRenderItemInfo } from "react-native";
import { io } from "socket.io-client";

import SelectableCard from "../SelectableCard";
import cardData from "../../data/index";
import SelectableCardData from "../../interfaces/SelectableCardData";

export default function SelectableCardList() {
  const [selectedCardID, setSelectedCardID] = useState<string | undefined>();
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io("http://192.168.4.1:3000", {
      path: "/api/socket",
    });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleSelection = (id: string) => {
    setSelectedCardID(id);

    // Send the selected card's ID to the server
    if (socket) {
      socket.emit("toggle-image", { imageName: id });
    }
  };

  return (
    <FlatList
      data={cardData}
      renderItem={({ item }: ListRenderItemInfo<SelectableCardData>) => (
        <SelectableCard
          data={item}
          setSelected={handleSelection}
          isSelected={item.id === selectedCardID}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
