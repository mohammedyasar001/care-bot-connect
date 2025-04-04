
import { User, Appointment, Feedback, ChatMessage } from '@/types';
import { getBotResponse } from '@/utils/healthData';

// In-memory storage
const storage = {
  user: null as User | null,
  appointments: [] as Appointment[],
  feedback: [] as Feedback[],
  chatHistory: [] as ChatMessage[],
};

// User methods
export const getUser = async (): Promise<User | null> => {
  // Try to load from localStorage first
  try {
    const savedUser = localStorage.getItem('healthcare_user');
    if (savedUser) {
      storage.user = JSON.parse(savedUser);
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
  }
  
  return storage.user;
};

export const saveUser = async (user: User): Promise<void> => {
  storage.user = user;
  try {
    localStorage.setItem('healthcare_user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

// Appointment methods
export const getAppointments = async (): Promise<Appointment[]> => {
  // Try to load from localStorage first
  try {
    const savedAppointments = localStorage.getItem('healthcare_appointments');
    if (savedAppointments) {
      storage.appointments = JSON.parse(savedAppointments);
    }
  } catch (error) {
    console.error('Error loading appointments from localStorage:', error);
  }
  
  return storage.appointments;
};

export const saveAppointment = async (appointment: Appointment): Promise<Appointment> => {
  const newAppointment = {
    ...appointment,
    id: Date.now()
  };
  
  storage.appointments.push(newAppointment);
  
  try {
    localStorage.setItem('healthcare_appointments', JSON.stringify(storage.appointments));
  } catch (error) {
    console.error('Error saving appointments to localStorage:', error);
  }
  
  return newAppointment;
};

export const deleteAppointment = async (id: number): Promise<void> => {
  storage.appointments = storage.appointments.filter(app => app.id !== id);
  
  try {
    localStorage.setItem('healthcare_appointments', JSON.stringify(storage.appointments));
  } catch (error) {
    console.error('Error saving appointments to localStorage:', error);
  }
};

// Feedback methods
export const saveFeedback = async (feedback: Feedback): Promise<void> => {
  const newFeedback = {
    ...feedback,
    id: Date.now()
  };
  
  storage.feedback.push(newFeedback);
  
  try {
    localStorage.setItem('healthcare_feedback', JSON.stringify(storage.feedback));
  } catch (error) {
    console.error('Error saving feedback to localStorage:', error);
  }
};

export const getFeedback = async (): Promise<Feedback[]> => {
  // Try to load from localStorage first
  try {
    const savedFeedback = localStorage.getItem('healthcare_feedback');
    if (savedFeedback) {
      storage.feedback = JSON.parse(savedFeedback);
    }
  } catch (error) {
    console.error('Error loading feedback from localStorage:', error);
  }
  
  return storage.feedback;
};

// Chat history methods
export const getChatHistory = async (): Promise<ChatMessage[]> => {
  // Try to load from localStorage first
  try {
    const savedChat = localStorage.getItem('healthcare_chat');
    if (savedChat) {
      storage.chatHistory = JSON.parse(savedChat).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
  } catch (error) {
    console.error('Error loading chat history from localStorage:', error);
  }
  
  return storage.chatHistory;
};

export const clearChatHistory = async (): Promise<void> => {
  storage.chatHistory = [];
  try {
    localStorage.setItem('healthcare_chat', JSON.stringify(storage.chatHistory));
  } catch (error) {
    console.error('Error clearing chat history in localStorage:', error);
  }
};

// Process user message and get bot response
export const sendMessageToBot = async (message: string): Promise<ChatMessage[]> => {
  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    message,
    sender: 'You',
    timestamp: new Date()
  };
  
  storage.chatHistory.push(userMessage);
  
  // Get response from our health data utility
  const botResponse = getBotResponse(message);
  
  const botMessage: ChatMessage = {
    id: (Date.now() + 1).toString(),
    message: botResponse,
    sender: 'HealthCare Bot',
    timestamp: new Date()
  };
  
  storage.chatHistory.push(botMessage);
  
  try {
    localStorage.setItem('healthcare_chat', JSON.stringify(storage.chatHistory));
  } catch (error) {
    console.error('Error saving chat history to localStorage:', error);
  }
  
  // Return last two messages (user + bot)
  return [userMessage, botMessage];
};
