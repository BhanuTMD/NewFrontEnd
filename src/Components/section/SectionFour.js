import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationSchema } from "Components/section/SectionFourValidation";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Briefcase,
  MapPin,
  Globe,
  PlusCircle,
  Trash2,
  Edit3,
  ArrowLeft,
  SaveAll,
  Eye,
  CheckCircle,
} from "lucide-react";

import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";
import { countryOptions } from "Components/data/country";
import CustomSelect from "Components/utils/CustomSelect";

// --- Review Popup Component ---
const ReviewPopup = ({ isOpen, onClose, technologyRefNo, navigate }) => {
const [setSectionsData] = useState({ 1: null, 2: null, 3: [], 4: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && technologyRefNo) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const endpoints = [
            `http://172.16.2.246:8080/api/section-one/${technologyRefNo}`,
            `http://172.16.2.246:8080/api/section-two/${technologyRefNo}`,
            `http://172.16.2.246:8080/api/section-three/${technologyRefNo}`,
            `http://172.16.2.246:8080/api/section-four/${technologyRefNo}`,
          ];
          const responses = await Promise.all(endpoints.map(url => axios.get(url).catch(() => ({ data: null }))));
          setSectionsData({
            1: responses[0].data,
            2: responses[1].data,
            3: responses[2].data || [],
            4: responses[3].data || [],
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, technologyRefNo, setSectionsData]);

  const handleSubmitFinal = () => {
    Swal.fire({
      title: "Final Submission?",
      text: "Are you sure you want to submit all sections? This action is final.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      confirmButtonText: "Yes, Submit Technology",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Submitted!", "Technology data has been finalized.", "success")
          .then(() => navigate("/ViewTechnology"));
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between border-b px-8 py-5 bg-white">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle className="text-emerald-500" /> Review & Submit
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>
        <div className="p-8 overflow-y-auto bg-slate-50 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-500 font-medium">Fetching summary...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-indigo-700 mb-2">Technology Summary</h4>
                <p className="text-sm text-slate-600">Reference No: <span className="font-mono font-bold">{technologyRefNo}</span></p>
                <p className="text-sm text-slate-600 mt-1">Ready for final audit and system logging.</p>
              </div>
              <p className="text-xs text-slate-400 text-center italic">Detailed per-section view is available in the management dashboard.</p>
            </div>
          )}
        </div>
        <div className="border-t bg-white px-8 py-5 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-full px-6 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Go Back</button>
          <button onClick={handleSubmitFinal} className="rounded-full bg-emerald-600 px-8 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200">Confirm Final Submission</button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const SectionFour = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const technologyRefNo = location.state?.technologyRefNo || "";

  const [deploymentEntries, setDeploymentEntries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const initialFormValues = {
    id: null,
    clientName: "",
    clientAddress: "",
    city: "",
    country: null,
    nodalContactPerson: "",
    deploymentDetails: "",
  };

  useEffect(() => {
    if (technologyRefNo) {
      axios.get(`http://172.16.2.246:8080/api/section-four/${technologyRefNo}`)
        .then((res) => {
          const data = (res.data || []).map(entry => ({
            ...entry,
            country: countryOptions.find(opt => opt.value === entry.country) || null
          }));
          setDeploymentEntries(data);
        }).catch(() => setDeploymentEntries([]));
    }
  }, [technologyRefNo]);

  const handleSaveAll = () => {
    if (editingIndex !== null) {
      Swal.fire("Update Pending", "Please save or cancel the current edit first.", "warning");
      return;
    }
    const payload = deploymentEntries.map(e => ({
      ...e,
      technologyRefNo,
      country: e.country?.value || null
    }));
    axios.post(`http://172.16.2.246:8080/api/section-four/save/${technologyRefNo}`, payload)
      .then(() => Swal.fire("Success", "All deployment records saved successfully!", "success"))
      .catch(() => Swal.fire("Error", "Failed to save records.", "error"));
  };

  const handleEdit = (entry, index, setValues) => {
    setEditingIndex(index);
    setValues(entry);
    Swal.fire({
      title: "Switching to Edit Mode",
      text: `Editing: ${entry.clientName}`,
      icon: "info",
      toast: true,
      position: "top-end",
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleRemove = (index) => {
    Swal.fire({
      title: "Remove Entry?",
      text: "This will remove the client from the list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Remove"
    }).then((res) => {
      if (res.isConfirmed) {
        setDeploymentEntries(prev => prev.filter((_, i) => i !== index));
        if (editingIndex === index) setEditingIndex(null);
      }
    });
  };

  return (
    <>
      <NavBar />
      <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-sky-200">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-300/40 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-screen">
          <div className="w-full md:w-3/4">
            <div className="ml-0 md:ml-60 mr-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
              {/* Header Section */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 border border-indigo-400/40 text-[11px] font-medium text-indigo-700 uppercase tracking-widest">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Section 4
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900">Deployment Details</h1>
                  <Briefcase className="h-6 w-6 text-indigo-600 hidden sm:block" />
                </div>
                <p className="mt-1 text-xs md:text-sm text-slate-600">Document the real-world application and field deployment of this technology.</p>
              </div>

              <Formik
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={(values, { resetForm }) => {
                  if (editingIndex !== null) {
                    const updated = [...deploymentEntries];
                    updated[editingIndex] = values;
                    setDeploymentEntries(updated);
                    setEditingIndex(null);
                    Swal.fire("Updated", "Client entry updated in the list.", "success");
                  } else {
                    setDeploymentEntries([...deploymentEntries, values]);
                    Swal.fire("Added", "Client entry added to the list.", "success");
                  }
                  resetForm();
                }}
              >
                {({ values, setValues, resetForm, errors, touched }) => (
                  <>
                    {/* Current Entries Dashboard */}
                    {deploymentEntries.length > 0 && (
                      <div className="mb-8 p-5 rounded-3xl border border-indigo-100 bg-white/70 backdrop-blur-md shadow-lg">
                        <h3 className="text-sm font-bold mb-4 flex items-center text-slate-800">
                          <MapPin className="w-4 h-4 mr-2 text-indigo-600" /> Existing Deployments ({deploymentEntries.length})
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {deploymentEntries.map((dep, idx) => (
                            <div key={idx} className={`group p-4 rounded-2xl flex justify-between items-center border transition-all ${editingIndex === idx ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-100' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'}`}>
                              <div>
                                <h4 className="font-bold text-slate-900">{idx + 1}. {dep.clientName}</h4>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Globe size={12}/> {dep.city}, {dep.country?.label}</p>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button type="button" onClick={() => handleEdit(dep, idx, setValues)} className="p-2 text-amber-600 hover:bg-amber-100 rounded-xl"><Edit3 size={18}/></button>
                                <button type="button" onClick={() => handleRemove(idx)} className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl"><Trash2 size={18}/></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Main Form Card */}
                    <Form className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Technology Reference</label>
                          <input className="w-full mt-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-600" value={technologyRefNo} readOnly />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 ml-1">Client / Agency Name *</label>
                          <Field name="clientName" placeholder="e.g. Municipal Corporation" className={`w-full mt-1.5 p-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${errors.clientName && touched.clientName ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                          <ErrorMessage name="clientName" component="div" className="text-red-500 text-[10px] mt-1 ml-1" />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 ml-1">Location (City) *</label>
                          <Field name="city" placeholder="City name" className="w-full mt-1.5 p-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 ml-1">Office Address *</label>
                          <Field name="clientAddress" as="textarea" rows="2" className="w-full mt-1.5 p-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 ml-1">Country *</label>
                          <Field name="country" component={CustomSelect} options={countryOptions} isMulti={false} className="mt-1.5" />
                          <ErrorMessage name="country" component="div" className="text-red-500 text-[10px] mt-1 ml-1" />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 ml-1">Nodal Officer Details *</label>
                          <Field name="nodalContactPerson" placeholder="Name, Designation, Email" className="w-full mt-1.5 p-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 ml-1">Deployment Technical Details *</label>
                          <Field name="deploymentDetails" as="textarea" rows="4" placeholder="Specifics of setup, capacity, or results..." className="w-full mt-1.5 p-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-4 border-t">
                        <button type="submit" className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-white text-sm font-semibold shadow-lg transition-all ${editingIndex !== null ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}>
                          <PlusCircle size={18} /> {editingIndex !== null ? "Update Record" : "Add to Deployment List"}
                        </button>
                        <button type="button" onClick={() => { resetForm(); setEditingIndex(null); }} className="rounded-full bg-slate-100 px-6 py-2.5 text-slate-600 text-sm font-semibold hover:bg-slate-200">Cancel / Reset</button>
                      </div>
                    </Form>
                  </>
                )}
              </Formik>

              {/* Final Actions Navigation */}
              <div className="mt-10 pt-6 border-t border-slate-300 flex flex-wrap justify-between items-center gap-4">
                <button onClick={() => navigate("/sectionThree", { state: { technologyRefNo } })} className="inline-flex items-center gap-2 rounded-full bg-slate-600 px-6 py-3 text-white text-sm font-semibold hover:bg-slate-700 transition-all">
                  <ArrowLeft size={18} /> Back to Section 3
                </button>
                <div className="flex gap-3">
                  <button onClick={handleSaveAll} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3 text-white text-sm font-semibold hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all" disabled={editingIndex !== null}>
                    <SaveAll size={18} /> Save Progress
                  </button>
                  <button onClick={() => setIsPreviewOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-white text-sm font-semibold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all" disabled={editingIndex !== null}>
                    <Eye size={18} /> Review & Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Info Panel */}
          <div className="hidden lg:flex md:w-1/4 items-start justify-center pr-8 py-10">
            <div className="w-full max-w-xs rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl px-6 py-8 space-y-6 sticky top-10">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">Guide</p>
                  <p className="text-sm font-bold text-slate-800">Deployment</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">Logging field deployments demonstrates the technology's maturity (TRL) and practical viability to stakeholders.</p>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 font-bold text-[10px]">1</div>
                  <p className="text-[11px] text-slate-500">Fill client details and technical specs.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 font-bold text-[10px]">2</div>
                  <p className="text-[11px] text-slate-500">Add them to the temporary list.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 font-bold text-[10px]">3</div>
                  <p className="text-[11px] text-slate-500">Click <b>Save Progress</b> before final review.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewPopup isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} technologyRefNo={technologyRefNo} navigate={navigate} />
      <FooterBar />
    </>
  );
};

export default SectionFour;