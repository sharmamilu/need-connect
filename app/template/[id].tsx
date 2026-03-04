import { Feather } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { fetchDocumentById, generateDocument } from "../utils/apiFunctions";

const STYLES = [
  {
    id: "classic",
    name: "Classic Professional",
    description: "Clean, standard layout. Perfect for traditional businesses.",
    color: "#4A6CF7",
    bg: "#EEF2FF",
    icon: "briefcase",
  },
  {
    id: "creative",
    name: "Creative Visual",
    description:
      "Image-heavy, vibrant design. Ideal for photographers & designers.",
    color: "#DB2777",
    bg: "#FCE7F3",
    icon: "camera",
  },
  {
    id: "dark",
    name: "Modern Dark",
    description: "Sleek, edge-to-edge dark mode for a premium tech feel.",
    color: "#1E293B",
    bg: "#F1F5F9",
    icon: "moon",
  },
  {
    id: "elegant",
    name: "Elegant Serif",
    description: "High-end luxury typography. Great for premium services.",
    color: "#D97706",
    bg: "#FEF3C7",
    icon: "feather",
  },
];

const TEMPLATE_CONFIGS: Record<
  string,
  { key: string; label: string; placeholder: string; multiline?: boolean }[]
> = {
  invoice: [
    {
      key: "title",
      label: "Invoice Title",
      placeholder: "e.g. Graphic Design Services",
    },
    { key: "invoiceNo", label: "Invoice Number", placeholder: "INV-001" },
    {
      key: "clientName",
      label: "Billed To (Client Name)",
      placeholder: "Acme Corp",
    },
    { key: "amount", label: "Total Invoice Amount", placeholder: "$1,500.00" },
    {
      key: "description",
      label: "Services Rendered",
      placeholder: "Logo design, branding...",
      multiline: true,
    },
    {
      key: "dueDate",
      label: "Payment Due Date",
      placeholder: "Within 15 days",
    },
  ],
  quotation: [
    {
      key: "title",
      label: "Quotation Title",
      placeholder: "e.g. Website Development",
    },
    {
      key: "clientName",
      label: "Prepared For",
      placeholder: "Target Client Name",
    },
    { key: "amount", label: "Estimated Cost", placeholder: "$3,200.00" },
    {
      key: "description",
      label: "Scope of Work",
      placeholder: "Detailed tasks to be performed...",
      multiline: true,
    },
    { key: "validity", label: "Valid Until", placeholder: "March 30, 2026" },
  ],
  proposal: [
    { key: "title", label: "Proposal Title", placeholder: "Mobile App Pitch" },
    {
      key: "clientName",
      label: "Prospective Client",
      placeholder: "Client Name",
    },
    { key: "amount", label: "Proposed Budget", placeholder: "$10,000.00" },
    {
      key: "description",
      label: "Proposed Solution & Summary",
      placeholder: "How we will solve the problem...",
      multiline: true,
    },
    {
      key: "timeline",
      label: "Timeline / Milestones",
      placeholder: "4-6 weeks",
    },
  ],
  contract: [
    {
      key: "title",
      label: "Contract Title",
      placeholder: "Freelance Service Agreement",
    },
    {
      key: "clientName",
      label: "Party B (Client Name)",
      placeholder: "Client Legal Name",
    },
    { key: "amount", label: "Total Contract Value", placeholder: "$5,000.00" },
    {
      key: "description",
      label: "Terms & Conditions",
      placeholder: "1. Services... 2. Payment...",
      multiline: true,
    },
  ],
  resume: [
    { key: "title", label: "Full Name", placeholder: "Jane Doe" },
    {
      key: "clientName",
      label: "Professional Title",
      placeholder: "Senior Mobile Engineer",
    },
    {
      key: "contact",
      label: "Email & Phone",
      placeholder: "jane.doe@email.com | +1 234 567 890",
    },
    {
      key: "links",
      label: "Portfolio / LinkedIn",
      placeholder: "linkedin.com/in/janedoe",
    },
    {
      key: "description",
      label: "Professional Summary",
      placeholder: "Experienced engineer with 5 years in building...",
      multiline: true,
    },
    {
      key: "experience",
      label: "Work Experience",
      placeholder: "Company A (2020 - Present)\n- Led mobile team...",
      multiline: true,
    },
    {
      key: "education",
      label: "Education",
      placeholder: "B.S. Computer Science, University X",
      multiline: true,
    },
    {
      key: "skills",
      label: "Skills & Expertise",
      placeholder: "React Native, TypeScript, Node.js, UI/UX",
      multiline: true,
    },
  ],
};

export default function TemplateViewer() {
  const { id, docId } = useLocalSearchParams<{ id: string; docId?: string }>();
  const router = useRouter();

  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [fetchingDoc, setFetchingDoc] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  useEffect(() => {
    if (docId) {
      setFetchingDoc(true);
      fetchDocumentById(docId)
        .then((res) => {
          if (res.data?.success && res.data?.data) {
            const doc = res.data.data;
            if (doc.designStyle) setSelectedStyle(doc.designStyle);
            if (doc.formData) setFormData(doc.formData);
          }
        })
        .catch((err) => {
          console.error("Failed to load historical document:", err);
          Alert.alert("Error", "Could not load this past document.");
        })
        .finally(() => setFetchingDoc(false));
    }
  }, [docId]);

  const generateLocalHtml = (style: any) => {
    const fieldsConfig =
      TEMPLATE_CONFIGS[id || "invoice"] || TEMPLATE_CONFIGS["invoice"];

    // Core extracted fields for hero sections
    const titleStr = formData.title || "Untitled Document";
    const clientStr = formData.clientName || "N/A";
    const amountStr = formData.amount || (id === "resume" ? "N/A" : "$0.00");
    const dateStr = new Date().toLocaleDateString();

    // Map through the rest of the generic fields for flexible rendering based on user's config
    const renderExtraFields = () => {
      return fieldsConfig
        .filter((f) => !["title", "clientName", "amount"].includes(f.key))
        .map((f) => {
          const val = formData[f.key] || "N/A";
          if (f.multiline) {
            return `<div class="label" style="margin-top:20px; margin-bottom: 10px;">${f.label}</div><div class="description-box">${val}</div>`;
          } else {
            return `<div><div class="label" style="margin-top:20px;">${f.label}</div><div class="value">${val}</div></div>`;
          }
        })
        .join("");
    };

    let css = "";
    let bodyHtml = "";

    if (id === "resume") {
      const emailStr = formData.contact || "";
      const linksStr = formData.links || "";
      const summaryStr = formData.description || "";
      const expStr = formData.experience || "";
      const eduStr = formData.education || "";
      const skillsStr = formData.skills || "";

      const primaryColor = style.id === "dark" ? "#38BDF8" : style.color;
      const bgCol =
        style.id === "dark"
          ? "#0F172A"
          : style.id === "elegant"
            ? "#E7E5E4"
            : style.id === "creative"
              ? "#FDF2F8"
              : "#F8FAFC";
      const surfaceCol =
        style.id === "dark"
          ? "#1E293B"
          : style.id === "elegant"
            ? "#FAFAF9"
            : "#FFFFFF";
      const textMain = style.id === "dark" ? "#F8FAFC" : "#1E293B";
      const textDim = style.id === "dark" ? "#94A3B8" : "#64748B";

      const isSerif = style.id === "elegant";
      const fontFamily = isSerif
        ? "'Georgia', serif"
        : style.id === "creative"
          ? "'Avenir', sans-serif"
          : "'Inter', 'Helvetica Neue', sans-serif";

      const renderSection = (title: string, content: string) => {
        if (!content) return "";
        return `
          <div style="margin-bottom: 30px;">
            <div style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: ${primaryColor}; border-bottom: 2px solid ${style.id === "dark" ? "#334155" : "#E2E8F0"}; padding-bottom: 8px; margin-bottom: 16px;">
              ${title}
            </div>
            <div style="font-size: 15px; line-height: 1.8; color: ${textMain}; white-space: pre-wrap;">${content}</div>
          </div>
        `;
      };

      css = `
        body { font-family: ${fontFamily}; background-color: ${bgCol}; color: ${textMain}; padding: 30px; margin: 0; }
        .resume-container { max-width: 850px; margin: 0 auto; background-color: ${surfaceCol}; border-radius: ${style.id === "creative" ? "20px" : "0"}; box-shadow: ${style.id === "classic" ? "0 4px 15px rgba(0,0,0,0.05)" : "none"}; overflow: hidden; ${style.id === "elegant" ? "border: 1px solid #D6D3D1;" : ""} ${style.id === "dark" ? "border: 1px solid #334155;" : ""} }
        .resume-header { background: ${style.id === "creative" ? `linear-gradient(135deg, ${primaryColor}, #F472B6)` : style.id === "dark" ? "#0F172A" : "#FFFFFF"}; padding: 50px 40px; text-align: ${style.id === "creative" || style.id === "elegant" ? "center" : "left"}; ${style.id === "classic" ? `border-top: 10px solid ${primaryColor};` : ""} ${style.id === "elegant" ? "border-bottom: 1px solid #D6D3D1;" : ""} }
        .resume-name { font-size: ${style.id === "elegant" ? "42px" : "38px"}; font-weight: ${style.id === "creative" ? "800" : style.id === "elegant" ? "normal" : "700"}; margin: 0; color: ${style.id === "creative" ? "#FFF" : textMain}; ${style.id === "elegant" ? "font-style: italic;" : ""} }
        .resume-title { font-size: 20px; color: ${style.id === "creative" ? "rgba(255,255,255,0.9)" : primaryColor}; font-weight: 500; margin-top: 8px; letter-spacing: 1px; text-transform: uppercase; }
        .resume-contact { margin-top: 25px; font-size: 14px; color: ${style.id === "creative" ? "rgba(255,255,255,0.8)" : textDim}; display: flex; gap: 20px; flex-wrap: wrap; justify-content: ${style.id === "creative" || style.id === "elegant" ? "center" : "flex-start"}; }
        .resume-body { padding: 40px; display: grid; gap: 40px; grid-template-columns: ${style.id === "creative" || style.id === "elegant" ? "1fr" : "2fr 1fr"}; }
      `;

      bodyHtml = `
        <div class="resume-container">
          <div class="resume-header">
            <h1 class="resume-name">${titleStr}</h1>
            <div class="resume-title">${clientStr}</div>
            <div class="resume-contact">
              ${emailStr ? `<div>${emailStr}</div>` : ""}
              ${linksStr ? `<div>|</div><div>${linksStr}</div>` : ""}
            </div>
          </div>
          <div class="resume-body">
            <div>
              ${renderSection("Professional Summary", summaryStr)}
              ${renderSection("Experience", expStr)}
            </div>
            <div>
              ${renderSection("Skills", skillsStr)}
              ${renderSection("Education", eduStr)}
            </div>
          </div>
        </div>
      `;
    } else if (style.id === "classic") {
      css = `
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F8FAFC; padding: 40px; color: #1E293B; }
        .container { background-color: #FFFFFF; padding: 50px; border-top: 10px solid #4A6CF7; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #E2E8F0; padding-bottom: 20px; margin-bottom: 40px; }
        .title { font-size: 34px; color: #4A6CF7; margin: 0; }
        .subtitle { font-size: 14px; text-transform: uppercase; color: #64748B; margin-top: 5px; }
        .info-grid { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .label { font-size: 11px; text-transform: uppercase; color: #94A3B8; font-weight: bold; margin-bottom: 4px; }
        .value { font-size: 16px; font-weight: 500; }
        .amount-box { text-align: right; }
        .amount-val { font-size: 28px; font-weight: bold; color: #1E293B; }
        .description-box { background: #F1F5F9; padding: 20px; border-radius: 6px; font-size: 15px; line-height: 1.6; white-space: pre-wrap; margin-bottom: 15px; }
        .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #94A3B8; }
      `;
      bodyHtml = `
        <div class="container">
          <div class="header">
            <div>
              <h1 class="title">${titleStr}</h1>
              <div class="subtitle">${id?.toUpperCase()}</div>
            </div>
            <div style="text-align: right;">
              <div class="label">Date</div>
              <div class="value">${dateStr}</div>
            </div>
          </div>
          <div class="info-grid">
            <div>
              <div class="label">Primary Party</div>
              <div class="value">${clientStr}</div>
            </div>
            ${
              id !== "resume"
                ? `
            <div class="amount-box">
              <div class="label">Primary Valuation</div>
              <div class="amount-val">${amountStr}</div>
            </div>`
                : ""
            }
          </div>
          ${renderExtraFields()}
          <div class="footer">Generated via Need Connect Professional Workspace</div>
        </div>
      `;
    } else if (style.id === "creative") {
      css = `
        body { font-family: 'Avenir', sans-serif; background-color: #FDF2F8; padding: 20px; color: #4A044E; }
        .container { background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(219, 39, 119, 0.15); }
        .hero { background: linear-gradient(135deg, #DB2777, #F472B6); padding: 60px 40px; color: white; }
        .hero h1 { font-size: 42px; margin: 0 0 10px 0; font-weight: 800; }
        .type-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 40px; }
        .flex-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 2px dashed #FBCFE8; }
        .client-name { font-size: 24px; font-weight: bold; color: #BE185D; }
        .label { font-size: 12px; text-transform: uppercase; color: #F472B6; font-weight: bold; margin-bottom: 5px; }
        .amount-circle { background: #FCE7F3; color: #DB2777; width: 140px; height: 140px; border-radius: 70px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; border: 4px solid #FBCFE8; }
        .description-box { font-size: 16px; line-height: 1.8; color: #831843; white-space: pre-wrap; margin-bottom: 20px; }
        .value { font-size: 18px; font-weight: 600; color: #BE185D; }
      `;
      bodyHtml = `
        <div class="container">
          <div class="hero">
            <div class="type-badge">${id}</div>
            <h1>${titleStr}</h1>
            <div style="margin-top: 20px; opacity: 0.8;">Date: ${dateStr}</div>
          </div>
          <div class="content">
            <div class="flex-row">
              <div>
                <div class="label">Main Client / Subject</div>
                <div class="client-name">${clientStr}</div>
              </div>
              ${id !== "resume" ? `<div class="amount-circle">${amountStr}</div>` : ""}
            </div>
            ${renderExtraFields()}
          </div>
        </div>
      `;
    } else if (style.id === "dark") {
      css = `
        body { font-family: 'Inter', sans-serif; background-color: #0F172A; padding: 20px; color: #F8FAFC; }
        .container { background-color: #1E293B; padding: 50px; border-radius: 12px; border: 1px solid #334155; }
        .header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 50px; }
        h1 { font-size: 38px; color: #F8FAFC; margin: 0; font-weight: 300; letter-spacing: -1px; }
        .doc-type { font-size: 14px; text-transform: uppercase; color: #38BDF8; letter-spacing: 3px; font-weight: bold; margin-bottom: 10px; }
        .divider { height: 1px; background: #334155; margin: 30px 0; }
        .label { font-size: 12px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .value { font-size: 18px; color: #E2E8F0; }
        .amount-text { font-size: 42px; color: #38BDF8; font-weight: 200; letter-spacing: -1px; }
        .description-box { background: #0F172A; padding: 25px; border-radius: 8px; font-size: 15px; color: #CBD5E1; line-height: 1.7; white-space: pre-wrap; border: 1px solid #1E293B; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5); }
      `;
      bodyHtml = `
        <div class="container">
          <div class="header">
            <div>
              <div class="doc-type">${id}</div>
              <h1>${titleStr}</h1>
            </div>
            <div style="text-align: right; color: #64748B;">${dateStr}</div>
          </div>
          <div class="label">Core Subject</div>
          <div class="value">${clientStr}</div>
          <div class="divider"></div>
          ${
            id !== "resume"
              ? `
          <div class="label">Total Value</div>
          <div class="amount-text">${amountStr}</div>
          <div class="divider"></div>
          `
              : ""
          }
          ${renderExtraFields()}
        </div>
      `;
    } else {
      css = `
        body { font-family: 'Georgia', serif; background-color: #E7E5E4; padding: 40px; color: #292524; }
        .container { background-color: #FAFAF9; padding: 60px; max-width: 800px; margin: 0 auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border: 1px solid #D6D3D1; position: relative; }
        .container::before { content: ""; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 1px solid #E7E5E4; pointer-events: none; }
        .header { text-align: center; margin-bottom: 50px; border-bottom: 1px solid #D6D3D1; padding-bottom: 30px; }
        h1 { font-size: 36px; color: #78350F; margin: 0 0 15px 0; font-weight: normal; font-style: italic; }
        .meta { font-family: 'Helvetica', sans-serif; font-size: 12px; color: #78716C; text-transform: uppercase; letter-spacing: 2px; }
        .info { display: flex; justify-content: space-between; margin-bottom: 40px; font-size: 15px; line-height: 1.6; }
        .amount-section { text-align: center; padding: 30px 0; background-color: #F5F5F4; margin-bottom: 40px; border-top: 1px solid #E7E5E4; border-bottom: 1px solid #E7E5E4; }
        .amount-val { font-size: 32px; color: #78350F; }
        .label { font-size: 18px; color: #78350F; border-bottom: 1px solid #E7E5E4; padding-bottom: 10px; margin-bottom: 15px; font-style: italic; }
        .value { font-size: 16px; margin-bottom: 20px; }
        .description-box { font-size: 16px; line-height: 1.8; color: #44403C; white-space: pre-wrap; margin-bottom: 20px; }
      `;
      bodyHtml = `
        <div class="container">
          <div class="header">
            <h1>${titleStr}</h1>
            <div class="meta">${id} &nbsp;|&nbsp; ${dateStr}</div>
          </div>
          <div class="info">
            <div>
              <div style="color: #78716C; font-size: 12px; text-transform: uppercase;">To / Subject</div>
              <div style="font-size: 18px; margin-top: 5px;">${clientStr}</div>
            </div>
            <div style="text-align: right;">
              <div style="color: #78716C; font-size: 12px; text-transform: uppercase;">From</div>
              <div style="font-size: 18px; margin-top: 5px;">Need Connect Professional</div>
            </div>
          </div>
          ${
            id !== "resume"
              ? `
          <div class="amount-section">
            <div style="color: #78716C; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Total Valuation</div>
            <div class="amount-val">${amountStr}</div>
          </div>
          `
              : ""
          }
          ${renderExtraFields()}
        </div>
      `;
    }

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>${css}</style>
        </head>
        <body>${bodyHtml}</body>
      </html>
    `;
  };

  const handlePreview = async () => {
    if (!formData.title && !formData.clientName && !formData.amount) {
      Alert.alert(
        "Missing Details",
        "Please fill out at least one field to see a preview.",
      );
      return;
    }
    setPreviewLoading(true);
    try {
      const activeStyle = STYLES.find((s) => s.id === selectedStyle);
      const htmlContent = generateLocalHtml(activeStyle);
      setPreviewHtml(htmlContent);
    } catch (error: any) {
      console.error("Preview Generation Error:", error.message);
      Alert.alert(
        "Error",
        "Something went wrong generating the internal preview.",
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!formData.title || !formData.clientName) {
      Alert.alert(
        "Missing Fields",
        "Please fill out at least a title and a client/subject name.",
      );
      return;
    }

    setLoading(true);
    try {
      // 1. Send purely the JSON data to backend (Backend just saves the record, no PDF work)
      const payload = {
        templateType: id,
        designStyle: selectedStyle,
        ...formData,
      };
      await generateDocument(payload); // We don't need to wait for its PDF response anymore!

      // 2. Generate initial PDF locally in cache
      const activeStyle = STYLES.find((s) => s.id === selectedStyle);
      const htmlContent = generateLocalHtml(activeStyle);

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      const pdfName = `${formData.title.replace(/[^a-zA-Z0-9]/g, "_") || id}_Document.pdf`;

      // 3. Save directly to the phone's native filesystem
      if (Platform.OS === "android") {
        try {
          const permissions =
            await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (permissions.granted) {
            const base64Str = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            const savedUri =
              await FileSystem.StorageAccessFramework.createFileAsync(
                permissions.directoryUri,
                pdfName,
                "application/pdf",
              );
            await FileSystem.writeAsStringAsync(savedUri, base64Str, {
              encoding: FileSystem.EncodingType.Base64,
            });
            Alert.alert("Success", "Document physically saved to your phone!");
          } else {
            // Fallback if they cancel the directory picker
            await Sharing.shareAsync(uri, {
              mimeType: "application/pdf",
              dialogTitle: "Save your document",
            });
          }
        } catch (e) {
          // Fallback if the SAF throws an error on older Androids
          await Sharing.shareAsync(uri, {
            mimeType: "application/pdf",
            dialogTitle: "Save your document",
          });
        }
      } else {
        // iOS: Copy from cache to Documents dir so the file has a human-readable name when the Share Sheet pops up
        const renamedUri = FileSystem.documentDirectory + pdfName;
        await FileSystem.copyAsync({ from: uri, to: renamedUri });

        await Sharing.shareAsync(renamedUri, {
          mimeType: "application/pdf",
          dialogTitle: "Save your document",
          UTI: "com.adobe.pdf", // Triggers iOS specifically to treat this directly as a PDF for "Save to Files"
        });
      }
    } catch (error: any) {
      console.error(
        "Document Generation Error:",
        error?.response?.data || error.message,
      );
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Something went wrong generating the template locally.",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStylePicker = () => (
    <View style={styles.content}>
      <Text style={styles.promptText}>Select a Design Style</Text>
      <Text style={styles.subPrompt}>
        Choose an aesthetic that matches your brand.
      </Text>

      {STYLES.map((style) => (
        <TouchableOpacity
          key={style.id}
          activeOpacity={0.8}
          style={[styles.styleCard, { borderColor: style.bg }]}
          onPress={() => setSelectedStyle(style.id)}
        >
          <View
            style={[styles.styleIconWrapper, { backgroundColor: style.bg }]}
          >
            <Feather name={style.icon as any} size={24} color={style.color} />
          </View>
          <View style={styles.styleTextWrapper}>
            <Text style={styles.styleName}>{style.name}</Text>
            <Text style={styles.styleDesc}>{style.description}</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#CCC" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderForm = () => {
    const activeStyle = STYLES.find((s) => s.id === selectedStyle);

    return (
      <View style={styles.content}>
        <View style={styles.activeStyleBanner}>
          <Text style={styles.activeStyleLabel}>Selected Style</Text>
          <TouchableOpacity
            style={styles.changeStyleBtn}
            onPress={() => setSelectedStyle(null)}
          >
            <Text style={styles.changeStyleText}>Change</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.activeStylePreview,
            { backgroundColor: activeStyle?.bg },
          ]}
        >
          <Feather
            name={activeStyle?.icon as any}
            size={20}
            color={activeStyle?.color}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.activeStyleName, { color: activeStyle?.color }]}>
            {activeStyle?.name}
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Document Content</Text>

          {(TEMPLATE_CONFIGS[id as string] || TEMPLATE_CONFIGS["invoice"]).map(
            (field) => (
              <View key={field.key}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={[styles.input, field.multiline && styles.textArea]}
                  placeholder={field.placeholder}
                  multiline={field.multiline}
                  numberOfLines={field.multiline ? 5 : 1}
                  value={formData[field.key] || ""}
                  onChangeText={(text) =>
                    setFormData({ ...formData, [field.key]: text })
                  }
                />
              </View>
            ),
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.outlineButton,
                { borderColor: activeStyle?.color },
              ]}
              onPress={handlePreview}
              disabled={previewLoading || loading}
            >
              {previewLoading ? (
                <ActivityIndicator color={activeStyle?.color} size="small" />
              ) : (
                <>
                  <Text
                    style={[
                      styles.outlineButtonText,
                      { color: activeStyle?.color },
                    ]}
                  >
                    Preview Template
                  </Text>
                  <Feather name="eye" size={18} color={activeStyle?.color} />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.generateButton,
                { backgroundColor: activeStyle?.color },
              ]}
              onPress={handleGenerate}
              disabled={loading || previewLoading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.generateButtonText}>Generate & Save</Text>
                  <Feather name="check-circle" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (selectedStyle) {
              setSelectedStyle(null);
            } else {
              router.back();
            }
          }}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {id ? id.charAt(0).toUpperCase() + id.slice(1) : "Template"}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraHeight={120}
        keyboardShouldPersistTaps="handled"
      >
        {fetchingDoc ? (
          <View
            style={{
              flex: 1,
              padding: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#4A6CF7" />
            <Text
              style={{ marginTop: 15, color: "#64748B", fontWeight: "500" }}
            >
              Loading previous design...
            </Text>
          </View>
        ) : !selectedStyle ? (
          renderStylePicker()
        ) : (
          renderForm()
        )}
      </KeyboardAwareScrollView>

      {/* Full Screen In-App Preview Modal */}
      <Modal
        visible={!!previewHtml}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPreviewHtml(null)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={styles.previewHeader}>
            <TouchableOpacity
              onPress={() => setPreviewHtml(null)}
              style={{ padding: 8 }}
            >
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.previewTitle}>Live Preview</Text>
            <View style={{ width: 40 }} />
          </View>
          {previewHtml && (
            <WebView
              source={{ html: previewHtml }}
              style={{ flex: 1 }}
              originWhitelist={["*"]}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 16,
  },
  promptText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1c1e21",
    marginBottom: 6,
  },
  subPrompt: {
    fontSize: 15,
    color: "#666",
    marginBottom: 24,
  },
  styleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  styleIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  styleTextWrapper: {
    flex: 1,
    paddingRight: 12,
  },
  styleName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  styleDesc: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  activeStyleBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  activeStyleLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  changeStyleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#E2E8F0",
    borderRadius: 20,
  },
  changeStyleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  activeStylePreview: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  activeStyleName: {
    fontSize: 16,
    fontWeight: "700",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1c1e21",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    marginBottom: 20,
    color: "#333",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  outlineButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    gap: 8,
    backgroundColor: "transparent",
  },
  outlineButtonText: {
    fontWeight: "700",
    fontSize: 15,
  },
  generateButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    gap: 8,
  },
  generateButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#fff",
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
});
