import { useState, useEffect } from "react";
import { FiSave } from "react-icons/fi";
import { adminService, Team } from "../../../../api/services/admin.service";
import { Modal } from "../../../ui";
import { TeamForm } from "./TeamForm";
import { useSimpleToast } from "../../../toast";

export interface EditTeamMemberProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamMemberUpdated: (teamMember: Team) => void;
  teamMember: Team | null;
}

export const EditTeamMember = ({
  isOpen,
  onClose,
  onTeamMemberUpdated,
  teamMember,
}: EditTeamMemberProps) => {
  const toast = useSimpleToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [teamData, setTeamData] = useState({
    name: "",
    title: "",
    image: null as string | File | null,
  });

  // Track original values to detect changes
  const [originalData, setOriginalData] = useState({
    name: "",
    title: "",
    image: null as string | null,
  });

  // Initialize form data when team member changes
  useEffect(() => {
    if (teamMember) {
      const initialData = {
        name: teamMember.name || "",
        title: teamMember.title || "",
        image: teamMember.image || null,
      };
      setTeamData(initialData);
      setOriginalData({
        name: teamMember.name || "",
        title: teamMember.title || "",
        image: teamMember.image || null,
      });
    } else {
      setTeamData({
        name: "",
        title: "",
        image: null,
      });
      setOriginalData({
        name: "",
        title: "",
        image: null,
      });
    }
  }, [teamMember]);
  const handleClose = () => {
    if (teamMember) {
      const initialData = {
        name: teamMember.name || "",
        title: teamMember.title || "",
        image: teamMember.image || null,
      };
      setTeamData(initialData);
    }
    setIsUpdating(false);
    onClose();
  };

  // Helper function to detect what fields have changed
  const getChangedFields = () => {
    const changes: any = {};

    if (teamData.name.trim() !== originalData.name) {
      changes.name = teamData.name.trim();
    }

    if (teamData.title.trim() !== originalData.title) {
      changes.title = teamData.title.trim();
    }

    // Check if image has changed
    if (teamData.image instanceof File) {
      // New file uploaded
      changes.image = teamData.image;
    } else if (
      typeof teamData.image === "string" &&
      teamData.image !== originalData.image
    ) {
      // Image URL changed
      changes.imageUrl = teamData.image;
    } else if (teamData.image === null && originalData.image !== null) {
      // Image removed
      changes.removeImage = true;
    }

    return changes;
  };

  const handleUpdate = async () => {
    if (!teamMember) return;

    if (!teamData.name.trim() || !teamData.title.trim()) {
      toast.error("Validation Error", "Name and title are required");
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

      // Create FormData only with changed fields
      const formData = new FormData();

      // Add changed fields
      if (changedFields.name) {
        formData.append("name", changedFields.name);
      }

      if (changedFields.title) {
        formData.append("title", changedFields.title);
      }

      // Handle image changes
      if (changedFields.image) {
        formData.append("image", changedFields.image);
      } else if (changedFields.imageUrl) {
        formData.append("imageUrl", changedFields.imageUrl);
      } else if (changedFields.removeImage) {
        formData.append("removeImage", "true");
      }

      // Always preserve existing fields that weren't changed
      formData.append("description", teamMember.description || "");
      formData.append("isPublished", teamMember.isPublished ? "true" : "false");
      formData.append(
        "socialLinks",
        JSON.stringify(teamMember.socialLinks || []),
      );

      const updatedTeamMember = await adminService.updateTeamMemberWithFormData(
        teamMember._id,
        formData,
      );

      onTeamMemberUpdated(updatedTeamMember);
      handleClose();

      // Show specific success message about what was changed
      const changedFieldNames = Object.keys(changedFields)
        .filter((key) => !key.includes("image"))
        .join(", ");
      const imageChanged =
        changedFields.image ||
        changedFields.imageUrl ||
        changedFields.removeImage;
      const changesList = [
        changedFieldNames && `${changedFieldNames}`,
        imageChanged && "image",
      ]
        .filter(Boolean)
        .join(", ");

      toast.success(
        "Team Member Updated",
        `Successfully updated: ${changesList || "team member"}`,
      );
    } catch (error) {
      console.error("Failed to update team member:", error);
      toast.error("Failed to update team member", "Please try again");
    } finally {
      setIsUpdating(false);
    }
  };
  if (!teamMember) return null;

  // Check if there are any changes
  const changedFields = getChangedFields();
  const hasChanges = Object.keys(changedFields).length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Team Member"
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
                Editing: {teamMember.name}
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Update the team member's information below. Only changed
                  fields will be saved.
                </p>
                {hasChanges && (
                  <p className="mt-1 text-xs text-green-600 font-medium">
                    • {Object.keys(changedFields).length} field(s) modified
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <TeamForm
          teamData={teamData}
          onChange={setTeamData}
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
                ? "text-white bg-blue-600 hover:bg-blue-700"
                : "text-gray-500 bg-gray-200 cursor-not-allowed"
            }`}
            disabled={
              isUpdating ||
              !teamData.name.trim() ||
              !teamData.title.trim() ||
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
                <FiSave className="w-4 h-4 mr-2" />
                {hasChanges
                  ? `Save Changes (${Object.keys(changedFields).length})`
                  : "No Changes"}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
