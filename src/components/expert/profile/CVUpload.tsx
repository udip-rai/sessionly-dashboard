import React from "react";
import { FiFile, FiUpload, FiEye, FiExternalLink } from "react-icons/fi";
import { ProfileSectionProps } from "./_types";

export const CVUpload: React.FC<ProfileSectionProps> = ({
  formData,
  setFormData,
}) => {
  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file only.");
        return;
      }

      // Debug logging
      console.log("[CVUpload] File selected:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log(
          "[CVUpload] Base64 result:",
          result.substring(0, 100) + "...",
        );

        setFormData((prev) => ({
          ...prev,
          cv: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewCV = () => {
    if (formData.cv) {
      if (formData.cv.startsWith("data:")) {
        // Base64 data - convert to blob and open
        const base64Data = formData.cv.split(",")[1];
        const binaryString = window.atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        // URL - open directly
        window.open(formData.cv, "_blank");
      }
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
        <FiFile className="w-5 h-5 mr-2 text-orange-600" />
        Your Resume
      </h4>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors relative bg-gradient-to-br from-orange-50/30 to-amber-50/30">
        {formData.cv &&
        typeof formData.cv === "string" &&
        formData.cv.trim() !== "" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-full">
                <FiFile className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold text-gray-900">
                  CV/Resume Uploaded
                </p>
                <p className="text-sm text-gray-600">PDF document ready</p>
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={handleViewCV}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-200 hover:bg-orange-50 rounded-md transition-colors shadow-sm"
              >
                <FiEye className="w-4 h-4 mr-2" />
                View CV
                <FiExternalLink className="w-3 h-3 ml-2" />
              </button>
              <button
                onClick={() =>
                  document.getElementById("cv-file-input")?.click()
                }
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors shadow-sm"
              >
                <FiUpload className="w-4 h-4 mr-2" />
                Replace CV
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gray-100 rounded-full">
                <FiUpload className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Your CV/Resume
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Share your professional background with potential clients
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• PDF documents only</p>
                <p>• Professional resume or curriculum vitae</p>
              </div>
            </div>
            <button
              onClick={() => document.getElementById("cv-file-input")?.click()}
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm font-medium"
            >
              <FiUpload className="w-4 h-4 mr-2" />
              Choose PDF File
            </button>
          </div>
        )}

        <input
          id="cv-file-input"
          type="file"
          accept=".pdf"
          onChange={handleCVUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};
