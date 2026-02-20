import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ImagePickerSection({ image, setImage }) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.preview} />
      ) : (
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Feather name="image" size={20} color="#3b5bdb" />
          <Text style={styles.imageText}>Add Image</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  imageText: {
    color: "#3b5bdb",
    fontWeight: "500",
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    marginTop: 8,
  },
});
