import { useState } from 'react';
import { BookingsList } from './BookingsList';
import { bookings } from '../../data/bookings';

export function ExpertDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const filteredBookings = bookings.filter(booking => 
    activeTab === 'upcoming' ? booking.status === 'upcoming' : booking.status === 'completed'
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 text-sm font-medium ${
                activeTab === 'upcoming'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              UPCOMING
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 text-sm font-medium ${
                activeTab === 'past'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
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
            No {activeTab} sessions scheduled
          </h2>
          <p className="text-gray-600">
            {activeTab === 'upcoming' 
              ? 'Set your availability to receive more bookings'
              : 'Your past sessions will appear here'
            }
          </p>
        </div>
      )}
    </div>
  );
}