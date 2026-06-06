import { Portfolio } from "../types/portfolio";

export type PortfolioValidationResult = {
  valid: boolean;
  /** General error (first failing required field) — show as an alert. */
  message?: string;
  /** Inline error for the Experience section. */
  experienceError?: string;
};

const emailRegex = /^\S+@\S+\.\S+$/;

/**
 * Single source of truth for portfolio validation, shared by the create and
 * edit flows so they never diverge. Experience is optional, but any entry that
 * has been added must be filled out completely.
 */
export function validatePortfolio(p: Portfolio): PortfolioValidationResult {
  if (!p.name?.trim())
    return { valid: false, message: "Please enter your full name." };
  if (!p.location?.trim())
    return { valid: false, message: "Please enter your location." };
  if (!p.profession?.trim())
    return { valid: false, message: "Please enter your profession." };
  if (!p.bio?.trim())
    return { valid: false, message: "Please add a short professional bio." };
  if (!p.contact?.phone?.trim())
    return { valid: false, message: "Please provide a contact phone number." };
  if (p.email?.trim() && !emailRegex.test(p.email.trim()))
    return { valid: false, message: "Please enter a valid email address." };
  if (!p.services || p.services.length < 1)
    return { valid: false, message: "Add at least one service you offer." };
  if (!p.skills || p.skills.length < 1)
    return { valid: false, message: "Add at least one skill." };

  // Experience is optional — but a half-filled entry should be completed.
  if (p.experience && p.experience.length > 0) {
    const incomplete = p.experience.some(
      (exp: any) =>
        !exp.role?.trim() ||
        !exp.company?.trim() ||
        !exp.startDate?.trim() ||
        (!exp.currentlyWorking && !exp.endDate?.trim()),
    );
    if (incomplete) {
      return {
        valid: false,
        experienceError:
          "Complete each experience entry (role, company, dates) or remove it.",
      };
    }
  }

  return { valid: true };
}

/** The required fields used to compute the completion progress bar. */
export function getPortfolioCompletion(p: Portfolio): {
  completed: number;
  total: number;
  percent: number;
} {
  const checks = [
    !!p.name?.trim(),
    !!p.location?.trim(),
    !!p.profession?.trim(),
    !!p.bio?.trim(),
    !!p.contact?.phone?.trim(),
    (p.services?.length || 0) >= 1,
    (p.skills?.length || 0) >= 1,
  ];
  const completed = checks.filter(Boolean).length;
  const total = checks.length;
  return { completed, total, percent: Math.round((completed / total) * 100) };
}
