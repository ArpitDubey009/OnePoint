import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Upload, FileDown, Loader2, FileArchive } from 'lucide-react';

const PdfTools = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState('medium');

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleCreatePdf = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsProcessing(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post('/api/pdf/create', formData, {
        responseType: 'blob', // Important to handle file download
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'onepoint-created.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error creating PDF:', error);
      alert('Failed to create PDF. Please ensure you are uploading valid images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePdfChange = (e) => {
    setSelectedPdf(e.target.files[0]);
  };

  const handleCompressPdf = async () => {
    if (!selectedPdf) return;
    
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('pdf', selectedPdf);
    formData.append('level', compressionLevel);

    try {
      const response = await axios.post('/api/pdf/compress', formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'onepoint-compressed.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error compressing PDF:', error);
      alert('Failed to compress PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94A3B8', textDecoration: 'none', marginBottom: '32px' }}>
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>
      
      <h1 style={{ marginBottom: '8px' }}>PDF Tools</h1>
      <p style={{ color: '#94A3B8', marginBottom: '32px' }}>Create PDFs from your images seamlessly.</p>

      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ marginBottom: '16px' }}>Images to PDF</h3>
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
            <Upload size={40} color="#4A90E2" />
            <div>
              <p style={{ fontWeight: '500', marginBottom: '8px' }}>Upload your images</p>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>PNG or JPG files are supported.</p>
            </div>
            
            <input 
              type="file" 
              id="file-upload" 
              multiple 
              accept="image/png, image/jpeg" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            <label htmlFor="file-upload" className="btn" style={{ cursor: 'pointer', display: 'inline-block' }}>
              Select Files
            </label>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
            <p style={{ fontWeight: '500', marginBottom: '8px' }}>Selected Files ({selectedFiles.length}):</p>
            <ul style={{ paddingLeft: '20px', color: '#94A3B8', fontSize: '0.9rem', maxHeight: '100px', overflowY: 'auto' }}>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <button 
          className="btn" 
          onClick={handleCreatePdf} 
          disabled={selectedFiles.length === 0 || isProcessing}
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '8px',
            opacity: (selectedFiles.length === 0 || isProcessing) ? 0.5 : 1,
            cursor: (selectedFiles.length === 0 || isProcessing) ? 'not-allowed' : 'pointer'
          }}
        >
          {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <FileDown size={20} />}
          {isProcessing ? 'Generating PDF...' : 'Convert to PDF'}
        </button>
      </div>

      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
        <div>
          <h3 style={{ marginBottom: '16px' }}>PDF Compressor (MB to KB)</h3>
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
            <FileArchive size={40} color="#50E3C2" />
            <div>
              <p style={{ fontWeight: '500', marginBottom: '8px' }}>Upload a PDF to Compress</p>
            </div>
            
            <input 
              type="file" 
              id="pdf-upload" 
              accept="application/pdf" 
              onChange={handlePdfChange} 
              style={{ display: 'none' }} 
            />
            <label htmlFor="pdf-upload" className="btn" style={{ cursor: 'pointer', display: 'inline-block', background: 'linear-gradient(135deg, #50E3C2, #4A90E2)' }}>
              {selectedPdf ? selectedPdf.name : 'Select PDF'}
            </label>
          </div>
        </div>

        {selectedPdf && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
            <p style={{ fontWeight: '500', marginBottom: '8px' }}>Compression Preference:</p>
            <select 
              value={compressionLevel} 
              onChange={(e) => setCompressionLevel(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none' }}
            >
              <option value="low">Low Compression (Faster, Larger file)</option>
              <option value="medium">Medium Compression (Balanced)</option>
              <option value="high">High Compression (Slower, Smaller file)</option>
            </select>

            <button 
              className="btn" 
              onClick={handleCompressPdf} 
              disabled={isProcessing}
              style={{ 
                width: '100%',
                marginTop: '16px',
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '8px',
                opacity: isProcessing ? 0.5 : 1,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                background: 'linear-gradient(135deg, #50E3C2, #4A90E2)'
              }}
            >
              {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <FileDown size={20} />}
              {isProcessing ? 'Compressing...' : 'Compress PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfTools;
