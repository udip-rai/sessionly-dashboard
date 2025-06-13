import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { adminService, Team } from "../../../../api/services/admin.service";
import { Modal } from "../../../ui";
import { TeamForm, SocialLink } from "./TeamForm";
import { useSimpleToast } from "../../../toast";

export interface AddTeamMemberProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamMemberAdded: (teamMember: Team) => void;
}

export const AddTeamMember = ({
  isOpen,
  onClose,
  onTeamMemberAdded,
}: AddTeamMemberProps) => {
  const toast = useSimpleToast();
  const [isAdding, setIsAdding] = useState(false);
  const [teamData, setTeamData] = useState({
    name: "",
    title: "",
    description: "",
    image: null as string | File | null,
    socialLinks: [{ platform: "LinkedIn", url: "" }] as SocialLink[],
  });
  const handleClose = () => {
    setTeamData({
      name: "",
      title: "",
      description: "",
      image: null,
      socialLinks: [{ platform: "LinkedIn", url: "" }],
    });
    setIsAdding(false);
    onClose();
  };

  const handleAdd = async () => {
    if (!teamData.name.trim() || !teamData.title.trim()) {
      toast.error("Validation Error", "Name and title are required");
      return;
    }

    try {
      setIsAdding(true);

      // Create FormData for the request
      const formData = new FormData();
      formData.append("name", teamData.name.trim());
      formData.append("title", teamData.title.trim());
      formData.append("description", teamData.description.trim());
      formData.append("isPublished", "true");

      // Handle image - only append if it's a File object
      if (teamData.image instanceof File) {
        formData.append("image", teamData.image);
      }

      // Add social links as JSON string
      formData.append("socialLinks", JSON.stringify(teamData.socialLinks));

      const newTeamMember = await adminService.createTeamMemberWithFormData(
        formData,
      );

      onTeamMemberAdded(newTeamMember);
      handleClose();
      toast.success("Team Member Added", "Team member created successfully");
    } catch (error) {
      console.error("Failed to create team member:", error);
      toast.error("Failed to create team member", "Please try again");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Team Member"
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
                Team Member Guidelines
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use professional profile images with good lighting</li>
                  <li>Keep job titles concise and descriptive</li>
                  <li>
                    Ensure names are spelled correctly and formatted
                    consistently
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <TeamForm
          teamData={teamData}
          onChange={setTeamData}
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
              isAdding || !teamData.name.trim() || !teamData.title.trim()
            }
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Adding Team Member...
              </>
            ) : (
              <>
                <FiPlus className="w-4 h-4 mr-2" />
                Add Team Member
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
