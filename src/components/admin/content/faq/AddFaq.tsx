import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { adminService } from "../../../../api/services/admin.service";
import { Modal } from "../../../ui";
import { FaqForm } from "./FaqForm";
import { useSimpleToast } from "../../../toast";

export interface AddFaqProps {
  isOpen: boolean;
  onClose: () => void;
  onFaqAdded: (faq: any) => void;
}

export const AddFaq = ({ isOpen, onClose, onFaqAdded }: AddFaqProps) => {
  const toast = useSimpleToast();
  const [isAdding, setIsAdding] = useState(false);
  const [faqData, setFaqData] = useState({
    question: "",
    answer: "",
  });

  const handleClose = () => {
    setFaqData({ question: "", answer: "" });
    setIsAdding(false);
    onClose();
  };

  const handleAdd = async () => {
    if (!faqData.question.trim() || !faqData.answer.trim()) {
      toast.error("Validation Error", "Question and answer are required");
      return;
    }

    try {
      setIsAdding(true);
      const newFaq = await adminService.createFAQ({
        question: faqData.question,
        answer: faqData.answer,
        isPublished: false, // Default to unpublished
      });

      onFaqAdded(newFaq);
      handleClose();
      toast.success("FAQ Created", "FAQ created successfully");
    } catch (error) {
      console.error("Failed to create FAQ:", error);
      toast.error("Failed to create FAQ", "Please try again");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New FAQ" size="lg">
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
                FAQ Guidelines
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Write clear, concise questions that users commonly ask
                  </li>
                  <li>Provide comprehensive but easy-to-understand answers</li>
                  <li>Use simple language and avoid technical jargon</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <FaqForm
          faq={faqData}
          onChange={setFaqData}
          isEditing={false}
          disabled={isAdding}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={isAdding}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={
              isAdding || !faqData.question.trim() || !faqData.answer.trim()
            }
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Adding FAQ...
              </>
            ) : (
              <>
                <FiPlus className="w-4 h-4 mr-2" />
                Add FAQ
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
