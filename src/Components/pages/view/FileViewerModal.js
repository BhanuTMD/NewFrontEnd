// File: FileViewerModal.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios

const FileViewerModal = ({ isOpen, onClose, fileUrl }) => {
  // State to hold the temporary, local URL for the fetched file
  const [fileObjectUrl, setFileObjectUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when the modal is closed or the file changes
    if (!isOpen || !fileUrl) {
      setFileObjectUrl(null);
      setError(null);
      return;
    }

    const fetchFile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem("token");
        
        // Fetch the file as a 'blob' (binary data)
        const response = await axios.get(fileUrl, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob', // This is the crucial part!
        });

        // Create a temporary URL from the blob data
        const objectUrl = URL.createObjectURL(response.data);
        setFileObjectUrl(objectUrl);

      } catch (err) {
        console.error("Failed to fetch file:", err);
        setError("Could not load the file. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();

    // Cleanup function: Revoke the object URL to prevent memory leaks
    return () => {
      if (fileObjectUrl) {
        URL.revokeObjectURL(fileObjectUrl);
      }
    };
    // Re-run this effect if the fileUrl changes while the modal is open
  }, [isOpen, fileUrl]); 

  if (!isOpen) {
    return null;
  }
  
  const isImage = /\.(jpeg|jpg|gif|png|webp)$/i.test(fileUrl);
  const isPdf = /\.pdf$/i.test(fileUrl);

  const renderFileContent = () => {
    if (loading) return <p className="text-center p-8">Loading file...</p>;
    if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

    // Use the temporary fileObjectUrl in the src attribute
    if (fileObjectUrl) {
      if (isImage) {
        return <img src={fileObjectUrl} alt="File Preview" className="max-w-full max-h-full object-contain" />;
      }
      if (isPdf) {
        return <embed src={fileObjectUrl} type="application/pdf" className="w-full h-full" />;
      }
    }

    return (
      <div className="p-10 text-center text-gray-700">
        <p>Preview is not available for this file type.</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-5xl max-h-[90vh] p-2 relative flex flex-col" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 bg-gray-100 rounded-full p-1 hover:bg-gray-200 z-10" aria-label="Close">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="flex-grow w-full h-full overflow-auto">
          {renderFileContent()}
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;