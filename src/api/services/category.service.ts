// filepath: /home/milan/Milan/Sessionly-Dashboard/src/api/services/category.service.ts
import { BASE_API } from "../axios";
import { CATEGORY_APIS } from "../index";

// Category interfaces based on actual API response structure
export interface SubCategory {
  _id: string;
  name: string;
  description: string;
  expertCount: number; // Now required as API always returns it
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  subCategories: SubCategory[];
  expertCount?: number; // Added for main categories
  createdAt?: string;
  updatedAt?: string;
}

// Response interfaces
export interface CategoriesResponse {
  message: string;
  success: boolean;
  data: Category[];
}

export interface CategoryResponse {
  message: string;
  success: boolean;
  data: Category;
}

// Request payloads
export interface CreateCategoryRequest {
  name: string;
  description: string;
  subCategories?: {
    name: string;
    description: string;
  }[];
}

export interface CreateSubCategoryRequest {
  name: string;
  description: string;
}

export const categoryService = {
  // Get all categories with expert counts (admin only)
  async getAllCategories(): Promise<CategoriesResponse> {
    try {
      const response = await BASE_API.get(CATEGORY_APIS.getAll);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get categories without expert counts (for non-admin users)
  async getCategoriesForExperts(): Promise<CategoriesResponse> {
    try {
      const response = await BASE_API.get("categories");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createCategory(data: CreateCategoryRequest): Promise<CategoryResponse> {
    try {
      const response = await BASE_API.post(CATEGORY_APIS.create, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateCategory(
    categoryId: string,
    data: Partial<CreateCategoryRequest>,
  ): Promise<CategoryResponse> {
    try {
      const response = await BASE_API.put(
        CATEGORY_APIS.update(categoryId),
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteCategory(
    categoryId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await BASE_API.delete(CATEGORY_APIS.delete(categoryId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createSubCategory(
    categoryId: string,
    data: CreateSubCategoryRequest,
  ): Promise<CategoryResponse> {
    try {
      const response = await BASE_API.post(
        CATEGORY_APIS.createSubcategory(categoryId),
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateSubCategory(
    categoryId: string,
    subCategoryId: string,
    data: Partial<CreateSubCategoryRequest>,
  ): Promise<CategoryResponse> {
    try {
      const response = await BASE_API.put(
        CATEGORY_APIS.updateSubcategory(categoryId, subCategoryId),
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteSubCategory(
    categoryId: string,
    subCategoryId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await BASE_API.delete(
        CATEGORY_APIS.deleteSubcategory(categoryId, subCategoryId),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
