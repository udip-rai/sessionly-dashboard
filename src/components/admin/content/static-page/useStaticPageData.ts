import { useState, useEffect, useCallback } from "react";
import { adminService, StaticPage, HomePageContent, AboutPageContent, TeamPageContent } from "../../../../api/services/admin.service";
import { toast } from "../../../toast";
import { 
  EMPTY_ABOUT_PAGE, 
  EMPTY_HOME_PAGE, 
  EMPTY_TEAM_PAGE,
  DEFAULT_ABOUT_PAGE,
  DEFAULT_TEAM_PAGE
} from "../constants/staticPageDefaults";

export type StaticPageFormData = {
  title: string;
  content: HomePageContent | AboutPageContent | TeamPageContent;
};

export const useStaticPageData = () => {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadStaticPages = useCallback(async () => {
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
  }, []);

  const createPage = useCallback(async (
    type: "home" | "about" | "team",
    title: string,
    content: HomePageContent | AboutPageContent | TeamPageContent
  ) => {
    try {
      const newPage = await adminService.createStaticPage({
        type,
        title,
        content,
      });
      setPages(prev => [...prev, newPage]);
      toast.success("Static Page Created successfully");
      return newPage;
    } catch (error) {
      console.error("Failed to create static page:", error);
      toast.error("Failed to create static page. Please try again");
      throw error;
    }
  }, []);

  const updatePage = useCallback(async (
    pageId: string,
    updates: {
      title?: string;
      content?: HomePageContent | AboutPageContent | TeamPageContent;
    }
  ) => {
    try {
      const updatedPage = await adminService.updateStaticPage(pageId, updates);
      setPages(prev => prev.map(p => p._id === pageId ? updatedPage : p));
      
      const changesList = Object.keys(updates).join(', ');
      toast.success("Static Page Updated", `Successfully updated: ${changesList}`);
      return updatedPage;
    } catch (error) {
      console.error("Failed to update static page:", error);
      toast.error("Failed to update static page. Please try again");
      throw error;
    }
  }, []);

  const deletePage = useCallback(async (pageId: string) => {
    try {
      await adminService.deleteStaticPage(pageId);
      setPages(prev => prev.filter(page => page._id !== pageId));
      toast.success("Static Page Deleted successfully");
    } catch (error) {
      console.error("Failed to delete static page:", error);
      toast.error("Failed to delete static page. Please try again");
      throw error;
    }
  }, []);

  const pageTypeExists = useCallback((type: "home" | "about" | "team") => {
    return pages.some((page) => page.type === type);
  }, [pages]);

  useEffect(() => {
    loadStaticPages();
  }, [loadStaticPages]);

  return {
    pages,
    loading,
    loadStaticPages,
    createPage,
    updatePage,
    deletePage,
    pageTypeExists,
  };
};

export const useStaticPageForm = () => {
  const [formData, setFormData] = useState<StaticPageFormData>({
    title: "",
    content: EMPTY_ABOUT_PAGE,
  });

  const [originalFormData, setOriginalFormData] = useState<StaticPageFormData>({
    title: "",
    content: EMPTY_ABOUT_PAGE,
  });

  const initializeFormData = useCallback((type: "home" | "about" | "team") => {
    let newFormData: StaticPageFormData;
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
  }, []);

  const loadDefaultAboutContent = useCallback(() => {
    const newFormData = {
      title: "About Us",
      content: JSON.parse(JSON.stringify(DEFAULT_ABOUT_PAGE)),
    };
    setFormData(newFormData);
    setOriginalFormData(JSON.parse(JSON.stringify(newFormData)));
  }, []);

  const loadDefaultTeamContent = useCallback(() => {
    const newFormData = {
      title: "Our Team",
      content: JSON.parse(JSON.stringify(DEFAULT_TEAM_PAGE)),
    };
    setFormData(newFormData);
    setOriginalFormData(JSON.parse(JSON.stringify(newFormData)));
  }, []);

  const getChangedFields = useCallback(() => {
    const changes: any = {};
    
    // Check if title changed
    if (formData.title.trim() !== originalFormData.title.trim()) {
      changes.title = formData.title.trim();
    }
    
    // Check if content changed by deep comparison
    const sortObjectKeys = (obj: any): any => {
      if (obj === null || obj === undefined || typeof obj !== 'object') {
        return obj;
      }
      if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
      }
      const sorted: any = {};
      Object.keys(obj).sort().forEach(key => {
        sorted[key] = sortObjectKeys(obj[key]);
      });
      return sorted;
    };
    
    const currentContentStr = JSON.stringify(sortObjectKeys(formData.content));
    const originalContentStr = JSON.stringify(sortObjectKeys(originalFormData.content));
    
    if (currentContentStr !== originalContentStr) {
      changes.content = formData.content;
    }
    
    return changes;
  }, [formData, originalFormData]);

  const resetForm = useCallback(() => {
    const resetData = {
      title: "",
      content: JSON.parse(JSON.stringify(EMPTY_ABOUT_PAGE)),
    };
    setFormData(resetData);
    setOriginalFormData(resetData);
  }, []);

  return {
    formData,
    setFormData,
    originalFormData,
    setOriginalFormData,
    initializeFormData,
    loadDefaultAboutContent,
    loadDefaultTeamContent,
    getChangedFields,
    resetForm,
  };
};
