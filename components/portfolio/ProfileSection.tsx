import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Portfolio } from "@/types/portfolio";
import { CountryData, fetchCountries } from "@/utils/countryHelper";
import CountryCodePicker from "./CountryCodePicker";

type Props = {
  data: Portfolio;
  onChange: (data: Portfolio) => void;
  mode: "create" | "edit" | "view";
};

export default function ProfileSection({ data, onChange, mode }: Props) {
  const editable = mode !== "view";
  const [nameFocused, setNameFocused] = useState(false);
  const [professionFocused, setProfessionFocused] = useState(false);
  const [bioFocused, setBioFocused] = useState(false);
  const [contactFocused, setContactFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryData>({
    name: "United States",
    code: data.contact?.countryCode || "+1",
    flag: "🇺🇸",
    cca2: "US",
  });

  // Sync selected country and ensure data.contact.countryCode is set
  useEffect(() => {
    const syncCountryData = async () => {
      const currentCode = data.contact?.countryCode;

      // 1. If data is missing countryCode but we have a default/selected one, push it to parent
      if (!currentCode && selectedCountry.code) {
        onChange({
          ...data,
          contact: { ...data.contact, countryCode: selectedCountry.code },
        });
      }

      // 2. Initial manual sync for UI state if code changed from parent
      if (currentCode && currentCode !== selectedCountry.code) {
        setSelectedCountry((prev) => ({ ...prev, code: currentCode }));
      }

      // 3. Resolve full country data to get the correct flag
      if (editable) {
        const countries = await fetchCountries();
        const codeToMatch = currentCode || selectedCountry.code || "+1";
        const found = countries.find((c) => c.code === codeToMatch);
        if (found) {
          setSelectedCountry(found);
        }
      }
    };

    syncCountryData();
  }, [data.contact?.countryCode]);

  const pickImage = async () => {
    if (!editable) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need access to your gallery to upload a photo.",
      );
      return;
    }

    Alert.alert("Update Photo", "Choose a source", [
      {
        text: "Camera",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            quality: 0.7,
          });
          if (!result.canceled) {
            onChange({ ...data, profilePhoto: { uri: result.assets[0].uri } });
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            quality: 0.7,
          });
          if (!result.canceled) {
            onChange({ ...data, profilePhoto: { uri: result.assets[0].uri } });
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const getLocation = async () => {
    if (!editable) return;
    setLocationLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is needed to auto-fill your area.",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        const locationStr = `${addr.city || addr.district}, ${addr.region || addr.subregion}`;
        onChange({ ...data, location: locationStr });
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not fetch location. Please enter it manually.",
      );
    } finally {
      setLocationLoading(false);
    }
  };

  // For View Mode
  if (mode === "view") {
    return (
      <View style={styles.viewCard}>
        <View style={styles.banner} />
        <View style={styles.viewContent}>
          <View style={styles.avatarBorder}>
            <Image
              source={
                data.profilePhoto
                  ? typeof data.profilePhoto === "string"
                    ? { uri: data.profilePhoto }
                    : { uri: data.profilePhoto.uri }
                  : require("../../assets/images/icon.png")
              }
              style={styles.viewAvatar}
            />
          </View>

          <Text style={styles.viewName}>{data.name || "Set your name"}</Text>
          <View style={styles.viewBadge}>
            <Feather name="award" size={14} color="#4A6CF7" />
            <Text style={styles.viewProfession}>
              {data.profession || "Profession not set"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.ratingRow}
            onPress={() =>
              router.push({
                pathname: "/user-reviews" as any,
                params: {
                  userId: data.userId || data._id || (data as any).id,
                  userName: data.name,
                },
              })
            }
          >
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name={
                  i < Math.floor(data.rating || 0) ? "star" : "star-outline"
                }
                size={14}
                color="#FFB800"
              />
            ))}
            <Text style={styles.ratingText}>
              {data.rating ? data.rating.toFixed(1) : "New"}
            </Text>
            <Feather
              name="chevron-right"
              size={12}
              color="#999"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>

          {data.location ? (
            <View style={styles.viewLocationBadge}>
              <Feather name="map-pin" size={12} color="#666" />
              <Text style={styles.viewLocationText}>{data.location}</Text>
            </View>
          ) : null}

          <View style={styles.viewDivider} />

          <View style={styles.bioContainer_view}>
            <Feather
              name="info"
              size={16}
              color="#999"
              style={styles.bioIcon_view}
            />
            <Text style={styles.viewBio}>
              {data.bio ||
                "No bio added yet. Tell people about your expertise!"}
            </Text>
          </View>

          <View style={styles.viewDivider} />

          <View style={styles.viewContactGrid}>
            <View style={styles.viewContactItem}>
              <Feather name="phone" size={16} color="#4A6CF7" />
              <Text style={styles.viewContactText}>
                {data.contact?.countryCode
                  ? `${data.contact.countryCode} ${data.contact.phone || ""}`
                  : data.contact?.phone || "No phone added"}
              </Text>
            </View>
            <View style={styles.viewContactItem}>
              <Feather name="mail" size={16} color="#4A6CF7" />
              <Text style={styles.viewContactText}>
                {data.email || "No email added"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.editHeader}>
          <View>
            <Text style={styles.editTitle}>
              {mode === "create" ? "Build Your Profile" : "Edit Profile"}
            </Text>
            <Text style={styles.editSubtitle}>
              Make a great first impression
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Feather name="x" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Profile Photo Section */}
        <View style={styles.photoContainer}>
          <TouchableOpacity
            disabled={!editable}
            style={styles.photoWrapper}
            activeOpacity={0.7}
            onPress={pickImage}
          >
            <Image
              source={
                data.profilePhoto
                  ? typeof data.profilePhoto === "string"
                    ? { uri: data.profilePhoto }
                    : { uri: data.profilePhoto.uri }
                  : require("../../assets/images/icon.png")
              }
              style={styles.avatar}
            />
            {editable && (
              <View style={styles.uploadOverlay}>
                <Feather name="camera" size={24} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          {editable && (
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.photoHint}>Tap to change photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Name Input */}
        <View style={styles.fieldLabelContainer}>
          <Text style={styles.fieldLabel}>
            Full Name <Text style={{ color: "#E53935" }}>*</Text>
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Your Full Name"
            placeholderTextColor="#aaa"
            value={data.name}
            editable={editable}
            onChangeText={(name) => onChange({ ...data, name })}
            style={[styles.input, nameFocused && styles.inputFocused]}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
          />
          <Feather
            name="user"
            size={18}
            color={nameFocused ? "#4A6CF7" : "#999"}
            style={styles.inputIcon}
          />
        </View>

        {/* Location Input */}
        <View style={styles.fieldLabelContainer}>
          <Text style={styles.fieldLabel}>
            Location <Text style={{ color: "#E53935" }}>*</Text>
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="City, State"
            placeholderTextColor="#aaa"
            value={data.location || ""}
            editable={editable}
            onChangeText={(location) => onChange({ ...data, location })}
            style={styles.input}
          />
          <Feather
            name="map-pin"
            size={18}
            color={data.location ? "#4A6CF7" : "#999"}
            style={styles.inputIcon}
          />
          {editable && (
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getLocation}
              disabled={locationLoading}
            >
              <Feather name="crosshair" size={18} color="#4A6CF7" />
            </TouchableOpacity>
          )}
        </View>

        {/* Contact Input */}
        <View style={styles.fieldLabelContainer}>
          <Text style={styles.fieldLabel}>
            Phone Number <Text style={{ color: "#E53935" }}>*</Text>
          </Text>
        </View>
        <View style={styles.phoneInputRow}>
          <TouchableOpacity
            style={styles.countryPickerButton}
            onPress={() => setPickerVisible(true)}
            disabled={!editable}
          >
            <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
            <Text style={styles.countryCodeText}>{selectedCountry.code}</Text>
            <Feather name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>
          <View style={[styles.inputContainer, { flex: 1, marginBottom: 0 }]}>
            <TextInput
              placeholder="e.g. 123 456 7890"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={data.contact?.phone || ""}
              editable={editable}
              onChangeText={(phone) =>
                onChange({
                  ...data,
                  contact: {
                    ...data.contact,
                    countryCode: selectedCountry.code,
                    phone,
                  },
                })
              }
              style={[
                styles.input,
                styles.phoneInput,
                contactFocused && styles.inputFocused,
              ]}
              onFocus={() => setContactFocused(true)}
              onBlur={() => setContactFocused(false)}
            />
            <Feather
              name="phone"
              size={18}
              color={contactFocused ? "#4A6CF7" : "#999"}
              style={styles.inputIcon}
            />
          </View>
        </View>
        {!data.contact?.phone && (
          <Text style={styles.errorHint}>* Contact number is required</Text>
        )}

        {/* Email Input */}
        <View style={styles.fieldLabelContainer}>
          <Text style={styles.fieldLabel}>Email Address (Optional)</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="e.g. hello@example.com"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={data.email}
            editable={editable}
            onChangeText={(email) => onChange({ ...data, email })}
            style={[styles.input, emailFocused && styles.inputFocused]}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
          <Feather
            name="mail"
            size={18}
            color={emailFocused ? "#4A6CF7" : "#999"}
            style={styles.inputIcon}
          />
        </View>
        {data.email && !/^\S+@\S+\.\S+$/.test(data.email) && (
          <Text style={styles.errorHint}>* Please enter a valid email</Text>
        )}

        {/* Profession Input */}
        <View style={styles.fieldLabelContainer}>
          <Text style={styles.fieldLabel}>
            Profession <Text style={{ color: "#E53935" }}>*</Text>
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="e.g., Lead Electrician"
            placeholderTextColor="#aaa"
            value={data.profession}
            editable={editable}
            onChangeText={(profession) => onChange({ ...data, profession })}
            style={[styles.input, professionFocused && styles.inputFocused]}
            onFocus={() => setProfessionFocused(true)}
            onBlur={() => setProfessionFocused(false)}
          />
          <Feather
            name="briefcase"
            size={18}
            color={professionFocused ? "#4A6CF7" : "#999"}
            style={styles.inputIcon}
          />
        </View>

        {/* Bio Input */}
        <View style={styles.fieldLabelContainer}>
          <Text style={styles.fieldLabel}>
            Professional Bio <Text style={{ color: "#E53935" }}>*</Text>
          </Text>
        </View>
        <View style={[styles.inputContainer, styles.bioContainer]}>
          <TextInput
            placeholder="Describe your experience..."
            placeholderTextColor="#aaa"
            value={data.bio}
            editable={editable}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            onChangeText={(bio) => onChange({ ...data, bio })}
            style={[
              styles.input,
              styles.bio,
              bioFocused && styles.inputFocused,
            ]}
            onFocus={() => setBioFocused(true)}
            onBlur={() => setBioFocused(false)}
          />
          <Feather
            name="align-left"
            size={18}
            color={bioFocused ? "#4A6CF7" : "#999"}
            style={[styles.inputIcon, styles.bioIcon]}
          />
        </View>

        {/* Character count for bio */}
        {editable && (
          <Text style={styles.charCount}>
            {data.bio?.length || 0}/500 characters
          </Text>
        )}

        <CountryCodePicker
          visible={pickerVisible}
          onClose={() => setPickerVisible(false)}
          onSelect={(country) => {
            setSelectedCountry(country);
            // Update the country code but keep whatever phone the user typed.
            onChange({
              ...data,
              contact: { ...data.contact, countryCode: country.code },
            });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  // --- View Mode Styles ---
  viewCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  banner: {
    height: 100,
    backgroundColor: "#4A6CF7",
    opacity: 0.9,
  },
  viewContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
    marginTop: -50,
  },
  avatarBorder: {
    padding: 4,
    backgroundColor: "#fff",
    borderRadius: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  viewAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  viewName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    marginTop: 12,
    textAlign: "center",
  },
  viewBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    gap: 6,
  },
  viewProfession: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A6CF7",
  },
  viewLocationBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  viewLocationText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  viewDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 20,
  },
  bioContainer_view: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  bioIcon_view: {
    marginTop: 2,
    marginRight: 10,
  },
  viewBio: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
    flex: 1,
    fontStyle: "italic",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
  },

  // --- Edit Mode Styles ---
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  editHeader: {
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  closeButton: {
    padding: 4,
    marginTop: -2,
  },
  editTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  editSubtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  photoWrapper: {
    position: "relative",
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#F0F4FF",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  uploadOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  photoHint: {
    fontSize: 13,
    color: "#4A6CF7",
    fontWeight: "600",
    marginTop: 10,
  },
  fieldLabelContainer: {
    marginBottom: 6,
    marginLeft: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputContainer: {
    position: "relative",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 14,
    zIndex: 10,
    elevation: 10,
  },
  bioIcon: {
    top: 14,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#F0F0F0",
    borderRadius: 14,
    paddingHorizontal: 44,
    paddingVertical: 14,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#FAFAFA",
  },
  inputFocused: {
    borderColor: "#4A6CF7",
    backgroundColor: "#fff",
    shadowColor: "#4A6CF7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  locationButton: {
    position: "absolute",
    right: 12,
    padding: 8,
  },
  bio: {
    minHeight: 120,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  bioContainer: {
    alignItems: "flex-start",
  },
  phoneInput: {
    paddingLeft: 44,
  },
  charCount: {
    fontSize: 11,
    color: "#999",
    textAlign: "right",
    marginTop: -12,
    marginBottom: 10,
  },
  viewContactGrid: {
    width: "100%",
    gap: 12,
  },
  viewContactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  viewContactText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  phoneInputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  countryPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderWidth: 1.5,
    borderColor: "#F0F0F0",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 52,
    gap: 6,
  },
  countryFlag: {
    fontSize: 20,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  errorHint: {
    color: "#E53935",
    fontSize: 12,
    marginTop: -15,
    marginBottom: 15,
    marginLeft: 4,
  },
});
