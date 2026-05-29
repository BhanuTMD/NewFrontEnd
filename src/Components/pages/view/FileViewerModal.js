

import React, { useEffect, useState } from "react";
import axios from "axios";

const FileViewerModal = ({ isOpen, onClose, fileUrl }) => {
  const [fileObjectUrl, setFileObjectUrl] = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [detectedType, setDetectedType]   = useState(null);

  useEffect(() => {
    if (!isOpen || !fileUrl) {
      setFileObjectUrl(null);
      setError(null);
      setDetectedType(null);
      return;
    }

    let objectUrl;

    const fetchFile = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(fileUrl, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        });

        // ✅ Detect type from actual response blob
        const mimeType = response.data.type;
        setDetectedType(mimeType);

        objectUrl = URL.createObjectURL(response.data);
        setFileObjectUrl(objectUrl);

      } catch (err) {
        console.error("Failed to fetch file:", err);
        setError("Could not load the file. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [isOpen, fileUrl]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
            <p className="text-sm text-slate-600">Loading file...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      );
    }

    if (!fileObjectUrl) return null;

    // ✅ Use detected MIME type for rendering decision
    const isImage = detectedType?.startsWith("image/");
    const isPdf   = detectedType === "application/pdf";

    if (isImage) {
      return (
        <div className="flex items-center justify-center h-full bg-slate-900 rounded-lg">
          <img
            src={fileObjectUrl}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded"
          />
        </div>
      );
    }

    if (isPdf) {
      return (
        <embed
          src={fileObjectUrl}
          type="application/pdf"
          className="w-full h-full rounded"
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-600 text-sm">
          Preview not available for this file type.
        </p>
        <a
          href={fileObjectUrl}
          download
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          Download File
        </a>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center
                 items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full h-full
                   max-w-5xl max-h-[90vh] p-3 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-slate-100
                     hover:bg-slate-200 rounded-full p-1.5 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none"
               stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex-grow w-full h-full overflow-auto rounded-lg">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;

