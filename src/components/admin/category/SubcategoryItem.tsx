import { FiEdit, FiLoader, FiTrash2 } from 'react-icons/fi';
import { SubCategoryState } from './types';

interface SubcategoryItemProps {
  subcategory: SubCategoryState;
  categoryId: string;
  isEditing: boolean;
  editingData?: any;
  isItemLoading: (itemId: string, action?: 'create' | 'update' | 'delete') => boolean;
  onEdit: (subcategoryId: string) => void;
  onDelete: (categoryId: string, subcategoryId: string) => void;
  onCancelEdit: () => void;
  onSave: (categoryId: string, subcategoryId: string, data: any) => void;
  onEditFieldChange: (field: string, value: string) => void;
}

export const SubcategoryItem: React.FC<SubcategoryItemProps> = ({
  categoryId,
  subcategory,
  isEditing,
  editingData,
  isItemLoading,
  onEdit,
  onDelete,
  onCancelEdit,
  onSave,
  onEditFieldChange
}) => {
  if (isEditing) {
    return (
      <div className="w-full space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subcategory Name
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={editingData?.name || subcategory.name}
            onChange={(e) => onEditFieldChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
            disabled={isItemLoading(subcategory._id)}
            placeholder="Enter a specific subcategory name"
            title="A specific name for this expertise subcategory"
          />
          <p className="mt-1 text-xs text-gray-500">
            Choose a specific name that clearly identifies this area of expertise
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={editingData?.description || subcategory.description}
            onChange={(e) => onEditFieldChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
            rows={2}
            disabled={isItemLoading(subcategory._id)}
            placeholder="Describe this specific area of expertise"
            title="Detailed explanation of this subcategory to help users understand its scope"
          />
          <p className="mt-1 text-xs text-gray-500">
            Provide details about what skills and knowledge are covered by this subcategory
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancelEdit}
            className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            disabled={isItemLoading(subcategory._id)}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(categoryId, subcategory._id, editingData)}
            className="px-3 py-2 text-sm text-white bg-navy rounded-lg hover:bg-navy/90 flex items-center"
            disabled={isItemLoading(subcategory._id)}
          >
            {isItemLoading(subcategory._id, 'update') || isItemLoading(subcategory._id, 'create') ? (
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
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-900">{subcategory.name}</h4>
          {(subcategory._id.startsWith('temp-') || subcategory.isNew) && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              New (Unsaved)
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{subcategory.description}</p>
        <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
          {subcategory.expertCount} expert{subcategory.expertCount !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(subcategory._id)}
          className="p-1.5 text-gray-500 hover:text-navy rounded-full hover:bg-gray-100"
          disabled={isItemLoading(subcategory._id)}
          title="Edit subcategory"
        >
          <FiEdit className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(categoryId, subcategory._id)}
          className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
          disabled={isItemLoading(subcategory._id)}
          title="Delete subcategory"
        >
          {isItemLoading(subcategory._id, 'delete') ? (
            <FiLoader className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FiTrash2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
