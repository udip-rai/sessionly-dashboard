import { useState, useEffect } from "react";
import { FiSave, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { adminService, FAQ } from "../../../api/services/admin.service";

// Simple toast function for now
const showToast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
};

export function TabFaq() {
  // FAQ-related state
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editedFaq, setEditedFaq] = useState<{
    question: string;
    answer: string;
  }>({ question: "", answer: "" });
  const [isAddingFaq, setIsAddingFaq] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // FAQ handlers
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
      showToast.error(
        `Failed to load FAQs: ${
          error?.response?.data?.message || error?.message || "Unknown error"
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelFaq = () => {
    setEditedFaq({ question: "", answer: "" });
    setIsAddingFaq(false);
  };

  const handleAddFaq = async () => {
    if (!editedFaq.question.trim() || !editedFaq.answer.trim()) {
      showToast.error("Question and answer are required");
      return;
    }

    try {
      setLoading(true);
      const newFaq = await adminService.createFAQ({
        question: editedFaq.question,
        answer: editedFaq.answer,
        isPublished: false, // Default to unpublished
      });

      setFaqs([...faqs, newFaq]);
      setIsAddingFaq(false);
      setEditedFaq({ question: "", answer: "" });
      showToast.success("FAQ created successfully");
    } catch (error) {
      console.error("Failed to create FAQ:", error);
      showToast.error("Failed to create FAQ");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) {
      return;
    }

    try {
      setLoading(true);
      await adminService.deleteFAQ(faqId);
      setFaqs(faqs.filter((faq) => faq._id !== faqId));
      showToast.success("FAQ deleted successfully");
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
      showToast.error("Failed to delete FAQ");
    } finally {
      setLoading(false);
    }
  };

  // Load FAQs on component mount
  useEffect(() => {
    loadFAQs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">FAQ Management</h2>
          <p className="text-sm text-gray-500">
            Manage frequently asked questions
          </p>
        </div>
        <button
          onClick={() => setIsAddingFaq(true)}
          className="flex items-center px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90"
          disabled={loading}
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add FAQ
        </button>
      </div>

      {/* Add FAQ Form */}
      {isAddingFaq && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Add New FAQ
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <input
                type="text"
                value={editedFaq.question}
                onChange={(e) =>
                  setEditedFaq({ ...editedFaq, question: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Enter the question..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer
              </label>
              <textarea
                value={editedFaq.answer}
                onChange={(e) =>
                  setEditedFaq({ ...editedFaq, answer: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Enter the answer..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddFaq}
                className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                disabled={loading}
              >
                <FiSave className="w-4 h-4 mr-2" />
                {loading ? "Adding..." : "Add FAQ"}
              </button>
              <button
                onClick={handleCancelFaq}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200"
              >
                <FiX className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
          <p className="mt-2 text-gray-500">Loading FAQs...</p>
        </div>
      )}

      {/* FAQ List */}
      {!loading && (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {/* <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-gray-500">
                        v{faq.version}
                      </span>
                    </div> */}
                    <p className="text-sm text-gray-500">
                      {new Date(faq.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {faq.updatedAt !== faq.createdAt && (
                        <span className="ml-4">
                          Updated:{" "}
                          {new Date(faq.updatedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteFaq(faq._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      disabled={loading}
                      title="Delete FAQ"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && faqs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No FAQs found</p>
          <button
            onClick={() => setIsAddingFaq(true)}
            className="flex items-center px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90 mx-auto"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Your First FAQ
          </button>
        </div>
      )}
    </div>
  );
}
