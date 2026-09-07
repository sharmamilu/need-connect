import { Feather } from "@expo/vector-icons";

export type FeatherIcon = keyof typeof Feather.glyphMap;

export const FALLBACK_TEMPLATE_ICON: FeatherIcon = "file-text";

export interface TemplateField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

export interface TemplateDef {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: FeatherIcon;
  color: string;
  bg: string;
  hasAmount?: boolean;
  fields: TemplateField[];
}

export const TEMPLATE_CATEGORIES: string[] = [
  "Billing & Invoicing",
  "Career & Hiring",
  "Contracts & Legal",
  "Project Management",
  "Sales & Marketing",
];

export const TEMPLATES: TemplateDef[] = [
  {
    id: "invoice",
    title: "Freelance / Service Invoice",
    description: "Generate professional payment invoices for services rendered.",
    category: "Billing & Invoicing",
    icon: "file-text",
    color: "#2563EB",
    bg: "#EFF6FF",
    hasAmount: true,
    fields: [
      { key: "title", label: "Invoice Title / Number", placeholder: "e.g. Invoice #INV-2026-001" },
      { key: "clientName", label: "Client / Company Name", placeholder: "e.g. Acme Corp" },
      { key: "amount", label: "Total Amount Due ($)", placeholder: "e.g. 1,500.00", keyboardType: "numeric" },
      { key: "invoiceDate", label: "Issue Date", placeholder: "e.g. Oct 24, 2026" },
      { key: "dueDate", label: "Payment Due Date", placeholder: "e.g. Nov 07, 2026" },
      { key: "services", label: "Line Items / Services", placeholder: "e.g. 1. UI/UX Design (20h) - $1,000\n2. Frontend Implementation - $500", multiline: true },
      { key: "paymentNotes", label: "Payment Terms & Instructions", placeholder: "e.g. Bank Transfer: IBAN US12345678 or Stripe payment link", multiline: true },
    ],
  },
  {
    id: "resume",
    title: "Executive / Professional Resume",
    description: "Create an organized, formatted CV highlighting skills & experience.",
    category: "Career & Hiring",
    icon: "user-check",
    color: "#7C3AED",
    bg: "#F5F3FF",
    hasAmount: false,
    fields: [
      { key: "title", label: "Professional Title", placeholder: "e.g. Senior Full-Stack Engineer" },
      { key: "clientName", label: "Full Name", placeholder: "e.g. Jane Doe" },
      { key: "emailPhone", label: "Contact Info", placeholder: "e.g. jane@example.com | +1 (555) 019-2834" },
      { key: "summary", label: "Professional Summary", placeholder: "e.g. Experienced software architect with 8+ years building scalable systems...", multiline: true },
      { key: "experience", label: "Work Experience", placeholder: "e.g. Lead Developer at TechNova (2022-Present)\n- Led migration to microservices\n- Managed team of 8 engineers", multiline: true },
      { key: "education", label: "Education & Certifications", placeholder: "e.g. B.S. Computer Science - University of California (2020)\nAWS Certified Solutions Architect", multiline: true },
      { key: "skills", label: "Key Skills & Tools", placeholder: "e.g. React Native, TypeScript, Node.js, AWS, GraphQL, Docker", multiline: true },
    ],
  },
  {
    id: "contract",
    title: "Independent Contractor Agreement",
    description: "Legal contract binding client and service provider terms.",
    category: "Contracts & Legal",
    icon: "shield",
    color: "#059669",
    bg: "#ECFDF5",
    hasAmount: true,
    fields: [
      { key: "title", label: "Agreement Title", placeholder: "e.g. Freelance Software Development Agreement" },
      { key: "clientName", label: "Client Entity / Name", placeholder: "e.g. Nexus Innovations LLC" },
      { key: "amount", label: "Contract Value ($)", placeholder: "e.g. 5,000.00", keyboardType: "numeric" },
      { key: "effectiveDate", label: "Effective Date", placeholder: "e.g. November 1, 2026" },
      { key: "scopeOfWork", label: "Scope of Work & Deliverables", placeholder: "Detailed overview of project goals, milestone dates, and handoff criteria...", multiline: true },
      { key: "ipTerms", label: "Intellectual Property Ownership", placeholder: "e.g. All work product shall be owned solely by the client upon full payment.", multiline: true },
      { key: "confidentiality", label: "Confidentiality & Non-Disclosure", placeholder: "e.g. Both parties agree to keep proprietary project details strictly confidential.", multiline: true },
    ],
  },
  {
    id: "proposal",
    title: "Project Scope Proposal",
    description: "Pitch your services with cost breakdown, timeline, and deliverables.",
    category: "Sales & Marketing",
    icon: "send",
    color: "#EA580C",
    bg: "#FFF7ED",
    hasAmount: true,
    fields: [
      { key: "title", label: "Proposal Name", placeholder: "e.g. Mobile App Redesign Proposal" },
      { key: "clientName", label: "Prospective Client", placeholder: "e.g. Global Logistics Inc." },
      { key: "amount", label: "Estimated Project Budget ($)", placeholder: "e.g. 8,500.00", keyboardType: "numeric" },
      { key: "timeline", label: "Estimated Timeline", placeholder: "e.g. 6 Weeks (Phases 1 through 3)" },
      { key: "problemOverview", label: "Client Challenge & Needs", placeholder: "Outline the problem and objectives...", multiline: true },
      { key: "proposedSolution", label: "Proposed Solution & Methodology", placeholder: "Describe the approach, architecture, and technology...", multiline: true },
      { key: "deliverables", label: "Milestones & Deliverables", placeholder: "Milestone 1: Wireframes ($2,500)\nMilestone 2: App Build ($4,000)\nMilestone 3: QA & Launch ($2,000)", multiline: true },
    ],
  },
  {
    id: "receipt",
    title: "Payment Receipt",
    description: "Formal receipt confirming transaction receipt and balance clear.",
    category: "Billing & Invoicing",
    icon: "check-circle",
    color: "#0891B2",
    bg: "#ECFEFF",
    hasAmount: true,
    fields: [
      { key: "title", label: "Receipt Number", placeholder: "e.g. Receipt #REC-2026-882" },
      { key: "clientName", label: "Paid By (Customer)", placeholder: "e.g. Samantha Miller" },
      { key: "amount", label: "Amount Paid ($)", placeholder: "e.g. 450.00", keyboardType: "numeric" },
      { key: "paymentDate", label: "Payment Date", placeholder: "e.g. October 20, 2026" },
      { key: "paymentMethod", label: "Payment Method", placeholder: "e.g. Credit Card (ending in 4242)" },
      { key: "itemDescription", label: "Description of Items/Services", placeholder: "Consulting Session (3 hours) & Documentation Package", multiline: true },
    ],
  },
  {
    id: "nda",
    title: "Non-Disclosure Agreement (NDA)",
    description: "Protect confidential information and trade secrets.",
    category: "Contracts & Legal",
    icon: "lock",
    color: "#DC2626",
    bg: "#FEF2F2",
    hasAmount: false,
    fields: [
      { key: "title", label: "NDA Document Title", placeholder: "e.g. Mutual Confidentiality Agreement" },
      { key: "clientName", label: "Disclosing / Receiving Party", placeholder: "e.g. Innovatech Labs" },
      { key: "effectiveDate", label: "Effective Date", placeholder: "e.g. October 15, 2026" },
      { key: "confidentialInfo", label: "Definition of Confidential Material", placeholder: "Includes software source code, business plans, financials, and customer lists...", multiline: true },
      { key: "termPeriod", label: "Term & Expiration", placeholder: "e.g. 2 years from date of disclosure", multiline: true },
    ],
  },
  {
    id: "quotation",
    title: "Price Quotation / Estimate",
    description: "Provide itemized price estimates for client approval.",
    category: "Sales & Marketing",
    icon: "dollar-sign",
    color: "#4F46E5",
    bg: "#EEF2FF",
    hasAmount: true,
    fields: [
      { key: "title", label: "Quote Number / Title", placeholder: "e.g. Quotation #QT-2026-104" },
      { key: "clientName", label: "Customer / Organization", placeholder: "e.g. Alpha Media" },
      { key: "amount", label: "Total Quote Value ($)", placeholder: "e.g. 3,200.00", keyboardType: "numeric" },
      { key: "validityDate", label: "Valid Through", placeholder: "e.g. 30 days from issue" },
      { key: "items", label: "Itemized Breakdown", placeholder: "Item 1: Brand Guidelines - $1,200\nItem 2: Web Assets - $2,000", multiline: true },
    ],
  },
];

export function getTemplate(id?: string): TemplateDef | undefined {
  if (!id) return TEMPLATES[0];
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}
