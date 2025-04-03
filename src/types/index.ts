
export interface User {
  id?: number;
  name: string;
  age: number;
  preferences?: string;
}

export interface Appointment {
  id?: number;
  date: string;
  time: string;
  reason: string;
  reminded?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'You' | 'HealthCare Bot';
  message: string;
  timestamp: Date;
}

export interface Feedback {
  id?: number;
  message: string;
  rating: number;
}
