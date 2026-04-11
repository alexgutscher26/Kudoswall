export interface CollectionCustomizerProps {
  project: any;
  workspace: any;
  isPro?: boolean;
}

export type CollectionSettings = {
  thankYouMessage?: string;
  workspaceName?: string;
  logoUrl?: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: "sans" | "serif" | "mono";
  form: {
    fields: {
      fullName: { enabled: boolean; required: boolean; label: string; placeholder: string };
      email: { enabled: boolean; required: boolean; label: string; placeholder: string };
      company: { enabled: boolean; required: boolean; label: string; placeholder: string };
      jobTitle: { enabled: boolean; required: boolean; label: string; placeholder: string };
      linkedin: { enabled: boolean; required: boolean; label: string; placeholder: string };
    };
    starRating: { enabled: boolean };
    minCharCount: number;
    additionalContext?: {
      enabled: boolean;
      label: string;
      options: string[];
    };
  };
  pageContent: {
    headline: string;
    subheading: string;
    showTestimonialCount: boolean;
    thankYou: {
      headline: string;
      body: string;
      cta: { enabled: boolean; text: string; url: string };
    };
  };
  video: {
    enabled: boolean;
    prompt: string;
    maxLength: number;
  };
  customDomain?: string;
  passwordProtection?: string;
  expiryDate?: string;
  redirectUrl?: string;
};

export const DEFAULT_SETTINGS: CollectionSettings = {
  accentColor: "#e8527a",
  backgroundColor: "#fafafa",
  fontFamily: "sans",
  form: {
    fields: {
      fullName: { enabled: true, required: true, label: "Full Name", placeholder: "Jane Doe" },
      email: { enabled: true, required: false, label: "Email", placeholder: "jane@example.com" },
      company: { enabled: true, required: false, label: "Company", placeholder: "Acme Inc." },
      jobTitle: { enabled: true, required: false, label: "Job Title", placeholder: "CEO" },
      linkedin: {
        enabled: false,
        required: false,
        label: "LinkedIn Profile",
        placeholder: "https://linkedin.com/in/jane",
      },
    },
    starRating: { enabled: true },
    minCharCount: 50,
  },
  pageContent: {
    headline: "Share your experience",
    subheading: "We value your feedback and want to know how we did.",
    showTestimonialCount: false,
    thankYou: {
      headline: "You're awesome!",
      body: "Your feedback has been sent. It helps us more than you know.",
      cta: { enabled: false, text: "", url: "" },
    },
  },
  video: {
    enabled: false,
    prompt: "Tell us about your experience",
    maxLength: 30,
  },
};
