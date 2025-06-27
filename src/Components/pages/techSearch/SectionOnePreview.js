import React, { useState } from 'react';
import PreviewPopUp from './PreviewPopUp';

const SectionOnePreview = ({ data }) => {
  const [previewItem, setPreviewItem] = useState(null);

  const handlePreviewRow = (item) => {
    setPreviewItem(item);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Section One - Technology Details</h2>
      <div className="space-y-6">
        {data.sectionOneList.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-md bg-white">
            <h4 className="text-md font-bold text-blue-700 mb-1">Section One</h4>

            <h3 className="text-lg font-semibold mb-2 text-red-500">
              {item.nameTechnology || 'Technology'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>TRN No:</strong> {item.technologyRefNo || '-'}</div>
              <div><strong>Keywords:</strong> {item.keywordTechnology || '-'}</div>
              <div><strong>Industrial Sector:</strong> {item.industrialSector?.join(', ') || '-'}</div>
              <div><strong>Multi Lab Institute:</strong> {item.multiLabInstitute || '-'}</div>
              <div><strong>Lead Lab:</strong> {item.leadLaboratory || '-'}</div>
              <div><strong>Associate Institutes:</strong> {item.associateInstitute?.join(', ') || '-'}</div>
              <div><strong>Theme:</strong> {item.theme?.join(', ') || '-'}</div>
              <div><strong>Technology Level:</strong> {item.technologyLevel || '-'}</div>
              <div><strong>Scale of Development:</strong> {item.scaleDevelopment || '-'}</div>
              <div><strong>Year of Development:</strong> {item.yearDevelopment || '-'}</div>
              <div><strong>Brief:</strong> {item.briefTech || '-'}</div>
              <div><strong>Competitive Position:</strong> {item.competitivePosition || '-'}</div>
              <div><strong>Stakeholders:</strong> {item.stakeHolders?.join(', ') || '-'}</div>
              <div><strong>Techno Economics:</strong> {item.technoEconomics || '-'}</div>
              <div><strong>Market Potential:</strong> {item.marketPotential || '-'}</div>
              <div><strong>Environmental Statutory:</strong> {item.environmentalStatutory || '-'}</div>
              <div>
                <strong>File:</strong>
                <img
                  src={`http://172.16.2.246:8080/apf/tdmp/images/${item.technologyRefNo}`}
                  alt="xyz"
                  style={{ width: '200px', height: '200px', marginTop: '10px' }}
                />
              </div>
              <div><strong>Laboratory Details:</strong> {item.laboratoryDetail || '-'}</div>
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
          item={previewItem}
          activeSection="sectionOne"
          onClose={() => setPreviewItem(null)}
        />
      )}
    </div>
  );
};

export default SectionOnePreview;
