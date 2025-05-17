import { useState } from 'react';
import { FiCheck, FiX, FiSearch, FiFilter, FiDownload, FiMail, FiPhone, FiGlobe, FiStar, FiChevronRight } from 'react-icons/fi';
import { ExpertCategory } from '../../types/categories';

interface ExpertApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  categories: ExpertCategory[];
  experience: number;
  timezone: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  rating?: number;
  totalSessions?: number;
}

const mockApplications: ExpertApplication[] = [
  {
    id: 'EXP001',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 234 567 8901',
    categories: [
      {
        categoryId: 'cat2',
        categoryName: 'Data Science',
        subcategories: [
          { id: 'sub4', name: 'Machine Learning' },
          { id: 'sub5', name: 'Data Analytics' }
        ]
      }
    ],
    experience: 8,
    timezone: 'America/New_York',
    status: 'pending',
    appliedAt: '2025-05-09T14:30:00',
  },
  {
    id: 'EXP002',
    name: 'John Smith',
    email: 'john.s@example.com',
    phone: '+1 234 567 8902',
    categories: [
      {
        categoryId: 'cat1',
        categoryName: 'Software Development',
        subcategories: [
          { id: 'sub1', name: 'Web Development' },
          { id: 'sub2', name: 'Mobile Development' }
        ]
      }
    ],
    experience: 12,
    timezone: 'Europe/London',
    status: 'approved',
    appliedAt: '2025-05-08T10:15:00',
    rating: 4.8,
    totalSessions: 156,
  },
];

export function ExpertManagement() {
  const [applications, setApplications] = useState<ExpertApplication[]>(mockApplications);
  const [filter, setFilter] = useState('all');

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    setApplications(apps =>
      apps.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Expert Applications</h1>
        <p className="text-gray-600 mt-2">Review and manage expert applications</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'all'
                  ? 'bg-navy text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Applications
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'pending'
                  ? 'bg-navy text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pending Review
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'approved'
                  ? 'bg-navy text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'rejected'
                  ? 'bg-navy text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Rejected
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              />
            </div>
            <button className="p-2 text-gray-600 hover:text-navy">
              <FiFilter className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-navy">
              <FiDownload className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {filteredApplications.map((application) => (
          <div
            key={application.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {application.name}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    application.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : application.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FiMail className="w-4 h-4 mr-2" />
                    {application.email}
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="w-4 h-4 mr-2" />
                    {application.phone}
                  </div>
                  <div className="flex items-center">
                    <FiGlobe className="w-4 h-4 mr-2" />
                    {application.timezone}
                  </div>
                </div>
              </div>
              {application.rating && (
                <div className="flex items-center text-sm">
                  <FiStar className="w-4 h-4 mr-1 text-yellow-400" />
                  <span className="font-medium">{application.rating}</span>
                  <span className="text-gray-500 ml-1">
                    ({application.totalSessions} sessions)
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {application.categories.map(category => (
                <div key={category.categoryId} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FiChevronRight className="w-4 h-4 text-gray-400 mr-2" />
                    <h4 className="text-sm font-medium text-gray-900">{category.categoryName}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.map(sub => (
                      <span
                        key={sub.id}
                        className="px-3 py-1 bg-navy/5 text-navy rounded-full text-sm"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>{application.experience} years</strong> of professional experience
              </p>
              <p>
                Applied on {new Date(application.appliedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {application.status === 'pending' && (
              <div className="mt-6 flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(application.id, 'approved')}
                  className="flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                >
                  <FiCheck className="w-4 h-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(application.id, 'rejected')}
                  className="flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                >
                  <FiX className="w-4 h-4 mr-2" />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}