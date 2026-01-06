import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios from "axios";

import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";
import Section from "Components/common/section";
import { countryOptions } from "Components/data/country"; // Corrected import
import CustomSelect from "Components/utils/CustomSelect"; // Ensure this handles objects

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
                `http://172.16.2.246:8080/api/section-one/${technologyRefNo}`
              )
              .catch((err) => ({ error: err, data: null })),
            axios
              .get(
                `http://172.16.2.246:8080/api/section-two/${technologyRefNo}`
              )
              .catch((err) => ({ error: err, data: null })),
            axios
              .get(
                `http://172.16.2.246:8080/api/section-three/${technologyRefNo}`
              )
              .catch((err) => ({ error: err, data: [] })),
            axios
              .get(
                `http://172.16.2.246:8080/api/section-four/${technologyRefNo}`
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
// --- End Review Popup Component ---

// Define initial empty state for ONE Deployment entry in the form
const initialDeploymentFormValues = {
  id: null,
  clientName: "",
  clientAddress: "",
  city: "",
  country: null,
  nodalContactPerson: "",
  deploymentDetails: "",
};

const SectionFour = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const technologyRefNo = location.state?.technologyRefNo || "";

  const [deploymentEntries, setDeploymentEntries] = useState([]);
  const [loading, setLoading] = useState(!!technologyRefNo);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (technologyRefNo) {
      setLoading(true);
      axios
        .get(`http://172.16.2.246:8080/api/section-four/${technologyRefNo}`)
        .then((response) => {
          const formattedData = (response.data || []).map((deployment) => ({
            ...deployment,
            country:
              countryOptions.find(
                (opt) => opt.value === deployment.country
              ) || null,
          }));
          setDeploymentEntries(formattedData);
        })
        .catch((error) => {
          console.error("Error fetching SectionFour data:", error);
          if (error.response?.status === 404) {
            setDeploymentEntries([]);
          } else {
            Swal.fire(
              "Error",
              "Could not fetch existing deployment data.",
              "error"
            );
          }
        })
        .finally(() => setLoading(false));
    } else {
      Swal.fire(
        "Missing Reference",
        "Technology Reference Number not provided.",
        "error"
      );
      navigate("/sectionOne");
    }
  }, [technologyRefNo, navigate]);

  const validationSchema = Yup.object({
    clientName: Yup.string().required("Required").max(300, "Max 300 chars"),
    clientAddress: Yup.string().required("Required").max(300, "Max 300 chars"),
    city: Yup.string().required("Required").max(100, "Max 100 chars"),
    country: Yup.object().nullable().required("Country is required"),
    nodalContactPerson: Yup.string()
      .required("Required")
      .max(300, "Max 300 chars"),
    deploymentDetails: Yup.string()
      .required("Required")
      .max(500, "Max 500 chars"),
  });

  const handleSubmitAll = () => {
    return new Promise((resolve, reject) => {
      if (editingIndex !== null) {
        Swal.fire(
          "Update Pending",
          "Finish editing before saving.",
          "warning"
        );
        return reject(new Error("Update pending"));
      }

      const payload = deploymentEntries.map((entry) => ({
        ...entry,
        technologyRefNo: technologyRefNo,
        country: entry.country?.value || null,
      }));

      axios
        .post(
          `http://172.16.2.246:8080/api/section-four/save/${technologyRefNo}`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((response) => {
          console.log("Section 4 saved successfully.");
          const formattedResponse = (response.data || []).map((deployment) => ({
            ...deployment,
            country:
              countryOptions.find(
                (opt) => opt.value === deployment.country
              ) || null,
          }));
          setDeploymentEntries(formattedResponse);
          setEditingIndex(null);
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Save error:", error.response?.data || error.message);
          Swal.fire(
            "Error!",
            error.response?.data?.message ||
              "Saving Section 4 failed.",
            "error"
          );
          reject(error);
        });
    });
  };

  const handleEditLoad = (deploymentToEdit, index, setValues) => {
    if (editingIndex !== null && editingIndex !== index) {
      Swal.fire(
        "Action Required",
        "Please save or clear the current form before editing another item.",
        "warning"
      );
      return;
    }
    setEditingIndex(index);
    setValues({
      id: deploymentToEdit.id || null,
      clientName: deploymentToEdit.clientName || "",
      clientAddress: deploymentToEdit.clientAddress || "",
      city: deploymentToEdit.city || "",
      country: deploymentToEdit.country || null,
      nodalContactPerson: deploymentToEdit.nodalContactPerson || "",
      deploymentDetails: deploymentToEdit.deploymentDetails || "",
    });
    Swal.fire(
      "Editing",
      `Editing details for: ${deploymentToEdit.clientName || "New Entry"}`,
      "info"
    );
  };

  const handleAddOrUpdateDeployment = async (values, { validateForm, resetForm }) => {
    const formErrors = await validateForm(values);
    if (Object.keys(formErrors).length > 0) {
      Swal.fire(
        "Incomplete Form",
        "Please fill all required fields correctly.",
        "error"
      );
      return;
    }

    const deploymentData = { ...values };

    if (editingIndex !== null) {
      const updatedEntries = [...deploymentEntries];
      updatedEntries[editingIndex] = deploymentData;
      setDeploymentEntries(updatedEntries);
      Swal.fire(
        "Updated",
        "Details updated in the list. Click 'Save All Deployments'.",
        "success"
      );
    } else {
      setDeploymentEntries((prev) => [...prev, deploymentData]);
      Swal.fire(
        "Added",
        "Details added to the list. Click 'Save All Deployments'.",
        "success"
      );
    }

    resetForm({ values: initialDeploymentFormValues });
    setEditingIndex(null);
  };

  const handleRemoveDeployment = (indexToRemove, resetForm) => {
    const entryToRemove = deploymentEntries[indexToRemove];
    Swal.fire({
      title: "Are you sure?",
      text: `Remove entry for '${entryToRemove.clientName || "New Entry"}'? Will be deleted on Save All.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#4b5563",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setDeploymentEntries((prev) =>
          prev.filter((_, i) => i !== indexToRemove)
        );
        if (editingIndex === indexToRemove) {
          setEditingIndex(null);
          resetForm({ values: initialDeploymentFormValues });
        }
        Swal.fire(
          "Removed!",
          "Removed from list. Click 'Save All Deployments' to finalize.",
          "info"
        );
      }
    });
  };

  const handlePrevious = () => {
    navigate("/sectionThree", { state: { technologyRefNo: technologyRefNo } });
  };

  const handlePreviewOpen = () => {
    if (editingIndex !== null) {
      Swal.fire(
        "Update Pending",
        "Finish editing the current entry before previewing.",
        "warning"
      );
      return;
    }
    setIsPreviewOpen(true);
  };

  if (loading) {
    return (
      <p className="mt-6 text-center text-slate-600">
        Loading deployment data...
      </p>
    );
  }

  return (
    <>
      <NavBar />
      <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-sky-200">
        {/* Soft background blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />
          <div className="absolute bottom-[-3rem] right-[-3rem] h-72 w-72 rounded-full bg-orange-300/40 blur-3xl" />
        </div>

        <div className="relative z-10 flex">
          <div className="flex-1 px-4 py-8 md:px-8">
            <Section sectionLine="Section 4 : Deployment Details " />

            <Formik
              initialValues={initialDeploymentFormValues}
              validationSchema={validationSchema}
              onSubmit={handleAddOrUpdateDeployment}
              enableReinitialize
            >
              {({
                setFieldValue,
                values,
                resetForm,
                submitForm,
                errors,
                touched,
                setValues,
              }) => (
                <>
                  {/* Current Deployment List */}
                  {deploymentEntries.length > 0 && (
                    <div className="mb-6 p-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-sky-50 to-indigo-100 shadow-md">
                      <h3 className="text-2xl font-extrabold mb-4 text-blue-900 flex items-center">
                        <svg
                          className="w-6 h-6 mr-2 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          ></path>
                        </svg>
                        Current Deployment Entries ({deploymentEntries.length})
                      </h3>
                      <div className="space-y-4">
                        {deploymentEntries.map((deployment, index) => (
                          <div
                            key={deployment.id || `temp-${index}`}
                            className={`p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center border transition-all duration-200 ${
                              editingIndex === index
                                ? "bg-amber-50 border-amber-400 shadow-md"
                                : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md"
                            }`}
                          >
                            <div className="flex-1 mb-3 sm:mb-0">
                              <div className="flex items-center mb-1">
                                <span className="text-lg font-bold text-slate-900 mr-2">
                                  {index + 1}. {deployment.clientName}
                                </span>
                                {deployment.id && (
                                  <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">
                                    ID: {deployment.id}
                                  </span>
                                )}
                                {editingIndex === index && (
                                  <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full animate-pulse">
                                    Editing...
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-slate-600 space-y-0.5">
                                <p>
                                  <span className="font-semibold">
                                    Location:
                                  </span>{" "}
                                  {deployment.city || "N/A"},{" "}
                                  {deployment.country?.label || "N/A"}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Contact:
                                  </span>{" "}
                                  {deployment.nodalContactPerson || "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleEditLoad(
                                    deployment,
                                    index,
                                    setValues
                                  )
                                }
                                className="bg-amber-500 text-white px-4 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-amber-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={
                                  editingIndex !== null &&
                                  editingIndex !== index
                                }
                              >
                                {editingIndex === index ? "Editing" : "Edit"}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveDeployment(index, resetForm)
                                }
                                className="bg-rose-500 text-white px-4 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-rose-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={editingIndex === index}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form Card */}
                  <Form
                    className="bg-white/95 p-6 md:p-7 rounded-2xl shadow-2xl border border-slate-100"
                    id="sectionFourForm"
                  >
                    <h3 className="text-lg md:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">
                      {editingIndex !== null
                        ? `Editing Entry ${editingIndex + 1}`
                        : "Add New Deployment Entry"}
                    </h3>

                    {/* TRN */}
                    <div className="form-group mb-6">
                      <label className="font-bold block mb-1 text-slate-700 text-sm">
                        Technology Ref No:
                      </label>
                      <input
                        type="text"
                        value={technologyRefNo}
                        readOnly
                        className="w-full p-2 text-base outline-none rounded-md border border-slate-300 bg-slate-100 text-slate-600 cursor-not-allowed"
                      />
                      <Field
                        type="hidden"
                        name="technologyRefNo"
                        value={technologyRefNo}
                      />
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      {/* Client Name */}
                      <div className="form-group">
                        <label
                          className="font-bold block mb-1 text-slate-700 text-sm"
                          htmlFor="clientName"
                        >
                          Name of Client <span className="text-red-500">*</span>
                          <span className="block text-xs font-normal text-slate-500">
                            Max. 300 Characters
                          </span>
                        </label>
                        <Field
                          type="text"
                          id="clientName"
                          name="clientName"
                          placeholder="Enter client name..."
                          className={`w-full p-2 text-base outline-none rounded-md border ${
                            errors.clientName && touched.clientName
                              ? "border-red-500"
                              : "border-slate-300"
                          } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400`}
                        />
                        <ErrorMessage
                          name="clientName"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      {/* City */}
                      <div className="form-group">
                        <label
                          className="font-bold block mb-1 text-slate-700 text-sm"
                          htmlFor="city"
                        >
                          City <span className="text-red-500">*</span>
                          <span className="block text-xs font-normal text-slate-500">
                            Max. 100 Characters
                          </span>
                        </label>
                        <Field
                          type="text"
                          id="city"
                          name="city"
                          placeholder="Enter city..."
                          className={`w-full p-2 text-base outline-none rounded-md border ${
                            errors.city && touched.city
                              ? "border-red-500"
                              : "border-slate-300"
                          } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400`}
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      {/* Client Address */}
                      <div className="form-group md:col-span-2">
                        <label
                          className="font-bold block mb-1 text-slate-700 text-sm"
                          htmlFor="clientAddress"
                        >
                          Address of Client{" "}
                          <span className="text-red-500">*</span>
                          <span className="block text-xs font-normal text-slate-500">
                            Max. 300 Characters
                          </span>
                        </label>
                        <Field
                          as="textarea"
                          rows="3"
                          id="clientAddress"
                          name="clientAddress"
                          placeholder="Enter client address..."
                          className={`w-full p-2 text-base outline-none rounded-md border ${
                            errors.clientAddress && touched.clientAddress
                              ? "border-red-500"
                              : "border-slate-300"
                          } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400`}
                        />
                        <ErrorMessage
                          name="clientAddress"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      {/* Country */}
                      <div className="form-group">
                        <label
                          className="font-bold block mb-1 text-slate-700 text-sm"
                          htmlFor="country"
                        >
                          Country <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="country"
                          options={countryOptions}
                          component={CustomSelect}
                          placeholder="Select a Country..."
                          isMulti={false}
                          className={`${
                            errors.country && touched.country
                              ? "react-select-error"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          name="country"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      {/* Nodal Contact Person */}
                      <div className="form-group md:col-span-2">
                        <label
                          className="font-bold block mb-1 text-slate-700 text-sm"
                          htmlFor="nodalContactPerson"
                        >
                          Nodal Contact Person (Name & Address){" "}
                          <span className="text-red-500">*</span>
                          <span className="block text-xs font-normal text-slate-500">
                            Max. 300 Characters
                          </span>
                        </label>
                        <Field
                          as="textarea"
                          rows="3"
                          id="nodalContactPerson"
                          name="nodalContactPerson"
                          placeholder="Enter nodal contact person details..."
                          className={`w-full p-2 text-base outline-none rounded-md border ${
                            errors.nodalContactPerson &&
                            touched.nodalContactPerson
                              ? "border-red-500"
                              : "border-slate-300"
                          } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400`}
                        />
                        <ErrorMessage
                          name="nodalContactPerson"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      {/* Deployment Details */}
                      <div className="form-group md:col-span-2">
                        <label
                          className="font-bold block mb-1 text-slate-700 text-sm"
                          htmlFor="deploymentDetails"
                        >
                          Deployment Details{" "}
                          <span className="text-red-500">*</span>
                          <span className="block text-xs font-normal text-slate-500">
                            Max. 500 Characters
                          </span>
                        </label>
                        <Field
                          as="textarea"
                          rows="4"
                          id="deploymentDetails"
                          name="deploymentDetails"
                          placeholder="Enter deployment details..."
                          className={`w-full p-2 text-base outline-none rounded-md border ${
                            errors.deploymentDetails &&
                            touched.deploymentDetails
                              ? "border-red-500"
                              : "border-slate-300"
                          } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400`}
                        />
                        <ErrorMessage
                          name="deploymentDetails"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    </div>

                    {/* Add / Update Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-slate-200 mt-6 flex-wrap">
                      <button
                        type="submit"
                        className={`px-6 py-2 rounded-full text-white text-xs md:text-sm font-semibold ${
                          editingIndex !== null
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                      >
                        {editingIndex !== null
                          ? "Update Entry in List"
                          : "Add Entry to List"}
                      </button>
                      {editingIndex !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            resetForm({ values: initialDeploymentFormValues });
                            setEditingIndex(null);
                          }}
                          className="bg-slate-500 text-white px-6 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-slate-600"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    {/* Main Navigation Buttons */}
                    <div className="flex justify-between items-center gap-4 mt-8 border-t border-slate-200 pt-5 flex-wrap">
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-600 px-5 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-slate-700"
                      >
                        ← Previous (Section 3)
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmitAll}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 shadow-md shadow-emerald-400/40"
                        disabled={editingIndex !== null}
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={handlePreviewOpen}
                        className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                        disabled={editingIndex !== null}
                      >
                        Preview & Edit
                      </button>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <FooterBar />

      {/* Review Popup */}
      <ReviewPopup
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        technologyRefNo={technologyRefNo}
        navigate={navigate}
      />
    </>
  );
};

export default SectionFour;
