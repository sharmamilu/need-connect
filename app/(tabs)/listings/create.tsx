import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { radius, shadow, spacing } from "@/constants/theme";
import { createListing, uploadListingImages } from "@/utils/apiFunctions";

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
const CURRENCIES = [
  { symbol: "$", code: "USD" },
  { symbol: "₹", code: "INR" },
  { symbol: "£", code: "GBP" },
  { symbol: "€", code: "EUR" },
];

export default function CreateListing() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [listingType, setListingType] = useState(TYPES[0]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [contactMethod, setContactMethod] = useState<"phone" | "email" | "both">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [images, setImages] = useState<any[]>([]);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const pickImage = () => {
    setPickerVisible(true);
  };

  const handleCameraLaunch = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need camera access to take a photo of your item."
        );
        return;
      }
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImages((prev) => [...prev, ...result.assets].slice(0, 10));
      }
    } catch (error) {
      console.log("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handleGalleryLaunch = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your gallery to pick photos of your item."
        );
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setImages((prev) => [...prev, ...result.assets].slice(0, 10));
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const useCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Allow location access to use this feature.",
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLat(location.coords.latitude);
      setLng(location.coords.longitude);

      let [geocode] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode) {
        const anyGeocode = geocode as any;
        if (anyGeocode.formattedAddress) {
          setAddress(anyGeocode.formattedAddress);
        } else {
          const addressParts = [
            geocode.streetNumber,
            geocode.street,
            geocode.city,
            geocode.region,
            geocode.country,
          ].filter(Boolean);
          setAddress(addressParts.join(", "));
        }
      }
    } catch (error) {
      console.log("Location Error", error);
      Alert.alert("Error", "Could not fetch your exact location.");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !address) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    const normalizedPhone = phone.trim();
    const normalizedEmail = email.trim();

    if (!normalizedPhone && !normalizedEmail) {
      Alert.alert(
        "Contact Information",
        "Please enter at least a Phone Number or an Email Address for buyers to reach you."
      );
      return;
    }

    if (normalizedEmail && !/\S+@\S+\.\S+/.test(normalizedEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
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
        imageUrls = await uploadListingImages(images);
      }

      const contactParts = [];
      if (normalizedPhone) contactParts.push(`Phone: ${normalizedPhone}`);
      if (normalizedEmail) contactParts.push(`Email: ${normalizedEmail}`);
      const contactInfoValue = contactParts.join(" | ");

      const payload: any = {
        title,
        category,
        listingType,
        price: listingType === "Sell" ? `${currency.symbol}${price}` : "Free",
        description,
        address,
        contactInfo: contactInfoValue,
        condition,
        images: imageUrls,
      };

      if (lat && lng) {
        payload.lat = lat;
        payload.lng = lng;
      }

      await createListing(payload);
      Alert.alert(
        "Success",
        "Listing submitted for review! It will be visible once approved by an Admin.",
      );
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
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Listing</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Photos Upload Card */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeaderTitle}>Photos ({images.length}/10)</Text>
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
                    <Feather name="x" size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 10 && (
                <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
                  <Feather name="camera" size={22} color={colors.primary} />
                  <Text style={styles.addImageText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* Item Details Card */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeaderTitle}>Item Details</Text>
            
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="What are you offering?"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
              maxLength={60}
            />

            <Text style={styles.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipScroll}
            >
              {CATEGORIES.map((cat) => {
                const isActive = category === cat;
                const catIcons: Record<string, string> = {
                  Electronics: "smartphone",
                  Furniture: "home",
                  Clothing: "shopping-bag",
                  Books: "book-open",
                  Vehicles: "truck",
                  Services: "tool",
                  Other: "package",
                };
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.chipButton,
                      isActive && styles.chipButtonActive,
                    ]}
                    onPress={() => setCategory(cat)}
                    activeOpacity={0.8}
                  >
                    <Feather
                      name={(catIcons[cat] || "package") as any}
                      size={12}
                      color={isActive ? "#fff" : "#4B5563"}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        isActive && styles.chipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.label}>Condition</Text>
            <View style={styles.rowSelectors}>
              {CONDITIONS.map((cond) => {
                const isActive = condition === cond;
                const condIcons: Record<string, string> = {
                  New: "star",
                  "Like New": "thumbs-up",
                  Used: "refresh-cw",
                };
                return (
                  <TouchableOpacity
                    key={cond}
                    style={[
                      styles.selectorButton,
                      isActive && styles.selectorButtonActive,
                    ]}
                    onPress={() => setCondition(cond)}
                    activeOpacity={0.8}
                  >
                    <Feather
                      name={condIcons[cond] as any}
                      size={13}
                      color={isActive ? "#fff" : "#4B5563"}
                    />
                    <Text
                      style={[
                        styles.selectorText,
                        isActive && styles.selectorTextActive,
                      ]}
                    >
                      {cond}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the item condition, features, and specs..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>

          {/* Pricing & Type Card */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeaderTitle}>Pricing & Listing Type</Text>
            
            <Text style={styles.label}>Select Option</Text>
            <View style={styles.rowSelectors}>
              {TYPES.map((type) => {
                const isActive = listingType === type;
                const typeIcons: Record<string, string> = {
                  Sell: "tag",
                  Donate: "gift",
                  Free: "smile",
                };
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.selectorButton,
                      isActive && styles.selectorButtonActive,
                    ]}
                    onPress={() => setListingType(type)}
                    activeOpacity={0.8}
                  >
                    <Feather
                      name={typeIcons[type] as any}
                      size={13}
                      color={isActive ? "#fff" : "#4B5563"}
                    />
                    <Text
                      style={[
                        styles.selectorText,
                        isActive && styles.selectorTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {listingType === "Sell" && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Price / Offer *</Text>
                
                {/* Currency select chips */}
                <View style={styles.currencyChips}>
                  {CURRENCIES.map((c) => {
                    const isActive = currency.symbol === c.symbol;
                    return (
                      <TouchableOpacity
                        key={c.code}
                        style={[
                          styles.currencyChip,
                          isActive && styles.currencyChipActive,
                        ]}
                        onPress={() => setCurrency(c)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.currencyChipText,
                            isActive && styles.currencyChipTextActive,
                          ]}
                        >
                          {c.symbol} {c.code}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.priceInputRow}>
                  <Text style={styles.priceCurrency}>{currency.symbol}</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Location & Contact Card */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeaderTitle}>Location & Contact</Text>
            
            <View style={styles.addressHeader}>
              <Text style={styles.label}>Address *</Text>
              <TouchableOpacity
                style={styles.locationBtn}
                onPress={useCurrentLocation}
                disabled={locationLoading}
                activeOpacity={0.7}
              >
                {locationLoading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <>
                    <Feather name="navigation" size={12} color={colors.primary} />
                    <Text style={styles.locationBtnText}>Use My Location</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, styles.textArea, { minHeight: 80 }]}
              placeholder="E.g., Apartment, Street, City, Country"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              value={address}
              onChangeText={setAddress}
              textAlignVertical="top"
            />

            <Text style={styles.label}>Preferred Contact Method</Text>
            <View style={styles.rowSelectors}>
              {["Phone", "Email", "Both"].map((method) => {
                const value = method.toLowerCase() as "phone" | "email" | "both";
                const isActive = contactMethod === value;
                const methodIcons: Record<string, string> = {
                  phone: "phone",
                  email: "mail",
                  both: "layers",
                };
                return (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.selectorButton,
                      isActive && styles.selectorButtonActive,
                    ]}
                    onPress={() => setContactMethod(value)}
                    activeOpacity={0.8}
                  >
                    <Feather
                      name={methodIcons[value] as any}
                      size={13}
                      color={isActive ? "#fff" : "#4B5563"}
                    />
                    <Text
                      style={[
                        styles.selectorText,
                        isActive && styles.selectorTextActive,
                      ]}
                    >
                      {method}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Conditionally render inputs */}
            {(contactMethod === "phone" || contactMethod === "both") && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="E.g., +1 234 567 8900"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            )}

            {(contactMethod === "email" || contactMethod === "both") && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="E.g., contact@domain.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            )}
          </View>

          {/* Warning Disclaimer */}
          <View style={styles.disclaimerContainer}>
            <Feather
              name="alert-circle"
              size={18}
              color="#D97706"
              style={styles.disclaimerIcon}
            />
            <Text style={styles.disclaimerText}>
              <Text style={{ fontWeight: "700" }}>Note: </Text>
              Need Connect is a platform for discovering listings. We are not
              responsible for any transactions, exchanges, or interactions
              between users. Please exercise caution.
            </Text>
          </View>

          {/* Submit Action */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Publish Listing</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Image Source Selection Modal */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setPickerVisible(false)}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Add Photo</Text>
            
            <TouchableOpacity 
              style={styles.pickerOption} 
              onPress={() => {
                setPickerVisible(false);
                handleCameraLaunch();
              }}
            >
              <Feather name="camera" size={20} color={colors.primary} style={{ marginRight: 12 }} />
              <Text style={styles.pickerOptionText}>Take Photo (Camera)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.pickerOption} 
              onPress={() => {
                setPickerVisible(false);
                handleGalleryLaunch();
              }}
            >
              <Feather name="image" size={20} color={colors.primary} style={{ marginRight: 12 }} />
              <Text style={styles.pickerOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.pickerCancelBtn} 
              onPress={() => setPickerVisible(false)}
            >
              <Text style={styles.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...shadow.card,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  imageScrollContainer: {
    gap: 10,
    paddingBottom: 4,
  },
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  addImageText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "600",
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
    top: -5,
    right: -5,
    backgroundColor: "#EF4444",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
    zIndex: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4B5563",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 6,
  },
  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  locationBtnText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  priceInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  priceCurrency: {
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "700",
    marginRight: 6,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "600",
  },
  rowSelectors: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 4,
  },
  selectorButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    gap: 5,
  },
  selectorButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  selectorText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  selectorTextActive: {
    color: "#fff",
  },
  chipScroll: {
    gap: 8,
    paddingBottom: 4,
    marginVertical: 4,
  },
  chipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  chipButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12.5,
    color: "#4B5563",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 48,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  disclaimerContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  disclaimerIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11.5,
    color: "#B45309",
    lineHeight: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.4)",
    justifyContent: "flex-end",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  pickerOptionText: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "600",
  },
  pickerCancelBtn: {
    marginTop: 14,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    alignItems: "center",
  },
  pickerCancelText: {
    color: "#4B5563",
    fontWeight: "700",
    fontSize: 15,
  },
  currencyChips: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
    marginTop: 4,
  },
  currencyChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  currencyChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  currencyChipText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#4B5563",
  },
  currencyChipTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
});
