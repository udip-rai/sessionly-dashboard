import React from "react";
import { FiDollarSign } from "react-icons/fi";
import { ProfileSectionProps, ExpertData } from "./_types";
import { InlineEditField } from "./InlineEditField";

interface ProfessionalInfoProps extends ProfileSectionProps {
  originalData: ExpertData;
}

export const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  formData,
  setFormData,
  editingField,
  setEditingField,
  originalData,
}) => {
  const handleInputChange = (field: keyof ExpertData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = (field: keyof ExpertData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: originalData[field],
    }));
  };

  // Early return if inline editing props are not provided
  if (!setEditingField || editingField === undefined) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Professional Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell us about your professional background..."
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hourly Rate (USD)
          </label>
          <div className="relative">
            <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              value={formData.rate}
              onChange={(e) => handleInputChange("rate", e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your hourly rate"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <InlineEditField
          field="bio"
          value={formData.bio}
          placeholder="Professional Bio"
          multiline
          editingField={editingField}
          setEditingField={setEditingField}
          onUpdate={handleInputChange}
          onCancel={handleCancel}
        />
      </div>
      <InlineEditField
        field="rate"
        value={formData.rate}
        placeholder="Hourly Rate (USD)"
        type="number"
        icon={FiDollarSign}
        editingField={editingField}
        setEditingField={setEditingField}
        onUpdate={handleInputChange}
        onCancel={handleCancel}
      />
    </div>
  );
};
