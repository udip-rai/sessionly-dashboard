import { useState } from "react";
import { TabFaq } from "./TabFaq";
import { TabWebsiteStats } from "./TabWebsiteStats";
import { TabStaticPages } from "./TabStaticPages";
import { TabTeam } from "./TabTeam";

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState<
    "faq" | "stats" | "pages" | "team"
  >("faq");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (newTab: "faq" | "stats" | "pages" | "team") => {
    if (newTab === activeTab) return;

    setIsTransitioning(true);
    // Small delay to allow fade-out animation, then faster fade-in
    setTimeout(() => {
      setActiveTab(newTab);
      // Quick fade-in after content changes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => handleTabChange("faq")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "faq"
                ? "border-navy text-navy"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            FAQ Management
          </button>
          <button
            onClick={() => handleTabChange("stats")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "stats"
                ? "border-navy text-navy"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Website Stats
          </button>
          <button
            onClick={() => handleTabChange("pages")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "pages"
                ? "border-navy text-navy"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Static Pages
          </button>
          <button
            onClick={() => handleTabChange("team")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "team"
                ? "border-navy text-navy"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Team Members
          </button>
        </nav>
      </div>

      {/* Tab Content with Smooth Transitions */}
      <div
        className={`min-h-[500px] transition-opacity duration-300 ease-in-out ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {isTransitioning ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : activeTab === "faq" ? (
          <TabFaq />
        ) : activeTab === "stats" ? (
          <TabWebsiteStats />
        ) : activeTab === "pages" ? (
          <TabStaticPages />
        ) : (
          <TabTeam />
        )}
      </div>
    </div>
  );
}
