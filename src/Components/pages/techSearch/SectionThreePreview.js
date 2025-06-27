import React, { useState } from 'react';
import PreviewPopUp from './PreviewPopUp';

const SectionThreePreview = ({ data }) => {
  const [previewItem, setPreviewItem] = useState(null);

  const handlePreviewRow = (item) => {
    setPreviewItem(item);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Section Three - Licensing Details</h2>
      <div className="space-y-6">
        {data.sectionThreeList.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-md bg-white">
            <h4 className="text-md font-semibold text-red-600 mb-1">Section Three</h4>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">
              {item.licenseName || 'License Detail'}
            </h3>

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
                {Array.isArray(item.royalty) && item.royalty.length > 0 ? (
                  item.royalty.map((r, i) => (
                    <div key={i}>₹{r.amount || '-'} on {r.date || '-'}</div>
                  ))
                ) : (
                  <div>-</div>
                )}
              </div>

              <div>
                <strong>Premia:</strong><br />
                {Array.isArray(item.premia) && item.premia.length > 0 ? (
                  item.premia.map((p, i) => (
                    <div key={i}>₹{p.amount || '-'} on {p.date || '-'}</div>
                  ))
                ) : (
                  <div>-</div>
                )}
              </div>

              <div><strong>Sub Total Royalty:</strong> ₹{item.subTotalRoyalty || '0'}</div>
              <div><strong>Sub Total Premia:</strong> ₹{item.subTotalPremia || '0'}</div>
              <div><strong>Grand Total:</strong> ₹{item.grandTotal || '0'}</div>
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
          item={{ sectionThree: [previewItem] }}
          activeSection="sectionThree"
          onClose={() => setPreviewItem(null)}
        />
      )}
    </div>
  );
};

export default SectionThreePreview;
