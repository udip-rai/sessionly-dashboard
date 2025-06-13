import { useState, useEffect } from "react";
import { FiTrash2, FiEdit3 } from "react-icons/fi";
import { adminService, FAQ } from "../../../api/services/admin.service";
import { Modal, ConfirmModal, AddButton, TimestampBadges } from "../../ui";
import { useSimpleToast } from "../../toast";
import { FaqForm } from "./faq";

export function TabFaq() {
  const toast = useSimpleToast(); // FAQ-related state
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editedFaq, setEditedFaq] = useState<{
    question: string;
    answer: string;
  }>({ question: "", answer: "" });
  const [isAddingFaq, setIsAddingFaq] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal states
  const [showAddFaqModal, setShowAddFaqModal] = useState<boolean>(false);
  const [showEditFaqModal, setShowEditFaqModal] = useState<boolean>(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [isUpdatingFaq, setIsUpdatingFaq] = useState<boolean>(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    faqId: string | null;
    faqQuestion: string;
  }>({ isOpen: false, faqId: null, faqQuestion: "" });

  const loadFAQs = async () => {
    try {
      setLoading(true);
      console.log("Loading FAQs...");
      const faqData = await adminService.getAllFAQs();
      console.log("FAQ data received:", faqData);
      setFaqs(faqData);
    } catch (error: any) {
      console.error("Failed to load FAQs:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
      });
      toast.error(
        "Failed to load FAQs",
        error?.response?.data?.message || error?.message || "Unknown error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddFaqModal = () => {
    setEditedFaq({ question: "", answer: "" });
    setShowAddFaqModal(true);
  };

  const handleCloseAddFaqModal = () => {
    setEditedFaq({ question: "", answer: "" });
    setShowAddFaqModal(false);
    setIsAddingFaq(false);
  };
  const handleAddFaq = async () => {
    if (!editedFaq.question.trim() || !editedFaq.answer.trim()) {
      toast.error("Validation Error", "Question and answer are required");
      return;
    }

    try {
      setIsAddingFaq(true);
      const newFaq = await adminService.createFAQ({
        question: editedFaq.question,
        answer: editedFaq.answer,
        isPublished: false, // Default to unpublished
      });

      setFaqs([...faqs, newFaq]);
      handleCloseAddFaqModal();
      toast.success("FAQ Created", "FAQ created successfully");
    } catch (error) {
      console.error("Failed to create FAQ:", error);
      toast.error("Failed to create FAQ", "Please try again");
    } finally {
      setIsAddingFaq(false);
    }
  };

  const handleOpenEditFaqModal = (faq: FAQ) => {
    setEditedFaq({ question: faq.question, answer: faq.answer });
    setEditingFaqId(faq._id);
    setShowEditFaqModal(true);
  };

  const handleCloseEditFaqModal = () => {
    setEditedFaq({ question: "", answer: "" });
    setEditingFaqId(null);
    setShowEditFaqModal(false);
    setIsUpdatingFaq(false);
  };

  const handleUpdateFaq = async () => {
    if (!editedFaq.question.trim() || !editedFaq.answer.trim()) {
      toast.error("Validation Error", "Question and answer are required");
      return;
    }

    if (!editingFaqId) return;

    try {
      setIsUpdatingFaq(true);
      const updatedFaq = await adminService.updateFAQ(editingFaqId, {
        question: editedFaq.question,
        answer: editedFaq.answer,
      });

      setFaqs(faqs.map((faq) => (faq._id === editingFaqId ? updatedFaq : faq)));
      handleCloseEditFaqModal();
      toast.success("FAQ Updated", "FAQ updated successfully");
    } catch (error) {
      console.error("Failed to update FAQ:", error);
      toast.error("Failed to update FAQ", "Please try again");
    } finally {
      setIsUpdatingFaq(false);
    }
  };

  const handleOpenDeleteDialog = (faqId: string, question: string) => {
    setDeleteConfirmDialog({
      isOpen: true,
      faqId,
      faqQuestion: question,
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteConfirmDialog({
      isOpen: false,
      faqId: null,
      faqQuestion: "",
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmDialog.faqId) return;

    try {
      await adminService.deleteFAQ(deleteConfirmDialog.faqId);
      setFaqs(faqs.filter((faq) => faq._id !== deleteConfirmDialog.faqId));
      toast.success("FAQ Deleted", "FAQ deleted successfully");
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
      toast.error("Failed to delete FAQ", "Please try again");
    }
  };

  // Load FAQs on component mount
  useEffect(() => {
    loadFAQs();
  }, []);
  return (
    <div className="space-y-6">
      {/* Show loading state for everything, or show all content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
          <p className="mt-2 text-gray-500">Loading FAQs...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                FAQ Management
              </h2>
              <p className="text-sm text-gray-500">
                Manage frequently asked questions
              </p>
            </div>
            <AddButton onClick={handleOpenAddFaqModal}>Add FAQ</AddButton>
          </div>

          {/* FAQ List */}
          {faqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No FAQs found</p>
              <AddButton onClick={handleOpenAddFaqModal} className="mx-auto">
                Add Your First FAQ
              </AddButton>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    {" "}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {/* Enhanced timestamp styling */}
                        <TimestampBadges
                          createdAt={faq.createdAt}
                          updatedAt={faq.updatedAt}
                          variant="green"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditFaqModal(faq)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit FAQ"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleOpenDeleteDialog(faq._id, faq.question)
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete FAQ"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {faq.question || "—"}
                        </h3>
                      </div>
                      <div>
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {/* Add FAQ Modal */}
      <Modal
        isOpen={showAddFaqModal}
        onClose={handleCloseAddFaqModal}
        title="Add New FAQ"
        size="lg"
      >
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
                    <li>
                      Provide comprehensive but easy-to-understand answers
                    </li>
                    <li>Use simple language and avoid technical jargon</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <FaqForm faq={editedFaq} onChange={setEditedFaq} isEditing={false} />

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleCloseAddFaqModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isAddingFaq}
            >
              Cancel
            </button>
            <button
              onClick={handleAddFaq}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={
                isAddingFaq ||
                !editedFaq.question.trim() ||
                !editedFaq.answer.trim()
              }
            >
              {isAddingFaq ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding FAQ...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add FAQ
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>{" "}
      {/* Edit FAQ Modal */}
      <Modal
        isOpen={showEditFaqModal}
        onClose={handleCloseEditFaqModal}
        title="Edit FAQ"
        size="lg"
      >
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
          <FaqForm faq={editedFaq} onChange={setEditedFaq} isEditing={true} />
          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleCloseEditFaqModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isUpdatingFaq}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateFaq}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={
                isUpdatingFaq ||
                !editedFaq.question.trim() ||
                !editedFaq.answer.trim()
              }
            >
              {isUpdatingFaq ? (
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
          </div>{" "}
        </div>
      </Modal>
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmDialog.isOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete FAQ"
        message={
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete this FAQ? This action cannot be
              undone.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">
                FAQ to be deleted:
              </h4>
              <div className="bg-white rounded-md p-3 border border-red-100">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Q: {deleteConfirmDialog.faqQuestion}
                </p>
                <p className="text-xs text-gray-500">
                  This will permanently remove this FAQ from your website.
                </p>
              </div>
            </div>
          </div>
        }
        confirmText="Delete FAQ"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
