import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ImagePickerSection({ images = [], setImages }) {
  const pickImage = async () => {
    if (images.length >= 5) {
      alert("You can only upload up to 5 images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets].slice(0, 5));
    }
  };

  const removeImage = (index) => {
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
        {images.map((img, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: img.uri || img }} style={styles.preview} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <Feather name="x" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}

        {images.length < 5 && (
          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <Feather name="plus" size={24} color="#3b5bdb" />
            <Text style={styles.addText}>{images.length}/5</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
});
