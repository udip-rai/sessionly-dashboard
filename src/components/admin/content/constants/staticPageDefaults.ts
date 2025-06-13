import {
  AboutPageContent,
  HomePageContent,
  TeamPageContent,
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

// Default Team Page Content
export const DEFAULT_TEAM_PAGE: TeamPageContent = {
  page: {
    title: "Meet Our",
    highlighted: "Team",
    subtitle:
      "We're a diverse group of passionate individuals dedicated to revolutionizing online learning and mentorship. Together, we're building the future of professional growth.",
    description:
      "Our team combines expertise in technology, education, and business to create an innovative platform that connects mentors and learners worldwide. With decades of combined experience, we're committed to transforming how knowledge is shared and careers are built.",
  },
  stats: [
    {
      value: "50K+",
      label: "Active Users",
      description:
        "Growing community of professionals achieving their goals through targeted mentorship",
    },
    {
      value: "95%",
      label: "Success Rate",
      description:
        "Users reporting significant progress towards their career objectives within 3 months",
    },
    {
      value: "3000+",
      label: "Verified Experts",
      description:
        "Elite professionals from Fortune 500 companies and leading institutions",
    },
    {
      value: "90%",
      label: "Match Rate",
      description:
        "AI-powered matching accuracy ensuring optimal mentor-mentee partnerships",
    },
  ],
  values: [
    {
      title: "Innovation First",
      description:
        "We constantly push boundaries in online learning and mentorship, embracing cutting-edge technology and AI to create transformative experiences. Our innovative approach ensures we stay ahead of industry trends and deliver exceptional value.",
    },
    {
      title: "User-Centric",
      description:
        "Every feature, decision, and improvement starts with our users' needs. We actively listen to feedback, study user behavior, and iterate rapidly to create an intuitive and empowering platform that truly serves our community.",
    },
    {
      title: "Excellence",
      description:
        "Quality is at the heart of everything we do. From our expert vetting process to platform reliability and customer support, we maintain the highest standards to ensure exceptional experiences for both mentors and mentees.",
    },
    {
      title: "Continuous Learning",
      description:
        "Growth is in our DNA. We foster a culture of perpetual learning and knowledge sharing, encouraging both our team and users to expand their horizons, embrace challenges, and evolve together in this dynamic digital landscape.",
    },
  ],
  sections: {
    team: {
      title: "Leadership",
      highlighted: "Team",
      subtitle: "Meet the people driving our vision forward",
    },
    values: {
      title: "Our",
      highlighted: "Values",
      subtitle: "The principles that guide everything we do",
    },
    join: {
      title: "Join Our",
      highlighted: "Journey",
      description:
        "We're always looking for talented individuals who are passionate about revolutionizing online learning and mentorship.",
      buttonText: "View Open Positions",
      buttonLink: "/careers",
    },
  },
};

export const EMPTY_TEAM_PAGE: TeamPageContent = {
  page: {
    title: "",
    highlighted: "",
    subtitle: "",
    description: "",
  },
  stats: [
    { value: "", label: "", description: "" },
    { value: "", label: "", description: "" },
    { value: "", label: "", description: "" },
    { value: "", label: "", description: "" },
  ],
  values: [
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ],
  sections: {
    team: {
      title: "",
      highlighted: "",
      subtitle: "",
    },
    values: {
      title: "",
      highlighted: "",
      subtitle: "",
    },
    join: {
      title: "",
      highlighted: "",
      description: "",
      buttonText: "",
      buttonLink: "",
    },
  },
};
