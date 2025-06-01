import React from "react";
import { FiStar } from "react-icons/fi";
import { ProfileSectionProps } from "./types";
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
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
          <FiStar className="w-5 h-5 mr-3 text-blue-600" />
          Expertise Areas
        </h2>
        <p className="text-gray-600 mb-4">
          Select your areas of expertise and specialization
        </p>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
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
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.expertiseAreas.map((area, index) => {
                const category = categories.find(
                  (c) => c._id === area.category,
                );
                const subCategory = category?.subCategories.find(
                  (sc) => sc._id === area.subCategory,
                );
                return (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {category?.name} → {subCategory?.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
