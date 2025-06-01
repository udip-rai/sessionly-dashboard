import React from "react";
import { FiAward, FiUpload, FiX } from "react-icons/fi";
import { ProfileSectionProps } from "./_types";

export const CertificatesSection: React.FC<ProfileSectionProps> = ({
  formData,
  setFormData,
}) => {
  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newCertificate = {
          name: file.name,
          file: result,
          issueDate: "",
          description: "",
        };
        setFormData((prev) => ({
          ...prev,
          certificates: [...prev.certificates, newCertificate],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCertificate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-4">
      {formData.certificates.map((cert, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <FiAward className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">{cert.name}</span>
          </div>
          <button
            onClick={() => handleRemoveCertificate(index)}
            className="text-red-600 hover:text-red-800"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ))}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors relative">
        <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Add Certificate (PDF Only)</p>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleCertificateUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};
