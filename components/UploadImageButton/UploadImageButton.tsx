import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  Modal,
  SafeAreaView,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

const SERVER_URL = "http://192.168.86.249:3000";
// const SERVER_URL = "http://192.168.4.1:3000"; // raspberry pi static ip address

const UploadImageButton = () => {
  const [imageName, setImageName] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerSuccessResult | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const filename =
        result.assets[0].uri.split("/").pop() || result.assets[0].uri;

      // calculate the scaled dimensions
      const { width, height } = result.assets[0];
      const scaleFactor = 0.75;
      const scaledWidth = width * scaleFactor;
      const scaledHeight = height * scaleFactor;

      setImageDimensions({ width: scaledWidth, height: scaledHeight });
      setImageName(filename);
      setSelectedImage(result);
      setModalVisible(true);
    }
  };

  const onUpload = async () => {
    if (imageName) {
      // Implement upload logic here
      setModalVisible(false);
      setSelectedImage(null);
      setImageName("");
    }
  };

  const onCancel = () => {
    setModalVisible(false);
    setSelectedImage(null);
    setImageName("");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      <Modal animationType="slide" visible={modalVisible} transparent={true}>
        <SafeAreaView style={styles.modalContainer}>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage.assets[0].uri }}
              style={{ ...styles.image, ...imageDimensions }}
            />
          )}
          {selectedImage && (
            <TextInput
              style={styles.input}
              onChangeText={(text) => setImageName(text)}
              value={imageName || ""}
              placeholder="Enter image name"
            />
          )}
          <View style={styles.buttonContainer}>
            {selectedImage && (
              <TouchableOpacity onPress={onUpload} style={styles.uploadButton}>
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
            )}
            {selectedImage && (
              <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#5067FF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  image: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    paddingLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "50%",
    alignSelf: "center",
  },
  uploadButton: {
    padding: 10,
    backgroundColor: "#5067FF",
    borderRadius: 5,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
});

export default UploadImageButton;
