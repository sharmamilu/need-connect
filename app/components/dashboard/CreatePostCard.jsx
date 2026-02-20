import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ImagePickerSection from "./ImagePickerSection";
import TagSelector from "./TagSelector";

export default function CreatePostCard({ onSubmit }) {
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [image, setImage] = useState(null);

  const handlePost = () => {
    if (!description.trim()) return;

    const newPost = {
      id: Date.now().toString(),
      description,
      tags: selectedTags,
      image,
      createdAt: "Just now",
      likes: 0,
      comments: 0,
    };

    onSubmit(newPost);

    // Reset fields
    setDescription("");
    setSelectedTags([]);
    setImage(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Post</Text>
        </View>

        <TextInput
          placeholder="What's on your mind?"
          multiline
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          placeholderTextColor="#999"
        />

        <ImagePickerSection image={image} setImage={setImage} />

        <TagSelector
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />

        <TouchableOpacity
          onPress={handlePost}
          disabled={!description.trim()}
          style={[
            styles.postButton,
            !description.trim() && styles.disabledPostButton,
          ]}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  input: {
    fontSize: 16,
    color: "#333",
    minHeight: 120,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  postButton: {
    backgroundColor: "#3b5bdb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  disabledPostButton: {
    backgroundColor: "#ccc",
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
