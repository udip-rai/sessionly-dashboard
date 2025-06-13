import { useState, useEffect } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { adminService, Team } from "../../../api/services/admin.service";
import { ConfirmModal, AddButton } from "../../ui";
import { AddTeamMember, EditTeamMember } from "./team";
import { toast } from "../../toast";

export function TabTeam() {
  // Team state
  const [teamMembers, setTeamMembers] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<Team | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    memberId: string | null;
    memberName: string;
  }>({ isOpen: false, memberId: null, memberName: "" });

  // Load team members on component mount
  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const members = await adminService.getAllTeamMembers();
      setTeamMembers(members);
    } catch (error: any) {
      console.error("Error loading team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleTeamMemberAdded = (newMember: Team) => {
    setTeamMembers((prev) => [...prev, newMember]);
  };

  const handleTeamMemberUpdated = (updatedMember: Team) => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member._id === updatedMember._id ? updatedMember : member,
      ),
    );
  };

  const handleEditMember = (member: Team) => {
    setEditingMember(member);
  };

  const handleDeleteMember = async () => {
    if (!deleteConfirmDialog.memberId) return;

    try {
      await adminService.deleteTeamMember(deleteConfirmDialog.memberId);
      setTeamMembers((prev) =>
        prev.filter((member) => member._id !== deleteConfirmDialog.memberId),
      );
      setDeleteConfirmDialog({ isOpen: false, memberId: null, memberName: "" });
      toast.success("Team member deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-600 mt-1">Manage your team members</p>
        </div>
        <AddButton onClick={() => setShowAddModal(true)} disabled={loading}>
          Add Team Member
        </AddButton>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading team members...
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No team members found. Create your first team member to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6 p-6">
            {teamMembers.map((member) => (
              <div
                key={member._id}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-navy/20 aspect-square flex flex-col"
              >
                {/* Member Image Section - Takes most of the space, 35% bigger */}
                <div className="relative flex-1 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ transform: "scale(1.35)" }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}

                  {/* Fallback Avatar - 35% bigger */}
                  <div
                    className={`${
                      member.image ? "hidden" : "flex"
                    } absolute inset-0 items-center justify-center bg-gradient-to-br from-navy/90 to-navy`}
                  >
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                      <span className="text-2xl font-bold text-white">
                        {member.name?.charAt(0)?.toUpperCase() || "T"}
                      </span>
                    </div>
                  </div>

                  {/* Subtle Gradient Overlay for images */}
                  {member.image && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  )}
                </div>

                {/* Member Info - Compact */}
                <div className="p-3 space-y-2 bg-white">
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">
                      {member.name}
                    </h3>
                    <p className="text-navy font-medium text-xs truncate">
                      {member.title}
                    </p>
                  </div>

                  {/* Actions - Compact */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditMember(member)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 text-xs font-medium"
                    >
                      <FiEdit2 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirmDialog({
                          isOpen: true,
                          memberId: member._id,
                          memberName: member.name,
                        })
                      }
                      className="flex items-center justify-center px-2 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                      title="Delete member"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Team Member Modal */}
      <AddTeamMember
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onTeamMemberAdded={handleTeamMemberAdded}
      />

      {/* Edit Team Member Modal */}
      {editingMember && (
        <EditTeamMember
          isOpen={!!editingMember}
          onClose={() => setEditingMember(null)}
          onTeamMemberUpdated={handleTeamMemberUpdated}
          teamMember={editingMember}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmDialog.isOpen}
        onClose={() =>
          setDeleteConfirmDialog({
            isOpen: false,
            memberId: null,
            memberName: "",
          })
        }
        onConfirm={handleDeleteMember}
        title="Delete Team Member"
        message={`Are you sure you want to delete "${deleteConfirmDialog.memberName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
