import React, { useState } from 'react';
import { Plus, X, FileText, Upload } from 'lucide-react';
import '../../styles/HRUpload.css';

const HRUpload = () => {
  const [attendanceFiles, setAttendanceFiles] = useState([]);
  const [overtimeFiles, setOvertimeFiles] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const iconProps = { size: 18, className: 'file-icon' };
    
    switch (ext) {
      case 'pdf':
        return <FileText {...iconProps} color="#FF4444" />;
      case 'doc':
      case 'docx':
        return <FileText {...iconProps} color="#4444FF" />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <FileText {...iconProps} color="#44AA44" />;
      default:
        return <FileText {...iconProps} color="#666666" />;
    }
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const fileObjects = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    switch (type) {
      case 'attendance':
        setAttendanceFiles(prev => [...prev, ...fileObjects]);
        break;
      case 'overtime':
        setOvertimeFiles(prev => [...prev, ...fileObjects]);
        break;
      case 'additional':
        setAdditionalFiles(prev => [...prev, ...fileObjects]);
        break;
    }
    setMessage('');
  };

  const handleDeleteFile = (id, type) => {
    const setterMap = {
      'attendance': setAttendanceFiles,
      'overtime': setOvertimeFiles,
      'additional': setAdditionalFiles
    };

    setterMap[type](prev => {
      const filtered = prev.filter(f => f.id !== id);
      // Cleanup any created object URLs
      const removedFile = prev.find(f => f.id === id);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return filtered;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (attendanceFiles.length === 0 || overtimeFiles.length === 0) {
      setMessage('At least one attendance and overtime file is required');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    
    attendanceFiles.forEach(fileObj => {
      formData.append('attendance', fileObj.file);
    });

    overtimeFiles.forEach(fileObj => {
      formData.append('overtime', fileObj.file);
    });

    additionalFiles.forEach(fileObj => {
      formData.append('additional', fileObj.file);
    });

    try {
      const response = await fetch('http://localhost:5000/api/hr/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage('Files uploaded successfully!');
      
      // Cleanup object URLs
      [...attendanceFiles, ...overtimeFiles, ...additionalFiles].forEach(fileObj => {
        if (fileObj.preview) {
          URL.revokeObjectURL(fileObj.preview);
        }
      });
      
      setAttendanceFiles([]);
      setOvertimeFiles([]);
      setAdditionalFiles([]);
      e.target.reset();
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Error uploading files: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const FileUploadSection = ({ type, files, required, acceptTypes }) => (
    <div className="hr-upload-field">
      <label className="hr-upload-label">
        {type === 'additional' ? 'Additional Files' : `${type.charAt(0).toUpperCase() + type.slice(1)} Sheet${required ? '*' : ''}`}
      </label>
      <div className="hr-upload-files">
        {files.map(fileObj => (
          <div key={fileObj.id} className="hr-upload-file">
            {fileObj.preview ? (
              <img src={fileObj.preview} alt="preview" className="file-preview" />
            ) : (
              getFileIcon(fileObj.file.name)
            )}
            <span className="file-name">{fileObj.file.name}</span>
            <button
              type="button"
              onClick={() => handleDeleteFile(fileObj.id, type)}
              className="hr-upload-delete"
              aria-label="Delete file"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <div className="hr-upload-dropzone">
          <input
            type="file"
            accept={acceptTypes}
            onChange={(e) => handleFileUpload(e, type)}
            className="hr-upload-input"
            multiple
          />
          <div className="hr-upload-dropzone-content">
            <Upload size={24} />
            <span>
              {type === 'additional' 
                ? 'Add additional files' 
                : `Add ${type} file`}
            </span>
            <span className="upload-hint">
              {type === 'additional' 
                ? 'Any file type accepted' 
                : 'Excel or CSV files only'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="hr-upload-wrapper">
      <div className="hr-upload-card">
        <h2 className="hr-upload-title">HR Payroll Upload</h2>
        {message && (
          <div className={`hr-upload-message ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="hr-upload-form">
          <FileUploadSection 
            type="attendance" 
            files={attendanceFiles} 
            required={true} 
            acceptTypes=".csv,.xlsx,.xls"
          />
          <FileUploadSection 
            type="overtime" 
            files={overtimeFiles} 
            required={true} 
            acceptTypes=".csv,.xlsx,.xls"
          />
          <FileUploadSection 
            type="additional" 
            files={additionalFiles} 
            required={false} 
            acceptTypes="*"
          />
          
          <button type="submit" className="hr-upload-submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Files'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HRUpload;