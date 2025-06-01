import React from "react";
import { FiMail, FiPhone } from "react-icons/fi";

interface ContactInformationProps {
  formData: {
    email?: string;
    phone?: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  originalData: {
    email?: string;
    phone?: string;
  };
}

export const ContactInformation: React.FC<ContactInformationProps> = ({
  formData,
  setFormData,
}) => {
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Email Field - Read Only */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="flex items-center">
          <FiMail className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="email"
            value={formData.email || ""}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            placeholder="Email not available"
            readOnly
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Email cannot be changed from this page
        </p>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="Enter your phone number"
          />
        </div>
      </div>
    </>
  );
};

export default ContactInformation;
