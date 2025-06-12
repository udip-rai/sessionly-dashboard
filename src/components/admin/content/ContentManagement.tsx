import { useState } from "react";
import { FiSave, FiEdit2, FiX } from "react-icons/fi";
import { TabFaq } from "./TabFaq";
import { TabWebsiteStats } from "./TabWebsiteStats";

interface ContentSection {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
  updatedBy: string;
  type: "hero" | "features" | "testimonials" | "about" | "faq";
}

const mockContent: ContentSection[] = [
  {
    id: "hero",
    title: "Hero Section",
    content: `{
      "heading": "Connect With Expert Mentors Through Premium Video Sessions",
      "subheading": "Access top industry experts, schedule personalized consultations, and accelerate your professional growth",
      "ctaText": "Get Started",
      "stats": [
        { "label": "Verified Experts", "value": "500+" },
        { "label": "Sessions Completed", "value": "10k+" },
        { "label": "Satisfaction Rate", "value": "98%" }
      ]
    }`,
    lastUpdated: "2025-05-09T14:30:00",
    updatedBy: "Milan Mahat",
    type: "hero",
  },
  {
    id: "features",
    title: "Features Section",
    content: `{
      "heading": "Why Choose Sessionly",
      "features": [
        {
          "title": "Expert Verification",
          "description": "All our experts go through a rigorous verification process"
        },
        {
          "title": "Flexible Scheduling",
          "description": "Book sessions that fit your schedule across all timezones"
        },
        {
          "title": "Secure Payments",
          "description": "Your transactions are protected with bank-level security"
        }
      ]
    }`,
    lastUpdated: "2025-05-08T10:15:00",
    updatedBy: "Milan Mahat",
    type: "features",
  },
];

export function ContentManagement() {
  const [sections, setSections] = useState<ContentSection[]>(mockContent);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"content" | "faq" | "stats">(
    "content",
  );

  const handleEdit = (section: ContentSection) => {
    setEditingSection(section.id);
    setEditedContent(section.content);
  };

  const handleSave = (sectionId: string) => {
    try {
      // Validate JSON
      JSON.parse(editedContent);

      setSections(
        sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                content: editedContent,
                lastUpdated: new Date().toISOString(),
                updatedBy: "Milan Mahat", // This would come from auth context in real app
              }
            : section,
        ),
      );
      setEditingSection(null);
    } catch (e) {
      alert("Invalid JSON format");
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditedContent("");
  };

  const renderPreview = (content: string, type: ContentSection["type"]) => {
    try {
      const data = JSON.parse(content);

      switch (type) {
        case "hero":
          return (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h1 className="text-2xl font-bold mb-2">{data.heading}</h1>
              <p className="text-gray-600 mb-4">{data.subheading}</p>
              <div className="flex gap-4">
                {data.stats.map((stat: any, index: number) => (
                  <div key={index} className="bg-white p-4 rounded-lg">
                    <p className="font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          );

        case "features":
          return (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">{data.heading}</h2>
              <div className="grid grid-cols-3 gap-4">
                {data.features.map((feature: any, index: number) => (
                  <div key={index} className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );

        default:
          return <div>Preview not available for this section type</div>;
      }
    } catch (e) {
      return <div className="text-red-600">Invalid JSON format</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Content Management Hub
        </h1>
        <p className="text-gray-600 mt-2">
          Take full control of your website's content and user experience
        </p>
        <div className="mt-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-blue-500 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V5a1 1 0 011-1h3a1 1 0 001-1V2a2 2 0 012-2z"
                />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-900 mb-2">
                🚀 Three powerful content management tools at your fingertips:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center mb-2">
                    <span className="text-blue-600 font-medium">
                      📝 Website Content
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs">
                    Real-time editing of hero sections, features, and
                    testimonials with instant preview capabilities
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-green-100">
                  <div className="flex items-center mb-2">
                    <span className="text-green-600 font-medium">
                      ❓ FAQ Hub
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs">
                    Build a comprehensive knowledge base to reduce support
                    tickets and improve user satisfaction
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-purple-100">
                  <div className="flex items-center mb-2">
                    <span className="text-purple-600 font-medium">
                      📊 Impact Metrics
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs">
                    Showcase your platform's growth and success with compelling
                    statistics that build trust
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("content")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "content"
                ? "border-navy text-navy"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Website Content
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "faq"
                ? "border-navy text-navy"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            FAQ Management
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "stats"
                ? "border-navy text-navy"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Website Stats
          </button>
        </nav>
      </div>

      {activeTab === "content" ? (
        <>
          {/* Content Section Description */}
          <div className="mb-6 p-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  🎨 Website Content Studio
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    Live Preview
                  </span>
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Shape your website's first impression with powerful content
                  editing tools. Craft compelling hero sections, highlight key
                  features, and showcase testimonials that convert visitors into
                  users.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    ✏️ Real-time Editing
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    👁️ Instant Preview
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    📱 Responsive Design
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Management Section */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPreviewMode(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  !previewMode
                    ? "bg-navy text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Edit Mode
              </button>
              <button
                onClick={() => setPreviewMode(true)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  previewMode
                    ? "bg-navy text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Preview Mode
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* ...existing content section code... */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        {section.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Last updated by {section.updatedBy} on{" "}
                        {new Date(section.lastUpdated).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                    {!previewMode && (
                      <div className="flex items-center gap-2">
                        {editingSection === section.id ? (
                          <>
                            <button
                              onClick={() => handleSave(section.id)}
                              className="flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                            >
                              <FiSave className="w-4 h-4 mr-2" />
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200"
                            >
                              <FiX className="w-4 h-4 mr-2" />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEdit(section)}
                            className="flex items-center px-3 py-2 text-sm text-navy hover:text-navy/80"
                          >
                            <FiEdit2 className="w-4 h-4 mr-2" />
                            Edit Content
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {previewMode ? (
                    renderPreview(section.content, section.type)
                  ) : editingSection === section.id ? (
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full h-64 font-mono text-sm p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                    />
                  ) : (
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
                      {JSON.stringify(JSON.parse(section.content), null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : activeTab === "faq" ? (
        <>
          {/* FAQ Section Description */}
          <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  💡 Smart FAQ Management
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                    Support Saver
                  </span>
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Build a comprehensive self-service knowledge base that
                  empowers users to find answers instantly. Reduce support
                  tickets by up to 70% while improving user satisfaction and
                  onboarding experience.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    🚀 Quick Creation
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    📋 Easy Organization
                  </span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                    📉 Reduces Support Load
                  </span>
                </div>
              </div>
            </div>
          </div>
          <TabFaq />
        </>
      ) : (
        <>
          {/* Website Stats Section Description */}
          <div className="mb-6 p-5 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  📈 Impact Analytics Dashboard
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                    Trust Builder
                  </span>
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Showcase your platform's success story with compelling
                  statistics that build instant credibility. Display user
                  growth, session completions, and satisfaction rates to convert
                  more visitors into active users.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                    🎯 Conversion Focused
                  </span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">
                    🏆 Social Proof
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                    📊 Real-time Updates
                  </span>
                </div>
              </div>
            </div>
          </div>
          <TabWebsiteStats />
        </>
      )}
    </div>
  );
}
