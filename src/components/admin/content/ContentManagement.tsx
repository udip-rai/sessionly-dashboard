import { useState } from "react";
import { TabFaq } from "./TabFaq";
import { TabWebsiteStats } from "./TabWebsiteStats";
import { TabStaticPages } from "./TabStaticPages";

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState<"faq" | "stats" | "pages">("faq");

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
                <div className="bg-white p-3 rounded-lg border border-orange-100">
                  <div className="flex items-center mb-2">
                    <span className="text-orange-600 font-medium">
                      📄 Static Pages
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs">
                    Create and manage structured pages like Home and About with
                    custom templates
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
          <button
            onClick={() => setActiveTab("pages")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "pages"
                ? "border-navy text-navy"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Static Pages
          </button>
        </nav>
      </div>

      {activeTab === "faq" ? (
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
      ) : activeTab === "stats" ? (
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
      ) : (
        <>
          {/* Static Pages Section Description */}
          <div className="mb-6 p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  📄 Static Pages Studio
                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                    Template Driven
                  </span>
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Create and manage structured pages like Home and About with
                  custom templates designed for maximum impact. Each page type
                  has optimized layouts and sections tailored for specific
                  content needs.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    🏗️ Template-Based
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    📱 Responsive Design
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    ⚡ Quick Setup
                  </span>
                </div>
              </div>
            </div>
          </div>
          <TabStaticPages />
        </>
      )}
    </div>
  );
}
