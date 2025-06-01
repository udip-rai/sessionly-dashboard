import { FiChevronDown, FiChevronUp, FiEdit, FiLoader, FiPlus, FiTrash2 } from 'react-icons/fi';
import { CategoryState } from './types';

interface CategoryItemProps {
  category: CategoryState;
  isEditing: boolean;
  editingData?: any;
  isItemLoading: (itemId: string, action?: 'create' | 'update' | 'delete') => boolean;
  onToggleExpand: (categoryId: string) => void;
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onAddSubcategory: (categoryId: string) => void;
  onCancelEdit: () => void;
  onSave: (categoryId: string, data: any) => void;
  onEditFieldChange: (field: string, value: string) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isEditing,
  editingData,
  isItemLoading,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddSubcategory,
  onCancelEdit,
  onSave,
  onEditFieldChange
}) => {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={editingData?.name || category.name}
            onChange={(e) => onEditFieldChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
            disabled={isItemLoading(category._id)}
            placeholder="Enter a descriptive name"
            title="A clear, concise name for this category"
          />
          <p className="mt-1 text-xs text-gray-500">
            Choose a descriptive name that experts and students can easily understand
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={editingData?.description || category.description}
            onChange={(e) => onEditFieldChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
            rows={3}
            disabled={isItemLoading(category._id)}
            placeholder="Describe this category and what it contains"
            title="Detailed explanation of this category to help users understand its purpose"
          />
          <p className="mt-1 text-xs text-gray-500">
            Provide a clear description that explains what kind of expertise falls under this category
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancelEdit}
            className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            disabled={isItemLoading(category._id)}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(category._id, editingData)}
            className="px-3 py-2 text-sm text-white bg-navy rounded-lg hover:bg-navy/90 flex items-center"
            disabled={isItemLoading(category._id)}
          >
            {isItemLoading(category._id, 'update') || isItemLoading(category._id, 'create') ? (
              <>
                <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <button
            onClick={() => onToggleExpand(category._id)}
            className="mr-2 p-2 text-gray-500 hover:text-navy rounded-full hover:bg-gray-100 transition-colors"
            aria-label={category.isExpanded ? "Collapse category" : "Expand category"}
            title={category.isExpanded ? "Hide subcategories" : "Show subcategories"}
          >
            {category.isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
              {category._id.startsWith('temp-') && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  New (Unsaved)
                </span>
              )}
              {/* Show subcategory count */}
              {category.subCategories.length > 0 ? (
                <span className="text-xs text-navy bg-navy/10 px-2 py-1 rounded-full flex items-center">
                  <span className="w-1.5 h-1.5 bg-navy rounded-full mr-1"></span>
                  {category.subCategories.length} subcategories
                </span>
              ) : (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  No subcategories
                </span>
              )}
              
              {/* Show total experts in this category */}
              {(typeof category.expertCount === 'number' || category.subCategories.some(sub => typeof sub.expertCount === 'number')) && (
                <span className="ml-2 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-700 rounded-full mr-1"></span>
                  {typeof category.expertCount === 'number' 
                    ? `${category.expertCount} experts`
                    : `${category.subCategories.reduce((sum, sub) => sum + (sub.expertCount || 0), 0)} experts`
                  }
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(category._id)}
            className="p-2 text-gray-500 hover:text-navy rounded-full hover:bg-gray-100"
            disabled={isItemLoading(category._id)}
            title="Edit category"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category._id)}
            className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
            disabled={isItemLoading(category._id)}
            title="Delete category"
          >
            {isItemLoading(category._id, 'delete') ? (
              <FiLoader className="w-4 h-4 animate-spin" />
            ) : (
              <FiTrash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      
      <div className={`mt-4 ml-8 border-l-2 border-gray-200 pl-4 overflow-hidden transition-all duration-300 ${category.isExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
        {category.isExpanded && (
          <button
            onClick={() => onAddSubcategory(category._id)}
            className="flex items-center text-sm text-navy hover:text-navy/80 mb-2 transition-all duration-200 hover:pl-1"
          >
            <FiPlus className="w-4 h-4 mr-1" />
            Add Subcategory
          </button>
        )}
      </div>
    </div>
  );
};
