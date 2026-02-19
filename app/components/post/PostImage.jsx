import { Image, StyleSheet } from "react-native";

export default function PostImage({ image }) {
  return <Image source={{ uri: image }} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 10,
  },
});
