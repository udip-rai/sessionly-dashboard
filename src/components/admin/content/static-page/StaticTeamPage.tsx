import { useCallback } from "react";
import { TeamPageContent } from "../../../../api/services/admin.service";

interface StaticTeamPageProps {
  content: TeamPageContent;
  onChange: (content: TeamPageContent) => void;
}

export const StaticTeamPage = ({ content, onChange }: StaticTeamPageProps) => {
  const updatePage = useCallback(
    (field: keyof typeof content.page, value: string) => {
      onChange({
        ...content,
        page: {
          ...content.page,
          [field]: value,
        },
      });
    },
    [content, onChange],
  );

  const updateStat = useCallback(
    (index: number, field: string, value: string) => {
      const newStats = [...content.stats];
      newStats[index] = { ...newStats[index], [field]: value };
      onChange({
        ...content,
        stats: newStats,
      });
    },
    [content, onChange],
  );

  const updateValue = useCallback(
    (index: number, field: string, value: string) => {
      const newValues = [...content.values];
      newValues[index] = { ...newValues[index], [field]: value };
      onChange({
        ...content,
        values: newValues,
      });
    },
    [content, onChange],
  );

  const updateSection = useCallback(
    (section: keyof typeof content.sections, field: string, value: string) => {
      onChange({
        ...content,
        sections: {
          ...content.sections,
          [section]: {
            ...content.sections[section],
            [field]: value,
          },
        },
      });
    },
    [content, onChange],
  );

  return (
    <div className="space-y-6">
      {/* Page Header Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">Page Header</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={content.page?.title || ""}
                onChange={(e) => updatePage("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Meet Our"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highlighted Word *
              </label>
              <input
                type="text"
                value={content.page?.highlighted || ""}
                onChange={(e) => updatePage("highlighted", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Team"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle *
            </label>
            <textarea
              rows={2}
              value={content.page?.subtitle || ""}
              onChange={(e) => updatePage("subtitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              placeholder="A brief description of your team..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              rows={3}
              value={content.page?.description || ""}
              onChange={(e) => updatePage("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              placeholder="A detailed description of your team and mission..."
            />
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Team Statistics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.stats?.map((stat, index) => (
            <div key={index} className="border border-gray-100 rounded-md p-3">
              <h5 className="text-sm font-medium text-gray-600 mb-2">
                Statistic {index + 1}
              </h5>
              <div className="space-y-2">
                <input
                  type="text"
                  value={stat.value || ""}
                  onChange={(e) => updateStat(index, "value", e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                  placeholder="50K+"
                />
                <input
                  type="text"
                  value={stat.label || ""}
                  onChange={(e) => updateStat(index, "label", e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                  placeholder="Active Users"
                />
                <textarea
                  rows={2}
                  value={stat.description || ""}
                  onChange={(e) =>
                    updateStat(index, "description", e.target.value)
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                  placeholder="Description of this statistic..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">Team Values</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.values?.map((value, index) => (
            <div key={index} className="border border-gray-100 rounded-md p-3">
              <h5 className="text-sm font-medium text-gray-600 mb-2">
                Value {index + 1}
              </h5>
              <div className="space-y-2">
                <input
                  type="text"
                  value={value.title || ""}
                  onChange={(e) => updateValue(index, "title", e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                  placeholder="Innovation First"
                />
                <textarea
                  rows={3}
                  value={value.description || ""}
                  onChange={(e) =>
                    updateValue(index, "description", e.target.value)
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                  placeholder="Description of this value..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections Configuration */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Page Sections
        </h4>
        <div className="space-y-6">
          {/* Team Section */}
          <div className="border border-gray-100 rounded-md p-3">
            <h5 className="text-sm font-medium text-gray-600 mb-3">
              Team Section
            </h5>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={content.sections?.team?.title || ""}
                onChange={(e) => updateSection("team", "title", e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                placeholder="Leadership"
              />
              <input
                type="text"
                value={content.sections?.team?.highlighted || ""}
                onChange={(e) =>
                  updateSection("team", "highlighted", e.target.value)
                }
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                placeholder="Team"
              />
              <div className="col-span-2">
                <input
                  type="text"
                  value={content.sections?.team?.subtitle || ""}
                  onChange={(e) =>
                    updateSection("team", "subtitle", e.target.value)
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                  placeholder="Meet the people driving our vision forward"
                />
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="border border-gray-100 rounded-md p-3">
            <h5 className="text-sm font-medium text-gray-600 mb-3">
              Values Section
            </h5>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={content.sections?.values?.title || ""}
                onChange={(e) =>
                  updateSection("values", "title", e.target.value)
                }
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                placeholder="Our"
              />
              <input
                type="text"
                value={content.sections?.values?.highlighted || ""}
                onChange={(e) =>
                  updateSection("values", "highlighted", e.target.value)
                }
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                placeholder="Values"
              />
              <div className="col-span-2">
                <input
                  type="text"
                  value={content.sections?.values?.subtitle || ""}
                  onChange={(e) =>
                    updateSection("values", "subtitle", e.target.value)
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                  placeholder="The principles that guide everything we do"
                />
              </div>
            </div>
          </div>

          {/* Join Section */}
          <div className="border border-gray-100 rounded-md p-3">
            <h5 className="text-sm font-medium text-gray-600 mb-3">
              Join Section
            </h5>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={content.sections?.join?.title || ""}
                  onChange={(e) =>
                    updateSection("join", "title", e.target.value)
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                  placeholder="Join Our"
                />
                <input
                  type="text"
                  value={content.sections?.join?.highlighted || ""}
                  onChange={(e) =>
                    updateSection("join", "highlighted", e.target.value)
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                  placeholder="Journey"
                />
              </div>
              <textarea
                rows={2}
                value={content.sections?.join?.description || ""}
                onChange={(e) =>
                  updateSection("join", "description", e.target.value)
                }
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                placeholder="We're always looking for talented individuals..."              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
