import { useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { CategoryItem } from './CategoryItem';
import { SearchFilters } from './SearchFilters';
import { SubcategoryItem } from './SubcategoryItem';
import { useCategoryManagement } from './useCategoryManagement';

export const CategoryManagementContainer: React.FC = () => {
  const {
    searchTerm,
    editingItem,
    sortBy,
    sortOrder,
    isLoading,
    filterEmptySubcategories,
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
  } = useCategoryManagement();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const sortedAndFilteredCategories = getFilteredAndSortedCategories();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Manage expertise categories and subcategories</p>
        </div>
        <button
          onClick={handleAddCategory}
          className="flex items-center px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors duration-200"
          disabled={isLoading}
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>

      <SearchFilters 
        searchTerm={searchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        filterEmptySubcategories={filterEmptySubcategories}
        onSearchChange={setSearchTerm}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
        onFilterEmptyChange={setFilterEmptySubcategories}
      />

      {isLoading ? (
        <div className="py-10 text-center text-gray-600">Loading categories...</div>
      ) : sortedAndFilteredCategories.length === 0 ? (
        <div className="py-10 text-center text-gray-600">
          No categories found. Add a new category to get started.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedAndFilteredCategories.map((category) => (
            <div
              key={category._id}
              id={`category-${category._id}`}
              className={`bg-white rounded-xl shadow-sm border ${category._id.startsWith('temp-') ? 'border-blue-200' : 'border-gray-100'} overflow-hidden transition-all duration-200 ${editingItem?.id === category._id ? 'ring-2 ring-navy/20' : ''}`}
            >
              <div className="p-6 border-b border-gray-100">
                <CategoryItem 
                  category={category}
                  isEditing={editingItem?.id === category._id && editingItem.type === 'category'}
                  editingData={editingItem?.data}
                  isItemLoading={isItemLoading}
                  onToggleExpand={toggleCategoryExpansion}
                  onEdit={(id) => handleEditItem('category', id)}
                  onDelete={handleDeleteCategory}
                  onAddSubcategory={handleAddSubcategory}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveCategory}
                  onEditFieldChange={handleEditFieldChange}
                />
              </div>

              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${category.isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="mt-2 ml-10 pl-4 border-l-2 border-navy/10">
                  <div className="bg-white rounded-lg shadow-sm mb-2">
                    {category.subCategories.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {category.subCategories.map((subcategory) => (
                          <div
                            key={subcategory._id}
                            id={`subcategory-${subcategory._id}`}
                            className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${(subcategory._id.startsWith('temp-') || subcategory.isNew) ? 'bg-blue-50/50' : ''}`}
                          >
                            <SubcategoryItem 
                              categoryId={category._id}
                              subcategory={subcategory}
                              isEditing={editingItem?.id === subcategory._id && editingItem.type === 'subcategory'}
                              editingData={editingItem?.data}
                              isItemLoading={isItemLoading}
                              onEdit={(id) => handleEditItem('subcategory', id, category._id)}
                              onDelete={handleDeleteSubcategory}
                              onCancelEdit={handleCancelEdit}
                              onSave={handleSaveSubcategory}
                              onEditFieldChange={handleEditFieldChange}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No subcategories found. Add a subcategory to get started.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
