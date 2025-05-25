import { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiMail,
  FiPhone,
  FiGlobe,
  FiStar,
  FiEdit2,
  FiLock,
} from "react-icons/fi";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "student" | "staff";
  status: "active" | "inactive" | "blocked";
  joinedDate: string;
  timezone: string;
  totalSessions?: number;
  rating?: number;
  expertiseAreas?: string[];
}

const mockUsers: User[] = [
  {
    id: "usr1",
    name: "John Smith",
    email: "john.s@example.com",
    phone: "+1 234 567 8901",
    type: "student",
    status: "active",
    joinedDate: "2025-01-15",
    timezone: "America/New_York",
    totalSessions: 12,
  },
  {
    id: "usr2",
    name: "Dr. Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 234 567 8902",
    type: "staff",
    status: "active",
    joinedDate: "2024-11-20",
    timezone: "Europe/London",
    totalSessions: 156,
    rating: 4.8,
    expertiseAreas: ["Machine Learning", "Data Science", "Python"],
  },
  {
    id: "usr3",
    name: "Emily Brown",
    email: "emily.b@example.com",
    phone: "+1 234 567 8903",
    type: "student",
    status: "blocked",
    joinedDate: "2025-02-01",
    timezone: "Asia/Singapore",
    totalSessions: 0,
  },
];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) => {
    if (filter !== "all" && user.type !== filter) return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.id.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const handleStatusChange = (userId: string, newStatus: User["status"]) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user,
      ),
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          User Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage all platform users and experts
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <h3 className="text-2xl font-semibold text-gray-900">
            {users.length}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Active Students</p>
          <h3 className="text-2xl font-semibold text-gray-900">
            {
              users.filter((u) => u.type === "student" && u.status === "active")
                .length
            }
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Active Experts</p>
          <h3 className="text-2xl font-semibold text-gray-900">
            {
              users.filter((u) => u.type === "staff" && u.status === "active")
                .length
            }
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Blocked Users</p>
          <h3 className="text-2xl font-semibold text-gray-900">
            {users.filter((u) => u.status === "blocked").length}
          </h3>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === "all"
                  ? "bg-navy text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setFilter("student")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === "student"
                  ? "bg-navy text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setFilter("staff")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === "staff"
                  ? "bg-navy text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Experts
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Users List */}
      <div className="space-y-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {user.name}
                  </h3>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-navy/10 text-navy">
                    {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : user.status === "blocked"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <FiMail className="w-4 h-4 mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="w-4 h-4 mr-2" />
                    {user.phone}
                  </div>
                  <div className="flex items-center">
                    <FiGlobe className="w-4 h-4 mr-2" />
                    {user.timezone}
                  </div>
                </div>
                {user.type === "staff" && user.expertiseAreas && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {user.expertiseAreas.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-navy/5 text-navy rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    Joined: {new Date(user.joinedDate).toLocaleDateString()}
                  </div>
                  <div>Total Sessions: {user.totalSessions}</div>
                  {user.rating && (
                    <div className="flex items-center">
                      <FiStar className="w-4 h-4 mr-1 text-yellow-400" />
                      {user.rating}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    /* Handle edit */
                  }}
                  className="p-2 text-gray-600 hover:text-navy"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                {user.status === "blocked" ? (
                  <button
                    onClick={() => handleStatusChange(user.id, "active")}
                    className="flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                  >
                    Unblock User
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(user.id, "blocked")}
                    className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700"
                  >
                    <FiLock className="w-4 h-4 mr-2" />
                    Block User
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
