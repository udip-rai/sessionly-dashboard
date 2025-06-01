export interface Category {
  _id: string;
  name: string;
  description: string;
  subCategories: SubCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  description: string;
}

export interface ExpertiseArea {
  category: string; // category._id
  categoryName?: string;
  subCategory: string; // subCategory._id
  subCategoryName?: string;
  _id?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}
