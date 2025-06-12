import { useCallback } from "react";
import { AboutPageContent } from "../../../../api/services/admin.service";

interface StaticAboutPageProps {
  content: AboutPageContent;
  onChange: (content: AboutPageContent) => void;
}

export const StaticAboutPage = ({
  content,
  onChange,
}: StaticAboutPageProps) => {
  // Helper functions to prevent unnecessary re-renders
  const getDefaultCards = useCallback(
    () => [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
    [],
  );

  const updateHero = useCallback(
    (field: string, value: any) => {
      onChange({
        ...content,
        hero: {
          ...content.hero,
          [field]: value,
        },
      });
    },
    [content, onChange],
  );

  const updateHeroBrandName = useCallback(
    (field: keyof typeof content.hero.brandName, value: string) => {
      onChange({
        ...content,
        hero: {
          ...content.hero,
          brandName: {
            ...content.hero?.brandName,
            [field]: value,
          },
        },
      });
    },
    [content, onChange],
  );

  const updateHeroDescription = useCallback(
    (field: keyof typeof content.hero.description, value: string) => {
      onChange({
        ...content,
        hero: {
          ...content.hero,
          description: {
            ...content.hero?.description,
            [field]: value,
          },
        },
      });
    },
    [content, onChange],
  );

  const updateHeroDescriptor = useCallback(
    (index: number, value: string) => {
      const newDescriptors = [...(content.hero?.descriptors || ["", "", ""])];
      newDescriptors[index] = value;
      updateHero("descriptors", newDescriptors);
    },
    [content.hero?.descriptors, updateHero],
  );

  const updateMission = useCallback(
    (field: keyof typeof content.mission, value: string) => {
      onChange({
        ...content,
        mission: {
          ...content.mission,
          [field]: value,
        },
      });
    },
    [content, onChange],
  );

  const updateFeaturesTitle = useCallback(
    (field: string, value: any) => {
      onChange({
        ...content,
        features: {
          ...content.features,
          title: {
            ...content.features?.title,
            [field]: value,
          },
        },
      });
    },
    [content, onChange],
  );

  const updateFeaturesBrandName = useCallback(
    (field: keyof typeof content.features.title.brandName, value: string) => {
      onChange({
        ...content,
        features: {
          ...content.features,
          title: {
            ...content.features?.title,
            brandName: {
              ...content.features?.title?.brandName,
              [field]: value,
            },
          },
        },
      });
    },
    [content, onChange],
  );

  const updateFeatureCard = useCallback(
    (index: number, field: string, value: string) => {
      // Ensure we always have 4 cards
      const defaultCards = getDefaultCards();
      const currentCards = content.features?.cards || defaultCards;
      const newCards = [...currentCards];

      // Make sure the array has at least the required index
      while (newCards.length <= index) {
        newCards.push({ title: "", description: "" });
      }

      newCards[index] = { ...newCards[index], [field]: value };

      onChange({
        ...content,
        features: {
          ...content.features,
          cards: newCards,
        },
      });
    },
    [content, onChange, getDefaultCards],
  );

  const updateCTA = useCallback(
    (field: keyof typeof content.cta, value: string) => {
      onChange({
        ...content,
        cta: {
          ...content.cta,
          [field]: value,
        },
      });
    },
    [content, onChange],
  );

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">Hero Section</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Title *
            </label>
            <input
              type="text"
              value={content.hero?.title || ""}
              onChange={(e) => updateHero("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              placeholder="Welcome to"
            />
          </div>
          {/* Brand Name Components */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name - "ses" *
              </label>
              <input
                type="text"
                value={content.hero?.brandName?.ses || ""}
                onChange={(e) => updateHeroBrandName("ses", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Ses"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name - "sion" *
              </label>
              <input
                type="text"
                value={content.hero?.brandName?.sion || ""}
                onChange={(e) => updateHeroBrandName("sion", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="sion"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name - "ly" *
              </label>
              <input
                type="text"
                value={content.hero?.brandName?.ly || ""}
                onChange={(e) => updateHeroBrandName("ly", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="ly"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Descriptors
            </label>
            <div className="space-y-2">
              {(content.hero?.descriptors || ["", "", ""]).map(
                (descriptor, index) => (
                  <input
                    key={`descriptor-${index}`}
                    type="text"
                    value={descriptor}
                    onChange={(e) =>
                      updateHeroDescriptor(index, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                    placeholder={`Descriptor ${
                      index + 1
                    } (e.g., "Innovative", "Reliable", "Trusted")`}
                  />
                ),
              )}
            </div>
          </div>
          {/* Hero Description Components */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description - Intro *
              </label>
              <textarea
                rows={3}
                value={content.hero?.description?.intro || ""}
                onChange={(e) => updateHeroDescription("intro", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Welcome to our platform. We are revolutionizing..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description - Stats *
              </label>
              <textarea
                rows={2}
                value={content.hero?.description?.stats || ""}
                onChange={(e) => updateHeroDescription("stats", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Join 10,000+ professionals who have..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description - AI Match *
              </label>
              <textarea
                rows={2}
                value={content.hero?.description?.aiMatch || ""}
                onChange={(e) =>
                  updateHeroDescription("aiMatch", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Our AI technology ensures perfect matches..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Mission Section
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission Title *
            </label>
            <input
              type="text"
              value={content.mission?.title || ""}
              onChange={(e) => updateMission("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              placeholder="Our Mission"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission Description *
            </label>
            <textarea
              rows={4}
              value={content.mission?.description || ""}
              onChange={(e) => updateMission("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              placeholder="Our mission is to..."
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Features Section
        </h4>
        <div className="space-y-4">
          {/* Features Title Components */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title - "Why" *
              </label>
              <input
                type="text"
                value={content.features?.title?.why || ""}
                onChange={(e) => updateFeaturesTitle("why", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Why"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title - "Choose" *
              </label>
              <input
                type="text"
                value={content.features?.title?.choose || ""}
                onChange={(e) => updateFeaturesTitle("choose", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Choose"
              />
            </div>
          </div>
          {/* Features Brand Name Components */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features Brand - "ses" *
              </label>
              <input
                type="text"
                value={content.features?.title?.brandName?.ses || ""}
                onChange={(e) => updateFeaturesBrandName("ses", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Ses"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features Brand - "sion" *
              </label>
              <input
                type="text"
                value={content.features?.title?.brandName?.sion || ""}
                onChange={(e) =>
                  updateFeaturesBrandName("sion", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="sion"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features Brand - "ly" *
              </label>
              <input
                type="text"
                value={content.features?.title?.brandName?.ly || ""}
                onChange={(e) => updateFeaturesBrandName("ly", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="ly"
              />
            </div>
          </div>
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
              // Ensure we always have 4 cards for rendering
              const defaultCards = getDefaultCards();
              const currentCards = content.features?.cards || defaultCards;

              // Make sure we have exactly 4 cards
              const renderCards = [...currentCards];
              while (renderCards.length < 4) {
                renderCards.push({ title: "", description: "" });
              }

              return renderCards.slice(0, 4).map((card, index) => (
                <div
                  key={`feature-card-${index}`}
                  className="border border-gray-100 rounded-md p-3"
                >
                  <h5 className="text-sm font-medium text-gray-600 mb-2">
                    Feature Card {index + 1}
                  </h5>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={card.title || ""}
                      onChange={(e) =>
                        updateFeatureCard(index, "title", e.target.value)
                      }
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                      placeholder="Feature title"
                    />
                    <textarea
                      rows={2}
                      value={card.description || ""}
                      onChange={(e) =>
                        updateFeatureCard(index, "description", e.target.value)
                      }
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                      placeholder="Feature description"
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Call-to-Action Section
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CTA Title *
            </label>
            <input
              type="text"
              value={content.cta?.title || ""}
              onChange={(e) => updateCTA("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              placeholder="Ready to Get Started?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CTA Description *
            </label>
            <textarea
              rows={3}
              value={content.cta?.description || ""}
              onChange={(e) => updateCTA("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              placeholder="Join thousands of satisfied customers..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disclaimer *
            </label>
            <textarea
              rows={2}
              value={content.cta?.disclaimer || ""}
              onChange={(e) => updateCTA("disclaimer", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              placeholder="Terms and conditions apply..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
