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
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";

interface UploadImageButtonProps {
  onUploadSuccess: () => void;
  serverIP: string;
}

const UploadImageButton = (props: UploadImageButtonProps) => {
  const [imageName, setImageName] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerSuccessResult | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
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
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      // calculate the scaled dimensions
      const { width, height } = result.assets[0];
      const maxWidth = Dimensions.get("window").width; // Screen width
      const maxHeight = Dimensions.get("window").height * 0.8; // 80% of screen height

      // Determine whether to scale based on height or width
      let scaleFactor, scaledWidth, scaledHeight;
      if (width / height > maxWidth / maxHeight) {
        // Image is wider, scale to fit width
        scaleFactor = maxWidth / width;
      } else {
        // Image is taller, scale to fit height
        scaleFactor = maxHeight / height;
      }
      scaledWidth = width * scaleFactor;
      scaledHeight = height * scaleFactor;

      setImageDimensions({ width: scaledWidth, height: scaledHeight });
      setSelectedImage(result);
      setModalVisible(true);
    }
  };

  const uploadFile = async (
    uri: string,
    fileName: string,
    fileType: string
  ) => {
    try {
      let response;
      if (Platform.OS === "web") {
        let formData = new FormData();
        const responseFetch = await fetch(uri);
        const blob = await responseFetch.blob();
        formData.append(`${fileName}.${fileType}`, blob);
        response = await fetch(`${props.serverIP}/api/upload`, {
          method: "POST",
          body: formData,
        });
        return await response.json(); // parse response to JSON for web
      } else {
        response = (await FileSystem.uploadAsync(
          `${props.serverIP}/api/upload`,
          uri,
          {
            fieldName: `${fileName}.${fileType}`,
            httpMethod: "POST",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          }
        )) as any;
        return JSON.parse(response.body); // parse response to JSON for mobile
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const onUpload = async () => {
    if (!imageName || !selectedImage) {
      alert("Please enter an image name and select an image.");
      return;
    }

    setIsUploadLoading(true);

    try {
      const fileName = sanitizeFilename(imageName);
      let fileType: string;
      if (Platform.OS === "web") {
        const response = await fetch(selectedImage.assets[0].uri);
        const blob = await response.blob();
        fileType = blob.type.split("/")[1];
      } else {
        fileType = String(selectedImage.assets[0].uri.split(".").pop());
      }

      const data = await uploadFile(
        selectedImage.assets[0].uri,
        fileName,
        fileType
      );

      if (data.error === "A file with this name already exists") {
        alert(
          "A file with this name already exists. Please choose a different name."
        );
      } else if (data.message === "Upload successful") {
        alert("Image uploaded successfully!");
        setModalVisible(false);
        setSelectedImage(null);
        setImageName("");
        props.onUploadSuccess
          ? props.onUploadSuccess()
          : console.error("onUploadSuccess function is not provided!");
      } else {
        alert("Image upload failed!");
      }
    } catch (error) {
      alert(`Upload failed with error: ${error}`);
    }
    setIsUploadLoading(false);
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
                <Text style={styles.buttonText}>
                  {isUploadLoading ? "Loading" : "Upload"}
                </Text>
              </TouchableOpacity>
            )}
            {selectedImage && (
              <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage.assets[0].uri }}
              style={{ ...styles.image, ...imageDimensions }}
            />
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

// Utility function to sanitize filenames
const sanitizeFilename = (filename: string) => {
  return filename.replace(/[\/\\?%*:|"<>]/g, "-");
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
    paddingTop: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 5,
    paddingLeft: 10,
    borderRadius: 30,
    width: "60%",
    backgroundColor: "white",
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
    marginBottom: 20,
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
