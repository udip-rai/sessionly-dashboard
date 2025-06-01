import React, { useState } from "react";
import {
  FiDollarSign,
  FiBriefcase,
  FiEdit2,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { ProfileSectionProps, ExpertData } from "./types";
import { InlineEditField } from "./InlineEditField";

interface ProfessionalInfoProps extends ProfileSectionProps {
  originalData: ExpertData;
}

const RateField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ value, onChange, onCancel, editingField, setEditingField }) => {
  const [editValue, setEditValue] = useState("");
  const isEditing = editingField === "rate";

  const handleEdit = () => {
    // Extract just the numeric value for editing
    const numericValue = value.replace(/[^\d.]/g, "");
    setEditValue(numericValue);
    setEditingField("rate");
  };

  const handleSave = () => {
    // Format as $number/hour
    const formattedValue = editValue ? `$${editValue}/hour` : "";
    onChange(formattedValue);
    setEditingField(null);
  };

  const handleCancel = () => {
    onCancel();
    setEditingField(null);
  };

  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <FiDollarSign className="inline mr-2" />
        Hourly Rate (USD) <span className="text-red-500">*</span>
      </label>
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full pl-8 pr-16 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50"
              autoFocus
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              /hour
            </span>
          </div>
          <button
            onClick={handleSave}
            className="p-2 text-green-600 hover:bg-green-50 rounded-md"
          >
            <FiCheck className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleEdit}
          className="group cursor-pointer p-3 border border-transparent rounded-md hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 relative"
        >
          <p className={`${value ? "text-gray-900" : "text-gray-400"}`}>
            {value || "Click to add hourly rate"}
          </p>
          <FiEdit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 absolute top-3 right-3 transition-opacity" />
        </div>
      )}
    </div>
  );
};

export const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  formData,
  setFormData,
  editingField = null,
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

  if (!setEditingField) {
    return null;
  }
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
          <FiBriefcase className="w-5 h-5 mr-3 text-green-600" />
          Professional Information
        </h2>
        <p className="text-gray-600">
          Your professional details and hourly rate
        </p>
      </div>

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
        <RateField
          value={formData.rate}
          onChange={(value) => handleInputChange("rate", value)}
          onCancel={() => handleCancel("rate")}
          editingField={editingField}
          setEditingField={setEditingField}
        />
      </div>
    </div>
  );
};
