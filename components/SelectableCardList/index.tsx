import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  View,
  RefreshControl,
} from "react-native";
import { io } from "socket.io-client";

import SelectableCard from "../SelectableCard";
import SelectableCardData from "../../interfaces/SelectableCardData";
import UploadImageButton from "../UploadImageButton/UploadImageButton";

export default function SelectableCardList() {
  const [selectedCardID, setSelectedCardID] = useState<string | undefined>();
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [cardData, setCardData] = useState<SelectableCardData[]>([]);
  const [imageCount, setImageCount] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const ip = "http://192.168.86.26:3000";
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
    getImageCount();
    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.close();
    };
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setCardData([]);
    getImageCount().then(() => setRefreshing(false));
  }, []);

  const getImageCount = async () => {
    try {
      const res = await fetch(`${ip}/api/getImageCount`);
      const data = await res.json();
      setImageCount(data.count);

      initializePlaceholders(data.count);

      for (let i = 0; i < data.count; i++) {
        fetchImage(i);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const initializePlaceholders = (count: number) => {
    const placeholders = new Array(count).fill(null).map((_, index) => ({
      id: index.toString(),
      name: "Loading...",
      image: "",
    }));

    setCardData(placeholders);
  };

  const fetchImage = async (index: number) => {
    try {
      const res = await fetch(`${ip}/api/fetchImage?page=${index}`);
      const data = await res.json();
      setCardData((prevState) => {
        const newCardData = [...prevState];
        newCardData[index] = {
          id: index.toString(),
          name: data.name,
          image: `data:image/${data.name.split(".").pop()};base64,${
            data.base64
          }`,
        };
        return newCardData;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onUploadSuccess = () => {
    getImageCount();
  };

  const handleSelection = (id: string) => {
    setSelectedCardID(id);

    const validObject =
      cardData.find((obj) => {
        return obj.id === `${id}`;
      }) || null;

    // Send the selected card's ID to the server
    if (socket && isConnected && validObject) {
      socket.emit("toggle-image", { imageName: validObject.name });
    } else {
      console.log("Socket is not connected");
    }
  };

  const deleteImage = async (filename: string) => {
    fetch(`${ip}/api/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "File deleted successfully") {
          alert("Image deleted successfully!");
          getImageCount();
        } else {
          alert("Image deletion failed!");
        }
      })
      .catch((error) => {
        alert(`Delete failed with error: ${error}`);
      });
  };

  const styles = StyleSheet.create({
    listContainer: {
      flex: 1,
    },
    listItemContainer: {},
  });

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={cardData}
        contentContainerStyle={styles.listItemContainer}
        renderItem={({ item }: ListRenderItemInfo<SelectableCardData>) => (
          <View style={{ alignItems: "center" }}>
            <SelectableCard
              data={item}
              setSelected={handleSelection}
              isSelected={selectedCardID === item.id}
              deleteImage={deleteImage}
            />
          </View>
        )}
        keyExtractor={(item: SelectableCardData) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <UploadImageButton onUploadSuccess={onUploadSuccess} />
    </View>
  );
}
