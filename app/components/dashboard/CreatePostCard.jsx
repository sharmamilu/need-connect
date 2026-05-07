import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import BackgroundSelector from "./BackgroundSelector";
import ImagePickerSection from "./ImagePickerSection";
import TagSelector from "./TagSelector";

export default function CreatePostCard({ onSubmit }) {
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [images, setImages] = useState([]);
  const [background, setBackground] = useState(null);
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
        backgroundStyle: images.length === 0 ? background?.id : null,
      });

      if (res.data.success) {
        alert(
          "Post submitted for review! It will be visible once approved by an Admin.",
        );
        res.data.data.status = "pending";
        // We trigger onSubmit locally so the UI updates or can navigate
        onSubmit(res.data.data);
        // Reset fields
        setDescription("");
        setSelectedTags([]);
        setImages([]);
        setBackground(null);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      const errMsg =
        error.response?.data?.message ||
        "Failed to create post. Please try again.";
      Alert.alert("Post Failed", errMsg);
    } finally {
      setIsPosting(false);
    }
  };

  const isBackgroundActive =
    background && background.id !== "none" && images.length === 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Post</Text>
        </View>

        <View style={styles.inputWrapper}>
          {isBackgroundActive ? (
            <LinearGradient
              colors={background.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.backgroundInput}
            >
              <TextInput
                placeholder="What's on your mind?"
                multiline
                value={description}
                onChangeText={setDescription}
                style={[
                  styles.input,
                  styles.textWithBackground,
                  { color: background.textColor },
                ]}
                placeholderTextColor="rgba(255,255,255,0.7)"
                maxLength={200}
                textAlignVertical="center"
                scrollEnabled={false}
              />
            </LinearGradient>
          ) : (
            <TextInput
              placeholder="What's on your mind?"
              multiline
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              placeholderTextColor="#999"
            />
          )}
        </View>

        {images.length === 0 && (
          <BackgroundSelector
            selectedId={background?.id || "none"}
            onSelect={setBackground}
          />
        )}

        {(!background || background.id === "none") && (
          <ImagePickerSection images={images} setImages={setImages} />
        )}

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
  inputWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
  },
  backgroundInput: {
    minHeight: 220,
    width: "100%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    fontSize: 16,
    color: "#333",
    minHeight: 120,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
  },
  textWithBackground: {
    width: "100%",
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    padding: 0,
    lineHeight: 32,
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
