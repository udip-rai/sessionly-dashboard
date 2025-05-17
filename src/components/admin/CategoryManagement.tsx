import { useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiChevronRight, FiSearch, FiSave, FiX } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  description: string;
  subcategories: Subcategory[];
  order?: number;
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  expertCount: number;
  order?: number;
}

const mockCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Software Development',
    description: 'Programming, software architecture, and development practices',
    subcategories: [
      {
        id: 'sub1',
        name: 'Web Development',
        description: 'Frontend and backend web development',
        expertCount: 45
      },
      {
        id: 'sub2',
        name: 'Mobile Development',
        description: 'iOS, Android, and cross-platform development',
        expertCount: 32
      }
    ]
  },
  {
    id: 'cat2',
    name: 'Data Science',
    description: 'Data analysis, machine learning, and statistics',
    subcategories: [
      {
        id: 'sub3',
        name: 'Machine Learning',
        description: 'ML algorithms, deep learning, and AI',
        expertCount: 28
      },
      {
        id: 'sub4',
        name: 'Data Analytics',
        description: 'Data visualization and business analytics',
        expertCount: 35
      }
    ]
  }
];

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<{ id: string; type: 'category' | 'subcategory'; data?: any } | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'expertCount'>('name');

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: `cat${Date.now()}`,
      name: 'New Category',
      description: 'Category description',
      subcategories: [],
      order: categories.length
    };
    setCategories([...categories, newCategory]);
    setEditingItem({ id: newCategory.id, type: 'category', data: newCategory });
  };

  const handleAddSubcategory = (categoryId: string) => {
    setCategories(cats =>
      cats.map(cat => {
        if (cat.id === categoryId) {
          const newSubcategory = {
            id: `sub${Date.now()}`,
            name: 'New Subcategory',
            description: 'Subcategory description',
            expertCount: 0,
            order: cat.subcategories.length
          };
          return {
            ...cat,
            subcategories: [...cat.subcategories, newSubcategory]
          };
        }
        return cat;
      })
    );
  };

  const handleUpdateCategory = (categoryId: string, data: Partial<Category>) => {
    setCategories(cats =>
      cats.map(cat =>
        cat.id === categoryId ? { ...cat, ...data } : cat
      )
    );
    setEditingItem(null);
  };

  const handleUpdateSubcategory = (categoryId: string, subcategoryId: string, data: Partial<Subcategory>) => {
    setCategories(cats =>
      cats.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub =>
              sub.id === subcategoryId ? { ...sub, ...data } : sub
            )
          };
        }
        return cat;
      })
    );
    setEditingItem(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) {
      setCategories(cats => cats.filter(cat => cat.id !== categoryId));
    }
  };

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      setCategories(cats =>
        cats.map(cat => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId)
            };
          }
          return cat;
        })
      );
    }
  };

  const filteredCategories = categories
    .map(category => ({
      ...category,
      subcategories: category.subcategories
        .filter(sub =>
          sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          if (sortBy === 'name') return a.name.localeCompare(b.name);
          return b.expertCount - a.expertCount;
        })
    }))
    .filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.subcategories.length > 0
    );

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
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories and subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'expertCount')}
              className="border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy p-2"
            >
              <option value="name">Name</option>
              <option value="expertCount">Expert Count</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              {editingItem?.id === category.id && editingItem.type === 'category' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={editingItem.data?.name || category.name}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingItem.data?.description || category.description}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, description: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleUpdateCategory(category.id, editingItem.data)}
                      className="flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                    >
                      <FiSave className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200"
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingItem({ 
                        id: category.id, 
                        type: 'category',
                        data: { name: category.name, description: category.description }
                      })}
                      className="p-2 text-gray-600 hover:text-navy"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <button
                  onClick={() => handleAddSubcategory(category.id)}
                  className="flex items-center text-sm text-navy hover:text-navy/80"
                >
                  <FiPlus className="w-4 h-4 mr-1" />
                  Add Subcategory
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {category.subcategories.map((subcategory) => (
                <div
                  key={subcategory.id}
                  className="p-4 bg-gray-50 flex items-center justify-between"
                >
                  {editingItem?.id === subcategory.id && editingItem.type === 'subcategory' ? (
                    <div className="w-full space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subcategory Name
                          </label>
                          <input
                            type="text"
                            value={editingItem.data?.name || subcategory.name}
                            onChange={(e) => setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, name: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expert Count
                          </label>
                          <input
                            type="number"
                            value={editingItem.data?.expertCount || subcategory.expertCount}
                            onChange={(e) => setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, expertCount: parseInt(e.target.value) }
                            })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={editingItem.data?.description || subcategory.description}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, description: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdateSubcategory(category.id, subcategory.id, editingItem.data)}
                          className="flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                        >
                          <FiSave className="w-4 h-4 mr-2" />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200"
                        >
                          <FiX className="w-4 h-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <FiChevronRight className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {subcategory.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {subcategory.description}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {subcategory.expertCount} experts
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingItem({ 
                            id: subcategory.id, 
                            type: 'subcategory',
                            data: { 
                              name: subcategory.name, 
                              description: subcategory.description,
                              expertCount: subcategory.expertCount
                            }
                          })}
                          className="p-2 text-gray-600 hover:text-navy"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                          className="p-2 text-gray-600 hover:text-red-600"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}