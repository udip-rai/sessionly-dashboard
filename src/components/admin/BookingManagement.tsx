import { useState } from 'react';
import { FiSearch, FiFilter, FiDownload, FiCalendar, FiDollarSign, FiClock, FiUser, FiCheck, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import { bookings } from '../../data/bookings';

export function BookingManagement() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const bookingStats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'completed').length,
    upcoming: bookings.filter(b => b.status === 'upcoming').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.paymentAmount, 0),
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeFilter !== 'all' && booking.status !== activeFilter) return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.expertName.toLowerCase().includes(searchLower) ||
        booking.studentDetails.name.toLowerCase().includes(searchLower) ||
        booking.topic.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Bookings Management</h1>
        <p className="text-gray-600 mt-2">View and manage all platform bookings</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
              <h3 className="text-2xl font-semibold text-gray-900">{bookingStats.total}</h3>
            </div>
            <div className="p-3 bg-navy/5 rounded-lg">
              <FiCalendar className="w-6 h-6 text-navy" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <h3 className="text-2xl font-semibold text-gray-900">{bookingStats.completed}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <FiCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Upcoming</p>
              <h3 className="text-2xl font-semibold text-gray-900">{bookingStats.upcoming}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiClock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cancelled</p>
              <h3 className="text-2xl font-semibold text-gray-900">{bookingStats.cancelled}</h3>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <FiX className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                ${bookingStats.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-navy/5 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-navy" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeFilter === 'all'
                  ? 'bg-navy text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setActiveFilter('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeFilter === 'upcoming'
                  ? 'bg-navy text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeFilter === 'completed'
                  ? 'bg-navy text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveFilter('cancelled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeFilter === 'cancelled'
                  ? 'bg-navy text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Cancelled
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
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

      {/* Bookings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expert
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {booking.topic}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {booking.id}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {format(new Date(`${booking.date}T${booking.time}`), 'PPp')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.duration} minutes
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-navy/10 flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-navy" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.expertName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-navy/10 flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-navy" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.studentDetails.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.studentDetails.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    booking.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : booking.status === 'rescheduling'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    ${booking.paymentAmount}
                  </div>
                  <div className={`text-xs font-medium ${
                    booking.paymentStatus === 'completed'
                      ? 'text-green-600'
                      : booking.paymentStatus === 'refunded'
                      ? 'text-orange-600'
                      : 'text-yellow-600'
                  }`}>
                    {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}