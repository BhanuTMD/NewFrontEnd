import React, { useState } from 'react';
import PreviewPopUp from './PreviewPopUp';

const SectionFourPreview = ({ data }) => {
  const [previewItem, setPreviewItem] = useState(null);

  const handlePreviewRow = (item) => {
    setPreviewItem(item);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Section Four - Deployment Details</h2>
      <div className="space-y-6">
        {data.sectionFourList.map((item, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow-md bg-white"
          >
            <h4 className="text-md font-semibold text-red-600 mb-1">Section Four</h4>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">
              {item.clientName || 'Deployment Detail'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>TRN No:</strong> {item.technologyRefNo || '-'}</div>
              <div><strong>Client Name:</strong> {item.clientName || '-'}</div>
              <div><strong>Address:</strong> {item.clientAddress || '-'}</div>
              <div><strong>City:</strong> {item.city || '-'}</div>
              <div><strong>Country:</strong> {item.country || '-'}</div>
              <div><strong>Contact Person:</strong> {item.nodalContactPerson || '-'}</div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => handlePreviewRow(item)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Preview / Print
              </button>
            </div>
          </div>
        ))}
      </div>

      {previewItem && (
        <PreviewPopUp
          item={{ sectionFour: [previewItem] }}
          activeSection="sectionFour"
          onClose={() => setPreviewItem(null)}
        />
      )}
    </div>
  );
};

export default SectionFourPreview;
