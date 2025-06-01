import React, { useState } from "react";
import { FiPlus, FiX, FiTag } from "react-icons/fi";
import { ProfileSectionProps } from "./_types";

export const AdvisoryTopics: React.FC<ProfileSectionProps> = ({
  formData,
  setFormData,
}) => {
  const [newTopic, setNewTopic] = useState("");

  const handleAddTopic = () => {
    if (newTopic.trim() && !formData.advisoryTopics.includes(newTopic.trim())) {
      setFormData((prev) => ({
        ...prev,
        advisoryTopics: [...prev.advisoryTopics, newTopic.trim()],
      }));
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      advisoryTopics: prev.advisoryTopics.filter(
        (topic) => topic !== topicToRemove,
      ),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTopic();
    }
  };

  // Suggested topics that experts commonly offer advice on
  const suggestedTopics = [
    "Career Planning",
    "Interview Preparation",
    "Resume Review",
    "Skill Development",
    "Industry Insights",
    "Mentorship",
    "Leadership",
    "Entrepreneurship",
    "Work-Life Balance",
    "Networking",
    "Job Search Strategy",
    "Performance Reviews",
    "Salary Negotiation",
    "Professional Development",
    "Technical Skills",
    "Soft Skills",
    "Project Management",
    "Team Building",
    "Communication Skills",
    "Personal Branding",
  ];

  const availableSuggestions = suggestedTopics.filter(
    (topic) => !formData.advisoryTopics.includes(topic),
  );

  return (
    <div className="space-y-6">
      {/* Current Advisory Topics */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <FiTag className="inline mr-2" />
          Your Advisory Topics
        </label>
        {formData.advisoryTopics.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.advisoryTopics.map((topic, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium border border-green-200 group hover:bg-green-200 transition-colors"
              >
                <span>{topic}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTopic(topic)}
                  className="text-green-600 hover:text-red-600 transition-colors"
                  title={`Remove ${topic}`}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm italic mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            No advisory topics added yet. Add topics you can provide advice on
            to help students find you.
          </div>
        )}
      </div>

      {/* Add New Topic */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add New Topic
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter an advisory topic (e.g., Career Planning)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            maxLength={50}
          />
          <button
            type="button"
            onClick={handleAddTopic}
            disabled={
              !newTopic.trim() ||
              formData.advisoryTopics.includes(newTopic.trim())
            }
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Add
          </button>
        </div>
        {newTopic.trim() &&
          formData.advisoryTopics.includes(newTopic.trim()) && (
            <p className="text-red-500 text-sm mt-1">
              This topic has already been added.
            </p>
          )}
      </div>

      {/* Suggested Topics */}
      {availableSuggestions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Suggested Topics
          </label>
          <p className="text-gray-600 text-sm mb-3">
            Click on any topic below to add it to your advisory areas:
          </p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.slice(0, 15).map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    advisoryTopics: [...prev.advisoryTopics, topic],
                  }));
                }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 hover:text-gray-900 transition-colors border border-gray-200 hover:border-gray-300"
              >
                {topic}
              </button>
            ))}
          </div>
          {availableSuggestions.length > 15 && (
            <p className="text-gray-500 text-xs mt-2">
              And {availableSuggestions.length - 15} more suggestions
              available...
            </p>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FiTag className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              About Advisory Topics
            </h4>
            <p className="text-blue-800 text-sm">
              Advisory topics help students understand what kind of guidance and
              advice you can provide. These can be career-related,
              industry-specific, or skill-based topics where you have experience
              to share.
            </p>
            <p className="text-blue-700 text-xs mt-2">
              Tip: Add 3-8 topics that best represent the areas where you can
              provide valuable advice and mentorship.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
