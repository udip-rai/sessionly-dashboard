import { Category, SubCategory } from '../../../api/services/category.service';

// Local interfaces for component state
export interface CategoryState extends Omit<Category, 'subCategories'> {
  subCategories: SubCategoryState[];
  isExpanded?: boolean;
}

export interface SubCategoryState extends SubCategory {
  isNew?: boolean;
}

// Tracking loading states
export interface LoadingState {
  categoryId?: string;
  subcategoryId?: string;
  action: 'create' | 'update' | 'delete';
}

// Map API response to component state
export const mapApiToState = (categories: Category[]): CategoryState[] => {
  return categories.map(cat => ({
    ...cat,
    subCategories: cat.subCategories.map(sub => ({
      ...sub,
      expertCount: sub.expertCount || 0
    })),
    isExpanded: false // Default to collapsed state
  }));
};
