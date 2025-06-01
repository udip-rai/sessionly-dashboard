import React from "react";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { ProfileSectionProps, ExpertData } from "./types";
import { InlineEditField } from "./InlineEditField";

interface BasicInformationProps extends ProfileSectionProps {
  originalData: ExpertData;
}

export const BasicInformation: React.FC<BasicInformationProps> = ({
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
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 gap-6">
        <InlineEditField
          field="username"
          value={formData.username}
          placeholder="Username"
          icon={FiUser}
          editingField={editingField}
          setEditingField={setEditingField}
          onUpdate={handleInputChange}
          onCancel={handleCancel}
        />
      </div>

      {/* Email field spans full width */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FiMail className="inline mr-2" />
          Email Address
        </label>
        <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
          <p className="text-gray-600">{formData.email}</p>
          <p className="text-xs text-gray-500 mt-1">
            Email cannot be changed for security reasons
          </p>
        </div>
      </div>
      <InlineEditField
        field="phone"
        value={formData.phone}
        placeholder="Phone Number"
        type="tel"
        icon={FiPhone}
        editingField={editingField}
        setEditingField={setEditingField}
        onUpdate={handleInputChange}
        onCancel={handleCancel}
      />
    </div>
  );
};
