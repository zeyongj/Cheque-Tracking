import React, { useState } from 'react';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        setMessage('File uploaded successfully!');
      } else {
        setMessage('Upload failed.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error uploading file.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Upload</h2>
      <p>Select an Excel (.xlsx) file to upload:</p>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="form-control mb-3" />
      <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
      <p className="mt-3">{message}</p>
      <div className="mt-3">
        <a href="/">Back to Main Page</a>
      </div>
    </div>
  );
}

export default UploadPage;
