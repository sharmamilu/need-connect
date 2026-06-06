import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";
import { FeatherIcon } from "../constants/templates";
import { radius, shadow, spacing } from "../constants/theme";

/* ----------------------------- helpers ----------------------------- */

const num = (v: string) => {
  const n = parseFloat((v || "").replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
};

const money = (n: number) =>
  isFinite(n)
    ? n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";

const round2 = (n: number) =>
  isFinite(n)
    ? (Math.round(n * 100) / 100).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })
    : "0";

/* --------------------------- shared UI ----------------------------- */

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  suffix,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  suffix?: string;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldInputRow}>
        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          keyboardType="decimal-pad"
        />
        {suffix ? <Text style={styles.fieldSuffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

function Result({
  label,
  value,
  primary,
}: {
  label: string;
  value: string;
  primary?: boolean;
}) {
  return (
    <View style={[styles.resultRow, primary && styles.resultRowPrimary]}>
      <Text style={[styles.resultLabel, primary && styles.resultLabelPrimary]}>
        {label}
      </Text>
      <Text style={[styles.resultValue, primary && styles.resultValuePrimary]}>
        {value}
      </Text>
    </View>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[];
  value: string;
  onChange: (k: string) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <TouchableOpacity
            key={o.key}
            style={[styles.segment, active && styles.segmentActive]}
            onPress={() => onChange(o.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.segmentText, active && styles.segmentTextActive]}
            >
              {o.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* --------------------------- calculators --------------------------- */

function GstTax() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState("add");

  const a = num(amount);
  const r = num(rate);
  let tax = 0;
  let base = 0;
  let gross = 0;
  if (mode === "add") {
    base = a;
    tax = (a * r) / 100;
    gross = a + tax;
  } else {
    gross = a;
    base = a / (1 + r / 100);
    tax = a - base;
  }

  return (
    <>
      <Segmented
        options={[
          { key: "add", label: "Add Tax" },
          { key: "remove", label: "Remove Tax" },
        ]}
        value={mode}
        onChange={setMode}
      />
      <Field
        label={mode === "add" ? "Base Amount" : "Gross Amount"}
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
      />
      <Field
        label="Tax Rate"
        value={rate}
        onChangeText={setRate}
        placeholder="18"
        suffix="%"
      />
      <View style={styles.results}>
        <Result label="Net / Base" value={money(base)} />
        <Result label={`Tax (${r || 0}%)`} value={money(tax)} />
        <Result label="Total" value={money(gross)} primary />
      </View>
    </>
  );
}

function Discount() {
  const [price, setPrice] = useState("");
  const [disc, setDisc] = useState("");

  const p = num(price);
  const d = num(disc);
  const save = (p * d) / 100;
  const final = p - save;

  return (
    <>
      <Field
        label="Original Price"
        value={price}
        onChangeText={setPrice}
        placeholder="0.00"
      />
      <Field
        label="Discount"
        value={disc}
        onChangeText={setDisc}
        placeholder="0"
        suffix="%"
      />
      <View style={styles.results}>
        <Result label="You Save" value={money(save)} />
        <Result label="Final Price" value={money(final)} primary />
      </View>
    </>
  );
}

function Emi() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");

  const P = num(principal);
  const annual = num(rate);
  const n = Math.round(num(months));
  const r = annual / 12 / 100;

  let emi = 0;
  if (n > 0) {
    emi =
      r === 0
        ? P / n
        : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }
  const total = emi * n;
  const interest = total - P;

  return (
    <>
      <Field
        label="Loan Amount"
        value={principal}
        onChangeText={setPrincipal}
        placeholder="0.00"
      />
      <Field
        label="Interest Rate (per year)"
        value={rate}
        onChangeText={setRate}
        placeholder="0"
        suffix="%"
      />
      <Field
        label="Tenure"
        value={months}
        onChangeText={setMonths}
        placeholder="12"
        suffix="mo"
      />
      <View style={styles.results}>
        <Result label="Monthly EMI" value={money(emi)} primary />
        <Result label="Total Interest" value={money(interest)} />
        <Result label="Total Payable" value={money(total)} />
      </View>
    </>
  );
}

function TipSplit() {
  const [bill, setBill] = useState("");
  const [tip, setTip] = useState("10");
  const [people, setPeople] = useState("1");

  const b = num(bill);
  const t = num(tip);
  const ppl = Math.max(1, Math.round(num(people)));
  const tipAmt = (b * t) / 100;
  const total = b + tipAmt;
  const perPerson = total / ppl;

  return (
    <>
      <Field
        label="Bill Amount"
        value={bill}
        onChangeText={setBill}
        placeholder="0.00"
      />
      <Field
        label="Tip"
        value={tip}
        onChangeText={setTip}
        placeholder="10"
        suffix="%"
      />
      <Field
        label="Split Between"
        value={people}
        onChangeText={setPeople}
        placeholder="1"
        suffix="people"
      />
      <View style={styles.results}>
        <Result label="Tip Amount" value={money(tipAmt)} />
        <Result label="Total Bill" value={money(total)} />
        <Result label="Per Person" value={money(perPerson)} primary />
      </View>
    </>
  );
}

function Percentage() {
  const [mode, setMode] = useState("of");
  const [x, setX] = useState("");
  const [y, setY] = useState("");

  const a = num(x);
  const b = num(y);
  const result = mode === "of" ? (a / 100) * b : b === 0 ? 0 : (a / b) * 100;

  return (
    <>
      <Segmented
        options={[
          { key: "of", label: "% of value" },
          { key: "is", label: "X is what %" },
        ]}
        value={mode}
        onChange={setMode}
      />
      <Field
        label={mode === "of" ? "Percentage" : "Value (X)"}
        value={x}
        onChangeText={setX}
        placeholder="0"
        suffix={mode === "of" ? "%" : undefined}
      />
      <Field
        label={mode === "of" ? "Of Value" : "Out of (Y)"}
        value={y}
        onChangeText={setY}
        placeholder="0"
      />
      <View style={styles.results}>
        <Result
          label="Result"
          value={mode === "of" ? round2(result) : `${round2(result)}%`}
          primary
        />
      </View>
    </>
  );
}

/* ----------------------------- screen ------------------------------ */

type Tool = {
  key: string;
  title: string;
  icon: FeatherIcon;
  color: string;
  bg: string;
  Component: React.ComponentType;
};

const TOOLS: Tool[] = [
  {
    key: "gst",
    title: "GST / Tax",
    icon: "percent",
    color: "#4A6CF7",
    bg: "#EEF2FF",
    Component: GstTax,
  },
  {
    key: "discount",
    title: "Discount",
    icon: "tag",
    color: "#16A34A",
    bg: "#DCFCE7",
    Component: Discount,
  },
  {
    key: "emi",
    title: "Loan EMI",
    icon: "trending-up",
    color: "#9333EA",
    bg: "#F3E8FF",
    Component: Emi,
  },
  {
    key: "tip",
    title: "Tip & Split",
    icon: "users",
    color: "#EA580C",
    bg: "#FFEDD5",
    Component: TipSplit,
  },
  {
    key: "percent",
    title: "Percentage",
    icon: "divide",
    color: "#0891B2",
    bg: "#CFFAFE",
    Component: Percentage,
  },
];

export default function QuickToolsScreen() {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState(TOOLS[0].key);
  const active = TOOLS.find((t) => t.key === activeKey) || TOOLS[0];
  const ActiveComponent = active.Component;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={8}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quick Tools</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* TOOL SELECTOR */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolStrip}
        >
          {TOOLS.map((t) => {
            const isActive = t.key === activeKey;
            return (
              <TouchableOpacity
                key={t.key}
                style={[styles.toolChip, isActive && styles.toolChipActive]}
                onPress={() => setActiveKey(t.key)}
                activeOpacity={0.85}
              >
                <View
                  style={[styles.toolChipIcon, { backgroundColor: t.bg }]}
                >
                  <Feather name={t.icon} size={18} color={t.color} />
                </View>
                <Text
                  style={[
                    styles.toolChipText,
                    isActive && styles.toolChipTextActive,
                  ]}
                >
                  {t.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ACTIVE CALCULATOR */}
        <View style={styles.calcCard}>
          <View style={styles.calcHeader}>
            <View style={[styles.calcIcon, { backgroundColor: active.bg }]}>
              <Feather name={active.icon} size={20} color={active.color} />
            </View>
            <Text style={styles.calcTitle}>{active.title}</Text>
          </View>
          <ActiveComponent />
        </View>

        <Text style={styles.note}>
          Calculations run instantly as you type.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { padding: 4, marginLeft: -4 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  toolStrip: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
    paddingRight: spacing.lg,
  },
  toolChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
  },
  toolChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  toolChipIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  toolChipText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: colors.textMuted,
  },
  toolChipTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  calcCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  calcHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  calcIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  calcTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  fieldInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  fieldInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 16,
    color: colors.text,
    fontWeight: "600",
  },
  fieldSuffix: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: "600",
    marginLeft: spacing.sm,
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  segment: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: colors.card,
    ...shadow.card,
  },
  segmentText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: colors.textMuted,
  },
  segmentTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  results: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.inputBg,
  },
  resultRowPrimary: {
    backgroundColor: colors.primarySoft,
  },
  resultLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: "500",
  },
  resultLabelPrimary: {
    color: colors.primary,
    fontWeight: "700",
  },
  resultValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "700",
  },
  resultValuePrimary: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "800",
  },
  note: {
    textAlign: "center",
    color: colors.gray,
    fontSize: 12.5,
    marginTop: spacing.lg,
  },
});
