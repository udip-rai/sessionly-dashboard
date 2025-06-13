import { FiSave } from "react-icons/fi";
import {
  StaticPage,
  HomePageContent,
  AboutPageContent,
  TeamPageContent,
} from "../../../../api/services/admin.service";
import { Modal } from "../../../ui";
import { toast } from "../../../toast";
import { StaticPageForm } from "./StaticPageForm";
import { StaticPageFormData } from "./useStaticPageData";

interface StaticPageModalProps {
  isOpen: boolean;
  editingPage: StaticPage | null;
  formData: StaticPageFormData;
  selectedPageType: "home" | "about" | "team";
  isCreating: boolean;
  modalRenderKey: number;
  pageTypeExists: (type: "home" | "about" | "team") => boolean;
  onClose: () => void;
  onPageTypeChange: (type: "home" | "about" | "team") => void;
  onFormDataChange: (data: StaticPageFormData) => void;
  onLoadDefaultAbout: () => void;
  onLoadDefaultHome: () => void;
  onLoadDefaultTeam: () => void;
  onCreate: (
    type: "home" | "about" | "team",
    title: string,
    content: HomePageContent | AboutPageContent | TeamPageContent,
  ) => Promise<void>;
  onUpdate: (
    pageId: string,
    updates: {
      title?: string;
      content?: HomePageContent | AboutPageContent | TeamPageContent;
    },
  ) => Promise<void>;
  getChangedFields: () => {
    title?: string;
    content?: HomePageContent | AboutPageContent | TeamPageContent;
  };
}

export const StaticPageModal = ({
  isOpen,
  editingPage,
  formData,
  selectedPageType,
  isCreating,
  modalRenderKey,
  pageTypeExists,
  onClose,
  onPageTypeChange,
  onFormDataChange,
  onLoadDefaultAbout,
  onLoadDefaultHome,
  onLoadDefaultTeam,
  onCreate,
  onUpdate,
  getChangedFields,
}: StaticPageModalProps) => {
  const handleTitleChange = (title: string) => {
    onFormDataChange({ ...formData, title });
  };

  const handleContentChange = (
    content: HomePageContent | AboutPageContent | TeamPageContent,
  ) => {
    onFormDataChange({
      ...formData,
      content: JSON.parse(JSON.stringify(content)),
    });
  };

  const handleCreatePage = async () => {
    try {
      await onCreate(selectedPageType, formData.title, formData.content);
      onClose();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleUpdatePage = async () => {
    if (!editingPage) return;

    if (!formData.title.trim()) {
      toast.error("Validation Error", "Page title is required");
      return;
    }

    const changedFields = getChangedFields();

    // Check if anything actually changed
    if (Object.keys(changedFields).length === 0) {
      toast.warning("No Changes", "No changes detected to save");
      return;
    }

    try {
      await onUpdate(editingPage._id, changedFields);
      onClose();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const changedFields = getChangedFields();
  const hasChanges = Object.keys(changedFields).length > 0;
  const isFormValid = editingPage
    ? formData.title.trim() // For editing, only check title
    : formData.title.trim() && !pageTypeExists(selectedPageType); // For creating, check title and uniqueness

  return (
    <Modal
      key={`modal-${modalRenderKey}`}
      isOpen={isOpen}
      onClose={onClose}
      title={editingPage ? "Edit Static Page" : "Create New Static Page"}
      size="xl"
    >
      <div className="space-y-6">
        {/* Smart Edit Info Banner (only show when editing) */}
        {editingPage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
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
                  Edit Static Page Guidelines
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Update the page content below. Only changed fields will be
                    saved.
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
        )}{" "}
        <StaticPageForm
          selectedPageType={selectedPageType}
          formData={formData}
          editingPage={editingPage}
          pageTypeExists={pageTypeExists}
          onPageTypeChange={onPageTypeChange}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
          onLoadDefaultAbout={onLoadDefaultAbout}
          onLoadDefaultHome={onLoadDefaultHome}
          onLoadDefaultTeam={onLoadDefaultTeam}
        />
        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={isCreating}
          >
            Cancel
          </button>
          <button
            onClick={editingPage ? handleUpdatePage : handleCreatePage}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
              editingPage
                ? hasChanges && isFormValid
                  ? "text-white bg-blue-600 hover:bg-blue-700"
                  : "text-gray-500 bg-gray-200 cursor-not-allowed"
                : isFormValid
                ? "text-white bg-green-600 hover:bg-green-700"
                : "text-gray-500 bg-gray-200 cursor-not-allowed"
            }`}
            disabled={
              isCreating ||
              !formData.title.trim() ||
              (!editingPage && pageTypeExists(selectedPageType)) ||
              (editingPage != null && !hasChanges)
            }
            title={
              editingPage
                ? !hasChanges
                  ? "No changes to save"
                  : "Save changes"
                : !isFormValid
                ? "Please fill in required fields"
                : "Create page"
            }
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {editingPage ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4 mr-2" />
                {editingPage
                  ? hasChanges
                    ? `Save Changes (${Object.keys(changedFields).length})`
                    : "No Changes"
                  : "Create Page"}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
