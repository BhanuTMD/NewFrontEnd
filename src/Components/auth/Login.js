import React from 'react';

const PreviewPopUp = ({ item = {}, onClose }) => {
  console.log("PreviewPopUp item ===>", item);

  const dummyItem = {
    nameTechnology: "AI-Based Smart Drone",
    technologyRefNo: "TRN-2025-001",
    keywordTechnology: "drone, ai, surveillance",
    industrialSector: ["Defense", "Aerospace"],
    multiLabInstitute: "Yes",
    leadLaboratory: "CSIR-NAL",
    associateInstitute: ["CSIR-CEERI", "CSIR-CRRI"],
    theme: ["Artificial Intelligence", "Automation"],
    technologyLevel: "TRL 6",
    scaleDevelopment: "Pilot Scale",
    yearDevelopment: "2025",
    briefTech: "This is an AI-powered autonomous drone for real-time surveillance.",
    competitivePosition: "High accuracy, low cost, autonomous navigation",
    stakeHolders: ["DRDO", "Private Defense Sector"],
    technoEconomics: "Cost-effective solution for military surveillance",
    marketPotential: "High demand in both domestic and global defense sector",
    environmentalStatutory: "Compliant with DGCA norms",
    laboratoryDetail: "Developed and tested in wind tunnel at CSIR-NAL",
  };

  const previewItem = {
    ...dummyItem,
    ...item,
    sectionTwo: item.sectionTwo?.length ? item.sectionTwo : [
      {
        technologyRefNo: "TRN001",
        iprType: "Patent",
        registrationNo: "PAT-12345",
        status: "Granted",
        statusDate: "2023-05-01",
        countries: ["India", "USA"]
      }
    ],
    sectionThree: item.sectionThree?.length ? item.sectionThree : [
      {
        licenseeName: "ABC Pvt Ltd",
        licenseType: "Exclusive",
        agreementDate: "2023-10-12",
        licensePeriod: "5 years",
        royalty: "5%",
        premia: "2 lakhs"
      }
    ],
    sectionFour: item.sectionFour?.length ? item.sectionFour : [
      {
        technologyRefNo: "TRN001",
        clientName: "XYZ Industries",
        clientAddress: "Sector 21, Gurugram",
        city: "Gurugram",
        country: "India",
        nodalContactPerson: "Mr. Verma"
      }
    ]
  };
  console.log("PreviewPopUp previewItem ===>", previewItem);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full p-6 overflow-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">
          Technology Detail - {previewItem.nameTechnology || '-'}
        </h2>
        {/* Section One */}
        <table className="table-auto w-full border border-gray-300 text-sm">
          <tbody>
            <tr><th className="border px-4 py-2 text-left">TRN No</th><td className="border px-4 py-2">{previewItem.technologyRefNo || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Technology Name</th><td className="border px-4 py-2">{previewItem.nameTechnology || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Keywords</th><td className="border px-4 py-2">{previewItem.keywordTechnology || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Industrial Sector</th><td className="border px-4 py-2">{previewItem.industrialSector?.join(', ') || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Multi Lab Institute</th><td className="border px-4 py-2">{previewItem.multiLabInstitute || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Lead Lab</th><td className="border px-4 py-2">{previewItem.leadLaboratory || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Associate Institutes</th><td className="border px-4 py-2">{previewItem.associateInstitute?.join(', ') || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Theme</th><td className="border px-4 py-2">{previewItem.theme?.join(', ') || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Technology Level</th><td className="border px-4 py-2">{previewItem.technologyLevel || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Scale of Development</th><td className="border px-4 py-2">{previewItem.scaleDevelopment || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Year of Development</th><td className="border px-4 py-2">{previewItem.yearDevelopment || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Brief</th><td className="border px-4 py-2">{previewItem.briefTech || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Competitive Position</th><td className="border px-4 py-2">{previewItem.competitivePosition || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Stakeholders</th><td className="border px-4 py-2">{previewItem.stakeHolders?.join(', ') || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Techno Economics</th><td className="border px-4 py-2">{previewItem.technoEconomics || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Market Potential</th><td className="border px-4 py-2">{previewItem.marketPotential || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Environmental Statutory</th><td className="border px-4 py-2">{previewItem.environmentalStatutory || '-'}</td></tr>
            <tr><th className="border px-4 py-2 text-left">Laboratory Details</th><td className="border px-4 py-2">{previewItem.laboratoryDetail || '-'}</td></tr>
          </tbody>
        </table>
        {/* Section Two */}
        {/* Section Two - IPR Details */}
        {previewItem.sectionTwo?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Section Two - IPR Details</h2>
            {previewItem.sectionTwo.map((row, index) => (
              <table key={index} className="table-auto w-full border border-gray-300 text-sm mb-6">
                <tbody>
                  <tr><th className="border px-4 py-2 text-left">TRN No</th><td className="border px-4 py-2">{row.technologyRefNo || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">IPR Type</th><td className="border px-4 py-2">{row.iprType || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">Registration No</th><td className="border px-4 py-2">{row.registrationNo || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">Status</th><td className="border px-4 py-2">{row.status || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">Status Date</th><td className="border px-4 py-2">{row.statusDate || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">Countries</th><td className="border px-4 py-2">{row.countries?.join(', ') || '-'}</td></tr>
                </tbody>
              </table>
            ))}
          </div>
        )}
        {/* Section Three - License Details */}
        {previewItem.sectionThree?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Section Three - License Details</h2>
            {previewItem.sectionThree.map((row, index) => (
              <table key={index} className="table-auto w-full border border-gray-300 text-sm mb-6">
                <tbody>
                  <tr><th className="border px-4 py-2 text-left">Licensee Name</th><td className="border px-4 py-2">{row.licenseeName || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">License Type</th><td className="border px-4 py-2">{row.licenseType || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">Agreement Date</th><td className="border px-4 py-2">{row.agreementDate || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">License Period</th><td className="border px-4 py-2">{row.licensePeriod || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">Royalty</th><td className="border px-4 py-2">{row.royalty || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">Premia</th><td className="border px-4 py-2">{row.premia || '-'}</td></tr>
                </tbody>
              </table>
            ))}
          </div>
        )}
        {/* Section Four - Deployment Details */}
        {previewItem.sectionFour?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Section Four - Deployment Details</h2>
            {previewItem.sectionFour.map((row, index) => (
              <table key={index} className="table-auto w-full border border-gray-300 text-sm mb-6">
                <tbody>
                  <tr><th className="border px-4 py-2 text-left">TRN No</th><td className="border px-4 py-2">{row.technologyRefNo || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">Client Name</th><td className="border px-4 py-2">{row.clientName || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">Client Address</th><td className="border px-4 py-2">{row.clientAddress || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">City</th><td className="border px-4 py-2">{row.city || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">Country</th><td className="border px-4 py-2">{row.country || '-'}</td></tr>
                  <tr><th className="border px-4 py-2 text-left">Nodal Contact Person</th><td className="border px-4 py-2">{row.nodalContactPerson || '-'}</td></tr>
                </tbody>
              </table>
            ))}
          </div>
        )}
        {/* Close Button */}
        <div className="mt-6 flex justify-between print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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

export default Login;