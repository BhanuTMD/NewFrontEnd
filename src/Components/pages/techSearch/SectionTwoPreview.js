import React, { useState } from 'react';
import PreviewPopUp from './PreviewPopUp';

const SectionTwoPreview = ({ data }) => {
  const [previewItem, setPreviewItem] = useState(null);

  const handlePreviewRow = (item) => {
    setPreviewItem(item);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Section Two - IPR Details</h2>
      <div className="space-y-6">
        {data.sectionTwoList.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-md bg-white">
            <h4 className="text-md font-semibold text-gray-500 mb-1">Section Two</h4>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">
              {item.iprType || 'IPR Detail'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>TRN No:</strong> {item.technologyRefNo || '-'}</div>
              <div><strong>IPR Type:</strong> {item.iprType || '-'}</div>
              <div><strong>Registration No:</strong> {item.registrationNo || '-'}</div>
              <div><strong>Status:</strong> {item.status || '-'}</div>
              <div><strong>Status Date:</strong> {item.statusDate || '-'}</div>
              <div><strong>Countries:</strong> {item.countries?.join(', ') || '-'}</div>
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
          item={{ sectionTwo: [previewItem] }}
          activeSection="sectionTwo"
          onClose={() => setPreviewItem(null)}
        />
      )}
    </div>
  );
};

export default SectionTwoPreview;
