import { FiAlertCircle, FiEdit2, FiMail, FiPhone, FiCreditCard, FiCheck } from 'react-icons/fi';
import { useState } from 'react';
import { ExpertCategory, mockCategories } from '../../types/categories';

interface CategorySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedCategories: ExpertCategory[]) => void;
  currentCategories: ExpertCategory[];
}

function CategorySelectionModal({ isOpen, onClose, onConfirm, currentCategories }: CategorySelectionModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<{
    [categoryId: string]: {
      name: string;
      selected: boolean;
      subcategories: { id: string; name: string; selected: boolean; }[];
    };
  }>(() => {
    const categories: any = {};
    mockCategories.forEach(cat => {
      const currentCategory = currentCategories.find(c => c.categoryId === cat.id);
      categories[cat.id] = {
        name: cat.name,
        selected: !!currentCategory,
        subcategories: cat.subcategories.map(sub => ({
          id: sub.id,
          name: sub.name,
          selected: !!currentCategory?.subcategories.find(s => s.id === sub.id)
        }))
      };
    });
    return categories;
  });

  const handleConfirm = () => {
    const selected = Object.entries(selectedCategories)
      .filter(([_, cat]) => cat.selected)
      .map(([categoryId, cat]) => ({
        categoryId,
        categoryName: cat.name,
        subcategories: cat.subcategories
          .filter(sub => sub.selected)
          .map(({ id, name }) => ({ id, name }))
      }))
      .filter(cat => cat.subcategories.length > 0);
    
    onConfirm(selected);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Select Your Expertise Areas</h2>
        
        <div className="space-y-6">
          {mockCategories.map(category => (
            <div key={category.id} className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={selectedCategories[category.id].selected}
                  onChange={(e) => {
                    setSelectedCategories(prev => ({
                      ...prev,
                      [category.id]: {
                        ...prev[category.id],
                        selected: e.target.checked,
                        subcategories: prev[category.id].subcategories.map(sub => ({
                          ...sub,
                          selected: e.target.checked
                        }))
                      }
                    }));
                  }}
                  className="rounded border-gray-300 text-navy focus:ring-navy"
                />
                <span className="font-medium">{category.name}</span>
              </label>
              
              <div className="ml-6 space-y-2">
                {category.subcategories.map(sub => (
                  <label key={sub.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories[category.id].subcategories.find(s => s.id === sub.id)?.selected}
                      onChange={(e) => {
                        setSelectedCategories(prev => ({
                          ...prev,
                          [category.id]: {
                            ...prev[category.id],
                            selected: e.target.checked || prev[category.id].subcategories.some(s => s.id !== sub.id && s.selected),
                            subcategories: prev[category.id].subcategories.map(s =>
                              s.id === sub.id ? { ...s, selected: e.target.checked } : s
                            )
                          }
                        }));
                      }}
                      className="rounded border-gray-300 text-navy focus:ring-navy"
                    />
                    <span>{sub.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90"
          >
            <FiCheck className="w-4 h-4 mr-2" />
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
}

export function Profile() {
  const [categories, setCategories] = useState<ExpertCategory[]>([
    {
      categoryId: 'cat1',
      categoryName: 'Software Development',
      subcategories: [
        { id: 'sub1', name: 'Web Development' },
        { id: 'sub2', name: 'System Design' }
      ]
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCategoryUpdate = (selectedCategories: ExpertCategory[]) => {
    setCategories(selectedCategories);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Your Profile</h1>
        <div className="flex items-center text-red-500 text-sm">
          <FiAlertCircle className="w-5 h-5 mr-2" />
          Profile setup incomplete
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-full bg-navy flex items-center justify-center text-white text-xl font-medium">
              MM
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">Milan Mahat</h2>
              <p className="text-gray-600">Software Engineering Expert</p>
            </div>
          </div>
          <button className="text-sm text-navy hover:text-navy/80">
            Change Profile Picture
          </button>
        </div>

        {/* Contact Information - Not Setup */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
            <div className="flex items-center text-amber-600 text-sm">
              <FiAlertCircle className="w-5 h-5 mr-2" />
              Not setup
            </div>
          </div>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-gray-500">
                <FiMail className="w-5 h-5 mr-3" />
                Add your email address
              </div>
              <button className="text-sm text-navy hover:text-navy/80 font-medium">
                <FiEdit2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-gray-500">
                <FiPhone className="w-5 h-5 mr-3" />
                Add your phone number
              </div>
              <button className="text-sm text-navy hover:text-navy/80 font-medium">
                <FiEdit2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Your contact information will only be shared with students after they book a session.
          </p>
        </div>

        {/* Payment Card Setup - Not Setup */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
            <div className="flex items-center text-amber-600 text-sm">
              <FiAlertCircle className="w-5 h-5 mr-2" />
              Not setup
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center text-gray-500">
              <FiCreditCard className="w-5 h-5 mr-3" />
              Add a payment card
            </div>
            <button className="text-sm text-navy hover:text-navy/80 font-medium">
              Setup
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Add a payment card to receive payments from your sessions.
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Expertise Areas
                </label>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm text-navy hover:text-navy/80 font-medium flex items-center"
                >
                  <FiEdit2 className="w-4 h-4 mr-1" />
                  Edit Categories
                </button>
              </div>
              <div className="space-y-4">
                {categories.map(category => (
                  <div key={category.categoryId} className="space-y-2">
                    <div className="font-medium text-sm text-gray-600">{category.categoryName}</div>
                    <div className="flex gap-2 flex-wrap">
                      {category.subcategories.map(sub => (
                        <span 
                          key={sub.id}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="text-gray-500 text-sm">
                    No expertise areas selected. Click 'Edit Categories' to add some.
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <p className="text-gray-600">
                Senior Software Engineer with 10+ years of experience in building scalable applications.
                Passionate about mentoring and helping others grow in their tech careers.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate
              </label>
              <p className="text-gray-900 font-medium">$150/hour</p>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <CategorySelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCategoryUpdate}
        currentCategories={categories}
      />
    </div>
  );
}