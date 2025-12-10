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
import {
  Users,
  IndianRupee,
  Edit3,
  Trash2,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  SaveAll,
} from "lucide-react";

// Define initial empty state for one licensee form entry
const initialLicenseeValues = {
  id: null,
  licenseName: "",
  address: "",
  email: "",
  contact: "",
  dateOfAgreementSigning: null,
  typeOfLicense: "",
  regionalGeography: "",
  detailsOfExclusivity: "",
  dateOfLicense: null,
  licenseValidUntil: null,
  paymentTerms: "",
};

const SectionThree = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [technologyRefNo] = useState(location.state?.technologyRefNo || "");

  const [licensees, setLicensees] = useState([]);
  const [royalty, setRoyalty] = useState([
    { royaltyAmount: "", royaltyDate: null },
  ]);
  const [premia, setPremia] = useState([
    { premiaAmount: "", premiaDate: null },
  ]);
  const [editingIndex, setEditingIndex] = useState(null);

  const minDate = new Date("1900-08-12");
  const maxDate = new Date("3000-08-12");

  // Fetch existing data
  useEffect(() => {
    if (technologyRefNo) {
      axios
        .get(`http://172.16.2.246:8080/api/section-three/${technologyRefNo}`)
        .then((response) => {
          const formattedLicensees = response.data.map((lic) => {
            const formattedRoyalty = lic.royalty.map((r) => ({
              royaltyAmount: String(r.amount),
              royaltyDate: r.date ? new Date(r.date) : null,
            }));
            const formattedPremia = lic.premia.map((p) => ({
              premiaAmount: String(p.amount),
              premiaDate: p.date ? new Date(p.date) : null,
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
              royalty: formattedRoyalty,
              premia: formattedPremia,
              subTotalRoyalty,
              subTotalPremia,
              totalLicenseFee,
            };
          });
          setLicensees(formattedLicensees);
        })
        .catch((error) => {
          console.error("Error fetching initial Section 3 data:", error);
          if (error.response?.status === 404) {
            setLicensees([]);
          } else {
            Swal.fire("Error", "Could not fetch existing data.", "error");
          }
        });
    }
  }, [technologyRefNo]);

  // Validation
  const validationSchema = Yup.object({
    licenseName: Yup.string()
      .max(300, "Max. 300 characters")
      .required("Required"),
    address: Yup.string().max(500, "Max. 500 characters").nullable(),
    email: Yup.string().email("Invalid email format").nullable(),
    contact: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be 10 digits")
      .nullable(),
    dateOfAgreementSigning: Yup.date().nullable().required("Required"),
    typeOfLicense: Yup.string().required("Required"),
    staRegionalGeography: Yup.string().nullable(),
    detailsOfExclusivity: Yup.string()
      .max(300, "Max. 300 characters")
      .nullable(),
    dateOfLicense: Yup.date().nullable().required("Required"),
    licenseValidUntil: Yup.date().nullable().required("Required"),
    paymentTerms: Yup.string().max(300, "Max. 300 characters").nullable(),
  });

  // Save all
  const handleSubmit = () => {
    if (editingIndex !== null) {
      Swal.fire("Update Pending", "Finish editing before saving.", "warning");
      return;
    }

    const payload = licensees.map((lic) => ({
      ...lic,
      technologyRefNo: technologyRefNo,
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
        payload,
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        Swal.fire("Success!", "Licensees saved successfully!", "success");

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

  // Royalties/Premia handlers
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

  // Navigation
  const handlePrevious = () => {
    navigate("/sectionTwo", { state: { technologyRefNo: technologyRefNo } });
  };

  const handleNext = () => {
    navigate("/sectionFour", { state: { technologyRefNo: technologyRefNo } });
  };

  const handleRemoveLicensee = (indexToRemove) => {
    const licenseeToRemove = licensees[indexToRemove];
    Swal.fire({
      title: "Are you sure?",
      text: `Remove '${licenseeToRemove.licenseName}'? It will be deleted permanently when you click 'Save All'.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLicensees((prevLicensees) =>
          prevLicensees.filter((_, i) => i !== indexToRemove)
        );
        if (editingIndex === indexToRemove) {
          setEditingIndex(null);
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

      <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-sky-200">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-300/40 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-screen">
          {/* Left main content */}
          <div className="w-full md:w-3/4">
            <div className="ml-0 md:ml-60 mr-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
              {/* Section header */}
              <div className="mb-5 md:mb-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 border border-indigo-400/40 text-[11px] font-medium text-indigo-700 uppercase tracking-[0.2em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Section 3
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                    Details of Licensee
                  </h1>
                  <Users className="h-5 w-5 text-indigo-600 hidden sm:block" />
                </div>
                <p className="mt-1 text-xs md:text-sm text-slate-600">
                  Maintain licensee, agreement and financial details for this
                  technology.
                </p>
              </div>

              {/* Optional original Section line */}
              {/* <Section sectionLine="Section 3 : Details of Licensee" /> */}

              <Formik
                initialValues={initialLicenseeValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={() => {}}
              >
                {({
                  setFieldValue,
                  values,
                  validateForm,
                  resetForm,
                  errors,
                  touched,
                }) => {
                  const subTotalRoyalty = royalty.reduce(
                    (acc, cur) => acc + parseFloat(cur.royaltyAmount || 0),
                    0
                  );
                  const subTotalPremia = premia.reduce(
                    (acc, cur) => acc + parseFloat(cur.premiaAmount || 0),
                    0
                  );
                  const grandTotalCurrentForm =
                    subTotalRoyalty + subTotalPremia;

                  const handleEditLoad = (licenseeToEdit, index) => {
                    if (editingIndex !== null && editingIndex !== index) {
                      Swal.fire(
                        "Action Required",
                        "Please save or clear the current form before editing another item.",
                        "warning"
                      );
                      return;
                    }

                    setEditingIndex(index);

                    setFieldValue("id", licenseeToEdit.id || null);
                    setFieldValue("licenseName", licenseeToEdit.licenseName);
                    setFieldValue("address", licenseeToEdit.address || "");
                    setFieldValue("email", licenseeToEdit.email || "");
                    setFieldValue("contact", licenseeToEdit.contact || "");
                    setFieldValue(
                      "dateOfAgreementSigning",
                      licenseeToEdit.dateOfAgreementSigning
                    );
                    setFieldValue("typeOfLicense", licenseeToEdit.typeOfLicense);
                    setFieldValue(
                      "staRegionalGeography",
                      licenseeToEdit.staRegionalGeography
                    );
                    setFieldValue(
                      "detailsOfExclusivity",
                      licenseeToEdit.detailsOfExclusivity || ""
                    );
                    setFieldValue(
                      "dateOfLicense",
                      licenseeToEdit.dateOfLicense
                    );
                    setFieldValue(
                      "licenseValidUntil",
                      licenseeToEdit.licenseValidUntil
                    );
                    setFieldValue(
                      "paymentTerms",
                      licenseeToEdit.paymentTerms || ""
                    );

                    setRoyalty(
                      licenseeToEdit.royalty &&
                        licenseeToEdit.royalty.length > 0
                        ? licenseeToEdit.royalty
                        : [{ royaltyAmount: "", royaltyDate: null }]
                    );
                    setPremia(
                      licenseeToEdit.premia &&
                        licenseeToEdit.premia.length > 0
                        ? licenseeToEdit.premia
                        : [{ premiaAmount: "", premiaDate: null }]
                    );

                    Swal.fire(
                      "Editing",
                      `Now editing: ${licenseeToEdit.licenseName}`,
                      "info"
                    );
                  };

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
                      id: values.id,
                      licenseName: values.licenseName,
                      address: values.address,
                      email: values.email,
                      contact: values.contact,
                      dateOfAgreementSigning: values.dateOfAgreementSigning,
                      typeOfLicense: values.typeOfLicense,
                      staRegionalGeography: values.staRegionalGeography,
                      detailsOfExclusivity: values.detailsOfExclusivity,
                      dateOfLicense: values.dateOfLicense,
                      licenseValidUntil: values.licenseValidUntil,
                      paymentTerms: values.paymentTerms,
                      royalty: royalty,
                      premia: premia,
                      subTotalRoyalty: subTotalRoyalty,
                      subTotalPremia: subTotalPremia,
                      totalLicenseFee: grandTotalCurrentForm,
                    };

                    if (editingIndex !== null) {
                      const updatedLicensees = [...licensees];
                      updatedLicensees[editingIndex] = licenseeData;
                      setLicensees(updatedLicensees);
                      Swal.fire(
                        "Updated",
                        "Licensee updated in the list. Click 'Save All Changes' to finalize.",
                        "success"
                      );
                    } else {
                      setLicensees((prev) => [...prev, licenseeData]);
                      Swal.fire(
                        "Added",
                        "Licensee added to the list. Click 'Save All Changes' to finalize.",
                        "success"
                      );
                    }

                    resetForm({ values: initialLicenseeValues });
                    setRoyalty([{ royaltyAmount: "", royaltyDate: null }]);
                    setPremia([{ premiaAmount: "", premiaDate: null }]);
                    setEditingIndex(null);
                  };

                  return (
                    <>
                      {/* Current Licensees List */}
                      {licensees.length > 0 && (
                        <div className="mb-6 p-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-sky-50 to-indigo-100 shadow-md">
                          <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center text-slate-900">
                            <Users className="w-5 h-5 mr-2 text-indigo-600" />
                            Current Licensees ({licensees.length})
                          </h3>
                          <div className="space-y-3">
                            {licensees.map((lic, index) => (
                              <div
                                key={lic.id || `temp-${index}`}
                                className={`p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center border transition-all duration-200 ${
                                  editingIndex === index
                                    ? "bg-yellow-50 border-yellow-400 shadow-md"
                                    : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md"
                                }`}
                              >
                                <div className="flex-1 mb-3 sm:mb-0">
                                  <div className="flex items-center mb-1 gap-2 flex-wrap">
                                    <span className="text-sm md:text-base font-semibold text-slate-900">
                                      {index + 1}. {lic.licenseName}
                                    </span>
                                    {lic.id && (
                                      <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full">
                                        ID: {lic.id}
                                      </span>
                                    )}
                                    {editingIndex === index && (
                                      <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                                        Editing…
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs md:text-sm text-slate-600 space-y-0.5">
                                    <p>
                                      <span className="font-semibold">
                                        Type:
                                      </span>{" "}
                                      {lic.typeOfLicense || "N/A"}
                                    </p>
                                    <p>
                                      <span className="font-semibold">
                                        Signed:
                                      </span>{" "}
                                      {lic.dateOfAgreementSigning
                                        ? lic.dateOfAgreementSigning.toLocaleDateString()
                                        : "N/A"}
                                    </p>
                                    <p className="flex items-center gap-1">
                                      <span className="font-semibold">
                                        Total Fee:
                                      </span>
                                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                                        <IndianRupee className="h-3 w-3" />
                                        {lic.totalLicenseFee?.toFixed(2) ||
                                          "0.00"}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEditLoad(lic, index)}
                                    className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-xs md:text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
                                    disabled={
                                      editingIndex !== null &&
                                      editingIndex !== index
                                    }
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                    {editingIndex === index
                                      ? "Editing"
                                      : "Edit"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveLicensee(index)}
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

                      {/* Main form card */}
                      <Form className="bg-white/95 p-5 md:p-7 rounded-2xl shadow-2xl border border-slate-100 space-y-6">
                        <Field type="hidden" name="id" />

                        {/* Technology Ref */}
                        <div className="mb-4">
                          <label className="font-semibold block mb-1 text-slate-800 text-sm">
                            Technology Ref No:
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-sm md:text-base text-slate-700"
                            value={technologyRefNo}
                            readOnly
                          />
                        </div>

                        {/* 2-column grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                          {/* License Name */}
                          <div>
                            <label
                              className="font-semibold block mb-1 text-slate-800 text-sm"
                              htmlFor="licenseName"
                            >
                              Licensee Name{" "}
                              <span className="text-red-500">*</span>
                              <span className="block text-[11px] font-normal text-slate-500">
                                Max. 300 characters
                              </span>
                            </label>
                            <Field
                              as="textarea"
                              rows="2"
                              name="licenseName"
                              className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                                errors.licenseName && touched.licenseName
                                  ? "border-red-500"
                                  : "border-slate-300"
                              }`}
                            />
                            <ErrorMessage
                              name="licenseName"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          {/* Address */}
                          <div>
                            <label
                              className="font-semibold block mb-1 text-slate-800 text-sm"
                              htmlFor="address"
                            >
                              Address
                              <span className="block text-[11px] font-normal text-slate-500">
                                Max. 500 characters
                              </span>
                            </label>
                            <Field
                              as="textarea"
                              rows="2"
                              name="address"
                              className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                                errors.address && touched.address
                                  ? "border-red-500"
                                  : "border-slate-300"
                              }`}
                            />
                            <ErrorMessage
                              name="address"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label
                              className="font-semibold block mb-1 text-slate-800 text-sm"
                              htmlFor="email"
                            >
                              Email
                            </label>
                            <Field
                              name="email"
                              type="email"
                              className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                                errors.email && touched.email
                                  ? "border-red-500"
                                  : "border-slate-300"
                              }`}
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          {/* Contact */}
                          <div>
                            <label
                              className="font-semibold block mb-1 text-slate-800 text-sm"
                              htmlFor="contact"
                            >
                              Contact No
                              <span className="block text-[11px] font-normal text-slate-500">
                                10 digits
                              </span>
                            </label>
                            <Field
                              name="contact"
                              type="text"
                              maxLength="10"
                              className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                                errors.contact && touched.contact
                                  ? "border-red-500"
                                  : "border-slate-300"
                              }`}
                            />
                            <ErrorMessage
                              name="contact"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          {/* Date of Agreement Signing */}
                          <div>
                            <label className="font-semibold block mb-1 text-slate-800 text-sm">
                              Date of Agreement Signing{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <DatePicker
                              selected={values.dateOfAgreementSigning}
                              onChange={(date) =>
                                setFieldValue(
                                  "dateOfAgreementSigning",
                                  date
                                )
                              }
                              dateFormat="dd/MM/yyyy"
                              minDate={minDate}
                              maxDate={maxDate}
                              placeholderText="Select date"
                              className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                                errors.dateOfAgreementSigning &&
                                touched.dateOfAgreementSigning
                                  ? "border-red-500"
                                  : "border-slate-300"
                              }`}
                            />
                            <ErrorMessage
                              name="dateOfAgreementSigning"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          {/* Type of License */}
                          <div>
                            <label className="font-semibold block mb-1 text-slate-800 text-sm">
                              Type of License{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Field
                              as="select"
                              name="typeOfLicense"
                              className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                                errors.typeOfLicense && touched.typeOfLicense
                                  ? "border-red-500"
                                  : "border-slate-300"
                              }`}
                            >
                              <option value="">--Please Select--</option>
                              <option value="Exclusive">Exclusive</option>
                              <option value="Non-Exclusive">
                                Non-Exclusive
                              </option>
                            </Field>
                            <ErrorMessage
                              name="typeOfLicense"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          {/* Regional Geography */}
                          <div>
                            <label className="font-semibold block mb-1 text-slate-800 text-sm">
                              Regional Geography
                            </label>
                            <Field
                              as="select"
                              name="staRegionalGeography"
                              className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                                errors.staRegionalGeography &&
                                touched.staRegionalGeography
                                  ? "border-red-500"
                                  : "border-slate-300"
                              }`}
                            >
                              <option value="">--Please Select--</option>
                              <option value="North">North</option>
                              <option value="North-East">North-East</option>
                              <option value="East">East</option>
                              <option value="West">West</option>
                              <option value="South">South</option>
                            </Field>
                            <ErrorMessage
                              name="staRegionalGeography"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          {/* Details of Exclusivity */}
                          <div>
                            <label className="font-semibold block mb-1 text-slate-800 text-sm">
                              Details of Exclusivity
                              <span className="block text-[11px] font-normal text-slate-500">
                                Max. 300 characters
                              </span>
                            </label>
                            <Field
                              as="textarea"
                              rows="2"
                              name="detailsOfExclusivity"
                              maxLength="300"
                              className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                                errors.detailsOfExclusivity &&
                                touched.detailsOfExclusivity
                                  ? "border-red-500"
                                  : "border-slate-300"
                              }`}
                            />
                            <ErrorMessage
                              name="detailsOfExclusivity"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          {/* Date of License */}
                          <div>
                            <label className="font-semibold block mb-1 text-slate-800 text-sm">
                              Date of License{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <DatePicker
                              selected={values.dateOfLicense}
                              onChange={(date) =>
                                setFieldValue("dateOfLicense", date)
                              }
                              dateFormat="dd/MM/yyyy"
                              minDate={minDate}
                              maxDate={maxDate}
                              placeholderText="Select date"
                              className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                                errors.dateOfLicense && touched.dateOfLicense
                                  ? "border-red-500"
                                  : "border-slate-300"
                              }`}
                            />
                            <ErrorMessage
                              name="dateOfLicense"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          {/* License Valid Until */}
                          <div>
                            <label className="font-semibold block mb-1 text-slate-800 text-sm">
                              License Valid Until{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <DatePicker
                              selected={values.licenseValidUntil}
                              onChange={(date) =>
                                setFieldValue("licenseValidUntil", date)
                              }
                              dateFormat="dd/MM/yyyy"
                              minDate={minDate}
                              maxDate={maxDate}
                              placeholderText="Select date"
                              className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                                errors.licenseValidUntil &&
                                touched.licenseValidUntil
                                  ? "border-red-500"
                                  : "border-slate-300"
                              }`}
                            />
                            <ErrorMessage
                              name="licenseValidUntil"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          {/* Payment Terms */}
                          <div>
                            <label className="font-semibold block mb-1 text-slate-800 text-sm">
                              Payment Terms
                              <span className="block text-[11px] font-normal text-slate-500">
                                Max. 300 characters
                              </span>
                            </label>
                            <Field
                              as="textarea"
                              rows="2"
                              name="paymentTerms"
                              maxLength="300"
                              className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                                errors.paymentTerms && touched.paymentTerms
                                  ? "border-red-500"
                                  : "border-slate-300"
                              }`}
                            />
                            <ErrorMessage
                              name="paymentTerms"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>
                        </div>

                        {/* Royalties */}
                        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <h3 className="text-sm md:text-base font-semibold text-indigo-800 mb-3 flex items-center gap-1">
                            Royalties
                          </h3>
                          {royalty.map((item, index) => (
                            <div
                              key={index}
                              className="flex flex-wrap gap-4 mb-3 items-end border-b border-slate-200 pb-3 last:border-b-0 last:pb-0"
                            >
                              <div className="flex-1 min-w-[150px]">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Amount
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-full rounded-lg border border-slate-300 p-2 text-xs md:text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
                                  value={item.royaltyAmount}
                                  onChange={(e) =>
                                    handleRoyaltyChange(
                                      index,
                                      "royaltyAmount",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter amount"
                                />
                              </div>
                              <div className="flex-1 min-w-[150px]">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Date
                                </label>
                                <DatePicker
                                  selected={item.royaltyDate}
                                  onChange={(date) =>
                                    handleRoyaltyChange(
                                      index,
                                      "royaltyDate",
                                      date
                                    )
                                  }
                                  dateFormat="dd/MM/yyyy"
                                  minDate={minDate}
                                  maxDate={maxDate}
                                  placeholderText="Select date"
                                  className="w-full rounded-lg border border-slate-300 p-2 text-xs md:text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
                                />
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRoyalty(index)}
                                  className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                                  disabled={royalty.length === 0}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={handleAddRoyalty}
                            className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-4 py-1.5 text-xs md:text-sm font-semibold text-white hover:bg-emerald-600"
                          >
                            <PlusCircle className="h-4 w-4" />
                            Add Royalty
                          </button>
                        </div>

                        {/* Premia */}
                        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <h3 className="text-sm md:text-base font-semibold text-indigo-800 mb-3 flex items-center gap-1">
                            Premia
                          </h3>
                          {premia.map((item, index) => (
                            <div
                              key={index}
                              className="flex flex-wrap gap-4 mb-3 items-end border-b border-slate-200 pb-3 last:border-b-0 last:pb-0"
                            >
                              <div className="flex-1 min-w-[150px]">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Amount
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-full rounded-lg border border-slate-300 p-2 text-xs md:text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
                                  value={item.premiaAmount}
                                  onChange={(e) =>
                                    handlePremiaChange(
                                      index,
                                      "premiaAmount",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter amount"
                                />
                              </div>
                              <div className="flex-1 min-w-[150px]">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Date
                                </label>
                                <DatePicker
                                  selected={item.premiaDate}
                                  onChange={(date) =>
                                    handlePremiaChange(
                                      index,
                                      "premiaDate",
                                      date
                                    )
                                  }
                                  dateFormat="dd/MM/yyyy"
                                  minDate={minDate}
                                  maxDate={maxDate}
                                  placeholderText="Select date"
                                  className="w-full rounded-lg border border-slate-300 p-2 text-xs md:text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
                                />
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePremia(index)}
                                  className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                                  disabled={premia.length === 0}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={handleAddPremia}
                            className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-4 py-1.5 text-xs md:text-sm font-semibold text-white hover:bg-emerald-600"
                          >
                            <PlusCircle className="h-4 w-4" />
                            Add Premia
                          </button>
                        </div>

                        {/* Totals */}
                        <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                          <h3 className="text-sm md:text-base font-semibold text-indigo-900 mb-2 flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            License Fee Totals (Current Form)
                          </h3>
                          <div className="space-y-1 text-xs md:text-sm text-slate-800">
                            <p>
                              Sub-Total Royalties
                              <span className="float-right font-semibold">
                                ₹ {subTotalRoyalty.toFixed(2)}
                              </span>
                            </p>
                            <p>
                              Sub-Total Premia
                              <span className="float-right font-semibold">
                                ₹ {subTotalPremia.toFixed(2)}
                              </span>
                            </p>
                            <hr className="my-1" />
                            <p className="text-base">
                              Grand Total
                              <span className="float-right font-bold text-indigo-700">
                                ₹ {grandTotalCurrentForm.toFixed(2)}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Form buttons */}
                        <div className="mt-6 flex flex-wrap gap-3 justify-between">
                          <button
                            type="button"
                            onClick={handleAddOrUpdateLicensee}
                            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs md:text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
                            disabled={!technologyRefNo}
                          >
                            <PlusCircle className="h-4 w-4" />
                            {editingIndex !== null
                              ? "Update Licensee in List"
                              : "Add Licensee to List"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              resetForm({ values: initialLicenseeValues });
                              setRoyalty([
                                { royaltyAmount: "", royaltyDate: null },
                              ]);
                              setPremia([
                                { premiaAmount: "", premiaDate: null },
                              ]);
                              setEditingIndex(null);
                            }}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-500 px-5 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-slate-600"
                          >
                            Clear Form / Cancel Edit
                          </button>
                        </div>
                      </Form>
                    </>
                  );
                }}
              </Formik>

              {/* Navigation buttons */}
              <div className="mt-8 pt-5 border-t border-slate-200 flex flex-wrap gap-3 justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-600 px-5 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-slate-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous (Section 2)
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-md shadow-emerald-400/40"
                  disabled={editingIndex !== null}
                >
                  <SaveAll className="h-4 w-4" />
                  {editingIndex !== null
                    ? "Finish Editing"
                    : "Save All Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Next (Section 4)
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right info panel */}
          <div className="hidden md:flex md:w-1/4 items-start justify-center pr-6 py-10">
            <div className="w-full max-w-xs rounded-3xl bg-white/50 backdrop-blur-2xl border border-white/70 shadow-xl px-5 py-6 space-y-4 text-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-700">
                    Section 3 Guide
                  </p>
                  <p className="text-sm font-medium">
                    Licensee & Financials
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-700">
                Capture accurate licensee info, agreement dates and financial
                flows. These details are critical for audits and reporting.
              </p>

              <ul className="space-y-1.5 text-[11px] text-slate-700">
                <li>• Add each licensee separately to the list.</li>
                <li>• Use royalties & premia blocks to capture payments.</li>
                <li>
                  • Click <b>Save All Changes</b> before moving to Section 4.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <FooterBar />
    </>
  );
};

export default SectionThree;
