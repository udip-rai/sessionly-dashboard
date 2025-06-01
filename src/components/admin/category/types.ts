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
  return categories.map(cat => {
    // Calculate total experts from subcategories if category doesn't have expertCount
    const totalExperts = cat.expertCount !== undefined 
      ? cat.expertCount 
      : cat.subCategories.reduce((sum, sub) => sum + (sub.expertCount || 0), 0);
    
    return {
      ...cat,
      expertCount: totalExperts,
      subCategories: cat.subCategories.map(sub => ({
        ...sub,
        expertCount: sub.expertCount || 0
      })),
      isExpanded: false // Default to collapsed state
    };
  });
};
