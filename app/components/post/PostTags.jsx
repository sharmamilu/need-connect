import { StyleSheet, Text, View } from "react-native";

export default function PostTags({ tags }) {
  return (
    <View style={styles.container}>
      {tags.map((tag, index) => (
        <Text key={index} style={styles.tag}>
          #{tag}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#eef3ff",
    color: "#3b5bdb",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    fontSize: 12,
  },
});
