import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { categoryService } from '../../../api/services/category.service';
import { CategoryState, LoadingState, SubCategoryState, mapApiToState } from './types';
import { handleApiError } from './utils';

export const useCategoryManagement = () => {
  const [categories, setCategories] = useState<CategoryState[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<{ id: string; type: 'category' | 'subcategory'; data?: any } | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'expertCount'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingItems, setLoadingItems] = useState<LoadingState[]>([]);
  const [filterEmptySubcategories, setFilterEmptySubcategories] = useState<boolean>(false);

  // Helper function to check if a specific item is in loading state
  const isItemLoading = useCallback((itemId: string, action?: 'create' | 'update' | 'delete') => {
    return loadingItems.some(item => 
      (item.categoryId === itemId || item.subcategoryId === itemId) && 
      (!action || item.action === action)
    );
  }, [loadingItems]);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await categoryService.getAllCategories();
      if (response.success) {
        setCategories(mapApiToState(response.data));
      } else {
        toast.error(response.message || 'Failed to load categories');
      }
    } catch (error) {
      handleApiError(error, 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new category
  const handleAddCategory = useCallback(async () => {
    const newCategory: CategoryState = {
      _id: "temp-" + Date.now(), // Temporary ID until API creates one
      name: 'New Category',
      description: 'Category description',
      subCategories: [],
      isExpanded: true // New categories should be expanded for immediate editing
    };
    
    // Add the new category to the UI first for a responsive feel
    setCategories(prev => [...prev, newCategory]);
    setEditingItem({ id: newCategory._id, type: 'category', data: newCategory });
    
    // Show a helpful toast message
    toast.success(
      'New category created! Please fill in the details and click "Save Changes" to save it.',
      { duration: 5000 }
    );
  }, []);

  // Add a new subcategory to a category
  const handleAddSubcategory = useCallback(async (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    if (!category) return;

    const newSubcategory: SubCategoryState = {
      _id: "temp-" + Date.now(), // Temporary ID until API creates one
      name: 'New Subcategory',
      description: 'Subcategory description',
      expertCount: 0,
      isNew: true
    };
    
    setCategories(cats =>
      cats.map(cat => {
        if (cat._id === categoryId) {
          // Make sure category is expanded when adding a subcategory
          return {
            ...cat,
            isExpanded: true,
            subCategories: [...cat.subCategories, newSubcategory]
          };
        }
        return cat;
      })
    );
    
    setEditingItem({ id: newSubcategory._id, type: 'subcategory', data: { categoryId, ...newSubcategory } });
    
    // Show a helpful toast message
    toast.success(
      'New subcategory created! Fill in the details and click "Save Changes".',
      { duration: 3000 }
    );
    
    // Scroll to the new subcategory after a brief delay
    setTimeout(() => {
      document.getElementById(`subcategory-${newSubcategory._id}`)?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  }, [categories]);

  // Save a category
  const handleSaveCategory = useCallback(async (categoryId: string, data: Partial<CategoryState>) => {
    // Set loading state for this specific category
    setLoadingItems(prev => [...prev, { 
      categoryId, 
      action: categoryId.startsWith('temp-') ? 'create' : 'update' 
    }]);
    
    const isNewCategory = categoryId.startsWith('temp-');
    try {
      if (isNewCategory) {
        // Create new category
        const response = await categoryService.createCategory({
          name: data.name || 'New Category',
          description: data.description || 'Category description',
          subCategories: [] // Empty subCategories array for new categories
        });
        
        if (response.success) {
          toast.success('Category created successfully');
          // Refresh categories to get the actual data from API
          await fetchCategories();
        } else {
          toast.error('Failed to create category');
        }
      } else {
        // Update existing category
        const response = await categoryService.updateCategory(categoryId, {
          name: data.name,
          description: data.description
        });
        
        if (response.success) {
          toast.success('Category updated successfully');
          // Update local state
          setCategories(cats =>
            cats.map(cat =>
              cat._id === categoryId ? { ...cat, ...data } : cat
            )
          );
        } else {
          toast.error('Failed to update category');
        }
      }
    } catch (error) {
      handleApiError(error, 'An error occurred while saving the category');
    } finally {
      setLoadingItems(prev => prev.filter(item => item.categoryId !== categoryId));
      setEditingItem(null);
    }
  }, [fetchCategories]);

  // Save a subcategory
  const handleSaveSubcategory = useCallback(async (categoryId: string, subcategoryId: string, data: Partial<SubCategoryState>) => {
    // Set loading state for this specific subcategory
    setLoadingItems(prev => [...prev, { 
      categoryId, 
      subcategoryId,
      action: subcategoryId.startsWith('temp-') ? 'create' : 'update' 
    }]);
    
    const isNewSubcategory = subcategoryId.startsWith('temp-');
    try {
      if (isNewSubcategory) {
        // Create new subcategory
        const response = await categoryService.createSubCategory(categoryId, {
          name: data.name || 'New Subcategory',
          description: data.description || 'Subcategory description'
        });
        
        if (response.success) {
          toast.success('Subcategory created successfully');
          // Refresh categories to get the actual data from API
          await fetchCategories();
        } else {
          toast.error('Failed to create subcategory');
        }
      } else {
        // Update existing subcategory
        const response = await categoryService.updateSubCategory(
          categoryId,
          subcategoryId,
          {
            name: data.name,
            description: data.description
          }
        );
        
        if (response.success) {
          toast.success('Subcategory updated successfully');
          // Update local state
          setCategories(cats =>
            cats.map(cat => {
              if (cat._id === categoryId) {
                return {
                  ...cat,
                  subCategories: cat.subCategories.map(sub =>
                    sub._id === subcategoryId ? { ...sub, ...data } : sub
                  )
                };
              }
              return cat;
            })
          );
        } else {
          toast.error('Failed to update subcategory');
        }
      }
    } catch (error) {
      handleApiError(error, 'An error occurred while saving the subcategory');
    } finally {
      setLoadingItems(prev => prev.filter(item => 
        !(item.categoryId === categoryId && item.subcategoryId === subcategoryId)
      ));
      setEditingItem(null);
    }
  }, [fetchCategories]);

  // Delete a category
  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    // Find category to include its name in the confirmation message
    const categoryToDelete = categories.find(cat => cat._id === categoryId);
    if (!categoryToDelete) return;
    
    const confirmation = window.confirm(
      `Are you sure you want to delete the category "${categoryToDelete.name}"?\n\n` +
      `This will permanently delete the category and all its ${categoryToDelete.subCategories.length} subcategories. ` +
      `This action cannot be undone.`
    );
    
    if (!confirmation) {
      return;
    }
    
    // Set loading state for this specific category
    setLoadingItems(prev => [...prev, { categoryId, action: 'delete' }]);
    
    try {
      const response = await categoryService.deleteCategory(categoryId);
      if (response.success) {
        toast.success(`Category "${categoryToDelete.name}" deleted successfully`);
        setCategories(cats => cats.filter(cat => cat._id !== categoryId));
      } else {
        toast.error(response.message || 'Failed to delete category');
      }
    } catch (error) {
      handleApiError(error, 'An error occurred while deleting the category');
    } finally {
      setLoadingItems(prev => prev.filter(item => item.categoryId !== categoryId));
    }
  }, [categories]);

  // Delete a subcategory
  const handleDeleteSubcategory = useCallback(async (categoryId: string, subcategoryId: string) => {
    // Find category and subcategory to include their names in the confirmation message
    const category = categories.find(cat => cat._id === categoryId);
    if (!category) return;
    
    const subcategoryToDelete = category.subCategories.find(sub => sub._id === subcategoryId);
    if (!subcategoryToDelete) return;
    
    const confirmation = window.confirm(
      `Are you sure you want to delete the subcategory "${subcategoryToDelete.name}"?\n\n` +
      `This subcategory belongs to the category "${category.name}". ` +
      `This action cannot be undone.`
    );
    
    if (!confirmation) {
      return;
    }
    
    // Don't call API for temporary items not yet saved
    if (subcategoryId.startsWith('temp-')) {
      setCategories(cats =>
        cats.map(cat => {
          if (cat._id === categoryId) {
            return {
              ...cat,
              subCategories: cat.subCategories.filter(sub => sub._id !== subcategoryId)
            };
          }
          return cat;
        })
      );
      toast.success(`Subcategory "${subcategoryToDelete.name}" removed`);
      return;
    }
    
    // Set loading state for this specific subcategory
    setLoadingItems(prev => [...prev, { categoryId, subcategoryId, action: 'delete' }]);
    
    try {
      const response = await categoryService.deleteSubCategory(categoryId, subcategoryId);
      if (response.success) {
        toast.success(`Subcategory "${subcategoryToDelete.name}" deleted successfully`);
        setCategories(cats =>
          cats.map(cat => {
            if (cat._id === categoryId) {
              return {
                ...cat,
                subCategories: cat.subCategories.filter(sub => sub._id !== subcategoryId)
              };
            }
            return cat;
          })
        );
      } else {
        toast.error(response.message || 'Failed to delete subcategory');
      }
    } catch (error) {
      handleApiError(error, 'An error occurred while deleting the subcategory');
    } finally {
      setLoadingItems(prev => prev.filter(item => 
        !(item.categoryId === categoryId && item.subcategoryId === subcategoryId)
      ));
    }
  }, [categories]);
  
  // Toggle category expansion
  const toggleCategoryExpansion = useCallback((categoryId: string) => {
    setCategories(cats =>
      cats.map(cat =>
        cat._id === categoryId ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    );
  }, []);

  // Handle edit action for a category or subcategory
  const handleEditItem = useCallback((type: 'category' | 'subcategory', itemId: string, categoryId?: string) => {
    if (type === 'category') {
      const category = categories.find(cat => cat._id === itemId);
      if (category) {
        setEditingItem({ id: itemId, type: 'category', data: category });
      }
    } else if (type === 'subcategory' && categoryId) {
      const category = categories.find(cat => cat._id === categoryId);
      if (category) {
        const subcategory = category.subCategories.find(sub => sub._id === itemId);
        if (subcategory) {
          setEditingItem({ id: itemId, type: 'subcategory', data: { categoryId, ...subcategory } });
        }
      }
    }
  }, [categories]);

  // Update editing data
  const handleEditFieldChange = useCallback((field: string, value: string) => {
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        data: { ...editingItem.data, [field]: value }
      });
    }
  }, [editingItem]);

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setEditingItem(null);
  }, []);

  // Filter and sort categories and subcategories
  const getFilteredAndSortedCategories = useCallback(() => {
    const filteredCategories = categories
      .map(category => ({
        ...category,
        subCategories: category.subCategories
          .filter(sub => {
            const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              sub.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Apply empty subcategory filter if enabled
            if (filterEmptySubcategories && sub.expertCount === 0) {
              return false;
            }
            
            return matchesSearch;
          })
          .sort((a, b) => {
            if (sortBy === 'name') {
              return sortOrder === 'asc' 
                ? a.name.localeCompare(b.name) 
                : b.name.localeCompare(a.name);
            }
            
            // Sort by expertCount
            return sortOrder === 'asc'
              ? (a.expertCount || 0) - (b.expertCount || 0)
              : (b.expertCount || 0) - (a.expertCount || 0);
          })
      }))
      .filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.subCategories.length > 0
      );

    return filteredCategories.sort((a, b) => {
      const modifier = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'name') {
        return modifier * a.name.localeCompare(b.name);
      } else {
        return modifier * ((b.subCategories.reduce((sum, sub) => sum + (sub.expertCount || 0), 0)) - 
                          (a.subCategories.reduce((sum, sub) => sum + (sub.expertCount || 0), 0)));
      }
    });
  }, [categories, searchTerm, sortBy, sortOrder, filterEmptySubcategories]);

  return {
    // State
    categories,
    searchTerm,
    editingItem,
    sortBy,
    sortOrder,
    isLoading,
    loadingItems,
    filterEmptySubcategories,
    
    // Methods
    setSearchTerm,
    setSortBy,
    setSortOrder,
    setFilterEmptySubcategories,
    fetchCategories,
    handleAddCategory,
    handleAddSubcategory,
    handleSaveCategory,
    handleSaveSubcategory,
    handleDeleteCategory,
    handleDeleteSubcategory,
    toggleCategoryExpansion,
    handleEditItem,
    handleEditFieldChange,
    handleCancelEdit,
    isItemLoading,
    getFilteredAndSortedCategories
  };
};
