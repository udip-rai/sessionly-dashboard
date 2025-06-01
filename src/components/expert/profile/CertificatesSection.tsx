import React, { useState } from "react";
import {
  FiAward,
  FiUpload,
  FiX,
  FiEdit3,
  FiSave,
  FiCalendar,
  FiFileText,
  FiPlus,
  FiEye,
} from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../../../api/services/profile.service";
import { useAuth } from "../../../context/AuthContext";
import { showToast } from "../../../utils/toast";
import { Spinner, ButtonWithSpinner } from "../../ui/Spinner";
import {
  Certificate,
  CertificateFormData,
  ProfileSectionProps,
} from "./_types";

export const CertificatesSection: React.FC<ProfileSectionProps> = ({
  formData,
  // setFormData, // Not used - certificates are managed via API
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Local state for managing certificates
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [certificateDetails, setCertificateDetails] = useState<
    CertificateFormData[]
  >([]);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<CertificateFormData>({
    name: "",
    description: "",
    issueDate: "",
  });

  // Mutations for certificate management
  const uploadCertificatesMutation = useMutation({
    mutationFn: async ({
      files,
      details,
    }: {
      files: File[];
      details: Array<{ name: string; description: string; issueDate: string }>;
    }) => {
      if (!user?.id) throw new Error("User ID not found");
      return profileService.uploadCertificates(user.id, files, details);
    },
    onSuccess: () => {
      showToast.success("Certificates uploaded successfully!");
      setUploadFiles([]);
      setCertificateDetails([]);
      setShowDetailsForm(false);
      queryClient.invalidateQueries({ queryKey: ["staffProfile"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to upload certificates";
      showToast.error(errorMessage);
    },
  });

  const updateCertificateDetailsMutation = useMutation({
    mutationFn: async (
      updates: Array<{
        index: number;
        name: string;
        description: string;
        issueDate: string;
      }>,
    ) => {
      if (!user?.id) throw new Error("User ID not found");
      return profileService.updateCertificateDetails(user.id, updates);
    },
    onSuccess: () => {
      showToast.success("Certificate details updated successfully!");
      setEditingIndex(null);
      queryClient.invalidateQueries({ queryKey: ["staffProfile"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update certificate";
      showToast.error(errorMessage);
    },
  });

  const deleteCertificateMutation = useMutation({
    mutationFn: async (certificateIndex: number) => {
      if (!user?.id) throw new Error("User ID not found");
      return profileService.deleteCertificate(user.id, certificateIndex);
    },
    onSuccess: () => {
      showToast.success("Certificate deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["staffProfile"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete certificate";
      showToast.error(errorMessage);
    },
  });

  // Handle file selection for new certificates
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types - only PDF allowed
    const invalidFiles = files.filter(
      (file) => file.type !== "application/pdf",
    );
    if (invalidFiles.length > 0) {
      showToast.error("Please select PDF files only.");
      return;
    }

    console.log("[CertificatesSection] Files selected:", files);
    setUploadFiles(files);

    // Initialize certificate details for each file
    const initialDetails = files.map((file) => ({
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      description: `Professional certificate: ${file.name.replace(
        /\.[^/.]+$/,
        "",
      )}`,
      issueDate: formatDateForInput(new Date().toISOString()), // Today's date in proper format
    }));

    setCertificateDetails(initialDetails);
    setShowDetailsForm(true);
  };

  // Update certificate details
  const updateCertificateDetail = (
    index: number,
    field: keyof CertificateFormData,
    value: string,
  ) => {
    setCertificateDetails((prev) =>
      prev.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail,
      ),
    );
  };

  // Upload new certificates
  const handleUploadCertificates = () => {
    if (uploadFiles.length === 0) {
      showToast.error("Please select at least one certificate file");
      return;
    }

    if (certificateDetails.length !== uploadFiles.length) {
      showToast.error("Please fill in details for all certificates");
      return;
    }

    uploadCertificatesMutation.mutate({
      files: uploadFiles,
      details: certificateDetails,
    });
  };

  // Convert ISO date string to YYYY-MM-DD format for date input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Start editing a certificate
  const handleStartEdit = (index: number, certificate: Certificate) => {
    setEditingIndex(index);
    setEditingData({
      name: certificate.name,
      description: certificate.description,
      issueDate: formatDateForInput(certificate.issueDate),
    });
  };

  // Save certificate edits
  const handleSaveEdit = () => {
    if (editingIndex === null) return;

    const updates = [
      {
        index: editingIndex,
        ...editingData,
      },
    ];

    updateCertificateDetailsMutation.mutate(updates);
  };

  // Delete a certificate
  const handleDeleteCertificate = (index: number) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      deleteCertificateMutation.mutate(index);
    }
  };

  // View certificate PDF
  const handleViewCertificate = (certificate: Certificate) => {
    if (certificate.file || certificate.fileUrl) {
      const fileSource = certificate.file || certificate.fileUrl;

      if (typeof fileSource === "string") {
        if (fileSource.startsWith("data:")) {
          // Base64 data - convert to blob and open
          const base64Data = fileSource.split(",")[1];
          const binaryString = window.atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");

          // Clean up the blob URL after a delay
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } else {
          // URL - open directly
          window.open(fileSource, "_blank");
        }
      } else if (fileSource instanceof File) {
        // File object - create blob URL
        const url = URL.createObjectURL(fileSource);
        window.open(url, "_blank");

        // Clean up the blob URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    }
  };

  const isLoading =
    uploadCertificatesMutation.isPending ||
    updateCertificateDetailsMutation.isPending ||
    deleteCertificateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Existing Certificates */}
      {formData.certificates && formData.certificates.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiAward className="w-5 h-5 mr-2 text-purple-600" />
            Your Certificates
          </h4>

          {formData.certificates.map((cert: Certificate, index: number) => (
            <div
              key={cert._id || index}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {editingIndex === index ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certificate Name
                      </label>
                      <input
                        type="text"
                        value={editingData.name}
                        onChange={(e) =>
                          setEditingData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Certificate name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Date
                      </label>
                      <input
                        type="date"
                        value={editingData.issueDate}
                        onChange={(e) =>
                          setEditingData((prev) => ({
                            ...prev,
                            issueDate: e.target.value,
                          }))
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
                      value={editingData.description}
                      onChange={(e) =>
                        setEditingData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Certificate description"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <ButtonWithSpinner
                      onClick={handleSaveEdit}
                      disabled={isLoading}
                      variant="primary"
                      className="bg-purple-600 hover:bg-purple-700"
                      isLoading={updateCertificateDetailsMutation.isPending}
                      loadingText="Saving..."
                      icon={<FiSave className="w-4 h-4" />}
                    >
                      Save
                    </ButtonWithSpinner>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3 mb-2">
                      <FiAward className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="text-lg font-medium text-gray-900">
                            {cert.name}
                          </h5>
                          {(cert.fileUrl || cert.file) && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 border border-purple-200 rounded-full">
                              <FiFileText className="w-3 h-3 mr-1" />
                              PDF Available
                            </span>
                          )}
                        </div>
                        {(cert.fileUrl || cert.file) && (
                          <div className="mt-1 text-xs text-purple-600">
                            Click the "View" button to open the certificate PDF
                          </div>
                        )}
                      </div>
                    </div>

                    {cert.description && (
                      <div className="flex items-start space-x-2 mb-2">
                        <FiFileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">
                          {cert.description}
                        </p>
                      </div>
                    )}

                    {cert.issueDate && (
                      <div className="flex items-center space-x-2">
                        <FiCalendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-500">
                          Issued:{" "}
                          {new Date(cert.issueDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {cert.fileUrl || cert.file ? (
                      <button
                        onClick={() => handleViewCertificate(cert)}
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                        disabled={isLoading}
                        title="View Certificate"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    ) : (
                      <span
                        className="p-2 bg-gray-200 text-gray-400 rounded-md cursor-not-allowed flex items-center"
                        title="No PDF available"
                      >
                        <FiEye className="w-4 h-4" />
                      </span>
                    )}
                    <button
                      onClick={() => handleStartEdit(index, cert)}
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                      disabled={isLoading}
                      title="Edit Certificate"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCertificate(index)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      disabled={isLoading}
                      title="Delete Certificate"
                    >
                      {deleteCertificateMutation.isPending &&
                      deleteCertificateMutation.variables === index ? (
                        <Spinner size="sm" color="red" />
                      ) : (
                        <FiX className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload New Certificates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiUpload className="w-5 h-5 mr-2 text-purple-600" />
            Upload New Certificates
          </h4>

          {/* Quick Add Button */}
          <button
            onClick={() =>
              document.getElementById("certificates-file-input")?.click()
            }
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Certificate
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors relative">
          {uploadFiles.length > 0 ? (
            <div className="space-y-6">
              {/* File List */}
              <div className="text-left">
                <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FiFileText className="w-4 h-4 mr-2 text-purple-600" />
                  Selected Files ({uploadFiles.length}):
                </h5>
                <div className="grid gap-2 max-h-40 overflow-y-auto">
                  {uploadFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md border"
                    >
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <FiFileText className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">{file.name}</span>
                        <span className="text-gray-500">PDF Document</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() =>
                            handleViewCertificate({
                              ...certificateDetails[index],
                              file,
                            })
                          }
                          className="p-1 bg-purple-600 text-white rounded transition-colors flex items-center shadow-sm hover:bg-purple-700"
                          title="View Certificate"
                          disabled={isLoading}
                        >
                          <FiEye className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            const newFiles = uploadFiles.filter(
                              (_, i) => i !== index,
                            );
                            const newDetails = certificateDetails.filter(
                              (_, i) => i !== index,
                            );
                            setUploadFiles(newFiles);
                            setCertificateDetails(newDetails);
                            if (newFiles.length === 0) {
                              setShowDetailsForm(false);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          disabled={isLoading}
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificate Details Form */}
              {showDetailsForm && (
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="font-medium text-gray-900 mb-3">
                    Certificate Details:
                  </h5>
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {uploadFiles.map((file, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border"
                      >
                        <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                          <FiFileText className="w-4 h-4 mr-2 text-purple-600" />
                          {file.name}
                        </h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Certificate Name *
                            </label>
                            <input
                              type="text"
                              value={certificateDetails[index]?.name || ""}
                              onChange={(e) =>
                                updateCertificateDetail(
                                  index,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="e.g., AWS Certified Solutions Architect"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Issue Date *
                            </label>
                            <input
                              type="date"
                              value={certificateDetails[index]?.issueDate || ""}
                              onChange={(e) =>
                                updateCertificateDetail(
                                  index,
                                  "issueDate",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={certificateDetails[index]?.description || ""}
                            onChange={(e) =>
                              updateCertificateDetail(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Brief description of the certificate..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-3 pt-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    setUploadFiles([]);
                    setCertificateDetails([]);
                    setShowDetailsForm(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Clear All
                </button>
                <button
                  onClick={() =>
                    document.getElementById("certificates-file-input")?.click()
                  }
                  className="px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors border border-purple-300 rounded-md hover:bg-purple-50"
                  disabled={isLoading}
                >
                  Add More
                </button>
                <ButtonWithSpinner
                  onClick={handleUploadCertificates}
                  disabled={
                    isLoading ||
                    certificateDetails.some(
                      (detail) => !detail.name.trim() || !detail.issueDate,
                    )
                  }
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 shadow-sm"
                  variant="primary"
                  isLoading={uploadCertificatesMutation.isPending}
                  loadingText="Uploading..."
                  icon={<FiUpload className="w-4 h-4" />}
                >
                  {`Upload ${uploadFiles.length} Certificate${
                    uploadFiles.length !== 1 ? "s" : ""
                  }`}
                </ButtonWithSpinner>
              </div>
            </div>
          ) : (
            <div className="py-12">
              <FiUpload className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h5 className="text-xl font-semibold text-gray-700 mb-3">
                Upload Professional Certificates
              </h5>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Add your professional certifications, course completions, and
                achievements
              </p>
              <div className="space-y-3 text-sm text-gray-600 mb-8">
                <p>• PDF documents only</p>
                <p>• Multiple files can be selected at once</p>
                <p>• Professional certificates and achievements</p>
              </div>
              <div className="mt-6">
                <ButtonWithSpinner
                  onClick={() =>
                    document.getElementById("certificates-file-input")?.click()
                  }
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm"
                  variant="primary"
                  isLoading={isLoading}
                  icon={<FiPlus className="w-4 h-4" />}
                >
                  Choose Files
                </ButtonWithSpinner>
              </div>
            </div>
          )}

          <input
            id="certificates-file-input"
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
