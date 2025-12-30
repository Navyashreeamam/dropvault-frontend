import React, { useState, useRef, useEffect } from 'react';
import '../../styles/chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm your DropVault Assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getBotResponse = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('hello') || msg.includes('hi')) {
      return "Hey there! What would you like to do today — upload, share, or manage your files?";
    }
    if (msg.includes('upload')) {
      return "Go to the Upload page, pick your file, and press 'Upload'. You'll find it under My Files.";
    }
    if (msg.includes('share')) {
      return "To share a file, open My Files and click the 'Share' button next to your file.";
    }
    if (msg.includes('storage') || msg.includes('limit')) {
      return "You have 10 GB of secure storage. Check your usage anytime on the Dashboard.";
    }
    if (msg.includes('delete')) {
      return "To delete a file, go to My Files and click the delete icon next to the file you want to remove.";
    }
    if (msg.includes('settings')) {
      return "You can adjust your preferences or account info in the Settings section.";
    }
    if (msg.includes('logout')) {
      return "Use the Logout option on the sidebar to safely sign out.";
    }
    if (msg.includes('help')) {
      return "Sure! I can help with uploading, sharing, and storage details. What would you like to know?";
    }
    return "I didn't quite catch that. Try asking me about uploads, sharing, or storage.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse = { text: getBotResponse(input), sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          className="chatbot-toggle" 
          onClick={() => setIsOpen(true)}
          title="Chat with DropVault Assistant"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chat-header">
            <h4>DropVault Assistant</h4>
            <button className="chat-close" onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}-message`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot-message typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <button onClick={handleSend} className="send-btn">➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;