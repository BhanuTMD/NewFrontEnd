import React, { useState } from 'react';
import PreviewPopUp from 'Components/pages/techSearch/PreviewPopUp';
const SectionOnePreview = ({ data }) => {
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
            <h2 className="text-xl font-bold mb-4">Section One - Technology Details</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border">TRN No</th>
                            <th className="py-2 px-4 border">Technology Name</th>
                            <th className="py-2 px-4 border">Keywords</th>
                            <th className="py-2 px-4 border">Industrial Sector</th>
                            <th className="py-2 px-4 border">Multi Lab Institute</th>
                            <th className="py-2 px-4 border">Lead Lab</th>
                            <th className="py-2 px-4 border">Associate Institutes</th>
                            <th className="py-2 px-4 border">Theme</th>
                            <th className="py-2 px-4 border">Technology Level</th>
                            <th className="py-2 px-4 border">Scale of Development</th>
                            <th className="py-2 px-4 border">Year of Development</th>
                            <th className="py-2 px-4 border">Brief</th>
                            <th className="py-2 px-4 border">Competitive Position</th>
                            <th className="py-2 px-4 border">Stakeholders</th>
                            <th className="py-2 px-4 border">Techno Economics</th>
                            <th className="py-2 px-4 border">Market Potential</th>
                            <th className="py-2 px-4 border">Environmental Statutory</th>
                            <th className="py-2 px-4 border">Laboratory Details</th>
                            <th className="py-2 px-4 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.sectionOneList.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                <td className="py-2 px-4 border">{item.technologyRefNo || '-'}</td>
                                <td className="py-2 px-4 border">{item.nameTechnology || '-'}</td>
                                <td className="py-2 px-4 border">{item.keywordTechnology || '-'}</td>
                                <td className="py-2 px-4 border">{item.industrialSector?.join(', ') || '-'}</td>
                                <td className="py-2 px-4 border">{item.multiLabInstitute || '-'}</td>
                                <td className="py-2 px-4 border">{item.leadLaboratory || '-'}</td>
                                <td className="py-2 px-4 border">{item.associateInstitute?.join(', ') || '-'}</td>
                                <td className="py-2 px-4 border">{item.theme?.join(', ') || '-'}</td>
                                <td className="py-2 px-4 border">{item.technologyLevel || '-'}</td>
                                <td className="py-2 px-4 border">{item.scaleDevelopment || '-'}</td>
                                <td className="py-2 px-4 border">{item.yearDevelopment || '-'}</td>
                                <td className="py-2 px-4 border">{item.briefTech || '-'}</td>
                                <td className="py-2 px-4 border">{item.competitivePosition || '-'}</td>
                                <td className="py-2 px-4 border">{item.stakeHolders?.join(', ') || '-'}</td>
                                <td className="py-2 px-4 border">{item.technoEconomics || '-'}</td>
                                <td className="py-2 px-4 border">{item.marketPotential || '-'}</td>
                                <td className="py-2 px-4 border">{item.environmentalStatutory || '-'}</td>
                                <td className="py-2 px-4 border">{item.laboratoryDetail || '-'}</td>
                                <td className="py-2 px-4 border space-x-2">
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

            {/* ✅ Show PreviewPopUp */}
            {previewItem && (
                <PreviewPopUp
                    item={previewItem}
                    onClose={() => setPreviewItem(null)}
                />
            )}
        </div>
    );
};

export default SectionOnePreview;
