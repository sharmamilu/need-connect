import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createListing, uploadListingImages } from "../../utils/apiFunctions";

const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Books",
  "Vehicles",
  "Services",
  "Other",
];
const TYPES = ["Sell", "Donate", "Free"];
const CONDITIONS = ["New", "Like New", "Used"];

export default function CreateListing() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [listingType, setListingType] = useState(TYPES[0]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [images, setImages] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setImages((prev) => [...prev, ...result.assets].slice(0, 10)); // Cap at 10 images
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !description || !address || !contactInfo) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }
    if (listingType === "Sell" && !price) {
      Alert.alert("Missing Fields", "Please enter a price to sell your item.");
      return;
    }

    try {
      setLoading(true);

      let imageUrls: string[] = [];
      if (images.length > 0) {
        // First upload the images using the FormData API
        imageUrls = await uploadListingImages(images);
      }

      const payload = {
        title,
        category,
        listingType,
        price: listingType === "Sell" ? price : "Free",
        description,
        address,
        contactInfo,
        condition,
        images: imageUrls,
      };

      // Create the listing
      await createListing(payload);
      Alert.alert("Success", "Listing created successfully!");
      router.back();
    } catch (error: any) {
      console.log("Create API error", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Something went wrong creating the listing.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Listing</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Images */}
          <Text style={styles.sectionTitle}>Photos ({images.length}/10)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageScrollContainer}
          >
            {images.map((img, index) => (
              <View key={index} style={styles.imagePreviewWrapper}>
                <Image source={{ uri: img.uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => removeImage(index)}
                >
                  <Feather name="x" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 10 && (
              <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
                <Feather name="camera" size={24} color="#4A6CF7" />
                <Text style={styles.addImageText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Title */}
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="What are you offering?"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            maxLength={60}
          />

          {/* Listing Type */}
          <Text style={styles.label}>Listing Type</Text>
          <View style={styles.rowSelectors}>
            {TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.selectorButton,
                  listingType === type && styles.selectorButtonActive,
                ]}
                onPress={() => setListingType(type)}
              >
                <Text
                  style={[
                    styles.selectorText,
                    listingType === type && styles.selectorTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price */}
          {listingType === "Sell" && (
            <View>
              <Text style={styles.label}>Price / Offer *</Text>
              <TextInput
                style={styles.input}
                placeholder="E.g., $100, 50 EUR, or Best Offer"
                placeholderTextColor="#999"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          )}

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScroll}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chipButton,
                  category === cat && styles.chipButtonActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.chipText,
                    category === cat && styles.chipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Condition */}
          <Text style={styles.label}>Condition</Text>
          <View style={styles.rowSelectors}>
            {CONDITIONS.map((cond) => (
              <TouchableOpacity
                key={cond}
                style={[
                  styles.selectorButton,
                  condition === cond && styles.selectorButtonActive,
                ]}
                onPress={() => setCondition(cond)}
              >
                <Text
                  style={[
                    styles.selectorText,
                    condition === cond && styles.selectorTextActive,
                  ]}
                >
                  {cond}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the item, features, and reason for listing..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          {/* Address */}
          <Text style={styles.label}>Complete Address *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="E.g., 123 Main St, Apt 4B, City, Country"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            value={address}
            onChangeText={setAddress}
            textAlignVertical="top"
          />

          {/* Contact Info */}
          <Text style={styles.label}>Contact Information *</Text>
          <TextInput
            style={[styles.input, { marginBottom: 30 }]}
            placeholder="Phone number, email, or preferred contact"
            placeholderTextColor="#999"
            value={contactInfo}
            onChangeText={setContactInfo}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Post Listing</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 12,
  },
  imageScrollContainer: {
    gap: 12,
    marginBottom: 24,
    paddingBottom: 4,
  },
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#EDF1FF",
    borderStyle: "dashed",
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  addImageText: {
    fontSize: 11,
    color: "#4A6CF7",
    fontWeight: "500",
  },
  imagePreviewWrapper: {
    position: "relative",
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  removeImageBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF4757",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#2D3436",
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
  },
  priceInput: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 8,
    fontSize: 16,
    color: "#2D3436",
    fontWeight: "500",
  },
  rowSelectors: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  selectorButtonActive: {
    backgroundColor: "#EDF1FF",
    borderColor: "#4A6CF7",
  },
  selectorText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  selectorTextActive: {
    color: "#4A6CF7",
  },
  chipScroll: {
    gap: 8,
    paddingBottom: 8,
  },
  chipButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  chipButtonActive: {
    backgroundColor: "#4A6CF7",
    borderColor: "#4A6CF7",
  },
  chipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#fff",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 30, // Extra space before button
  },
  locationIcon: {
    marginRight: 10,
  },
  locationInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#2D3436",
  },
  submitButton: {
    backgroundColor: "#4A6CF7",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#4A6CF7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
