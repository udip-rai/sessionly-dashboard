import React, { useState } from "react";
import {
  FiAward,
  FiUpload,
  FiX,
  FiEdit2,
  FiCheck,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";
import { ProfileSectionProps, Certificate } from "./types";

export const CertificatesSection: React.FC<ProfileSectionProps> = ({
  formData,
  setFormData,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newCertificate = {
          name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          file: result,
          issueDate: "",
          description: "",
        };
        setFormData((prev) => ({
          ...prev,
          certificates: [...prev.certificates, newCertificate],
        }));
        // Auto-edit the newly added certificate
        setEditingIndex(formData.certificates.length);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCertificate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleUpdateCertificate = (
    index: number,
    field: keyof Certificate,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert,
      ),
    }));
  };

  const handleSaveEdit = () => {
    setEditingIndex(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-purple-50 to-transparent">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <FiAward className="w-5 h-5 mr-3 text-purple-600" />
          Certificates & Achievements
        </h2>
      </div>
      <div className="p-6">
        {" "}
        <div className="space-y-4">
          {formData.certificates.map((cert, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              {editingIndex === index ? (
                // Edit mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                      <FiAward className="w-4 h-4 mr-2 text-purple-600" />
                      Edit Certificate
                    </h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveCertificate(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiFileText className="inline w-4 h-4 mr-1" />
                        Certificate Name *
                      </label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) =>
                          handleUpdateCertificate(index, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Certificate name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiCalendar className="inline w-4 h-4 mr-1" />
                        Issue Date
                      </label>
                      <input
                        type="date"
                        value={cert.issueDate}
                        onChange={(e) =>
                          handleUpdateCertificate(
                            index,
                            "issueDate",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={cert.description}
                      onChange={(e) =>
                        handleUpdateCertificate(
                          index,
                          "description",
                          e.target.value,
                        )
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe this certificate..."
                    />
                  </div>
                </div>
              ) : (
                // View mode
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <FiAward className="w-5 h-5 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {cert.name || "Untitled Certificate"}
                        </span>
                        {cert.file && (
                          <a
                            href={cert.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            View File
                          </a>
                        )}
                      </div>
                      {cert.issueDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Issued:{" "}
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      )}
                      {cert.description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {cert.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingIndex(index)}
                      className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveCertificate(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors relative">
            <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Add Certificate (PDF, JPG, PNG)
            </p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleCertificateUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
