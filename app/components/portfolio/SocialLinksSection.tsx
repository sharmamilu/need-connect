import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  links: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  onChange: (links: Props["links"]) => void;
  mode: "create" | "edit" | "view";
};

export default function SocialLinksSection({ links, onChange, mode }: Props) {
  const editable = mode !== "view";
  const [linkedinFocused, setLinkedinFocused] = useState(false);
  const [githubFocused, setGithubFocused] = useState(false);
  const [websiteFocused, setWebsiteFocused] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Feather name="link" size={20} color="#4A6CF7" />
        <Text style={styles.title}>Public & Social Links</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="LinkedIn Profile URL"
          placeholderTextColor="#aaa"
          value={links.linkedin}
          editable={editable}
          onChangeText={(linkedin) => onChange({ ...links, linkedin })}
          onFocus={() => setLinkedinFocused(true)}
          onBlur={() => setLinkedinFocused(false)}
          style={[
            styles.input,
            linkedinFocused && styles.inputFocused,
            !editable && styles.inputDisabled,
          ]}
        />
        <Feather
          name="linkedin"
          size={18}
          color={linkedinFocused ? "#4A6CF7" : "#999"}
          style={styles.icon}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="GitHub Profile URL"
          placeholderTextColor="#aaa"
          value={links.github}
          editable={editable}
          onChangeText={(github) => onChange({ ...links, github })}
          onFocus={() => setGithubFocused(true)}
          onBlur={() => setGithubFocused(false)}
          style={[
            styles.input,
            githubFocused && styles.inputFocused,
            !editable && styles.inputDisabled,
          ]}
        />
        <Feather
          name="github"
          size={18}
          color={githubFocused ? "#4A6CF7" : "#999"}
          style={styles.icon}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Personal Website URL"
          placeholderTextColor="#aaa"
          value={links.website}
          editable={editable}
          onChangeText={(website) => onChange({ ...links, website })}
          onFocus={() => setWebsiteFocused(true)}
          onBlur={() => setWebsiteFocused(false)}
          style={[
            styles.input,
            websiteFocused && styles.inputFocused,
            !editable && styles.inputDisabled,
          ]}
        />
        <Feather
          name="globe"
          size={18}
          color={websiteFocused ? "#4A6CF7" : "#999"}
          style={styles.icon}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  icon: {
    position: "absolute",
    left: 12,
    zIndex: 10,
    elevation: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#f8f9fa",
  },
  inputFocused: {
    borderColor: "#4A6CF7",
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#777",
  },
});
