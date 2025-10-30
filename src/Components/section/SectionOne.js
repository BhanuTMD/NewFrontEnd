import axios from "axios";
import Section from "Components/common/section";
import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";
import { Formik, Field, Form, ErrorMessage } from "formik";
import CustomSelect from "../utils/CustomSelect"; // Assuming CustomSelect is fixed
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// --- UPDATED IMPORTS ---
import { industrialSectorOptions } from "Components/data/industrialSector"; // Assuming file is named industrialSector.js
import { potentialMinistryOptions } from "Components/data/potentialMinistries"; // Assuming file is named potentialMinistries.js
import { themeOptions } from "Components/data/theme"; // Assuming file is named theme.js
import { labOptions } from "Components/data/lab"; // Assuming file is named lab.js
import { potentialApplicationAreaOptions } from "Components/data/potentialApplicationAreas"; // Assuming file is named potentialApplicationAreas.js
// --- END UPDATED IMPORTS ---

import FileViewerModal from "Components/pages/view/FileViewerModal"; // Ensure path is correct

const SectionOne = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedTRN = location.state?.technologyRefNo || "";

  const [generatedRefNo, setGeneratedRefNo] = useState(passedTRN);
  const [loading, setLoading] = useState(!!passedTRN);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToView, setFileToView] = useState('');
  const [existingFileUrl, setExistingFileUrl] = useState('');
  const [isFileRemoved, setIsFileRemoved] = useState(false);

  const [initialValues, setInitialValues] = useState({
    id: null,
    technologyRefNo: "",
    keywordTechnology: "", // Comma-separated string
    nameTechnology: "",
    industrialSector: [], // Array of {value, label}
    theme: [],           // Array of {value, label}
    multiLabInstitute: "No",
    leadLaboratory: null, // Single {value, label} or null
    lab: [],              // Array of {value, label}
    technologyLevel: "",
    scaleDevelopment: "",
    yearDevelopment: "",
    briefTech: "",
    competitivePosition: "",
    technoEconomics: "",
    potentialApplicationAreas: [], // Array of {value, label}
    potentialMinistries: [],       // Array of {value, label}
    environmentalStatutory: "",
    marketPotential: "",
    file: null, // For new file uploads
    laboratoryDetail: "",
  });

  // Fetch data if editing
  useEffect(() => {
    if (passedTRN) {
      setLoading(true);
      const token = localStorage.getItem("token");
      axios
        .get(`http://172.16.2.246:8080/api/section-one/${passedTRN}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const fetchedData = res.data;
          // Format fetched data for Formik state
          const formattedValues = {
            ...fetchedData,
            // Convert simple strings/arrays from backend to {value, label} objects/arrays for react-select
            leadLaboratory: labOptions.find(opt => opt.value === fetchedData.leadLaboratory) || null,
            // Ensure fetched data for arrays is treated as an array before filtering
            industrialSector: industrialSectorOptions.filter(opt => (Array.isArray(fetchedData.industrialSector) ? fetchedData.industrialSector : []).includes(opt.value)),
            theme: themeOptions.filter(opt => (Array.isArray(fetchedData.theme) ? fetchedData.theme : []).includes(opt.value)),
            lab: labOptions.filter(opt => (Array.isArray(fetchedData.lab) ? fetchedData.lab : []).includes(opt.value)),
            potentialApplicationAreas: potentialApplicationAreaOptions.filter(opt => (Array.isArray(fetchedData.potentialApplicationAreas) ? fetchedData.potentialApplicationAreas : []).includes(opt.value)),
            potentialMinistries: potentialMinistryOptions.filter(opt => (Array.isArray(fetchedData.potentialMinistries) ? fetchedData.potentialMinistries : []).includes(opt.value)),
            multiLabInstitute: fetchedData.multiLabInstitute === "Yes" || fetchedData.multiLabInstitute === true ? "Yes" : "No",
            // Keep fetched keywords as string, DTO handles conversion
            keywordTechnology: fetchedData.keywordTechnology || "",
            // Convert year/TRL back to string for input fields if needed
            yearDevelopment: fetchedData.yearDevelopment ? String(fetchedData.yearDevelopment) : "",
            technologyLevel: fetchedData.technologyLevel ? String(fetchedData.technologyLevel) : "",
            file: null, // File input should remain null on load
          };
          setInitialValues(formattedValues);
          setGeneratedRefNo(passedTRN);
          setExistingFileUrl(fetchedData.fileUrl || '');
          setIsFileRemoved(false);
        })
        .catch((err) => {
          console.error("Error fetching section one data", err);
          Swal.fire("Error", "Could not fetch existing data.", "error");
          navigate('/ViewTechnology'); // Navigate back on error
        })
        .finally(() => setLoading(false));
    } else {
      // Reset to default empty state when not editing
      setInitialValues({
        id: null, technologyRefNo: "", keywordTechnology: "", nameTechnology: "",
        industrialSector: [], theme: [], multiLabInstitute: "No", leadLaboratory: null,
        lab: [], technologyLevel: "", scaleDevelopment: "", yearDevelopment: "",
        briefTech: "", competitivePosition: "", technoEconomics: "", potentialApplicationAreas: [],
        potentialMinistries: [], environmentalStatutory: "", marketPotential: "",
        file: null, laboratoryDetail: "",
      });
      setGeneratedRefNo('');
      setExistingFileUrl('');
      setIsFileRemoved(false);
      setLoading(false);
    }
  }, [passedTRN, navigate]);

  // Validation schema expects objects for react-select fields
  const validationSchema = Yup.object({
    nameTechnology: Yup.string().required("Required").max(500, "Max 500 chars"),
    keywordTechnology: Yup.string().required("Required").max(200, "Max 200 chars"),
    leadLaboratory: Yup.object().shape({ // Validate the structure if leadLaboratory is an object
        value: Yup.string().required(),
        label: Yup.string().required(),
    }).nullable().required("Lead Laboratory is required"), // Expects object
    theme: Yup.array().of(Yup.object().shape({ // Validate array of objects
        value: Yup.string().required(),
        label: Yup.string().required(),
    })).min(1, "Select at least one theme").required("Theme is required"),
    multiLabInstitute: Yup.string().required("Please select Yes or No"),
    lab: Yup.array().of(Yup.object().shape({ // Validate array of objects
        value: Yup.string().required(),
        label: Yup.string().required(),
    })).when("multiLabInstitute", {
      is: "Yes",
      then: (schema) => schema.min(1, "Select associated labs if 'Yes'"),
      otherwise: (schema) => schema.notRequired(),
    }),
    technologyLevel: Yup.string().required("TRL is required"), // Keep as string for select
    yearDevelopment: Yup.string().required("Year is required").matches(/^[0-9]{4}$/, "Enter a valid 4-digit year"), // Keep as string for input
    briefTech: Yup.string().required("Brief details are required").max(1000, "Max 1000 chars"),
    laboratoryDetail: Yup.string().required("Lab details are required").max(300, "Max 300 chars"),
    scaleDevelopment: Yup.string().max(250, "Max 250 chars").nullable(),
    competitivePosition: Yup.string().max(1500, "Max 1500 chars").nullable(),
    technoEconomics: Yup.string().max(1500, "Max 1500 chars").nullable(),
    marketPotential: Yup.string().max(1000, "Max 1000 chars").nullable(),
    environmentalStatutory: Yup.string().max(300, "Max 300 chars").nullable(),
    potentialApplicationAreas: Yup.array().of(Yup.object().shape({ // Validate array of objects
        value: Yup.string().required(),
        label: Yup.string().required(),
    })).nullable(),
    potentialMinistries: Yup.array().of(Yup.object().shape({ // Validate array of objects
        value: Yup.string().required(),
        label: Yup.string().required(),
    })).nullable(),
    industrialSector: Yup.array().of(Yup.object().shape({ // Validate array of objects
        value: Yup.string().required(),
        label: Yup.string().required(),
    })).nullable(),
    // File validation can be tricky with Yup, often done separately in onChange
  });

  // --- File Handlers ---
  const handleViewFile = () => {
    if (existingFileUrl) {
      // Use the correct view URL structure from your backend
      const viewUrl = existingFileUrl.replace('/download/', '/view/'); // Adjust if needed
      console.log("Attempting to view file at URL:", viewUrl); // Log the URL
      setFileToView(viewUrl);
      setIsModalOpen(true);
    } else {
        console.warn("handleViewFile called but existingFileUrl is empty.");
        Swal.fire("Info", "No file available to view.", "info"); // Use Swal instead of alert
    }
  };

  const handleRemoveFile = (setFieldValue) => {
    Swal.fire({ title: "Remove Existing File?", text: "This will mark the file for removal upon saving. Upload a new file if needed.", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Yes, remove it" })
      .then((result) => {
        if (result.isConfirmed) {
          setExistingFileUrl('');    // Clear the displayed URL
          setIsFileRemoved(true); // Set flag for backend
          setFieldValue('file', null); // Clear any newly selected file in Formik state
          console.log("Existing file marked for removal.");
        }
      });
  };
  // ---

  // Submit Handler extracts '.value' before sending
  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form values on submit:", JSON.stringify(values, null, 2)); // Log all values

    Swal.fire({ title: "Confirm Submission?", text: passedTRN ? "Update this technology?" : "Submit this new technology?", icon: "question", showCancelButton: true, confirmButtonColor: "#3085d6", cancelButtonColor: "#d33", confirmButtonText: "Yes, Submit!" })
      .then((result) => {
        if (result.isConfirmed) {
          const formData = new FormData();

          console.log("--- Preparing FormData ---"); // Log FormData creation start

          // Prepare FormData, extracting .value from objects/arrays
          Object.keys(values).forEach(key => {
            const value = values[key];

            // Log current key and value being processed
            console.log(`Processing key: ${key}, value:`, value);

            if (key === 'file' && value instanceof File) {
              formData.append('file', value);
              console.log(`Appended file: ${value.name}`);
            } else if (key === 'leadLaboratory') {
              // Handle both object (from react-select) and potentially string (if loaded differently)
              if (value && typeof value === 'object' && value.value) {
                  formData.append(key, value.value);
                  console.log(`Appended ${key}: ${value.value}`);
              } else if (typeof value === 'string' && value) { // Fallback if it's already a string
                  formData.append(key, value);
                   console.log(`Appended ${key} (as string): ${value}`);
              } else {
                   console.log(`Skipped ${key} (null or invalid object)`);
              }
            } else if (['industrialSector', 'theme', 'lab', 'potentialApplicationAreas', 'potentialMinistries'].includes(key)) {
                // Ensure value is an array before iterating
                if (Array.isArray(value)) {
                    console.log(`Processing array key: ${key}`);
                    value.forEach((item, index) => {
                        // Log each item in the array
                        console.log(` -> Item ${index}:`, item);
                        if (item && typeof item === 'object' && item.value !== undefined && item.value !== null) {
                            formData.append(key, item.value);
                            console.log(`   Appended ${key}: ${item.value}`);
                        } else {
                             console.log(`   Skipped item ${index} in ${key} (null, not object, or missing value)`);
                        }
                    });
                } else {
                     console.log(`Skipped key ${key} (not an array):`, value);
                }
            }
             // Append simple values (string, number, boolean), exclude null/undefined and file object
             else if (value !== null && value !== undefined && typeof value !== 'object' && key !== 'file') {
                 formData.append(key, value);
                 console.log(`Appended ${key}: ${value}`);
            }
            // Handle specific simple object cases if necessary (e.g., date objects, though usually sent as strings)
            // else if (value instanceof Date) {
            //    formData.append(key, value.toISOString()); // Example: send date as ISO string
            //    console.log(`Appended ${key} (Date as ISO): ${value.toISOString()}`);
            // }
            else {
                // Log skipped keys for clarity
                 if (key !== 'file' && !(Array.isArray(value) && ['industrialSector', 'theme', 'lab', 'potentialApplicationAreas', 'potentialMinistries'].includes(key))) { // Avoid double logging arrays
                     console.log(`Skipped key ${key} (type: ${typeof value}, value: ${JSON.stringify(value)})`);
                 }
            }
          });

          // Append ID only if it exists (for updates)
          if (values.id) {
              formData.append('id', values.id);
              console.log(`Appended id: ${values.id}`);
          }
          // Append flag to remove file if set
          if (isFileRemoved) {
              formData.append('removeExistingFile', 'true');
              console.log(`Appended removeExistingFile: true`);
          }

          console.log("--- FormData Prepared ---");
          // You can also iterate FormData entries for final verification (more complex)
           // for (let [key, val] of formData.entries()) {
           //     console.log(`FormData Entry: ${key} = `, val);
           // }


          const token = localStorage.getItem("token");
          const headers = {
              // Let browser set Content-Type for FormData
              // "Content-Type": "multipart/form-data", // REMOVE THIS LINE
              Authorization: `Bearer ${token}`
            };

          let requestPromise;
          const isUpdate = !!passedTRN;

          if (isUpdate) { // UPDATE
            const updateUrl = `http://172.16.2.246:8080/api/section-one/update/${passedTRN}`;
            console.log("Sending PUT request to:", updateUrl);
            requestPromise = axios.put(updateUrl, formData, { headers });
          } else { // CREATE
            const createUrl = "http://172.16.2.246:8080/api/section-one/create";
            console.log("Sending POST request to:", createUrl);
            requestPromise = axios.post(createUrl, formData, { headers });
          }

          requestPromise
            .then((res) => {
              const techRef = res.data.technologyRefNo;
              setGeneratedRefNo(techRef); // Update state if needed
              Swal.fire("Success!", `Technology ${isUpdate ? 'updated' : 'saved'}! TRN: ${techRef}`, "success");
              console.log("API call successful, navigating to Section Two.");
              navigate("/sectionTwo", { state: { technologyRefNo: techRef } });
            })
            .catch((err) => {
              console.error("API Submission error:", err.response?.data || err.message, err); // Log more details
              Swal.fire("Error!", err.response?.data?.message || `Failed to ${isUpdate ? 'update' : 'submit'}. Please check console for details.`, "error");
            })
            .finally(() => {
                console.log("API call finished.");
                setSubmitting(false);
            });
        } else {
          // User cancelled Swal confirmation
          console.log("User cancelled submission.");
          setSubmitting(false);
        }
      });
  };


  if (loading && passedTRN) {
      return <p className="text-center mt-6 text-gray-600">Loading existing data...</p>;
  }


  return (
    <>
      <NavBar />
      <div className="flex">
        <div className="bg-gray-800"></div> {/* Sidebar Placeholder */}
        <div className="flex-1 p-8 bg-blue-100 border">
          <Section sectionLine="Section 1 : Key Details of the Technology / Knowhow " />
          <Formik
            enableReinitialize // Essential
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting, errors, touched }) => (
              <Form className="bg-white p-6 rounded-lg shadow-md">

                {/* --- Technology Ref No (Full Width) --- */}
                <div className="form-group mb-6">
                  <label className="font-bold block mb-1 text-gray-700">Technology Ref No:</label>
                  <input type="text" value={generatedRefNo || "Will be generated after submission"} readOnly className="w-full p-2 text-lg rounded-md bg-gray-100 text-gray-600 cursor-not-allowed border border-gray-300"/>
                </div>

                {/* --- START: 2-COLUMN GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                  {/* --- Name of Technology (Spans 2 Cols) --- */}
                  <div className="form-group md:col-span-2">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="nameTechnology">Name of Technology <span className="text-red-500">*</span><span className="block text-sm font-normal text-gray-500">Max. 500 Chars</span></label>
                    <Field name="nameTechnology" as="textarea" rows="3" className={`w-full p-2 text-lg rounded-md border ${errors.nameTechnology && touched.nameTechnology ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}/>
                    <ErrorMessage name="nameTechnology" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                                    {/* --- Keywords (Spans 2 Cols) --- */}
                  <div className="form-group md:col-span-2">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="keywordTechnology">Keywords <span className="text-red-500">*</span><span className="block text-sm font-normal text-gray-500">(Comma-separated, 5-8 words, Max 200 Chars)</span></label>
                    <Field type="text" name="keywordTechnology" maxLength="200" className={`w-full p-2 text-lg rounded-md border ${errors.keywordTechnology && touched.keywordTechnology ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}/>
                    <ErrorMessage name="keywordTechnology" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Industrial Sector --- */}
                  <div className="form-group">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="industrialSector">Industrial Sector(s)</label>
                    <Field name="industrialSector" options={industrialSectorOptions} component={CustomSelect} placeholder="Select Sector(s)..." isMulti={true}/>
                    <ErrorMessage name="industrialSector" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Theme --- */}
                  <div className="form-group">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="theme">Theme(s) <span className="text-red-500">*</span></label>
                    <Field name="theme" options={themeOptions} component={CustomSelect} placeholder="Select Theme(s)..." isMulti={true} className={`${errors.theme && touched.theme ? 'react-select-error' : ''}`}/>
                    <ErrorMessage name="theme" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Lead Laboratory --- */}
                  <div className="form-group">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="leadLaboratory">Lead Laboratory / Institute <span className="text-red-500">*</span></label>
                    <Field name="leadLaboratory" options={labOptions} component={CustomSelect} placeholder="Select Lead Lab..." className={`${errors.leadLaboratory && touched.leadLaboratory ? 'react-select-error' : ''}`}/>
                    <ErrorMessage name="leadLaboratory" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Multi Laboratories Radio --- */}
                  <div className="form-group border p-3 rounded-md bg-gray-50 h-full flex flex-col justify-center">
                    <label className="font-bold text-gray-700">Multi Laboratories Involved? <span className="text-red-500">*</span></label>
                    <div className="flex space-x-4 mt-2">
                      <label className="flex items-center cursor-pointer"><Field type="radio" name="multiLabInstitute" value="Yes" className="mr-2 h-4 w-4"/> Yes</label>
                      <label className="flex items-center cursor-pointer"><Field type="radio" name="multiLabInstitute" value="No" className="mr-2 h-4 w-4"/> No</label>
                    </div>
                    <ErrorMessage name="multiLabInstitute" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Conditional Lab Selection (Spans 2) --- */}
                  {values.multiLabInstitute === "Yes" && (
                    <div className="form-group md:col-span-2 pl-4 border-l-4 border-indigo-200">
                      <label className="font-bold block mb-1 text-gray-700" htmlFor="lab">Specify Associated Labs <span className="text-red-500">*</span></label>
                      <Field name="lab" options={labOptions} component={CustomSelect} placeholder="Select Associated Lab(s)..." isMulti={true} className={`${errors.lab && touched.lab ? 'react-select-error' : ''}`}/>
                      <ErrorMessage name="lab" component="div" className="text-red-500 text-sm mt-1"/>
                    </div>
                  )}

                  {/* --- TRL --- */}
                  <div className="form-group">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="technologyLevel">TRL <span className="text-red-500">*</span></label>
                    <Field as="select" name="technologyLevel" className={`w-full p-2 text-lg rounded-md border ${errors.technologyLevel && touched.technologyLevel ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none bg-white`}>
                      <option value="" label="Select TRL (1-9)" />
                      {[...Array(9).keys()].map(i => (<option key={i + 1} value={String(i + 1)}>{i + 1}</option>))} {/* Ensure value is string */}
                    </Field>
                    <ErrorMessage name="technologyLevel" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Year of Development --- */}
                  <div className="form-group">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="yearDevelopment">Year of Development <span className="text-red-500">*</span><span className="block text-sm font-normal text-gray-500">YYYY</span></label>
                    <Field type="text" name="yearDevelopment" maxLength="4" className={`w-full p-2 text-lg rounded-md border ${errors.yearDevelopment && touched.yearDevelopment ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}/>
                    <ErrorMessage name="yearDevelopment" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Scale of Development (Spans 2) --- */}
                  <div className="form-group md:col-span-2">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="scaleDevelopment">Scale of Development <span className="block text-sm font-normal text-gray-500">Max. 250 Chars</span></label>
                    <Field name="scaleDevelopment" as="textarea" rows="2" maxLength="250" className={`w-full p-2 text-lg rounded-md border ${errors.scaleDevelopment && touched.scaleDevelopment ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}/>
                    <ErrorMessage name="scaleDevelopment" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Brief Details (Spans 2) --- */}
                  <div className="form-group md:col-span-2">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="briefTech">Brief Details <span className="text-red-500">*</span><span className="block text-sm font-normal text-gray-500">Max. 1000 Chars</span></label>
                    <Field name="briefTech" as="textarea" rows="4" maxLength="1000" className={`w-full p-2 text-lg rounded-md border ${errors.briefTech && touched.briefTech ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}/>
                    <ErrorMessage name="briefTech" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Competitive Positioning (Spans 2) --- */}
                  <div className="form-group md:col-span-2">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="competitivePosition">Competitive Positioning <span className="block text-sm font-normal text-gray-500">Max. 1500 Chars</span></label>
                    <Field name="competitivePosition" as="textarea" rows="4" maxLength="1500" className={`w-full p-2 text-lg rounded-md border ${errors.competitivePosition && touched.competitivePosition ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}/>
                    <ErrorMessage name="competitivePosition" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Techno-economics (Spans 2) --- */}
                  <div className="form-group md:col-span-2">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="technoEconomics">Techno-economics <span className="block text-sm font-normal text-gray-500">Max. 1500 Chars</span></label>
                    <Field name="technoEconomics" as="textarea" rows="4" maxLength="1500" className={`w-full p-2 text-lg rounded-md border ${errors.technoEconomics && touched.technoEconomics ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}/>
                    <ErrorMessage name="technoEconomics" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Potential Application Areas --- */}
                  <div className="form-group">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="potentialApplicationAreas">Potential Application Area(s)</label>
                    <Field name="potentialApplicationAreas" options={potentialApplicationAreaOptions} component={CustomSelect} placeholder="Select Area(s)..." isMulti={true}/>
                    <ErrorMessage name="potentialApplicationAreas" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Potential Ministries --- */}
                  <div className="form-group">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="potentialMinistries">Potential Ministries</label>
                    <Field name="potentialMinistries" options={potentialMinistryOptions} component={CustomSelect} placeholder="Select Ministries..." isMulti={true}/>
                    <ErrorMessage name="potentialMinistries" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Environmental / Statutory (Spans 2) --- */}
                  <div className="form-group md:col-span-2">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="environmentalStatutory">Environmental / Statutory Compliance <span className="block text-sm font-normal text-gray-500">Max. 300 Chars</span></label>
                    <Field name="environmentalStatutory" as="textarea" rows="3" maxLength="300" className={`w-full p-2 text-lg rounded-md border ${errors.environmentalStatutory && touched.environmentalStatutory ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}/>
                    <ErrorMessage name="environmentalStatutory" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Market Potential (Spans 2) --- */}
                  <div className="form-group md:col-span-2">
                    <label className="font-bold block mb-1 text-gray-700" htmlFor="marketPotential">Market Potential <span className="block text-sm font-normal text-gray-500">Max. 1000 Chars</span></label>
                    <Field name="marketPotential" as="textarea" rows="4" maxLength="1000" className={`w-full p-2 text-lg rounded-md border ${errors.marketPotential && touched.marketPotential ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}/>
                    <ErrorMessage name="marketPotential" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- File Upload Section (Spans 2) --- */}
                  <div className="form-group p-4 border border-dashed border-gray-400 rounded-md bg-gray-50 md:col-span-2">
                    <label className="font-bold block mb-2 text-gray-700" htmlFor="file">Upload File (Optional)<span className="block text-sm font-normal text-gray-500">Image/PDF (Max 10MB)</span></label>
                    {passedTRN && existingFileUrl && !isFileRemoved && (
                      <div className="mb-3 flex gap-3 items-center">
                        <button type="button" onClick={handleViewFile} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">View Current</button>
                        <button type="button" onClick={() => handleRemoveFile(setFieldValue)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Remove Current</button>
                        <span className="text-xs text-gray-600">(Will be replaced if you upload new)</span>
                      </div>
                    )}
                    {isFileRemoved && (<p className="text-sm text-orange-600 mb-2">Existing file marked for removal.</p>)}
                    <input id="file" type="file" name="file" accept=".jpg,.jpeg,.png,.pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      onChange={(event) => { /* File validation and setFieldValue logic */
                        const file = event.currentTarget.files[0];
                        const maxSize = 10 * 1024 * 1024; const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
                        if (file) {
                          if (!allowedTypes.includes(file.type)) { Swal.fire("Invalid Type", "Only JPG, PNG, PDF allowed.", "error"); event.target.value = null; setFieldValue("file", null); return; }
                          if (file.size > maxSize) { Swal.fire("File Too Large", "Max 10MB allowed.", "error"); event.target.value = null; setFieldValue("file", null); return; }
                          setFieldValue("file", file); if (isFileRemoved) setIsFileRemoved(false); // Unmark removal if new file selected
                        } else { setFieldValue("file", null); }
                      }}
                    />
                    {values.file && ( /* Preview for NEWLY selected file */
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700">New file selected: {values.file.name}</p>
                        {values.file.type.startsWith("image/") && (<img src={URL.createObjectURL(values.file)} alt="Preview" className="mt-2 max-h-40 rounded border"/>)}
                      </div>
                    )}
                    <ErrorMessage name="file" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                  {/* --- Laboratory Contact Details (Spans 2) --- */}
                  <div className="form-group md:col-span-2">
                      <label className="font-bold block mb-1 text-gray-700" htmlFor="laboratoryDetail">Lab Contact Details <span className="text-red-500">*</span><span className="block text-sm font-normal text-gray-500">Max. 300 Chars</span></label>
                      <Field name="laboratoryDetail" as="textarea" rows="3" maxLength="300" className={`w-full p-2 text-lg rounded-md border ${errors.laboratoryDetail && touched.laboratoryDetail ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}/>
                      <ErrorMessage name="laboratoryDetail" component="div" className="text-red-500 text-sm mt-1"/>
                  </div>

                </div>
                {/* --- END: 2-COLUMN GRID --- */}

                {/* --- Buttons (Full Width) --- */}
                <div className="flex justify-center items-center gap-4 pt-6 border-t mt-6">
                  <button type="submit" className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-semibold" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : (passedTRN ? "Update & Save Section 1" : "Save & Continue to Section 2")}
                  </button>
                  {generatedRefNo && ( // Show Next only if TRN exists
                    <button type="button" className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-semibold" onClick={() => navigate("/sectionTwo", { state: { technologyRefNo: generatedRefNo } })}>
                      Go to Section 2 →
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <FooterBar />

      {/* --- File Viewer Modal --- */}
      <FileViewerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fileUrl={fileToView}/>
    </>
  );
};

export default SectionOne;