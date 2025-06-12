import { useState } from "react";
import { FiSave, FiEdit2, FiX } from "react-icons/fi";
import { TabFaq } from "./TabFaq";

// Simple toast function for now
const showToast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
};

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
  const [activeTab, setActiveTab] = useState<"content" | "faq">("content");

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
          Content Management
        </h1>
        <p className="text-gray-600 mt-2">
          Edit website content, manage FAQs, and preview changes
        </p>
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
        </nav>
      </div>

      {activeTab === "content" ? (
        <>
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
      ) : (
        <TabFaq />
      )}
    </div>
  );
}
