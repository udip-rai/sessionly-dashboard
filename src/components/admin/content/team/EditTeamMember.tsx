import { useState, useEffect } from "react";
import { FiSave } from "react-icons/fi";
import { adminService, Team } from "../../../../api/services/admin.service";
import { Modal } from "../../../ui";
import { TeamForm, SocialLink } from "./TeamForm";
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
    description: "",
    image: null as string | File | null,
    socialLinks: [] as SocialLink[],
  });

  // Track original values to detect changes
  const [originalData, setOriginalData] = useState({
    name: "",
    title: "",
    description: "",
    image: null as string | null,
    socialLinks: [] as SocialLink[],
  });

  // Initialize form data when team member changes
  useEffect(() => {
    if (teamMember) {
      // Safely parse social links with error handling
      let parsedSocialLinks: SocialLink[] = [{ platform: "LinkedIn", url: "" }];

      try {
        if (teamMember.socialLinks) {
          console.log("Raw socialLinks from API:", teamMember.socialLinks);
          console.log("Type of socialLinks:", typeof teamMember.socialLinks);

          if (typeof teamMember.socialLinks === "string") {
            // Parse JSON string
            const parsed = JSON.parse(teamMember.socialLinks);
            parsedSocialLinks = Array.isArray(parsed)
              ? parsed
              : [{ platform: "LinkedIn", url: "" }];
          } else if (Array.isArray(teamMember.socialLinks)) {
            // Array format - check if it contains JSON strings or objects
            if (
              teamMember.socialLinks.length > 0 &&
              typeof teamMember.socialLinks[0] === "string" &&
              teamMember.socialLinks[0].startsWith("[")
            ) {
              // Array contains JSON string(s) - parse the first one
              try {
                console.log(
                  "Parsing JSON string from array:",
                  teamMember.socialLinks[0],
                );
                const parsed = JSON.parse(teamMember.socialLinks[0]);
                console.log("Parsed result:", parsed);
                parsedSocialLinks = Array.isArray(parsed)
                  ? parsed
                  : [{ platform: "LinkedIn", url: "" }];
              } catch (parseError) {
                console.error(
                  "Error parsing JSON string from array:",
                  parseError,
                );
                // Fallback to default
                parsedSocialLinks = [{ platform: "LinkedIn", url: "" }];
              }
            } else if (
              teamMember.socialLinks.length > 0 &&
              typeof teamMember.socialLinks[0] === "object"
            ) {
              parsedSocialLinks = teamMember.socialLinks as SocialLink[];
            } else {
              // Convert old format string array to new format
              parsedSocialLinks = teamMember.socialLinks.map((link: any) => ({
                platform: "LinkedIn",
                url: typeof link === "string" ? link : "",
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error parsing social links:", error);
        parsedSocialLinks = [{ platform: "LinkedIn", url: "" }];
      }

      console.log("Final parsed social links:", parsedSocialLinks);

      const initialData = {
        name: teamMember.name || "",
        title: teamMember.title || "",
        description: teamMember.description || "",
        image: teamMember.image || null,
        socialLinks: parsedSocialLinks,
      };
      setTeamData(initialData);
      setOriginalData({
        name: teamMember.name || "",
        title: teamMember.title || "",
        description: teamMember.description || "",
        image: teamMember.image || null,
        socialLinks: parsedSocialLinks,
      });
    } else {
      setTeamData({
        name: "",
        title: "",
        description: "",
        image: null,
        socialLinks: [{ platform: "LinkedIn", url: "" }],
      });
      setOriginalData({
        name: "",
        title: "",
        description: "",
        image: null,
        socialLinks: [],
      });
    }
  }, [teamMember]);
  const handleClose = () => {
    if (teamMember) {
      // Safely parse social links with error handling
      let parsedSocialLinks: SocialLink[] = [{ platform: "LinkedIn", url: "" }];

      try {
        if (teamMember.socialLinks) {
          if (typeof teamMember.socialLinks === "string") {
            const parsed = JSON.parse(teamMember.socialLinks);
            parsedSocialLinks = Array.isArray(parsed)
              ? parsed
              : [{ platform: "LinkedIn", url: "" }];
          } else if (Array.isArray(teamMember.socialLinks)) {
            // Array format - check if it contains JSON strings or objects
            if (
              teamMember.socialLinks.length > 0 &&
              typeof teamMember.socialLinks[0] === "string" &&
              teamMember.socialLinks[0].startsWith("[")
            ) {
              // Array contains JSON string(s) - parse the first one
              try {
                const parsed = JSON.parse(teamMember.socialLinks[0]);
                parsedSocialLinks = Array.isArray(parsed)
                  ? parsed
                  : [{ platform: "LinkedIn", url: "" }];
              } catch (parseError) {
                console.error(
                  "Error parsing JSON string from array on close:",
                  parseError,
                );
                parsedSocialLinks = [{ platform: "LinkedIn", url: "" }];
              }
            } else if (
              teamMember.socialLinks.length > 0 &&
              typeof teamMember.socialLinks[0] === "object"
            ) {
              parsedSocialLinks = teamMember.socialLinks as SocialLink[];
            } else {
              parsedSocialLinks = teamMember.socialLinks.map((link: any) => ({
                platform: "LinkedIn",
                url: typeof link === "string" ? link : "",
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error parsing social links on close:", error);
        parsedSocialLinks = [{ platform: "LinkedIn", url: "" }];
      }

      const initialData = {
        name: teamMember.name || "",
        title: teamMember.title || "",
        description: teamMember.description || "",
        image: teamMember.image || null,
        socialLinks: parsedSocialLinks,
      };
      setTeamData(initialData);
    }
    setIsUpdating(false);
    onClose();
  }; // Helper function to detect what fields have changed
  const getChangedFields = (): {
    name?: string;
    title?: string;
    description?: string;
    socialLinks?: SocialLink[];
    image?: File | string;
    imageUrl?: string;
    removeImage?: boolean;
  } => {
    const changes: {
      name?: string;
      title?: string;
      description?: string;
      socialLinks?: SocialLink[];
      image?: File | string;
      imageUrl?: string;
      removeImage?: boolean;
    } = {};

    if (teamData.name.trim() !== originalData.name) {
      changes.name = teamData.name.trim();
    }

    if (teamData.title.trim() !== originalData.title) {
      changes.title = teamData.title.trim();
    }

    if (teamData.description.trim() !== originalData.description) {
      changes.description = teamData.description.trim();
    }

    // Check if social links have changed
    if (
      JSON.stringify(teamData.socialLinks) !==
      JSON.stringify(originalData.socialLinks)
    ) {
      changes.socialLinks = teamData.socialLinks;
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

      if (changedFields.description) {
        formData.append("description", changedFields.description);
      }

      if (changedFields.socialLinks) {
        formData.append(
          "socialLinks",
          JSON.stringify(changedFields.socialLinks),
        );
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
      if (!changedFields.description) {
        formData.append("description", teamMember.description || "");
      }
      formData.append("isPublished", teamMember.isPublished ? "true" : "false");
      if (!changedFields.socialLinks) {
        formData.append(
          "socialLinks",
          JSON.stringify(teamMember.socialLinks || []),
        );
      }

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
