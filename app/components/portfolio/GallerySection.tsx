import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../../constants/colors";
import { radius, spacing } from "../../constants/theme";
import { PortfolioLocalImage } from "../../types/portfolio";
import SectionCard from "./SectionCard";

type Props = {
  images: (string | PortfolioLocalImage)[];
  onChange: (images: (string | PortfolioLocalImage)[]) => void;
  mode: "create" | "edit" | "view";
};

const ImageItem = ({
  item,
  onRemove,
  editable,
}: {
  item: string | PortfolioLocalImage;
  onRemove: () => void;
  editable: boolean;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const uri = typeof item === "string" ? item : item.uri;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.imageWrap,
        {
          opacity: fadeAnim,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.85, 1],
              }),
            },
          ],
        },
      ]}
    >
      <Image source={{ uri }} style={styles.image} />
      {editable && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          activeOpacity={0.8}
          hitSlop={6}
        >
          <Feather name="x" size={14} color="#fff" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const MAX_IMAGES = 8;

export default function GallerySection({ images = [], onChange, mode }: Props) {
  const editable = mode !== "view";
  const [showLimitError, setShowLimitError] = useState(false);

  const pickImages = async () => {
    if (!editable) return;

    if (images.length >= MAX_IMAGES) {
      setShowLimitError(true);
      setTimeout(() => setShowLimitError(false), 3000);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    const remainingCount = MAX_IMAGES - images.length;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      allowsEditing: false,
      selectionLimit: remainingCount,
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.slice(0, remainingCount);
      const newImages: PortfolioLocalImage[] = selectedImages.map((asset) => ({
        uri: asset.uri,
      }));
      onChange([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <SectionCard
      icon="image"
      title="Portfolio Gallery"
      right={
        images.length > 0 ? (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {images.length}/{MAX_IMAGES}
            </Text>
          </View>
        ) : undefined
      }
    >
      {images.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="image" size={36} color={colors.gray} />
          <Text style={styles.emptyText}>Your work gallery is empty</Text>
          {editable && (
            <Text style={styles.emptyHint}>
              Show photos of your previous work
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.grid}>
          {images.map((item, index) => (
            <ImageItem
              key={`${index}`}
              item={item}
              editable={editable}
              onRemove={() => removeImage(index)}
            />
          ))}
        </View>
      )}

      {editable && (
        <>
          {showLimitError && (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={16} color={colors.error} />
              <Text style={styles.errorText}>
                Limit reached! Max {MAX_IMAGES} photos.
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.uploadButton}
            activeOpacity={0.7}
            onPress={pickImages}
          >
            <Feather name="upload-cloud" size={20} color={colors.primary} />
            <Text style={styles.uploadText}>Upload Photos</Text>
          </TouchableOpacity>
        </>
      )}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  countBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  countText: {
    color: colors.primary,
    fontSize: 12.5,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  imageWrap: {
    position: "relative",
    width: "31%",
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: radius.md,
    backgroundColor: colors.skeleton,
  },
  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
    marginTop: spacing.md,
  },
  emptyHint: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 4,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: "dashed",
    borderRadius: radius.md,
    paddingVertical: 14,
    backgroundColor: colors.primarySoft,
  },
  uploadText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.errorSoft,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "600",
  },
});
