import { LinearGradient } from "expo-linear-gradient";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { POST_BACKGROUNDS } from "../../constants/postBackgrounds";

export default function BackgroundSelector({ selectedId, onSelect }) {
  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedId;

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => onSelect(item)}
      >
        {item.id === "none" ? (
          <View style={[styles.preview, { backgroundColor: item.colors[0] }]}>
            <Text style={styles.noneText}>T</Text>
          </View>
        ) : (
          <LinearGradient
            colors={item.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.preview}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Post Style</Text>
      <FlatList
        data={POST_BACKGROUNDS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
    marginLeft: 4,
  },
  listContent: {
    paddingHorizontal: 4,
  },
  item: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  selectedItem: {
    borderColor: "#3b5bdb",
  },
  preview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noneText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999",
  },
});
