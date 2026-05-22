// import React from "react";
// import axios from "axios";
// import NavBar from "Components/common/navBar";
// import FooterBar from "Components/common/footer";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import CustomSelect from "../utils/CustomSelect";
// import { sectionOneValidationSchema } from "../section/SectionOneValidation";
// import Swal from "sweetalert2";
// import DatePicker from "react-datepicker";
// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import "react-datepicker/dist/react-datepicker.css";
// import { industrialSectorOptions } from "Components/data/industrialSector";
// import { potentialMinistryOptions } from "Components/data/potentialMinistries";
// import { themeOptions } from "Components/data/theme";
// import { labOptions } from "Components/data/lab";
// import { potentialApplicationAreaOptions } from "Components/data/potentialApplicationAreas";
// import { labDetails } from "Components/data/labDetails";
// import FileViewerModal from "Components/pages/view/FileViewerModal";

// import {
//   SparklesIcon,
//   ClipboardDocumentCheckIcon,
// } from "@heroicons/react/24/outline";

// const SectionOne = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { technologyRefNo: paramTRN } = useParams();
//   const passedTRN = paramTRN || location.state?.technologyRefNo || "";
//   const [generatedRefNo, setGeneratedRefNo] = useState(passedTRN);
//   const [loading, setLoading] = useState(!!passedTRN);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [fileToView, setFileToView] = useState("");
//   const [existingFileUrl, setExistingFileUrl] = useState("");
//   const [isFileRemoved, setIsFileRemoved] = useState(false);

//   const [initialValues, setInitialValues] = useState({
//     id: null,
//     technologyRefNo: "",
//     keywordTechnology: "",
//     nameTechnology: "",
//     industrialSector: [],
//     theme: [],
//     multiLabInstitute: "No",
//     leadLaboratory: null,
//     lab: [],
//     technologyLevel: "",
//     scaleStage: "",
//     labScaleDate: "",
//     benchScaleDate: "",
//     pilotScaleDate: "",
//     industrialScaleDate: "",
//     scaleDevelopment: "",
//     yearDevelopment: "",
//     briefTech: "",
//     competitivePosition: "",
//     technoEconomics: "",
//     potentialApplicationAreas: [],
//     potentialMinistries: [],
//     environmentalStatutory: "",
//     marketPotential: "",
//     file: null,
//     laboratoryDetail: null,

//   });

//   // --- Prefill / Edit data ---
//   useEffect(() => {
//     if (passedTRN) {
//       setLoading(true);
//       const token = localStorage.getItem("token");
      
//       axios
//         .get(`http://172.16.2.246:8282/api/section-one/${passedTRN}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           const fetchedData = res.data;

//           const processToArray = (input) => {
//             if (!input) return [];
//             if (Array.isArray(input)) return input;
//             if (typeof input === "string") {
//               return input.split("|").filter(Boolean);
//             }
//             return [];
//           };

//           const cleanedIndustrialSectors = processToArray(
//             fetchedData.industrialSector
//           );
//           const cleanedThemes = processToArray(fetchedData.theme);
//           const cleanedLabs = processToArray(fetchedData.lab);
//           const cleanedAppAreas = processToArray(
//             fetchedData.potentialApplicationAreas
//           );
//           const cleanedMinistries = processToArray(
//             fetchedData.potentialMinistries
//           );

//           const formattedValues = {
//             ...fetchedData,
//             leadLaboratory:
//               labOptions.find(
//                 (opt) => opt.value === fetchedData.leadLaboratory
//               ) || null,
//             laboratoryDetail:
//               labDetails.find(
//                 (opt) => opt.value === fetchedData.laboratoryDetail
//               ) || null,
//             industrialSector: industrialSectorOptions.filter((opt) =>
//               cleanedIndustrialSectors.includes(opt.value)
//             ),
//             theme: themeOptions.filter((opt) =>
//               cleanedThemes.includes(opt.value)
//             ),
//             lab: labOptions.filter((opt) => cleanedLabs.includes(opt.value)),
//             potentialApplicationAreas:
//               potentialApplicationAreaOptions.filter((opt) =>
//                 cleanedAppAreas.includes(opt.value)
//               ),
//             potentialMinistries: potentialMinistryOptions.filter((opt) =>
//               cleanedMinistries.includes(opt.value)
//             ),
//             multiLabInstitute:
//               fetchedData.multiLabInstitute === "Yes" ||
//                 fetchedData.multiLabInstitute === true
//                 ? "Yes"
//                 : "No",
//             keywordTechnology: fetchedData.keywordTechnology || "",
//             yearDevelopment: fetchedData.yearDevelopment
//               ? String(fetchedData.yearDevelopment)
//               : "",
//             technologyLevel: fetchedData.technologyLevel
//               ? String(fetchedData.technologyLevel)
//               : "",
//             file: null,
//           };

//           setInitialValues(formattedValues);
//           setGeneratedRefNo(passedTRN);
//           setExistingFileUrl(fetchedData.fileUrl || "");
//           setIsFileRemoved(false);
//         })
//         .catch((err) => {
//           console.error("Error fetching section one data", err);
//           Swal.fire("Error", "Could not fetch existing data.", "error");
//           navigate("/ViewTechnology");
//         })
//         .finally(() => setLoading(false));
//     } else {
//       // New entry
//       setInitialValues({
//         id: null,
//         technologyRefNo: "",
//         keywordTechnology: "",
//         nameTechnology: "",
//         industrialSector: [],
//         theme: [],
//         multiLabInstitute: "No",
//         leadLaboratory: null,
//         lab: [],
//         technologyLevel: "",
//         scaleStage: "",
//         labScaleDate: "",
//         benchScaleDate: "",
//         pilotScaleDate: "",
//         industrialScaleDate: "",
//         yearDevelopment: "",
//         briefTech: "",
//         competitivePosition: "",
//         technoEconomics: "",
//         potentialApplicationAreas: [],
//         potentialMinistries: [],
//         environmentalStatutory: "",
//         marketPotential: "",
//         file: null,
//         laboratoryDetail: null,
//       });
//       setGeneratedRefNo("");
//       setExistingFileUrl("");
//       setIsFileRemoved(false);
//       setLoading(false);
//     }
//   }, [passedTRN, navigate]);
//   // --- File handlers ---
//   const handleViewFile = () => {
//     if (existingFileUrl) {
//       const viewUrl = existingFileUrl.replace("/download/", "/view/");
//       setFileToView(viewUrl);
//       setIsModalOpen(true);
//     } else {
//       Swal.fire("Info", "No file available to view.", "info");
//     }
//   };

//   const handleRemoveFile = (setFieldValue) => {
//     Swal.fire({
//       title: "Remove Existing File?",
//       text: "This will mark the file for removal upon saving. Upload a new file if needed.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       confirmButtonText: "Yes, remove it",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setExistingFileUrl("");
//         setIsFileRemoved(true);
//         setFieldValue("file", null);
//       }
//     });
//   };

//   // --- Submit ---
//   const handleSubmit = (values, { setSubmitting }, action) => {
//     const isUpdate = !!passedTRN;

//     Swal.fire({
//       title: "Confirm Submission?",
//       text: isUpdate ? "Update this technology?" : "Submit this new technology?",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#4F46E5",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Submit!",
//     }).then((result) => {
//       if (!result.isConfirmed) {
//         setSubmitting(false);
//         return;
//       }

//       const formData = new FormData();

//       Object.keys(values).forEach((key) => {
//         const value = values[key];

//         if (key === "file" && value instanceof File) {
//           formData.append("file", value);
//         } else if (key === "leadLaboratory" || key === "laboratoryDetail") {
//           if (value && typeof value === "object" && value.value) {
//             formData.append(key, value.value);
//           } else if (typeof value === "string") {
//             formData.append(key, value);
//           }
//         } else if (
//           [
//             "industrialSector",
//             "theme",
//             "lab",
//             "potentialApplicationAreas",
//             "potentialMinistries",
//           ].includes(key)
//         ) {
//           if (Array.isArray(value) && value.length > 0) {
//             const list = value
//               .map((v) => v?.value ?? "")
//               .filter(Boolean)
//               .join("|");
//             formData.append(key, list);
//           }
//         } else if (
//           value !== null &&
//           value !== undefined &&
//           typeof value !== "object" &&
//           key !== "file"
//         ) {
//           formData.append(key, value);
//         }
//       });

//       if (values.id) {
//         formData.append("id", values.id);
//       }

//       if (isFileRemoved) {
//         formData.append("isFileRemoved", "true");
//       }

//       const token = localStorage.getItem("token");
//       const headers = {
//         Authorization: `Bearer ${token}`,
//       };

//       let requestPromise;
//       if (isUpdate) {
//         const updateUrl = `http://172.16.2.246:8282/api/section-one/update/${passedTRN}`;
//         requestPromise = axios.put(updateUrl, formData, { headers });
//       } else {
//         const createUrl = "http://172.16.2.246:8282/api/section-one/create";
//         requestPromise = axios.post(createUrl, formData, { headers });
//       }

//       requestPromise
//         .then((res) => {
//           const techRef = res.data.technologyRefNo;
//           setGeneratedRefNo(techRef);

//           Swal.fire(
//             "Success!",
//             `Technology ${isUpdate ? "updated" : "saved"}! TRN: ${techRef}`,
//             "success"
//           );

//           if (action === "next") {
//             navigate("/sectionTwo", { state: { technologyRefNo: techRef } });
//           }
//         })
//         .catch((err) => {
//           Swal.fire(
//             "Error!",
//             err.response?.data?.message ||
//             `Failed to ${isUpdate ? "update" : "submit"}.`,
//             "error"
//           );
//         })
//         .finally(() => setSubmitting(false));
//     });
//   };

//   if (loading && passedTRN) {
//     return (
//       <>
//         <NavBar />
//         <div className="min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-sky-200 flex items-center justify-center">
//           <p className="text-center text-slate-700">
//             Loading existing data...
//           </p>
//         </div>
//         <FooterBar />
//       </>
//     );
//   }

//   const defaultAction = passedTRN ? "updateOnly" : "next";

//   return (
//     <>
//       <NavBar />

//       {/* Same background style as SectionTwo */}
//       <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-sky-200">
//         {/* Soft blobs */}
//         <div className="pointer-events-none absolute inset-0">
//           <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />
//           <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-300/40 blur-3xl" />
//         </div>

//         <div className="relative z-10 flex min-h-screen">
//           {/* Left main content (75%) */}
//           <div className="w-full md:w-3/4">
//             <div className="ml-0 md:ml-60 mr-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
//               {/* Heading style same family as SectionTwo */}
//               <div className="mb-5 md:mb-7">
//                 <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 border border-indigo-400/40 text-[11px] font-medium text-indigo-700 uppercase tracking-[0.2em]">
//                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                   Section 1
//                 </div>
//                 <div className="mt-3 flex items-center gap-3">
//                   <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
//                     Key Details of the Technology / Knowhow
//                   </h1>
//                   {SparklesIcon && (
//                     <SparklesIcon className="h-5 w-5 text-indigo-400 hidden sm:block" />
//                   )}
//                 </div>
//                 <p className="mt-1 text-xs md:text-sm text-slate-600">
//                   Start by capturing the core details of your technology. You can
//                   always refine other sections later.
//                 </p>
//               </div>

//               <Formik
//                 enableReinitialize
//                 initialValues={initialValues}
//                 validationSchema={sectionOneValidationSchema}
//                 onSubmit={(values, formikHelpers) =>
//                   handleSubmit(values, formikHelpers, defaultAction)
//                 }
//               >
//                 {({
//                   values,
//                   setFieldValue,
//                   isSubmitting,
//                   errors,
//                   touched,
//                 }) => (
//                   <Form className="space-y-6 rounded-2xl border border-slate-100/70 bg-white/95 shadow-2xl px-4 py-5 md:px-8 md:py-7">
//                     {/* Technology Ref No */}
//                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                       <div className="md:col-span-2">
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Technology Ref No
//                         </label>
//                         <input
//                           type="text"
//                           value={
//                             generatedRefNo ||
//                             "Will be generated after submission"
//                           }
//                           readOnly
//                           className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm md:text-base text-slate-600"
//                         />
//                       </div>
//                     </div>

//                     {/* Main grid */}
//                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                       {/* Name of Technology */}
//                       <div className="md:col-span-2">
//                         <label
//                           htmlFor="nameTechnology"
//                           className="mb-1 block text-sm font-semibold text-slate-800"
//                         >
//                           Name of Technology{" "}
//                           <span className="text-red-500">*</span>
//                           <span className="block text-xs font-normal text-slate-500">
//                             Max. 500 characters
//                           </span>
//                         </label>
//                         <Field
//                           name="nameTechnology"
//                           as="textarea"
//                           rows="3"
//                           className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${errors.nameTechnology && touched.nameTechnology
//                             ? "border-red-500"
//                             : "border-slate-300"
//                             }`}
//                         />
//                         <ErrorMessage
//                           name="nameTechnology"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>

//                       {/* Keywords */}
//                       <div className="md:col-span-2">
//                         <label
//                           htmlFor="keywordTechnology"
//                           className="mb-1 block text-sm font-semibold text-slate-800"
//                         >
//                           Keywords <span className="text-red-500">*</span>
//                           <span className="block text-xs font-normal text-slate-500">
//                             Comma-separated, 5–8 words, Max 200 characters
//                           </span>
//                         </label>
//                         <Field
//                           type="text"
//                           name="keywordTechnology"
//                           maxLength="200"
//                           className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${errors.keywordTechnology &&
//                             touched.keywordTechnology
//                             ? "border-red-500"
//                             : "border-slate-300"
//                             }`}
//                         />
//                         <ErrorMessage
//                           name="keywordTechnology"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>

//                       {/* Industrial Sector */}
//                       <div>
//                         <label
//                           htmlFor="industrialSector"
//                           className="mb-1 block text-sm font-semibold text-slate-800"
//                         >
//                           Industrial Sector(s)
//                         </label>
//                         <Field
//                           name="industrialSector"
//                           options={industrialSectorOptions}
//                           component={CustomSelect}
//                           placeholder="Select sector(s)..."
//                           isMulti
//                         />
//                         <ErrorMessage
//                           name="industrialSector"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>

//                       {/* Theme */}
//                       <div>
//                         <label
//                           htmlFor="theme"
//                           className="mb-1 block text-sm font-semibold text-slate-800"
//                         >
//                           Theme(s) <span className="text-red-500">*</span>
//                         </label>
//                         <Field
//                           name="theme"
//                           options={themeOptions}
//                           component={CustomSelect}
//                           placeholder="Select theme(s)..."
//                           isMulti
//                           className={
//                             errors.theme && touched.theme
//                               ? "react-select-error"
//                               : ""
//                           }
//                         />
//                         <ErrorMessage
//                           name="theme"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>

//                       {/* Lead Laboratory */}
//                       <div>
//                         <label
//                           htmlFor="leadLaboratory"
//                           className="mb-1 block text-sm font-semibold text-slate-800"
//                         >
//                           Lead Laboratory / Institute{" "}
//                           <span className="text-red-500">*</span>
//                         </label>
//                         <Field
//                           name="leadLaboratory"
//                           options={labOptions}
//                           component={CustomSelect}
//                           placeholder="Select lead lab..."
//                           className={
//                             errors.leadLaboratory && touched.leadLaboratory
//                               ? "react-select-error"
//                               : ""
//                           }
//                         />
//                         <ErrorMessage
//                           name="leadLaboratory"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>

//                       {/* Multi-lab radio */}
//                       <div className="rounded-lg border bg-slate-50 p-3.5">
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Multi Laboratories Involved?{" "}
//                           <span className="text-red-500">*</span>
//                         </label>
//                         <div className="mt-1 flex gap-4">
//                           <label className="flex items-center text-xs md:text-sm text-slate-700">
//                             <Field
//                               type="radio"
//                               name="multiLabInstitute"
//                               value="Yes"
//                               className="mr-2"
//                             />
//                             Yes
//                           </label>
//                           <label className="flex items-center text-xs md:text-sm text-slate-700">
//                             <Field
//                               type="radio"
//                               name="multiLabInstitute"
//                               value="No"
//                               className="mr-2"
//                             />
//                             No
//                           </label>
//                         </div>
//                         <ErrorMessage
//                           name="multiLabInstitute"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>

//                       {/* TRL */}
//                       <div>
//                         <label
//                           htmlFor="technologyLevel"
//                           className="mb-1 block text-sm font-semibold text-slate-800"
//                         >
//                           TRL <span className="text-red-500">*</span>
//                         </label>
//                         <Field
//                           as="select"
//                           name="technologyLevel"
//                           className={`w-full rounded-lg border bg-white p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${errors.technologyLevel && touched.technologyLevel
//                             ? "border-red-500"
//                             : "border-slate-300"
//                             }`}
//                         >
//                           <option value="" label="Select TRL (0–9)" />
//                           {[...Array(10).keys()].map((i) => (
//                             <option key={i} value={String(i)}>
//                               {i}
//                             </option>
//                           ))}
//                         </Field>
//                         <ErrorMessage
//                           name="technologyLevel"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>

//                       {/* Associated Labs */}
//                       {values.multiLabInstitute === "Yes" && (
//                         <div className="md:col-span-2">
//                           <label
//                             htmlFor="lab"
//                             className="mb-1 block text-sm font-semibold text-slate-800"
//                           >
//                             Specify Associated Labs{" "}
//                             <span className="text-red-500">*</span>
//                           </label>
//                           <Field
//                             name="lab"
//                             options={labOptions}
//                             component={CustomSelect}
//                             placeholder="Select associated lab(s)..."
//                             isMulti
//                             className={
//                               errors.lab && touched.lab
//                                 ? "react-select-error"
//                                 : ""
//                             }
//                           />
//                           <ErrorMessage
//                             name="lab"
//                             component="div"
//                             className="mt-1 text-xs text-red-500"
//                           />
//                         </div>
//                       )}

//                       {/* Year of Development */}
//                       <div>
//                         <label
//                           htmlFor="yearDevelopment"
//                           className="mb-1 block text-sm font-semibold text-slate-800"
//                         >
//                           Year of Development{" "}
//                           <span className="text-red-500">*</span>
//                           <span className="block text-xs font-normal text-slate-500">
//                             YYYY
//                           </span>
//                         </label>
//                         <Field name="yearDevelopment">
//                           {({ field, form }) => (
//                             <DatePicker
//                               selected={
//                                 field.value
//                                   ? new Date(field.value, 0, 1)
//                                   : null
//                               }
//                               onChange={(date) => {
//                                 const year = date?.getFullYear();
//                                 form.setFieldValue(field.name, year);
//                               }}
//                               showYearPicker
//                               dateFormat="yyyy"
//                               placeholderText="Select year..."
//                               className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${form.errors.yearDevelopment &&
//                                 form.touched.yearDevelopment
//                                 ? "border-red-500"
//                                 : "border-slate-300"
//                                 }`}
//                             />
//                           )}
//                         </Field>
//                         <ErrorMessage
//                           name="yearDevelopment"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>

//                       {/* Scale of Development */}
//                       {/* Scale of Development */}
//                       <div className="md:col-span-2">
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Scale of Development <span className="text-red-500">*</span>
//                         </label>

//                         <Field
//                           as="select"
//                           name="scaleStage"
//                           className="w-full rounded-lg border p-2.5"
//                         >
//                           <option value="">Select Scale</option>
//                           <option value="Lab">Lab Scale</option>
//                           <option value="Bench">Bench Scale</option>
//                           <option value="Pilot">Pilot Scale</option>
//                           <option value="Industrial">Industrial Scale</option>
//                         </Field>

//                         <ErrorMessage name="scaleStage" className="text-xs text-red-500" component="div" />

//                         {values.scaleStage && (
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

//                             <div>
//                               <label className="text-sm">Lab Scale Date</label>
//                               <Field type="date" name="labScaleDate" className="w-full border p-2 rounded" />
//                               <ErrorMessage name="labScaleDate" component="div" className="text-xs text-red-500" />
//                             </div>

//                             {["Bench", "Pilot", "Industrial"].includes(values.scaleStage) && (
//                               <div>
//                                 <label className="text-sm">Bench Scale Date</label>
//                                 <Field type="date" name="benchScaleDate" className="w-full border p-2 rounded" />
//                                 <ErrorMessage name="benchScaleDate" component="div" className="text-xs text-red-500" />
//                               </div>
//                             )}

//                             {["Pilot", "Industrial"].includes(values.scaleStage) && (
//                               <div>
//                                 <label className="text-sm">Pilot Scale Date</label>
//                                 <Field type="date" name="pilotScaleDate" className="w-full border p-2 rounded" />
//                                 <ErrorMessage name="pilotScaleDate" component="div" className="text-xs text-red-500" />
//                               </div>
//                             )}

//                             {values.scaleStage === "Industrial" && (
//                               <div>
//                                 <label className="text-sm">Industrial Scale Date</label>
//                                 <Field type="date" name="industrialScaleDate" className="w-full border p-2 rounded" />
//                                 <ErrorMessage name="industrialScaleDate" component="div" className="text-xs text-red-500" />
//                               </div>
//                             )}

//                           </div>
//                         )}
//                       </div>
//                       {/* Brief details */}
//                       <div className="md:col-span-2">
//                         <label
//                           htmlFor="briefTech"
//                           className="mb-1 block text-sm font-semibold text-slate-800"
//                         >
//                           Details of Technology{" "}
//                           <span className="text-red-500">*</span>
//                           <span className="block text-xs font-normal text-slate-500">
//                             Max. 1000 characters
//                           </span>
//                         </label>
//                         <Field
//                           name="briefTech"
//                           as="textarea"
//                           rows="4"
//                           maxLength="1000"
//                           className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${errors.briefTech && touched.briefTech
//                             ? "border-red-500"
//                             : "border-slate-300"
//                             }`}
//                         />
//                         <ErrorMessage
//                           name="briefTech"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>

//                       {/* Competitive Positioning */}
//                       <div className="md:col-span-2">
//                         <label
//                           htmlFor="competitivePosition"
//                           className="mb-1 block text-sm font-semibold text-slate-800"
//                         >
//                           Competitive Positioning (Global benchmark in the
//                           domain)
//                           <span className="block text-xs font-normal text-slate-500">
//                             Max. 1500 characters
//                           </span>
//                         </label>
//                         <Field
//                           name="competitivePosition"
//                           as="textarea"
//                           rows="4"
//                           maxLength="1500"
//                           className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${errors.competitivePosition &&
//                             touched.competitivePosition
//                             ? "border-red-500"
//                             : "border-slate-300"
//                             }`}
//                         />
//                         <ErrorMessage
//                           name="competitivePosition"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>

//                       {/* Techno-economics */}
//                       <div className="md:col-span-2">
//                         <label
//                           htmlFor="technoEconomics"
//                           className="mb-1 block text-sm font-semibold text-slate-800"
//                         >
//                           Techno-economics
//                           <span className="block text-xs font-normal text-slate-500">
//                             Max. 1500 characters
//                           </span>
//                         </label>
//                         <Field
//                           name="technoEconomics"
//                           as="textarea"
//                           rows="4"
//                           maxLength="1500"
//                           className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${errors.technoEconomics && touched.technoEconomics
//                             ? "border-red-500"
//                             : "border-slate-300"
//                             }`}
//                         />
//                         <ErrorMessage
//                           name="technoEconomics"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>

//                       {/* Potential Ministries */}
//                       <div>
//                         <label
//                           htmlFor="potentialMinistries"
//                           className="mb-1 block text-sm font-semibold text-slate-800"
//                         >
//                           Potential Ministries (who may be benefited)
//                         </label>
//                         <Field
//                           name="potentialMinistries"
//                           options={potentialMinistryOptions}
//                           component={CustomSelect}
//                           placeholder="Select ministries..."
//                           isMulti
//                         />
//                         <ErrorMessage
//                           name="potentialMinistries"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>

//                       {/* Environmental / Statutory */}
//                       <div>
//                         <label
//                           htmlFor="environmentalStatutory"
//                           className="mb-1 block text-sm font-semibold text-slate-800"
//                         >
//                           Environmental / Statutory Compliance
//                           <span className="block text-xs font-normal text-slate-500">
//                             Max. 300 characters
//                           </span>
//                         </label>
//                         <Field
//                           name="environmentalStatutory"
//                           as="textarea"
//                           rows="3"
//                           maxLength="300"
//                           className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${errors.environmentalStatutory &&
//                             touched.environmentalStatutory
//                             ? "border-red-500"
//                             : "border-slate-300"
//                             }`}
//                         />
//                         <ErrorMessage
//                           name="environmentalStatutory"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>

//                       {/* File Upload */}
//                       <div className="md:col-span-2">
//                         <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
//                           <label
//                             htmlFor="file"
//                             className="mb-1 block text-sm font-semibold text-slate-800"
//                           >
//                             Upload File (Optional)
//                             <span className="block text-xs font-normal text-slate-500">
//                               Image/PDF (Max 10MB)
//                             </span>
//                           </label>

//                           {passedTRN && existingFileUrl && !isFileRemoved && (
//                             <div className="mb-3 flex flex-wrap items-center gap-3">
//                               <button
//                                 type="button"
//                                 onClick={handleViewFile}
//                                 className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
//                               >
//                                 View Current
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   handleRemoveFile(setFieldValue)
//                                 }
//                                 className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
//                               >
//                                 Remove Current
//                               </button>
//                               <span className="text-xs text-slate-600">
//                                 (Will be replaced if you upload new)
//                               </span>
//                             </div>
//                           )}

//                           {isFileRemoved && (
//                             <p className="mb-2 text-xs text-orange-600">
//                               Existing file marked for removal.
//                             </p>
//                           )}

//                           <input
//                             id="file"
//                             type="file"
//                             name="file"
//                             accept=".jpg,.jpeg,.png,.pdf"
//                             className="block w-full text-xs md:text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-xs md:file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
//                             onChange={(event) => {
//                               const file = event.currentTarget.files[0];
//                               if (file && file.size > 10 * 1024 * 1024) {
//                                 Swal.fire(
//                                   "File Too Large",
//                                   "Maximum file size is 10MB.",
//                                   "error"
//                                 );
//                                 setFieldValue("file", null);
//                                 event.currentTarget.value = null;
//                               } else {
//                                 setFieldValue("file", file);
//                                 setIsFileRemoved(false);
//                               }
//                             }}
//                           />
//                           <ErrorMessage
//                             name="file"
//                             component="div"
//                             className="mt-1 text-xs text-red-500"
//                           />
//                         </div>
//                       </div>

//                       {/* Laboratory Details */}
//                       <div className="md:col-span-2">
//                         <label
//                           htmlFor="laboratoryDetail"
//                           className="mb-1 block text-sm font-semibold text-slate-800"
//                         >
//                           Laboratory Details{" "}
//                           <span className="text-red-500">*</span>
//                         </label>
//                         <Field
//                           name="laboratoryDetail"
//                           component={CustomSelect}
//                           options={labDetails}
//                           placeholder="Select laboratory detail..."
//                           className={
//                             errors.laboratoryDetail &&
//                               touched.laboratoryDetail
//                               ? "react-select-error"
//                               : ""
//                           }
//                         />
//                         <ErrorMessage
//                           name="laboratoryDetail"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>
//                     </div>

//                     {/* Buttons */}
//                     <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
//                       <button
//                         type="button"
//                         onClick={() => navigate("/ViewTechnology")}
//                         className="rounded-full bg-slate-100 px-5 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200"
//                         disabled={isSubmitting}
//                       >
//                         Cancel
//                       </button>

//                       {passedTRN ? (
//                         <>
//                           <button
//                             type="submit"
//                             className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-5 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-indigo-400/40 hover:bg-indigo-700 disabled:bg-indigo-400"
//                             disabled={isSubmitting}
//                           >
//                             {isSubmitting ? "Updating..." : "Update Section"}
//                           </button>

//                           <button
//                             type="button"
//                             className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-5 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-emerald-400/40 hover:bg-emerald-600"
//                             onClick={() =>
//                               navigate("/sectionTwo", {
//                                 state: {
//                                   technologyRefNo:
//                                     generatedRefNo || passedTRN,
//                                 },
//                               })
//                             }
//                           >
//                             Section Two Next →
//                           </button>
//                         </>
//                       ) : (
//                         <button
//                           type="submit"
//                           className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-5 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-emerald-400/40 hover:bg-emerald-600 disabled:bg-emerald-400"
//                           disabled={isSubmitting}
//                         >
//                           {isSubmitting
//                             ? "Saving & Going Next..."
//                             : "Section Two Next →"}
//                         </button>
//                       )}
//                     </div>
//                   </Form>
//                 )}
//               </Formik>
//             </div>
//           </div>

//           {/* Right info panel (same style family as SectionTwo) */}
//           <div className="hidden md:flex md:w-1/4 items-start justify-center pr-6 py-10">
//             <div className="w-full max-w-xs rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-xl px-5 py-6 space-y-4 text-slate-800">
//               <div className="flex items-center gap-3">
//                 <div className="h-9 w-9 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
//                   {ClipboardDocumentCheckIcon && (
//                     <ClipboardDocumentCheckIcon className="h-5 w-5" />
//                   )}
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-700">
//                     Section 1 Guide
//                   </p>
//                   <p className="text-sm font-medium">
//                     Key Technology Details
//                   </p>
//                 </div>
//               </div>

//               <p className="text-xs text-slate-700">
//                 Capture a crisp, complete summary of your technology. These
//                 details will be visible to stakeholders browsing the portfolio.
//               </p>

//               <div className="grid grid-cols-2 gap-3 text-[11px]">
//                 <div className="rounded-2xl bg-white/70 border border-slate-200 px-3 py-2">
//                   <p className="text-slate-500">Current TRN</p>
//                   <p className="mt-1 text-xs font-semibold truncate text-slate-800">
//                     {generatedRefNo || "Not generated"}
//                   </p>
//                 </div>
//                 <div className="rounded-2xl bg-white/70 border border-slate-200 px-3 py-2">
//                   <p className="text-slate-500">Mode</p>
//                   <p className="mt-1 text-xs font-semibold text-slate-800">
//                     {passedTRN ? "Edit / Update" : "New Entry"}
//                   </p>
//                 </div>
//               </div>

//               <ul className="mt-2 space-y-1.5 text-[11px] text-slate-700">
//                 <li>• Section 1 focuses on identity and positioning.</li>
//                 <li>• File upload is optional and can be updated later.</li>
//                 <li>• You can move to Section 2 after saving once.</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       <FooterBar />

//       <FileViewerModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         fileUrl={fileToView}
//       />
//     </>
//   );
// };

// export default SectionOne;

// import React from "react";
// import axios from "axios";
// import NavBar from "Components/common/navBar";
// import FooterBar from "Components/common/footer";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import CustomSelect from "../utils/CustomSelect";
// import { sectionOneValidationSchema } from "../section/SectionOneValidation";
// import Swal from "sweetalert2";
// import DatePicker from "react-datepicker";
// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import "react-datepicker/dist/react-datepicker.css";
// import { industrialSectorOptions } from "Components/data/industrialSector";
// import { potentialMinistryOptions } from "Components/data/potentialMinistries";
// import { themeOptions } from "Components/data/theme";
// import { labOptions } from "Components/data/lab";
// import { potentialApplicationAreaOptions } from "Components/data/potentialApplicationAreas";
// import { labDetails } from "Components/data/labDetails";
// import FileViewerModal from "Components/pages/view/FileViewerModal";
// import { SparklesIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

// const MAX_FILE_SIZE = 10 * 1024 * 1024;  // 10 MB
// const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5 MB
// const MAX_IMAGES = 5;

// const SectionOne = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { technologyRefNo: paramTRN } = useParams();
//   const passedTRN = paramTRN || location.state?.technologyRefNo || "";

//   const [generatedRefNo, setGeneratedRefNo]   = useState(passedTRN);
//   const [loading, setLoading]                 = useState(!!passedTRN);
//   const [isModalOpen, setIsModalOpen]         = useState(false);
//   const [fileToView, setFileToView]           = useState("");

//   // ── PDF state ─────────────────────────────────────────────────────────────
//   const [existingFileUrl, setExistingFileUrl] = useState("");
//   const [isFileRemoved, setIsFileRemoved]     = useState(false);

//   // ── Image state ───────────────────────────────────────────────────────────
//   const [existingImageUrls, setExistingImageUrls]       = useState([]);  // urls from backend
//   const [removeImageIndexes, setRemoveImageIndexes]     = useState([]);  // indexes to delete
//   const [newImageFiles, setNewImageFiles]               = useState([]);  // new File objects
//   const [newImagePreviews, setNewImagePreviews]         = useState([]);  // blob urls for preview

//   const emptyValues = {
//     id: null,
//     technologyRefNo: "",
//     keywordTechnology: "",
//     nameTechnology: "",
//     industrialSector: [],
//     theme: [],
//     multiLabInstitute: "No",
//     leadLaboratory: null,
//     lab: [],
//     technologyLevel: "",
//     scaleStage: "",
//     labScaleDate: "",
//     benchScaleDate: "",
//     pilotScaleDate: "",
//     industrialScaleDate: "",
//     scaleDevelopment: "",
//     yearDevelopment: "",
//     briefTech: "",
//     competitivePosition: "",
//     technoEconomics: "",
//     potentialApplicationAreas: [],
//     potentialMinistries: [],
//     environmentalStatutory: "",
//     marketPotential: "",
//     file: null,
//     laboratoryDetail: null,
//   };

//   const [initialValues, setInitialValues] = useState(emptyValues);

//   // ── Fetch existing data ───────────────────────────────────────────────────
//   useEffect(() => {
//     if (passedTRN) {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       axios
//         .get(`http://172.16.2.246:8282/api/section-one/${passedTRN}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           const d = res.data;

//           const toArray = (input) => {
//             if (!input) return [];
//             if (Array.isArray(input)) return input;
//             return input.split("|").filter(Boolean);
//           };

//           setInitialValues({
//             ...d,
//             leadLaboratory:
//               labOptions.find((o) => o.value === d.leadLaboratory) || null,
//             laboratoryDetail:
//               labDetails.find((o) => o.value === d.laboratoryDetail) || null,
//             industrialSector: industrialSectorOptions.filter((o) =>
//               toArray(d.industrialSector).includes(o.value)
//             ),
//             theme: themeOptions.filter((o) =>
//               toArray(d.theme).includes(o.value)
//             ),
//             lab: labOptions.filter((o) =>
//               toArray(d.lab).includes(o.value)
//             ),
//             potentialApplicationAreas: potentialApplicationAreaOptions.filter(
//               (o) => toArray(d.potentialApplicationAreas).includes(o.value)
//             ),
//             potentialMinistries: potentialMinistryOptions.filter((o) =>
//               toArray(d.potentialMinistries).includes(o.value)
//             ),
//             multiLabInstitute:
//               d.multiLabInstitute === "Yes" ? "Yes" : "No",
//             keywordTechnology: d.keywordTechnology || "",
//             yearDevelopment: d.yearDevelopment
//               ? String(d.yearDevelopment)
//               : "",
//             technologyLevel: d.technologyLevel
//               ? String(d.technologyLevel)
//               : "",
//             file: null,
//           });

//           setGeneratedRefNo(passedTRN);
//           setExistingFileUrl(d.fileUrl || "");
//           // ✅ Set existing image URLs from backend
//           setExistingImageUrls(d.imageUrls || []);
//           setIsFileRemoved(false);
//           setRemoveImageIndexes([]);
//           setNewImageFiles([]);
//           setNewImagePreviews([]);
//         })
//         .catch((err) => {
//           console.error("Error fetching section one:", err);
//           Swal.fire("Error", "Could not fetch existing data.", "error");
//           navigate("/ViewTechnology");
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setInitialValues(emptyValues);
//       setGeneratedRefNo("");
//       setExistingFileUrl("");
//       setExistingImageUrls([]);
//       setIsFileRemoved(false);
//       setRemoveImageIndexes([]);
//       setNewImageFiles([]);
//       setNewImagePreviews([]);
//       setLoading(false);
//     }
//   }, [passedTRN, navigate]);

//   // ── Cleanup blob URLs on unmount ──────────────────────────────────────────
//   useEffect(() => {
//     return () => {
//       newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [newImagePreviews]);

//   // ── PDF handlers ──────────────────────────────────────────────────────────
//   const handleViewFile = () => {
//     if (existingFileUrl) {
//       setFileToView(existingFileUrl);
//       setIsModalOpen(true);
//     } else {
//       Swal.fire("Info", "No file available to view.", "info");
//     }
//   };

//   const handleRemoveFile = (setFieldValue) => {
//     Swal.fire({
//       title: "Remove Existing File?",
//       text: "This will mark the PDF for removal on save.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       confirmButtonText: "Yes, remove it",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setExistingFileUrl("");
//         setIsFileRemoved(true);
//         setFieldValue("file", null);
//       }
//     });
//   };

//   // ── Image handlers ────────────────────────────────────────────────────────
//   const handleImageSelect = (e) => {
//     const files = Array.from(e.target.files);

//     const totalAfterAdd =
//       existingImageUrls.length - removeImageIndexes.length +
//       newImageFiles.length +
//       files.length;

//     if (totalAfterAdd > MAX_IMAGES) {
//       Swal.fire(
//         "Too Many Images",
//         `Maximum ${MAX_IMAGES} images allowed. You currently have ${
//           existingImageUrls.length - removeImageIndexes.length +
//           newImageFiles.length
//         } image(s).`,
//         "warning"
//       );
//       e.target.value = null;
//       return;
//     }

//     for (const file of files) {
//       if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
//         Swal.fire("Invalid Type", `"${file.name}" is not JPG or PNG.`, "error");
//         e.target.value = null;
//         return;
//       }
//       if (file.size > MAX_IMAGE_SIZE) {
//         Swal.fire(
//           "File Too Large",
//           `"${file.name}" exceeds 5MB limit.`,
//           "error"
//         );
//         e.target.value = null;
//         return;
//       }
//     }

//     const previews = files.map((f) => URL.createObjectURL(f));
//     setNewImageFiles((prev) => [...prev, ...files]);
//     setNewImagePreviews((prev) => [...prev, ...previews]);
//     e.target.value = null;
//   };

//   const handleRemoveExistingImage = (index) => {
//     Swal.fire({
//       title: "Remove this image?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       confirmButtonText: "Yes, remove",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setRemoveImageIndexes((prev) => [...prev, index]);
//       }
//     });
//   };

//   const handleRemoveNewImage = (index) => {
//     URL.revokeObjectURL(newImagePreviews[index]);
//     setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
//     setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   // ── Submit ────────────────────────────────────────────────────────────────
//   const handleSubmit = (values, { setSubmitting }, action) => {
//     const isUpdate = !!passedTRN;

//     Swal.fire({
//       title: "Confirm Submission?",
//       text: isUpdate ? "Update this technology?" : "Submit new technology?",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#4F46E5",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Submit!",
//     }).then((result) => {
//       if (!result.isConfirmed) {
//         setSubmitting(false);
//         return;
//       }

//       const formData = new FormData();

//       // ── Append regular fields ──────────────────────────────────────────
//       Object.keys(values).forEach((key) => {
//         const value = values[key];
//         if (key === "file") return; // handled separately
//         if (key === "leadLaboratory" || key === "laboratoryDetail") {
//           if (value && typeof value === "object" && value.value) {
//             formData.append(key, value.value);
//           } else if (typeof value === "string") {
//             formData.append(key, value);
//           }
//         } else if (
//           ["industrialSector","theme","lab",
//            "potentialApplicationAreas","potentialMinistries"].includes(key)
//         ) {
//           if (Array.isArray(value) && value.length > 0) {
//             formData.append(
//               key,
//               value.map((v) => v?.value ?? "").filter(Boolean).join("|")
//             );
//           }
//         } else if (
//           value !== null &&
//           value !== undefined &&
//           typeof value !== "object"
//         ) {
//           formData.append(key, value);
//         }
//       });

//       // ── PDF file ───────────────────────────────────────────────────────
//       if (values.file instanceof File) {
//         formData.append("file", values.file);
//       }
//       if (isFileRemoved) {
//         formData.append("removeExistingFile", "true");
//       }

//       // ── New images ─────────────────────────────────────────────────────
//       newImageFiles.forEach((img) => {
//         formData.append("images", img);
//       });

//       // ── Indexes of existing images to remove ───────────────────────────
//       if (removeImageIndexes.length > 0) {
//         removeImageIndexes.forEach((idx) => {
//           formData.append("removeImageIndexes", idx);
//         });
//       }

//       const token = localStorage.getItem("token");
//       const headers = { Authorization: `Bearer ${token}` };

//       const request = isUpdate
//         ? axios.put(
//             `http://172.16.2.246:8282/api/section-one/update/${passedTRN}`,
//             formData,
//             { headers }
//           )
//         : axios.post(
//             "http://172.16.2.246:8282/api/section-one/create",
//             formData,
//             { headers }
//           );

//       request
//         .then((res) => {
//           const techRef = res.data.technologyRefNo;
//           setGeneratedRefNo(techRef);

//           // Refresh image state from response
//           setExistingImageUrls(res.data.imageUrls || []);
//           setExistingFileUrl(res.data.fileUrl || "");
//           setRemoveImageIndexes([]);
//           setNewImageFiles([]);
//           setNewImagePreviews([]);
//           setIsFileRemoved(false);

//           Swal.fire(
//             "Success!",
//             `Technology ${isUpdate ? "updated" : "saved"}! TRN: ${techRef}`,
//             "success"
//           );

//           if (action === "next") {
//             navigate("/sectionTwo", { state: { technologyRefNo: techRef } });
//           }
//         })
//         .catch((err) => {
//           Swal.fire(
//             "Error!",
//             err.response?.data?.message ||
//               `Failed to ${isUpdate ? "update" : "submit"}.`,
//             "error"
//           );
//         })
//         .finally(() => setSubmitting(false));
//     });
//   };

//   if (loading && passedTRN) {
//     return (
//       <>
//         <NavBar />
//         <div className="min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-sky-200 flex items-center justify-center">
//           <p className="text-center text-slate-700">Loading existing data...</p>
//         </div>
//         <FooterBar />
//       </>
//     );
//   }

//   const defaultAction = passedTRN ? "updateOnly" : "next";

//   // ── Compute counts for display ────────────────────────────────────────────
//   const activeExistingImages = existingImageUrls.filter(
//     (_, i) => !removeImageIndexes.includes(i)
//   );
//   const totalImageCount = activeExistingImages.length + newImageFiles.length;

//   return (
//     <>
//       <NavBar />

//       <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-sky-200">
//         <div className="pointer-events-none absolute inset-0">
//           <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />
//           <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-300/40 blur-3xl" />
//         </div>

//         <div className="relative z-10 flex min-h-screen">
//           {/* ── Left main content ────────────────────────────────────────── */}
//           <div className="w-full md:w-3/4">
//             <div className="ml-0 md:ml-60 mr-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">

//               <div className="mb-5 md:mb-7">
//                 <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 border border-indigo-400/40 text-[11px] font-medium text-indigo-700 uppercase tracking-[0.2em]">
//                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                   Section 1
//                 </div>
//                 <div className="mt-3 flex items-center gap-3">
//                   <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
//                     Key Details of the Technology / Knowhow
//                   </h1>
//                   <SparklesIcon className="h-5 w-5 text-indigo-400 hidden sm:block" />
//                 </div>
//                 <p className="mt-1 text-xs md:text-sm text-slate-600">
//                   Start by capturing the core details of your technology.
//                 </p>
//               </div>

//               <Formik
//                 enableReinitialize
//                 initialValues={initialValues}
//                 validationSchema={sectionOneValidationSchema}
//                 onSubmit={(values, helpers) =>
//                   handleSubmit(values, helpers, defaultAction)
//                 }
//               >
//                 {({ values, setFieldValue, isSubmitting, errors, touched }) => (
//                   <Form className="space-y-6 rounded-2xl border border-slate-100/70 bg-white/95 shadow-2xl px-4 py-5 md:px-8 md:py-7">

//                     {/* TRN (read only) */}
//                     <div>
//                       <label className="mb-1 block text-sm font-semibold text-slate-800">
//                         Technology Ref No
//                       </label>
//                       <input
//                         type="text"
//                         value={generatedRefNo || "Will be generated after submission"}
//                         readOnly
//                         className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-600"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

//                       {/* Name of Technology */}
//                       <div className="md:col-span-2">
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Name of Technology <span className="text-red-500">*</span>
//                           <span className="block text-xs font-normal text-slate-500">Max. 500 characters</span>
//                         </label>
//                         <Field
//                           name="nameTechnology" as="textarea" rows="3"
//                           className={`w-full rounded-lg border p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${errors.nameTechnology && touched.nameTechnology ? "border-red-500" : "border-slate-300"}`}
//                         />
//                         <ErrorMessage name="nameTechnology" component="div" className="mt-1 text-xs text-red-500" />
//                       </div>

//                       {/* Keywords */}
//                       <div className="md:col-span-2">
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Keywords <span className="text-red-500">*</span>
//                           <span className="block text-xs font-normal text-slate-500">Comma-separated, 5–8 words, Max 200 characters</span>
//                         </label>
//                         <Field
//                           type="text" name="keywordTechnology" maxLength="200"
//                           className={`w-full rounded-lg border p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${errors.keywordTechnology && touched.keywordTechnology ? "border-red-500" : "border-slate-300"}`}
//                         />
//                         <ErrorMessage name="keywordTechnology" component="div" className="mt-1 text-xs text-red-500" />
//                       </div>

//                       {/* Industrial Sector */}
//                       <div>
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">Industrial Sector(s)</label>
//                         <Field name="industrialSector" options={industrialSectorOptions} component={CustomSelect} placeholder="Select sector(s)..." isMulti />
//                         <ErrorMessage name="industrialSector" component="div" className="mt-1 text-xs text-red-500" />
//                       </div>

//                       {/* Theme */}
//                       <div>
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Theme(s) <span className="text-red-500">*</span>
//                         </label>
//                         <Field name="theme" options={themeOptions} component={CustomSelect} placeholder="Select theme(s)..." isMulti />
//                         <ErrorMessage name="theme" component="div" className="mt-1 text-xs text-red-500" />
//                       </div>

//                       {/* Lead Laboratory */}
//                       <div>
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Lead Laboratory / Institute <span className="text-red-500">*</span>
//                         </label>
//                         <Field name="leadLaboratory" options={labOptions} component={CustomSelect} placeholder="Select lead lab..." />
//                         <ErrorMessage name="leadLaboratory" component="div" className="mt-1 text-xs text-red-500" />
//                       </div>

//                       {/* Multi-lab */}
//                       <div className="rounded-lg border bg-slate-50 p-3.5">
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Multi Laboratories Involved? <span className="text-red-500">*</span>
//                         </label>
//                         <div className="mt-1 flex gap-4">
//                           {["Yes","No"].map((v) => (
//                             <label key={v} className="flex items-center text-sm text-slate-700">
//                               <Field type="radio" name="multiLabInstitute" value={v} className="mr-2" />
//                               {v}
//                             </label>
//                           ))}
//                         </div>
//                         <ErrorMessage name="multiLabInstitute" component="div" className="mt-1 text-xs text-red-500" />
//                       </div>

//                       {/* TRL */}
//                       <div>
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           TRL <span className="text-red-500">*</span>
//                         </label>
//                         <Field as="select" name="technologyLevel"
//                           className={`w-full rounded-lg border bg-white p-2.5 text-sm outline-none focus:border-indigo-500 ${errors.technologyLevel && touched.technologyLevel ? "border-red-500" : "border-slate-300"}`}
//                         >
//                           <option value="">Select TRL (0–9)</option>
//                           {[...Array(10).keys()].map((i) => (
//                             <option key={i} value={String(i)}>{i}</option>
//                           ))}
//                         </Field>
//                         <ErrorMessage name="technologyLevel" component="div" className="mt-1 text-xs text-red-500" />
//                       </div>

//                       {/* Associated Labs */}
//                       {values.multiLabInstitute === "Yes" && (
//                         <div className="md:col-span-2">
//                           <label className="mb-1 block text-sm font-semibold text-slate-800">
//                             Specify Associated Labs <span className="text-red-500">*</span>
//                           </label>
//                           <Field name="lab" options={labOptions} component={CustomSelect} placeholder="Select associated lab(s)..." isMulti />
//                           <ErrorMessage name="lab" component="div" className="mt-1 text-xs text-red-500" />
//                         </div>
//                       )}

//                       {/* Year of Development */}
//                       <div>
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Year of Development <span className="text-red-500">*</span>
//                           <span className="block text-xs font-normal text-slate-500">YYYY</span>
//                         </label>
//                         <Field name="yearDevelopment">
//                           {({ field, form }) => (
//                             <DatePicker
//                               selected={field.value ? new Date(field.value, 0, 1) : null}
//                               onChange={(date) => form.setFieldValue(field.name, date?.getFullYear())}
//                               showYearPicker
//                               dateFormat="yyyy"
//                               placeholderText="Select year..."
//                               className={`w-full rounded-lg border p-2.5 text-sm outline-none focus:border-indigo-500 ${form.errors.yearDevelopment && form.touched.yearDevelopment ? "border-red-500" : "border-slate-300"}`}
//                             />
//                           )}
//                         </Field>
//                         <ErrorMessage name="yearDevelopment" component="div" className="mt-1 text-xs text-red-500" />
//                       </div>

//                       {/* Scale of Development */}
//                       <div className="md:col-span-2">
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Scale of Development <span className="text-red-500">*</span>
//                         </label>
//                         <Field as="select" name="scaleStage" className="w-full rounded-lg border p-2.5">
//                           <option value="">Select Scale</option>
//                           {["Lab","Bench","Pilot","Industrial"].map((s) => (
//                             <option key={s} value={s}>{s} Scale</option>
//                           ))}
//                         </Field>
//                         <ErrorMessage name="scaleStage" component="div" className="text-xs text-red-500" />

//                         {values.scaleStage && (
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                             <div>
//                               <label className="text-sm">Lab Scale Date</label>
//                               <Field type="date" name="labScaleDate" className="w-full border p-2 rounded" />
//                             </div>
//                             {["Bench","Pilot","Industrial"].includes(values.scaleStage) && (
//                               <div>
//                                 <label className="text-sm">Bench Scale Date</label>
//                                 <Field type="date" name="benchScaleDate" className="w-full border p-2 rounded" />
//                               </div>
//                             )}
//                             {["Pilot","Industrial"].includes(values.scaleStage) && (
//                               <div>
//                                 <label className="text-sm">Pilot Scale Date</label>
//                                 <Field type="date" name="pilotScaleDate" className="w-full border p-2 rounded" />
//                               </div>
//                             )}
//                             {values.scaleStage === "Industrial" && (
//                               <div>
//                                 <label className="text-sm">Industrial Scale Date</label>
//                                 <Field type="date" name="industrialScaleDate" className="w-full border p-2 rounded" />
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>

//                       {/* Brief details */}
//                       <div className="md:col-span-2">
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Details of Technology <span className="text-red-500">*</span>
//                           <span className="block text-xs font-normal text-slate-500">Max. 1000 characters</span>
//                         </label>
//                         <Field name="briefTech" as="textarea" rows="4" maxLength="1000"
//                           className={`w-full rounded-lg border p-2.5 text-sm outline-none focus:border-indigo-500 ${errors.briefTech && touched.briefTech ? "border-red-500" : "border-slate-300"}`}
//                         />
//                         <ErrorMessage name="briefTech" component="div" className="mt-1 text-xs text-red-500" />
//                       </div>

//                       {/* Competitive Positioning */}
//                       <div className="md:col-span-2">
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Competitive Positioning
//                           <span className="block text-xs font-normal text-slate-500">Max. 1500 characters</span>
//                         </label>
//                         <Field name="competitivePosition" as="textarea" rows="4" maxLength="1500"
//                           className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500"
//                         />
//                       </div>

//                       {/* Techno-economics */}
//                       <div className="md:col-span-2">
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Techno-economics
//                           <span className="block text-xs font-normal text-slate-500">Max. 1500 characters</span>
//                         </label>
//                         <Field name="technoEconomics" as="textarea" rows="4" maxLength="1500"
//                           className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500"
//                         />
//                       </div>

//                       {/* Potential Ministries */}
//                       <div>
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">Potential Ministries</label>
//                         <Field name="potentialMinistries" options={potentialMinistryOptions} component={CustomSelect} placeholder="Select ministries..." isMulti />
//                       </div>

//                       {/* Environmental / Statutory */}
//                       <div>
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Environmental / Statutory Compliance
//                           <span className="block text-xs font-normal text-slate-500">Max. 300 characters</span>
//                         </label>
//                         <Field name="environmentalStatutory" as="textarea" rows="3" maxLength="300"
//                           className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500"
//                         />
//                       </div>

//                       {/* ── PDF UPLOAD ────────────────────────────────────────── */}
//                       <div className="md:col-span-2">
//                         <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
//                           <label className="mb-1 block text-sm font-semibold text-slate-800">
//                             Upload PDF Document (Optional)
//                             <span className="block text-xs font-normal text-slate-500">PDF only, max 10 MB</span>
//                           </label>

//                           {/* Existing PDF */}
//                           {passedTRN && existingFileUrl && !isFileRemoved && (
//                             <div className="mb-3 flex flex-wrap items-center gap-3">
//                               <button type="button" onClick={handleViewFile}
//                                 className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700">
//                                 View Current PDF
//                               </button>
//                               <button type="button" onClick={() => handleRemoveFile(setFieldValue)}
//                                 className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600">
//                                 Remove PDF
//                               </button>
//                             </div>
//                           )}
//                           {isFileRemoved && (
//                             <p className="mb-2 text-xs text-orange-600">PDF marked for removal.</p>
//                           )}

//                           <input
//                             id="file" type="file" accept=".pdf"
//                             className="block w-full text-xs text-slate-600 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
//                             onChange={(e) => {
//                               const f = e.currentTarget.files[0];
//                               if (!f) return;
//                               if (f.type !== "application/pdf") {
//                                 Swal.fire("Invalid Type", "Only PDF files allowed.", "error");
//                                 e.currentTarget.value = null;
//                                 return;
//                               }
//                               if (f.size > MAX_FILE_SIZE) {
//                                 Swal.fire("Too Large", "PDF must be under 10 MB.", "error");
//                                 e.currentTarget.value = null;
//                                 return;
//                               }
//                               setFieldValue("file", f);
//                               setIsFileRemoved(false);
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* ── IMAGE UPLOAD ──────────────────────────────────────── */}
//                       <div className="md:col-span-2">
//                         <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 space-y-4">
//                           <div>
//                             <label className="mb-1 block text-sm font-semibold text-slate-800">
//                               Upload Images (Optional)
//                               <span className="block text-xs font-normal text-slate-500">
//                                 JPG / PNG only, max 5 MB each, up to {MAX_IMAGES} images total
//                                 {totalImageCount > 0 && ` (${totalImageCount}/${MAX_IMAGES} used)`}
//                               </span>
//                             </label>
//                             <input
//                               type="file"
//                               accept=".jpg,.jpeg,.png"
//                               multiple
//                               disabled={totalImageCount >= MAX_IMAGES}
//                               className="block w-full text-xs text-slate-600 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50"
//                               onChange={handleImageSelect}
//                             />
//                             {totalImageCount >= MAX_IMAGES && (
//                               <p className="mt-1 text-xs text-orange-600">
//                                 Maximum {MAX_IMAGES} images reached. Remove one to add more.
//                               </p>
//                             )}
//                           </div>

//                           {/* ── Existing images grid ─────────────────────────── */}
//                           {existingImageUrls.length > 0 && (
//                             <div>
//                               <p className="text-xs font-medium text-slate-600 mb-2">
//                                 Existing images:
//                               </p>
//                               <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
//                                 {existingImageUrls.map((url, i) => {
//                                   const isMarkedRemoved = removeImageIndexes.includes(i);
//                                   return (
//                                     <div key={i} className={`relative group rounded-lg overflow-hidden border aspect-square ${isMarkedRemoved ? "opacity-40 grayscale" : "border-slate-200"}`}>
//                                       <img
//                                         src={url}
//                                         alt={`Image ${i + 1}`}
//                                         className="w-full h-full object-cover cursor-pointer"
//                                         onClick={() => { setFileToView(url); setIsModalOpen(true); }}
//                                       />
//                                       {!isMarkedRemoved ? (
//                                         <button
//                                           type="button"
//                                           onClick={() => handleRemoveExistingImage(i)}
//                                           className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs items-center justify-center hidden group-hover:flex"
//                                         >
//                                           ×
//                                         </button>
//                                       ) : (
//                                         <div className="absolute inset-0 flex items-center justify-center">
//                                           <span className="text-xs bg-red-100 text-red-700 px-1 rounded">Removing</span>
//                                         </div>
//                                       )}
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             </div>
//                           )}

//                           {/* ── New image previews ───────────────────────────── */}
//                           {newImagePreviews.length > 0 && (
//                             <div>
//                               <p className="text-xs font-medium text-slate-600 mb-2">
//                                 New images to upload:
//                               </p>
//                               <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
//                                 {newImagePreviews.map((src, i) => (
//                                   <div key={i} className="relative group rounded-lg overflow-hidden border border-emerald-300 aspect-square">
//                                     <img
//                                       src={src}
//                                       alt={`New ${i + 1}`}
//                                       className="w-full h-full object-cover"
//                                     />
//                                     <button
//                                       type="button"
//                                       onClick={() => handleRemoveNewImage(i)}
//                                       className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs items-center justify-center hidden group-hover:flex"
//                                     >
//                                       ×
//                                     </button>
//                                     <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/80 text-white text-[9px] text-center py-0.5">
//                                       New
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Laboratory Details */}
//                       <div className="md:col-span-2">
//                         <label className="mb-1 block text-sm font-semibold text-slate-800">
//                           Laboratory Details <span className="text-red-500">*</span>
//                         </label>
//                         <Field name="laboratoryDetail" component={CustomSelect} options={labDetails} placeholder="Select laboratory detail..." />
//                         <ErrorMessage name="laboratoryDetail" component="div" className="mt-1 text-xs text-red-500" />
//                       </div>
//                     </div>

//                     {/* ── Buttons ─────────────────────────────────────────── */}
//                     <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
//                       <button type="button" onClick={() => navigate("/ViewTechnology")}
//                         className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
//                         disabled={isSubmitting}>
//                         Cancel
//                       </button>

//                       {passedTRN ? (
//                         <>
//                           <button type="submit"
//                             className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:bg-indigo-400"
//                             disabled={isSubmitting}>
//                             {isSubmitting ? "Updating..." : "Update Section"}
//                           </button>
//                           <button type="button"
//                             className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-600"
//                             onClick={() => navigate("/sectionTwo", { state: { technologyRefNo: generatedRefNo || passedTRN } })}>
//                             Section Two Next →
//                           </button>
//                         </>
//                       ) : (
//                         <button type="submit"
//                           className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-600 disabled:bg-emerald-400"
//                           disabled={isSubmitting}>
//                           {isSubmitting ? "Saving..." : "Section Two Next →"}
//                         </button>
//                       )}
//                     </div>
//                   </Form>
//                 )}
//               </Formik>
//             </div>
//           </div>

//           {/* ── Right info panel ─────────────────────────────────────────── */}
//           <div className="hidden md:flex md:w-1/4 items-start justify-center pr-6 py-10">
//             <div className="w-full max-w-xs rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-xl px-5 py-6 space-y-4 text-slate-800">
//               <div className="flex items-center gap-3">
//                 <div className="h-9 w-9 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
//                   <ClipboardDocumentCheckIcon className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-700">Section 1 Guide</p>
//                   <p className="text-sm font-medium">Key Technology Details</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-3 text-[11px]">
//                 <div className="rounded-2xl bg-white/70 border border-slate-200 px-3 py-2">
//                   <p className="text-slate-500">Current TRN</p>
//                   <p className="mt-1 text-xs font-semibold truncate text-slate-800">{generatedRefNo || "Not generated"}</p>
//                 </div>
//                 <div className="rounded-2xl bg-white/70 border border-slate-200 px-3 py-2">
//                   <p className="text-slate-500">Images</p>
//                   <p className="mt-1 text-xs font-semibold text-slate-800">{totalImageCount} / {MAX_IMAGES}</p>
//                 </div>
//               </div>
//               <ul className="mt-2 space-y-1.5 text-[11px] text-slate-700">
//                 <li>• PDF upload is optional (max 10 MB).</li>
//                 <li>• Up to 5 images (JPG/PNG, max 5 MB each).</li>
//                 <li>• Click any image to preview it.</li>
//                 <li>• Hover over images to remove them.</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       <FooterBar />

//       <FileViewerModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         fileUrl={fileToView}
//       />
//     </>
//   );
// };

// export default SectionOne;
import React from "react";
import axios from "axios";
import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";
import { Formik, Field, Form, ErrorMessage } from "formik";
import CustomSelect from "../utils/CustomSelect";
import { sectionOneValidationSchema } from "../section/SectionOneValidation";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { industrialSectorOptions } from "Components/data/industrialSector";
import { potentialMinistryOptions } from "Components/data/potentialMinistries";
import { themeOptions } from "Components/data/theme";
import { labOptions } from "Components/data/lab";
import { potentialApplicationAreaOptions } from "Components/data/potentialApplicationAreas";
import { labDetails } from "Components/data/labDetails";
import FileViewerModal from "Components/pages/view/FileViewerModal";
import { SparklesIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

const MAX_FILE_SIZE  = 10 * 1024 * 1024;
const MAX_IMAGE_SIZE =  5 * 1024 * 1024;
const MAX_IMAGES     = 5;
const BASE_URL       = "http://172.16.2.246:8282";

// ── pure helpers ──────────────────────────────────────────────────────────────
const toArray = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return input.split("|").filter(Boolean);
};

const serializeVal = (key, value) => {
  if (["leadLaboratory", "laboratoryDetail"].includes(key))
    return String(value?.value ?? value ?? "");
  if (["industrialSector", "theme", "lab", "potentialApplicationAreas", "potentialMinistries"].includes(key))
    return Array.isArray(value)
      ? value.map((v) => v?.value ?? "").filter(Boolean).sort().join("|")
      : String(value ?? "");
  return String(value ?? "");
};

const isDirtyField = (key, cur, snap) =>
  serializeVal(key, cur) !== serializeVal(key, snap);

const mapServerData = (d) => ({
  ...d,
  leadLaboratory:    labOptions.find((o) => o.value === d.leadLaboratory) || null,
  laboratoryDetail:  labDetails.find((o) => o.value === d.laboratoryDetail) || null,
  industrialSector:  industrialSectorOptions.filter((o) => toArray(d.industrialSector).includes(o.value)),
  theme:             themeOptions.filter((o) => toArray(d.theme).includes(o.value)),
  lab:               labOptions.filter((o) => toArray(d.lab).includes(o.value)),
  potentialApplicationAreas: potentialApplicationAreaOptions.filter((o) => toArray(d.potentialApplicationAreas).includes(o.value)),
  potentialMinistries: potentialMinistryOptions.filter((o) => toArray(d.potentialMinistries).includes(o.value)),
  multiLabInstitute: d.multiLabInstitute === "Yes" ? "Yes" : "No",
  keywordTechnology: d.keywordTechnology || "",
  yearDevelopment:   d.yearDevelopment  ? String(d.yearDevelopment)  : "",
  technologyLevel:   d.technologyLevel  ? String(d.technologyLevel)  : "",
  file: null,
});

const FIELD_LABELS = {
  nameTechnology:            "Name of Technology",
  keywordTechnology:         "Keywords",
  industrialSector:          "Industrial Sector(s)",
  theme:                     "Theme(s)",
  leadLaboratory:            "Lead Laboratory",
  multiLabInstitute:         "Multi Lab/Institute",
  lab:                       "Associated Labs",
  technologyLevel:           "TRL",
  scaleStage:                "Scale Stage",
  labScaleDate:              "Lab Scale Date",
  benchScaleDate:            "Bench Scale Date",
  pilotScaleDate:            "Pilot Scale Date",
  industrialScaleDate:       "Industrial Scale Date",
  yearDevelopment:           "Year of Development",
  briefTech:                 "Details of Technology",
  competitivePosition:       "Competitive Positioning",
  technoEconomics:           "Techno-economics",
  potentialApplicationAreas: "Potential Application Areas",
  potentialMinistries:       "Potential Ministries",
  environmentalStatutory:    "Environmental / Statutory",
  marketPotential:           "Market Potential",
  laboratoryDetail:          "Laboratory Details",
};

const emptyValues = {
  id: null, technologyRefNo: "", keywordTechnology: "", nameTechnology: "",
  industrialSector: [], theme: [], multiLabInstitute: "No", leadLaboratory: null,
  lab: [], technologyLevel: "", scaleStage: "", labScaleDate: "", benchScaleDate: "",
  pilotScaleDate: "", industrialScaleDate: "", scaleDevelopment: "", yearDevelopment: "",
  briefTech: "", competitivePosition: "", technoEconomics: "", potentialApplicationAreas: [],
  potentialMinistries: [], environmentalStatutory: "", marketPotential: "",
  file: null, laboratoryDetail: null,
};

// ─────────────────────────────────────────────────────────────────────────────
const SectionOne = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { technologyRefNo: paramTRN } = useParams();
  const passedTRN = paramTRN || location.state?.technologyRefNo || "";

  const [generatedRefNo, setGeneratedRefNo] = useState(passedTRN);
  const [loading, setLoading]               = useState(!!passedTRN);
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [fileToView, setFileToView]         = useState("");
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  const [existingFileUrl, setExistingFileUrl]       = useState("");
  const [isFileRemoved, setIsFileRemoved]           = useState(false);
  const [existingImageUrls, setExistingImageUrls]   = useState([]);
  const [removeImageIndexes, setRemoveImageIndexes] = useState([]);
  const [newImageFiles, setNewImageFiles]           = useState([]);
  const [newImagePreviews, setNewImagePreviews]     = useState([]);

  const [initialValues, setInitialValues] = useState(emptyValues);
  const serverSnapshotRef = useRef(emptyValues);
  const latestValuesRef   = useRef(emptyValues);

  // ── fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!passedTRN) {
      setInitialValues(emptyValues);
      serverSnapshotRef.current = emptyValues;
      latestValuesRef.current   = emptyValues;
      setGeneratedRefNo("");
      setExistingFileUrl("");
      setExistingImageUrls([]);
      setIsFileRemoved(false);
      setRemoveImageIndexes([]);
      setNewImageFiles([]);
      setNewImagePreviews([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get(`${BASE_URL}/api/section-one/${passedTRN}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const mapped = mapServerData(res.data);
        setInitialValues(mapped);
        serverSnapshotRef.current = mapped;
        latestValuesRef.current   = mapped;
        setGeneratedRefNo(passedTRN);
        setExistingFileUrl(res.data.fileUrl || "");
        setExistingImageUrls(res.data.imageUrls || []);
        setIsFileRemoved(false);
        setRemoveImageIndexes([]);
        setNewImageFiles([]);
        setNewImagePreviews([]);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        Swal.fire("Error", "Could not fetch existing data.", "error");
        navigate("/ViewTechnology");
      })
      .finally(() => setLoading(false));
  }, [passedTRN]); // eslint-disable-line

  useEffect(() => {
    return () => newImagePreviews.forEach((u) => URL.revokeObjectURL(u));
  }, [newImagePreviews]);

  // ── core API call ─────────────────────────────────────────────────────────
  const fireRequest = useCallback(async (values, action) => {
    const isUpdate = !!passedTRN;
    const snapshot = serverSnapshotRef.current;

    // --- dirty check (for confirmation dialog only — NOT for skipping fields) ---
    const dirtyFields = [];
    if (isUpdate) {
      Object.keys(FIELD_LABELS).forEach((key) => {
        if (isDirtyField(key, values[key], snapshot[key]))
          dirtyFields.push(FIELD_LABELS[key]);
      });
      if (values.file instanceof File)   dirtyFields.push("PDF Document (new upload)");
      if (isFileRemoved)                 dirtyFields.push("PDF Document (removed)");
      if (newImageFiles.length > 0)      dirtyFields.push(`Images (+${newImageFiles.length} new)`);
      if (removeImageIndexes.length > 0) dirtyFields.push(`Images (${removeImageIndexes.length} removed)`);

      if (dirtyFields.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Changes Detected",
          text: "You haven't modified any fields. Nothing to update.",
        });
        return;
      }
    }

    // --- confirmation Swal ---
    const changesHtml = isUpdate
      ? `<div style="text-align:left;max-height:200px;overflow-y:auto;">
           <p style="margin-bottom:8px;font-size:13px;color:#475569;">The following fields will be updated:</p>
           <ul style="list-style:disc;padding-left:18px;font-size:13px;color:#1e293b;">
             ${dirtyFields.map((f) => `<li>${f}</li>`).join("")}
           </ul>
         </div>`
      : `<p style="font-size:13px;color:#475569;">A new technology record will be created.</p>`;

    const confirm = await Swal.fire({
      title: isUpdate ? "⚠️ Confirm Update" : "Confirm Submission",
      html: changesHtml, icon: "warning", showCancelButton: true,
      confirmButtonColor: "#4F46E5", cancelButtonColor: "#6b7280",
      confirmButtonText: isUpdate ? "Yes, Update!" : "Yes, Submit!",
      cancelButtonText: "Cancel",
    });
    if (!confirm.isConfirmed) return;

    // --- build FormData — ALWAYS send every field (no dirty-field skip) ---
    const formData = new FormData();

    if (isUpdate) {
      if (values.id) formData.append("id", String(values.id));
      formData.append("technologyRefNo", passedTRN);
    }

    Object.keys(values).forEach((key) => {
      if (["file", "id", "technologyRefNo"].includes(key)) return;

      const value = values[key];

      if (["leadLaboratory", "laboratoryDetail"].includes(key)) {
        if (value?.value)                            formData.append(key, value.value);
        else if (typeof value === "string" && value) formData.append(key, value);
      } else if (
        ["industrialSector", "theme", "lab", "potentialApplicationAreas", "potentialMinistries"].includes(key)
      ) {
        // Only append when the array has items; omitting the key entirely tells
        // the backend to keep the existing DB value (via null-guard in service).
        if (Array.isArray(value) && value.length > 0) {
          formData.append(key, value.map((v) => v?.value ?? "").filter(Boolean).join("|"));
        }
      } else if (value !== null && value !== undefined && typeof value !== "object") {
        formData.append(key, String(value));
      }
    });

    if (values.file instanceof File) formData.append("file", values.file);
    if (isFileRemoved) formData.append("removeExistingFile", "true");
    newImageFiles.forEach((img) => formData.append("images", img));
    removeImageIndexes.forEach((idx) => formData.append("removeImageIndexes", String(idx)));

    const token   = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    setIsSubmittingManual(true);
    try {
      const res = isUpdate
        ? await axios.put(`${BASE_URL}/api/section-one/update/${passedTRN}`, formData, { headers })
        : await axios.post(`${BASE_URL}/api/section-one/create`, formData, { headers });

      const techRef   = res.data.technologyRefNo;
      const newMapped = mapServerData(res.data);

      setGeneratedRefNo(techRef);
      setInitialValues(newMapped);
      serverSnapshotRef.current = newMapped;
      latestValuesRef.current   = newMapped;
      setExistingFileUrl(res.data.fileUrl || "");
      setExistingImageUrls(res.data.imageUrls || []);
      setRemoveImageIndexes([]);
      setNewImageFiles([]);
      setNewImagePreviews([]);
      setIsFileRemoved(false);

      const successHtml = isUpdate
        ? `<div style="text-align:left;">
             <p style="margin-bottom:8px;font-size:13px;color:#475569;">Successfully updated:</p>
             <ul style="list-style:disc;padding-left:18px;font-size:13px;color:#1e293b;">
               ${dirtyFields.map((f) => `<li>${f}</li>`).join("")}
             </ul>
             <p style="margin-top:10px;font-size:12px;color:#64748b;">TRN: <strong>${techRef}</strong></p>
           </div>`
        : `<p style="font-size:13px;">Technology saved!<br/>TRN: <strong>${techRef}</strong></p>`;

      await Swal.fire({
        title: isUpdate ? "✅ Updated Successfully" : "✅ Saved Successfully",
        html: successHtml, icon: "success", confirmButtonColor: "#4F46E5",
      });

      if (action === "next")
        navigate("/sectionTwo", { state: { technologyRefNo: techRef } });

    } catch (err) {
      console.error("API error:", err);
      Swal.fire(
        "Error!",
        err.response?.data?.message || `Failed to ${isUpdate ? "update" : "submit"}.`,
        "error"
      );
    } finally {
      setIsSubmittingManual(false);
    }
  }, [passedTRN, isFileRemoved, newImageFiles, removeImageIndexes, navigate]);

  // ── PDF handlers ──────────────────────────────────────────────────────────
  const handleViewFile = () => {
    if (existingFileUrl) { setFileToView(existingFileUrl); setIsModalOpen(true); }
    else Swal.fire("Info", "No file available to view.", "info");
  };

  const handleRemoveFile = (setFieldValue) => {
    Swal.fire({
      title: "Remove Existing File?",
      text: "This will mark the PDF for removal on save.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#d33", confirmButtonText: "Yes, remove it",
    }).then((r) => {
      if (r.isConfirmed) {
        setExistingFileUrl("");
        setIsFileRemoved(true);
        setFieldValue("file", null);
      }
    });
  };

  // ── image handlers ────────────────────────────────────────────────────────
  const handleImageSelect = (e) => {
    const files   = Array.from(e.target.files);
    const current = existingImageUrls.length - removeImageIndexes.length + newImageFiles.length;
    if (current + files.length > MAX_IMAGES) {
      Swal.fire("Too Many Images", `Max ${MAX_IMAGES} allowed. You have ${current}.`, "warning");
      e.target.value = null; return;
    }
    for (const f of files) {
      if (!["image/jpeg", "image/jpg", "image/png"].includes(f.type)) {
        Swal.fire("Invalid Type", `"${f.name}" is not JPG or PNG.`, "error");
        e.target.value = null; return;
      }
      if (f.size > MAX_IMAGE_SIZE) {
        Swal.fire("File Too Large", `"${f.name}" exceeds 5 MB.`, "error");
        e.target.value = null; return;
      }
    }
    setNewImageFiles((p) => [...p, ...files]);
    setNewImagePreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = null;
  };

  const handleRemoveExistingImage = (index) => {
    Swal.fire({
      title: "Remove this image?", icon: "warning", showCancelButton: true,
      confirmButtonColor: "#d33", confirmButtonText: "Yes, remove",
    }).then((r) => {
      if (r.isConfirmed) setRemoveImageIndexes((p) => [...p, index]);
    });
  };

  const handleRemoveNewImage = (index) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles((p) => p.filter((_, i) => i !== index));
    setNewImagePreviews((p) => p.filter((_, i) => i !== index));
  };

  // ── loading screen ────────────────────────────────────────────────────────
  if (loading && passedTRN) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-sky-200 flex items-center justify-center">
          <p className="text-center text-slate-700">Loading existing data…</p>
        </div>
        <FooterBar />
      </>
    );
  }

  const activeExistingImages = existingImageUrls.filter((_, i) => !removeImageIndexes.includes(i));
  const totalImageCount      = activeExistingImages.length + newImageFiles.length;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <NavBar />
      <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-sky-200">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-300/40 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-screen">
          <div className="w-full md:w-3/4">
            <div className="ml-0 md:ml-60 mr-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">

              {/* header */}
              <div className="mb-5 md:mb-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 border border-indigo-400/40 text-[11px] font-medium text-indigo-700 uppercase tracking-[0.2em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Section 1
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                    Key Details of the Technology / Knowhow
                  </h1>
                  <SparklesIcon className="h-5 w-5 text-indigo-400 hidden sm:block" />
                </div>
                <p className="mt-1 text-xs md:text-sm text-slate-600">
                  Start by capturing the core details of your technology.
                </p>
              </div>

              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={sectionOneValidationSchema}
                onSubmit={() => {}}
              >
                {({ values, setFieldValue, errors, touched }) => {
                  latestValuesRef.current = values;

                  return (
                    <Form className="space-y-6 rounded-2xl border border-slate-100/70 bg-white/95 shadow-2xl px-4 py-5 md:px-8 md:py-7">

                      {/* TRN */}
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-800">
                          Technology Ref No
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={generatedRefNo || "Will be generated after submission"}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-600"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        {/* Name */}
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Name of Technology <span className="text-red-500">*</span>
                            <span className="block text-xs font-normal text-slate-500">Max. 500 characters</span>
                          </label>
                          <Field
                            name="nameTechnology"
                            as="textarea"
                            rows="3"
                            className={`w-full rounded-lg border p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                              errors.nameTechnology && touched.nameTechnology
                                ? "border-red-500"
                                : "border-slate-300"
                            }`}
                          />
                          <ErrorMessage name="nameTechnology" component="div" className="mt-1 text-xs text-red-500" />
                        </div>

                        {/* Keywords */}
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Keywords <span className="text-red-500">*</span>
                            <span className="block text-xs font-normal text-slate-500">
                              Comma-separated, 5–8 words, Max 200 characters
                            </span>
                          </label>
                          <Field
                            type="text"
                            name="keywordTechnology"
                            maxLength="200"
                            className={`w-full rounded-lg border p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                              errors.keywordTechnology && touched.keywordTechnology
                                ? "border-red-500"
                                : "border-slate-300"
                            }`}
                          />
                          <ErrorMessage name="keywordTechnology" component="div" className="mt-1 text-xs text-red-500" />
                        </div>

                        {/* Industrial Sector */}
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Industrial Sector(s)
                          </label>
                          <Field
                            name="industrialSector"
                            options={industrialSectorOptions}
                            component={CustomSelect}
                            placeholder="Select sector(s)..."
                            isMulti
                          />
                          <ErrorMessage name="industrialSector" component="div" className="mt-1 text-xs text-red-500" />
                        </div>

                        {/* Theme */}
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Theme(s) <span className="text-red-500">*</span>
                          </label>
                          <Field
                            name="theme"
                            options={themeOptions}
                            component={CustomSelect}
                            placeholder="Select theme(s)..."
                            isMulti
                          />
                          <ErrorMessage name="theme" component="div" className="mt-1 text-xs text-red-500" />
                        </div>

                        {/* Lead Lab */}
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Lead Laboratory / Institute <span className="text-red-500">*</span>
                          </label>
                          <Field
                            name="leadLaboratory"
                            options={labOptions}
                            component={CustomSelect}
                            placeholder="Select lead lab..."
                          />
                          <ErrorMessage name="leadLaboratory" component="div" className="mt-1 text-xs text-red-500" />
                        </div>

                        {/* Multi-lab */}
                        <div className="rounded-lg border bg-slate-50 p-3.5">
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Multi Laboratories Involved? <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1 flex gap-4">
                            {["Yes", "No"].map((v) => (
                              <label key={v} className="flex items-center text-sm text-slate-700">
                                <Field type="radio" name="multiLabInstitute" value={v} className="mr-2" />
                                {v}
                              </label>
                            ))}
                          </div>
                          <ErrorMessage name="multiLabInstitute" component="div" className="mt-1 text-xs text-red-500" />
                        </div>

                        {/* TRL */}
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            TRL <span className="text-red-500">*</span>
                          </label>
                          <Field
                            as="select"
                            name="technologyLevel"
                            className={`w-full rounded-lg border bg-white p-2.5 text-sm outline-none focus:border-indigo-500 ${
                              errors.technologyLevel && touched.technologyLevel
                                ? "border-red-500"
                                : "border-slate-300"
                            }`}
                          >
                            <option value="">Select TRL (0–9)</option>
                            {[...Array(10).keys()].map((i) => (
                              <option key={i} value={String(i)}>{i}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="technologyLevel" component="div" className="mt-1 text-xs text-red-500" />
                        </div>

                        {/* Associated Labs */}
                        {values.multiLabInstitute === "Yes" && (
                          <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-semibold text-slate-800">
                              Specify Associated Labs <span className="text-red-500">*</span>
                            </label>
                            <Field
                              name="lab"
                              options={labOptions}
                              component={CustomSelect}
                              placeholder="Select associated lab(s)..."
                              isMulti
                            />
                            <ErrorMessage name="lab" component="div" className="mt-1 text-xs text-red-500" />
                          </div>
                        )}

                        {/* Year */}
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Year of Development <span className="text-red-500">*</span>
                            <span className="block text-xs font-normal text-slate-500">YYYY</span>
                          </label>
                          <Field name="yearDevelopment">
                            {({ field, form }) => (
                              <DatePicker
                                selected={field.value ? new Date(field.value, 0, 1) : null}
                                onChange={(date) => form.setFieldValue(field.name, date?.getFullYear())}
                                showYearPicker
                                dateFormat="yyyy"
                                placeholderText="Select year..."
                                className={`w-full rounded-lg border p-2.5 text-sm outline-none focus:border-indigo-500 ${
                                  form.errors.yearDevelopment && form.touched.yearDevelopment
                                    ? "border-red-500"
                                    : "border-slate-300"
                                }`}
                              />
                            )}
                          </Field>
                          <ErrorMessage name="yearDevelopment" component="div" className="mt-1 text-xs text-red-500" />
                        </div>

                        {/* Scale */}
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Scale of Development <span className="text-red-500">*</span>
                          </label>
                          <Field
                            as="select"
                            name="scaleStage"
                            className="w-full rounded-lg border p-2.5"
                          >
                            <option value="">Select Scale</option>
                            {["Lab", "Bench", "Pilot", "Industrial"].map((s) => (
                              <option key={s} value={s}>{s} Scale</option>
                            ))}
                          </Field>
                          <ErrorMessage name="scaleStage" component="div" className="text-xs text-red-500" />
                          {values.scaleStage && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <label className="text-sm">Lab Scale Date</label>
                                <Field type="date" name="labScaleDate" className="w-full border p-2 rounded" />
                              </div>
                              {["Bench", "Pilot", "Industrial"].includes(values.scaleStage) && (
                                <div>
                                  <label className="text-sm">Bench Scale Date</label>
                                  <Field type="date" name="benchScaleDate" className="w-full border p-2 rounded" />
                                </div>
                              )}
                              {["Pilot", "Industrial"].includes(values.scaleStage) && (
                                <div>
                                  <label className="text-sm">Pilot Scale Date</label>
                                  <Field type="date" name="pilotScaleDate" className="w-full border p-2 rounded" />
                                </div>
                              )}
                              {values.scaleStage === "Industrial" && (
                                <div>
                                  <label className="text-sm">Industrial Scale Date</label>
                                  <Field type="date" name="industrialScaleDate" className="w-full border p-2 rounded" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Details of Technology <span className="text-red-500">*</span>
                            <span className="block text-xs font-normal text-slate-500">Max. 1000 characters</span>
                          </label>
                          <Field
                            name="briefTech"
                            as="textarea"
                            rows="4"
                            maxLength="1000"
                            className={`w-full rounded-lg border p-2.5 text-sm outline-none focus:border-indigo-500 ${
                              errors.briefTech && touched.briefTech
                                ? "border-red-500"
                                : "border-slate-300"
                            }`}
                          />
                          <ErrorMessage name="briefTech" component="div" className="mt-1 text-xs text-red-500" />
                        </div>

                        {/* Competitive Positioning */}
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Competitive Positioning
                            <span className="block text-xs font-normal text-slate-500">Max. 1500 characters</span>
                          </label>
                          <Field
                            name="competitivePosition"
                            as="textarea"
                            rows="4"
                            maxLength="1500"
                            className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500"
                          />
                        </div>

                        {/* Techno-economics */}
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Techno-economics
                            <span className="block text-xs font-normal text-slate-500">Max. 1500 characters</span>
                          </label>
                          <Field
                            name="technoEconomics"
                            as="textarea"
                            rows="4"
                            maxLength="1500"
                            className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500"
                          />
                        </div>

                        {/* Potential Application Areas */}
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Potential Application Areas
                          </label>
                          <Field
                            name="potentialApplicationAreas"
                            options={potentialApplicationAreaOptions}
                            component={CustomSelect}
                            placeholder="Select application areas..."
                            isMulti
                          />
                        </div>

                        {/* Ministries */}
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Potential Ministries
                          </label>
                          <Field
                            name="potentialMinistries"
                            options={potentialMinistryOptions}
                            component={CustomSelect}
                            placeholder="Select ministries..."
                            isMulti
                          />
                        </div>

                        {/* Environmental */}
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Environmental / Statutory Compliance
                            <span className="block text-xs font-normal text-slate-500">Max. 300 characters</span>
                          </label>
                          <Field
                            name="environmentalStatutory"
                            as="textarea"
                            rows="3"
                            maxLength="300"
                            className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500"
                          />
                        </div>

                        {/* Market Potential */}
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Market Potential
                            <span className="block text-xs font-normal text-slate-500">Max. 500 characters</span>
                          </label>
                          <Field
                            name="marketPotential"
                            as="textarea"
                            rows="3"
                            maxLength="500"
                            className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500"
                          />
                        </div>

                        {/* PDF Upload */}
                        <div className="md:col-span-2">
                          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                            <label className="mb-1 block text-sm font-semibold text-slate-800">
                              Upload PDF Document (Optional)
                              <span className="block text-xs font-normal text-slate-500">PDF only, max 10 MB</span>
                            </label>
                            {passedTRN && existingFileUrl && !isFileRemoved && (
                              <div className="mb-3 flex flex-wrap items-center gap-3">
                                <button
                                  type="button"
                                  onClick={handleViewFile}
                                  className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                                >
                                  View Current PDF
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFile(setFieldValue)}
                                  className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
                                >
                                  Remove PDF
                                </button>
                              </div>
                            )}
                            {isFileRemoved && (
                              <p className="mb-2 text-xs text-orange-600">PDF marked for removal.</p>
                            )}
                            <input
                              id="file"
                              type="file"
                              accept=".pdf"
                              className="block w-full text-xs text-slate-600 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                              onChange={(e) => {
                                const f = e.currentTarget.files[0];
                                if (!f) return;
                                if (f.type !== "application/pdf") {
                                  Swal.fire("Invalid Type", "Only PDF files allowed.", "error");
                                  e.currentTarget.value = null; return;
                                }
                                if (f.size > MAX_FILE_SIZE) {
                                  Swal.fire("Too Large", "PDF must be under 10 MB.", "error");
                                  e.currentTarget.value = null; return;
                                }
                                setFieldValue("file", f);
                                setIsFileRemoved(false);
                              }}
                            />
                          </div>
                        </div>

                        {/* Image Upload */}
                        <div className="md:col-span-2">
                          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 space-y-4">
                            <div>
                              <label className="mb-1 block text-sm font-semibold text-slate-800">
                                Upload Images (Optional)
                                <span className="block text-xs font-normal text-slate-500">
                                  JPG / PNG only, max 5 MB each, up to {MAX_IMAGES} total
                                  {totalImageCount > 0 && ` (${totalImageCount}/${MAX_IMAGES} used)`}
                                </span>
                              </label>
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                multiple
                                disabled={totalImageCount >= MAX_IMAGES}
                                className="block w-full text-xs text-slate-600 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50"
                                onChange={handleImageSelect}
                              />
                              {totalImageCount >= MAX_IMAGES && (
                                <p className="mt-1 text-xs text-orange-600">
                                  Maximum {MAX_IMAGES} images reached. Remove one to add more.
                                </p>
                              )}
                            </div>

                            {existingImageUrls.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-slate-600 mb-2">Existing images:</p>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                  {existingImageUrls.map((url, i) => {
                                    const marked = removeImageIndexes.includes(i);
                                    return (
                                      <div
                                        key={i}
                                        className={`relative group rounded-lg overflow-hidden border aspect-square ${
                                          marked ? "opacity-40 grayscale" : "border-slate-200"
                                        }`}
                                      >
                                        <img
                                          src={url}
                                          alt={`Img ${i + 1}`}
                                          className="w-full h-full object-cover cursor-pointer"
                                          onClick={() => { setFileToView(url); setIsModalOpen(true); }}
                                        />
                                        {!marked ? (
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs items-center justify-center hidden group-hover:flex"
                                          >
                                            ×
                                          </button>
                                        ) : (
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-xs bg-red-100 text-red-700 px-1 rounded">Removing</span>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {newImagePreviews.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-slate-600 mb-2">New images to upload:</p>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                  {newImagePreviews.map((src, i) => (
                                    <div
                                      key={i}
                                      className="relative group rounded-lg overflow-hidden border border-emerald-300 aspect-square"
                                    >
                                      <img src={src} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveNewImage(i)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs items-center justify-center hidden group-hover:flex"
                                      >
                                        ×
                                      </button>
                                      <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/80 text-white text-[9px] text-center py-0.5">
                                        New
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Lab Details */}
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-semibold text-slate-800">
                            Laboratory Details <span className="text-red-500">*</span>
                          </label>
                          <Field
                            name="laboratoryDetail"
                            component={CustomSelect}
                            options={labDetails}
                            placeholder="Select laboratory detail..."
                          />
                          <ErrorMessage name="laboratoryDetail" component="div" className="mt-1 text-xs text-red-500" />
                        </div>
                      </div>

                      {/* ── BUTTONS ─────────────────────────────────────────── */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">

                        {/* Left — cancel */}
                        <button
                          type="button"
                          disabled={isSubmittingManual}
                          onClick={() => navigate("/ViewTechnology")}
                          className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
                        >
                          Cancel
                        </button>

                        {/* Right — actions */}
                        <div className="flex items-center gap-3">
                          {passedTRN ? (
                            <>
                              {/* Save in place */}
                              <button
                                type="button"
                                disabled={isSubmittingManual}
                                onClick={() => fireRequest(latestValuesRef.current, "updateOnly")}
                                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-60"
                              >
                                {isSubmittingManual ? (
                                  <>
                                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                    Updating…
                                  </>
                                ) : (
                                  "Update Section"
                                )}
                              </button>

                              {/* Navigate to Section Two */}
                              <button
                                type="button"
                                disabled={isSubmittingManual}
                                onClick={() =>
                                  navigate("/sectionTwo", {
                                    state: { technologyRefNo: generatedRefNo },
                                  })
                                }
                                className="inline-flex items-center gap-2 rounded-full border border-emerald-500 bg-white px-5 py-2 text-sm font-semibold text-emerald-600 shadow-sm hover:bg-emerald-50 disabled:opacity-60"
                              >
                                Section Two
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </button>
                            </>
                          ) : (
                            /* New record — save then go to Section Two */
                            <button
                              type="button"
                              disabled={isSubmittingManual}
                              onClick={() => fireRequest(latestValuesRef.current, "next")}
                              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-600 disabled:opacity-60"
                            >
                              {isSubmittingManual ? (
                                <>
                                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                  Saving…
                                </>
                              ) : (
                                <>
                                  Section Two
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                  </svg>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>

          {/* Right panel */}
          <div className="hidden md:flex md:w-1/4 items-start justify-center pr-6 py-10">
            <div className="w-full max-w-xs rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-xl px-5 py-6 space-y-4 text-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                  <ClipboardDocumentCheckIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-700">
                    Section 1 Guide
                  </p>
                  <p className="text-sm font-medium">Key Technology Details</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="rounded-2xl bg-white/70 border border-slate-200 px-3 py-2">
                  <p className="text-slate-500">Current TRN</p>
                  <p className="mt-1 text-xs font-semibold truncate text-slate-800">
                    {generatedRefNo || "Not generated"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/70 border border-slate-200 px-3 py-2">
                  <p className="text-slate-500">Images</p>
                  <p className="mt-1 text-xs font-semibold text-slate-800">
                    {totalImageCount} / {MAX_IMAGES}
                  </p>
                </div>
              </div>
              <ul className="mt-2 space-y-1.5 text-[11px] text-slate-700">
                <li>• Save changes with <strong>Update Section</strong> before navigating.</li>
                <li>• PDF upload is optional (max 10 MB).</li>
                <li>• Up to 5 images (JPG/PNG, max 5 MB each).</li>
                <li>• Click any image to preview it.</li>
                <li>• Hover over images to remove them.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <FooterBar />
      <FileViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fileUrl={fileToView}
      />
    </>
  );
};

export default SectionOne;