export interface Student {
  id: string;
  name: string;
  email: string;
  timezone: string;
}

export interface Booking {
  id: string;
  expertName: string;
  studentDetails: Student;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'upcoming' | 'completed' | 'cancelled' | 'rescheduling';
  topic: string;
  meetingLink?: string;
  recordingLink?: string;
  paymentStatus: 'pending' | 'completed' | 'refunded';
  paymentAmount: number;
  expertNotes?: string;
  feedback?: string;
  cancellationReason?: string;
  originalDateTime?: {
    date: string;
    time: string;
  };
}