import { Feather } from "@expo/vector-icons";

export type FeatherIcon = keyof typeof Feather.glyphMap;

export type TemplateField = {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
};

export type TemplateCategory =
  | "Business"
  | "Finance"
  | "Legal"
  | "Career"
  | "Personal";

export type TemplateDef = {
  id: string;
  title: string;
  description: string;
  icon: FeatherIcon;
  color: string;
  bg: string;
  category: TemplateCategory;
  /** Whether this document shows a monetary "amount/valuation" block. */
  hasAmount: boolean;
  fields: TemplateField[];
};

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "Business",
  "Finance",
  "Legal",
  "Career",
  "Personal",
];

export const TEMPLATES: TemplateDef[] = [
  // ---------------- BUSINESS ----------------
  {
    id: "invoice",
    title: "Service Invoice",
    description: "Bill clients for completed services or gigs.",
    icon: "file-text",
    color: "#4A6CF7",
    bg: "#EEF2FF",
    category: "Business",
    hasAmount: true,
    fields: [
      { key: "title", label: "Invoice Title", placeholder: "e.g. Graphic Design Services" },
      { key: "invoiceNo", label: "Invoice Number", placeholder: "INV-001" },
      { key: "clientName", label: "Client Name / Billed To", placeholder: "Acme Corp" },
      { key: "amount", label: "Total Amount Due", placeholder: "$1,500.00" },
      { key: "description", label: "Services Rendered & Details", placeholder: "Logo design, branding package, style guides...", multiline: true },
      { key: "dueDate", label: "Payment Due Date", placeholder: "Within 15 days" },
    ],
  },
  {
    id: "quotation",
    title: "Professional Quotation",
    description: "Send an accurate cost estimate to win the deal.",
    icon: "dollar-sign",
    color: "#16A34A",
    bg: "#DCFCE7",
    category: "Business",
    hasAmount: true,
    fields: [
      { key: "title", label: "Quotation Title", placeholder: "e.g. Website Development" },
      { key: "clientName", label: "Recipient / Client Name", placeholder: "Target Client Name" },
      { key: "amount", label: "Estimated Project Cost", placeholder: "$3,200.00" },
      { key: "description", label: "Scope of Work & Deliverables", placeholder: "Detailed tasks to be performed, deliverables...", multiline: true },
      { key: "validity", label: "Quote Validity", placeholder: "Valid until March 30, 2026" },
    ],
  },
  {
    id: "proposal",
    title: "Business Proposal",
    description: "Pitch your ideas and services to prospects.",
    icon: "briefcase",
    color: "#9333EA",
    bg: "#F3E8FF",
    category: "Business",
    hasAmount: true,
    fields: [
      { key: "title", label: "Proposal Title", placeholder: "Mobile App Pitch" },
      { key: "clientName", label: "Prospective Client Name", placeholder: "Acme Corp / Contact Person" },
      { key: "amount", label: "Proposed Project Budget", placeholder: "$10,000.00" },
      { key: "description", label: "Executive Summary & Solution", placeholder: "How we will solve the problem and add value...", multiline: true },
      { key: "timeline", label: "Project Timeline", placeholder: "4-6 weeks" },
    ],
  },
  {
    id: "purchaseorder",
    title: "Purchase Order",
    description: "Formally order goods or services from a vendor.",
    icon: "shopping-cart",
    color: "#0891B2",
    bg: "#CFFAFE",
    category: "Business",
    hasAmount: true,
    fields: [
      { key: "title", label: "Purchase Order Title", placeholder: "Office Equipment Order" },
      { key: "invoiceNo", label: "Purchase Order Number", placeholder: "PO-001" },
      { key: "clientName", label: "Vendor / Supplier Name", placeholder: "Supplier Name" },
      { key: "amount", label: "Total Order Value", placeholder: "$2,400.00" },
      { key: "description", label: "Itemized List & Quantities", placeholder: "10x Monitors, 5x Keyboards...", multiline: true },
      { key: "deliveryDate", label: "Expected Delivery Date", placeholder: "April 10, 2026" },
    ],
  },

  // ---------------- FINANCE ----------------
  {
    id: "receipt",
    title: "Payment Receipt",
    description: "Acknowledge a payment you've received.",
    icon: "credit-card",
    color: "#059669",
    bg: "#D1FAE5",
    category: "Finance",
    hasAmount: true,
    fields: [
      { key: "title", label: "Receipt Title / For", placeholder: "Consulting Services" },
      { key: "invoiceNo", label: "Receipt Number", placeholder: "RCPT-001" },
      { key: "clientName", label: "Received From (Payer Name)", placeholder: "Payer Name / Company" },
      { key: "amount", label: "Amount Received", placeholder: "$500.00" },
      { key: "paymentMethod", label: "Payment Method", placeholder: "UPI / Cash / Bank Transfer" },
      { key: "description", label: "Transaction Notes", placeholder: "Payment for March invoice...", multiline: true },
    ],
  },
  {
    id: "payslip",
    title: "Salary Slip",
    description: "Generate a clean payslip for an employee.",
    icon: "file-plus",
    color: "#CA8A04",
    bg: "#FEF9C3",
    category: "Finance",
    hasAmount: true,
    fields: [
      { key: "title", label: "Employee Full Name", placeholder: "Jane Doe" },
      { key: "clientName", label: "Job Title / Designation", placeholder: "Senior Software Engineer" },
      { key: "amount", label: "Net Pay (Take-Home)", placeholder: "$4,200.00" },
      { key: "period", label: "Pay Period", placeholder: "March 2026" },
      { key: "earnings", label: "Earnings Breakdown", placeholder: "Basic: 3000\nHRA: 1000\nBonus: 500", multiline: true },
      { key: "deductions", label: "Deductions Breakdown", placeholder: "Tax: 250\nPF: 50", multiline: true },
    ],
  },

  // ---------------- LEGAL ----------------
  {
    id: "contract",
    title: "Service Agreement",
    description: "A simple contract setting terms & conditions.",
    icon: "check-square",
    color: "#EA580C",
    bg: "#FFEDD5",
    category: "Legal",
    hasAmount: true,
    fields: [
      { key: "title", label: "Contract / Agreement Title", placeholder: "Freelance Service Agreement" },
      { key: "clientName", label: "Second Party / Client Name", placeholder: "Client Legal Name" },
      { key: "amount", label: "Total Agreement Value", placeholder: "$5,000.00" },
      { key: "description", label: "Terms & Conditions / Scope", placeholder: "1. Services... 2. Payment Terms...", multiline: true },
    ],
  },
  {
    id: "nda",
    title: "Non-Disclosure (NDA)",
    description: "Protect confidential information between parties.",
    icon: "shield",
    color: "#DC2626",
    bg: "#FEE2E2",
    category: "Legal",
    hasAmount: false,
    fields: [
      { key: "title", label: "NDA Agreement Title", placeholder: "Mutual Non-Disclosure Agreement" },
      { key: "clientName", label: "Disclosing / Receiving Party", placeholder: "Counterparty Legal Name" },
      { key: "effectiveDate", label: "Agreement Effective Date", placeholder: "April 1, 2026" },
      { key: "duration", label: "Confidentiality Term", placeholder: "2 years" },
      { key: "description", label: "Nondisclosure Terms & Obligations", placeholder: "Definition of confidential information, obligations, and exceptions...", multiline: true },
    ],
  },

  // ---------------- CAREER ----------------
  {
    id: "resume",
    title: "Professional Resume",
    description: "Generate a beautiful PDF resume from your details.",
    icon: "user",
    color: "#0284C7",
    bg: "#E0F2FE",
    category: "Career",
    hasAmount: false,
    fields: [
      { key: "title", label: "Full Name", placeholder: "Jane Doe" },
      { key: "clientName", label: "Professional Title / Header", placeholder: "Senior Mobile Engineer" },
      { key: "contact", label: "Contact Information", placeholder: "jane.doe@email.com | +1 234 567 890" },
      { key: "links", label: "Professional Links (GitHub, Portfolio, LinkedIn)", placeholder: "linkedin.com/in/janedoe" },
      { key: "description", label: "Professional Profile Summary", placeholder: "Experienced engineer with 5 years of expertise in building...", multiline: true },
      { key: "experience", label: "Work Experience History", placeholder: "Company A (2020 - Present)\n- Led mobile team...", multiline: true },
      { key: "education", label: "Education Background", placeholder: "B.S. Computer Science, University X", multiline: true },
      { key: "skills", label: "Key Skills & Core Competencies", placeholder: "React Native, TypeScript, Node.js, UI/UX", multiline: true },
      { key: "personalDetails", label: "Additional Personal Details", placeholder: "Languages, Hobbies, Date of Birth, etc.", multiline: true },
    ],
  },
  {
    id: "coverletter",
    title: "Cover Letter",
    description: "Introduce yourself and land the interview.",
    icon: "edit-3",
    color: "#7C3AED",
    bg: "#EDE9FE",
    category: "Career",
    hasAmount: false,
    fields: [
      { key: "title", label: "Sender Full Name", placeholder: "Jane Doe" },
      { key: "clientName", label: "Recipient (Hiring Manager / Company)", placeholder: "Acme Corp — Hiring Team" },
      { key: "contact", label: "Sender Contact Information", placeholder: "jane.doe@email.com | +1 234 567 890" },
      { key: "description", label: "Cover Letter Content", placeholder: "Dear Hiring Manager, I am excited to apply for...", multiline: true },
    ],
  },

  // ---------------- PERSONAL ----------------
  {
    id: "letter",
    title: "Formal Letter",
    description: "Write a clean, formal letter for any purpose.",
    icon: "mail",
    color: "#DB2777",
    bg: "#FCE7F3",
    category: "Personal",
    hasAmount: false,
    fields: [
      { key: "title", label: "Letter Subject Line", placeholder: "Request for Leave" },
      { key: "clientName", label: "Recipient Details / Designation", placeholder: "The Manager, Acme Corp" },
      { key: "description", label: "Letter Content", placeholder: "Respected Sir/Madam, I am writing to...", multiline: true },
      { key: "closing", label: "Sign-Off & Signature", placeholder: "Sincerely, Jane Doe" },
    ],
  },
];

export const getTemplate = (id?: string): TemplateDef | undefined =>
  TEMPLATES.find((t) => t.id === id);

/** Icon used in lists/history when a template id is unknown. */
export const FALLBACK_TEMPLATE_ICON: FeatherIcon = "file";
