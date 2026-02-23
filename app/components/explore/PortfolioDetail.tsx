import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchPortfolioById } from "../../utils/apiFunctions";
import ExperienceSection from "../portfolio/ExperienceSection";

export default function PortfolioDetail() {
  const { portfolioId } = useLocalSearchParams();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const router = useRouter();

  const gallery: string[] = portfolio?.gallery ?? [];
  const screenWidth = Dimensions.get("window").width;

  /** Ensure URL has a scheme so Android/iOS can open it */
  const normalizeUrl = (url: string): string => {
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (/^mailto:/i.test(trimmed)) return trimmed;
    if (/^tel:/i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchPortfolioById(portfolioId as string);
        // Backend sends the portfolio object directly via res.json(portfolio)
        setPortfolio(res.data);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          "Failed to load profile. Please try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    if (portfolioId) load();
  }, [portfolioId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F8F9FA",
          }}
        >
          <ActivityIndicator size="large" color="#4A6CF7" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !portfolio) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F8F9FA",
            gap: 12,
          }}
        >
          <Feather name="alert-circle" size={40} color="#FF4757" />
          <Text
            style={{
              fontSize: 16,
              color: "#FF4757",
              textAlign: "center",
              paddingHorizontal: 32,
            }}
          >
            {error || "Profile not found"}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: "#4A6CF7",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 14,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* BACK BUTTON */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>

          {/* HEADER */}
          <View style={styles.header}>
            {portfolio.profilePhoto ? (
              <Image
                source={{ uri: portfolio.profilePhoto }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Text style={styles.placeholderText}>
                  {portfolio.name?.charAt(0).toUpperCase() || "?"}
                </Text>
              </View>
            )}
            <Text style={styles.name}>{portfolio.name}</Text>
            <Text style={styles.profession}>{portfolio.profession}</Text>
            <Text style={styles.location}>{portfolio.location}</Text>
          </View>

          {/* BIO */}
          {!!portfolio.bio && (
            <Section title="About">
              <Text style={styles.text}>{portfolio.bio}</Text>
            </Section>
          )}

          {/* SERVICES */}
          {portfolio.services?.length > 0 && (
            <Section title="Services">
              <TagList data={portfolio.services} />
            </Section>
          )}

          {/* SKILLS */}
          {portfolio.skills?.length > 0 && (
            <Section title="Skills">
              <TagList data={portfolio.skills} />
            </Section>
          )}

          {/* EXPERIENCE */}
          {portfolio.experience?.length > 0 && (
            <ExperienceSection
              experiences={portfolio.experience}
              setExperiences={() => {}}
              mode="view"
            />
          )}

          {/* GALLERY */}
          {portfolio.gallery?.length > 0 && (
            <Section title="Portfolio">
              <View style={styles.gallery}>
                {portfolio.gallery.map((img: string, idx: number) => (
                  <TouchableOpacity
                    key={img}
                    activeOpacity={0.85}
                    style={styles.imageTouchable}
                    onPress={() => setLightboxIndex(idx)}
                  >
                    <Image source={{ uri: img }} style={styles.image} />
                  </TouchableOpacity>
                ))}
              </View>
            </Section>
          )}

          {/* LIGHTBOX MODAL */}
          <Modal
            visible={lightboxIndex !== null}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={() => setLightboxIndex(null)}
          >
            <StatusBar backgroundColor="#000" barStyle="light-content" />
            <View style={styles.lightboxBg}>
              {/* Close */}
              <TouchableOpacity
                style={styles.lightboxClose}
                onPress={() => setLightboxIndex(null)}
              >
                <Feather name="x" size={26} color="#fff" />
              </TouchableOpacity>

              {/* Counter */}
              <Text style={styles.lightboxCounter}>
                {lightboxIndex !== null ? lightboxIndex + 1 : ""} /{" "}
                {gallery.length}
              </Text>

              {/* Image */}
              {lightboxIndex !== null && (
                <Image
                  source={{ uri: gallery[lightboxIndex] }}
                  style={[styles.lightboxImage, { width: screenWidth }]}
                  resizeMode="contain"
                />
              )}

              {/* Prev / Next */}
              <View style={styles.lightboxNav}>
                <TouchableOpacity
                  style={[
                    styles.lightboxNavBtn,
                    lightboxIndex === 0 && styles.lightboxNavDisabled,
                  ]}
                  onPress={() =>
                    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))
                  }
                  disabled={lightboxIndex === 0}
                >
                  <Feather name="chevron-left" size={30} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.lightboxNavBtn,
                    lightboxIndex === gallery.length - 1 &&
                      styles.lightboxNavDisabled,
                  ]}
                  onPress={() =>
                    setLightboxIndex((i) =>
                      i !== null && i < gallery.length - 1 ? i + 1 : i,
                    )
                  }
                  disabled={lightboxIndex === gallery.length - 1}
                >
                  <Feather name="chevron-right" size={30} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* LINKS */}
          {Object.keys(portfolio.links || {}).length > 0 && (
            <Section title="Social Links">
              {Object.entries(portfolio.links)
                .filter(([, url]) => !!url)
                .map(([key, url]) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.linkRow}
                    onPress={() => Linking.openURL(normalizeUrl(url as string))}
                  >
                    <View style={styles.linkIconWrap}>
                      <Feather name="external-link" size={14} color="#4A6CF7" />
                    </View>
                    <Text style={styles.linkLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                    <Text style={styles.linkUrl} numberOfLines={1}>
                      {(url as string).trim()}
                    </Text>
                  </TouchableOpacity>
                ))}
            </Section>
          )}

          {/* CONTACT INFO */}
          {(portfolio.contact?.phone || portfolio.email) && (
            <Section title="Contact">
              {portfolio.contact?.phone && (
                <TouchableOpacity
                  style={styles.contactRow}
                  onPress={() =>
                    Linking.openURL(
                      `tel:${portfolio.contact.countryCode ?? ""}${portfolio.contact.phone}`,
                    )
                  }
                >
                  <View style={styles.contactIconWrap}>
                    <Feather name="phone" size={16} color="#4A6CF7" />
                  </View>
                  <View>
                    <Text style={styles.contactLabel}>Phone</Text>
                    <Text style={styles.contactValue}>
                      {portfolio.contact.countryCode} {portfolio.contact.phone}
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color="#bbb"
                    style={{ marginLeft: "auto" }}
                  />
                </TouchableOpacity>
              )}
              {portfolio.email && (
                <TouchableOpacity
                  style={styles.contactRow}
                  onPress={() => Linking.openURL(`mailto:${portfolio.email}`)}
                >
                  <View style={styles.contactIconWrap}>
                    <Feather name="mail" size={16} color="#4A6CF7" />
                  </View>
                  <View>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactValue}>{portfolio.email}</Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color="#bbb"
                    style={{ marginLeft: "auto" }}
                  />
                </TouchableOpacity>
              )}
            </Section>
          )}

          {/* FOOTER SPACER */}
          <View
            style={{
              height: portfolio.contact?.phone || portfolio.email ? 100 : 20,
            }}
          />
        </ScrollView>

        {/* BOTTOM ACTION BAR — only shown if at least one contact method exists */}
        {(portfolio.contact?.phone || portfolio.email) && (
          <View style={styles.footer}>
            {portfolio.contact?.phone && (
              <TouchableOpacity
                style={[styles.actionButton, styles.callButton]}
                onPress={() =>
                  Linking.openURL(
                    `tel:${portfolio.contact.countryCode ?? ""}${portfolio.contact.phone}`,
                  )
                }
              >
                <Feather name="phone" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>
            )}
            {portfolio.email && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.emailButton,
                  !portfolio.contact?.phone && { flex: 1 },
                ]}
                onPress={() => Linking.openURL(`mailto:${portfolio.email}`)}
              >
                <Feather name="mail" size={18} color="#4A6CF7" />
                <Text style={[styles.actionButtonText, { color: "#4A6CF7" }]}>
                  Email
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function TagList({ data }: { data: string[] }) {
  return (
    <View style={styles.tags}>
      {data.map((item) => (
        <View key={item} style={styles.tag}>
          <Text style={styles.tagText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },

  backButton: {
    marginBottom: 20,
    marginTop: 10,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 10,
  },
  placeholderAvatar: {
    backgroundColor: "#4A6CF7",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "800",
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
  },

  profession: {
    fontSize: 14,
    color: "#4A6CF7",
    marginTop: 4,
  },

  location: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  text: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    backgroundColor: "#EDF1FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },

  tagText: {
    fontSize: 12,
    color: "#4A6CF7",
  },

  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  imageTouchable: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F6",
    gap: 12,
  },

  linkIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDF1FF",
    justifyContent: "center",
    alignItems: "center",
  },

  linkLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    width: 90,
  },

  linkUrl: {
    flex: 1,
    fontSize: 13,
    color: "#4A6CF7",
  },

  lightboxBg: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  lightboxClose: {
    position: "absolute",
    top: 52,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 8,
  },

  lightboxCounter: {
    position: "absolute",
    top: 58,
    alignSelf: "center",
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    opacity: 0.85,
  },

  lightboxImage: {
    height: "75%" as any,
  },

  lightboxNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 60,
    left: 24,
    right: 24,
  },

  lightboxNavBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 28,
    padding: 12,
  },

  lightboxNavDisabled: {
    opacity: 0.25,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    gap: 12,
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },

  callButton: {
    backgroundColor: "#4A6CF7",
    shadowColor: "#4A6CF7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  emailButton: {
    backgroundColor: "#EDF1FF",
  },

  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F6",
    gap: 14,
  },

  contactIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EDF1FF",
    justifyContent: "center",
    alignItems: "center",
  },

  contactLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 2,
  },

  contactValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});
