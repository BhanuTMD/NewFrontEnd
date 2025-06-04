import React from 'react';

const SectionThreePreview = ({ data }) => {

    const handlePrintRow = (item) => {
        const newWindow = window.open('', '', 'width=800,height=600');
        const rowHTML = `
          <html>
            <head>
              <title>Print Preview - ${item.licenseName || 'Licensing Detail'}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background-color: #f9f9f9; }
              </style>
            </head>
            <body>
              <h2>Licensing Detail - ${item.licenseName || '-'}</h2>
              <table>
                <tbody>
                  <tr><th>TRN No</th><td>${item.technologyRefNo || '-'}</td></tr>
                  <tr><th>License Name</th><td>${item.licenseName || '-'}</td></tr>
                  <tr><th>Agreement Date</th><td>${item.dateOfAgreementSigning || '-'}</td></tr>
                  <tr><th>License Type</th><td>${item.typeOfLicense || '-'}</td></tr>
                  <tr><th>Region</th><td>${item.staRegionalGeography || '-'}</td></tr>
                  <tr><th>Exclusivity</th><td>${item.detailsOfExclusivity || '-'}</td></tr>
                  <tr><th>License Date</th><td>${item.dateOfLicense || '-'}</td></tr>
                  <tr><th>Validity</th><td>${item.licenseValidUntil || '-'}</td></tr>
                  <tr><th>Payment Terms</th><td>${item.paymentTerms || '-'}</td></tr>
                  <tr><th>Royalty</th><td>${(item.royalty || []).map((royalty) => `₹${royalty.amount} on ${royalty.date}`).join('<br/>') || '-'}</td></tr>
                  <tr><th>Premia</th><td>${(item.premia || []).map((premia) => `₹${premia.amount} on ${premia.date}`).join('<br/>') || '-'}</td></tr>
                  <tr><th>Sub Total Royalty</th><td>₹${item.subTotalRoyalty || '0'}</td></tr>
                  <tr><th>Sub Total Premia</th><td>₹${item.subTotalPremia || '0'}</td></tr>
                  <tr><th>Grand Total</th><td>₹${item.grandTotal || '0'}</td></tr>
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
            <h2 className="text-xl font-bold mb-4">Section Three - Licensing Details</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border">TRN No</th>
                            <th className="py-2 px-4 border">License Name</th>
                            <th className="py-2 px-4 border">Agreement Date</th>
                            <th className="py-2 px-4 border">License Type</th>
                            <th className="py-2 px-4 border">Region</th>
                            <th className="py-2 px-4 border">Exclusivity</th>
                            <th className="py-2 px-4 border">License Date</th>
                            <th className="py-2 px-4 border">Validity</th>
                            <th className="py-2 px-4 border">Payment Terms</th>
                            <th className="py-2 px-4 border">Royalty</th>
                            <th className="py-2 px-4 border">Premia</th>
                            <th className="py-2 px-4 border">Sub Total Royalty</th>
                            <th className="py-2 px-4 border">Sub Total Premia</th>
                            <th className="py-2 px-4 border">Grand Total</th>
                            <th className="py-2 px-4 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.sectionThreeList.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                <td className="py-2 px-4 border">{item.technologyRefNo || '-'}</td>
                                <td className="py-2 px-4 border">{item.licenseName || '-'}</td>
                                <td className="py-2 px-4 border">{item.dateOfAgreementSigning || '-'}</td>
                                <td className="py-2 px-4 border">{item.typeOfLicense || '-'}</td>
                                <td className="py-2 px-4 border">{item.staRegionalGeography || '-'}</td>
                                <td className="py-2 px-4 border">{item.detailsOfExclusivity || '-'}</td>
                                <td className="py-2 px-4 border">{item.dateOfLicense || '-'}</td>
                                <td className="py-2 px-4 border">{item.licenseValidUntil || '-'}</td>
                                <td className="py-2 px-4 border">{item.paymentTerms || '-'}</td>
                                <td className="py-2 px-4 border">
                                    {(item.royalty || []).map((royalty, idx) => (
                                        <div key={idx} className="mb-1">
                                            ₹{royalty.amount} on {royalty.date}
                                        </div>
                                    ))}
                                    {(!item.royalty || item.royalty.length === 0) && '-'}
                                </td>
                                <td className="py-2 px-4 border">
                                    {(item.premia || []).map((premia, idx) => (
                                        <div key={idx} className="mb-1">
                                            ₹{premia.amount} on {premia.date}
                                        </div>
                                    ))}
                                    {(!item.premia || item.premia.length === 0) && '-'}
                                </td>
                                <td className="py-2 px-4 border">₹{item.subTotalRoyalty || '0'}</td>
                                <td className="py-2 px-4 border">₹{item.subTotalPremia || '0'}</td>
                                <td className="py-2 px-4 border">₹{item.grandTotal || '0'}</td>
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

export default SectionThreePreview;