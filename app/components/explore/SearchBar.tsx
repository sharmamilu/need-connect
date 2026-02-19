import { Feather } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

export default function SearchBar({ value, onChange }: any) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={18} color="#777" />
      <TextInput
        placeholder="Search skills or profession"
        value={value}
        onChangeText={onChange}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
});
