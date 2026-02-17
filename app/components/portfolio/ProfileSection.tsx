import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Portfolio } from "../../types/portfolio";

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

  // For View Mode, we want a different look
  if (mode === "view") {
    return (
      <View style={styles.viewCard}>
        <View style={styles.banner} />
        <View style={styles.viewContent}>
          <View style={styles.avatarBorder}>
            <Image
              source={
                data.profilePhoto
                  ? { uri: data.profilePhoto }
                  : require("../../../assets/images/icon.png")
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
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.editHeader}>
          <Text style={styles.editTitle}>
            {mode === "create" ? "Build Your Profile" : "Edit Profile"}
          </Text>
          <Text style={styles.editSubtitle}>Make a great first impression</Text>
        </View>

        {/* Profile Photo Section */}
        <View style={styles.photoContainer}>
          <TouchableOpacity
            disabled={!editable}
            style={styles.photoWrapper}
            activeOpacity={0.7}
          >
            <Image
              source={
                data.profilePhoto
                  ? { uri: data.profilePhoto }
                  : require("../../../assets/images/icon.png")
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
            <Text style={styles.photoHint}>Tap to change photo</Text>
          )}
        </View>

        {/* Name Input */}
        <View style={styles.fieldLabelContainer}>
          <Text style={styles.fieldLabel}>Full Name</Text>
        </View>
        <View style={styles.inputContainer}>
          <Feather
            name="user"
            size={18}
            color={nameFocused ? "#4A6CF7" : "#999"}
            style={styles.inputIcon}
          />
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
        </View>

        {/* Profession Input */}
        <View style={styles.fieldLabelContainer}>
          <Text style={styles.fieldLabel}>Profession</Text>
        </View>
        <View style={styles.inputContainer}>
          <Feather
            name="briefcase"
            size={18}
            color={professionFocused ? "#4A6CF7" : "#999"}
            style={styles.inputIcon}
          />
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
        </View>

        {/* Bio Input */}
        <View style={styles.fieldLabelContainer}>
          <Text style={styles.fieldLabel}>Professional Bio</Text>
        </View>
        <View style={[styles.inputContainer, styles.bioContainer]}>
          <Feather
            name="align-left"
            size={18}
            color={bioFocused ? "#4A6CF7" : "#999"}
            style={[styles.inputIcon, styles.bioIcon]}
          />
          <TextInput
            placeholder="Describe your experience and what you offer..."
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
        </View>

        {/* Character count for bio */}
        {editable && (
          <Text style={styles.charCount}>
            {data.bio?.length || 0}/500 characters
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
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
    backgroundColor: "#4A6CF7", // Could be a gradient
    opacity: 0.9,
  },
  viewContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
    marginTop: -50, // Pull content up over banner
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
    zIndex: 1,
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
  bio: {
    minHeight: 120,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  bioContainer: {
    alignItems: "flex-start",
  },
  charCount: {
    fontSize: 11,
    color: "#999",
    textAlign: "right",
    marginTop: -12,
    marginBottom: 10,
  },
});
