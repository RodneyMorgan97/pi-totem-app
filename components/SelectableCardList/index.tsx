import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  View,
  RefreshControl,
} from "react-native";
import type { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import SelectableCard from "../SelectableCard";
import SelectableCardData from "../../interfaces/SelectableCardData";
import UploadImageButton from "../UploadImageButton";

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  serverIP: string;
}
export default function SelectableCardList(props: Props) {
  const [selectedCardID, setSelectedCardID] = useState<string | undefined>();
  const [cardData, setCardData] = useState<SelectableCardData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getImageCount();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setCardData([]);
    getImageCount().then(() => setRefreshing(false));
  }, []);

  const getImageCount = async () => {
    try {
      const res = await fetch(`${props.serverIP}/api/getImageCount`);
      const data = await res.json();
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
      const res = await fetch(`${props.serverIP}/api/fetchImage?page=${index}`);
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
    if (validObject) {
      props.socket.emit("toggle-image", { imageName: validObject.name });
    } else {
      console.log("Socket is not connected");
    }
  };

  const deleteImage = async (filename: string) => {
    fetch(`${props.serverIP}/api/delete`, {
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
      <UploadImageButton
        serverIP={props.serverIP}
        onUploadSuccess={onUploadSuccess}
      />
    </View>
  );
}
