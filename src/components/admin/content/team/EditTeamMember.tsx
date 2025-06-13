import { useState, useEffect } from "react";
import { FiEdit3 } from "react-icons/fi";
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
    image: "",
  });

  // Update form data when teamMember changes
  useEffect(() => {
    if (teamMember) {
      setTeamData({
        name: teamMember.name,
        title: teamMember.title,
        image: teamMember.image || "",
      });
    }
  }, [teamMember]);

  const handleClose = () => {
    setTeamData({ name: "", title: "", image: "" });
    setIsUpdating(false);
    onClose();
  };

  const handleUpdate = async () => {
    if (!teamMember || !teamData.name.trim() || !teamData.title.trim()) {
      toast.error("Validation Error", "Name and title are required");
      return;
    }

    try {
      setIsUpdating(true);
      const updatedTeamMember = await adminService.updateTeamMember(
        teamMember._id,
        {
          name: teamData.name.trim(),
          title: teamData.title.trim(),
          description: "",
          image: teamData.image.trim(),
          socialLinks: [],
        },
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
      title={`Edit Team Member - ${teamMember.name}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Current member info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            {teamMember.image ? (
              <img
                src={teamMember.image}
                alt={teamMember.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-lg">
                  {teamMember.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Currently editing: {teamMember.name}
              </h3>
              <p className="text-sm text-gray-600">{teamMember.title}</p>
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
                <FiEdit3 className="w-4 h-4 mr-2" />
                Update Team Member
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
