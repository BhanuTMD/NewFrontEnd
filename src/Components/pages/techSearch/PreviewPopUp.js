import React from 'react';

const PreviewPopUp = ({ item = {}, onClose }) => {
  console.log("PreviewPopUp item ===>", item);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full p-6 overflow-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">
          Technology Detail - {item.nameTechnology || '-'}
        </h2>

        {/* Section One Table */}
        <table className="table-auto w-full border border-gray-300 text-sm">
          <tbody>
            <tr><th className="border px-4 py-2 text-left">TRN No</th><td className="border px-4 py-2">{item.technologyRefNo || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Technology Name</th><td className="border px-4 py-2">{item.nameTechnology || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Keywords</th><td className="border px-4 py-2">{item.keywordTechnology || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Industrial Sector</th><td className="border px-4 py-2">{item.industrialSector?.join(', ') || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Multi Lab Institute</th><td className="border px-4 py-2">{item.multiLabInstitute || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Lead Lab</th><td className="border px-4 py-2">{item.leadLaboratory || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Associate Institutes</th><td className="border px-4 py-2">{item.associateInstitute?.join(', ') || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Theme</th><td className="border px-4 py-2">{item.theme?.join(', ') || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Technology Level</th><td className="border px-4 py-2">{item.technologyLevel || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Scale of Development</th><td className="border px-4 py-2">{item.scaleDevelopment || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Year of Development</th><td className="border px-4 py-2">{item.yearDevelopment || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Brief</th><td className="border px-4 py-2">{item.briefTech || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Competitive Position</th><td className="border px-4 py-2">{item.competitivePosition || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Stakeholders</th><td className="border px-4 py-2">{item.stakeHolders?.join(', ') || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Techno Economics</th><td className="border px-4 py-2">{item.technoEconomics || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Market Potential</th><td className="border px-4 py-2">{item.marketPotential || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Environmental Statutory</th><td className="border px-4 py-2">{item.environmentalStatutory || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Laboratory Details</th><td className="border px-4 py-2">{item.laboratoryDetail || '-'}</td></tr>
          </tbody>
        </table>

        {/* Section Two - IPR Details */}
        {item.sectionTwo?.length > 0 && (
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
                  {item.sectionTwo.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-4 border">{row.technologyRefNo || '-'}</td>
                      <td className="py-2 px-4 border">{row.iprType || '-'}</td>
                      <td className="py-2 px-4 border">{row.registrationNo || '-'}</td>
                      <td className="py-2 px-4 border">{row.status || '-'}</td>
                      <td className="py-2 px-4 border">{row.statusDate || '-'}</td>
                      <td className="py-2 px-4 border">{row.countries?.join(', ') || '-'}</td>
                      <td className="py-2 px-4 border">
                        <button onClick={() => window.print()} className="text-blue-600 hover:underline">
                          Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section Three - License Details */}
        {item.sectionThree?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Section Three - License Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Licensee Name</th>
                    <th className="py-2 px-4 border">License Type</th>
                    <th className="py-2 px-4 border">Agreement Date</th>
                    <th className="py-2 px-4 border">License Period</th>
                    <th className="py-2 px-4 border">Royalty</th>
                    <th className="py-2 px-4 border">Premia</th>
                    <th className="py-2 px-4 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {item.sectionThree.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-4 border">{row.licenseeName || '-'}</td>
                      <td className="py-2 px-4 border">{row.licenseType || '-'}</td>
                      <td className="py-2 px-4 border">{row.agreementDate || '-'}</td>
                      <td className="py-2 px-4 border">{row.licensePeriod || '-'}</td>
                      <td className="py-2 px-4 border">{row.royalty || '-'}</td>
                      <td className="py-2 px-4 border">{row.premia || '-'}</td>
                      <td className="py-2 px-4 border">
                        <button onClick={() => window.print()} className="text-blue-600 hover:underline">
                          Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-6 text-right">
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
