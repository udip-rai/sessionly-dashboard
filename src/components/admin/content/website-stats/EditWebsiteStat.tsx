import { useState, useEffect } from "react";
import { FiEdit3 } from "react-icons/fi";
import {
  adminService,
  WebsiteStat,
} from "../../../../api/services/admin.service";
import { Modal } from "../../../ui";
import { WebsiteStatForm } from "./WebsiteStatForm";
import { useSimpleToast } from "../../../toast";

export interface EditWebsiteStatProps {
  isOpen: boolean;
  onClose: () => void;
  onStatUpdated: (stat: WebsiteStat) => void;
  stat: WebsiteStat | null;
}

export const EditWebsiteStat = ({
  isOpen,
  onClose,
  onStatUpdated,
  stat,
}: EditWebsiteStatProps) => {
  const toast = useSimpleToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [statData, setStatData] = useState({
    label: "",
    value: "",
    description: "",
    order: 1,
  });

  // Track original values to detect changes
  const [originalData, setOriginalData] = useState({
    label: "",
    value: "",
    description: "",
    order: 1,
  });

  // Update form data when stat changes
  useEffect(() => {
    if (stat) {
      const initialData = {
        label: stat.label || "",
        value: stat.value || "",
        description: stat.description || "",
        order: stat.order || 1,
      };
      setStatData(initialData);
      setOriginalData(initialData);
    }
  }, [stat]);

  const handleClose = () => {
    setStatData({ label: "", value: "", description: "", order: 1 });
    setOriginalData({ label: "", value: "", description: "", order: 1 });
    setIsUpdating(false);
    onClose();
  };

  // Helper function to detect what fields have changed
  const getChangedFields = () => {
    const changes: any = {};
    
    if (statData.label.trim() !== originalData.label) {
      changes.label = statData.label.trim();
    }
    
    if (statData.value.trim() !== originalData.value) {
      changes.value = statData.value.trim();
    }
    
    if (statData.description.trim() !== originalData.description) {
      changes.description = statData.description.trim();
    }
    
    if (statData.order !== originalData.order) {
      changes.order = statData.order;
    }
    
    return changes;
  };

  const handleUpdate = async () => {
    if (
      !stat ||
      !statData.label.trim() ||
      !statData.value.trim() ||
      !statData.description.trim()
    ) {
      toast.error("Validation Error", "All fields are required");
      return;
    }

    const changedFields = getChangedFields();
    
    // Check if anything actually changed
    if (Object.keys(changedFields).length === 0) {
      toast.warning("No Changes", "No changes detected to save");
      return;
    }

    try {
      setIsUpdating(true);
      const updatedStat = await adminService.updateWebsiteStat(stat._id, changedFields);

      onStatUpdated(updatedStat);
      handleClose();
      
      // Show specific success message about what was changed
      const changesList = Object.keys(changedFields).join(', ');
      toast.success("Website Stat Updated", `Successfully updated: ${changesList}`);
    } catch (error) {
      console.error("Failed to update website stat:", error);
      toast.error("Failed to update website stat", "Please try again");
    } finally {
      setIsUpdating(false);
    }
  };
  if (!stat) return null;

  // Check if there are any changes
  const changedFields = getChangedFields();
  const hasChanges = Object.keys(changedFields).length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
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
                <p>Update the website stat content below. Only changed fields will be saved.</p>
                {hasChanges && (
                  <p className="mt-1 text-xs text-green-600 font-medium">
                    • {Object.keys(changedFields).length} field(s) modified
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <WebsiteStatForm
          stat={statData}
          onChange={setStatData}
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
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
              hasChanges 
                ? 'text-white bg-blue-600 hover:bg-blue-700' 
                : 'text-gray-500 bg-gray-200 cursor-not-allowed'
            }`}
            disabled={
              isUpdating ||
              !statData.label.trim() ||
              !statData.value.trim() ||
              !statData.description.trim() ||
              !hasChanges
            }
            title={!hasChanges ? "No changes to save" : "Save changes"}
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <FiEdit3 className="w-4 h-4 mr-2" />
                {hasChanges ? `Save Changes (${Object.keys(changedFields).length})` : 'No Changes'}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
