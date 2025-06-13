import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { FiTrash2, FiEdit2, FiSave } from "react-icons/fi";
import {
  adminService,
  StaticPage,
  AboutPageContent,
  HomePageContent,
  TeamPageContent,
} from "../../../api/services/admin.service";
import { Modal, ConfirmModal, AddButton, TimestampBadges } from "../../ui";
import { StaticAboutPage, StaticHomePage, StaticTeamPage } from "./static-page";
import { toast } from "../../toast";
import {
  DEFAULT_ABOUT_PAGE,
  EMPTY_ABOUT_PAGE,
  EMPTY_HOME_PAGE,
  DEFAULT_TEAM_PAGE,
  EMPTY_TEAM_PAGE,
} from "./constants/staticPageDefaults";

export function TabStaticPages() {
  // Static Pages state
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedPageType, setSelectedPageType] = useState<"home" | "about" | "team">(
    "about",
  );
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    pageId: string | null;
    pageTitle: string;
  }>({ isOpen: false, pageId: null, pageTitle: "" });
  const [modalRenderKey, setModalRenderKey] = useState<number>(0);

  // Form data for creating/editing pages
  const [formData, setFormData] = useState<{
    title: string;
    content: HomePageContent | AboutPageContent | TeamPageContent;
  }>({
    title: "",
    content: EMPTY_ABOUT_PAGE,
  });

  // Track original data for change detection
  const [originalFormData, setOriginalFormData] = useState<{
    title: string;
    content: HomePageContent | AboutPageContent | TeamPageContent;
  }>({
    title: "",
    content: EMPTY_ABOUT_PAGE,
  });

  // Helper function to detect what fields have changed
  const getChangedFields = () => {
    const changes: any = {};
    
    // Check if title changed
    if (formData.title.trim() !== originalFormData.title.trim()) {
      changes.title = formData.title.trim();
    }
    
    // Check if content changed by deep comparison
    const currentContentStr = JSON.stringify(formData.content);
    const originalContentStr = JSON.stringify(originalFormData.content);
    
    if (currentContentStr !== originalContentStr) {
      changes.content = formData.content;
    }
    
    return changes;
  };

  // Initialize form data based on page type
  const initializeFormData = (type: "home" | "about" | "team") => {
    let newFormData;
    if (type === "about") {
      newFormData = {
        title: "",
        content: JSON.parse(JSON.stringify(EMPTY_ABOUT_PAGE)),
      };
    } else if (type === "team") {
      newFormData = {
        title: "",
        content: JSON.parse(JSON.stringify(EMPTY_TEAM_PAGE)),
      };
    } else {
      newFormData = {
        title: "",
        content: JSON.parse(JSON.stringify(EMPTY_HOME_PAGE)),
      };
    }
    
    setFormData(newFormData);
    setOriginalFormData(JSON.parse(JSON.stringify(newFormData)));
  };

  // Load default content for About page
  const loadDefaultAboutContent = () => {
    const newFormData = {
      title: "About Us",
      content: JSON.parse(JSON.stringify(DEFAULT_ABOUT_PAGE)),
    };
    setFormData(newFormData);
    setOriginalFormData(JSON.parse(JSON.stringify(newFormData)));
  };

  // Utility function to normalize page data with proper fallbacks
  const normalizePageData = (page: StaticPage) => {
    // The content field is already parsed as an object
    let parsedContent: HomePageContent | AboutPageContent;
    try {
      // If content is a string, parse it; otherwise use it directly
      parsedContent = typeof page.content === 'string' 
        ? JSON.parse(page.content) 
        : page.content;
    } catch (error) {
      console.error("Failed to parse page content:", error);
      // Fallback to empty content based on page type
      parsedContent =
        page.type === "about" ? EMPTY_ABOUT_PAGE : EMPTY_HOME_PAGE;
    }

    if (page.type === "about") {
      const aboutContent = parsedContent as AboutPageContent;
      const emptyAbout = EMPTY_ABOUT_PAGE;
      const currentCards = aboutContent?.features?.cards || [];
      const normalizedCards = [...currentCards];
      while (normalizedCards.length < 4) {
        normalizedCards.push({ title: "", description: "" });
      }
      normalizedCards.splice(4);

      return {
        hero: {
          title: aboutContent?.hero?.title || emptyAbout.hero.title,
          descriptors:
            aboutContent?.hero?.descriptors || emptyAbout.hero.descriptors,
          description: {
            intro:
              aboutContent?.hero?.description?.intro ||
              emptyAbout.hero.description.intro,
            stats:
              aboutContent?.hero?.description?.stats ||
              emptyAbout.hero.description.stats,
            aiMatch:
              aboutContent?.hero?.description?.aiMatch ||
              emptyAbout.hero.description.aiMatch,
          },
        },
        mission: {
          title: aboutContent?.mission?.title || emptyAbout.mission.title,
          description:
            aboutContent?.mission?.description ||
            emptyAbout.mission.description,
        },
        features: {
          title: {
            why:
              aboutContent?.features?.title?.why ||
              emptyAbout.features.title.why,
            choose:
              aboutContent?.features?.title?.choose ||
              emptyAbout.features.title.choose,
          },
          cards: normalizedCards,
        },
        cta: {
          title: aboutContent?.cta?.title || emptyAbout.cta.title,
          description:
            aboutContent?.cta?.description || emptyAbout.cta.description,
          disclaimer:
            aboutContent?.cta?.disclaimer || emptyAbout.cta.disclaimer,
        },
      };
    } else {
      const homeContent = parsedContent as HomePageContent;
      const emptyHome = EMPTY_HOME_PAGE;

      return {
        title: homeContent?.title || emptyHome.title,
        description: homeContent?.description || emptyHome.description,
        everything_reasons: {
          title:
            homeContent?.everything_reasons?.title ||
            emptyHome.everything_reasons.title,
          description:
            homeContent?.everything_reasons?.description ||
            emptyHome.everything_reasons.description,
          children:
            homeContent?.everything_reasons?.children ||
            emptyHome.everything_reasons.children,
        },
        transform_reasons: {
          title:
            homeContent?.transform_reasons?.title ||
            emptyHome.transform_reasons.title,
          children:
            homeContent?.transform_reasons?.children ||
            emptyHome.transform_reasons.children,
        },
        advantages_reasons: {
          title:
            homeContent?.advantages_reasons?.title ||
            emptyHome.advantages_reasons.title,
          description:
            homeContent?.advantages_reasons?.description ||
            emptyHome.advantages_reasons.description,
          children:
            homeContent?.advantages_reasons?.children ||
            emptyHome.advantages_reasons.children,
        },
        powered_by_ai_reasons: {
          title:
            homeContent?.powered_by_ai_reasons?.title ||
            emptyHome.powered_by_ai_reasons.title,
          description:
            homeContent?.powered_by_ai_reasons?.description ||
            emptyHome.powered_by_ai_reasons.description,
          children:
            homeContent?.powered_by_ai_reasons?.children ||
            emptyHome.powered_by_ai_reasons.children,
        },
        testimonials: {
          title:
            homeContent?.testimonials?.title || emptyHome.testimonials.title,
          description:
            homeContent?.testimonials?.description ||
            emptyHome.testimonials.description,
        },
      };
    }
  };

  // Load static pages
  const loadStaticPages = async () => {
    try {
      setLoading(true);
      const pagesData = await adminService.getAllStaticPages();
      setPages(pagesData);
    } catch (error: any) {
      console.error("Failed to load Static Pages:", error);
      toast.error(
        "Failed to load Static Pages: " +
          (error?.response?.data?.message || error?.message || "Unknown error"),
      );
    } finally {
      setLoading(false);
    }
  };

  // Utility: check if a page of a given type already exists
  const pageTypeExists = (type: "home" | "about" | "team") => {
    return pages.some((page) => page.type === type);
  };

  // Handle page creation
  const handleOpenCreateModal = () => {
    setSelectedPageType("about");
    initializeFormData("about");
    setShowCreateModal(true);
    setModalRenderKey((prev) => prev + 1);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setIsCreating(false);
    setEditingPage(null);
    setFormData({
      title: "",
      content: JSON.parse(JSON.stringify(EMPTY_ABOUT_PAGE)),
    });
    setSelectedPageType("about");
    setModalRenderKey((prev) => prev + 1);
  };

  const handlePageTypeChange = (type: "home" | "about" | "team") => {
    setSelectedPageType(type);
    initializeFormData(type);
  };

  const handleCreatePage = async () => {
    try {
      setIsCreating(true);
      const newPage = await adminService.createStaticPage({
        type: selectedPageType,
        title: formData.title,
        content: formData.content,
      });

      setPages([...pages, newPage]);
      handleCloseCreateModal();
      toast.success("Static Page Created successfully");
    } catch (error) {
      console.error("Failed to create static page:", error);
      toast.error("Failed to create static page. Please try again");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle page editing
  const handleEditPage = (page: StaticPage) => {
    console.log("Opening edit modal for page:", page);

    // Set editing page first
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
      setOriginalFormData(JSON.parse(JSON.stringify(newFormData))); // Set original data for change detection
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
      setIsCreating(true);
      const updatedPage = await adminService.updateStaticPage(editingPage._id, changedFields);

      setPages(pages.map((p) => (p._id === editingPage._id ? updatedPage : p)));
      handleCloseCreateModal();
      
      // Show specific success message about what was changed
      const changesList = Object.keys(changedFields).join(', ');
      toast.success("Static Page Updated", `Successfully updated: ${changesList}`);
    } catch (error) {
      console.error("Failed to update static page:", error);
      toast.error("Failed to update static page. Please try again");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle page deletion
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
      await adminService.deleteStaticPage(deleteConfirmDialog.pageId);
      setPages(pages.filter((page) => page._id !== deleteConfirmDialog.pageId));
      toast.success("Static Page Deleted successfully");
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Failed to delete static page:", error);
      toast.error("Failed to delete static page. Please try again");
    }
  };

  // Load pages on component mount
  useEffect(() => {
    loadStaticPages();
  }, []);

  // Sync formData and selectedPageType with editingPage when it changes
  useEffect(() => {
    if (editingPage) {
      // Normalize the content using the utility function
      const normalizedPageData = normalizePageData(editingPage);

      const newFormData = {
        title: editingPage.title || "",
        content: JSON.parse(JSON.stringify(normalizedPageData)),
      };

      // Update all state synchronously
      flushSync(() => {
        setFormData(newFormData);
        setSelectedPageType(editingPage.type);
      });

      // Open modal with slight delay to ensure state is set
      setTimeout(() => {
        flushSync(() => {
          setShowCreateModal(true);
          setModalRenderKey((prev) => prev + 1);
        });
        console.log("Edit modal opened for page:", editingPage.type);
      }, 0);
    }
  }, [editingPage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Static Pages</h2>
          <p className="text-gray-600 mt-1">
            Manage your website's static content pages
          </p>{" "}
        </div>
        <AddButton onClick={handleOpenCreateModal} disabled={loading}>
          Add New Page
        </AddButton>
      </div>
      {/* Create/Edit Modal */}
      <Modal
        key={`modal-${modalRenderKey}`}
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title={editingPage ? "Edit Static Page" : "Create New Static Page"}
        size="xl"
      >
        <div className="space-y-6">
          {/* Smart Edit Info Banner (only show when editing) */}
          {editingPage && (() => {
            const changedFields = getChangedFields();
            const hasChanges = Object.keys(changedFields).length > 0;
            
            return (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Edit Static Page Guidelines
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Update the page content below. Only changed fields will be saved.</p>
                      {hasChanges && (
                        <p className="mt-1 text-xs text-green-600 font-medium">
                          • {Object.keys(changedFields).length} field(s) modified
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          {/* Page Type Selection (only for new pages) */}
          {!editingPage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Type *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="about"
                    checked={selectedPageType === "about"}
                    onChange={(e) =>
                      handlePageTypeChange(e.target.value as "about")
                    }
                    className="mr-2"
                    disabled={pageTypeExists("about")}
                  />
                  About Page
                  {pageTypeExists("about") && (
                    <span className="ml-2 text-xs text-red-500">
                      (Already created)
                    </span>
                  )}
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="home"
                    checked={selectedPageType === "home"}
                    onChange={(e) =>
                      handlePageTypeChange(e.target.value as "home")
                    }
                    className="mr-2"
                    disabled={pageTypeExists("home")}
                  />
                  Home Page
                  {pageTypeExists("home") && (
                    <span className="ml-2 text-xs text-red-500">
                      (Already created)
                    </span>
                  )}
                </label>
              </div>

              {/* Load Default Content Button for About Page */}
              {selectedPageType === "about" && !pageTypeExists("about") && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={loadDefaultAboutContent}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Load default About page content
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Page Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              placeholder="Enter page title"
              autoFocus
            />
          </div>

          {/* Page Content Form */}
          {selectedPageType === "about" && (
            <StaticAboutPage
              key={editingPage ? `about-${editingPage._id}` : "about-create"}
              content={formData.content as AboutPageContent}
              onChange={(content) =>
                setFormData((prev) => ({
                  ...prev,
                  content: JSON.parse(JSON.stringify(content)),
                }))
              }
            />
          )}
          {selectedPageType === "home" && (
            <StaticHomePage
              key={editingPage ? `home-${editingPage._id}` : "home-create"}
              content={formData.content as HomePageContent}
              onChange={(content) =>
                setFormData((prev) => ({
                  ...prev,
                  content: JSON.parse(JSON.stringify(content)),
                }))
              }
            />
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleCloseCreateModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isCreating}
            >
              Cancel
            </button>
            {(() => {
              const changedFields = getChangedFields();
              const hasChanges = Object.keys(changedFields).length > 0;
              const isFormValid = formData.title.trim() && (!editingPage || !pageTypeExists(selectedPageType));
              
              return (
                <>
                  {/* Instructions for edit mode */}
                  {editingPage && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
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
                            Edit Static Page
                          </h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <p>Update the page content below. Only changed fields will be saved.</p>
                            {hasChanges && (
                              <p className="mt-1 text-xs text-green-600 font-medium">
                                • {Object.keys(changedFields).length} field(s) modified
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={editingPage ? handleUpdatePage : handleCreatePage}
                    className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
                      editingPage
                        ? hasChanges && isFormValid
                          ? 'text-white bg-blue-600 hover:bg-blue-700'
                          : 'text-gray-500 bg-gray-200 cursor-not-allowed'
                        : isFormValid
                          ? 'text-white bg-green-600 hover:bg-green-700'
                          : 'text-gray-500 bg-gray-200 cursor-not-allowed'
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
                            : 'No Changes'
                          : "Create Page"
                        }
                      </>
                    )}
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      </Modal>
      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
          <p className="mt-2 text-gray-500">Loading Static Pages...</p>
        </div>
      )}
      {/* Static Pages List */}
      {!loading && (
        <div className="space-y-4">
          {pages.map((page) => (
            <div
              key={page._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <TimestampBadges
                      createdAt={page.createdAt}
                      updatedAt={page.updatedAt}
                    />
                    <h3 className="text-lg font-medium text-gray-900">
                      {page.title || "—"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditPage(page)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      disabled={loading}
                      title="Edit Page"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleOpenDeleteDialog(page._id, page.title)
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={loading}
                      title="Delete Page"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}{" "}
      {!loading && pages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No static pages found</p>
          <AddButton onClick={handleOpenCreateModal} className="mx-auto">
            Create Your First Page
          </AddButton>
        </div>
      )}
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
