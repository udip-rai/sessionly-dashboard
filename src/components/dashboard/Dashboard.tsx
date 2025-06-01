import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookingsList } from "./BookingsList";
import { bookings } from "../../data/bookings";
import { FiUser, FiExternalLink } from "react-icons/fi";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();

  const filteredBookings = bookings.filter((booking) =>
    activeTab === "upcoming"
      ? booking.status === "upcoming"
      : booking.status === "completed",
  );

  // Direct navigation handler
  const goToProfile = () => {
    console.log("Navigating to profile from dashboard");
    navigate("/student-dashboard/profile");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Quick Access Profile Card */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 shadow-sm border border-blue-100 flex justify-between items-center">
        <div>
          <h3 className="font-medium text-blue-800">Complete Your Profile</h3>
          <p className="text-sm text-blue-600 mt-1">
            Update your profile information for a better experience
          </p>
        </div>
        <button
          onClick={goToProfile}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <FiUser className="w-4 h-4" />
          <span>Go to Profile</span>
          <FiExternalLink className="w-3 h-3 opacity-70" />
        </button>
      </div>

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-8">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`py-4 text-sm font-medium ${
                activeTab === "upcoming"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              UPCOMING
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`py-4 text-sm font-medium ${
                activeTab === "past"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              PAST
            </button>
          </nav>
        </div>
      </div>

      {filteredBookings.length > 0 ? (
        <BookingsList bookings={filteredBookings} />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            No {activeTab} calls scheduled
          </h2>
          <p className="text-gray-600">
            {activeTab === "upcoming"
              ? "Browse experts to schedule your next call"
              : "Your past calls will appear here"}
          </p>
        </div>
      )}
    </div>
  );
}
