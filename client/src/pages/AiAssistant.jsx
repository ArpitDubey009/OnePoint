import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Send, Bot } from 'lucide-react';

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I am the OnePoint AI assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post('/api/ai/chat', { message: userMsg.text });
      setMessages(prev => [...prev, { text: response.data.reply, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I am having trouble connecting to the server.", isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94A3B8', textDecoration: 'none', marginBottom: '16px' }}>
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Bot size={32} color="#A78BFA" />
        <h1 style={{ margin: 0 }}>AI Assistant</h1>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
              background: msg.isBot ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #8B5CF6, #D946EF)',
              padding: '12px 16px',
              borderRadius: '16px',
              maxWidth: '80%',
              borderBottomLeftRadius: msg.isBot ? 0 : '16px',
              borderBottomRightRadius: msg.isBot ? '16px' : 0,
            }}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div style={{ alignSelf: 'flex-start', background: 'rgba(255, 255, 255, 0.1)', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: 0 }}>
              Thinking...
            </div>
          )}
        </div>
        
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about OnePoint or its founder..."
            style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
          />
          <button type="submit" className="btn" style={{ background: 'linear-gradient(135deg, #8B5CF6, #D946EF)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={18} /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAssistant;
