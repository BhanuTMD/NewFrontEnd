import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationSchema } from "Components/section/SectionFourValidation";
import Swal from "sweetalert2";
import axios from "axios";

import ReviewPopup from "Components/section/ReviewPopUp";

import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";
import Section from "Components/common/section";
import { countryOptions } from "Components/data/country"; // Corrected import
import CustomSelect from "Components/utils/CustomSelect"; // Ensure this handles objects

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
        .get(`http://172.16.2.246:8282/api/section-four/${technologyRefNo}`)
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

  const handleSubmitAll = async () => {
    // 🔒 Block save if editing is in progress
    if (editingIndex !== null) {
      Swal.fire(
        "Update Pending",
        "Finish editing before saving.",
        "warning"
      );
      return;
    }

    // 🧾 Prepare payload for backend
    const payload = deploymentEntries.map((entry) => ({
      ...entry,
      technologyRefNo: technologyRefNo,
      country: entry.country?.value || null, // convert select object → string
    }));

    try {
      // 🚀 API call
      const response = await axios.post(
        `http://172.16.2.246:8282/api/section-four/save/${technologyRefNo}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // 🔄 Normalize response back to dropdown format
      const formattedResponse = (response.data || []).map((deployment) => ({
        ...deployment,
        country:
          countryOptions.find(
            (opt) => opt.value === deployment.country
          ) || null,
      }));

      // ✅ Update UI state
      setDeploymentEntries(formattedResponse);
      setEditingIndex(null);

      Swal.fire(
        "Saved!",
        "Deployment details saved successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Save error:",
        error.response?.data || error.message
      );

      Swal.fire(
        "Error!",
        error.response?.data?.message ||
        "Saving Section 4 failed.",
        "error"
      );
    }
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
                            className={`p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center border transition-all duration-200 ${editingIndex === index
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
                          className={`w-full p-2 text-base outline-none rounded-md border ${errors.clientName && touched.clientName
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
                          className={`w-full p-2 text-base outline-none rounded-md border ${errors.city && touched.city
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
                          className={`w-full p-2 text-base outline-none rounded-md border ${errors.clientAddress && touched.clientAddress
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
                          className={`${errors.country && touched.country
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
                          className={`w-full p-2 text-base outline-none rounded-md border ${errors.nodalContactPerson &&
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
                          className={`w-full p-2 text-base outline-none rounded-md border ${errors.deploymentDetails &&
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
                        className={`px-6 py-2 rounded-full text-white text-xs md:text-sm font-semibold ${editingIndex !== null
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