import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function PostImageGrid({ images = [] }) {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleOpen = (index) => {
    setSelectedIndex(index);
    setViewerVisible(true);
  };

  const renderGrid = () => {
    const count = images.length;

    if (count === 1) {
      return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => handleOpen(0)}>
          <Image source={{ uri: images[0] }} style={styles.singleImage} />
        </TouchableOpacity>
      );
    }

    if (count === 2) {
      return (
        <View style={styles.row}>
          {images.map((img, i) => (
            <TouchableOpacity
              key={i}
              style={styles.halfWidth}
              activeOpacity={0.9}
              onPress={() => handleOpen(i)}
            >
              <Image source={{ uri: img }} style={styles.gridImage} />
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (count === 3) {
      return (
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.fullWidth}
            activeOpacity={0.9}
            onPress={() => handleOpen(0)}
          >
            <Image source={{ uri: images[0] }} style={styles.gridImage} />
          </TouchableOpacity>
          <View style={styles.row}>
            {images.slice(1).map((img, i) => (
              <TouchableOpacity
                key={i}
                style={styles.halfWidth}
                activeOpacity={0.9}
                onPress={() => handleOpen(i + 1)}
              >
                <Image source={{ uri: img }} style={styles.gridImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    if (count === 4) {
      return (
        <View style={styles.gridContainer}>
          <View style={styles.row}>
            {images.slice(0, 2).map((img, i) => (
              <TouchableOpacity
                key={i}
                style={styles.halfWidth}
                activeOpacity={0.9}
                onPress={() => handleOpen(i)}
              >
                <Image source={{ uri: img }} style={styles.gridImage} />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.row}>
            {images.slice(2, 4).map((img, i) => (
              <TouchableOpacity
                key={i}
                style={styles.halfWidth}
                activeOpacity={0.9}
                onPress={() => handleOpen(i + 2)}
              >
                <Image source={{ uri: img }} style={styles.gridImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    // 5 or more
    return (
      <View style={styles.gridContainer}>
        <View style={styles.row}>
          {images.slice(0, 2).map((img, i) => (
            <TouchableOpacity
              key={i}
              style={styles.halfWidth}
              activeOpacity={0.9}
              onPress={() => handleOpen(i)}
            >
              <Image source={{ uri: img }} style={styles.gridImage} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.row}>
          {images.slice(2, 4).map((img, i) => (
            <TouchableOpacity
              key={i}
              style={styles.flex1}
              activeOpacity={0.9}
              onPress={() => handleOpen(i + 2)}
            >
              <Image source={{ uri: img }} style={styles.gridImage} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.flex1}
            activeOpacity={0.9}
            onPress={() => handleOpen(4)}
          >
            <View style={styles.moreContainer}>
              <Image source={{ uri: images[4] }} style={styles.gridImage} />
              {count > 5 && (
                <View style={styles.overlay}>
                  <Text style={styles.moreText}>+{count - 4}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderGrid()}

      <Modal visible={viewerVisible} transparent animationType="fade">
        <SafeAreaView style={styles.viewerContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setViewerVisible(false)}
          >
            <Feather name="x" size={28} color="#fff" />
          </TouchableOpacity>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: selectedIndex * width, y: 0 }}
          >
            {images.map((img, i) => (
              <View key={i} style={styles.slide}>
                <Image
                  source={{ uri: img }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.pagination}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === selectedIndex && styles.activeDot]}
              />
            ))}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  singleImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#f0f0f0",
  },
  gridContainer: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    gap: 4,
  },
  halfWidth: {
    flex: 1,
    height: 200,
  },
  fullWidth: {
    width: "100%",
    height: 200,
  },
  flex1: {
    flex: 1,
    height: 150,
  },
  gridImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
  },
  moreContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  moreText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  slide: {
    width: width,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 40,
    width: "100%",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  activeDot: {
    backgroundColor: "#fff",
  },
});
