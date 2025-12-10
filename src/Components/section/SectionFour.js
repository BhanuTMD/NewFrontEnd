import React, { useState, useEffect } from "react";
import axios from "axios";
import FooterBar from "Components/common/footer";
import NavBar from "Components/common/navBar";
// import Section from "Components/common/section";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Edit3,
  Trash2,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  SaveAll,
  // MapPin,
  // Phone,
  Globe,
} from "lucide-react";

import { countryOptions } from "Components/data/country";
import CustomSelect from "Components/utils/CustomSelect";

/* Initial empty deployment entry */
const initialDeploymentValues = {
  id: null,
  clientName: "",
  clientAddress: "",
  city: "",
  country: null, // object from countryOptions
  nodalContactPerson: "",
  deploymentDetails: "",
};

const SectionFour = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [technologyRefNo] = useState(location.state?.technologyRefNo || "");

  const [deployments, setDeployments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(Boolean(technologyRefNo));

  // const minDate = new Date("1900-01-01");
  // const maxDate = new Date("3000-12-31");

  useEffect(() => {
    if (!technologyRefNo) {
      Swal.fire("Missing Reference", "Technology Reference Number not provided.", "error");
      navigate("/sectionOne");
      return;
    }

    let mounted = true;
    setLoading(true);
    axios
      .get(`http://172.16.2.246:8080/api/section-four/${technologyRefNo}`)
      .then((res) => {
        if (!mounted) return;
        const formatted = (res.data || []).map((d) => ({
          ...d,
          // transform country code to option object if possible
          country: countryOptions.find((opt) => opt.value === d.country) || null,
        }));
        setDeployments(formatted);
      })
      .catch((err) => {
        console.error("Error fetching SectionFour data:", err);
        if (err.response?.status === 404) {
          setDeployments([]);
        } else {
          Swal.fire("Error", "Could not fetch existing deployment data.", "error");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => (mounted = false);
  }, [technologyRefNo, navigate]);

  const validationSchema = Yup.object({
    clientName: Yup.string().required("Required").max(300, "Max 300 chars"),
    clientAddress: Yup.string().required("Required").max(300, "Max 300 chars"),
    city: Yup.string().required("Required").max(100, "Max 100 chars"),
    country: Yup.object().nullable().required("Country is required"),
    nodalContactPerson: Yup.string().required("Required").max(300, "Max 300 chars"),
    deploymentDetails: Yup.string().required("Required").max(500, "Max 500 chars"),
  });

  const handleSubmitAll = () => {
    if (editingIndex !== null) {
      Swal.fire("Update Pending", "Finish editing before saving.", "warning");
      return;
    }

    const payload = deployments.map((d) => ({
      ...d,
      technologyRefNo,
      country: d.country?.value || null,
    }));

    Swal.fire({
      title: "Saving...",
      text: "Please wait while we save deployment data.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    axios
      .post(`http://172.16.2.246:8080/api/section-four/save/${technologyRefNo}`, payload, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        Swal.close();
        Swal.fire("Saved", "Section 4 saved successfully.", "success");
        const formatted = (res.data || []).map((d) => ({
          ...d,
          country: countryOptions.find((opt) => opt.value === d.country) || null,
        }));
        setDeployments(formatted);
        setEditingIndex(null);
      })
      .catch((err) => {
        console.error("Save error:", err);
        Swal.close();
        Swal.fire("Error!", err.response?.data?.message || "Saving Section 4 failed.", "error");
      });
  };

  const handleEditLoad = (entry, index, setValues) => {
    if (editingIndex !== null && editingIndex !== index) {
      Swal.fire("Action Required", "Please save or clear the current form before editing another item.", "warning");
      return;
    }
    setEditingIndex(index);
    setValues({
      id: entry.id || null,
      clientName: entry.clientName || "",
      clientAddress: entry.clientAddress || "",
      city: entry.city || "",
      country: entry.country || null,
      nodalContactPerson: entry.nodalContactPerson || "",
      deploymentDetails: entry.deploymentDetails || "",
    });
    Swal.fire("Editing", `Now editing: ${entry.clientName || "Entry"}`, "info");
  };

  const handleAddOrUpdateDeployment = async (values, { validateForm, resetForm }) => {
    const errs = await validateForm(values);
    if (Object.keys(errs).length) {
      Swal.fire("Incomplete Form", "Please fill all required fields correctly.", "error");
      return;
    }

    const deploymentData = {
      ...values,
      // ensure country is stored as object in local state
      country: values.country || null,
    };

    if (editingIndex !== null) {
      const copy = [...deployments];
      copy[editingIndex] = deploymentData;
      setDeployments(copy);
      Swal.fire("Updated", "Deployment updated in the list. Click 'Save All Changes' to persist.", "success");
    } else {
      setDeployments((p) => [...p, deploymentData]);
      Swal.fire("Added", "Deployment added to the list. Click 'Save All Changes' to persist.", "success");
    }

    resetForm({ values: initialDeploymentValues });
    setEditingIndex(null);
  };

  const handleRemoveDeployment = (indexToRemove) => {
    const entry = deployments[indexToRemove];
    Swal.fire({
      title: "Are you sure?",
      text: `Remove entry for '${entry.clientName || "Entry"}'? It will be deleted permanently when you click 'Save All Changes'.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((res) => {
      if (res.isConfirmed) {
        setDeployments((prev) => prev.filter((_, i) => i !== indexToRemove));
        if (editingIndex === indexToRemove) setEditingIndex(null);
        Swal.fire("Removed!", "Removed from the list. Click 'Save All Changes' to finalize deletion.", "info");
      }
    });
  };

  const handlePrevious = () => {
    navigate("/sectionThree", { state: { technologyRefNo } });
  };

  const handleNext = () => {
    navigate("/ViewTechnology", { state: { technologyRefNo } });
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <p className="mt-6 text-center text-slate-600">Loading deployment data...</p>
        <FooterBar />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-sky-200">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-300/40 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-screen">
          {/* Left main content */}
          <div className="w-full md:w-3/4">
            <div className="ml-0 md:ml-60 mr-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
              <div className="mb-5 md:mb-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 border border-indigo-400/40 text-[11px] font-medium text-indigo-700 uppercase tracking-[0.2em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Section 4
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                    Deployment Details
                  </h1>
                  <Globe className="h-5 w-5 text-indigo-600 hidden sm:block" />
                </div>
                <p className="mt-1 text-xs md:text-sm text-slate-600">
                  Record deployments, client contact and in-field details for this technology.
                </p>
              </div>

              <Formik initialValues={initialDeploymentValues} validationSchema={validationSchema} enableReinitialize onSubmit={() => {}}>
                {({ setFieldValue, values, validateForm, resetForm, errors, touched, setValues }) => {
                  const handleAddClick = () => handleAddOrUpdateDeployment(values, { validateForm, resetForm });

                  return (
                    <>
                      {/* Current Deployments List */}
                      {deployments.length > 0 && (
                        <div className="mb-6 p-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-sky-50 to-indigo-100 shadow-md">
                          <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center text-slate-900">
                            <Globe className="w-5 h-5 mr-2 text-indigo-600" />
                            Current Deployments ({deployments.length})
                          </h3>
                          <div className="space-y-3">
                            {deployments.map((dep, index) => (
                              <div
                                key={dep.id || `temp-${index}`}
                                className={`p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center border transition-all duration-200 ${
                                  editingIndex === index ? "bg-yellow-50 border-yellow-400 shadow-md" : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md"
                                }`}
                              >
                                <div className="flex-1 mb-3 sm:mb-0">
                                  <div className="flex items-center mb-1 gap-2 flex-wrap">
                                    <span className="text-sm md:text-base font-semibold text-slate-900">
                                      {index + 1}. {dep.clientName}
                                    </span>
                                    {dep.id && (
                                      <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full">
                                        ID: {dep.id}
                                      </span>
                                    )}
                                    {editingIndex === index && <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">Editing…</span>}
                                  </div>

                                  <div className="text-xs md:text-sm text-slate-600 space-y-0.5">
                                    <p><span className="font-semibold">Location:</span> {dep.city || "N/A"}, {dep.country?.label || "N/A"}</p>
                                    <p><span className="font-semibold">Contact:</span> {dep.nodalContactPerson || "N/A"}</p>
                                    <p className="truncate max-w-xl"><span className="font-semibold">Details:</span> {dep.deploymentDetails || "N/A"}</p>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEditLoad(dep, index, setValues)}
                                    className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-xs md:text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
                                    disabled={editingIndex !== null && editingIndex !== index}
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                    {editingIndex === index ? "Editing" : "Edit"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDeployment(index)}
                                    className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1.5 text-xs md:text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                                    disabled={editingIndex === index}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Form card */}
                      <Form className="bg-white/95 p-5 md:p-7 rounded-2xl shadow-2xl border border-slate-100 space-y-6">
                        <Field type="hidden" name="id" />

                        {/* TRN */}
                        <div className="mb-4">
                          <label className="font-semibold block mb-1 text-slate-800 text-sm">Technology Ref No:</label>
                          <input type="text" className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-sm md:text-base text-slate-700" value={technologyRefNo} readOnly />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                          {/* Client Name */}
                          <div>
                            <label className="font-semibold block mb-1 text-slate-800 text-sm">Client Name <span className="text-red-500">*</span>
                              <span className="block text-[11px] font-normal text-slate-500">Max. 300 characters</span>
                            </label>
                            <Field name="clientName" className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${errors.clientName && touched.clientName ? "border-red-500" : "border-slate-300"}`} />
                            <ErrorMessage name="clientName" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* City */}
                          <div>
                            <label className="font-semibold block mb-1 text-slate-800 text-sm">City <span className="text-red-500">*</span>
                              <span className="block text-[11px] font-normal text-slate-500">Max. 100 characters</span>
                            </label>
                            <Field name="city" className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${errors.city && touched.city ? "border-red-500" : "border-slate-300"}`} />
                            <ErrorMessage name="city" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Client Address */}
                          <div className="md:col-span-2">
                            <label className="font-semibold block mb-1 text-slate-800 text-sm">Client Address <span className="text-red-500">*</span>
                              <span className="block text-[11px] font-normal text-slate-500">Max. 300 characters</span>
                            </label>
                            <Field as="textarea" rows="2" name="clientAddress" className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${errors.clientAddress && touched.clientAddress ? "border-red-500" : "border-slate-300"}`} />
                            <ErrorMessage name="clientAddress" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Country (CustomSelect) */}
                          <div>
                            <label className="font-semibold block mb-1 text-slate-800 text-sm">Country <span className="text-red-500">*</span></label>
                            <Field name="country" options={countryOptions} component={CustomSelect} placeholder="Select a Country..." isMulti={false} className={`${errors.country && touched.country ? "react-select-error" : ""}`} />
                            <ErrorMessage name="country" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Nodal Contact Person */}
                          <div className="md:col-span-2">
                            <label className="font-semibold block mb-1 text-slate-800 text-sm">Nodal Contact Person (Name & Contact) <span className="text-red-500">*</span>
                              <span className="block text-[11px] font-normal text-slate-500">Max. 300 characters</span>
                            </label>
                            <Field as="textarea" rows="2" name="nodalContactPerson" className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${errors.nodalContactPerson && touched.nodalContactPerson ? "border-red-500" : "border-slate-300"}`} />
                            <ErrorMessage name="nodalContactPerson" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Deployment Details */}
                          <div className="md:col-span-2">
                            <label className="font-semibold block mb-1 text-slate-800 text-sm">Deployment Details <span className="text-red-500">*</span>
                              <span className="block text-[11px] font-normal text-slate-500">Max. 500 characters</span>
                            </label>
                            <Field as="textarea" rows="4" name="deploymentDetails" className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${errors.deploymentDetails && touched.deploymentDetails ? "border-red-500" : "border-slate-300"}`} />
                            <ErrorMessage name="deploymentDetails" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        </div>

                        {/* Form actions */}
                        <div className="mt-6 flex flex-wrap gap-3 justify-between">
                          <div className="flex gap-3">
                            <button type="button" onClick={handleAddClick} className={`inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs md:text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50`} disabled={!technologyRefNo}>
                              <PlusCircle className="h-4 w-4" />
                              {editingIndex !== null ? "Update Deployment in List" : "Add Deployment to List"}
                            </button>

                            <button type="button" onClick={() => { resetForm({ values: initialDeploymentValues }); setEditingIndex(null); }} className="inline-flex items-center gap-2 rounded-full bg-slate-500 px-5 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-slate-600">
                              Clear Form / Cancel Edit
                            </button>
                          </div>

                          <div className="flex gap-3">
                            <button type="button" onClick={handlePrevious} className="inline-flex items-center gap-2 rounded-full bg-slate-600 px-5 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-slate-700">
                              <ArrowLeft className="h-4 w-4" />
                              Previous (Section 3)
                            </button>

                            <button type="button" onClick={handleSubmitAll} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-emerald-700 shadow-md disabled:opacity-50" disabled={editingIndex !== null}>
                              <SaveAll className="h-4 w-4" />
                              {editingIndex !== null ? "Finish Editing" : "Save All Changes"}
                            </button>

                            <button type="button" onClick={handleNext} className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-indigo-700">
                              Next
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </Form>
                    </>
                  );
                }}
              </Formik>

              {/* bottom spacing */}
              <div className="h-6" />
            </div>
          </div>

          {/* Right info panel */}
          <div className="hidden md:flex md:w-1/4 items-start justify-center pr-6 py-10">
            <div className="w-full max-w-xs rounded-3xl bg-white/50 backdrop-blur-2xl border border-white/70 shadow-xl px-5 py-6 space-y-4 text-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-700">Section 4 Guide</p>
                  <p className="text-sm font-medium">Deployment Information</p>
                </div>
              </div>

              <p className="text-xs text-slate-700">
                Capture client, location and on-field deployment notes. Add each deployment as a separate entry and then click "Save All Changes".
              </p>

              <ul className="space-y-1.5 text-[11px] text-slate-700">
                <li>• Use the Add button to append a deployment to the list.</li>
                <li>• Edit an existing deployment before clicking Save All Changes.</li>
                <li>• Country selection uses the global country list.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <FooterBar />
    </>
  );
};

export default SectionFour;
