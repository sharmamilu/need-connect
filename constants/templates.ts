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
    id: "salary_slip",
    title: "Official Salary Slip / Payslip",
    description: "Generate corporate monthly salary slips with earnings, deductions, and net pay breakdown.",
    category: "Billing & Invoicing",
    icon: "file-text",
    color: "#0D9488",
    bg: "#CCFBF1",
    hasAmount: true,
    fields: [
      { key: "companyName", label: "Company / Employer Name", placeholder: "e.g. Acme Technologies Inc." },
      { key: "companyAddress", label: "Company Address & Location", placeholder: "e.g. 100 Innovation Blvd, Suite 400, New York, NY 10001" },
      { key: "title", label: "Salary Slip Title", placeholder: "e.g. Payslip for October 2026" },
      { key: "employeeName", label: "Employee Full Name", placeholder: "e.g. Johnathan Miller" },
      { key: "employeeId", label: "Employee ID / Staff Code", placeholder: "e.g. EMP-10482" },
      { key: "designation", label: "Designation / Role", placeholder: "e.g. Senior Software Engineer" },
      { key: "department", label: "Department", placeholder: "e.g. Engineering & Product" },
      { key: "payPeriod", label: "Pay Period / Month", placeholder: "e.g. October 2026" },
      { key: "paymentDate", label: "Pay / Disbursement Date", placeholder: "e.g. October 31, 2026" },
      { key: "workingDays", label: "Total Working Days / Paid Days", placeholder: "e.g. 30 / 30" },
      { key: "bankAccount", label: "Bank Name & Account No / IFSC", placeholder: "e.g. Chase Bank •••• 4589" },
      { key: "panOrTaxId", label: "PAN / Tax ID / SSN", placeholder: "e.g. ABCDE1234F" },
      { key: "basicSalary", label: "Basic Salary ($)", placeholder: "e.g. 3,500.00", keyboardType: "numeric" },
      { key: "hra", label: "House Rent Allowance (HRA) ($)", placeholder: "e.g. 1,400.00", keyboardType: "numeric" },
      { key: "specialAllowance", label: "Special / Transport Allowance ($)", placeholder: "e.g. 600.00", keyboardType: "numeric" },
      { key: "bonus", label: "Incentive / Bonus ($)", placeholder: "e.g. 500.00", keyboardType: "numeric" },
      { key: "pfDeduction", label: "Provident Fund (PF) / 401(k) ($)", placeholder: "e.g. 420.00", keyboardType: "numeric" },
      { key: "taxDeduction", label: "Tax Deductions (TDS / Income Tax) ($)", placeholder: "e.g. 350.00", keyboardType: "numeric" },
      { key: "otherDeduction", label: "Other Deductions / Medical ($)", placeholder: "e.g. 80.00", keyboardType: "numeric" },
      { key: "notes", label: "HR / Payroll Notes", placeholder: "e.g. This is a computer-generated salary slip and requires no physical signature.", multiline: true },
    ],
  },
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
    title: "Harvard Standard Executive Resume",
    description: "Build an ATS-optimized, Harvard-standard academic & professional CV.",
    category: "Career & Hiring",
    icon: "user-check",
    color: "#7C3AED",
    bg: "#F5F3FF",
    hasAmount: false,
    fields: [
      { key: "fullName", label: "Full Name", placeholder: "e.g. Alexander J. Morgan" },
      { key: "title", label: "Professional Headline / Target Role", placeholder: "e.g. Senior Software Architect | Distributed Systems" },
      { key: "location", label: "City & State / Country", placeholder: "e.g. Cambridge, MA" },
      { key: "email", label: "Email Address", placeholder: "e.g. alexander.morgan@alumni.harvard.edu", keyboardType: "email-address" },
      { key: "phone", label: "Phone Number", placeholder: "e.g. +1 (617) 555-0198", keyboardType: "phone-pad" },
      { key: "linkedin", label: "LinkedIn / GitHub / Portfolio URL", placeholder: "e.g. linkedin.com/in/alexandermorgan | github.com/alexmorgan" },
      { key: "summary", label: "Professional Summary / Executive Profile", placeholder: "e.g. Results-oriented Systems Architect with 7+ years of experience leading high-scale cloud platforms...", multiline: true },
      { key: "education", label: "Education & Academic Honors", placeholder: "e.g. HARVARD UNIVERSITY | Cambridge, MA\nBachelor of Science in Computer Science & Applied Mathematics, GPA: 3.92 / 4.0\nHonors: Magna Cum Laude, Harvard College Scholar\nRelevant Coursework: Distributed Systems, Compilers, Machine Learning", multiline: true },
      { key: "experience", label: "Professional Experience", placeholder: "e.g. GOOGLE | Senior Software Engineer | Mountain View, CA (Jun 2022 – Present)\n• Spearheaded real-time telemetry pipeline processing 25M+ events/sec, reducing latency by 40%\n• Architected zero-downtime microservices migration across 14 global data centers\n• Mentored 6 software engineers and led sprint architecture reviews\n\nMETA | Software Engineer | Menlo Park, CA (Aug 2019 – May 2022)\n• Engineered full-stack developer tools leveraging React, GraphQL, and Python backend services\n• Optimized database query execution paths, saving $1.2M annually in compute infrastructure", multiline: true },
      { key: "projects", label: "Projects & Technical Research", placeholder: "e.g. DISTRIBUTED CONSENSUS ENGINE | Lead Developer (2023)\n• Built Raft-based distributed key-value store in Go with fault tolerance and linearizable reads\n• Published open-source library with 2,500+ GitHub stars", multiline: true },
      { key: "leadership", label: "Leadership & Campus Activities", placeholder: "e.g. HARVARD COMPUTER SOCIETY | Vice President (2021 – 2022)\n• Directed annual hackathon attracting 900+ collegiate participants and $60,000+ corporate sponsorships", multiline: true },
      { key: "skills", label: "Technical & Core Skills", placeholder: "e.g. Languages: Python, TypeScript, Go, C++, SQL, Java, Rust\nFrameworks & Libs: React Native, React.js, Node.js, Next.js, FastAPI, GraphQL\nCloud & DevOps: AWS (EC2, S3, RDS, Lambda), Docker, Kubernetes, CI/CD pipelines, Terraform", multiline: true },
      { key: "certifications", label: "Certifications & Awards", placeholder: "e.g. AWS Certified Solutions Architect – Professional (2024)\n1st Place, National Collegiate Hackathon (2022)", multiline: true },
      { key: "languagesInterests", label: "Languages & Interests", placeholder: "e.g. Languages: English (Native), Spanish (Fluent), French (Conversational)\nInterests: Marathon Running, Classical Piano, Open-Source Development", multiline: true },
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
