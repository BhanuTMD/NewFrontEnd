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
                        <tr><th>Royalty</th><td>${(item.royalty || []).map((r) => `₹${r.amount} on ${r.date}`).join('<br/>') || '-'}</td></tr>
                        <tr><th>Premia</th><td>${(item.premia || []).map((p) => `₹${p.amount} on ${p.date}`).join('<br/>') || '-'}</td></tr>
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
            <div className="space-y-6">
                {data.sectionThreeList.map((item, index) => (
                    <div
                        key={index}
                        className="border p-4 rounded-lg shadow-md bg-white"
                    >
                        <h4 className="text-md font-semibold text-gray-500 mb-1">Section Three</h4>
                        <h3 className="text-lg font-semibold mb-2 text-blue-700">{item.licenseName || 'License Detail'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><strong>TRN No:</strong> {item.technologyRefNo || '-'}</div>
                            <div><strong>License Name:</strong> {item.licenseName || '-'}</div>
                            <div><strong>Agreement Date:</strong> {item.dateOfAgreementSigning || '-'}</div>
                            <div><strong>License Type:</strong> {item.typeOfLicense || '-'}</div>
                            <div><strong>Region:</strong> {item.staRegionalGeography || '-'}</div>
                            <div><strong>Exclusivity:</strong> {item.detailsOfExclusivity || '-'}</div>
                            <div><strong>License Date:</strong> {item.dateOfLicense || '-'}</div>
                            <div><strong>Validity:</strong> {item.licenseValidUntil || '-'}</div>
                            <div><strong>Payment Terms:</strong> {item.paymentTerms || '-'}</div>
                            <div>
                                <strong>Royalty:</strong><br />
                                {(item.royalty || []).length > 0
                                    ? item.royalty.map((r, i) => (
                                        <div key={i}>₹{r.amount} on {r.date}</div>
                                    ))
                                    : '-'}
                            </div>
                            <div>
                                <strong>Premia:</strong><br />
                                {(item.premia || []).length > 0
                                    ? item.premia.map((p, i) => (
                                        <div key={i}>₹{p.amount} on {p.date}</div>
                                    ))
                                    : '-'}
                            </div>
                            <div><strong>Sub Total Royalty:</strong> ₹{item.subTotalRoyalty || '0'}</div>
                            <div><strong>Sub Total Premia:</strong> ₹{item.subTotalPremia || '0'}</div>
                            <div><strong>Grand Total:</strong> ₹{item.grandTotal || '0'}</div>
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

export default SectionThreePreview;
