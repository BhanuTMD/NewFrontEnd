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
      <div className="space-y-6">
        {data.sectionFourList.map((item, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow-md bg-white"
          >
            <h4 className="text-md font-semibold text-gray-500 mb-1">Section Four</h4>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">{item.clientName || 'Deployment Detail'}</h3>
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
                onClick={() => handlePrintRow(item)}
                className="text-blue-600 hover:underline"
              >
                Print
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionFourPreview;
