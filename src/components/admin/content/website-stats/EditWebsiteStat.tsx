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

  // Update form data when stat changes
  useEffect(() => {
    if (stat) {
      setStatData({
        label: stat.label,
        value: stat.value,
        description: stat.description,
        order: stat.order,
      });
    }
  }, [stat]);

  const handleClose = () => {
    setStatData({ label: "", value: "", description: "", order: 1 });
    setIsUpdating(false);
    onClose();
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

    try {
      setIsUpdating(true);
      const updatedStat = await adminService.updateWebsiteStat(stat._id, {
        label: statData.label,
        value: statData.value,
        description: statData.description,
        order: statData.order,
      });

      onStatUpdated(updatedStat);
      handleClose();
      toast.success("Website Stat Updated", "Stat updated successfully");
    } catch (error) {
      console.error("Failed to update website stat:", error);
      toast.error("Failed to update website stat", "Please try again");
    } finally {
      setIsUpdating(false);
    }
  };

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
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={
              isUpdating ||
              !statData.label.trim() ||
              !statData.value.trim() ||
              !statData.description.trim()
            }
          >
            {isUpdating ? (
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
  );
};
