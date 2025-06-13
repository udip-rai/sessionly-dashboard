import { useState } from "react";
import { TabFaq } from "./TabFaq";
import { TabWebsiteStats } from "./TabWebsiteStats";
import { TabStaticPages } from "./TabStaticPages";
import { TabTeam } from "./TabTeam";

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState<
    "faq" | "stats" | "pages" | "team"
  >("faq");

  return (
    <div className="max-w-6xl mx-auto">
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
          <button
            onClick={() => setActiveTab("team")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "team"
                ? "border-navy text-navy"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Team Members
          </button>
        </nav>
      </div>

      {activeTab === "faq" ? (
        <TabFaq />
      ) : activeTab === "stats" ? (
        <TabWebsiteStats />
      ) : activeTab === "pages" ? (
        <TabStaticPages />
      ) : (
        <TabTeam />
      )}
    </div>
  );
}
