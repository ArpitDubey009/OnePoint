import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FileText, Image as ImageIcon, Bot } from 'lucide-react';
import PdfTools from './pages/PdfTools';
import ImageTools from './pages/ImageTools';
import AiAssistant from './pages/AiAssistant';
import './index.css';

const Dashboard = () => (
  <div className="container">
    <h1 style={{ textAlign: 'center', margin: '40px 0', fontSize: '3rem', background: 'linear-gradient(to right, #4A90E2, #50E3C2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      OnePoint
    </h1>
    <p style={{ textAlign: 'center', marginBottom: '40px', color: '#94A3B8' }}>Your All-in-One Utility Suite</p>
    
    <div className="grid">
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <FileText size={48} color="#4A90E2" />
        <h2>PDF Tools</h2>
        <p style={{ textAlign: 'center', color: '#94A3B8' }}>Create, resize, and convert images to PDF.</p>
        <Link to="/pdf-tools" className="btn" style={{ textDecoration: 'none' }}>Open PDF Tools</Link>
      </div>
      
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <ImageIcon size={48} color="#50E3C2" />
        <h2>Image Tools</h2>
        <p style={{ textAlign: 'center', color: '#94A3B8' }}>Resize images and remove backgrounds.</p>
        <Link to="/image-tools" className="btn" style={{ textDecoration: 'none' }}>Open Image Tools</Link>
      </div>

      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Bot size={48} color="#A78BFA" />
        <h2>AI Assistant</h2>
        <p style={{ textAlign: 'center', color: '#94A3B8' }}>Get help with writing, summarizing, and more.</p>
        <Link to="/ai-assistant" className="btn" style={{ background: 'linear-gradient(135deg, #8B5CF6, #D946EF)', textDecoration: 'none' }}>Ask AI</Link>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pdf-tools" element={<PdfTools />} />
        <Route path="/image-tools" element={<ImageTools />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />
      </Routes>
    </Router>
  );
}

export default App;
