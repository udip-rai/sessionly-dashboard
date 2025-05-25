import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiUserCheck,
  FiUserX,
  FiClock,
} from "react-icons/fi";

export function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "2,541", icon: FiUsers, change: "+12%" },
    { label: "Active Experts", value: "487", icon: FiUserCheck, change: "+5%" },
    { label: "Pending Applications", value: "23", icon: FiUserX, change: null },
    {
      label: "Total Bookings",
      value: "12,843",
      icon: FiCalendar,
      change: "+18%",
    },
    {
      label: "Revenue (MTD)",
      value: "$45,233",
      icon: FiDollarSign,
      change: "+22%",
    },
    {
      label: "Avg. Session Duration",
      value: "52 min",
      icon: FiClock,
      change: "+3%",
    },
  ];

  console.log("ADMIN DASHBOARD");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Super Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage and monitor all platform activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </h3>
                  {stat.change && (
                    <span
                      className={`text-sm ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3 bg-navy/5 rounded-lg">
                <stat.icon className="w-6 h-6 text-navy" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <button className="p-4 text-left rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors duration-200">
            <FiUserCheck className="w-6 h-6 text-navy mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">
              Review Expert Applications
            </h3>
            <p className="text-sm text-gray-600">
              23 applications pending review
            </p>
          </button>
          <button className="p-4 text-left rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors duration-200">
            <FiCalendar className="w-6 h-6 text-navy mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">
              View Today's Sessions
            </h3>
            <p className="text-sm text-gray-600">48 sessions scheduled today</p>
          </button>
          <button className="p-4 text-left rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors duration-200">
            <FiDollarSign className="w-6 h-6 text-navy mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Payment Reports</h3>
            <p className="text-sm text-gray-600">
              View latest transaction reports
            </p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUserCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New Expert Application
                </p>
                <p className="text-sm text-gray-600">
                  John Doe applied as a Software Engineering expert
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-500">2 mins ago</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCalendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Session Completed
                </p>
                <p className="text-sm text-gray-600">
                  Career Development session with Sarah Johnson
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-500">15 mins ago</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiDollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Payment Processed
                </p>
                <p className="text-sm text-gray-600">
                  $150 paid out to Expert ID #1234
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-500">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
