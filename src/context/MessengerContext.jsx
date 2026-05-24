import React, { createContext, useState, useContext, useCallback } from 'react';
import FloatingMessenger from '../components/ui/FloatingMessenger';

const MessengerContext = createContext();

export const useMessenger = () => useContext(MessengerContext);

export const MessengerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'Welcome to CarUp! How can we help you today?', timestamp: new Date().toISOString() }
  ]);

  const openMessenger = useCallback(() => setIsOpen(true), []);
  const closeMessenger = useCallback(() => setIsOpen(false), []);
  const toggleMessenger = useCallback(() => setIsOpen(prev => !prev), []);

  const sendMessage = useCallback((text, sender = 'user') => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender,
      text,
      timestamp: new Date().toISOString()
    }]);
  }, []);

  return (
    <MessengerContext.Provider value={{ 
      isOpen, 
      openMessenger, 
      closeMessenger, 
      toggleMessenger, 
      messages, 
      sendMessage 
    }}>
      {children}
      <FloatingMessenger />
    </MessengerContext.Provider>
  );
};
