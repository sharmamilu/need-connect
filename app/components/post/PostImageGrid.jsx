import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { radius, spacing } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function PostImageGrid({ images = [] }) {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef(null);

  if (!images || images.length === 0) return null;

  const handleOpen = (index) => {
    setSelectedIndex(index);
    setViewerVisible(true);
  };

  const onViewerScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setSelectedIndex(idx);
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
              style={styles.thirdWidth}
              activeOpacity={0.9}
              onPress={() => handleOpen(i + 2)}
            >
              <Image source={{ uri: img }} style={styles.gridImage} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.thirdWidth}
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

      {viewerVisible && (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={() => setViewerVisible(false)}
        >
          <SafeAreaView style={styles.viewerContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setViewerVisible(false)}
            hitSlop={10}
          >
            <Feather name="x" size={26} color="#fff" />
          </TouchableOpacity>

          {images.length > 1 && (
            <View style={styles.counterPill}>
              <Text style={styles.counterText}>
                {selectedIndex + 1} / {images.length}
              </Text>
            </View>
          )}

          <FlatList
            ref={listRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            initialScrollIndex={selectedIndex}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onMomentumScrollEnd={onViewerScroll}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <Image
                  source={{ uri: item }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />

          {images.length > 1 && (
            <View style={styles.pagination}>
              {images.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === selectedIndex && styles.activeDot]}
                />
              ))}
            </View>
          )}
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  singleImage: {
    width: "100%",
    height: 300,
    backgroundColor: colors.skeleton,
  },
  gridContainer: {
    gap: 3,
  },
  row: {
    flexDirection: "row",
    gap: 3,
  },
  halfWidth: {
    flex: 1,
    height: 190,
  },
  fullWidth: {
    width: "100%",
    height: 200,
  },
  thirdWidth: {
    flex: 1,
    height: 130,
  },
  gridImage: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.skeleton,
  },
  moreContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
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
    padding: spacing.sm,
  },
  counterPill: {
    position: "absolute",
    top: 54,
    alignSelf: "center",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  counterText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
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
    gap: spacing.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 18,
  },
});
