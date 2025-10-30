// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import DatePicker from "react-datepicker";
// import Swal from "sweetalert2";
// import axios from "axios";

// import "react-datepicker/dist/react-datepicker.css";
// // import Header from "Components/common/header";
// import NavBar from "Components/common/navBar";
// import FooterBar from "Components/common/footer";
// import Section from "Components/common/section";
// import { countryOptions } from "Components/data/country"; // Corrected import
// import CustomSelect from "Components/utils/CustomSelect"; // Ensure CustomSelect handles objects

// // Define initial empty state for ONE IPR entry in the form
// const initialIPRFormValues = {
//   id: null, // To track existing entries
//   iprType: "",
//   registrationNo: "",
//   status: "",
//   statusDate: null,
//   country: [], // Expecting array of {value, label} from CustomSelect
// };

// const SectionTwo = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const technologyRefNo = location.state?.technologyRefNo || "";

//   // State for the LIST of all IPR entries for this technology
//   const [iprEntries, setIprEntries] = useState([]);
//   const [loading, setLoading] = useState(!!technologyRefNo);
//   const [editingIndex, setEditingIndex] = useState(null); // Index of the entry being edited in iprEntries

//   // Fetch existing IPR data when the component mounts or technologyRefNo changes
//   useEffect(() => {
//     if (technologyRefNo) {
//       setLoading(true);
//       // *** ADJUST API ENDPOINT: Use your GET endpoint that returns a LIST ***
//       axios
//         .get(`http://172.16.2.246:8080/api/section-two/${technologyRefNo}`) // Example endpoint
//         .then((response) => {
//           // Format data for the list state
//           const formattedData = response.data.map(ipr => ({
//             ...ipr,
//             // Convert date string to Date object
//             statusDate: ipr.statusDate ? new Date(ipr.statusDate) : null,
//             // Convert country string array to array of {value, label}
//             country: (ipr.country || []).map(c => countryOptions.find(opt => opt.value === c)).filter(Boolean), // Find matching option objects
//           }));
//           setIprEntries(formattedData);
//         })
//         .catch((error) => {
//           console.error("Error fetching SectionTwo data:", error);
//           if (error.response?.status === 404) {
//              setIprEntries([]); // Start fresh if no data exists
//           } else {
//              Swal.fire("Error", "Could not fetch existing IPR data.", "error");
//           }
//         })
//         .finally(() => setLoading(false));
//     } else {
//         // If no technologyRefNo, navigate back or show error
//         Swal.fire("Missing Reference", "Technology Reference Number not provided.", "error");
//         navigate('/sectionOne'); // Or appropriate fallback
//     }
//   }, [technologyRefNo, navigate]);

//   // Validation schema for the form fields
//   const validationSchema = Yup.object({
//     iprType: Yup.string().required("Required"),
//     registrationNo: Yup.string().max(50, "Max 50 chars").required("Required"),
//     status: Yup.string().required("Required"),
//     statusDate: Yup.date().nullable().required("Status Date is required"),
//     country: Yup.array()
//         .min(1, "Select at least one country")
//         .required("Country is required")
//         .test( // Ensure it's an array of objects
//             'is-array-of-objects',
//             'Invalid selection',
//             value => Array.isArray(value) && value.every(item => typeof item === 'object' && item !== null && 'value' in item && 'label' in item)
//         ),
//   });

//   // Handle FINAL submit (Save All IPRs button)
//   const handleSubmitAll = () => {
//     if (editingIndex !== null) {
//       Swal.fire("Update Pending", "Finish editing before saving.", "warning");
//       return;
//     }
//     // Optional: Add check if iprEntries is empty

//     // Prepare payload: Format dates and extract country values
//     const payload = iprEntries.map(entry => ({
//         ...entry,
//         technologyRefNo: technologyRefNo, // Ensure TRN is included
//         statusDate: entry.statusDate instanceof Date
//             ? entry.statusDate.toISOString().split("T")[0] // Format to YYYY-MM-DD
//             : null,
//         country: (entry.country || []).map(c => c.value), // Extract just the value strings
//     }));

//     // *** ADJUST API ENDPOINT: Use your POST endpoint that accepts a LIST ***
//     axios
//       .post(`http://172.16.2.246:8080/api/section-two/save/${technologyRefNo}`, payload, { // Example endpoint
//         headers: { "Content-Type": "application/json" },
//         // Add Authorization header if needed: headers: { Authorization: `Bearer ${token}` }
//       })
//       .then((response) => { // Expect updated list in response
//         Swal.fire("Success!", "IPR entries saved successfully!", "success");
//          // Update state with saved data (including any new IDs)
//          const formattedResponse = response.data.map(ipr => ({
//             ...ipr,
//             statusDate: ipr.statusDate ? new Date(ipr.statusDate) : null,
//             country: (ipr.country || []).map(c => countryOptions.find(opt => opt.value === c)).filter(Boolean),
//           }));
//           setIprEntries(formattedResponse);
//       })
//       .catch((error) => {
//          console.error("Save error:", error.response?.data || error.message);
//          Swal.fire("Error!", error.response?.data?.message || "Form submission failed.", "error");
//       });
//   };

//    // --- List Item Handlers ---

//   // Load an existing entry into the form for editing
//   const handleEditLoad = (iprToEdit, index, setValues) => {
//       setEditingIndex(index);
//       // Set Formik values directly (includes id, country as objects, statusDate as Date)
//       setValues({
//           id: iprToEdit.id || null,
//           iprType: iprToEdit.iprType || "",
//           registrationNo: iprToEdit.registrationNo || "",
//           status: iprToEdit.status || "",
//           statusDate: iprToEdit.statusDate, // Should be Date object
//           country: iprToEdit.country || [], // Should be array of objects
//       });
//       Swal.fire("Editing", `Editing IPR: ${iprToEdit.registrationNo || 'New Entry'}`, "info");
//   };

//   // Add new or update existing IPR in the *local* list
//   const handleAddOrUpdateIPR = async (values, { validateForm, resetForm }) => {
//       const formErrors = await validateForm(values); // Validate current form values
//       if (Object.keys(formErrors).length > 0) {
//           Swal.fire("Incomplete Form", "Please fill all required fields correctly.", "error");
//           return;
//       }

//       const iprData = { ...values }; // Copy form values (includes id, country objects, statusDate)

//       if (editingIndex !== null) { // Update existing in list
//           const updatedEntries = [...iprEntries];
//           updatedEntries[editingIndex] = iprData;
//           setIprEntries(updatedEntries);
//           Swal.fire("Updated", "IPR updated in the list. Click 'Save All'.", "success");
//       } else { // Add new to list
//           // Check if entry with same registrationNo already exists (optional)
//           // if (iprEntries.some(e => e.registrationNo === iprData.registrationNo)) {
//           //     Swal.fire("Duplicate", "An IPR with this Registration No. already exists.", "warning");
//           //     return;
//           // }
//           setIprEntries((prev) => [...prev, iprData]);
//           Swal.fire("Added", "IPR added to the list. Click 'Save All'.", "success");
//       }

//       // Reset form
//       resetForm({ values: initialIPRFormValues });
//       setEditingIndex(null);
//   };

//    // Remove an IPR entry from the list
//   const handleRemoveIPR = (indexToRemove) => {
//     const entryToRemove = iprEntries[indexToRemove];
//     Swal.fire({
//       title: "Are you sure?",
//       text: `Remove IPR '${entryToRemove.registrationNo || 'New Entry'}'? Will be deleted on Save All.`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       confirmButtonText: "Yes, remove it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setIprEntries((prev) => prev.filter((_, i) => i !== indexToRemove));
//         if (editingIndex === indexToRemove) {
//           setEditingIndex(null); // Reset form if the edited item is removed
//           // Consider resetting form fields here if needed
//         }
//         Swal.fire("Removed!", "Removed from list. Click 'Save All' to finalize.", "info");
//       }
//     });
//   };

//   // --- End List Item Handlers ---


//   if (loading) {
//       return <p className="text-center mt-6">Loading IPR data...</p>;
//   }


//   return (
//     <>
//       <NavBar />
//       <div className="flex bg-blue-100 min-h-screen"> {/* Lighter background */}
//         <div className="flex-1 p-8">
//           <Section sectionLine="Section 2 : IPR Status" />

//           {/* --- Display Current IPR Entries List --- */}
//           {iprEntries.length > 0 && (
//             <div className="mb-6 p-4 bg-white rounded shadow-md border border-gray-200">
//               <h3 className="text-xl font-semibold mb-3 text-indigo-700 border-b pb-2">
//                 Current IPR Entries ({iprEntries.length})
//               </h3>
//               <ul className="space-y-2">
//                 {iprEntries.map((ipr, index) => (
//                   <li
//                     key={ipr.id || `temp-${index}`}
//                     className={`p-2 flex justify-between items-center rounded ${
//                       editingIndex === index ? "bg-yellow-100 ring-1 ring-yellow-400" : "hover:bg-gray-50"
//                     }`}
//                   >
//                     <span className="text-sm text-gray-700">
//                       {index + 1}. <strong>{ipr.iprType?.toUpperCase()}</strong> - {ipr.registrationNo}
//                       {ipr.id && <span className="text-xs text-gray-500 ml-2">(ID: {ipr.id})</span>}
//                       {editingIndex === index && <span className="ml-2 text-blue-600 font-semibold">(Editing...)</span>}
//                     </span>
//                     <div className="space-x-2 flex-shrink-0">
//                       <button
//                         type="button"
//                         // Pass Formik's setValues to handleEditLoad
//                         onClick={(e) => {
//                             const formikBag = e.target.closest('form')?.__formikContext; // Hacky way to get formik bag if needed
//                             if(formikBag) handleEditLoad(ipr, index, formikBag.setValues);
//                             else console.error("Could not find Formik context for edit load");
//                          }}
//                         className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600 disabled:opacity-50"
//                         disabled={editingIndex !== null}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveIPR(index)}
//                         className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
//                         disabled={editingIndex === index}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {/* --- End Display List --- */}


//           <Formik
//             initialValues={initialIPRFormValues}
//             validationSchema={validationSchema}
//             onSubmit={handleAddOrUpdateIPR} // Submit on this form adds/updates the *list*
//             enableReinitialize // Important for loading data into the form when 'Edit' is clicked
//           >
//             {({ setFieldValue, values, resetForm, submitForm, errors, touched, setValues }) => ( // Get submitForm and form state from Formik
//               <Form className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
//                   {editingIndex !== null ? `Editing IPR Entry ${editingIndex + 1}` : "Add New IPR Entry"}
//                 </h3>

//                 {/* TRN (Read-only, hidden might be better) */}
//                 <input type="hidden" name="technologyRefNo" value={technologyRefNo} />
//                 <div className="form-group mb-4">
//                   <label className="font-bold block mb-1 text-sm text-gray-600">Technology Ref No:</label>
//                   <input
//                     type="text"
//                     readOnly
//                     className="w-full p-2 rounded-md bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed"
//                     value={technologyRefNo} // Directly use the state variable
//                   />
//                 </div>

//                 {/* IPR Type */}
//                 <div>
//                   <label className="font-bold block mb-1 text-gray-700" htmlFor="iprType">IPR Type <span className="text-red-500">*</span></label>
//                   // eslint-disable-next-line no-undef
//                   <Field as="select" id="iprType" name="iprType" className={`w-full p-2 rounded-md border bg-white ${errors.iprType && touched.iprType ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}>
//                     <option value="">-- Select Type --</option>
//                     {["Patent", "Industrial Design", "Trademark", "Copyright", "Other"].map((opt) => (
//                       <option key={opt} value={opt}>{opt}</option> // Use full name as value
//                     ))}
//                   </Field>
//                   <ErrorMessage name="iprType" component="div" className="text-red-500 text-xs mt-1" />
//                 </div>

//                 {/* Registration No */}
//                 <div>
//                   <label className="font-bold block mb-1 text-gray-700" htmlFor="registrationNo">Registration No. <span className="text-red-500">*</span></label>
//                   // eslint-disable-next-line no-undef
//                   <Field id="registrationNo" name="registrationNo" type="text" className={`w-full p-2 rounded-md border ${errors.registrationNo && touched.registrationNo ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}/>
//                   <ErrorMessage name="registrationNo" component="div" className="text-red-500 text-xs mt-1" />
//                 </div>

//                 {/* Status */}
//                 <div>
//                   <label className="font-bold block mb-1 text-gray-700" htmlFor="status">Status <span className="text-red-500">*</span></label>
//                   <Field as="select" id="status" name="status" className={`w-full p-2 rounded-md border bg-white ${errors.status && touched.status ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}>
//                     <option value="">-- Select Status --</option>
//                     {["Filed", "Pending for Grant", "Granted", "Lapsed", "Abandoned"].map((opt) => (
//                       <option key={opt} value={opt}>{opt}</option> // Use full name as value
//                     ))}
//                   </Field>
//                   <ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1" />
//                 </div>

//                 {/* Status Date */}
//                 <div>
//                   <label className="font-bold block mb-1 text-gray-700" htmlFor="statusDate">Status Date <span className="text-red-500">*</span></label>
//                   <DatePicker
//                     id="statusDate"
//                     selected={values.statusDate} // Use value from Formik
//                     onChange={(date) => setFieldValue("statusDate", date)}
//                     dateFormat="dd/MM/yyyy"
//                     // eslint-disable-next-line no-undef
//                     className={`w-full p-2 rounded-md border ${errors.statusDate && touched.statusDate ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}
//                     placeholderText="Select date (DD/MM/YYYY)"
//                     showMonthDropdown
//                     showYearDropdown
//                     dropdownMode="select"
//                   />
//                   <ErrorMessage name="statusDate" component="div" className="text-red-500 text-xs mt-1" />
//                 </div>

//                 {/* Country */}
//                 <div>
//                   <label className="font-bold block mb-1 text-gray-700" htmlFor="country">Country <span className="text-red-500">*</span></label>
//                   <Field
//                     id="country"
//                     name="country"
//                     component={CustomSelect}
//                     options={countryOptions} // Use the imported options
//                     isMulti={true}
//                     placeholder="Select countries..."
//                     // eslint-disable-next-line no-undef
//                     className={`${errors.country && touched.country ? 'react-select-error' : ''}`}
//                   />
//                   <ErrorMessage name="country" component="div" className="text-red-500 text-xs mt-1" />
//                 </div>

//                 {/* Add / Update Button for the List */}
//                 <div className="flex gap-4 pt-4">
//                     <button
//                         type="button" // Use type="button" to prevent Formik's default submit
//                         onClick={() => submitForm()} // Manually trigger Formik's submit handler (handleAddOrUpdateIPR)
//                         className={`px-6 py-2 rounded text-white font-semibold ${
//                         editingIndex !== null
//                             ? "bg-purple-600 hover:bg-purple-700"
//                             : "bg-blue-600 hover:bg-blue-700"
//                         }`}
//                     >
//                         {editingIndex !== null ? "Update Entry in List" : "Add Entry to List"}
//                     </button>
//                     {editingIndex !== null && (
//                         <button
//                         type="button"
//                         onClick={() => {
//                             resetForm({ values: initialIPRFormValues });
//                             setEditingIndex(null);
//                         }}
//                         className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
//                         >
//                         Cancel Edit
//                         </button>
//                     )}
//                 </div>

//                 {/* --- Main Navigation Buttons --- */}
//                 <div className="flex justify-center items-center gap-6 mt-10 border-t pt-6">
//                   <button
//                     type="button"
//                     // Navigate back to SectionOne, passing TRN
//                     onClick={() => navigate("/sectionOne", { state: { technologyRefNo } })}
//                     className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 font-semibold"
//                   >
//                     ← Previous (Section 1)
//                   </button>

//                   <button
//                     type="button"
//                     onClick={handleSubmitAll} // Final Save for the whole list
//                     className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 font-bold disabled:opacity-60"
//                     disabled={editingIndex !== null} // Disable save while editing one item
//                   >
//                     Save All Section 2 Changes
//                   </button>

//                   <button
//                     type="button"
//                     // Navigate to SectionThree, passing TRN
//                     onClick={() => navigate("/sectionThree", { state: { technologyRefNo } })}
//                     className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 font-semibold"
//                   >
//                     Next (Section 3) →
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//       <FooterBar />
//     </>
//   );
// };

// export default SectionTwo;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";
import Section from "Components/common/section";
import { countryOptions } from "Components/data/country"; // Corrected import

const SectionTwo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const technologyRefNo = location.state?.technologyRefNo || "";

  // State for CSIR Registration Number
  const [csirRegistrationNumber, setCsirRegistrationNumber] = useState("");
  // State for the LIST of all IPR entries fetched
  const [iprEntries, setIprEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing IPR data when the component mounts or technologyRefNo changes (if needed, but now primarily for fetch)
  useEffect(() => {
    if (!technologyRefNo) {
      Swal.fire("Missing Reference", "Technology Reference Number not provided.", "error");
      navigate('/sectionOne');
    }
  }, [technologyRefNo, navigate]);

  // Handle Fetch Data
  const handleFetchData = () => {
    if (!csirRegistrationNumber.trim()) {
      Swal.fire("Error", "Please enter CSIR-Registration Number.", "error");
      return;
    }
    setLoading(true);
    // *** ADJUST API ENDPOINT: Use your GET endpoint that fetches IPR data by CSIR Registration Number ***
    axios
      .get(`http://172.16.2.246:8080/api/section-two/fetch/${csirRegistrationNumber}`) // Example endpoint
      .then((response) => {
        // Format data for the list state
        const formattedData = response.data.map(ipr => ({
          ...ipr,
          // Convert date string to Date object
          statusDate: ipr.statusDate ? new Date(ipr.statusDate) : null,
          // Convert country string array to array of {value, label}
          country: (ipr.country || []).map(c => countryOptions.find(opt => opt.value === c)).filter(Boolean),
        }));
        setIprEntries(formattedData);
        Swal.fire("Success!", "IPR data fetched successfully!", "success");
      })
      .catch((error) => {
        console.error("Error fetching IPR data:", error);
        if (error.response?.status === 404) {
          setIprEntries([]);
          Swal.fire("No Data", "No IPR data found for this CSIR-Registration Number.", "info");
        } else {
          Swal.fire("Error", "Could not fetch IPR data.", "error");
        }
      })
      .finally(() => setLoading(false));
  };

  // Handle FINAL submit (Save All IPRs button) - assuming we save the fetched data
  const handleSubmitAll = () => {
    if (iprEntries.length === 0) {
      Swal.fire("No Data", "No IPR entries to save.", "warning");
      return;
    }

    // Prepare payload: Format dates and extract country values
    const payload = iprEntries.map(entry => ({
      ...entry,
      technologyRefNo: technologyRefNo, // Ensure TRN is included
      statusDate: entry.statusDate instanceof Date
        ? entry.statusDate.toISOString().split("T")[0] // Format to YYYY-MM-DD
        : null,
      country: (entry.country || []).map(c => c.value), // Extract just the value strings
    }));

    // *** ADJUST API ENDPOINT: Use your POST endpoint that saves the LIST ***
    axios
      .post(`http://172.16.2.246:8080/api/section-two/save/${technologyRefNo}`, payload, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        Swal.fire("Success!", "IPR entries saved successfully!", "success");
        // Optionally update state with saved data
        const formattedResponse = response.data.map(ipr => ({
          ...ipr,
          statusDate: ipr.statusDate ? new Date(ipr.statusDate) : null,
          country: (ipr.country || []).map(c => countryOptions.find(opt => opt.value === c)).filter(Boolean),
        }));
        setIprEntries(formattedResponse);
      })
      .catch((error) => {
        console.error("Save error:", error.response?.data || error.message);
        Swal.fire("Error!", error.response?.data?.message || "Form submission failed.", "error");
      });
  };

  if (loading) {
    return <p className="text-center mt-6">Loading IPR data...</p>;
  }

  return (
    <>
      <NavBar />
      <div className="flex bg-blue-100 min-h-screen">
        <div className="flex-1 p-8">
          <Section sectionLine="Section 2 : IPR Status" />

          {/* Technology Ref No (Read-only) */}
          <div className="mb-4">
            <label className="font-bold block mb-1 text-sm text-gray-600">Technology Ref No:</label>
            <input
              type="text"
              readOnly
              className="w-full p-2 rounded-md bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed"
              value={technologyRefNo}
            />
          </div>

          {/* CSIR-Registration Number Field */}
          <div className="mb-4 flex items-center gap-4">
            <div className="flex-1">
              <label className="font-bold block mb-1 text-gray-700">
                CSIR-Registration Number <span className="text-gray-400 font-light">(NF number provided by IPU)</span>
              </label>
              <input
                type="text"
                value={csirRegistrationNumber}
                onChange={(e) => setCsirRegistrationNumber(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 focus:border-indigo-500 outline-none"
                placeholder="Enter CSIR-Registration Number"
              />
            </div>
            <button
              type="button"
              onClick={handleFetchData}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
            >
              Fetch Data
            </button>
          </div>

          {/* IPR Entries Table */}
          {iprEntries.length > 0 && (
            <div className="mb-6 p-4 bg-white rounded shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-indigo-700 border-b pb-2">
                IPR Entries ({iprEntries.length})
              </h3>
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">IPR Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Registration No.</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Country</th>
                  </tr>
                </thead>
                <tbody>
                  {iprEntries.map((ipr, index) => (
                    <tr key={ipr.id || `temp-${index}`} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{ipr.iprType}</td>
                      <td className="border border-gray-300 px-4 py-2">{ipr.registrationNo}</td>
                      <td className="border border-gray-300 px-4 py-2">{ipr.status}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {ipr.statusDate ? ipr.statusDate.toLocaleDateString('en-GB') : 'N/A'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {(ipr.country || []).map(c => c.label).join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Main Navigation Buttons */}
          <div className="flex justify-center items-center gap-6 mt-10 border-t pt-6">
            <button
              type="button"
              onClick={() => navigate("/sectionOne", { state: { technologyRefNo } })}
              className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 font-semibold"
            >
              ← Previous (Section 1)
            </button>

            <button
              type="button"
              onClick={handleSubmitAll}
              className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 font-bold"
              disabled={iprEntries.length === 0}
            >
              Save All Section 2 Changes
            </button>

            <button
              type="button"
              onClick={() => navigate("/sectionThree", { state: { technologyRefNo } })}
              className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 font-semibold"
            >
              Next (Section 3) →
            </button>
          </div>
        </div>
      </div>
      <FooterBar />
    </>
  );
};

export default SectionTwo;
