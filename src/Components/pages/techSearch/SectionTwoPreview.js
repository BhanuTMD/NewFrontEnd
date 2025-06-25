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
      <div className="space-y-6">
        {data.sectionTwoList.map((item, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow-md bg-white"
          >
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
            {/* Action buttons */}
            {/* Action Buttons */}
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handlePrintRow(item)}
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
    </div>
  );
};

export default SectionTwoPreview;
