import { Booking } from '../types/bookings';

export const bookings: Booking[] = [
  {
    id: '1',
    expertName: 'Dr. Sarah Johnson',
    studentDetails: {
      id: 'std1',
      name: 'Alex Thompson',
      email: 'alex.t@example.com',
      timezone: 'America/New_York'
    },
    date: '2025-05-15',
    time: '10:00',
    duration: 60,
    status: 'upcoming',
    topic: 'Career Development Consultation',
    meetingLink: 'https://sessionly.meet/dr-sarah-johnson/career-dev',
    paymentStatus: 'completed',
    paymentAmount: 150
  },
  {
    id: '2',
    expertName: 'Prof. Michael Chen',
    studentDetails: {
      id: 'std2',
      name: 'Emily Brown',
      email: 'emily.b@example.com',
      timezone: 'America/Los_Angeles'
    },
    date: '2025-05-20',
    time: '14:30',
    duration: 45,
    status: 'rescheduling',
    topic: 'Data Science Mentoring',
    meetingLink: 'https://sessionly.meet/prof-chen/data-science',
    paymentStatus: 'completed',
    paymentAmount: 112.50,
    originalDateTime: {
      date: '2025-05-18',
      time: '11:00'
    }
  },
  {
    id: '3',
    expertName: 'Dr. Emily Brown',
    studentDetails: {
      id: 'std3',
      name: 'James Wilson',
      email: 'james.w@example.com',
      timezone: 'Europe/London'
    },
    date: '2025-05-08',
    time: '11:00',
    duration: 30,
    status: 'completed',
    topic: 'Research Methodology Discussion',
    recordingLink: 'https://sessionly.recordings/dr-brown/research-methodology-may8',
    paymentStatus: 'completed',
    paymentAmount: 75,
    expertNotes: 'Student showed great understanding of research methods. Follow-up session recommended.',
    feedback: 'Excellent engagement and preparation. Ready for advanced topics.'
  },
  {
    id: '4',
    expertName: 'Alex Thompson',
    studentDetails: {
      id: 'std4',
      name: 'Sarah Chen',
      email: 'sarah.c@example.com',
      timezone: 'Asia/Singapore'
    },
    date: '2025-05-01',
    time: '16:00',
    duration: 60,
    status: 'cancelled',
    topic: 'Business Strategy Planning',
    paymentStatus: 'refunded',
    paymentAmount: 150,
    cancellationReason: 'Student requested to cancel due to emergency'
  }
];