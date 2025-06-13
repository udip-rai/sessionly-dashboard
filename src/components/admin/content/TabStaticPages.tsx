import { useState } from "react";
import { flushSync } from "react-dom";
import { StaticPage } from "../../../api/services/admin.service";
import { ConfirmModal, AddButton } from "../../ui";
import {
  StaticPageList,
  StaticPageModal,
  useStaticPageData,
  useStaticPageForm,
  normalizePageData,
} from "./static-page";

export function TabStaticPages() {
  // Data management hooks
  const {
    pages,
    loading,
    createPage,
    updatePage,
    deletePage,
    pageTypeExists,
  } = useStaticPageData();

  const {
    formData,
    setFormData,
    setOriginalFormData,
    initializeFormData,
    loadDefaultAboutContent,
    loadDefaultTeamContent,
    getChangedFields,
    resetForm,
  } = useStaticPageForm();

  // Modal and editing state
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedPageType, setSelectedPageType] = useState<"home" | "about" | "team">("about");
  const [modalRenderKey, setModalRenderKey] = useState<number>(0);
  
  // Delete confirmation state
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    pageId: string | null;
    pageTitle: string;
  }>({ isOpen: false, pageId: null, pageTitle: "" });

  // Modal handlers
  const handleOpenCreateModal = () => {
    setSelectedPageType("about");
    initializeFormData("about");
    setEditingPage(null);
    setShowCreateModal(true);
    setModalRenderKey((prev) => prev + 1);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setIsCreating(false);
    setEditingPage(null);
    resetForm();
    setSelectedPageType("about");
    setModalRenderKey((prev) => prev + 1);
  };

  const handlePageTypeChange = (type: "home" | "about" | "team") => {
    setSelectedPageType(type);
    initializeFormData(type);
  };

  // Page operations
  const handleEditPage = (page: StaticPage) => {
    console.log("Opening edit modal for page:", page);
    
    setEditingPage(page);
    
    // Normalize the content using the utility function
    const normalizedPageData = normalizePageData(page);
    const newFormData = {
      title: page.title || "",
      content: JSON.parse(JSON.stringify(normalizedPageData)),
    };

    // Update all state synchronously
    flushSync(() => {
      setFormData(newFormData);
      setOriginalFormData(JSON.parse(JSON.stringify(newFormData)));
      setSelectedPageType(page.type);
    });

    // Open modal with slight delay to ensure state is set
    setTimeout(() => {
      flushSync(() => {
        setShowCreateModal(true);
        setModalRenderKey((prev) => prev + 1);
      });
      console.log("Edit modal opened for page:", page.type);
    }, 0);
  };

  const handleCreatePage = async (
    type: "home" | "about" | "team",
    title: string,
    content: any
  ) => {
    setIsCreating(true);
    try {
      await createPage(type, title, content);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdatePage = async (pageId: string, updates: any) => {
    setIsCreating(true);
    try {
      await updatePage(pageId, updates);
    } finally {
      setIsCreating(false);
    }
  };

  // Delete handlers
  const handleOpenDeleteDialog = (pageId: string, title: string) => {
    setDeleteConfirmDialog({
      isOpen: true,
      pageId,
      pageTitle: title,
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteConfirmDialog({
      isOpen: false,
      pageId: null,
      pageTitle: "",
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmDialog.pageId) return;

    try {
      await deletePage(deleteConfirmDialog.pageId);
      handleCloseDeleteDialog();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Static Pages</h2>
          <p className="text-gray-600 mt-1">
            Manage your website's static content pages
          </p>
        </div>
        <AddButton onClick={handleOpenCreateModal} disabled={loading}>
          Add New Page
        </AddButton>
      </div>

      {/* Static Pages List */}
      <StaticPageList
        pages={pages}
        loading={loading}
        onEdit={handleEditPage}
        onDelete={handleOpenDeleteDialog}
        onCreateNew={handleOpenCreateModal}
      />

      {/* Create/Edit Modal */}
      <StaticPageModal
        isOpen={showCreateModal}
        editingPage={editingPage}
        formData={formData}
        selectedPageType={selectedPageType}
        isCreating={isCreating}
        modalRenderKey={modalRenderKey}
        pageTypeExists={pageTypeExists}
        onClose={handleCloseCreateModal}
        onPageTypeChange={handlePageTypeChange}
        onFormDataChange={setFormData}
        onLoadDefaultAbout={loadDefaultAboutContent}
        onLoadDefaultTeam={loadDefaultTeamContent}
        onCreate={handleCreatePage}
        onUpdate={handleUpdatePage}
        getChangedFields={getChangedFields}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmDialog.isOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Static Page"
        message={
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete this static page? This action
              cannot be undone.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">
                Page to be deleted:
              </h4>
              <div className="bg-white rounded-md p-3 border border-red-100">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {deleteConfirmDialog.pageTitle}
                </p>
                <p className="text-xs text-gray-500">
                  This will permanently remove this page from your website.
                </p>
              </div>
            </div>
          </div>
        }
        confirmText="Delete Page"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
