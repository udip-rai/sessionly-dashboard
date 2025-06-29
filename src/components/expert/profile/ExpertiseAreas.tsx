import React from "react";
import { ProfileSectionProps } from "./_types";
import { Category } from "../../../types/expertise";

interface ExpertiseAreasProps extends ProfileSectionProps {
  categories: Category[];
}

export const ExpertiseAreas: React.FC<ExpertiseAreasProps> = ({
  formData,
  setFormData,
  categories,
}) => {
  const handleExpertiseToggle = (categoryId: string, subCategoryId: string) => {
    setFormData((prev) => {
      const expertiseArea = {
        category: categoryId,
        subCategory: subCategoryId,
      };

      const existingIndex = prev.expertiseAreas.findIndex(
        (area) =>
          area.category === expertiseArea.category &&
          area.subCategory === expertiseArea.subCategory,
      );

      return {
        ...prev,
        expertiseAreas:
          existingIndex >= 0
            ? prev.expertiseAreas.filter((_, index) => index !== existingIndex)
            : [...prev.expertiseAreas, expertiseArea],
      };
    });
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div
          key={category._id}
          className="border border-gray-200 rounded-lg p-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span className="w-3 h-3 bg-indigo-600 rounded-full mr-3"></span>
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{category.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {category.subCategories.map((subCategory) => {
              const isSelected = formData.expertiseAreas.some(
                (expertiseArea) =>
                  expertiseArea.category === category._id &&
                  expertiseArea.subCategory === subCategory._id,
              );

              return (
                <button
                  key={subCategory._id}
                  onClick={() =>
                    handleExpertiseToggle(category._id, subCategory._id)
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                  }`}
                >
                  <div>
                    <p className="font-medium">{subCategory.name}</p>
                    {subCategory.description && (
                      <p className="text-xs opacity-75 mt-1">
                        {subCategory.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <p className="text-sm text-indigo-800">
          <strong>Selected:</strong> {formData.expertiseAreas.length} areas
        </p>
        {formData.expertiseAreas.length > 0 && (
          <div className="mt-4 space-y-4">
            {/* Group expertise areas by category */}
            {categories
              .filter((category) =>
                formData.expertiseAreas.some(
                  (area) => area.category === category._id,
                ),
              )
              .map((category) => {
                // Get all selected subcategories for this category
                const selectedSubcategories = formData.expertiseAreas
                  .filter((area) => area.category === category._id)
                  .map((area) => {
                    const subCategory = category.subCategories.find(
                      (sc) => sc._id === area.subCategory,
                    );
                    return subCategory;
                  })
                  .filter(Boolean);

                return (
                  <div
                    key={category._id}
                    className="border border-indigo-100 rounded-lg p-3 bg-white"
                  >
                    <h4 className="text-sm font-medium text-indigo-800 mb-2">
                      {category.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubcategories.map((subCategory, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {subCategory?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
