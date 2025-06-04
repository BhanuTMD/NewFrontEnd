import React from 'react';
const SectionTwoPreview = ({ data }) => {
    
    const handlePrintRow = (item) => {
        const newWindow = window.open('', '', 'width=800,height=600');
        const rowHTML = `
          <html>
            <head>
              <title>Print Preview - ${item.iprType || 'IPR Detail'}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background-color: #f9f9f9; }
              </style>
            </head>
            <body>
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

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Section Two - IPR Details</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border">TRN No</th>
                            <th className="py-2 px-4 border">IPR Type</th>
                            <th className="py-2 px-4 border">Registration No</th>
                            <th className="py-2 px-4 border">Status</th>
                            <th className="py-2 px-4 border">Status Date</th>
                            <th className="py-2 px-4 border">Countries</th>
                            <th className="py-2 px-4 border">Action</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {data.sectionTwoList.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                <td className="py-2 px-4 border">{item.technologyRefNo || '-'}</td>
                                <td className="py-2 px-4 border">{item.iprType || '-'}</td>
                                <td className="py-2 px-4 border">{item.registrationNo || '-'}</td>
                                <td className="py-2 px-4 border">{item.status || '-'}</td>
                                <td className="py-2 px-4 border">{item.statusDate || '-'}</td>
                                <td className="py-2 px-4 border">{item.countries?.join(', ') || '-'}</td>
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

export default SectionTwoPreview;