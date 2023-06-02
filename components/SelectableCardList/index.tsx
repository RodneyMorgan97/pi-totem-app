// SelectableCardList.tsx
import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, ListRenderItemInfo, Image } from "react-native";
import { io } from "socket.io-client";

import SelectableCard from "../SelectableCard";
import SelectableCardData from "../../interfaces/SelectableCardData";

export default function SelectableCardList() {
  const [selectedCardID, setSelectedCardID] = useState<string | undefined>();
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [cardData, setCardData] = useState<SelectableCardData[]>([]);
  const ip = "http://192.168.86.249:3000";
  // const ip = "http://192.168.4.1:3000"; // raspberry pi static ip address

  useEffect(() => {
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
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    fetch(`${ip}/api/fetchImages`)
      .then((res) => res.json())
      .then((data) => {
        setCardData(
          data.map((item: { name: string; base64: string }, index: number) => ({
            id: index.toString(),
            name: item.name,
            image: `data:image/jpeg;base64,${item.base64}`,
          }))
        );
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSelection = (id: string) => {
    setSelectedCardID(id);
    console.log(`pressing ${id}`);

    const validObject =
      cardData.find((obj) => {
        return obj.id === `${id}`;
      }) || null;

    // Send the selected card's ID to the server
    if (socket && isConnected && validObject) {
      console.log(`emitting toggle-image for image ${id}`);
      socket.emit("toggle-image", { imageName: validObject.name });
    } else {
      console.log("Socket is not connected");
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
