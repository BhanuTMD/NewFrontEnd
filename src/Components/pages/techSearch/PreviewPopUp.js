import React, { useRef } from 'react';

const PreviewPopUp = ({ item = {}, activeSection = 'all', onClose, onEdit }) => {
  const printRef = useRef();
  const previewItem = {
    ...item,
    sectionOne: activeSection === 'sectionOne' || activeSection === 'all' ? item.sectionOne || item : {},
    sectionTwo: item.sectionTwo?.length ? item.sectionTwo : [],
    sectionThree: item.sectionThree?.length ? item.sectionThree : [],
    sectionFour: item.sectionFour?.length ? item.sectionFour : [],
  };
  const showSection = (sectionName) =>
    activeSection === 'all' || activeSection === sectionName;
  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Preview</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 20px;
              background: white;
              margin: 0;
            }
            h2 {
              background: #1f2937;
              color: white;
              padding: 10px;
              border-radius: 4px;
              page-break-before: always;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              background: white;
              border-radius: 6px;
              overflow: hidden;
              page-break-inside: avoid;
            }
            th, td {
              padding: 8px;
              font-size: 13px;
              vertical-align: top;
            }
            th {
              background-color: #f3f4f6;
              color: #111827;
              text-align: left;
              border-bottom: 1px solid #d1d5db;
              width: 35%;
            }
            td {
              border-bottom: 1px solid #e5e7eb;
              width: 65%;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            img {
              display: block;
              margin-top: 10px;
              border: 1px solid #ccc;
              border-radius: 4px;
              max-width: 180px;
              max-height: 180px;
              object-fit: contain;
              page-break-inside: avoid;
            }
            @media print {
              .avoid-break {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          ${printContents}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    newWindow.document.close();
  };
  const Section = ({ sectionKey, title, children, bgColor = 'bg-gray-800' }) => (
    <div className="mt-6 avoid-break">
      <div className="flex justify-between items-center">
        <h2 className={`${bgColor} text-white text-lg font-semibold px-4 py-2 rounded print:break-before-page`}>
          {title}
        </h2>
        {onEdit && (
          <button
            onClick={() => onEdit(sectionKey)}
            className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded print:hidden"
          >
            Edit
          </button>
        )}
      </div>
      <div className="overflow-x-auto mt-2">{children}</div>
    </div>
  );

  const renderTable = (rows) => (
    <table className="min-w-full text-sm shadow-md rounded overflow-hidden">
      <tbody>
        {rows.map(([label, value], idx) => (
          <tr key={idx} className="even:bg-gray-50">
            <th className="text-left font-medium text-gray-700 px-4 py-2 w-[35%] bg-gray-100 align-top">{label}</th>
            <td className="px-4 py-2 text-gray-800 w-[65%]">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full p-6 overflow-auto max-h-[90vh]">
        <div ref={printRef} className="text-gray-900">
          {showSection('sectionOne') && (
            <Section title={`Technology Detail - ${previewItem.sectionOne?.nameTechnology || '-'}`} sectionKey="sectionOne">
              {renderTable([
                ['TRN No', previewItem.sectionOne.technologyRefNo || '-'],
                ['Technology Name', previewItem.sectionOne.nameTechnology || '-'],
                ['Keywords', previewItem.sectionOne.keywordTechnology || '-'],
                ['Industrial Sector', previewItem.sectionOne.industrialSector?.join(', ') || '-'],
                ['Multi Lab Institute', previewItem.sectionOne.multiLabInstitute || '-'],
                ['Lead Lab', previewItem.sectionOne.leadLaboratory || '-'],
                ['Associate Institutes', previewItem.sectionOne.associateInstitute?.join(', ') || '-'],
                ['Theme', previewItem.sectionOne.theme?.join(', ') || '-'],
                ['Technology Level', previewItem.sectionOne.technologyLevel || '-'],
                ['Scale of Development', previewItem.sectionOne.scaleDevelopment || '-'],
                ['Year of Development', previewItem.sectionOne.yearDevelopment || '-'],
                ['Brief', previewItem.sectionOne.briefTech || '-'],
                ['Competitive Position', previewItem.sectionOne.competitivePosition || '-'],
                ['Stakeholders', previewItem.sectionOne.stakeHolders?.join(', ') || '-'],
                ['Techno Economics', previewItem.sectionOne.technoEconomics || '-'],
                ['Market Potential', previewItem.sectionOne.marketPotential || '-'],
                ['Environmental Statutory', previewItem.sectionOne.environmentalStatutory || '-'],
                [
                  'File',
                  previewItem.sectionOne.technologyRefNo ? (
                    <img
                      src={`http://172.16.2.246:8080/apf/tdmp/images/${previewItem.sectionOne.technologyRefNo}`}
                      alt="Preview"
                      className="w-40 h-40 object-contain"
                    />
                  ) : (
                    '-'
                  ),
                ],
                ['Laboratory Details', previewItem.sectionOne.laboratoryDetail || '-'],
              ])}
            </Section>
          )}

          {showSection('sectionTwo') && previewItem.sectionTwo.length > 0 && (
            <Section title="Section Two - IPR Details" sectionKey="sectionTwo" bgColor="bg-blue-600">
              {previewItem.sectionTwo.map((row, i) => (
                <div key={i} className="mb-4 avoid-break">
                  {renderTable([
                    ['TRN No', row.technologyRefNo || '-'],
                    ['IPR Type', row.iprType || '-'],
                    ['Registration No', row.registrationNo || '-'],
                    ['Status', row.status || '-'],
                    ['Status Date', row.statusDate || '-'],
                    ['Countries', row.countries?.join(', ') || '-'],
                  ])}
                </div>
              ))}
            </Section>
          )}
        
          {showSection('sectionThree') && previewItem.sectionThree.length > 0 && (
            <Section title="Section Three - Licensing Details" sectionKey="sectionThree" bgColor="bg-green-600">
              {previewItem.sectionThree.map((row, i) => (
                <div key={i} className="mb-4 avoid-break">
                  {renderTable([
                    ['TRN No', row.technologyRefNo || '-'],
                    ['License Name', row.licenseName || '-'],
                    ['Agreement Date', row.dateOfAgreementSigning || '-'],
                    ['License Type', row.typeOfLicense || '-'],
                    ['Region', row.staRegionalGeography || '-'],
                    ['Exclusivity', row.detailsOfExclusity || '-'],
                    ['License Date', row.dateOfLicense || '-'],
                    ['Validity', row.licenseValidUntil || '-'],
                    ['Payment Terms', row.paymentTerms || '-'],
                    ['Royalty', row.royalty?.map(r => `₹${r.amount} on ${r.date}`).join(', ') || '-'],
                    ['Premia', row.premia?.map(p => `₹${p.amount} on ${p.date}`).join(', ') || '-'],
                    ['Sub Total Royalty', `₹${row.subTotalRoyalty || '0'}`],
                    ['Sub Total Premia', `₹${row.subTotalPremia || '0'}`],
                    ['Grand Total', `₹${row.grandTotal || '0'}`],
                  ])}
                </div>
              ))}
            </Section>
          )}

          {showSection('sectionFour') && previewItem.sectionFour.length > 0 && (
            <Section title="Section Four - Deployment Details" sectionKey="sectionFour" bgColor="bg-purple-600">
              {previewItem.sectionFour.map((row, i) => (
                <div key={i} className="mb-4 avoid-break">
                  {renderTable([
                    ['TRN No', row.technologyRefNo || '-'],
                    ['Client Name', row.clientName || '-'],
                    ['Client Address', row.clientAddress || '-'],
                    ['City', row.city || '-'],
                    ['Country', row.country || '-'],
                    ['Nodal Contact Person', row.nodalContactPerson || '-'],
                    ['Deployment Details', row.deploymentDetails || '-'],
                  ])}
                </div>
              ))}
            </Section>
          )}
        </div>
        <div className="mt-6 flex justify-between print:hidden">
          <button
            onClick={handlePrint}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Print
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default PreviewPopUp;

