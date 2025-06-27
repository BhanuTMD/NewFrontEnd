import React, { useState } from 'react';
import PreviewPopUp from 'Components/pages/techSearch/PreviewPopUp';

const sectionStyles = {
  one: 'border-l-8 border-blue-500',
  two: 'border-l-8 border-green-500',
  three: 'border-l-8 border-yellow-500',
  four: 'border-l-8 border-purple-500',
};

const AllSectionPreview = ({ data }) => {
  const [previewItem, setPreviewItem] = useState(null);

  const handlePreviewRow = (item) => setPreviewItem(item);

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-8">All Sections - Technology Details</h2>
      {data.sectionOneList.map((item, index) => {
        const sectionTwo = data.sectionTwoList?.filter(s => s.technologyRefNo === item.technologyRefNo) || [];
        const sectionThree = data.sectionThreeList?.filter(s => s.technologyRefNo === item.technologyRefNo) || [];
        const sectionFour = data.sectionFourList?.filter(s => s.technologyRefNo === item.technologyRefNo) || [];

        return (
          <div key={index} className="border rounded-lg shadow-lg p-6 bg-white space-y-4">
            {/* Section One */}
            <div className={`${sectionStyles.one} pl-4`}>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Section One - Technology Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <Detail label="TRN No" value={item.technologyRefNo} />
                <Detail label="Keywords" value={item.keywordTechnology} />
                <Detail label="Industrial Sector" value={item.industrialSector?.join(', ')} />
                <Detail label="Multi Lab Institute" value={item.multiLabInstitute} />
                <Detail label="Lead Lab" value={item.leadLaboratory} />
                <Detail label="Associate Institutes" value={item.associateInstitute?.join(', ')} />
                <Detail label="Theme" value={item.theme?.join(', ')} />
                <Detail label="Technology Level" value={item.technologyLevel} />
                <Detail label="Scale of Development" value={item.scaleDevelopment} />
                <Detail label="Year of Development" value={item.yearDevelopment} />
                <Detail label="Brief" value={item.briefTech} />
                <Detail label="Competitive Position" value={item.competitivePosition} />
                <Detail label="Stakeholders" value={item.stakeHolders?.join(', ')} />
                <Detail label="Techno Economics" value={item.technoEconomics} />
                <Detail label="Market Potential" value={item.marketPotential} />
                <Detail label="Environmental Statutory" value={item.environmentalStatutory} />
                <div className="md:col-span-2">
                  <strong>File:</strong><br />
                  <img
                    src={`http://172.16.2.246:8080/apf/tdmp/images/${item.technologyRefNo}`}
                    alt="xyz"
                    className="mt-2 w-48 h-48 object-contain border rounded"
                  />
                </div>
                <Detail label="Laboratory Details" value={item.laboratoryDetail} />
              </div>
            </div>

            {/* Section Two */}
            {sectionTwo.length > 0 && (
              <div className={`${sectionStyles.two} pl-4`}>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Section Two - IPR Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <Detail label="IPR Type" value={sectionTwo[0].iprType} />
                  <Detail label="Registration No" value={sectionTwo[0].registrationNo} />
                  <Detail label="Status" value={sectionTwo[0].status} />
                  <Detail label="Status Date" value={sectionTwo[0].statusDate} />
                  <Detail label="Countries" value={sectionTwo[0].countries?.join(', ')} />
                </div>
              </div>
            )}

            {/* Section Three */}
            {sectionThree.length > 0 && (
              <div className={`${sectionStyles.three} pl-4`}>
                <h3 className="text-xl font-semibold text-yellow-600 mb-2">Section Three - Licensing Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <Detail label="License Name" value={sectionThree[0].licenseName} />
                  <Detail label="Agreement Date" value={sectionThree[0].dateOfAgreementSigning} />
                  <Detail label="License Type" value={sectionThree[0].typeOfLicense} />
                  <Detail label="Region" value={sectionThree[0].staRegionalGeography} />
                  <Detail label="Exclusivity" value={sectionThree[0].detailsOfExclusivity} />
                  <Detail label="License Date" value={sectionThree[0].dateOfLicense} />
                  <Detail label="Validity" value={sectionThree[0].licenseValidUntil} />
                  <Detail label="Payment Terms" value={sectionThree[0].paymentTerms} />
                  <Detail label="Sub Total Royalty" value={`₹${sectionThree[0].subTotalRoyalty || '0'}`} />
                  <Detail label="Sub Total Premia" value={`₹${sectionThree[0].subTotalPremia || '0'}`} />
                  <Detail label="Grand Total" value={`₹${sectionThree[0].grandTotal || '0'}`} />

                  <div className="col-span-2">
                    <strong>Royalty:</strong>
                    {(sectionThree[0].royalty || []).map((r, i) => (
                      <div key={i}>₹{r.amount} on {r.date}</div>
                    ))}
                  </div>
                  <div className="col-span-2">
                    <strong>Premia:</strong>
                    {(sectionThree[0].premia || []).map((p, i) => (
                      <div key={i}>₹{p.amount} on {p.date}</div>
                    ))}
                  </div>
                  <div className="col-span-2">
                    <strong>Grand Total:</strong> ₹{sectionThree[0].grandTotal || '0'}
                  </div>
                </div>              
              </div>
            )}
            {/* Section Four */}
            {sectionFour.length > 0 && (
              <div className={`${sectionStyles.four} pl-4`}>
                <h3 className="text-xl font-semibold text-purple-600 mb-2">Section Four - Deployment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <Detail label="Client Name" value={sectionFour[0].clientName} />
                  <Detail label="Address" value={sectionFour[0].clientAddress} />
                  <Detail label="City" value={sectionFour[0].city} />
                  <Detail label="Country" value={sectionFour[0].country} />
                  <Detail label="Contact Person" value={sectionFour[0].nodalContactPerson} />
                </div>
              </div>
            )}
            {/* Button */}
            <div className="mt-4">
              <button
                onClick={() =>
                  handlePreviewRow({
                    ...item,
                    sectionTwo,
                    sectionThree,
                    sectionFour,
                  })
                }
                className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
              >
                Preview
              </button>
            </div>
          </div>
        );
      })}

      {previewItem && (
        <PreviewPopUp
          item={previewItem}
          activeSection="all"
          onClose={() => setPreviewItem(null)}
        />
      )}
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <strong>{label}:</strong> {value || '-'}
  </div>
);

export default AllSectionPreview;
