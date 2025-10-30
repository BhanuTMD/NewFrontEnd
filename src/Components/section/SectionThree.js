import React, { useState, useEffect } from "react";
import axios from "axios";
import FooterBar from "Components/common/footer";
import NavBar from "Components/common/navBar";
import Section from "Components/common/section";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom";

// Define initial empty state for one licensee form entry
const initialLicenseeValues = {
  id: null, // ID field for tracking existing entries
  licenseName: "",
  address: "",
  email: "",
  contact: "", // Changed from contact to contactNO to match DTO
  dateOfAgreementSigning: null,
  typeOfLicense: "",
  regionalGeography: "", // Changed from staRegionalGeography to regionalGeography to match DTO
  detailsOfExclusivity: "",
  dateOfLicense: null,
  licenseValidUntil: null,
  paymentTerms: "",
};

const SectionThree = () => {
  // Renamed back to SectionThree
  const navigate = useNavigate();
  const location = useLocation();

  const [technologyRefNo] = useState(location.state?.technologyRefNo || "");

  // State for the list of ALL licensees (fetched + newly added)
  const [licensees, setLicensees] = useState([]);

  // State for dynamic royalty and premia for the *current* form
  const [royalty, setRoyalty] = useState([
    { royaltyAmount: "", royaltyDate: null },
  ]);
  const [premia, setPremia] = useState([
    { premiaAmount: "", premiaDate: null },
  ]);

  // State to track which licensee is being edited (index in the licensees array)
  const [editingIndex, setEditingIndex] = useState(null);

  const minDate = new Date("1900-08-12");
  const maxDate = new Date("3000-08-12");

  // Fetch existing data when the component mounts or technologyRefNo changes
  useEffect(() => {
    if (technologyRefNo) {
      // Use the GET endpoint you confirmed
      axios
        .get(`http://172.16.2.246:8080/api/section-three/${technologyRefNo}`)
        .then((response) => {
          // Format the fetched data to match the frontend state structure
          const formattedLicensees = response.data.map((lic) => {
            const formattedRoyalty = lic.royalty.map((r) => ({
              royaltyAmount: String(r.amount), // Convert amount number to string for input
              royaltyDate: r.date ? new Date(r.date) : null, // Convert date string to Date object
            }));
            const formattedPremia = lic.premia.map((p) => ({
              premiaAmount: String(p.amount), // Convert amount number to string for input
              premiaDate: p.date ? new Date(p.date) : null, // Convert date string to Date object
            }));
            const subTotalRoyalty = formattedRoyalty.reduce(
              (acc, r) => acc + parseFloat(r.royaltyAmount || 0),
              0
            );
            const subTotalPremia = formattedPremia.reduce(
              (acc, p) => acc + parseFloat(p.premiaAmount || 0),
              0
            );
            const totalLicenseFee = subTotalRoyalty + subTotalPremia;
            return {
              ...lic, // Keep all properties like id, licenseName etc.
              // Convert date strings from backend to Date objects for DatePicker
              dateOfAgreementSigning: lic.dateOfAgreementSigning
                ? new Date(lic.dateOfAgreementSigning)
                : null,
              dateOfLicense: lic.dateOfLicense
                ? new Date(lic.dateOfLicense)
                : null,
              licenseValidUntil: lic.licenseValidUntil
                ? new Date(lic.licenseValidUntil)
                : null,
              royalty: formattedRoyalty,
              premia: formattedPremia,
              subTotalRoyalty,
              subTotalPremia,
              totalLicenseFee,
              // Note: address, email, contact should already be strings
            };
          });
          setLicensees(formattedLicensees);
        })
        .catch((error) => {
          console.error("Error fetching initial Section 3 data:", error);
          if (error.response?.status === 404) {
            // If no data exists yet (404), start with an empty list
            setLicensees([]);
          } else {
            Swal.fire("Error", "Could not fetch existing data.", "error");
          }
        });
    }
  }, [technologyRefNo]); // Dependency array ensures this runs when technologyRefNo is available

  // Validation schema (includes fields added earlier)
  const validationSchema = Yup.object({
    licenseName: Yup.string()
      .max(300, "Max. 300 characters")
      .required("Required"),
    address: Yup.string().max(500, "Max. 500 characters").nullable(), // Allow null
    email: Yup.string().email("Invalid email format").nullable(), // Allow null
    contact: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be 10 digits")
      .nullable(), // Allow null
    dateOfAgreementSigning: Yup.date().nullable().required("Required"),
    typeOfLicense: Yup.string().required("Required"),
    staRegionalGeography: Yup.string().nullable(),
    detailsOfExclusivity: Yup.string()
      .max(300, "Max. 300 characters")
      .nullable(), // Allow null
    dateOfLicense: Yup.date().nullable().required("Required"),
    licenseValidUntil: Yup.date().nullable().required("Required"),
    paymentTerms: Yup.string().max(300, "Max. 300 characters").nullable(), // Allow null
  });

  // Handle FINAL submit (Save All button)
  const handleSubmit = () => {
    if (editingIndex !== null) {
      Swal.fire("Update Pending", "Finish editing before saving.", "warning");
      return;
    }
    if (licensees.length === 0) {
      // Allow saving an empty list
    }

    // Prepare payload
    const payload = licensees.map((lic) => ({
      ...lic, // Keep id, licenseName, etc.
      technologyRefNo: technologyRefNo, // Ensure refNo is set
      dateOfAgreementSigning:
        lic.dateOfAgreementSigning instanceof Date
          ? lic.dateOfAgreementSigning.toISOString().split("T")[0]
          : null,
      dateOfLicense:
        lic.dateOfLicense instanceof Date
          ? lic.dateOfLicense.toISOString().split("T")[0]
          : null,
      licenseValidUntil:
        lic.licenseValidUntil instanceof Date
          ? lic.licenseValidUntil.toISOString().split("T")[0]
          : null,
      royalty: (lic.royalty || []).map((r) => ({
        amount: parseFloat(r.royaltyAmount || "0"),
        date:
          r.royaltyDate instanceof Date
            ? r.royaltyDate.toISOString().split("T")[0]
            : null,
      })),
      premia: (lic.premia || []).map((p) => ({
        amount: parseFloat(p.premiaAmount || "0"),
        date:
          p.premiaDate instanceof Date
            ? p.premiaDate.toISOString().split("T")[0]
            : null,
      })),
      subTotalRoyalty: parseFloat(lic.subTotalRoyalty || 0),
      subTotalPremia: parseFloat(lic.subTotalPremia || 0),
      totalLicenseFee: parseFloat(lic.totalLicenseFee || 0),
    }));

    axios
      .post(
        `http://172.16.2.246:8080/api/section-three/save/${technologyRefNo}`,
        payload, // Send the formatted payload
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        Swal.fire("Success!", "Licensees saved successfully!", "success");

        // Update state with the response from backend (contains IDs)
        const formattedResponse = response.data.map((lic) => ({
          ...lic,
          dateOfAgreementSigning: lic.dateOfAgreementSigning
            ? new Date(lic.dateOfAgreementSigning)
            : null,
          dateOfLicense: lic.dateOfLicense
            ? new Date(lic.dateOfLicense)
            : null,
          licenseValidUntil: lic.licenseValidUntil
            ? new Date(lic.licenseValidUntil)
            : null,
          royalty: lic.royalty.map((r) => ({
            royaltyAmount: String(r.amount),
            royaltyDate: r.date ? new Date(r.date) : null,
          })),
          premia: lic.premia.map((p) => ({
            premiaAmount: String(p.amount),
            premiaDate: p.date ? new Date(p.date) : null,
          })),
          subTotalRoyalty: lic.subTotalRoyalty || 0,
          subTotalPremia: lic.subTotalPremia || 0,
          totalLicenseFee: lic.totalLicenseFee || 0,
        }));
        setLicensees(formattedResponse);
        setEditingIndex(null);
      })
      .catch((error) => {
        console.error("Save error:", error);
        Swal.fire(
          "Error!",
          error?.response?.data?.message || "Save failed.",
          "error"
        );
      });
  };

  // --- Royalties/Premia handlers ---
  const handleAddRoyalty = () =>
    setRoyalty([...royalty, { royaltyAmount: "", royaltyDate: null }]);
  
  const handleRemoveRoyalty = (index) => {
    const list = [...royalty];
    list.splice(index, 1);
    setRoyalty(list);
  };
  const handleRoyaltyChange = (index, field, value) => {
    const list = [...royalty];
    list[index][field] = value;
    setRoyalty(list);
  };
  const handleAddPremia = () =>
    setPremia([...premia, { premiaAmount: "", premiaDate: null }]);

  const handleRemovePremia = (index) => {
    const list = [...premia];
    list.splice(index, 1);
    setPremia(list);
  };
  const handlePremiaChange = (index, field, value) => {
    const list = [...premia];
    list[index][field] = value;
    setPremia(list);
  };

  // --- Navigation Handlers ---
  const handlePrevious = () => {
    // Pass the technologyRefNo correctly in the state object
    navigate("/sectionTwo", { state: { technologyRefNo: technologyRefNo } });
  };

  const handleNext = () => {
    // Pass the technologyRefNo correctly in the state object
    navigate("/sectionFour", { state: { technologyRefNo: technologyRefNo } });
  };

  // Calculate totals for the *current* form being edited/added (moved inside Formik render for real-time updates)
  // Removed from here, now inside Formik

  // Function to remove a licensee from the list (will be deleted on Save All)
  const handleRemoveLicensee = (indexToRemove) => {
    const licenseeToRemove = licensees[indexToRemove];
    Swal.fire({
      title: "Are you sure?",
      text: `Remove '${licenseeToRemove.licenseName}'? It will be deleted permanently when you click 'Save All'.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Red for delete
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLicensees((prevLicensees) =>
          prevLicensees.filter((_, i) => i !== indexToRemove)
        );
        if (editingIndex === indexToRemove) {
          setEditingIndex(null); // Reset form if the edited item is removed
        }
        Swal.fire(
          "Removed!",
          "Removed from the list. Click 'Save All' to finalize deletion.",
          "info"
        );
      }
    });
  };

  return (
    <>
      <NavBar />
      <div className="flex">
        <div className="bg-gray-800"></div>
        <div className="flex-1 p-8 bg-blue-100 border">
          <Section sectionLine="Section 3 : Details of Licensee" />

          <Formik
            initialValues={initialLicenseeValues}
            validationSchema={validationSchema}
            enableReinitialize // Important for loading existing data
            onSubmit={() => {
              /* Not used directly */
            }}
          >
            {({
              setFieldValue,
              values,
              validateForm,
              resetForm,
              errors,
              touched,
            }) => {
              // Calculate totals for the *current* form being edited/added (real-time updates)
              const subTotalRoyalty = royalty.reduce(
                (acc, cur) => acc + parseFloat(cur.royaltyAmount || 0),
                0
              );
              const subTotalPremia = premia.reduce(
                (acc, cur) => acc + parseFloat(cur.premiaAmount || 0),
                0
              );
              const grandTotalCurrentForm = subTotalRoyalty + subTotalPremia;

              // Load existing licensee data into the form for editing
              const handleEditLoad = (licenseeToEdit, index) => {
                // Prevent editing if another item is already being edited
                if (editingIndex !== null && editingIndex !== index) {
                  Swal.fire(
                    "Action Required",
                    "Please save or clear the current form before editing another item.",
                    "warning"
                  );
                  return;
                }

                setEditingIndex(index);

                // Populate Formik fields including the ID
                setFieldValue("id", licenseeToEdit.id || null);
                setFieldValue("licenseName", licenseeToEdit.licenseName);
                setFieldValue("address", licenseeToEdit.address || "");
                setFieldValue("email", licenseeToEdit.email || "");
                setFieldValue("contact", licenseeToEdit.contact || "");
                setFieldValue(
                  "dateOfAgreementSigning",
                  licenseeToEdit.dateOfAgreementSigning
                ); // Already Date object
                setFieldValue("typeOfLicense", licenseeToEdit.typeOfLicense);
                setFieldValue(
                  "staRegionalGeography", // Field name used in Formik state
                  licenseeToEdit.staRegionalGeography // Property name from fetched data
                );
                setFieldValue(
                  "detailsOfExclusivity",
                  licenseeToEdit.detailsOfExclusivity || ""
                );
                setFieldValue("dateOfLicense", licenseeToEdit.dateOfLicense); // Already Date object
                setFieldValue(
                  "licenseValidUntil",
                  licenseeToEdit.licenseValidUntil
                ); // Already Date object
                setFieldValue("paymentTerms", licenseeToEdit.paymentTerms || "");

                // Load royalty/premia (should already be in correct frontend format)
                setRoyalty(
                  licenseeToEdit.royalty && licenseeToEdit.royalty.length > 0
                    ? licenseeToEdit.royalty
                    : [{ royaltyAmount: "", royaltyDate: null }] // Ensure at least one row
                );
                setPremia(
                  licenseeToEdit.premia && licenseeToEdit.premia.length > 0
                    ? licenseeToEdit.premia
                    : [{ premiaAmount: "", premiaDate: null }] // Ensure at least one row
                );

                Swal.fire(
                  "Editing",
                  `Now editing: ${licenseeToEdit.licenseName}`,
                  "info"
                );
              };

              // Add new or Update existing licensee in the *local* list
              const handleAddOrUpdateLicensee = async () => {
                const formErrors = await validateForm();
                if (Object.keys(formErrors).length > 0) {
                  Swal.fire(
                    "Incomplete Form",
                    "Please fill in all required fields marked with *.",
                    "error"
                  );
                  return;
                }

                const licenseeData = {
                  id: values.id, // Include ID
                  licenseName: values.licenseName,
                  address: values.address,
                  email: values.email,
                  contact: values.contact,
                  dateOfAgreementSigning: values.dateOfAgreementSigning, // Keep as Date object
                  typeOfLicense: values.typeOfLicense,
                  staRegionalGeography: values.staRegionalGeography, // Use Formik field name
                  detailsOfExclusivity: values.detailsOfExclusivity,
                  dateOfLicense: values.dateOfLicense, // Keep as Date object
                  licenseValidUntil: values.licenseValidUntil, // Keep as Date object
                  paymentTerms: values.paymentTerms,
                  // Keep royalty/premia in frontend format
                  royalty: royalty,
                  premia: premia,
                  // Calculate totals for this specific entry
                  subTotalRoyalty: subTotalRoyalty,
                  subTotalPremia: subTotalPremia,
                  totalLicenseFee: grandTotalCurrentForm,
                };

                if (editingIndex !== null) {
                  // Update
                  const updatedLicensees = [...licensees];
                  updatedLicensees[editingIndex] = licenseeData;
                  setLicensees(updatedLicensees);
                  Swal.fire(
                    "Updated",
                    "Licensee updated in the list. Click 'Save All Changes' to finalize.",
                    "success"
                  );
                } else {
                  // Add New
                  setLicensees((prev) => [...prev, licenseeData]);
                  Swal.fire(
                    "Added",
                    "Licensee added to the list. Click 'Save All Changes' to finalize.",
                    "success"
                  );
                }

                // Reset form
                resetForm({ values: initialLicenseeValues });
                setRoyalty([{ royaltyAmount: "", royaltyDate: null }]);
                setPremia([{ premiaAmount: "", premiaDate: null }]);
                setEditingIndex(null);
              };

              return (
                <>
                  {/* Display Current Licensees List - ENHANCED */}
                  {licensees.length > 0 && (
                    <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg border border-blue-200">
                      <h3 className="text-2xl font-extrabold mb-4 text-blue-800 flex items-center">
                        <svg className="w-7 h-7 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
                        Current Licensees ({licensees.length})
                      </h3>
                      <div className="space-y-4">
                        {licensees.map((lic, index) => (
                          <div
                            key={lic.id || `temp-${index}`}
                                                        className={`p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all duration-300 ${
                              editingIndex === index
                                ? "bg-yellow-100 border-yellow-400 shadow-md transform scale-[1.01]"
                                : "bg-white border-gray-200 hover:shadow-md hover:border-blue-300"
                            }`}
                          >
                            <div className="flex-1 mb-3 sm:mb-0">
                              <div className="flex items-center mb-1">
                                <span className="text-lg font-bold text-gray-800 mr-2">
                                  {index + 1}. {lic.licenseName}
                                </span>
                                {lic.id && (
                                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                                    ID: {lic.id}
                                  </span>
                                )}
                                {editingIndex === index && (
                                  <span className="ml-3 bg-blue-200 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full animate-pulse">
                                    Editing...
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 space-y-0.5">
                                <p>
                                  <span className="font-semibold">Type:</span>{" "}
                                  {lic.typeOfLicense || "N/A"}
                                </p>
                                <p>
                                  <span className="font-semibold">Signed:</span>{" "}
                                  {lic.dateOfAgreementSigning
                                    ? lic.dateOfAgreementSigning.toLocaleDateString()
                                    : "N/A"}
                                </p>
                                <p>
                                  <span className="font-semibold">Total Fee:</span>{" "}
                                  ₹ {lic.totalLicenseFee?.toFixed(2) || "0.00"}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => handleEditLoad(lic, index)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-yellow-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={editingIndex !== null && editingIndex !== index} // Disable if another is being edited
                              >
                                {editingIndex === index ? "Editing" : "Edit"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveLicensee(index)}
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

                  {/* --- FORM LAYOUT CHANGED HERE --- */}
                  <Form className="bg-white p-6 rounded-lg shadow-md">
                    {/* ID Field (Hidden but managed by Formik) */}
                    <Field type="hidden" name="id" />

                    {/* Technology Ref No (Display Only) - Stays Full Width */}
                    <div className="form-group mb-6">
                      <label className="font-bold block mb-1 text-gray-700">
                        Technology Ref No:
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 text-lg rounded-md bg-gray-200 border border-gray-300"
                        value={technologyRefNo}
                        readOnly
                      />
                    </div>

                    {/* --- START: 2-COLUMN GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                      {/* License Name */}
                      <div className="form-group">
                        <label
                          className="font-bold block mb-1 text-gray-700"
                          htmlFor="licenseName"
                        >
                          Licensee Name <span className="text-red-500">*</span>
                          <span className="block text-sm font-normal text-gray-500">
                            Max. 300 Characters
                          </span>
                        </label>
                        <Field
                          as="textarea"
                          rows="2"
                          name="licenseName"
                          className={`w-full p-2 text-lg rounded-md border ${
                            errors.licenseName && touched.licenseName
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:border-indigo-500 outline-none`}
                        />
                        <ErrorMessage
                          name="licenseName"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Address */}
                      <div className="form-group">
                        <label
                          className="font-bold block mb-1 text-gray-700"
                          htmlFor="address"
                        >
                          Address
                          <span className="block text-sm font-normal text-gray-500">
                            Max. 500 Characters
                          </span>
                        </label>
                        <Field
                          as="textarea"
                          rows="2"
                          name="address"
                          className={`w-full p-2 text-lg rounded-md border ${
                            errors.address && touched.address
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:border-indigo-500 outline-none`}
                        />
                        <ErrorMessage
                          name="address"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Email */}
                      <div className="form-group">
                        <label
                          className="font-bold block mb-1 text-gray-700"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <Field
                          name="email"
                          type="email"
                          className={`w-full p-2 text-lg rounded-md border ${
                            errors.email && touched.email
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:border-indigo-500 outline-none`}
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Contact No */}
                      <div className="form-group">
                        <label
                          className="font-bold block mb-1 text-gray-700"
                          htmlFor="contact"
                        >
                          Contact No
                          <span className="block text-sm font-normal text-gray-500">
                            10 Digits
                          </span>
                        </label>
                        <Field
                          name="contact"
                          type="text"
                          maxLength="10"
                          className={`w-full p-2 text-lg rounded-md border ${
                            errors.contact && touched.contact
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:border-indigo-500 outline-none`}
                        />
                        <ErrorMessage
                          name="contact"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Date of Agreement Signing */}
                      <div className="form-group">
                        <label
                          className="font-bold block mb-1 text-gray-700"
                          htmlFor="dateOfAgreementSigning"
                        >
                          Date of Agreement Signing{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                          selected={values.dateOfAgreementSigning}
                          onChange={(date) =>
                            setFieldValue("dateOfAgreementSigning", date)
                          }
                          dateFormat="dd/MM/yyyy"
                          minDate={minDate}
                          maxDate={maxDate}
                          placeholderText="Select Date"
                          className={`w-full p-2 text-lg rounded-md border ${
                            errors.dateOfAgreementSigning &&
                            touched.dateOfAgreementSigning
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:border-indigo-500 outline-none`}
                        />
                        <ErrorMessage
                          name="dateOfAgreementSigning"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Type of License */}
                      <div className="form-group">
                        <label
                          className="font-bold block mb-1 text-gray-700"
                          htmlFor="typeOfLicense"
                        >
                          Type of License <span className="text-red-500">*</span>
                        </label>
                        <Field
                          as="select"
                          name="typeOfLicense"
                          className={`w-full p-2 text-lg rounded-md border ${
                            errors.typeOfLicense && touched.typeOfLicense
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:border-indigo-500 outline-none bg-white`}
                        >
                          <option value="">--Please Select--</option>
                          <option value="Exclusive">Exclusive</option>
                          <option value="Non-Exclusive">Non-Exclusive</option>
                        </Field>
                        <ErrorMessage
                          name="typeOfLicense"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Regional Geography */}
                      <div className="form-group">
                        <label
                          className="font-bold block mb-1 text-gray-700"
                          htmlFor="staRegionalGeography" // Keep the name used in Formik state
                        >
                          Regional Geography
                        </label>
                        <Field
                          as="select"
                          name="staRegionalGeography" // Keep the name used in Formik state
                          className={`w-full p-2 text-lg rounded-md border ${
                            errors.staRegionalGeography &&
                            touched.staRegionalGeography
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:border-indigo-500 outline-none bg-white`}
                        >
                          <option value="">--Please Select--</option>
                          <option value="North">North</option>
                          <option value="North-East">North-East</option>
                          <option value="East">East</option>
                          <option value="West">West</option>
                          <option value="South">South</option>
                          {/* Add more options if needed */}
                        </Field>
                        <ErrorMessage
                          name="staRegionalGeography" // Keep the name used in Formik state
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Details of Exclusivity */}
                      <div className="form-group">
                        <label
                          className="font-bold block mb-1 text-gray-700"
                          htmlFor="detailsOfExclusivity"
                        >
                          Details of Exclusivity
                          <span className="block text-sm font-normal text-gray-500">
                            Max. 300 Characters
                          </span>
                        </label>
                        <Field
                          as="textarea"
                          rows="2"
                          name="detailsOfExclusivity"
                          maxLength="300"
                          className={`w-full p-2 text-lg rounded-md border ${
                            errors.detailsOfExclusivity &&
                            touched.detailsOfExclusivity
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:border-indigo-500 outline-none`}
                        />
                        <ErrorMessage
                          name="detailsOfExclusivity"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Date of License */}
                      <div className="form-group">
                        <label
                          className="font-bold block mb-1 text-gray-700"
                          htmlFor="dateOfLicense"
                        >
                          Date of License <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                          selected={values.dateOfLicense}
                          onChange={(date) => setFieldValue("dateOfLicense", date)}
                          dateFormat="dd/MM/yyyy"
                          minDate={minDate}
                          maxDate={maxDate}
                          placeholderText="Select Date"
                          className={`w-full p-2 text-lg rounded-md border ${
                            errors.dateOfLicense && touched.dateOfLicense
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:border-indigo-500 outline-none`}
                        />
                        <ErrorMessage
                          name="dateOfLicense"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* License Valid Until */}
                      <div className="form-group">
                        <label
                          className="font-bold block mb-1 text-gray-700"
                          htmlFor="licenseValidUntil"
                        >
                          License Valid Until{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                          selected={values.licenseValidUntil}
                          onChange={(date) =>
                            setFieldValue("licenseValidUntil", date)
                          }
                          dateFormat="dd/MM/yyyy"
                          minDate={minDate} // Or maybe minDate should be dateOfLicense?
                          maxDate={maxDate}
                          placeholderText="Select Date"
                          className={`w-full p-2 text-lg rounded-md border ${
                            errors.licenseValidUntil && touched.licenseValidUntil
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:border-indigo-500 outline-none`}
                        />
                        <ErrorMessage
                          name="licenseValidUntil"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Payment Terms */}
                      <div className="form-group">
                        <label
                          className="font-bold block mb-1 text-gray-700"
                          htmlFor="paymentTerms"
                        >
                          Payment Terms
                          <span className="block text-sm font-normal text-gray-500">
                            Max. 300 Characters
                          </span>
                        </label>
                        <Field
                          as="textarea"
                          rows="2"
                          name="paymentTerms"
                          maxLength="300"
                          className={`w-full p-2 text-lg rounded-md border ${
                            errors.paymentTerms && touched.paymentTerms
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:border-indigo-500 outline-none`}
                        />
                        <ErrorMessage
                          name="paymentTerms"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                    {/* --- END: 2-COLUMN GRID --- */}


                    {/* --- Royalties Section --- */}
                    <div className="form-group p-4 border border-gray-300 rounded-md bg-gray-50 mt-6">
                      <h3 className="text-lg font-semibold mb-3 text-indigo-700">
                        Royalties
                      </h3>
                      {royalty.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-wrap gap-4 mb-4 items-end border-b pb-4"
                        >
                          <div className="flex-1 min-w-[150px]">
                            <label className="block font-semibold text-sm mb-1">
                              Amount:
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-full p-2 rounded border border-gray-300 text-sm focus:border-indigo-500 outline-none"
                              value={item.royaltyAmount}
                              onChange={(e) =>
                                handleRoyaltyChange(
                                  index,
                                  "royaltyAmount",
                                  e.target.value
                                )
                              }
                              placeholder="Enter Amount"
                            />
                          </div>
                          <div className="flex-1 min-w-[150px]">
                            <label className="block font-semibold text-sm mb-1">
                              Date:
                            </label>
                            <DatePicker
                              selected={item.royaltyDate}
                              onChange={(date) =>
                                handleRoyaltyChange(index, "royaltyDate", date)
                              }
                              dateFormat="dd/MM/yyyy"
                              minDate={minDate}
                              maxDate={maxDate}
                              placeholderText="Select Date"
                              className="w-full p-2 rounded border border-gray-300 text-sm focus:border-indigo-500 outline-none"
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => handleRemoveRoyalty(index)}
                              className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                              disabled={royalty.length === 0}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddRoyalty}
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 mt-2"
                      >
                        Add Royalty
                      </button>
                    </div>

                    {/* --- Premia Section (Added) --- */}
                    <div className="form-group p-4 border border-gray-300 rounded-md bg-gray-50 mt-6">
                      <h3 className="text-lg font-semibold mb-3 text-indigo-700">
                        Premia
                      </h3>
                      {premia.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-wrap gap-4 mb-4 items-end border-b pb-4"
                        >
                          <div className="flex-1 min-w-[150px]">
                            <label className="block font-semibold text-sm mb-1">
                              Amount:
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-full p-2 rounded border border-gray-300 text-sm focus:border-indigo-500 outline-none"
                              value={item.premiaAmount}
                              onChange={(e) =>
                                handlePremiaChange(
                                  index,
                                  "premiaAmount",
                                  e.target.value
                                )
                              }
                              placeholder="Enter Amount"
                            />
                          </div>
                          <div className="flex-1 min-w-[150px]">
                            <label className="block font-semibold text-sm mb-1">
                              Date:
                            </label>
                            <DatePicker
                              selected={item.premiaDate}
                              onChange={(date) =>
                                handlePremiaChange(index, "premiaDate", date)
                              }
                              dateFormat="dd/MM/yyyy"
                              minDate={minDate}
                              maxDate={maxDate}
                              placeholderText="Select Date"
                              className="w-full p-2 rounded border border-gray-300 text-sm focus:border-indigo-500 outline-none"
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => handleRemovePremia(index)}
                              className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 disabled:opacity-50" // Corrected opacity class
                              disabled={premia.length === 0}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                                                type="button"
                        onClick={handleAddPremia}
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 mt-2"
                      >
                        Add Premia
                      </button>
                    </div>

                    {/* --- Totals Display (Added) --- */}
                    <div className="form-group p-4 border border-gray-300 rounded-md bg-indigo-50 mt-6">
                      <h3 className="text-lg font-semibold text-indigo-800">
                        License Fee Totals (Current Form)
                      </h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-md">
                          Sub-Total Royalties:{" "}
                          <span className="font-bold float-right">
                            ₹ {subTotalRoyalty.toFixed(2)}
                          </span>
                        </p>
                        <p className="text-md">
                          Sub-Total Premia:{" "}
                          <span className="font-bold float-right">
                            ₹ {subTotalPremia.toFixed(2)}
                          </span>
                        </p>
                        <hr className="my-2" />
                        <p className="text-xl">
                          Grand Total:{" "}
                          <span className="font-bold float-right text-indigo-600">
                            ₹ {grandTotalCurrentForm.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* --- Form Buttons (Added) --- */}
                    <div className="flex justify-between items-center mt-8">
                      <button
                        type="button"
                        onClick={handleAddOrUpdateLicensee}
                        className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                        disabled={!technologyRefNo}
                      >
                        {editingIndex !== null
                          ? "Update Licensee in List"
                          : "Add Licensee to List"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          resetForm({ values: initialLicenseeValues });
                          setRoyalty([{ royaltyAmount: "", royaltyDate: null }]);
                          setPremia([{ premiaAmount: "", premiaDate: null }]);
                          setEditingIndex(null);
                        }}
                        className="bg-gray-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-600"
                      >
                        Clear Form / Cancel Edit
                      </button>
                    </div>
                  </Form>
                </>
              );
            }}
          </Formik>

          {/* --- Navigation/Save Buttons --- */}
          <div className="mt-10 pt-6 border-t-2 border-gray-300 flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              className="bg-gray-600 text-white px-8 py-4 rounded-md text-xl font-bold hover:bg-gray-700"
            >
              ← Previous (Section 2 )
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-700 text-white px-8 py-4 rounded-md text-xl font-bold hover:bg-green-800 disabled:opacity-50"
              disabled={editingIndex !== null}
            >
              {editingIndex !== null
                ? "Finish Editing"
                : "Save All Changes"}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-600 text-white px-8 py-4 rounded-md text-xl font-bold hover:bg-blue-700"
            >
              Next (Section 4 ) →
            </button>
          </div>

        </div>{" "}
        {/* End flex-1 p-8 */}
      </div>{" "}
      {/* End flex */}
      <FooterBar />
    </>
  );
};

export default SectionThree;
