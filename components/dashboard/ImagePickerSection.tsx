import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type ImageAssetItem = ImagePicker.ImagePickerAsset | { uri: string; [key: string]: any } | string;

interface ImagePickerSectionProps {
  images?: ImageAssetItem[];
  setImages: (images: ImageAssetItem[]) => void;
}

export default function ImagePickerSection({ images = [], setImages }: ImagePickerSectionProps) {
  const [pickerVisible, setPickerVisible] = useState(false);

  const pickImage = () => {
    if (images.length >= 5) {
      Alert.alert("Limit Reached", "You can only upload up to 5 images");
      return;
    }
    setPickerVisible(true);
  };

  const handleCameraLaunch = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need camera access to take a photo."
        );
        return;
      }
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImages([...images, ...result.assets].slice(0, 5));
      }
    } catch (error) {
      console.log("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handleGalleryLaunch = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your gallery to upload a photo."
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: 5 - images.length,
        quality: 0.7,
      });

      if (!result.canceled) {
        setImages([...images, ...result.assets].slice(0, 5));
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        {images.map((img, index) => {
          const imageUri = typeof img === "string" ? img : img.uri;
          return (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: imageUri }} style={styles.preview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Feather name="x" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          );
        })}

        {images.length < 5 && (
          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <Feather name="plus" size={24} color="#3b5bdb" />
            <Text style={styles.addText}>{images.length}/5</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setPickerVisible(false)}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Add Photo</Text>
            
            <TouchableOpacity 
              style={styles.pickerOption} 
              onPress={() => {
                setPickerVisible(false);
                handleCameraLaunch();
              }}
            >
              <Feather name="camera" size={20} color="#3b5bdb" style={{ marginRight: 12 }} />
              <Text style={styles.pickerOptionText}>Take Photo (Camera)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.pickerOption} 
              onPress={() => {
                setPickerVisible(false);
                handleGalleryLaunch();
              }}
            >
              <Feather name="image" size={20} color="#3b5bdb" style={{ marginRight: 12 }} />
              <Text style={styles.pickerOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.pickerCancelBtn} 
              onPress={() => setPickerVisible(false)}
            >
              <Text style={styles.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  scroll: { flexDirection: "row" },
  imageWrapper: {
    marginRight: 10,
    position: "relative",
  },
  preview: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3b5bdb",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4ff",
  },
  addText: {
    fontSize: 10,
    color: "#3b5bdb",
    marginTop: 4,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 20,
    textAlign: "center",
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  pickerOptionText: {
    fontSize: 16,
    color: "#2D3436",
    fontWeight: "600",
  },
  pickerCancelBtn: {
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    alignItems: "center",
  },
  pickerCancelText: {
    color: "#666",
    fontWeight: "700",
    fontSize: 16,
  },
});
