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

  // Initialize form data when team member changes
  useEffect(() => {
    if (teamMember) {
      setTeamData({
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
    }
  }, [teamMember]);

  const handleClose = () => {
    if (teamMember) {
      setTeamData({
        name: teamMember.name || "",
        title: teamMember.title || "",
        image: teamMember.image || null,
      });
    }
    setIsUpdating(false);
    onClose();
  };

  const handleUpdate = async () => {
    if (!teamMember) return;

    if (!teamData.name.trim() || !teamData.title.trim()) {
      toast.error("Validation Error", "Name and title are required");
      return;
    }

    try {
      setIsUpdating(true);

      // Create FormData for the request
      const formData = new FormData();
      formData.append("name", teamData.name.trim());
      formData.append("title", teamData.title.trim());
      formData.append("description", teamMember.description || "");
      formData.append("isPublished", teamMember.isPublished ? "true" : "false");

      // Handle image - only append if it's a new File object
      if (teamData.image instanceof File) {
        formData.append("image", teamData.image);
      } else if (
        typeof teamData.image === "string" &&
        teamData.image !== teamMember.image
      ) {
        // If image is a string and different from original, it might be a URL update
        formData.append("imageUrl", teamData.image);
      }

      // Preserve existing social links
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
      toast.success("Team Member Updated", "Team member updated successfully");
    } catch (error) {
      console.error("Failed to update team member:", error);
      toast.error("Failed to update team member", "Please try again");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!teamMember) return null;

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
                  Update the team member's information below. Changes will be
                  saved immediately.
                </p>
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
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={
              isUpdating || !teamData.name.trim() || !teamData.title.trim()
            }
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Updating Team Member...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4 mr-2" />
                Update Team Member
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
