import { FiVideo, FiPlay, FiClock, FiDollarSign, FiX, FiCalendar, FiMail, FiGlobe } from 'react-icons/fi';
import { format } from 'date-fns';
import { Booking } from '../../types/bookings';
import { useLocation } from 'react-router-dom';

interface BookingsListProps {
  bookings: Booking[];
}

export function BookingsList({ bookings }: BookingsListProps) {
  const location = useLocation();
  const isExpertDashboard = location.pathname.startsWith('/expert-dashboard');

  const handleCancel = (bookingId: string) => {
    // To be implemented: Handle cancellation
    console.log('Cancel booking:', bookingId);
  };

  const handleReschedule = (bookingId: string) => {
    // To be implemented: Handle reschedule
    console.log('Reschedule booking:', bookingId);
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div 
          key={booking.id} 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h3 className="font-semibold text-gray-900">
                  {booking.studentDetails.name}
                </h3>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  booking.status === 'completed' 
                    ? 'bg-gray-100 text-gray-600'
                    : booking.status === 'cancelled'
                    ? 'bg-red-100 text-red-600'
                    : booking.status === 'rescheduling'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-navy/10 text-navy'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  booking.paymentStatus === 'completed'
                    ? 'bg-green-100 text-green-600'
                    : booking.paymentStatus === 'refunded'
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  Payment: {booking.paymentStatus}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{booking.topic}</p>
              
              {/* Student Details */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <FiMail className="w-4 h-4 mr-2" />
                  {booking.studentDetails.email}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiGlobe className="w-4 h-4 mr-2" />
                  {booking.studentDetails.timezone}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                <FiDollarSign className="w-4 h-4 mr-1 text-green-600" />
                {booking.paymentAmount.toFixed(2)}
              </div>
              {booking.originalDateTime && (
                <div className="flex items-center text-sm text-yellow-600">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  Rescheduled from: {format(new Date(`${booking.originalDateTime.date}T${booking.originalDateTime.time}`), 'PPp')}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <FiClock className="w-4 h-4 mr-2" />
              {format(new Date(`${booking.date}T${booking.time}`), 'PPp')} · {booking.duration} mins
            </div>
            
            <div className="flex items-center gap-4">
              {/* Actions for completed sessions */}
              {booking.status === 'completed' && booking.recordingLink && (
                <a
                  href={booking.recordingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-navy hover:text-navy/80 transition-colors duration-200"
                >
                  <FiPlay className="w-4 h-4 mr-2" />
                  View Recording
                </a>
              )}

              {/* Actions for upcoming sessions */}
              {booking.status === 'upcoming' && (
                <>
                  <a
                    href={booking.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors duration-200"
                  >
                    <FiVideo className="w-4 h-4 mr-2" />
                    Join Meeting
                  </a>
                  {isExpertDashboard && (
                    <>
                      <button
                        onClick={() => handleReschedule(booking.id)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-navy hover:text-navy/80 transition-colors duration-200"
                      >
                        <FiCalendar className="w-4 h-4 mr-2" />
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
                      >
                        <FiX className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}