import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiMessageSquare,
  FiCalendar,
} from "react-icons/fi";

// This is a placeholder component - in a real implementation, you'd fetch expert data from your API
export const BrowseExperts: React.FC = () => {
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Categories for filtering (placeholder)
  const categories = [
    "All Categories",
    "Academic",
    "Career",
    "Technical",
    "Creative",
    "Life Skills",
  ];

  // Mock expert data - replace with API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockExperts = [
        {
          id: 1,
          name: "Dr. Jane Smith",
          title: "Academic Advisor",
          category: "Academic",
          rating: 4.9,
          reviewCount: 124,
          hourlyRate: 75,
          avatar: "JS",
          bio: "PhD in Education with 10+ years of experience helping students achieve academic success.",
          specialties: ["Study Skills", "Writing", "Research Methods"],
          availability: [
            { day: "Monday", slots: ["9:00 AM", "1:00 PM"] },
            { day: "Wednesday", slots: ["11:00 AM", "3:00 PM"] },
            { day: "Friday", slots: ["2:00 PM", "4:00 PM"] },
          ],
        },
        {
          id: 2,
          name: "Michael Johnson",
          title: "Software Developer",
          category: "Technical",
          rating: 4.8,
          reviewCount: 89,
          hourlyRate: 95,
          avatar: "MJ",
          bio: "Senior developer with expertise in web and mobile applications.",
          specialties: ["JavaScript", "React", "Node.js"],
          availability: [
            { day: "Tuesday", slots: ["10:00 AM", "2:00 PM"] },
            { day: "Thursday", slots: ["1:00 PM", "5:00 PM"] },
            { day: "Saturday", slots: ["11:00 AM", "3:00 PM"] },
          ],
        },
        {
          id: 3,
          name: "Sarah Wilson",
          title: "Career Coach",
          category: "Career",
          rating: 4.7,
          reviewCount: 112,
          hourlyRate: 85,
          avatar: "SW",
          bio: "Certified career coach specializing in resume building and interview preparation.",
          specialties: [
            "Resume Writing",
            "Interview Skills",
            "LinkedIn Optimization",
          ],
          availability: [
            { day: "Monday", slots: ["11:00 AM", "3:00 PM"] },
            { day: "Wednesday", slots: ["9:00 AM", "1:00 PM"] },
            { day: "Friday", slots: ["10:00 AM", "2:00 PM"] },
          ],
        },
        {
          id: 4,
          name: "David Lee",
          title: "Creative Director",
          category: "Creative",
          rating: 4.6,
          reviewCount: 75,
          hourlyRate: 90,
          avatar: "DL",
          bio: "Design professional with a passion for helping students develop their creative skills.",
          specialties: ["Graphic Design", "UI/UX", "Portfolio Development"],
          availability: [
            { day: "Tuesday", slots: ["9:00 AM", "3:00 PM"] },
            { day: "Thursday", slots: ["11:00 AM", "5:00 PM"] },
          ],
        },
        {
          id: 5,
          name: "Emily Chen",
          title: "Life Coach",
          category: "Life Skills",
          rating: 4.9,
          reviewCount: 95,
          hourlyRate: 80,
          avatar: "EC",
          bio: "Helping students develop better habits and achieve work-life balance.",
          specialties: ["Time Management", "Stress Reduction", "Goal Setting"],
          availability: [
            { day: "Monday", slots: ["2:00 PM", "6:00 PM"] },
            { day: "Wednesday", slots: ["10:00 AM", "2:00 PM"] },
            { day: "Friday", slots: ["9:00 AM", "1:00 PM"] },
          ],
        },
      ];

      setExperts(mockExperts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter experts based on search term and category
  const filteredExperts = experts.filter((expert) => {
    const matchesSearch =
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      selectedCategory === "All Categories" ||
      expert.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle booking functionality
  const handleBookExpert = (expertId: number) => {
    // In a real application, this would navigate to a booking page or open a modal
    console.log(`Booking expert with ID: ${expertId}`);
    alert("Booking functionality will be implemented soon!");
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Browse Experts
        </h1>
        <p className="text-gray-600">
          Find the perfect expert for your learning journey
        </p>
      </div>

      {/* Search and filter section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
            placeholder="Search by name, title, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy appearance-none bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.slice(1).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Results section */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
          </div>
        ) : filteredExperts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-600">
              No experts found matching your criteria
            </p>
          </div>
        ) : (
          filteredExperts.map((expert) => (
            <div
              key={expert.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Expert avatar */}
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-navy to-navy-dark flex items-center justify-center text-white text-lg font-medium shadow-lg">
                      {expert.avatar}
                    </div>
                  </div>

                  {/* Expert info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {expert.name}
                        </h3>
                        <p className="text-gray-600">{expert.title}</p>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0">
                        <span className="flex items-center text-amber-500">
                          <FiStar className="h-4 w-4 fill-current" />
                          <span className="ml-1 text-sm font-medium">
                            {expert.rating}
                          </span>
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({expert.reviewCount} reviews)
                        </span>
                        <span className="ml-4 text-navy font-medium">
                          ${expert.hourlyRate}/hr
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mt-2 mb-3">{expert.bio}</p>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Specialties:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {expert.specialties.map(
                          (specialty: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-md"
                            >
                              {specialty}
                            </span>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="flex flex-wrap gap-4 justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Next Available:
                          </p>
                          <div className="flex items-center gap-1 text-gray-600 text-sm">
                            <FiCalendar className="h-4 w-4" />
                            <span>
                              {expert.availability[0].day} at{" "}
                              {expert.availability[0].slots[0]}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBookExpert(expert.id)}
                            className="px-4 py-2 bg-navy hover:bg-navy-dark text-white rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            <div className="flex items-center">
                              <FiCalendar className="mr-2 h-4 w-4" />
                              Book Session
                            </div>
                          </button>

                          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-200">
                            <div className="flex items-center">
                              <FiMessageSquare className="mr-2 h-4 w-4" />
                              View Profile
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseExperts;
