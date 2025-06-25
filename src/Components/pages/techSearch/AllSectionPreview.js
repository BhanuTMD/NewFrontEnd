import React, { useState } from 'react';
import PreviewPopUp from 'Components/pages/techSearch/PreviewPopUp';

const AllSectionPreview = ({ data }) => {
    const [previewItem, setPreviewItem] = useState(null);
    const handlePrintRow = (item) => {
        const newWindow = window.open('', '', 'width=800,height=600');
        const rowHTML = `
          <html>
            <head>
              <title>Print Preview - ${item.nameTechnology || 'Technology'}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background-color: #f9f9f9; }
              </style>
            </head>
            <body>
              <h2>Technology Detail - ${item.nameTechnology || '-'}</h2>
              <table>
                <tbody>
                  <tr><th>TRN No</th><td>${item.technologyRefNo || '-'}</td></tr>
                  <tr><th>Technology Name</th><td>${item.nameTechnology || '-'}</td></tr>
                  <tr><th>Keywords</th><td>${item.keywordTechnology || '-'}</td></tr>
                  <tr><th>Industrial Sector</th><td>${item.industrialSector?.join(', ') || '-'}</td></tr>
                  <tr><th>Multi Lab Institute</th><td>${item.multiLabInstitute || '-'}</td></tr>
                  <tr><th>Lead Lab</th><td>${item.leadLaboratory || '-'}</td></tr>
                  <tr><th>Associate Institutes</th><td>${item.associateInstitute?.join(', ') || '-'}</td></tr>
                  <tr><th>Theme</th><td>${item.theme?.join(', ') || '-'}</td></tr>
                  <tr><th>Technology Level</th><td>${item.technologyLevel || '-'}</td></tr>
                  <tr><th>Scale of Development</th><td>${item.scaleDevelopment || '-'}</td></tr>
                  <tr><th>Year of Development</th><td>${item.yearDevelopment || '-'}</td></tr>
                  <tr><th>Brief</th><td>${item.briefTech || '-'}</td></tr>
                  <tr><th>Competitive Position</th><td>${item.competitivePosition || '-'}</td></tr>
                  <tr><th>Stakeholders</th><td>${item.stakeHolders?.join(', ') || '-'}</td></tr>
                  <tr><th>Techno Economics</th><td>${item.technoEconomics || '-'}</td></tr>
                  <tr><th>Market Potential</th><td>${item.marketPotential || '-'}</td></tr>
                  <tr><th>Environmental Statutory</th><td>${item.environmentalStatutory || '-'}</td></tr>
                  <tr><th>Laboratory Details</th><td>${item.laboratoryDetail || '-'}</td></tr>
                </tbody>
              </table>
             <h2>IPR Detail - ${item.iprType || '-'}</h2>
              <table>
                <tbody>
                  <tr><th>TRN No</th><td>${item.technologyRefNo || '-'}</td></tr>
                  <tr><th>IPR Type</th><td>${item.iprType || '-'}</td></tr>
                  <tr><th>Registration No</th><td>${item.registrationNo || '-'}</td></tr>
                  <tr><th>Status</th><td>${item.status || '-'}</td></tr>
                  <tr><th>Status Date</th><td>${item.statusDate || '-'}</td></tr>
                  <tr><th>Countries</th><td>${item.countries?.join(', ') || '-'}</td></tr>
                </tbody>
              </table>
              <script>
                window.onload = function() {
                  window.print();
                }
              </script>
            </body>
          </html>
        `;
        newWindow.document.write(rowHTML);
        newWindow.document.close();
    };
    const handlePreviewRow = (item) => {
        setPreviewItem(item);
    };
    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">ALL Section - Technology Details</h2>
            <div className="space-y-6">
                {data.sectionOneList.map((item, index) => (
    <div key={index} className="border p-4 rounded-lg shadow-md bg-white">
        {/* Card Title */}
        <h4 className="text-md font-bold text-blue-700 mb-1">Section One</h4>

        {/* Technology Name */}
        <h3 className="text-lg font-semibold mb-2 text-red-500">
            {item.nameTechnology || 'Technology'}
        </h3>
    {/* Card Body */}
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
            <div><strong>File:</strong> {item.file || '-'}</div>
            <div><strong>Laboratory Details:</strong> {item.laboratoryDetail || '-'}</div>
        </div>
        {/* Section Title */}
            <h4 className="text-md font-semibold text-gray-500 mb-1">Section Two</h4>
            {/* IPR Title */}
            <h3 className="text-lg font-semibold mb-2 text-blue-700">{item.iprType || 'IPR Detail'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>TRN No:</strong> {item.technologyRefNo || '-'}</div>
              <div><strong>IPR Type:</strong> {item.iprType || '-'}</div>
              <div><strong>Registration No:</strong> {item.registrationNo || '-'}</div>
              <div><strong>Status:</strong> {item.status || '-'}</div>
              <div><strong>Status Date:</strong> {item.statusDate || '-'}</div>
              <div><strong>Countries:</strong> {item.countries?.join(', ') || '-'}</div>
            </div>
        {/* Action Buttons */}
        <div className="mt-4 space-x-2">
            <button
                onClick={() => handlePreviewRow(item)}
                className="text-green-600 hover:underline"
            >
                Preview
            </button>
            <button
                onClick={() => handlePrintRow(item)}
                className="text-blue-600 hover:underline"
            >
                Print
            </button>
        </div>
    </div>
))}
            </div>
            {data.picture && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Technology Image</h3>
                    <img
                        src={data.picture}
                        alt="Technology visual representation"
                        className="max-w-full h-auto rounded border"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Available';
                        }}
                    />
                </div>
            )}
            {/* Preview PopUp */}
            {previewItem && (
                <PreviewPopUp
                    item={previewItem}
                    onClose={() => setPreviewItem(null)}
                />
            )}
        </div>
    );
};

export default AllSectionPreview;