import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Image as ImageIcon, Download, Loader2 } from 'lucide-react';

const ImageTools = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleResize = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    if (width) formData.append('width', width);
    if (height) formData.append('height', height);

    try {
      const response = await axios.post('/api/image/resize', formData, { responseType: 'blob' });
      downloadBlob(response.data, 'onepoint-resized.png');
    } catch (error) {
      alert('Failed to resize image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveBg = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('/api/image/remove-bg', formData, { responseType: 'blob' });
      downloadBlob(response.data, 'onepoint-nobg.png');
    } catch (error) {
      alert('Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94A3B8', textDecoration: 'none', marginBottom: '32px' }}>
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>
      
      <h1 style={{ marginBottom: '8px' }}>Image Tools</h1>
      <p style={{ color: '#94A3B8', marginBottom: '32px' }}>Resize your images or remove backgrounds using local AI.</p>

      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{
          border: '2px dashed var(--glass-border)',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <ImageIcon size={40} color="#50E3C2" />
          <div>
            <p style={{ fontWeight: '500', marginBottom: '8px' }}>Upload Image</p>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Select a single image to process.</p>
          </div>
          
          <input 
            type="file" 
            id="image-upload" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          <label htmlFor="image-upload" className="btn" style={{ cursor: 'pointer' }}>
            {selectedFile ? selectedFile.name : 'Select Image'}
          </label>
        </div>

        {selectedFile && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '16px', color: '#50E3C2' }}>1. Resize Image</h3>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <input type="number" placeholder="Width (px)" value={width} onChange={e => setWidth(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: 'none' }} />
                <input type="number" placeholder="Height (px)" value={height} onChange={e => setHeight(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: 'none' }} />
              </div>
              <button className="btn" onClick={handleResize} disabled={isProcessing} style={{ width: '100%', opacity: isProcessing ? 0.5 : 1 }}>
                Resize Image
              </button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '16px', color: '#50E3C2' }}>2. Remove Background</h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '16px' }}>Uses a free local AI model. First run may take a moment to download the model.</p>
              <button className="btn" onClick={handleRemoveBg} disabled={isProcessing} style={{ width: '100%', opacity: isProcessing ? 0.5 : 1, display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                {isProcessing ? 'Processing...' : 'Remove Background'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageTools;
