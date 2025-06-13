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
  title: "Amplified",
  description:
    "Join our unified platform that combines structured mentorship, instant access to 3,000+ vetted experts, and AI-driven networking—all in one place.",
  everything_reasons: {
    title: "Everything You Need to Connect",
    description:
      "Our platform provides all the tools you need to schedule and manage productive sessions with experts.",
    children: [
      {
        title: "Expert Discovery",
        description:
          "Browse through 3,000+ verified experts across 50+ industries and find the perfect match for your goals.",
      },
      {
        title: "Smart Scheduling",
        description:
          "Flexible booking system that adapts to both your schedule and expert availability worldwide.",
      },
      {
        title: "Session Management",
        description:
          "Complete session lifecycle management from booking to follow-up with integrated tools.",
      },
      {
        title: "Progress Tracking",
        description:
          "Monitor your growth journey with detailed analytics and milestone tracking.",
      },
    ],
  },
  transform_reasons: {
    title: "Your Success Journey Starts Here",
    children: [
      "Accelerate your career with personalized mentorship",
      "Connect with industry leaders and decision makers",
      "Develop skills through hands-on expert guidance",
      "Build a powerful professional network globally",
      "Access exclusive insights and opportunities",
    ],
  },
  advantages_reasons: {
    title: "Why Choose Sessionly?",
    description: "The Complete Platform for Professional Growth",
    children: [
      {
        title: "AI-Powered Matching",
        description:
          "Our advanced algorithm ensures 90% match accuracy by analyzing your goals, experience, and preferences.",
      },
      {
        title: "Global Expert Network",
        description:
          "Connect with verified professionals from Fortune 500 companies and leading institutions worldwide.",
      },
      {
        title: "Flexible Engagement",
        description:
          "Choose from one-time consultations, ongoing mentorship, or project-based collaborations.",
      },
      {
        title: "Proven Results",
        description:
          "95% of users report significant career progress within 3 months of joining our platform.",
      },
    ],
  },
  powered_by_ai_reasons: {
    title: "AI-Powered Expert Matching",
    description:
      "Our advanced AI technology ensures you connect with the most relevant experts for your specific needs and goals.",
    children: [
      {
        title: "Smart Recommendations",
        description:
          "Get personalized expert suggestions based on your career goals and current challenges.",
      },
      {
        title: "Compatibility Analysis",
        description:
          "Advanced matching considers communication styles, availability, and expertise overlap.",
      },
      {
        title: "Success Prediction",
        description:
          "AI predicts collaboration success rates to optimize your mentorship outcomes.",
      },
    ],
  },
  testimonials: {
    title: "What Our Users Say",
    description:
      "Real experiences from professionals who've transformed their careers with Sessionly",
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
    },
  },
};
