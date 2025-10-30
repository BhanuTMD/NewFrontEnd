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
// Added directly inside SectionFour.js due to single-file constraint
const ReviewPopup = ({ isOpen, onClose, technologyRefNo, navigate }) => {
  const [sectionOneData, setSectionOneData] = useState(null);
  const [sectionTwoData, setSectionTwoData] = useState(null);
  const [sectionThreeData, setSectionThreeData] = useState([]); // Expecting array
  const [sectionFourData, setSectionFourData] = useState([]); // Expecting array
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null); // Renamed state for clarity

  useEffect(() => {
    if (isOpen && technologyRefNo) {
      const fetchData = async () => {
        setIsLoading(true);
        setFetchError(null); // Clear previous errors
        // Clear previous data before fetching new data
        setSectionOneData(null);
        setSectionTwoData(null);
        setSectionThreeData([]);
        setSectionFourData([]);

        try {
          // Fetch all sections concurrently
          const [res1, res2, res3, res4] = await Promise.all([
            axios.get(`http://172.16.2.246:8080/api/section-one/${technologyRefNo}`).catch(err => ({ error: err, data: null })), // Handle errors individually
            axios.get(`http://172.16.2.246:8080/api/section-two/${technologyRefNo}`).catch(err => ({ error: err, data: null })), // Default to null on error
            axios.get(`http://172.16.2.246:8080/api/section-three/${technologyRefNo}`).catch(err => ({ error: err, data: [] })), // Default to empty array
            axios.get(`http://172.16.2.246:8080/api/section-four/${technologyRefNo}`).catch(err => ({ error: err, data: [] })), // Default to empty array
          ]);

          // Process responses, only setting data if fetch was successful
          if (res1 && !res1.error) setSectionOneData(res1.data); else console.error("Error fetching Section 1:", res1?.error?.response?.data || res1?.error?.message);
          if (res2 && !res2.error) setSectionTwoData(res2.data); else console.error("Error fetching Section 2:", res2?.error?.response?.data || res2?.error?.message);
          if (res3 && !res3.error) setSectionThreeData(res3.data || []); else console.error("Error fetching Section 3:", res3?.error?.response?.data || res3?.error?.message);
          if (res4 && !res4.error) setSectionFourData(res4.data || []); else console.error("Error fetching Section 4:", res4?.error?.response?.data || res4?.error?.message);

          // Check if ALL fetches failed to show a general error
          if (res1?.error && res2?.error && res3?.error && res4?.error) {
             setFetchError("Failed to load any section data. Please try again.");
          } else if (res1?.error || res2?.error || res3?.error || res4?.error) {
             // Optionally log that some sections failed, but don't set a blocking error state
             console.warn("Some sections failed to load in the preview.");
          }

        } catch (err) {
          // Catch potential errors from Promise.all itself (though less likely with individual catches)
          console.error("Failed to fetch review data:", err);
          setFetchError("An unexpected error occurred while loading review data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
     // No else needed, data/error cleared on re-open or if no refNo outside useEffect trigger
  }, [isOpen, technologyRefNo]);

  const handleEditClick = (path) => {
    navigate(path, { state: { technologyRefNo } });
    onClose(); // Close the popup after navigating
  };


   // NEW: Handle Submit Button Click
  const handleSubmitTechnology = () => {
    Swal.fire({
      title: "Confirm Submission?",
      text: "Submit this technology? This will finalize all sections.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Submit!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Assuming a final submit API call (adjust URL as needed, e.g., to finalize the technology)
        // For now, simulate success since no specific endpoint is provided
        // If you have an endpoint like axios.post(`http://172.16.2.246:8080/api/finalize/${technologyRefNo}`)
        // Add it here, then on success show the message and redirect
        Swal.fire("Success!", "All sections submitted successfully!", "success").then(() => {
          navigate('/ViewTechnology'); // Redirect to home page (assuming /ViewTechnology is home)
        });
      }
    });
  };

  // Helper to safely display data
  const displayValue = (value) => {
    // Check for null or undefined first
    if (value === null || value === undefined) return <span className="text-gray-500 italic">N/A</span>;

    // Handle empty strings
    if (value === '') return <span className="text-gray-500 italic">N/A</span>;

    // Handle arrays (check if empty AFTER null/undefined check)
    if (Array.isArray(value)) {
        if (value.length === 0) return <span className="text-gray-500 italic">None</span>;
        // Attempt to extract label or value, fallback to item itself
        // Check if items are objects before trying to access properties
        return value.map(item => (typeof item === 'object' && item !== null) ? (item.label || item.value || JSON.stringify(item)) : String(item)).join(', ');
    }
    // Handle objects with label/value (like react-select)
    if (typeof value === 'object' && value !== null && (value.label || value.value)) {
       return String(value.label || value.value); // Prefer label, fallback to value
    }
     // Handle plain objects (display placeholder or JSON string if needed, currently N/A)
     if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
         // Special handling for leadLaboratory if it's fetched as an object but needs label extraction
         if (value.leadLaboratory && typeof value.leadLaboratory === 'object' && value.leadLaboratory.label) {
             return value.leadLaboratory.label;
         }
         return <span className="text-gray-500 italic">[Object Data]</span>; // Or JSON.stringify(value) if appropriate
     }
    // Handle booleans
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    // Handle dates
    if (value instanceof Date) return value.toLocaleDateString();
     // Handle date strings (attempt to format)
     if (typeof value === 'string' && !isNaN(Date.parse(value))) {
        const date = new Date(value);
        // Basic check if it's a valid date string before formatting
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString();
        }
     }
    // Handle numbers and anything else convertable to string
    return String(value);
  };


  // Helper to format currency
  const formatCurrency = (value) => {
      const num = parseFloat(value);
      return isNaN(num) ? <span className="text-gray-500 italic">N/A</span> : `₹ ${num.toFixed(2)}`;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">Review Technology Details (TRN: {technologyRefNo})</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-semibold">&times;</button>
        </div>

        <div className="p-6">
          {isLoading && <p className="text-center text-blue-600 font-semibold py-4">Loading review data...</p>}
          {fetchError && <p className="text-center text-red-600 bg-red-100 p-3 rounded border border-red-300">{fetchError}</p>}

          {!isLoading && !fetchError && (
            <div className="space-y-6">
              {/* --- Section 1 Summary (EXPANDED) --- */}
              {sectionOneData ? (
                 <div className="border rounded p-4 bg-gray-50 shadow-sm">
                   <div className="flex justify-between items-center mb-3 border-b pb-2">
                     <h4 className="text-lg font-semibold text-indigo-700">Section 1: Key Details</h4>
                     <button onClick={() => handleEditClick('/sectionOne')} className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded shadow transition duration-150 ease-in-out">Edit</button>
                   </div>
                   {/* Expanded display using dl grid */}
                   <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div className="md:col-span-2"><dt className="font-medium text-gray-600">Name of Technology:</dt><dd className="mt-1 text-gray-800">{displayValue(sectionOneData.nameTechnology)}</dd></div>
                      <div className="md:col-span-2"><dt className="font-medium text-gray-600">Keywords:</dt><dd className="mt-1 text-gray-800">{displayValue(sectionOneData.keywordTechnology)}</dd></div>
                      <div><dt className="font-medium text-gray-600">Industrial Sector(s):</dt><dd className="mt-1 text-gray-800">{displayValue(sectionOneData.industrialSector)}</dd></div>
                      <div><dt className="font-medium text-gray-600">Theme(s):</dt><dd className="mt-1 text-gray-800">{displayValue(sectionOneData.theme)}</dd></div>
                      <div><dt className="font-medium text-gray-600">Lead Laboratory:</dt><dd className="mt-1 text-gray-800">{displayValue(sectionOneData.leadLaboratory)}</dd></div>
                      <div><dt className="font-medium text-gray-600">Multi-Lab Involved:</dt><dd className="mt-1 text-gray-800">{displayValue(sectionOneData.multiLabInstitute)}</dd></div>
                      {sectionOneData.multiLabInstitute === 'Yes' && <div><dt className="font-medium text-gray-600">Associated Labs:</dt><dd className="mt-1 text-gray-800">{displayValue(sectionOneData.lab)}</dd></div>}
                      <div><dt className="font-medium text-gray-600">TRL:</dt><dd className="mt-1 text-gray-800">{displayValue(sectionOneData.technologyLevel)}</dd></div>
                      <div><dt className="font-medium text-gray-600">Scale of Development:</dt><dd className="mt-1 text-gray-800">{displayValue(sectionOneData.scaleDevelopment)}</dd></div>
                      <div><dt className="font-medium text-gray-600">Year of Development:</dt><dd className="mt-1 text-gray-800">{displayValue(sectionOneData.yearDevelopment)}</dd></div>
                      <div className="md:col-span-2"><dt className="font-medium text-gray-600">Brief Details:</dt><dd className="mt-1 text-gray-800 whitespace-pre-wrap">{displayValue(sectionOneData.briefTech)}</dd></div>
                      <div className="md:col-span-2"><dt className="font-medium text-gray-600">Competitive Positioning:</dt><dd className="mt-1 text-gray-800 whitespace-pre-wrap">{displayValue(sectionOneData.competitivePosition)}</dd></div>
                      <div className="md:col-span-2"><dt className="font-medium text-gray-600">Techno-economics:</dt><dd className="mt-1 text-gray-800 whitespace-pre-wrap">{displayValue(sectionOneData.technoEconomics)}</dd></div>
                      <div><dt className="font-medium text-gray-600">Potential Application Areas:</dt><dd className="mt-1 text-gray-800">{displayValue(sectionOneData.potentialApplicationAreas)}</dd></div>
                      <div><dt className="font-medium text-gray-600">Potential Ministries:</dt><dd className="mt-1 text-gray-800">{displayValue(sectionOneData.potentialMinistries)}</dd></div>
                      <div className="md:col-span-2"><dt className="font-medium text-gray-600">Environmental/Statutory Compliance:</dt><dd className="mt-1 text-gray-800 whitespace-pre-wrap">{displayValue(sectionOneData.environmentalStatutory)}</dd></div>
                      <div className="md:col-span-2"><dt className="font-medium text-gray-600">Market Potential:</dt><dd className="mt-1 text-gray-800 whitespace-pre-wrap">{displayValue(sectionOneData.marketPotential)}</dd></div>
                      <div className="md:col-span-2"><dt className="font-medium text-gray-600">Lab Contact Details:</dt><dd className="mt-1 text-gray-800 whitespace-pre-wrap">{displayValue(sectionOneData.laboratoryDetail)}</dd></div>
                       {/* File URL Display (Optional) */}
                       {sectionOneData.fileUrl && <div className="md:col-span-2"><dt className="font-medium text-gray-600">Uploaded File:</dt><dd className="mt-1 text-blue-600 hover:underline"><a href={sectionOneData.fileUrl} target="_blank" rel="noopener noreferrer">View File</a></dd></div>}
                   </dl>
                 </div>
              ) : !isLoading && <p className="text-sm text-center text-gray-500">(Section 1 data not available)</p>}

               {/* --- Section 2 Summary --- */}
              {sectionTwoData ? (
                 <div className="border rounded p-4 bg-gray-50 shadow-sm">
                   <div className="flex justify-between items-center mb-3 border-b pb-2">
                     <h4 className="text-lg font-semibold text-indigo-700">Section 2: Team Details</h4>
                     <button onClick={() => handleEditClick('/sectionTwo')} className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded shadow transition duration-150 ease-in-out">Edit</button>
                   </div>
                   <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        {/* Display relevant fields from sectionTwoData */}
                        <div className="md:col-span-2"><dt className="font-medium text-gray-600">Principal Investigator:</dt><dd className="mt-1 text-gray-800">{displayValue(sectionTwoData.principalInvestigatorName)}</dd></div>
                        <div><dt className="font-medium text-gray-600">Designation:</dt><dd className="mt-1 text-gray-800">{displayValue(sectionTwoData.designation)}</dd></div>
                        <div><dt className="font-medium text-gray-600">Group/Division:</dt><dd className="mt-1 text-gray-800">{displayValue(sectionTwoData.groupDivision)}</dd></div>
                        <div className="md:col-span-2"><dt className="font-medium text-gray-600">Institute/Lab:</dt><dd className="mt-1 text-gray-800">{displayValue(sectionTwoData.instituteLab)}</dd></div>
                        {/* Add more fields from Section 2 as needed */}
                   </dl>
                 </div>
              ) : !isLoading && <p className="text-sm text-center text-gray-500">(Section 2 data not available)</p>}

               {/* --- Section 3 Summary --- */}
              {sectionThreeData && sectionThreeData.length > 0 ? (
                 <div className="border rounded p-4 bg-gray-50 shadow-sm">
                   <div className="flex justify-between items-center mb-3 border-b pb-2">
                     <h4 className="text-lg font-semibold text-indigo-700">Section 3: Licensee Details ({sectionThreeData.length})</h4>
                     <button onClick={() => handleEditClick('/sectionThree')} className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded shadow transition duration-150 ease-in-out">Edit</button>
                   </div>
                   <ul className="space-y-3">
                        {sectionThreeData.map((lic, idx) => (
                           <li key={lic.id || `lic-${idx}`} className="text-sm border-b pb-2 last:border-b-0">
                              <span className="font-semibold">{idx + 1}. {lic.licenseName}</span>
                              <div className="pl-4 text-gray-700 grid grid-cols-2 gap-x-4">
                                <span>Type: {displayValue(lic.typeOfLicense)}</span>
                                <span>Signed: {displayValue(lic.dateOfAgreementSigning)}</span> {/* Directly use displayValue for Date */}
                                <span>Region: {displayValue(lic.staRegionalGeography)}</span>
                                <span>Total Fee: {formatCurrency(lic.totalLicenseFee)}</span>
                              </div>
                           </li>
                        ))}
                   </ul>
                 </div>
              ) : !isLoading && <p className="text-sm text-center text-gray-500">(No Section 3 Licensee data available)</p>}

               {/* --- Section 4 Summary --- */}
               {sectionFourData && sectionFourData.length > 0 ? (
                 <div className="border rounded p-4 bg-gray-50 shadow-sm">
                   <div className="flex justify-between items-center mb-3 border-b pb-2">
                     <h4 className="text-lg font-semibold text-indigo-700">Section 4: Deployment Details ({sectionFourData.length})</h4>
                     <button onClick={() => handleEditClick('/sectionFour')} className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded shadow transition duration-150 ease-in-out">Edit</button>
                   </div>
                    <ul className="space-y-3">
                        {sectionFourData.map((dep, idx) => (
                           <li key={dep.id || `dep-${idx}`} className="text-sm border-b pb-2 last:border-b-0">
                              <span className="font-semibold">{idx + 1}. {dep.clientName}</span>
                              <div className="pl-4 text-gray-700 grid grid-cols-2 gap-x-4">
                                  <span>Location: {dep.city}, {displayValue(countryOptions.find(opt => opt.value === dep.country))}</span>
                                  <span>Contact: {displayValue(dep.nodalContactPerson)}</span>
                                  <span className="col-span-2">Details: {displayValue(dep.deploymentDetails)}</span>
                              </div>
                           </li>
                        ))}
                   </ul>
                 </div>
               ) : !isLoading && <p className="text-sm text-center text-gray-500">(No Section 4 Deployment data available)</p>}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t px-6 py-4 bg-gray-50 text-right z-10">
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded shadow transition duration-150 ease-in-out">Close</button>
          <button onClick={handleSubmitTechnology}className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded shadow transition duration-150 ease-in-out font-semibold">Submit Technology</button>
        </div>
      </div>
    </div>
  );
};
// --- End Review Popup Component ---


// Define initial empty state for ONE Deployment entry in the form
const initialDeploymentFormValues = {
  id: null, // To track existing entries
  clientName: "",
  clientAddress: "",
  city: "",
  country: null, // Expecting single {value, label} object or null
  nodalContactPerson: "",
  deploymentDetails: "",
};

const SectionFour = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const technologyRefNo = location.state?.technologyRefNo || "";

  // State for the LIST of all Deployment entries for this technology
  const [deploymentEntries, setDeploymentEntries] = useState([]);
  const [loading, setLoading] = useState(!!technologyRefNo);
  const [editingIndex, setEditingIndex] = useState(null); // Index of the entry being edited
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // State for popup

  // Fetch existing Deployment data
  useEffect(() => {
    if (technologyRefNo) {
      setLoading(true);
      axios
        .get(`http://172.16.2.246:8080/api/section-four/${technologyRefNo}`)
        .then((response) => {
          // Format data for the list state
          const formattedData = response.data.map(deployment => ({
            ...deployment,
            // Convert country value string to {value, label} object
            country: countryOptions.find(opt => opt.value === deployment.country) || null,
          }));
          setDeploymentEntries(formattedData);
        })
        .catch((error) => {
          console.error("Error fetching SectionFour data:", error);
          if (error.response?.status === 404) {
              setDeploymentEntries([]); // Start fresh if no data exists
          } else {
              Swal.fire("Error", "Could not fetch existing deployment data.", "error");
          }
        })
        .finally(() => setLoading(false));
    } else {
        Swal.fire("Missing Reference", "Technology Reference Number not provided.", "error");
        navigate('/sectionOne'); // Fallback navigation
    }
  }, [technologyRefNo, navigate]);

  // Validation schema for the form fields
  const validationSchema = Yup.object({
    clientName: Yup.string().required("Required").max(300, "Max 300 chars"),
    clientAddress: Yup.string().required("Required").max(300, "Max 300 chars"),
    city: Yup.string().required("Required").max(100, "Max 100 chars"), // Reduced max length
    country: Yup.object().nullable().required("Country is required"), // Expects {value, label} object
    nodalContactPerson: Yup.string().required("Required").max(300, "Max 300 chars"),
    deploymentDetails: Yup.string().required("Required").max(500, "Max 500 chars"), // Increased max length
  });

   // Handle FINAL submit (Save All Deployments button)
   const handleSubmitAll = () => {
       return new Promise((resolve, reject) => { // Wrap in promise
           if (editingIndex !== null) {
               Swal.fire("Update Pending", "Finish editing before saving.", "warning");
               return reject(new Error("Update pending")); // Reject promise if editing
           }

           const payload = deploymentEntries.map(entry => ({
               ...entry,
               technologyRefNo: technologyRefNo,
               country: entry.country?.value || null,
           }));

           axios
               .post(`http://172.16.2.246:8080/api/section-four/save/${technologyRefNo}`, payload, {
                   headers: { "Content-Type": "application/json" },
               })
               .then((response) => {
                   // Only show success if not called from preview button, or make it less intrusive
                   // Swal.fire("Success!", "Deployment details saved successfully!", "success");
                   console.log("Section 4 saved successfully."); // Log instead of Swal
                   const formattedResponse = response.data.map(deployment => ({
                       ...deployment,
                       country: countryOptions.find(opt => opt.value === deployment.country) || null,
                   }));
                   setDeploymentEntries(formattedResponse);
                   setEditingIndex(null);
                   resolve(response.data); // Resolve promise on success
               })
               .catch((error) => {
                   console.error("Save error:", error.response?.data || error.message);
                   Swal.fire("Error!", error.response?.data?.message || "Saving Section 4 failed.", "error"); // Keep Swal for errors
                   reject(error); // Reject promise on error
               });
       });
   };

    // --- List Item Handlers ---

  // Load an existing entry into the form for editing
  const handleEditLoad = (deploymentToEdit, index, setValues) => {
      // Prevent editing multiple at once
      if (editingIndex !== null && editingIndex !== index) {
        Swal.fire("Action Required", "Please save or clear the current form before editing another item.", "warning");
        return;
      }
      setEditingIndex(index);
      // Set Formik values directly (includes id, country as object)
      setValues({ // Use setValues passed from Formik context
          id: deploymentToEdit.id || null,
          clientName: deploymentToEdit.clientName || "",
          clientAddress: deploymentToEdit.clientAddress || "",
          city: deploymentToEdit.city || "",
          country: deploymentToEdit.country || null, // Should be {value, label} object or null
          nodalContactPerson: deploymentToEdit.nodalContactPerson || "",
          deploymentDetails: deploymentToEdit.deploymentDetails || "",
      });
      Swal.fire("Editing", `Editing details for: ${deploymentToEdit.clientName || 'New Entry'}`, "info");
  };

  // Add new or update existing Deployment in the *local* list
  // This function is now the onSubmit handler for the Formik form
  const handleAddOrUpdateDeployment = async (values, { validateForm, resetForm }) => {
      // Validation is implicitly handled by Formik before calling onSubmit,
      // but an extra check doesn't hurt, especially if called programmatically elsewhere.
      const formErrors = await validateForm(values);
      if (Object.keys(formErrors).length > 0) {
          Swal.fire("Incomplete Form", "Please fill all required fields correctly.", "error");
          return;
      }

      const deploymentData = { ...values }; // Copy form values (includes id, country object)

      if (editingIndex !== null) { // Update existing in list
          const updatedEntries = [...deploymentEntries];
          updatedEntries[editingIndex] = deploymentData;
          setDeploymentEntries(updatedEntries);
          Swal.fire("Updated", "Details updated in the list. Click 'Save All Deployments'.", "success");
      } else { // Add new to list
          setDeploymentEntries((prev) => [...prev, deploymentData]);
          Swal.fire("Added", "Details added to the list. Click 'Save All Deployments'.", "success");
      }

      // Reset form
      resetForm({ values: initialDeploymentFormValues });
      setEditingIndex(null);
  };

    // Remove a Deployment entry from the list
  const handleRemoveDeployment = (indexToRemove, resetForm) => { // Pass resetForm
    const entryToRemove = deploymentEntries[indexToRemove];
    Swal.fire({
      title: "Are you sure?",
      text: `Remove entry for '${entryToRemove.clientName || 'New Entry'}'? Will be deleted on Save All.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setDeploymentEntries((prev) => prev.filter((_, i) => i !== indexToRemove));
        if (editingIndex === indexToRemove) {
          setEditingIndex(null); // Reset editing index
          resetForm({ values: initialDeploymentFormValues }); // Also reset form fields
        }
        Swal.fire("Removed!", "Removed from list. Click 'Save All Deployments' to finalize.", "info");
      }
    });
  };
  // --- End List Item Handlers ---

  // Navigation Handler
  const handlePrevious = () => {
    navigate("/sectionThree", { state: { technologyRefNo: technologyRefNo } });
  };

  // --- Handle opening the preview popup ---
  // --- UPDATED: Removed save call ---
  const handlePreviewOpen = () => {
      if (editingIndex !== null) {
          Swal.fire("Update Pending", "Finish editing the current entry before previewing.", "warning");
          return;
      }
       // Directly open the popup
      setIsPreviewOpen(true);
  };
  // --- END UPDATE ---


  if (loading) {
      return <p className="text-center mt-6">Loading deployment data...</p>;
  }


  return (
    <>
      <NavBar />
      <div className="flex bg-blue-100 min-h-screen">
        <div className="flex-1 p-8">
          <Section sectionLine="Section 4 : Deployment Details " />

          {/* Formik wraps both the list display and the form now */}
          <Formik
            initialValues={initialDeploymentFormValues}
            validationSchema={validationSchema}
            onSubmit={handleAddOrUpdateDeployment} // Form submit adds/updates the list
            enableReinitialize // Needed to load data when editingIndex changes
          >
            {({ setFieldValue, values, resetForm, submitForm, errors, touched, setValues }) => ( // Get setValues
              <> {/* Use Fragment to return multiple elements */}
                {/* --- Display Current Deployment Entries List (STYLE COPIED FROM SECTION 3) --- */}
                {deploymentEntries.length > 0 && (
                  <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg border border-blue-200">
                    <h3 className="text-2xl font-extrabold mb-4 text-blue-800 flex items-center">
                       <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                       Current Deployment Entries ({deploymentEntries.length})
                    </h3>
                    <div className="space-y-4">
                      {deploymentEntries.map((deployment, index) => (
                        <div
                          key={deployment.id || `temp-${index}`}
                          className={`p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all duration-300 ${
                            editingIndex === index
                              ? "bg-yellow-100 border-yellow-400 shadow-md transform scale-[1.01]"
                              : "bg-white border-gray-200 hover:shadow-md hover:border-blue-300"
                          }`}
                        >
                          <div className="flex-1 mb-3 sm:mb-0">
                            <div className="flex items-center mb-1">
                              <span className="text-lg font-bold text-gray-800 mr-2">
                                {index + 1}. {deployment.clientName}
                              </span>
                              {deployment.id && (
                                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                                  ID: {deployment.id}
                                </span>
                              )}
                              {editingIndex === index && (
                                <span className="ml-3 bg-blue-200 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full animate-pulse">
                                  Editing...
                                </span>
                              )}
                            </div>
                            {/* Display more details */}
                            <div className="text-sm text-gray-600 space-y-0.5">
                               <p>
                                  <span className="font-semibold">Location:</span>{" "}
                                  {deployment.city || "N/A"}, {deployment.country?.label || 'N/A'}
                                </p>
                                <p>
                                  <span className="font-semibold">Contact:</span>{" "}
                                  {deployment.nodalContactPerson || "N/A"}
                                </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => handleEditLoad(deployment, index, setValues)} // Pass setValues directly
                              className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-yellow-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={editingIndex !== null && editingIndex !== index} // Disable if another is being edited
                            >
                              {editingIndex === index ? "Editing" : "Edit"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDeployment(index, resetForm)} // Pass resetForm
                              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={editingIndex === index} // Don't allow removing the item being edited
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* --- End Display List --- */}


                {/* The Form itself */}
                <Form className="bg-white p-6 rounded-lg shadow-md border border-gray-200" id="sectionFourForm">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                    {editingIndex !== null ? `Editing Entry ${editingIndex + 1}` : "Add New Deployment Entry"}
                  </h3>

                   {/* TRN (Read-only) - Full Width */}
                  <div className="form-group mb-6">
                    <label className="font-bold block mb-1 text-gray-700 text-sm">Technology Ref No:</label>
                    <input
                      type="text"
                      value={technologyRefNo}
                      readOnly
                      className="w-full p-2 text-base outline-none rounded-md border bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300"
                    />
                    <Field type="hidden" name="technologyRefNo" value={technologyRefNo} />
                  </div>


                  {/* --- START: 2-COLUMN GRID --- */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    {/* Client Name */}
                    <div className="form-group">
                      <label className="font-bold block mb-1 text-gray-700 text-sm" htmlFor="clientName">
                        Name of Client <span className="text-red-500">*</span>
                        <span className="block text-xs font-normal text-gray-500">Max. 300 Characters</span>
                      </label>
                      <Field
                        type="text"
                        id="clientName"
                        name="clientName"
                        placeholder="Enter client name..."
                        className={`w-full p-2 text-base outline-none rounded-md border ${errors.clientName && touched.clientName ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500`}
                      />
                      <ErrorMessage name="clientName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* City */}
                    <div className="form-group">
                      <label className="font-bold block mb-1 text-gray-700 text-sm" htmlFor="city">
                        City <span className="text-red-500">*</span>
                        <span className="block text-xs font-normal text-gray-500">Max. 100 Characters</span>
                      </label>
                      <Field
                        type="text"
                        id="city"
                        name="city"
                        placeholder="Enter city..."
                        className={`w-full p-2 text-base outline-none rounded-md border ${errors.city && touched.city ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500`}
                      />
                      <ErrorMessage name="city" component="div" className="text-red-500 text-xs mt-1" />
                    </div>


                    {/* Address of Client (Spans 2) */}
                    <div className="form-group md:col-span-2">
                      <label className="font-bold block mb-1 text-gray-700 text-sm" htmlFor="clientAddress">
                        Address of Client <span className="text-red-500">*</span>
                        <span className="block text-xs font-normal text-gray-500">Max. 300 Characters</span>
                      </label>
                      <Field
                        as="textarea"
                        rows="3"
                        id="clientAddress"
                        name="clientAddress"
                        placeholder="Enter client address..."
                        className={`w-full p-2 text-base outline-none rounded-md border ${errors.clientAddress && touched.clientAddress ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500`}
                      />
                      <ErrorMessage name="clientAddress" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Country Select */}
                    <div className="form-group">
                      <label className="font-bold block mb-1 text-gray-700 text-sm" htmlFor="country">Country <span className="text-red-500">*</span></label>
                      <Field
                        name="country"
                        options={countryOptions} // Use imported options
                        component={CustomSelect}
                        placeholder="Select a Country..."
                        isMulti={false} // Single select for country
                        className={`${errors.country && touched.country ? 'react-select-error' : ''}`} // Add error class if needed by CustomSelect
                      />
                      <ErrorMessage name="country" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Nodal Contact Person (Spans 2) */}
                    <div className="form-group md:col-span-2">
                       <label className="font-bold block mb-1 text-gray-700 text-sm" htmlFor="nodalContactPerson">
                         Nodal Contact Person (Name & Address) <span className="text-red-500">*</span>
                         <span className="block text-xs font-normal text-gray-500">Max. 300 Characters</span>
                      </label>
                       <Field
                        as="textarea"
                        rows="3"
                        id="nodalContactPerson"
                        name="nodalContactPerson"
                        placeholder="Enter nodal contact person details..."
                        className={`w-full p-2 text-base outline-none rounded-md border ${errors.nodalContactPerson && touched.nodalContactPerson ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500`}
                      />
                      <ErrorMessage name="nodalContactPerson" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                     {/* Deployment Details (Spans 2) */}
                    <div className="form-group md:col-span-2">
                       <label className="font-bold block mb-1 text-gray-700 text-sm" htmlFor="deploymentDetails">
                         Deployment Details <span className="text-red-500">*</span>
                         <span className="block text-xs font-normal text-gray-500">Max. 500 Characters</span>
                      </label>
                       <Field
                        as="textarea"
                        rows="4" // Slightly larger for details
                        id="deploymentDetails"
                        name="deploymentDetails"
                        placeholder="Enter deployment details..."
                        className={`w-full p-2 text-base outline-none rounded-md border ${errors.deploymentDetails && touched.deploymentDetails ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500`}
                      />
                      <ErrorMessage name="deploymentDetails" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                  </div>
                   {/* --- END: 2-COLUMN GRID --- */}


                  {/* Add / Update Button for the List */}
                  <div className="flex gap-4 pt-6 border-t mt-6">
                      <button
                          type="submit" // Changed to type="submit" to trigger Formik onSubmit
                          className={`px-6 py-2 rounded text-white font-semibold ${
                          editingIndex !== null
                              ? "bg-purple-600 hover:bg-purple-700" // Purple for Update
                              : "bg-blue-600 hover:bg-blue-700"   // Blue for Add
                          }`}
                      >
                          {editingIndex !== null ? "Update Entry in List" : "Add Entry to List"}
                      </button>
                      {editingIndex !== null && (
                          <button
                          type="button" // Keep as button, doesn't submit
                          onClick={() => {
                              resetForm({ values: initialDeploymentFormValues });
                              setEditingIndex(null);
                          }}
                          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                          >
                          Cancel Edit
                          </button>
                      )}
                  </div>

                  {/* --- Main Navigation Buttons --- */}
                  <div className="flex justify-between items-center gap-6 mt-10 border-t pt-6"> {/* Changed to justify-between */}
                    <button
                      type="button"
                      onClick={handlePrevious} // Use the handler
                      className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 font-semibold"
                    >
                      ← Previous (Section 3)
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmitAll} // Final Save for the whole list
                      className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 font-bold disabled:opacity-60"
                      disabled={editingIndex !== null} // Disable save while editing one item
                    >
                      Save  {/* Updated Text */}
                    </button>

                    {/* --- UPDATED BUTTON --- */}
                    <button
                      type="button"
                      onClick={handlePreviewOpen} // Call handler to save then open popup
                      className="bg-teal-600 text-white px-6 py-3 rounded hover:bg-teal-700 font-semibold disabled:opacity-60"
                      disabled={editingIndex !== null} // Disable while editing
                    >
                      Preview & Edit {/* Updated Text */}
                    </button>
                    {/* --- END UPDATED BUTTON --- */}
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </div>
      </div>
      <FooterBar />

      {/* --- Render Review Popup --- */}
      <ReviewPopup
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        technologyRefNo={technologyRefNo}
        navigate={navigate} // Pass navigate function
      />
    </>
  );
};

export default SectionFour;



