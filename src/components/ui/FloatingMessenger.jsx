import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';
import { useMessenger } from '../../context/MessengerContext';
import './FloatingMessenger.css';

export default function FloatingMessenger() {
  const { isOpen, toggleMessenger, closeMessenger, messages, sendMessage } = useMessenger();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim(), 'user');
      setInputValue('');
      
      // Simulate reply
      setTimeout(() => {
        sendMessage("Thanks for reaching out. An agent will be with you shortly.", 'system');
      }, 1000);
    }
  };

  return (
    <>
      <button 
        className={`messenger-toggle ${isOpen ? 'open' : ''}`} 
        onClick={toggleMessenger}
        aria-label="Toggle Messenger"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      <div className={`messenger-window ${isOpen ? 'active' : ''}`}>
        <div className="messenger-header">
          <div className="messenger-title">
            <MessageSquare size={18} className="text-cyan-primary" />
            <span>CarUp Support</span>
          </div>
          <button className="messenger-close" onClick={closeMessenger}>
            <X size={18} />
          </button>
        </div>

        <div className="messenger-body">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.sender === 'user' ? 'user' : 'system'}`}>
              <div className="message-avatar">
                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className="message-content">
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="messenger-footer" onSubmit={handleSend}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="messenger-input"
          />
          <button type="submit" className="messenger-send" disabled={!inputValue.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
