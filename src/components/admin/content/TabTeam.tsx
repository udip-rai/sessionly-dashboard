import { useState, useEffect } from "react";
import { FiTrash2, FiEdit3, FiUser } from "react-icons/fi";
import { adminService, Team } from "../../../api/services/admin.service";
import { ConfirmModal, AddButton } from "../../ui";
import { useSimpleToast } from "../../toast";
import { AddTeamMember, EditTeamMember } from "./team";

export function TabTeam() {
  const toast = useSimpleToast();

  // Team-related state
  const [teamMembers, setTeamMembers] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal states
  const [showAddTeamModal, setShowAddTeamModal] = useState<boolean>(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState<boolean>(false);
  const [editingTeamMember, setEditingTeamMember] = useState<Team | null>(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    teamId: string | null;
    teamName: string;
  }>({ isOpen: false, teamId: null, teamName: "" });

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      console.log("Loading team members...");
      const teamData = await adminService.getAllTeamMembers();
      console.log("Team data received:", teamData);
      setTeamMembers(teamData);
    } catch (error: any) {
      console.error("Failed to load team members:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
      });
      toast.error(
        "Failed to load team members",
        error?.response?.data?.message || error?.message || "Unknown error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddTeamModal = () => {
    setShowAddTeamModal(true);
  };

  const handleCloseAddTeamModal = () => {
    setShowAddTeamModal(false);
  };

  const handleTeamMemberAdded = (newTeamMember: Team) => {
    setTeamMembers([...teamMembers, newTeamMember]);
  };

  const handleOpenEditTeamModal = (teamMember: Team) => {
    setEditingTeamMember(teamMember);
    setShowEditTeamModal(true);
  };

  const handleCloseEditTeamModal = () => {
    setEditingTeamMember(null);
    setShowEditTeamModal(false);
  };

  const handleTeamMemberUpdated = (updatedTeamMember: Team) => {
    setTeamMembers(
      teamMembers.map((member) =>
        member._id === updatedTeamMember._id ? updatedTeamMember : member,
      ),
    );
  };

  const handleOpenDeleteConfirm = (teamMember: Team) => {
    setDeleteConfirmDialog({
      isOpen: true,
      teamId: teamMember._id,
      teamName: teamMember.name,
    });
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmDialog({ isOpen: false, teamId: null, teamName: "" });
  };

  const handleDeleteTeamMember = async () => {
    if (!deleteConfirmDialog.teamId) return;

    try {
      await adminService.deleteTeamMember(deleteConfirmDialog.teamId);
      setTeamMembers(
        teamMembers.filter(
          (member) => member._id !== deleteConfirmDialog.teamId,
        ),
      );
      handleCloseDeleteConfirm();
      toast.success("Team Member Deleted", "Team member deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete team member:", error);
      toast.error(
        "Failed to delete team member",
        error?.response?.data?.message || "Please try again",
      );
    }
  };

  useEffect(() => {
    loadTeamMembers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading team members...</p>
          <p className="text-gray-400 text-sm mt-2">
            Please wait while we fetch the data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}{" "}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Team Management
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage your team members and their information
          </p>
        </div>
        <AddButton onClick={handleOpenAddTeamModal}>Add Team Member</AddButton>
      </div>
      {/* Team Members Grid */}
      {teamMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Team Member Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    style={{ transform: "scale(1.35)" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-navy/10 rounded-full flex items-center justify-center">
                      <FiUser className="w-8 h-8 text-navy/60" />
                    </div>
                  </div>
                )}
              </div>

              {/* Team Member Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{member.title}</p>
                  {member.description && (
                    <p className="text-gray-500 text-xs mt-2 line-clamp-2">
                      {member.description}
                    </p>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {member.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditTeamModal(member)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <FiEdit3 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleOpenDeleteConfirm(member)}
                    className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No team members found
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first team member.
          </p>{" "}
          <AddButton onClick={handleOpenAddTeamModal}>
            Add Team Member
          </AddButton>
        </div>
      )}
      {/* Add Team Member Modal */}
      <AddTeamMember
        isOpen={showAddTeamModal}
        onClose={handleCloseAddTeamModal}
        onTeamMemberAdded={handleTeamMemberAdded}
      />
      {/* Edit Team Member Modal */}
      <EditTeamMember
        isOpen={showEditTeamModal}
        onClose={handleCloseEditTeamModal}
        onTeamMemberUpdated={handleTeamMemberUpdated}
        teamMember={editingTeamMember}
      />
      {/* Delete Confirmation Modal */}{" "}
      <ConfirmModal
        isOpen={deleteConfirmDialog.isOpen}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleDeleteTeamMember}
        title="Delete Team Member"
        message={`Are you sure you want to delete "${deleteConfirmDialog.teamName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
