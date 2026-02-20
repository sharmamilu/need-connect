import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createPost, uploadPostImages } from "../../utils/apiFunctions";
import ImagePickerSection from "./ImagePickerSection";
import TagSelector from "./TagSelector";

export default function CreatePostCard({ onSubmit }) {
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [images, setImages] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!description.trim()) return;

    try {
      setIsPosting(true);
      let uploadedUrls = [];

      // 1. Upload images if exist
      if (images.length > 0) {
        uploadedUrls = await uploadPostImages(images);
      }

      // 2. Create the post
      const res = await createPost({
        description,
        tags: selectedTags,
        images: uploadedUrls, // Array of URLs
      });

      if (res.data.success) {
        onSubmit(res.data.data);
        // Reset fields
        setDescription("");
        setSelectedTags([]);
        setImages([]);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
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

        <ImagePickerSection images={images} setImages={setImages} />

        <TagSelector
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />

        <TouchableOpacity
          onPress={handlePost}
          disabled={!description.trim() || isPosting}
          style={[
            styles.postButton,
            (!description.trim() || isPosting) && styles.disabledPostButton,
          ]}
        >
          {isPosting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
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
