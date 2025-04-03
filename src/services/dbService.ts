
import { User, Appointment, Feedback } from '@/types';

// LocalStorage keys
const STORAGE_KEYS = {
  USERS: 'healthcare-bot-users',
  APPOINTMENTS: 'healthcare-bot-appointments',
  FEEDBACK: 'healthcare-bot-feedback',
  CHAT_HISTORY: 'healthcare-bot-chat-history'
};

// User methods
export const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : null;
};

export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(user));
};

// Appointment methods
export const getAppointments = (): Appointment[] => {
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  return data ? JSON.parse(data) : [];
};

export const saveAppointment = (appointment: Appointment): Appointment => {
  const appointments = getAppointments();
  const newAppointment = {
    ...appointment,
    id: Date.now(), // Simple ID generation
    reminded: false
  };
  
  appointments.push(newAppointment);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  return newAppointment;
};

export const deleteAppointment = (id: number): void => {
  const appointments = getAppointments();
  const updatedAppointments = appointments.filter(app => app.id !== id);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updatedAppointments));
};

// Feedback methods
export const saveFeedback = (feedback: Feedback): void => {
  const feedbackList = getFeedback();
  const newFeedback = {
    ...feedback,
    id: Date.now()
  };
  
  feedbackList.push(newFeedback);
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbackList));
};

export const getFeedback = (): Feedback[] => {
  const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
  return data ? JSON.parse(data) : [];
};

// Chat history methods
export const saveChatHistory = (chatHistory: any[]): void => {
  // Limit to the last 50 messages to avoid storage issues
  const limitedHistory = chatHistory.slice(-50);
  localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(limitedHistory));
};

export const getChatHistory = (): any[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
  return data ? JSON.parse(data) : [];
};

export const clearChatHistory = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
};
