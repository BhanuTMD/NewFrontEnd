import React from 'react';

const SectionFourPreview = ({ data }) => {
    
    const handlePrintRow = (item) => {
        const newWindow = window.open('', '', 'width=800,height=600');
        const rowHTML = `
          <html>
            <head>
              <title>Print Preview - ${item.clientName || 'Deployment Detail'}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background-color: #f9f9f9; }
              </style>
            </head>
            <body>
              <h2>Deployment Detail - ${item.clientName || '-'}</h2>
              <table>
                <tbody>
                  <tr><th>TRN No</th><td>${item.technologyRefNo || '-'}</td></tr>
                  <tr><th>Client Name</th><td>${item.clientName || '-'}</td></tr>
                  <tr><th>Address</th><td>${item.clientAddress || '-'}</td></tr>
                  <tr><th>City</th><td>${item.city || '-'}</td></tr>
                  <tr><th>Country</th><td>${item.country || '-'}</td></tr>
                  <tr><th>Contact Person</th><td>${item.nodalContactPerson || '-'}</td></tr>
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

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Section Four - Deployment Details</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border">TRN No</th>
                            <th className="py-2 px-4 border">Client Name</th>
                            <th className="py-2 px-4 border">Address</th>
                            <th className="py-2 px-4 border">City</th>
                            <th className="py-2 px-4 border">Country</th>
                            <th className="py-2 px-4 border">Contact Person</th>
                            <th className="py-2 px-4 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.sectionFourList.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                <td className="py-2 px-4 border">{item.technologyRefNo || '-'}</td>
                                <td className="py-2 px-4 border">{item.clientName || '-'}</td>
                                <td className="py-2 px-4 border">{item.clientAddress || '-'}</td>
                                <td className="py-2 px-4 border">{item.city || '-'}</td>
                                <td className="py-2 px-4 border">{item.country || '-'}</td>
                                <td className="py-2 px-4 border">{item.nodalContactPerson || '-'}</td>
                                <td className="py-2 px-4 border">
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
        </div>
    );
};

export default SectionFourPreview;