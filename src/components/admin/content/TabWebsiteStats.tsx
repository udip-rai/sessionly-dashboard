import { useState, useEffect } from "react";
import { FiTrash2, FiEdit3 } from "react-icons/fi";
import { adminService, WebsiteStat } from "../../../api/services/admin.service";
import { ConfirmModal, AddButton, TimestampBadges } from "../../ui";
import { useSimpleToast } from "./utils";
import { AddWebsiteStat, EditWebsiteStat } from "./website-stats";

export function TabWebsiteStats() {
  const toast = useSimpleToast();

  // Website Stats state
  const [stats, setStats] = useState<WebsiteStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  // Edit modal state
  const [editingStat, setEditingStat] = useState<WebsiteStat | null>(null);

  // Delete confirmation dialog
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    statId: string | null;
    statLabel: string;
  }>({ isOpen: false, statId: null, statLabel: "" });

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

  const handleStatAdded = (newStat: WebsiteStat) => {
    setStats([...stats, newStat].sort((a, b) => a.order - b.order));
    setShowAddModal(false);
  };

  const handleStatUpdated = (updatedStat: WebsiteStat) => {
    setStats(
      stats
        .map((stat) => (stat._id === updatedStat._id ? updatedStat : stat))
        .sort((a, b) => a.order - b.order),
    );
    setEditingStat(null);
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
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
          <p className="mt-2 text-gray-500">Loading Website Stats...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Website Stats Management
              </h2>
              <p className="text-sm text-gray-500">
                Manage website statistics displayed on your homepage
              </p>
            </div>
            <AddButton onClick={() => setShowAddModal(true)}>
              Add Stat
            </AddButton>
          </div>
          {/* Website Stats List */}
          {stats.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No website stats found</p>
              <AddButton
                onClick={() => setShowAddModal(true)}
                className="mx-auto"
              >
                Add Your First Stat
              </AddButton>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.map((stat) => (
                <div
                  key={stat._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <TimestampBadges
                          createdAt={stat.createdAt}
                          updatedAt={stat.updatedAt}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingStat(stat)}
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
                            {stat.label || "—"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-1">
                            Value
                          </h4>
                          <p className="text-2xl font-bold text-navy">
                            {stat.value || "—"}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <h4 className="text-sm font-medium text-gray-600 mb-1">
                          Description
                        </h4>
                        <p className="text-gray-700">
                          {stat.description || "—"}
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

      {/* Add Website Stat Modal */}
      {showAddModal && (
        <AddWebsiteStat
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onStatAdded={handleStatAdded}
        />
      )}
      {/* Edit Website Stat Modal */}
      {editingStat && (
        <EditWebsiteStat
          isOpen={!!editingStat}
          stat={editingStat}
          onStatUpdated={handleStatUpdated}
          onClose={() => setEditingStat(null)}
        />
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
