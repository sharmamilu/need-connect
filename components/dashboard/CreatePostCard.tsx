import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
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
import { colors } from "@/constants/colors";
import { radius, shadow, spacing } from "@/constants/theme";
import { PostBackground } from "@/constants/postBackgrounds";
import { Post } from "@/types";
import { createPost, uploadPostImages } from "@/utils/apiFunctions";
import BackgroundSelector from "./BackgroundSelector";
import ImagePickerSection from "./ImagePickerSection";
import TagSelector from "./TagSelector";

interface TemplateField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

interface PostTemplate {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  bg: string;
  fields: TemplateField[];
  format?: (f: Record<string, string>) => string;
}

const POST_TEMPLATES: PostTemplate[] = [
  {
    id: "custom",
    title: "Custom",
    description: "Draft a custom post from scratch.",
    icon: "edit-3",
    color: "#64748B",
    bg: "#F1F5F9",
    fields: [],
  },
  {
    id: "announcement",
    title: "Announcement",
    description: "Broadcast important updates, launches, or key news.",
    icon: "bell",
    color: "#4A6CF7",
    bg: "#EEF2FF",
    fields: [
      { key: "title", label: "Announcement Title", placeholder: "e.g. Major Project Milestone Achieved" },
      { key: "subtitle", label: "Context / Subtitle", placeholder: "e.g. Delighted to share our recent project delivery details" },
      { key: "details", label: "Core Announcement Details", placeholder: "Provide the primary announcement text...", multiline: true },
      { key: "cta", label: "Call to Action (Link / Instructions)", placeholder: "e.g. Learn more at need-connect.com/news" },
    ],
    format: (f) => {
      const parts = [];
      if (f.title) parts.push(`📢 ${f.title.toUpperCase()}`);
      if (f.subtitle) parts.push(`ℹ️ ${f.subtitle}`);
      if (f.details) parts.push(`\n📄 Details:\n${f.details}`);
      if (f.cta) parts.push(`\n👉 ${f.cta}`);
      return parts.join("\n");
    },
  },
  {
    id: "update",
    title: "Product Update",
    description: "Announce product features, fixes, or changelog items.",
    icon: "cpu",
    color: "#16A34A",
    bg: "#DCFCE7",
    fields: [
      { key: "title", label: "Update Title / Release Name", placeholder: "e.g. v2.0 Platform Launch" },
      { key: "features", label: "New Features (comma-separated)", placeholder: "e.g. Faster document rendering, direct export option" },
      { key: "impact", label: "Why It Matters", placeholder: "e.g. This release makes invoicing twice as fast for freelancers." },
    ],
    format: (f) => {
      const parts = [];
      if (f.title) parts.push(`🚀 FEATURE UPDATE: ${f.title}`);
      if (f.features) {
        const list = f.features
          .split(",")
          .map((x) => `• ${x.trim()}`)
          .filter((x) => x !== "• ")
          .join("\n");
        parts.push(`\n✨ What's New:\n${list}`);
      }
      if (f.impact) parts.push(`\n💡 Impact:\n${f.impact}`);
      return parts.join("\n");
    },
  },
  {
    id: "campaign",
    title: "Campaign",
    description: "Promote professional campaigns, projects, or goals.",
    icon: "target",
    color: "#EA580C",
    bg: "#FFEDD5",
    fields: [
      { key: "title", label: "Campaign Name / Objective", placeholder: "e.g. Freelancer Support Campaign" },
      { key: "offer", label: "The Headline / Core Offering", placeholder: "e.g. Free contract reviews this week" },
      { key: "benefits", label: "Key Benefits (comma-separated)", placeholder: "e.g. Professional review, 24-hr response, templates included" },
      { key: "link", label: "Campaign URL / Action Link", placeholder: "e.g. register at need-connect.com/campaign" },
    ],
    format: (f) => {
      const parts = [];
      if (f.title) parts.push(`🎯 CAMPAIGN: ${f.title}`);
      if (f.offer) parts.push(`\n🎁 Special Offer:\n${f.offer}`);
      if (f.benefits) {
        const list = f.benefits
          .split(",")
          .map((x) => `✔ ${x.trim()}`)
          .filter((x) => x !== "✔ ")
          .join("\n");
        parts.push(`\n💎 Key Benefits:\n${list}`);
      }
      if (f.link) parts.push(`\n🎟️ Code / Link: ${f.link}`);
      return parts.join("\n");
    },
  },
  {
    id: "invitation",
    title: "Invitation",
    description: "Invite your audience to events, webinars, or gigs.",
    icon: "calendar",
    color: "#9333EA",
    bg: "#F3E8FF",
    fields: [
      { key: "event", label: "Event Name", placeholder: "e.g. Freelancing Success Webinar" },
      { key: "dateTime", label: "Date & Time", placeholder: "e.g. Thursday, July 10 at 5 PM PST" },
      { key: "location", label: "Venue / Virtual Platform Link", placeholder: "e.g. Zoom (link sent on confirmation)" },
      { key: "rsvp", label: "RSVP Link / Deadlines", placeholder: "e.g. Register by Monday at link.com/rsvp" },
    ],
    format: (f) => {
      const parts = [];
      if (f.event) parts.push(`📅 YOU'RE INVITED: ${f.event}`);
      if (f.dateTime) parts.push(`⏰ When: ${f.dateTime}`);
      if (f.location) parts.push(`📍 Where: ${f.location}`);
      if (f.rsvp) parts.push(`\n✍️ RSVP details:\n${f.rsvp}`);
      return parts.join("\n");
    },
  },
  {
    id: "newsletter",
    title: "Newsletter",
    description: "Write newsletter summaries, articles, or digests.",
    icon: "mail",
    color: "#0891B2",
    bg: "#CFFAFE",
    fields: [
      { key: "issue", label: "Newsletter Issue Name", placeholder: "e.g. Weekly Work Digest #18" },
      { key: "topic1", label: "Top Article Heading & Details", placeholder: "e.g. Top 10 tips for client management" },
      { key: "topic2", label: "Secondary Article / Updates", placeholder: "e.g. Exploring standard NDA contracts" },
      { key: "topic3", label: "Community Spotlights", placeholder: "e.g. Celebrating 5,000 active users" },
    ],
    format: (f) => {
      const parts = [];
      if (f.issue) parts.push(`✉️ NEWSLETTER: ${f.issue}`);
      if (f.topic1 || f.topic2 || f.topic3) {
        parts.push("\n📰 Highlights:");
        if (f.topic1) parts.push(`• ${f.topic1}`);
        if (f.topic2) parts.push(`• ${f.topic2}`);
        if (f.topic3) parts.push(`• ${f.topic3}`);
      }
      return parts.join("\n");
    },
  },
  {
    id: "promotion",
    title: "Promotion",
    description: "Launch discounts, deals, or service promotions.",
    icon: "percent",
    color: "#DB2777",
    bg: "#FCE7F3",
    fields: [
      { key: "product", label: "Product or Service Name", placeholder: "e.g. Logo Design Package" },
      { key: "discount", label: "Discount Details", placeholder: "e.g. Save 20% on your first request" },
      { key: "validUntil", label: "Expiration / Time Limit", placeholder: "e.g. Promo valid through June 30" },
      { key: "link", label: "Redeem Link", placeholder: "e.g. claim discount at need-connect.com/logo" },
    ],
    format: (f) => {
      const parts = [];
      if (f.product) parts.push(`🔥 SPECIAL PROMOTION: ${f.product}`);
      if (f.discount) parts.push(`💸 Save ${f.discount}!`);
      if (f.validUntil) parts.push(`⏳ Offer valid until: ${f.validUntil}`);
      if (f.link) parts.push(`\n🛒 Get yours here: ${f.link}`);
      return parts.join("\n");
    },
  },
];

interface CreatePostCardProps {
  onSubmit?: (post: any) => void;
  onCancel?: () => void;
}

export default function CreatePostCard({ onSubmit, onCancel }: CreatePostCardProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("custom");
  const [description, setDescription] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [background, setBackground] = useState<PostBackground | null>(null);
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const activeTemplate = POST_TEMPLATES.find((t) => t.id === selectedTemplateId) || POST_TEMPLATES[0];

  useEffect(() => {
    // Reset values and description on template change
    setFormValues({});
    setDescription("");
  }, [selectedTemplateId]);

  const handleFieldChange = (key: string, text: string) => {
    setFormValues((prev) => {
      const next = { ...prev, [key]: text };
      if (activeTemplate.format) {
        setDescription(activeTemplate.format(next));
      }
      return next;
    });
  };

  const handlePost = async () => {
    if (!description.trim()) return;

    try {
      setIsPosting(true);
      let uploadedUrls: string[] = [];

      if (images.length > 0) {
        console.log("Starting image upload for", images.length, "images");
        uploadedUrls = await uploadPostImages(images);
        console.log("Images uploaded successfully. URLs:", uploadedUrls);
      }

      const res = await createPost({
        description,
        tags: selectedTags,
        images: uploadedUrls,
        backgroundStyle: images.length === 0 && selectedTemplateId === "custom" ? background?.id : null,
      });

      if (res.data.success) {
        if (res.data.data) {
          res.data.data.status = "pending";
          onSubmit?.(res.data.data);
        }
        // Reset state
        setDescription("");
        setSelectedTags([]);
        setImages([]);
        setBackground(null);
        setSelectedTemplateId("custom");
      }
    } catch (error: any) {
      console.error("Error creating post detailed log:", error);
      
      let debugMsg = "";
      if (error?.response) {
        // The server responded with a status code other than 2xx
        debugMsg = `Server Response Error:\nStatus: ${error.response.status}\nData: ${JSON.stringify(error.response.data, null, 2)}`;
      } else if (error?.request) {
        // Request was made but no response was received (e.g. Network Error)
        debugMsg = `Network Error / No Response:\nMessage: ${error.message}\nRequest Object properties: ${Object.keys(error.request || {})}`;
      } else {
        // Something happened setting up the request
        debugMsg = `Request Setup Error:\nMessage: ${error?.message || error}`;
      }

      Alert.alert(
        "Create Post Error (Detailed)",
        debugMsg
      );
    } finally {
      setIsPosting(false);
    }
  };

  const isBackgroundActive =
    background && background.id !== "none" && selectedTemplateId === "custom";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* TEMPLATE PICKER HORIZONTAL SCROLL */}
        <View style={styles.templateScrollContainer}>
          <Text style={styles.sectionLabel}>POST TYPE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templateList}
          >
            {POST_TEMPLATES.map((tmpl) => {
              const isSelected = tmpl.id === selectedTemplateId;
              return (
                <TouchableOpacity
                  key={tmpl.id}
                  style={[
                    styles.templateChip,
                    isSelected && styles.templateChipSelected,
                  ]}
                  onPress={() => setSelectedTemplateId(tmpl.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.templateIconWrapper,
                      { backgroundColor: tmpl.bg },
                      isSelected && { backgroundColor: tmpl.color },
                    ]}
                  >
                    <Feather
                      name={tmpl.icon}
                      size={14}
                      color={isSelected ? "#FFF" : tmpl.color}
                    />
                  </View>
                  <Text
                    style={[
                      styles.templateChipText,
                      isSelected && styles.templateChipTextSelected,
                    ]}
                  >
                    {tmpl.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* TEMPLATE DESCRIPTION BANNER (for non-custom) */}
        {selectedTemplateId !== "custom" && (
          <View
            style={[
              styles.templateBanner,
              { backgroundColor: activeTemplate.bg },
            ]}
          >
            <Feather
              name={activeTemplate.icon}
              size={16}
              color={activeTemplate.color}
            />
            <Text
              style={[
                styles.templateBannerText,
                { color: activeTemplate.color },
              ]}
            >
              {activeTemplate.description}
            </Text>
          </View>
        )}

        {/* GUIDED INPUT FIELDS (Template Mode) */}
        {selectedTemplateId !== "custom" && activeTemplate.fields.length > 0 ? (
          <View style={styles.fieldsContainer}>
            {activeTemplate.fields.map((field) => (
              <View key={field.key} style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={[styles.input, field.multiline && styles.multilineInput]}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.placeholder}
                  value={formValues[field.key] || ""}
                  onChangeText={(text) => handleFieldChange(field.key, text)}
                  multiline={field.multiline}
                  textAlignVertical={field.multiline ? "top" : "center"}
                />
              </View>
            ))}
          </View>
        ) : (
          /* STANDARD INPUT FOR CUSTOM POST */
          <View style={styles.inputWrapper}>
            {isBackgroundActive && background ? (
              <LinearGradient
                colors={background.colors.length >= 2 ? (background.colors as [string, string, ...string[]]) : [background.colors[0], background.colors[0]]}
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
                style={[styles.input, styles.multilineInput]}
                placeholderTextColor={colors.placeholder}
              />
            )}
          </View>
        )}

        {/* LIVE DRAFT PREVIEW (Only for templates) */}
        {selectedTemplateId !== "custom" && description.trim().length > 0 && (
          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>LIVE PREVIEW</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewText}>{description}</Text>
            </View>
          </View>
        )}

        {/* BACKGROUND SELECTOR (Only for Custom Text Posts) */}
        {selectedTemplateId === "custom" && images.length === 0 && (
          <BackgroundSelector
            selectedId={background?.id || "none"}
            onSelect={setBackground}
          />
        )}

        {/* IMAGE PICKER (Only if no custom background is chosen) */}
        {(!background || background.id === "none" || selectedTemplateId !== "custom") && (
          <ImagePickerSection images={images} setImages={setImages} />
        )}

        {/* TAGS */}
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
            <Text style={styles.postButtonText}>Submit for Review</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    paddingBottom: 40,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  templateScrollContainer: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  templateList: {
    gap: spacing.sm,
    paddingVertical: 4,
  },
  templateChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  templateChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  templateIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  templateChipText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: colors.textMuted,
  },
  templateChipTextSelected: {
    color: colors.primary,
    fontWeight: "700",
  },
  templateBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  templateBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
  },
  templateCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 8,
  },
  templateIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  templateCardTitle: {
    fontSize: 12.5,
    fontWeight: "700",
    color: colors.textMuted,
  },
  activeTemplateBox: {
    backgroundColor: colors.primarySoft,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + "1A",
  },
  activeTemplateTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 4,
  },
  activeTemplateDesc: {
    fontSize: 12.5,
    color: colors.textMuted,
    lineHeight: 16.5,
  },
  fieldsContainer: {
    gap: spacing.md,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: "700",
    color: colors.text,
  },
  inputWrapper: {
    borderRadius: radius.md,
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
    fontSize: 14.5,
    color: colors.text,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
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
  previewSection: {
    marginTop: spacing.lg,
    gap: 6,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.success,
    letterSpacing: 0.8,
  },
  previewCard: {
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  previewText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  postButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: 24,
    ...shadow.card,
  },
  disabledPostButton: {
    backgroundColor: colors.gray,
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
