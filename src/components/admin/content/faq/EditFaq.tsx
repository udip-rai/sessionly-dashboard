import { useState, useEffect } from "react";
import { FiEdit3 } from "react-icons/fi";
import { adminService, FAQ } from "../../../../api/services/admin.service";
import { Modal } from "../../../ui";
import { FaqForm } from "./FaqForm";
import { useSimpleToast } from "../../../toast";

export interface EditFaqProps {
  isOpen: boolean;
  onClose: () => void;
  onFaqUpdated: (faq: FAQ) => void;
  faq: FAQ | null;
}

export const EditFaq = ({
  isOpen,
  onClose,
  onFaqUpdated,
  faq,
}: EditFaqProps) => {
  const toast = useSimpleToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [faqData, setFaqData] = useState({
    question: "",
    answer: "",
  });

  // Update form data when faq changes
  useEffect(() => {
    if (faq) {
      setFaqData({
        question: faq.question,
        answer: faq.answer,
      });
    }
  }, [faq]);

  const handleClose = () => {
    setFaqData({ question: "", answer: "" });
    setIsUpdating(false);
    onClose();
  };

  const handleUpdate = async () => {
    if (!faq || !faqData.question.trim() || !faqData.answer.trim()) {
      toast.error("Validation Error", "Question and answer are required");
      return;
    }

    try {
      setIsUpdating(true);
      const updatedFaq = await adminService.updateFAQ(faq._id, {
        question: faqData.question,
        answer: faqData.answer,
      });

      onFaqUpdated(updatedFaq);
      handleClose();
      toast.success("FAQ Updated", "FAQ updated successfully");
    } catch (error) {
      console.error("Failed to update FAQ:", error);
      toast.error("Failed to update FAQ", "Please try again");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit FAQ" size="lg">
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Edit FAQ Guidelines
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Update the question or answer to be more clear and helpful
                  </li>
                  <li>Ensure the information is accurate and up-to-date</li>
                  <li>Use simple language and avoid technical jargon</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <FaqForm
          faq={faqData}
          onChange={setFaqData}
          isEditing={true}
          disabled={isUpdating}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={
              isUpdating || !faqData.question.trim() || !faqData.answer.trim()
            }
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Updating FAQ...
              </>
            ) : (
              <>
                <FiEdit3 className="w-4 h-4 mr-2" />
                Update FAQ
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
