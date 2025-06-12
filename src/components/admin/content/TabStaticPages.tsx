import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiSave } from "react-icons/fi";
import {
  adminService,
  StaticPage,
  AboutPageContent,
  HomePageContent,
} from "../../../api/services/admin.service";
import { Modal, ConfirmModal } from "../../ui";
import { StaticAboutPage, StaticHomePage } from "./static-page";
import { useSimpleToast } from "./utils";

export function TabStaticPages() {
  const toast = useSimpleToast();

  // Static Pages state
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedPageType, setSelectedPageType] = useState<"home" | "about">(
    "about",
  );
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    pageId: string | null;
    pageTitle: string;
  }>({ isOpen: false, pageId: null, pageTitle: "" });
  // Form data for creating/editing pages
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    pageData: HomePageContent | AboutPageContent;
  }>({
    title: "",
    content: "",
    pageData: {} as AboutPageContent,
  });
  // Initialize form data based on page type
  const initializeFormData = (type: "home" | "about") => {
    if (type === "about") {
      setFormData({
        title: "",
        content: "",
        pageData: {
          hero: {
            title: "",
            brandName: {
              ses: "",
              sion: "",
              ly: "",
            },
            descriptors: ["", "", ""],
            description: {
              intro: "",
              stats: "",
              aiMatch: "",
            },
          },
          mission: {
            title: "",
            description: "",
          },
          features: {
            title: {
              why: "",
              choose: "",
              brandName: {
                ses: "",
                sion: "",
                ly: "",
              },
            },
            cards: [
              { title: "", description: "" },
              { title: "", description: "" },
              { title: "", description: "" },
              { title: "", description: "" },
            ],
          },
          cta: {
            title: "",
            description: "",
            disclaimer: "",
          },
        } as AboutPageContent,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        pageData: {
          title: "",
          description: "",
          everything_reasons: {
            title: "",
            description: "",
            children: [],
          },
          transform_reasons: {
            title: "",
            children: [],
          },
          advantages_reasons: {
            title: "",
            description: "",
            children: [],
          },
          powered_by_ai_reasons: {
            title: "",
            description: "",
            children: [],
          },
          testimonials: {
            title: "",
            description: "",
          },
        } as HomePageContent,
      });
    }
  };

  // Load static pages
  const loadStaticPages = async () => {
    try {
      setLoading(true);
      console.log("Loading Static Pages...");
      const pagesData = await adminService.getAllStaticPages();
      console.log("Static Pages data received:", pagesData);
      setPages(pagesData);
    } catch (error: any) {
      console.error("Failed to load Static Pages:", error);
      toast.error(
        "Failed to load Static Pages",
        error?.response?.data?.message || error?.message || "Unknown error",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle page creation
  const handleOpenCreateModal = () => {
    setSelectedPageType("about");
    initializeFormData("about");
    setShowCreateModal(true);
  };
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setIsCreating(false);
    setEditingPage(null);
    setFormData({ title: "", content: "", pageData: {} as AboutPageContent });
  };

  const handlePageTypeChange = (type: "home" | "about") => {
    setSelectedPageType(type);
    initializeFormData(type);
  };

  const handleCreatePage = async () => {
    if (!formData.title.trim()) {
      toast.error("Validation Error", "Page title is required");
      return;
    }

    try {
      setIsCreating(true);
      const newPage = await adminService.createStaticPage({
        type: selectedPageType,
        title: formData.title,
        content: formData.content,
        pageData: formData.pageData,
        isPublished: false,
      });

      setPages([...pages, newPage]);
      handleCloseCreateModal();
      toast.success("Static Page Created", "Page created successfully");
    } catch (error) {
      console.error("Failed to create static page:", error);
      toast.error("Failed to create static page", "Please try again");
    } finally {
      setIsCreating(false);
    }
  };
  // Handle page editing
  const handleEditPage = (page: StaticPage) => {
    setEditingPage(page);

    // Normalize the content to ensure proper structure
    let normalizedPageData = page.pageData;
    if (page.type === "about") {
      const aboutContent = page.pageData as AboutPageContent;

      const currentCards = aboutContent.features?.cards || [];
      const normalizedCards = [...currentCards];

      // Fill up to 4 cards
      while (normalizedCards.length < 4) {
        normalizedCards.push({ title: "", description: "" });
      }

      // Trim to exactly 4 cards
      normalizedCards.splice(4);

      normalizedPageData = {
        ...aboutContent,
        features: {
          ...aboutContent.features,
          cards: normalizedCards,
        },
      };
    }

    setFormData({
      title: page.title,
      content: page.content,
      pageData: normalizedPageData,
    });
    setSelectedPageType(page.type);
    setShowCreateModal(true);
  };

  const handleUpdatePage = async () => {
    if (!editingPage || !formData.title.trim()) {
      toast.error("Validation Error", "Page title is required");
      return;
    }

    try {
      setIsCreating(true);
      const updatedPage = await adminService.updateStaticPage(editingPage._id, {
        title: formData.title,
        content: formData.content,
        pageData: formData.pageData,
      });

      setPages(pages.map((p) => (p._id === editingPage._id ? updatedPage : p)));
      handleCloseCreateModal();
      toast.success("Static Page Updated", "Page updated successfully");
    } catch (error) {
      console.error("Failed to update static page:", error);
      toast.error("Failed to update static page", "Please try again");
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
      toast.success("Static Page Deleted", "Page deleted successfully");
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Failed to delete static page:", error);
      toast.error("Failed to delete static page", "Please try again");
    }
  };

  // Load pages on component mount
  useEffect(() => {
    loadStaticPages();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Static Pages Management
          </h2>
          <p className="text-sm text-gray-500">
            Manage your website's static pages (Home, About, etc.)
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90"
          disabled={loading}
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Create Page
        </button>
      </div>

      {/* Create/Edit Page Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title={editingPage ? "Edit Static Page" : "Create New Static Page"}
        size="xl"
      >
        <div className="space-y-6">
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
                  />
                  About Page
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
                  />
                  Home Page
                </label>
              </div>
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
          </div>{" "}
          {/* Page Content Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Content
            </label>
            <textarea
              rows={3}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              placeholder="Enter basic page content/description"
            />
          </div>
          {/* Page Content Form */}
          {selectedPageType === "about" && (
            <StaticAboutPage
              content={formData.pageData as AboutPageContent}
              onChange={(pageData) => setFormData({ ...formData, pageData })}
            />
          )}
          {selectedPageType === "home" && (
            <StaticHomePage
              content={formData.pageData as HomePageContent}
              onChange={(pageData) => setFormData({ ...formData, pageData })}
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
            <button
              onClick={editingPage ? handleUpdatePage : handleCreatePage}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isCreating || !formData.title.trim()}
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {editingPage ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4 mr-2" />
                  {editingPage ? "Update Page" : "Create Page"}
                </>
              )}
            </button>
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
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          page.type === "home"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {(page.type || "—").toUpperCase()} PAGE
                      </span>
                      <span className="text-xs text-gray-500">
                        Created{" "}
                        {page.createdAt
                          ? new Date(page.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "—"}
                      </span>
                    </div>
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
      )}

      {!loading && pages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No static pages found</p>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90 mx-auto"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Your First Page
          </button>
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
