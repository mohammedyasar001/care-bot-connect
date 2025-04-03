import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Appointment, ChatMessage } from '@/types';
import { getUser, saveUser, getAppointments, saveAppointment, getChatHistory, saveChatHistory } from '@/services/dbService';
import { getBotResponse } from '@/utils/healthData';
import { useToast } from '@/components/ui/use-toast';

interface HealthCareContextType {
  user: User | null;
  setUser: (user: User) => void;
  chatMessages: ChatMessage[];
  addMessage: (message: string, sender: 'You' | 'HealthCare Bot') => void;
  clearChat: () => void;
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => Appointment;
  profileMenuOpen: boolean;
  toggleProfileMenu: () => void;
  sendMessage: (message: string) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  sendVoiceNote: (audioBlob: Blob) => void;
}

const HealthCareContext = createContext<HealthCareContextType | undefined>(undefined);

export function HealthCareProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedUser = getUser();
    if (savedUser) {
      setUserState(savedUser);
    }

    const savedAppointments = getAppointments();
    setAppointments(savedAppointments);

    const savedChat = getChatHistory();
    if (savedChat && savedChat.length > 0) {
      setChatMessages(savedChat);
    } else {
      // Add welcome message if no chat history
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'HealthCare Bot',
        message: 'Welcome to HealthCare Bot! How can I assist you today?',
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
    }
  }, []);

  // Save chat history when it changes
  useEffect(() => {
    if (chatMessages.length > 0) {
      saveChatHistory(chatMessages);
    }
  }, [chatMessages]);

  // Save user when it changes
  const setUser = (userData: User) => {
    setUserState(userData);
    saveUser(userData);
    toast({
      title: "Profile Updated",
      description: `Welcome, ${userData.name}!`,
    });
  };

  // Add a message to the chat
  const addMessage = (message: string, sender: 'You' | 'HealthCare Bot') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender,
      message,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  // Clear the chat history
  const clearChat = () => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'HealthCare Bot',
      message: 'Chat history cleared. How can I help you today?',
      timestamp: new Date()
    };
    setChatMessages([welcomeMessage]);
  };

  // Add a new appointment
  const addAppointment = (appointment: Appointment) => {
    const newAppointment = saveAppointment(appointment);
    setAppointments(prev => [...prev, newAppointment]);
    toast({
      title: "Appointment Scheduled",
      description: `${appointment.date} at ${appointment.time}`,
    });
    return newAppointment;
  };

  // Toggle profile menu
  const toggleProfileMenu = () => {
    setProfileMenuOpen(prev => !prev);
  };

  // Send message and get bot response
  const sendMessage = (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    addMessage(message, 'You');
    
    // Get bot response
    setTimeout(() => {
      const botResponse = getBotResponse(message);
      addMessage(botResponse, 'HealthCare Bot');
    }, 500);
  };

  // Voice recognition handlers
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }
    
    setIsListening(true);
    toast({
      title: "Listening...",
      description: "Speak now and I'll try to understand",
    });
    
    // This is just a mock for the web app
    // In a real app, you would implement actual speech recognition
    setTimeout(() => {
      setIsListening(false);
      toast({
        title: "Stopped listening",
        description: "Voice input not implemented in this demo",
      });
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  // Voice note handling
  const sendVoiceNote = (audioBlob: Blob) => {
    // Create a message with voice note indicator
    addMessage("🎤 Voice Note Sent", 'You');
    
    // In a real app, you would process this audio or send it to a speech-to-text service
    // For now, we'll simulate a response after a short delay
    setTimeout(() => {
      addMessage("I've received your voice note. While I can't listen to audio right now, you can describe your health concerns in text and I'll be happy to help.", 'HealthCare Bot');
    }, 1000);

    // Optionally save the audio blob to storage if needed
    // In a real app, you would upload this to a server or cloud storage
  };

  return (
    <HealthCareContext.Provider value={{
      user,
      setUser,
      chatMessages,
      addMessage,
      clearChat,
      appointments,
      addAppointment,
      profileMenuOpen,
      toggleProfileMenu,
      sendMessage,
      isListening,
      startListening,
      stopListening,
      sendVoiceNote
    }}>
      {children}
    </HealthCareContext.Provider>
  );
}

export function useHealthCare() {
  const context = useContext(HealthCareContext);
  if (context === undefined) {
    throw new Error('useHealthCare must be used within a HealthCareProvider');
  }
  return context;
}
