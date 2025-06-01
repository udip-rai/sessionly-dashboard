import { FiSearch } from 'react-icons/fi';

interface SearchFiltersProps {
  searchTerm: string;
  sortBy: 'name' | 'expertCount';
  sortOrder: 'asc' | 'desc';
  filterEmptySubcategories: boolean;
  onSearchChange: (value: string) => void;
  onSortByChange: (value: 'name' | 'expertCount') => void;
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  onFilterEmptyChange: (value: boolean) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  sortBy,
  sortOrder,
  filterEmptySubcategories,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
  onFilterEmptyChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories and subcategories..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'name' | 'expertCount')}
            className="border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy p-2"
          >
            <option value="name">Name</option>
            <option value="expertCount">Expert Count</option>
          </select>
          <label className="text-sm text-gray-600">Order:</label>
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
            className="border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy p-2"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="filterEmptySubcategories"
              checked={filterEmptySubcategories}
              onChange={(e) => onFilterEmptyChange(e.target.checked)}
              className="h-4 w-4 text-navy border-gray-300 rounded focus:ring-navy focus:ring-opacity-50"
            />
            <label htmlFor="filterEmptySubcategories" className="text-sm text-gray-600 cursor-pointer">
              Hide empty subcategories
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
