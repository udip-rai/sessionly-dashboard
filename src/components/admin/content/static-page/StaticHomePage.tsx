import { useCallback } from "react";
import { HomePageContent } from "../../../../api/services/admin.service";

interface StaticHomePageProps {
  content: HomePageContent;
  onChange: (content: HomePageContent) => void;
}

export const StaticHomePage = ({ content, onChange }: StaticHomePageProps) => {
  const updateField = useCallback(
    (field: keyof HomePageContent, value: string) => {
      onChange({ ...content, [field]: value });
    },
    [content, onChange],
  );

  const updateEverythingReason = useCallback(
    (
      field: keyof HomePageContent["everything_reasons"],
      value: string | Array<{ title: string; description: string }>,
    ) => {
      onChange({
        ...content,
        everything_reasons: {
          ...content.everything_reasons,
          [field]: value,
        },
      });
    },
    [content, onChange],
  );

  const updateEverythingChild = useCallback(
    (index: number, field: string, value: string) => {
      const newChildren = [...(content.everything_reasons?.children || [])];
      newChildren[index] = { ...newChildren[index], [field]: value };
      onChange({
        ...content,
        everything_reasons: {
          ...content.everything_reasons,
          children: newChildren,
        },
      });
    },
    [content, onChange],
  );
  const updateTransformReason = useCallback(
    (
      field: keyof HomePageContent["transform_reasons"],
      value: string | string[],
    ) => {
      onChange({
        ...content,
        transform_reasons: {
          ...content.transform_reasons,
          [field]: value,
        },
      });
    },
    [content, onChange],
  );

  const updateTransformChild = useCallback(
    (index: number, value: string) => {
      const newChildren = [...(content.transform_reasons?.children || [])];
      newChildren[index] = value;
      onChange({
        ...content,
        transform_reasons: {
          ...content.transform_reasons,
          children: newChildren,
        },
      });
    },
    [content, onChange],
  );
  const updateAdvantageReason = useCallback(
    (
      field: keyof HomePageContent["advantages_reasons"],
      value: string | Array<{ title: string; description: string }>,
    ) => {
      onChange({
        ...content,
        advantages_reasons: {
          ...content.advantages_reasons,
          [field]: value,
        },
      });
    },
    [content, onChange],
  );

  const updateAdvantageChild = useCallback(
    (index: number, field: string, value: string) => {
      const newChildren = [...(content.advantages_reasons?.children || [])];
      newChildren[index] = { ...newChildren[index], [field]: value };
      onChange({
        ...content,
        advantages_reasons: {
          ...content.advantages_reasons,
          children: newChildren,
        },
      });
    },
    [content, onChange],
  );
  const updateAIReason = useCallback(
    (
      field: keyof HomePageContent["powered_by_ai_reasons"],
      value: string | Array<{ title: string; description: string }>,
    ) => {
      onChange({
        ...content,
        powered_by_ai_reasons: {
          ...content.powered_by_ai_reasons,
          [field]: value,
        },
      });
    },
    [content, onChange],
  );

  const updateAIChild = useCallback(
    (index: number, field: string, value: string) => {
      const newChildren = [...(content.powered_by_ai_reasons?.children || [])];
      newChildren[index] = { ...newChildren[index], [field]: value };
      onChange({
        ...content,
        powered_by_ai_reasons: {
          ...content.powered_by_ai_reasons,
          children: newChildren,
        },
      });
    },
    [content, onChange],
  );
  const updateTestimonials = useCallback(
    (
      field: keyof HomePageContent["testimonials"],
      value:
        | string
        | Array<{
            name: string;
            role: string;
            rating: number;
            content: string;
          }>,
    ) => {
      onChange({
        ...content,
        testimonials: {
          ...content.testimonials,
          [field]: value,
        },
      });
    },
    [content, onChange],
  );

  const updateTestimonialItem = useCallback(
    (index: number, field: string, value: string | number) => {
      const newItems = [...(content.testimonials?.items || [])];
      // Ensure we always have exactly 4 items
      while (newItems.length < 4) {
        newItems.push({ name: "", role: "", rating: 5, content: "" });
      }
      newItems[index] = { ...newItems[index], [field]: value };
      onChange({
        ...content,
        testimonials: {
          ...content.testimonials,
          items: newItems,
        },
      });
    },
    [content, onChange],
  );
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Title *
          </label>
          <input
            type="text"
            value={content.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
            placeholder="Welcome to Our Platform"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Description *
          </label>
          <textarea
            rows={3}
            value={content.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
            placeholder="Brief description of your platform"
          />
        </div>
      </div>{" "}
      {/* Everything Reasons Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Everything You Need Section
        </h4>
        <div className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title *
              </label>
              <input
                type="text"
                value={content.everything_reasons?.title || ""}
                onChange={(e) =>
                  updateEverythingReason("title", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Everything You Need"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Description *
              </label>
              <textarea
                rows={3}
                value={content.everything_reasons?.description || ""}
                onChange={(e) =>
                  updateEverythingReason("description", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Complete solution description"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.everything_reasons?.children?.map((child, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-md p-3"
              >
                <h5 className="text-sm font-medium text-gray-600 mb-2">
                  Feature {index + 1}
                </h5>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={child.title || ""}
                    onChange={(e) =>
                      updateEverythingChild(index, "title", e.target.value)
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                    placeholder="Feature title"
                  />
                  <textarea
                    rows={2}
                    value={child.description || ""}
                    onChange={(e) =>
                      updateEverythingChild(
                        index,
                        "description",
                        e.target.value,
                      )
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                    placeholder="Feature description"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Transform Reasons Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Transform Your Life Section
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title *
            </label>
            <input
              type="text"
              value={content.transform_reasons?.title || ""}
              onChange={(e) => updateTransformReason("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              placeholder="Transform Your Life"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.transform_reasons?.children?.map((child, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-md p-3"
              >
                <h5 className="text-sm font-medium text-gray-600 mb-2">
                  Transform Point {index + 1}
                </h5>
                <input
                  type="text"
                  value={child || ""}
                  onChange={(e) => updateTransformChild(index, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                  placeholder="Transformation point"
                />
              </div>
            ))}
          </div>
        </div>
      </div>{" "}
      {/* Advantages Reasons Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Our Advantages Section
        </h4>
        <div className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title *
              </label>
              <input
                type="text"
                value={content.advantages_reasons?.title || ""}
                onChange={(e) => updateAdvantageReason("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Our Competitive Advantages"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Description *
              </label>
              <textarea
                rows={3}
                value={content.advantages_reasons?.description || ""}
                onChange={(e) =>
                  updateAdvantageReason("description", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Why we stand out from competitors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.advantages_reasons?.children?.map((child, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-md p-3"
              >
                <h5 className="text-sm font-medium text-gray-600 mb-2">
                  Advantage {index + 1}
                </h5>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={child.title || ""}
                    onChange={(e) =>
                      updateAdvantageChild(index, "title", e.target.value)
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                    placeholder="Advantage title"
                  />
                  <textarea
                    rows={2}
                    value={child.description || ""}
                    onChange={(e) =>
                      updateAdvantageChild(index, "description", e.target.value)
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                    placeholder="Advantage description"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>{" "}
      {/* Powered by AI Reasons Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Powered by AI Section
        </h4>
        <div className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title *
              </label>
              <input
                type="text"
                value={content.powered_by_ai_reasons?.title || ""}
                onChange={(e) => updateAIReason("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Powered by Advanced AI"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Description *
              </label>
              <textarea
                rows={3}
                value={content.powered_by_ai_reasons?.description || ""}
                onChange={(e) => updateAIReason("description", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="How AI enhances the experience"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.powered_by_ai_reasons?.children?.map((child, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-md p-3"
              >
                <h5 className="text-sm font-medium text-gray-600 mb-2">
                  AI Feature {index + 1}
                </h5>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={child.title || ""}
                    onChange={(e) =>
                      updateAIChild(index, "title", e.target.value)
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                    placeholder="AI feature title"
                  />
                  <textarea
                    rows={2}
                    value={child.description || ""}
                    onChange={(e) =>
                      updateAIChild(index, "description", e.target.value)
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                    placeholder="AI feature description"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>{" "}
      {/* Testimonials Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Testimonials Section
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title *
            </label>
            <input
              type="text"
              value={content.testimonials?.title || ""}
              onChange={(e) => updateTestimonials("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              placeholder="What Our Users Say"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Description *
            </label>
            <textarea
              rows={3}
              value={content.testimonials?.description || ""}
              onChange={(e) =>
                updateTestimonials("description", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              placeholder="Brief introduction to testimonials"
            />
          </div>

          {/* Testimonials */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-gray-700">Testimonials</h5>

            {(() => {
              // Ensure we always have exactly 4 testimonials
              const testimonials = content.testimonials?.items || [];
              const filledTestimonials = [...testimonials];
              while (filledTestimonials.length < 4) {
                filledTestimonials.push({
                  name: "",
                  role: "",
                  rating: 5,
                  content: "",
                });
              }

              return filledTestimonials.slice(0, 4).map((item, index) => {
                const isCEO = index === 0; // First testimonial is CEO
                const testimonialLabels = [
                  "CEO Testimonial",
                  "Professional Testimonial #1",
                  "Professional Testimonial #2",
                  "Professional Testimonial #3",
                ];

                return (
                  <div
                    key={index}
                    className={`border rounded-md p-4 space-y-3 ${
                      isCEO ? "border-blue-200 bg-blue-50" : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <h6
                        className={`text-sm font-medium ${
                          isCEO ? "text-blue-800" : "text-gray-600"
                        }`}
                      >
                        {testimonialLabels[index]}
                      </h6>
                      {isCEO && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={item.name || ""}
                          onChange={(e) =>
                            updateTestimonialItem(index, "name", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                          placeholder={isCEO ? "John Doe" : "Professional Name"}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Role *
                        </label>
                        <input
                          type="text"
                          value={item.role || ""}
                          onChange={(e) =>
                            updateTestimonialItem(index, "role", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                          placeholder={
                            isCEO
                              ? "Chief Executive Officer, Company Inc."
                              : "Position at Company"
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Rating *
                        </label>
                        <select
                          value={item.rating || 5}
                          onChange={(e) =>
                            updateTestimonialItem(
                              index,
                              "rating",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={2}>2 Stars</option>
                          <option value={1}>1 Star</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Testimonial Content *
                      </label>
                      <textarea
                        rows={3}
                        value={item.content || ""}
                        onChange={(e) =>
                          updateTestimonialItem(
                            index,
                            "content",
                            e.target.value,
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                        placeholder={
                          isCEO
                            ? "Share executive perspective on business transformation..."
                            : "Share your experience with Sessionly..."
                        }
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
