

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { countryOptions } from "Components/data/country";


// --- Review Popup Component ---
const ReviewPopup = ({ isOpen, onClose, technologyRefNo, navigate }) => {
  const [sectionOneData, setSectionOneData] = useState(null);
  const [sectionTwoData, setSectionTwoData] = useState(null);
  const [sectionThreeData, setSectionThreeData] = useState([]);
  const [sectionFourData, setSectionFourData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (isOpen && technologyRefNo) {
      const fetchData = async () => {
        setIsLoading(true);
        setFetchError(null);
        setSectionOneData(null);
        setSectionTwoData(null);
        setSectionThreeData([]);
        setSectionFourData([]);

        try {
          const [res1, res2, res3, res4] = await Promise.all([
            axios
              .get(
                `http://172.16.2.246:8282/api/section-one/${technologyRefNo}`
              )
              .catch((err) => ({ error: err, data: null })),
            axios
              .get(
                `http://172.16.2.246:8282/api/section-two/${technologyRefNo}`
              )
              .catch((err) => ({ error: err, data: null })),
            axios
              .get(
                `http://172.16.2.246:8282/api/section-three/${technologyRefNo}`
              )
              .catch((err) => ({ error: err, data: [] })),
            axios
              .get(
                `http://172.16.2.246:8282/api/section-four/${technologyRefNo}`
              )
              .catch((err) => ({ error: err, data: [] })),
          ]);

          if (res1 && !res1.error) {
            setSectionOneData(res1.data);
          } else {
            console.error(
              "Error fetching Section 1:",
              res1?.error?.response?.data || res1?.error?.message
            );
          }

          if (res2 && !res2.error) {
            setSectionTwoData(res2.data);
          } else {
            console.error(
              "Error fetching Section 2:",
              res2?.error?.response?.data || res2?.error?.message
            );
          }

          if (res3 && !res3.error) {
            setSectionThreeData(res3.data || []);
          } else {
            console.error(
              "Error fetching Section 3:",
              res3?.error?.response?.data || res3?.error?.message
            );
          }

          if (res4 && !res4.error) {
            setSectionFourData(res4.data || []);
          } else {
            console.error(
              "Error fetching Section 4:",
              res4?.error?.response?.data || res4?.error?.message
            );
          }

          if (res1?.error && res2?.error && res3?.error && res4?.error) {
            setFetchError("Failed to load any section data. Please try again.");
          } else if (res1?.error || res2?.error || res3?.error || res4?.error) {
            console.warn("Some sections failed to load in the preview.");
          }
        } catch (err) {
          console.error("Failed to fetch review data:", err);
          setFetchError(
            "An unexpected error occurred while loading review data."
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, technologyRefNo]);

  const handleEditClick = (path) => {
    navigate(path, { state: { technologyRefNo } });
    onClose();
  };

  const handleSubmitTechnology = () => {
    Swal.fire({
      title: "Confirm Submission?",
      text: "Submit this technology? This will finalize all sections.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Submit!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Success!",
          "All sections submitted successfully!",
          "success"
        ).then(() => {
          navigate("/ViewTechnology");
        });
      }
    });
  };

  const displayValue = (value) => {
    if (value === null || value === undefined)
      return <span className="text-gray-500 italic">N/A</span>;

    if (value === "")
      return <span className="text-gray-500 italic">N/A</span>;

    if (Array.isArray(value)) {
      if (value.length === 0)
        return <span className="text-gray-500 italic">None</span>;
      return value
        .map((item) =>
          typeof item === "object" && item !== null
            ? item.label || item.value || JSON.stringify(item)
            : String(item)
        )
        .join(", ");
    }

    if (typeof value === "object" && value !== null && (value.label || value.value)) {
      return String(value.label || value.value);
    }

    if (typeof value === "object" && value !== null && !(value instanceof Date)) {
      if (
        value.leadLaboratory &&
        typeof value.leadLaboratory === "object" &&
        value.leadLaboratory.label
      ) {
        return value.leadLaboratory.label;
      }
      return <span className="text-gray-500 italic">[Object Data]</span>;
    }

    if (typeof value === "boolean") return value ? "Yes" : "No";

    if (value instanceof Date) return value.toLocaleDateString();

    if (typeof value === "string" && !isNaN(Date.parse(value))) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) return date.toLocaleDateString();
    }

    return String(value);
  };

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? (
      <span className="text-gray-500 italic">N/A</span>
    ) : (
      `₹ ${num.toFixed(2)}`
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white/95 shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">
            Review Technology Details{" "}
            <span className="block text-xs md:inline md:ml-2 font-medium text-slate-500">
              (TRN: {technologyRefNo})
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-2xl font-semibold leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 bg-gradient-to-b from-slate-50/70 to-white">
          {isLoading && (
            <p className="text-center text-indigo-600 font-semibold py-4">
              Loading review data...
            </p>
          )}
          {fetchError && (
            <p className="text-center text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {fetchError}
            </p>
          )}

          {!isLoading && !fetchError && (
            <div className="space-y-6">
              {/* Section 1 */}
              {sectionOneData ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                    <h4 className="text-lg font-semibold text-indigo-700">
                      Section 1: Key Details
                    </h4>
                    <button
                      onClick={() => handleEditClick("/sectionOne")}
                      className="text-xs md:text-sm rounded-full bg-indigo-600 px-3 py-1.5 text-white font-semibold hover:bg-indigo-700 shadow-sm"
                    >
                      Edit
                    </button>
                  </div>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div className="md:col-span-2">
                      <dt className="font-medium text-slate-600">
                        Name of Technology:
                      </dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(sectionOneData.nameTechnology)}
                      </dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="font-medium text-slate-600">
                        Keywords:
                      </dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(sectionOneData.keywordTechnology)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">
                        Industrial Sector(s):
                      </dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(sectionOneData.industrialSector)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">Theme(s):</dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(sectionOneData.theme)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">
                        Lead Laboratory:
                      </dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(sectionOneData.leadLaboratory)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">
                        Multi-Lab Involved:
                      </dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(sectionOneData.multiLabInstitute)}
                      </dd>
                    </div>
                    {sectionOneData.multiLabInstitute === "Yes" && (
                      <div>
                        <dt className="font-medium text-slate-600">
                          Associated Labs:
                        </dt>
                        <dd className="mt-1 text-slate-800">
                          {displayValue(sectionOneData.lab)}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-medium text-slate-600">TRL:</dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(sectionOneData.technologyLevel)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">
                        Scale of Development:
                      </dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(sectionOneData.scaleDevelopment)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">
                        Year of Development:
                      </dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(sectionOneData.yearDevelopment)}
                      </dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="font-medium text-slate-600">
                        Brief Details:
                      </dt>
                      <dd className="mt-1 text-slate-800 whitespace-pre-wrap">
                        {displayValue(sectionOneData.briefTech)}
                      </dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="font-medium text-slate-600">
                        Competitive Positioning:
                      </dt>
                      <dd className="mt-1 text-slate-800 whitespace-pre-wrap">
                        {displayValue(sectionOneData.competitivePosition)}
                      </dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="font-medium text-slate-600">
                        Techno-economics:
                      </dt>
                      <dd className="mt-1 text-slate-800 whitespace-pre-wrap">
                        {displayValue(sectionOneData.technoEconomics)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">
                        Potential Application Areas:
                      </dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(
                          sectionOneData.potentialApplicationAreas
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">
                        Potential Ministries:
                      </dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(sectionOneData.potentialMinistries)}
                      </dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="font-medium text-slate-600">
                        Environmental/Statutory Compliance:
                      </dt>
                      <dd className="mt-1 text-slate-800 whitespace-pre-wrap">
                        {displayValue(sectionOneData.environmentalStatutory)}
                      </dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="font-medium text-slate-600">
                        Market Potential:
                      </dt>
                      <dd className="mt-1 text-slate-800 whitespace-pre-wrap">
                        {displayValue(sectionOneData.marketPotential)}
                      </dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="font-medium text-slate-600">
                        Lab Contact Details:
                      </dt>
                      <dd className="mt-1 text-slate-800 whitespace-pre-wrap">
                        {displayValue(sectionOneData.laboratoryDetail)}
                      </dd>
                    </div>
                    {sectionOneData.fileUrl && (
                      <div className="md:col-span-2">
                        <dt className="font-medium text-slate-600">
                          Uploaded File:
                        </dt>
                        <dd className="mt-1">
                          <a
                            href={sectionOneData.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            View File
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              ) : (
                !isLoading && (
                  <p className="text-sm text-center text-slate-500">
                    (Section 1 data not available)
                  </p>
                )
              )}

              {/* Section 2 */}
              {sectionTwoData ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                    <h4 className="text-lg font-semibold text-indigo-700">
                      Section 2: Team Details
                    </h4>
                    <button
                      onClick={() => handleEditClick("/sectionTwo")}
                      className="text-xs md:text-sm rounded-full bg-indigo-600 px-3 py-1.5 text-white font-semibold hover:bg-indigo-700 shadow-sm"
                    >
                      Edit
                    </button>
                  </div>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div className="md:col-span-2">
                      <dt className="font-medium text-slate-600">
                        Principal Investigator:
                      </dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(
                          sectionTwoData.principalInvestigatorName
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">
                        Designation:
                      </dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(sectionTwoData.designation)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">
                        Group/Division:
                      </dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(sectionTwoData.groupDivision)}
                      </dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="font-medium text-slate-600">
                        Institute/Lab:
                      </dt>
                      <dd className="mt-1 text-slate-800">
                        {displayValue(sectionTwoData.instituteLab)}
                      </dd>
                    </div>
                  </dl>
                </div>
              ) : (
                !isLoading && (
                  <p className="text-sm text-center text-slate-500">
                    (Section 2 data not available)
                  </p>
                )
              )}

              {/* Section 3 */}
              {sectionThreeData && sectionThreeData.length > 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                    <h4 className="text-lg font-semibold text-indigo-700">
                      Section 3: Licensee Details ({sectionThreeData.length})
                    </h4>
                    <button
                      onClick={() => handleEditClick("/sectionThree")}
                      className="text-xs md:text-sm rounded-full bg-indigo-600 px-3 py-1.5 text-white font-semibold hover:bg-indigo-700 shadow-sm"
                    >
                      Edit
                    </button>
                  </div>
                  <ul className="space-y-3">
                    {sectionThreeData.map((lic, idx) => (
                      <li
                        key={lic.id || `lic-${idx}`}
                        className="text-sm border-b border-slate-200 pb-2 last:border-b-0"
                      >
                        <span className="font-semibold text-slate-800">
                          {idx + 1}. {lic.licenseName}
                        </span>
                        <div className="pl-4 text-slate-700 grid grid-cols-2 gap-x-4 mt-1">
                          <span>
                            Type: {displayValue(lic.typeOfLicense)}
                          </span>
                          <span>
                            Signed: {displayValue(lic.dateOfAgreementSigning)}
                          </span>
                          <span>
                            Region: {displayValue(lic.staRegionalGeography)}
                          </span>
                          <span>
                            Total Fee: {formatCurrency(lic.totalLicenseFee)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                !isLoading && (
                  <p className="text-sm text-center text-slate-500">
                    (No Section 3 Licensee data available)
                  </p>
                )
              )}

              {/* Section 4 */}
              {sectionFourData && sectionFourData.length > 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                    <h4 className="text-lg font-semibold text-indigo-700">
                      Section 4: Deployment Details ({sectionFourData.length})
                    </h4>
                    <button
                      onClick={() => handleEditClick("/sectionFour")}
                      className="text-xs md:text-sm rounded-full bg-indigo-600 px-3 py-1.5 text-white font-semibold hover:bg-indigo-700 shadow-sm"
                    >
                      Edit
                    </button>
                  </div>
                  <ul className="space-y-3">
                    {sectionFourData.map((dep, idx) => (
                      <li
                        key={dep.id || `dep-${idx}`}
                        className="text-sm border-b border-slate-200 pb-2 last:border-b-0"
                      >
                        <span className="font-semibold text-slate-800">
                          {idx + 1}. {dep.clientName}
                        </span>
                        <div className="pl-4 text-slate-700 grid grid-cols-2 gap-x-4 mt-1">
                          <span>
                            Location: {dep.city},{" "}
                            {displayValue(
                              countryOptions.find(
                                (opt) => opt.value === dep.country
                              )
                            )}
                          </span>
                          <span>
                            Contact: {displayValue(dep.nodalContactPerson)}
                          </span>
                          <span className="col-span-2">
                            Details: {displayValue(dep.deploymentDetails)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                !isLoading && (
                  <p className="text-sm text-center text-slate-500">
                    (No Section 4 Deployment data available)
                  </p>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="sticky bottom-0 z-10 flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-full bg-slate-500 px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-slate-600"
          >
            Close
          </button>
          <button
            onClick={handleSubmitTechnology}
            className="rounded-full bg-emerald-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-emerald-700 shadow-md shadow-emerald-400/40"
          >
            Submit Technology
          </button>
        </div>
      </div>
    </div>
  );
};
export default ReviewPopup;