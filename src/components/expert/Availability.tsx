import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiLink, FiX } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { formatInTimeZone } from 'date-fns-tz';

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

type WeekSchedule = {
  [key in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']: DaySchedule;
};

const TIMEZONES = [
  { value: 'UTC', label: 'UTC (GMT+0)' },
  { value: 'America/New_York', label: 'Eastern Time (GMT-4)' },
  { value: 'America/Chicago', label: 'Central Time (GMT-5)' },
  { value: 'America/Denver', label: 'Mountain Time (GMT-6)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (GMT-7)' },
  { value: 'Asia/Dubai', label: 'Dubai (GMT+4)' },
  { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
  { value: 'Australia/Sydney', label: 'Sydney (GMT+10)' },
  { value: 'Europe/London', label: 'London (GMT+1)' },
  { value: 'Europe/Paris', label: 'Paris (GMT+2)' },
];

export function Availability() {
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: { enabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    tuesday: { enabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    wednesday: { enabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    thursday: { enabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    friday: { enabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    saturday: { enabled: false, timeSlots: [] },
    sunday: { enabled: false, timeSlots: [] },
  });

  const [selectedTimezone, setSelectedTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  });
  const [localTime, setLocalTime] = useState('');
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const updateLocalTime = () => {
      const now = new Date();
      setLocalTime(formatInTimeZone(now, selectedTimezone, 'h:mm a'));
    };
    
    updateLocalTime();
    const interval = setInterval(updateLocalTime, 60000);
    
    return () => clearInterval(interval);
  }, [selectedTimezone]);

  const addTimeSlot = (day: keyof WeekSchedule) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { start: '09:00', end: '17:00' }]
      }
    }));
  };

  const removeTimeSlot = (day: keyof WeekSchedule, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, i) => i !== index)
      }
    }));
  };

  const toggleDay = (day: keyof WeekSchedule) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled
      }
    }));
  };

  const updateTimeSlot = (
    day: keyof WeekSchedule,
    index: number,
    field: 'start' | 'end',
    value: string
  ) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoogleConnect = async () => {
    setIsConnecting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsGoogleConnected(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    setIsConnecting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsGoogleConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Manage Availability</h1>
          <p className="text-gray-600">Set your weekly schedule and manage your available time slots.</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-4">
          <FcGoogle size={20} />
          <div className="text-sm">
            <p className="font-medium text-gray-900">Google Calendar</p>
            <div className="flex items-center gap-2">
              <p className="text-gray-500">
                {isGoogleConnected ? 'Connected' : 'Not connected'}
              </p>
              <button
                onClick={isGoogleConnected ? handleGoogleDisconnect : handleGoogleConnect}
                disabled={isConnecting}
                className={`flex items-center gap-1 text-sm font-medium ${
                  isGoogleConnected 
                    ? 'text-red-600 hover:text-red-700' 
                    : 'text-navy hover:text-navy/80'
                }`}
              >
                {isConnecting ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isGoogleConnected ? (
                  <>
                    <FiX size={14} />
                    Disconnect
                  </>
                ) : (
                  <>
                    <FiLink size={14} />
                    Connect
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">Time Zone</h2>
              <p className="text-sm text-gray-600">
                Current time: <span className="font-medium">{localTime}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="block w-80 rounded-lg border-gray-200 text-sm focus:border-navy focus:ring-navy"
              >
                {TIMEZONES.map((timezone) => (
                  <option key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {Object.entries(schedule).map(([day, daySchedule]) => (
          <div key={day} className="border-b border-gray-100 last:border-b-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={daySchedule.enabled}
                      onChange={() => toggleDay(day as keyof WeekSchedule)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy"></div>
                  </label>
                  <h3 className="text-lg font-medium text-gray-900">{formatDay(day)}</h3>
                </div>
                {daySchedule.enabled && (
                  <button
                    onClick={() => addTimeSlot(day as keyof WeekSchedule)}
                    className="flex items-center gap-2 text-sm text-navy hover:text-navy/80"
                  >
                    <FiPlus size={16} />
                    Add Time Slot
                  </button>
                )}
              </div>
              
              {daySchedule.enabled && (
                <div className="space-y-3">
                  {daySchedule.timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => updateTimeSlot(day as keyof WeekSchedule, index, 'start', e.target.value)}
                        className="block rounded-lg border-gray-200 text-sm focus:border-navy focus:ring-navy"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => updateTimeSlot(day as keyof WeekSchedule, index, 'end', e.target.value)}
                        className="block rounded-lg border-gray-200 text-sm focus:border-navy focus:ring-navy"
                      />
                      <button
                        onClick={() => removeTimeSlot(day as keyof WeekSchedule, index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <p className="text-sm text-gray-500 italic">
          Changes are automatically synced with Google Calendar
        </p>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}