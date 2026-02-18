import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
  mode: "create" | "edit" | "view";
};

const ImageItem = ({
  uri,
  onRemove,
  editable,
}: {
  uri: string;
  onRemove: () => void;
  editable: boolean;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useState(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  });

  return (
    <Animated.View
      style={[
        styles.imageWrap,
        {
          opacity: fadeAnim,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        },
      ]}
    >
      <Image source={{ uri }} style={styles.image} />
      {editable && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          activeOpacity={0.8}
        >
          <Feather name="x-circle" size={22} color="#E53935" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default function GallerySection({ images = [], onChange, mode }: Props) {
  const editable = mode !== "view";

  const pickImages = async () => {
    if (!editable) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      onChange([...images, ...newUris]);
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Feather name="image" size={20} color="#4A6CF7" />
          <Text style={styles.title}>Portfolio Gallery</Text>
        </View>

        {images.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{images.length}</Text>
          </View>
        )}
      </View>

      {images.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="image" size={48} color="#ddd" />
          <Text style={styles.emptyText}>Your work gallery is empty</Text>
          {editable && (
            <Text style={styles.emptyHint}>
              Upload photos of your previous work
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.grid}>
          {images.map((uri, index) => (
            <ImageItem
              key={`${uri}-${index}`}
              uri={uri}
              editable={editable}
              onRemove={() => removeImage(index)}
            />
          ))}
        </View>
      )}

      {editable && (
        <TouchableOpacity
          style={styles.uploadButton}
          activeOpacity={0.7}
          onPress={pickImages}
        >
          <View style={styles.uploadContent}>
            <Feather name="upload-cloud" size={20} color="#4A6CF7" />
            <Text style={styles.uploadText}>Upload New Photos</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  countBadge: {
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    color: "#4A6CF7",
    fontSize: 12,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  imageWrap: {
    position: "relative",
    width: "30%",
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 11,
    zIndex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fafafa",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderStyle: "dashed",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
  },
  emptyHint: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
  },
  uploadButton: {
    borderWidth: 1.5,
    borderColor: "#4A6CF7",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: "#f0f4ff",
  },
  uploadContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  uploadText: {
    color: "#4A6CF7",
    fontSize: 14,
    fontWeight: "600",
  },
});
