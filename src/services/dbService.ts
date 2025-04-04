import { User, Appointment, Feedback, ChatMessage } from '@/types';

const API_URL = 'http://localhost:5000/api';

// User methods
export const getUser = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/user`);
    const data = await response.json();
    return Object.keys(data).length === 0 ? null : data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const saveUser = async (user: User): Promise<void> => {
  try {
    await fetch(`${API_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

// Appointment methods
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await fetch(`${API_URL}/appointments`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

export const saveAppointment = async (appointment: Appointment): Promise<Appointment> => {
  try {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointment),
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving appointment:', error);
    throw new Error('Failed to save appointment');
  }
};

export const deleteAppointment = async (id: number): Promise<void> => {
  try {
    await fetch(`${API_URL}/appointments/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
  }
};

// Feedback methods
export const saveFeedback = async (feedback: Feedback): Promise<void> => {
  try {
    await fetch(`${API_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
  }
};

export const getFeedback = async (): Promise<Feedback[]> => {
  try {
    const response = await fetch(`${API_URL}/feedback`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }
};

// Chat history methods
export const saveChatHistory = async (chatHistory: ChatMessage[]): Promise<void> => {
  // This function is no longer needed as we're saving messages one by one
  // But we'll keep it for compatibility
  try {
    const lastMessage = chatHistory[chatHistory.length - 1];
    await fetch(`${API_URL}/chat-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: lastMessage.message,
        sender: lastMessage.sender
      }),
    });
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

export const getChatHistory = async (): Promise<ChatMessage[]> => {
  try {
    const response = await fetch(`${API_URL}/chat-history`);
    const data = await response.json();
    // Convert ISO string timestamps to Date objects
    return data.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

export const clearChatHistory = async (): Promise<void> => {
  try {
    await fetch(`${API_URL}/chat-history`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
};

// New function to send a message and get bot response
export const sendMessageToBot = async (message: string): Promise<ChatMessage[]> => {
  try {
    const response = await fetch(`${API_URL}/chat-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sender: 'You'
      }),
    });
    
    const data = await response.json();
    // Convert ISO string timestamps to Date objects
    return Array.isArray(data) 
      ? data.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      : [{
          ...data,
          timestamp: new Date(data.timestamp)
        }];
  } catch (error) {
    console.error('Error sending message to bot:', error);
    throw new Error('Failed to send message');
  }
};
