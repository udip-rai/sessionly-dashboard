import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit3 } from "react-icons/fi";
import { adminService, WebsiteStat } from "../../../api/services/admin.service";
import { Modal, ConfirmModal, useToast } from "../../ui";

export function TabWebsiteStats() {
  // Use toast with fallback
  let toast;
  try {
    toast = useToast();
  } catch {
    // Fallback toast implementation
    toast = {
      success: (title: string, message?: string) =>
        alert(`✅ ${title}: ${message || ""}`),
      error: (title: string, message?: string) =>
        alert(`❌ ${title}: ${message || ""}`),
      warning: (title: string, message?: string) =>
        alert(`⚠️ ${title}: ${message || ""}`),
      info: (title: string, message?: string) =>
        alert(`ℹ️ ${title}: ${message || ""}`),
    };
  }

  // Website Stats state
  const [stats, setStats] = useState<WebsiteStat[]>([]);
  const [editedStat, setEditedStat] = useState<{
    label: string;
    value: string;
    description: string;
    order: number;
  }>({ label: "", value: "", description: "", order: 1 });
  const [isAddingStat, setIsAddingStat] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // Modal states
  const [showAddStatModal, setShowAddStatModal] = useState<boolean>(false);
  const [showEditStatModal, setShowEditStatModal] = useState<boolean>(false);
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [isUpdatingStat, setIsUpdatingStat] = useState<boolean>(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    statId: string | null;
    statLabel: string;
  }>({ isOpen: false, statId: null, statLabel: "" });

  // Input handlers with character limits
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setEditedStat({ ...editedStat, label: value });
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setEditedStat({ ...editedStat, value: value });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setEditedStat({ ...editedStat, description: value });
    }
  };

  // Website Stats handlers
  const loadWebsiteStats = async () => {
    try {
      setLoading(true);
      console.log("Loading Website Stats...");
      const statData = await adminService.getAllWebsiteStats();
      console.log("Website Stats data received:", statData);
      // Sort by order
      const sortedStats = statData.sort((a, b) => a.order - b.order);
      setStats(sortedStats);
    } catch (error: any) {
      console.error("Failed to load Website Stats:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
      });
      toast.error(
        "Failed to load Website Stats",
        error?.response?.data?.message || error?.message || "Unknown error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddStatModal = () => {
    const nextOrder =
      stats.length > 0 ? Math.max(...stats.map((s) => s.order)) + 1 : 1;
    setEditedStat({ label: "", value: "", description: "", order: nextOrder });
    setShowAddStatModal(true);
  };

  const handleCloseAddStatModal = () => {
    setEditedStat({ label: "", value: "", description: "", order: 1 });
    setShowAddStatModal(false);
    setIsAddingStat(false);
  };
  const handleAddStat = async () => {
    if (
      !editedStat.label.trim() ||
      !editedStat.value.trim() ||
      !editedStat.description.trim()
    ) {
      toast.error("Validation Error", "All fields are required");
      return;
    }

    try {
      setIsAddingStat(true);
      const newStat = await adminService.createWebsiteStat({
        label: editedStat.label,
        value: editedStat.value,
        description: editedStat.description,
        order: editedStat.order,
        isPublished: true, // Default to published
      });

      setStats([...stats, newStat].sort((a, b) => a.order - b.order));
      handleCloseAddStatModal();
      toast.success(
        "Website Stat Created",
        "Website stat created successfully",
      );
    } catch (error) {
      console.error("Failed to create website stat:", error);
      toast.error("Failed to create website stat", "Please try again");
    } finally {
      setIsAddingStat(false);
    }
  };

  const handleOpenEditStatModal = (stat: WebsiteStat) => {
    setEditedStat({
      label: stat.label,
      value: stat.value,
      description: stat.description,
      order: stat.order,
    });
    setEditingStatId(stat._id);
    setShowEditStatModal(true);
  };

  const handleCloseEditStatModal = () => {
    setEditedStat({ label: "", value: "", description: "", order: 1 });
    setEditingStatId(null);
    setShowEditStatModal(false);
    setIsUpdatingStat(false);
  };

  const handleUpdateStat = async () => {
    if (
      !editedStat.label.trim() ||
      !editedStat.value.trim() ||
      !editedStat.description.trim()
    ) {
      toast.error("Validation Error", "All fields are required");
      return;
    }

    if (!editingStatId) return;

    try {
      setIsUpdatingStat(true);
      const updatedStat = await adminService.updateWebsiteStat(editingStatId, {
        label: editedStat.label,
        value: editedStat.value,
        description: editedStat.description,
        order: editedStat.order,
      });

      setStats(
        stats
          .map((stat) => (stat._id === editingStatId ? updatedStat : stat))
          .sort((a, b) => a.order - b.order),
      );
      handleCloseEditStatModal();
      toast.success(
        "Website Stat Updated",
        "Website stat updated successfully",
      );
    } catch (error) {
      console.error("Failed to update website stat:", error);
      toast.error("Failed to update website stat", "Please try again");
    } finally {
      setIsUpdatingStat(false);
    }
  };

  const handleOpenDeleteDialog = (statId: string, label: string) => {
    setDeleteConfirmDialog({
      isOpen: true,
      statId,
      statLabel: label,
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteConfirmDialog({
      isOpen: false,
      statId: null,
      statLabel: "",
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmDialog.statId) return;

    try {
      await adminService.deleteWebsiteStat(deleteConfirmDialog.statId);
      setStats(stats.filter((stat) => stat._id !== deleteConfirmDialog.statId));
      toast.success(
        "Website Stat Deleted",
        "Website stat deleted successfully",
      );
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Failed to delete website stat:", error);
      toast.error("Failed to delete website stat", "Please try again");
    }
  };

  // Load Website Stats on component mount
  useEffect(() => {
    loadWebsiteStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Website Stats Management
          </h2>
          <p className="text-sm text-gray-500">
            Manage website statistics displayed on your homepage
          </p>
        </div>
        <button
          onClick={handleOpenAddStatModal}
          className="flex items-center px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90"
          disabled={loading}
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Stat
        </button>
      </div>

      {/* Add Website Stat Modal */}
      <Modal
        isOpen={showAddStatModal}
        onClose={handleCloseAddStatModal}
        title="Add New Website Stat"
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
                  Website Stat Guidelines
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Use clear, memorable labels (e.g., "Active Users",
                      "Sessions Completed")
                    </li>
                    <li>
                      Keep values concise and impressive (e.g., "50K+", "99%")
                    </li>
                    <li>Write descriptions that build trust and credibility</li>
                    <li>Order determines display sequence on the website</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label *
              </label>
              <input
                type="text"
                value={editedStat.label}
                onChange={handleLabelChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="e.g., Active Users, Sessions Completed"
                disabled={isAddingStat}
                autoFocus
              />
              <p className="mt-1 text-sm text-gray-500">
                Characters: {editedStat.label.length}/50
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value *
              </label>
              <input
                type="text"
                value={editedStat.value}
                onChange={handleValueChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="e.g., 50K+, 99%, 1000+"
                disabled={isAddingStat}
              />
              <p className="mt-1 text-sm text-gray-500">
                Characters: {editedStat.value.length}/20
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={editedStat.description}
                onChange={handleDescriptionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="e.g., Trusted globally by professionals"
                disabled={isAddingStat}
              />
              <p className="mt-1 text-sm text-gray-500">
                Characters: {editedStat.description.length}/100
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order *
              </label>
              <input
                type="number"
                value={editedStat.order}
                onChange={(e) =>
                  setEditedStat({
                    ...editedStat,
                    order: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                min="1"
                disabled={isAddingStat}
              />
              <p className="mt-1 text-sm text-gray-500">
                Lower numbers appear first on the website
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleCloseAddStatModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isAddingStat}
            >
              Cancel
            </button>
            <button
              onClick={handleAddStat}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={
                isAddingStat ||
                !editedStat.label.trim() ||
                !editedStat.value.trim() ||
                !editedStat.description.trim()
              }
            >
              {isAddingStat ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding Stat...
                </>
              ) : (
                <>
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add Stat
                </>
              )}
            </button>
          </div>
        </div>{" "}
      </Modal>

      {/* Edit Website Stat Modal */}
      <Modal
        isOpen={showEditStatModal}
        onClose={handleCloseEditStatModal}
        title="Edit Website Stat"
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
                  Edit Website Stat Guidelines
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Update labels to be clear and memorable</li>
                    <li>Keep values concise and impressive</li>
                    <li>Write descriptions that build trust and credibility</li>
                    <li>
                      Adjust order to control display sequence on the website
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label *
              </label>
              <input
                type="text"
                value={editedStat.label}
                onChange={handleLabelChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="e.g., Active Users, Sessions Completed"
                disabled={isUpdatingStat}
                autoFocus
              />
              <p className="mt-1 text-sm text-gray-500">
                Characters: {editedStat.label.length}/50
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value *
              </label>
              <input
                type="text"
                value={editedStat.value}
                onChange={handleValueChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="e.g., 50K+, 99%, 1000+"
                disabled={isUpdatingStat}
              />
              <p className="mt-1 text-sm text-gray-500">
                Characters: {editedStat.value.length}/20
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={editedStat.description}
                onChange={handleDescriptionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="e.g., Trusted globally by professionals"
                disabled={isUpdatingStat}
              />
              <p className="mt-1 text-sm text-gray-500">
                Characters: {editedStat.description.length}/100
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order *
              </label>
              <input
                type="number"
                value={editedStat.order}
                onChange={(e) =>
                  setEditedStat({
                    ...editedStat,
                    order: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                min="1"
                disabled={isUpdatingStat}
              />
              <p className="mt-1 text-sm text-gray-500">
                Lower numbers appear first on the website
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleCloseEditStatModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isUpdatingStat}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStat}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={
                isUpdatingStat ||
                !editedStat.label.trim() ||
                !editedStat.value.trim() ||
                !editedStat.description.trim()
              }
            >
              {isUpdatingStat ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Updating Stat...
                </>
              ) : (
                <>
                  <FiEdit3 className="w-4 h-4 mr-2" />
                  Update Stat
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
          <p className="mt-2 text-gray-500">Loading Website Stats...</p>
        </div>
      )}

      {/* Website Stats List */}
      {!loading && (
        <div className="space-y-4">
          {stats.map((stat) => (
            <div
              key={stat._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                {" "}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Enhanced timestamp styling */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full">
                        <svg
                          className="w-3.5 h-3.5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-xs font-medium text-purple-700">
                          Created:{" "}
                          {new Date(stat.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>

                      {stat.updatedAt !== stat.createdAt && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full">
                          <svg
                            className="w-3.5 h-3.5 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          <span className="text-xs font-medium text-orange-700">
                            Updated:{" "}
                            {new Date(stat.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full">
                        <svg
                          className="w-3.5 h-3.5 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                          />
                        </svg>
                        <span className="text-xs font-medium text-indigo-700">
                          Order #{stat.order}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                        <svg
                          className="w-3.5 h-3.5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span className="text-xs font-medium text-green-700">
                          {stat.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditStatModal(stat)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      disabled={loading}
                      title="Edit Website Stat"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleOpenDeleteDialog(stat._id, stat.label)
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      disabled={loading}
                      title="Delete Website Stat"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>{" "}
                <div className="bg-gradient-to-r from-navy/5 to-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">
                        Label
                      </h4>
                      <p className="font-semibold text-gray-900">
                        {stat.label}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">
                        Value
                      </h4>
                      <p className="text-2xl font-bold text-navy">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">
                      Description
                    </h4>
                    <p className="text-gray-700">{stat.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && stats.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No website stats found</p>
          <button
            onClick={handleOpenAddStatModal}
            className="flex items-center px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90 mx-auto"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Your First Stat
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmDialog.isOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Website Stat"
        message={
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete this website stat? This action
              cannot be undone.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">
                Stat to be deleted:
              </h4>
              <div className="bg-white rounded-md p-3 border border-red-100">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {deleteConfirmDialog.statLabel}
                </p>
                <p className="text-xs text-gray-500">
                  This will permanently remove this statistic from your website.
                </p>
              </div>
            </div>
          </div>
        }
        confirmText="Delete Stat"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
