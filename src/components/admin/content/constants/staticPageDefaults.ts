import {
  AboutPageContent,
  HomePageContent,
} from "../../../../api/services/admin.service";

// Default About Page Content
export const DEFAULT_ABOUT_PAGE: AboutPageContent = {
  hero: {
    title: "About",
    descriptors: [
      "Structured Mentorship",
      "On-demand Expertise",
      "Curated Introductions",
      "Community Collaboration",
      "AI-Driven Growth",
    ],
    description: {
      intro:
        "Sessionly is a revolutionary all-in-one platform that tackles the fragmented and often exclusive nature of traditional mentorship and networking by introducing a personalized, scalable, and affordable approach to professional development.",
      stats:
        "With over 3,000 vetted experts spanning more than 50 industries, we provide instant access to knowledge and guidance that transforms careers and businesses.",
      aiMatch:
        "Our AI-driven networking achieves a 90% match accuracy, ensuring every connection counts and every interaction drives meaningful growth.",
    },
  },
  mission: {
    title: "Our Mission",
    description:
      "Our mission is to break down the barriers between knowledge seekers and knowledge providers. We combine structured mentorship, expert consultations, and community collaboration into a unified system that makes professional growth accessible, efficient, and measurable. Whether you're seeking career advancement, skill development, or business growth, Sessionly provides the connections and tools you need to succeed in the modern professional world.",
  },
  features: {
    title: {
      why: "Why",
      choose: "Choose",
    },
    cards: [
      {
        title: "Comprehensive Solution",
        description:
          "Everything you need for growth, all in one place. Access structured mentorship, instant expertise, and AI-powered networking that delivers unmatched value at scale.",
      },
      {
        title: "Smart Matching",
        description:
          "Our AI technology achieves 90% match accuracy, ensuring you connect with the right experts and peers for your specific goals and industry needs.",
      },
      {
        title: "Market Opportunity",
        description:
          "Join the rapidly growing expert economy with 22% CAGR in on-demand talent platforms. We're positioned to transform how professionals connect and grow.",
      },
      {
        title: "",
        description: "",
      },
    ],
  },
  cta: {
    title: "Ready to Amplify Your Network?",
    description:
      "Join our movement toward smarter, more personalized, and scalable professional growth. Get early access to exclusive benefits and tools.",
    disclaimer: "No commitment. Cancel anytime.",
  },
};

// Default Home Page Content
export const DEFAULT_HOME_PAGE: HomePageContent = {
  title: "",
  description: "",
  everything_reasons: {
    title: "",
    description: "",
    children: [],
  },
  transform_reasons: {
    title: "",
    children: [],
  },
  advantages_reasons: {
    title: "",
    description: "",
    children: [],
  },
  powered_by_ai_reasons: {
    title: "",
    description: "",
    children: [],
  },
  testimonials: {
    title: "",
    description: "",
  },
};

// Empty form data for initialization
export const EMPTY_ABOUT_PAGE: AboutPageContent = {
  hero: {
    title: "",
    descriptors: ["", "", ""],
    description: {
      intro: "",
      stats: "",
      aiMatch: "",
    },
  },
  mission: {
    title: "",
    description: "",
  },
  features: {
    title: {
      why: "",
      choose: "",
    },
    cards: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
  },
  cta: {
    title: "",
    description: "",
    disclaimer: "",
  },
};

export const EMPTY_HOME_PAGE: HomePageContent = {
  title: "",
  description: "",
  everything_reasons: {
    title: "",
    description: "",
    children: [],
  },
  transform_reasons: {
    title: "",
    children: [],
  },
  advantages_reasons: {
    title: "",
    description: "",
    children: [],
  },
  powered_by_ai_reasons: {
    title: "",
    description: "",
    children: [],
  },
  testimonials: {
    title: "",
    description: "",
  },
};
