// import axios from "axios";
// import Section from "Components/common/section";
// import NavBar from "Components/common/navBar";
// import FooterBar from "Components/common/footer";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import CustomSelect from "../utils/CustomSelect";
// import * as Yup from "yup";
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
//     laboratoryDetail: null, // dropdown: object/null
//   });

//   // --- Prefill / Edit data ---
//   useEffect(() => {
//     if (passedTRN) {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       axios
//         .get(`http://172.16.2.246:8080/api/section-one/${passedTRN}`, {
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
//               fetchedData.multiLabInstitute === true
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
//       // --- New create ---
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
//         scaleDevelopment: "",
//         yearDevelopment: "",
//         briefTech: "",
//         competitivePosition: "",
//         technoEconomics: "",
//         potentialApplicationAreas: [],
//         potentialMinistries: [],
//         environmentalStatutory: "",
//         marketPotential: "",
//         file: null,
//         laboratoryDetail: null, // important
//       });
//       setGeneratedRefNo("");
//       setExistingFileUrl("");
//       setIsFileRemoved(false);
//       setLoading(false);
//     }
//   }, [passedTRN, navigate]);

//   // --- Yup Validation ---
//   const validationSchema = Yup.object({
//     nameTechnology: Yup.string().required("Required").max(500, "Max 500 chars"),
//     keywordTechnology: Yup.string()
//       .required("Required")
//       .max(200, "Max 200 chars"),
//     leadLaboratory: Yup.object()
//       .shape({
//         value: Yup.string().required(),
//         label: Yup.string().required(),
//       })
//       .nullable()
//       .required("Lead Laboratory is required"),
//     theme: Yup.array()
//       .of(
//         Yup.object().shape({
//           value: Yup.string().required(),
//           label: Yup.string().required(),
//         })
//       )
//       .min(1, "Select at least one theme")
//       .required("Theme is required"),
//     multiLabInstitute: Yup.string().required("Please select Yes or No"),
//     lab: Yup.array()
//       .of(
//         Yup.object().shape({
//           value: Yup.string().required(),
//           label: Yup.string().required(),
//         })
//       )
//       .when("multiLabInstitute", {
//         is: "Yes",
//         then: (schema) => schema.min(1, "Select associated labs if 'Yes'"),
//         otherwise: (schema) => schema.notRequired(),
//       }),
//     technologyLevel: Yup.string().required("TRL is required"),
//     yearDevelopment: Yup.string()
//       .required("Year is required")
//       .matches(/^[0-9]{4}$/, "Enter a valid 4-digit year"),
//     briefTech: Yup.string()
//       .required("Brief details are required")
//       .max(1000, "Max 1000 chars"),
//     laboratoryDetail: Yup.object()
//       .shape({
//         value: Yup.string().required(),
//         label: Yup.string().required(),
//       })
//       .nullable()
//       .required("Lab details are required"),
//     scaleDevelopment: Yup.string().max(250, "Max 250 chars").nullable(),
//     competitivePosition: Yup.string()
//       .max(1500, "Max 1500 chars")
//       .nullable(),
//     technoEconomics: Yup.string().max(1500, "Max 1500 chars").nullable(),
//     environmentalStatutory: Yup.string()
//       .max(300, "Max 300 chars")
//       .nullable(),
//     potentialMinistries: Yup.array()
//       .of(
//         Yup.object().shape({
//           value: Yup.string().required(),
//           label: Yup.string().required(),
//         })
//       )
//       .nullable(),
//     industrialSector: Yup.array()
//       .of(
//         Yup.object().shape({
//           value: Yup.string().required(),
//           label: Yup.string().required(),
//         })
//       )
//       .nullable(),
//   });

//   // --- File Handlers ---
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

//   // --- Submit handler ---
//   const handleSubmit = (values, { setSubmitting }, action) => {
//     const isUpdate = !!passedTRN;

//     Swal.fire({
//       title: "Confirm Submission?",
//       text: isUpdate ? "Update this technology?" : "Submit this new technology?",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
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
//         const updateUrl = `http://172.16.2.246:8080/api/section-one/update/${passedTRN}`;
//         requestPromise = axios.put(updateUrl, formData, { headers });
//       } else {
//         const createUrl = "http://172.16.2.246:8080/api/section-one/create";
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
//               `Failed to ${isUpdate ? "update" : "submit"}.`,
//             "error"
//           );
//         })
//         .finally(() => setSubmitting(false));
//     });
//   };

//   if (loading && passedTRN) {
//     return (
//       <p className="mt-6 text-center text-gray-600">
//         Loading existing data...
//       </p>
//     );
//   }

//   const defaultAction = passedTRN ? "updateOnly" : "next";

//   return (
//     <>
//       <NavBar />

//       {/* PAGE LAYOUT: Left 75%, Right 25% empty */}
//       <div className="flex min-h-screen bg-blue-100">
//         {/* Left content (75%) */}
//         <div className="w-full border-r md:w-3/4">
//           <div className="ml-60 mr-auto max-w-5xl p-6 md:p-8">
//             <Section sectionLine="Section 1 : Key Details of the Technology / Knowhow " />

//             <Formik
//               enableReinitialize
//               initialValues={initialValues}
//               validationSchema={validationSchema}
//               onSubmit={(values, formikHelpers) =>
//                 handleSubmit(values, formikHelpers, defaultAction)
//               }
//             >
//               {({ values, setFieldValue, isSubmitting, errors, touched }) => (
//                 <Form className="space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-md md:p-8">
//                   {/* Header: Ref No */}
//                   <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                     <div className="md:col-span-2">
//                       <label className="mb-1 block font-semibold text-gray-700">
//                         Technology Ref No
//                       </label>
//                       <input
//                         type="text"
//                         value={
//                           generatedRefNo || "Will be generated after submission"
//                         }
//                         readOnly
//                         className="w-full rounded-md border border-gray-300 bg-gray-100 p-2.5 text-base text-gray-600"
//                       />
//                     </div>
//                   </div>

//                   {/* Main Grid */}
//                   <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                     {/* Name of Technology */}
//                     <div className="md:col-span-2">
//                       <label
//                         htmlFor="nameTechnology"
//                         className="mb-1 block font-semibold text-gray-700"
//                       >
//                         Name of Technology <span className="text-red-500">*</span>
//                         <span className="block text-xs font-normal text-gray-500">
//                           Max. 500 characters
//                         </span>
//                       </label>
//                       <Field
//                         name="nameTechnology"
//                         as="textarea"
//                         rows="3"
//                         className={`w-full rounded-md border p-2.5 text-base outline-none focus:border-blue-500 ${
//                           errors.nameTechnology && touched.nameTechnology
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       />
//                       <ErrorMessage
//                         name="nameTechnology"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>

//                     {/* Keywords */}
//                     <div className="md:col-span-2">
//                       <label
//                         htmlFor="keywordTechnology"
//                         className="mb-1 block font-semibold text-gray-700"
//                       >
//                         Keywords <span className="text-red-500">*</span>
//                         <span className="block text-xs font-normal text-gray-500">
//                           Comma-separated, 5–8 words, Max 200 characters
//                         </span>
//                       </label>
//                       <Field
//                         type="text"
//                         name="keywordTechnology"
//                         maxLength="200"
//                         className={`w-full rounded-md border p-2.5 text-base outline-none focus:border-blue-500 ${
//                           errors.keywordTechnology && touched.keywordTechnology
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       />
//                       <ErrorMessage
//                         name="keywordTechnology"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>

//                     {/* Industrial Sector */}
//                     <div>
//                       <label
//                         htmlFor="industrialSector"
//                         className="mb-1 block font-semibold text-gray-700"
//                       >
//                         Industrial Sector(s)
//                       </label>
//                       <Field
//                         name="industrialSector"
//                         options={industrialSectorOptions}
//                         component={CustomSelect}
//                         placeholder="Select sector(s)..."
//                         isMulti
//                       />
//                       <ErrorMessage
//                         name="industrialSector"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>

//                     {/* Theme */}
//                     <div>
//                       <label
//                         htmlFor="theme"
//                         className="mb-1 block font-semibold text-gray-700"
//                       >
//                         Theme(s) <span className="text-red-500">*</span>
//                       </label>
//                       <Field
//                         name="theme"
//                         options={themeOptions}
//                         component={CustomSelect}
//                         placeholder="Select theme(s)..."
//                         isMulti
//                         className={
//                           errors.theme && touched.theme ? "react-select-error" : ""
//                         }
//                       />
//                       <ErrorMessage
//                         name="theme"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>

//                     {/* Lead Laboratory */}
//                     <div>
//                       <label
//                         htmlFor="leadLaboratory"
//                         className="mb-1 block font-semibold text-gray-700"
//                       >
//                         Lead Laboratory / Institute{" "}
//                         <span className="text-red-500">*</span>
//                       </label>
//                       <Field
//                         name="leadLaboratory"
//                         options={labOptions}
//                         component={CustomSelect}
//                         placeholder="Select lead lab..."
//                         className={
//                           errors.leadLaboratory && touched.leadLaboratory
//                             ? "react-select-error"
//                             : ""
//                         }
//                       />
//                       <ErrorMessage
//                         name="leadLaboratory"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>

//                     {/* Multi Lab Radio */}
//                     <div className="rounded-md border bg-gray-50 p-3">
//                       <label className="mb-1 block font-semibold text-gray-700">
//                         Multi Laboratories Involved?{" "}
//                         <span className="text-red-500">*</span>
//                       </label>
//                       <div className="mt-1 flex gap-4">
//                         <label className="flex items-center text-sm">
//                           <Field
//                             type="radio"
//                             name="multiLabInstitute"
//                             value="Yes"
//                             className="mr-2"
//                           />
//                           Yes
//                         </label>
//                         <label className="flex items-center text-sm">
//                           <Field
//                             type="radio"
//                             name="multiLabInstitute"
//                             value="No"
//                             className="mr-2"
//                           />
//                           No
//                         </label>
//                       </div>
//                       <ErrorMessage
//                         name="multiLabInstitute"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>

//                     {/* TRL */}
//                     <div>
//                       <label
//                         htmlFor="technologyLevel"
//                         className="mb-1 block font-semibold text-gray-700"
//                       >
//                         TRL <span className="text-red-500">*</span>
//                       </label>
//                       <Field
//                         as="select"
//                         name="technologyLevel"
//                         className={`w-full rounded-md border bg-white p-2.5 text-base outline-none focus:border-blue-500 ${
//                           errors.technologyLevel && touched.technologyLevel
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       >
//                         <option value="" label="Select TRL (0–9)" />
//                         {[...Array(10).keys()].map((i) => (
//                           <option key={i} value={String(i)}>
//                             {i}
//                           </option>
//                         ))}
//                       </Field>
//                       <ErrorMessage
//                         name="technologyLevel"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>

//                     {/* Associated Labs if Yes */}
//                     {values.multiLabInstitute === "Yes" && (
//                       <div className="md:col-span-2">
//                         <label
//                           htmlFor="lab"
//                           className="mb-1 block font-semibold text-gray-700"
//                         >
//                           Specify Associated Labs{" "}
//                           <span className="text-red-500">*</span>
//                         </label>
//                         <Field
//                           name="lab"
//                           options={labOptions}
//                           component={CustomSelect}
//                           placeholder="Select associated lab(s)..."
//                           isMulti
//                           className={
//                             errors.lab && touched.lab ? "react-select-error" : ""
//                           }
//                         />
//                         <ErrorMessage
//                           name="lab"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>
//                     )}

//                     {/* Year of Development */}
//                     <div>
//                       <label
//                         htmlFor="yearDevelopment"
//                         className="mb-1 block font-semibold text-gray-700"
//                       >
//                         Year of Development{" "}
//                         <span className="text-red-500">*</span>
//                         <span className="block text-xs font-normal text-gray-500">
//                           YYYY
//                         </span>
//                       </label>
//                       <Field name="yearDevelopment">
//                         {({ field, form }) => (
//                           <DatePicker
//                             selected={
//                               field.value ? new Date(field.value, 0, 1) : null
//                             }
//                             onChange={(date) => {
//                               const year = date?.getFullYear();
//                               form.setFieldValue(field.name, year);
//                             }}
//                             showYearPicker
//                             dateFormat="yyyy"
//                             placeholderText="Select year..."
//                             className={`w-full rounded-md border p-2.5 text-base outline-none focus:border-blue-500 ${
//                               form.errors.yearDevelopment &&
//                               form.touched.yearDevelopment
//                                 ? "border-red-500"
//                                 : "border-gray-300"
//                             }`}
//                           />
//                         )}
//                       </Field>
//                       <ErrorMessage
//                         name="yearDevelopment"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>

//                     {/* Scale of Development */}
//                     <div>
//                       <label
//                         htmlFor="scaleDevelopment"
//                         className="mb-1 block font-semibold text-gray-700"
//                       >
//                         Scale of Development
//                         <span className="block text-xs font-normal text-gray-500">
//                           Max. 250 characters
//                         </span>
//                       </label>
//                       <Field
//                         name="scaleDevelopment"
//                         as="textarea"
//                         rows="2"
//                         maxLength="250"
//                         className={`w-full rounded-md border p-2.5 text-base outline-none focus:border-blue-500 ${
//                           errors.scaleDevelopment && touched.scaleDevelopment
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       />
//                       <ErrorMessage
//                         name="scaleDevelopment"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>

//                     {/* Brief Details */}
//                     <div className="md:col-span-2">
//                       <label
//                         htmlFor="briefTech"
//                         className="mb-1 block font-semibold text-gray-700"
//                       >
//                         Details of Technology{" "}
//                         <span className="text-red-500">*</span>
//                         <span className="block text-xs font-normal text-gray-500">
//                           Max. 1000 characters
//                         </span>
//                       </label>
//                       <Field
//                         name="briefTech"
//                         as="textarea"
//                         rows="4"
//                         maxLength="1000"
//                         className={`w-full rounded-md border p-2.5 text-base outline-none focus:border-blue-500 ${
//                           errors.briefTech && touched.briefTech
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       />
//                       <ErrorMessage
//                         name="briefTech"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>

//                     {/* Competitive Positioning */}
//                     <div className="md:col-span-2">
//                       <label
//                         htmlFor="competitivePosition"
//                         className="mb-1 block font-semibold text-gray-700"
//                       >
//                         Competitive Positioning (Global benchmark in the domain)
//                         <span className="block text-xs font-normal text-gray-500">
//                           Max. 1500 characters
//                         </span>
//                       </label>
//                       <Field
//                         name="competitivePosition"
//                         as="textarea"
//                         rows="4"
//                         maxLength="1500"
//                         className={`w-full rounded-md border p-2.5 text-base outline-none focus:border-blue-500 ${
//                           errors.competitivePosition &&
//                           touched.competitivePosition
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       />
//                       <ErrorMessage
//                         name="competitivePosition"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>

//                     {/* Techno-economics */}
//                     <div className="md:col-span-2">
//                       <label
//                         htmlFor="technoEconomics"
//                         className="mb-1 block font-semibold text-gray-700"
//                       >
//                         Techno-economics
//                         <span className="block text-xs font-normal text-gray-500">
//                           Max. 1500 characters
//                         </span>
//                       </label>
//                       <Field
//                         name="technoEconomics"
//                         as="textarea"
//                         rows="4"
//                         maxLength="1500"
//                         className={`w-full rounded-md border p-2.5 text-base outline-none focus:border-blue-500 ${
//                           errors.technoEconomics && touched.technoEconomics
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       />
//                       <ErrorMessage
//                         name="technoEconomics"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>

//                     {/* Potential Ministries */}
//                     <div>
//                       <label
//                         htmlFor="potentialMinistries"
//                         className="mb-1 block font-semibold text-gray-700"
//                       >
//                         Potential Ministries (who may be benefited)
//                       </label>
//                       <Field
//                         name="potentialMinistries"
//                         options={potentialMinistryOptions}
//                         component={CustomSelect}
//                         placeholder="Select ministries..."
//                         isMulti
//                       />
//                       <ErrorMessage
//                         name="potentialMinistries"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>

//                     {/* Environmental / Statutory */}
//                     <div>
//                       <label
//                         htmlFor="environmentalStatutory"
//                         className="mb-1 block font-semibold text-gray-700"
//                       >
//                         Environmental / Statutory Compliance
//                         <span className="block text-xs font-normal text-gray-500">
//                           Max. 300 characters
//                         </span>
//                       </label>
//                       <Field
//                         name="environmentalStatutory"
//                         as="textarea"
//                         rows="3"
//                         maxLength="300"
//                         className={`w-full rounded-md border p-2.5 text-base outline-none focus:border-blue-500 ${
//                           errors.environmentalStatutory &&
//                           touched.environmentalStatutory
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       />
//                       <ErrorMessage
//                         name="environmentalStatutory"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>

//                     {/* File Upload */}
//                     <div className="md:col-span-2">
//                       <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4">
//                         <label
//                           htmlFor="file"
//                           className="mb-1 block font-semibold text-gray-700"
//                         >
//                           Upload File (Optional)
//                           <span className="block text-xs font-normal text-gray-500">
//                             Image/PDF (Max 10MB)
//                           </span>
//                         </label>

//                         {passedTRN && existingFileUrl && !isFileRemoved && (
//                           <div className="mb-3 flex flex-wrap items-center gap-3">
//                             <button
//                               type="button"
//                               onClick={handleViewFile}
//                               className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
//                             >
//                               View Current
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveFile(setFieldValue)}
//                               className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
//                             >
//                               Remove Current
//                             </button>
//                             <span className="text-xs text-gray-600">
//                               (Will be replaced if you upload new)
//                             </span>
//                           </div>
//                         )}

//                         {isFileRemoved && (
//                           <p className="mb-2 text-xs text-orange-600">
//                             Existing file marked for removal.
//                           </p>
//                         )}

//                         <input
//                           id="file"
//                           type="file"
//                           name="file"
//                           accept=".jpg,.jpeg,.png,.pdf"
//                           className="block w-full text-sm text-gray-600 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
//                           onChange={(event) => {
//                             const file = event.currentTarget.files[0];
//                             if (file && file.size > 10 * 1024 * 1024) {
//                               Swal.fire(
//                                 "File Too Large",
//                                 "Maximum file size is 10MB.",
//                                 "error"
//                               );
//                               setFieldValue("file", null);
//                               event.currentTarget.value = null;
//                             } else {
//                               setFieldValue("file", file);
//                               setIsFileRemoved(false);
//                             }
//                           }}
//                         />
//                         <ErrorMessage
//                           name="file"
//                           component="div"
//                           className="mt-1 text-xs text-red-500"
//                         />
//                       </div>
//                     </div>

//                     {/* Laboratory Details */}
//                     <div className="md:col-span-2">
//                       <label
//                         htmlFor="laboratoryDetail"
//                         className="mb-1 block font-semibold text-gray-700"
//                       >
//                         Laboratory Details <span className="text-red-500">*</span>
//                       </label>
//                       <Field
//                         name="laboratoryDetail"
//                         component={CustomSelect}
//                         options={labDetails}
//                         placeholder="Select laboratory detail..."
//                         className={
//                           errors.laboratoryDetail && touched.laboratoryDetail
//                             ? "react-select-error"
//                             : ""
//                         }
//                       />
//                       <ErrorMessage
//                         name="laboratoryDetail"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />
//                     </div>
//                   </div>

//                   {/* Buttons */}
//                   <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
//                     <button
//                       type="button"
//                       onClick={() => navigate("/ViewTechnology")}
//                       className="rounded-md bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
//                       disabled={isSubmitting}
//                     >
//                       Cancel
//                     </button>

//                     {passedTRN ? (
//                       <>
//                         <button
//                           type="submit"
//                           className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
//                           disabled={isSubmitting}
//                         >
//                           {isSubmitting ? "Updating..." : "Update Section"}
//                         </button>

//                         <button
//                           type="button"
//                           className="rounded-md bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
//                           onClick={() =>
//                             navigate("/sectionTwo", {
//                               state: {
//                                 technologyRefNo: generatedRefNo || passedTRN,
//                               },
//                             })
//                           }
//                         >
//                           Section Two Next →
//                         </button>
//                       </>
//                     ) : (
//                       <button
//                         type="submit"
//                         className="rounded-md bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
//                         disabled={isSubmitting}
//                       >
//                         {isSubmitting
//                           ? "Saving & Going Next..."
//                           : "Section Two Next →"}
//                       </button>
//                     )}
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>

//         {/* Right empty space (25%) */}
//         <div className="hidden md:block md:w-1/4" />
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

import axios from "axios";
import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";
import { Formik, Field, Form, ErrorMessage } from "formik";
import CustomSelect from "../utils/CustomSelect";
import * as Yup from "yup";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

import { industrialSectorOptions } from "Components/data/industrialSector";
import { potentialMinistryOptions } from "Components/data/potentialMinistries";
import { themeOptions } from "Components/data/theme";
import { labOptions } from "Components/data/lab";
import { potentialApplicationAreaOptions } from "Components/data/potentialApplicationAreas";
import { labDetails } from "Components/data/labDetails";

import FileViewerModal from "Components/pages/view/FileViewerModal";

import {
  SparklesIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

const SectionOne = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { technologyRefNo: paramTRN } = useParams();
  const passedTRN = paramTRN || location.state?.technologyRefNo || "";

  const [generatedRefNo, setGeneratedRefNo] = useState(passedTRN);
  const [loading, setLoading] = useState(!!passedTRN);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToView, setFileToView] = useState("");
  const [existingFileUrl, setExistingFileUrl] = useState("");
  const [isFileRemoved, setIsFileRemoved] = useState(false);

  const [initialValues, setInitialValues] = useState({
    id: null,
    technologyRefNo: "",
    keywordTechnology: "",
    nameTechnology: "",
    industrialSector: [],
    theme: [],
    multiLabInstitute: "No",
    leadLaboratory: null,
    lab: [],
    technologyLevel: "",
    scaleDevelopment: "",
    yearDevelopment: "",
    briefTech: "",
    competitivePosition: "",
    technoEconomics: "",
    potentialApplicationAreas: [],
    potentialMinistries: [],
    environmentalStatutory: "",
    marketPotential: "",
    file: null,
    laboratoryDetail: null,
  });

  // --- Prefill / Edit data ---
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

          const processToArray = (input) => {
            if (!input) return [];
            if (Array.isArray(input)) return input;
            if (typeof input === "string") {
              return input.split("|").filter(Boolean);
            }
            return [];
          };

          const cleanedIndustrialSectors = processToArray(
            fetchedData.industrialSector
          );
          const cleanedThemes = processToArray(fetchedData.theme);
          const cleanedLabs = processToArray(fetchedData.lab);
          const cleanedAppAreas = processToArray(
            fetchedData.potentialApplicationAreas
          );
          const cleanedMinistries = processToArray(
            fetchedData.potentialMinistries
          );

          const formattedValues = {
            ...fetchedData,
            leadLaboratory:
              labOptions.find(
                (opt) => opt.value === fetchedData.leadLaboratory
              ) || null,
            laboratoryDetail:
              labDetails.find(
                (opt) => opt.value === fetchedData.laboratoryDetail
              ) || null,
            industrialSector: industrialSectorOptions.filter((opt) =>
              cleanedIndustrialSectors.includes(opt.value)
            ),
            theme: themeOptions.filter((opt) =>
              cleanedThemes.includes(opt.value)
            ),
            lab: labOptions.filter((opt) => cleanedLabs.includes(opt.value)),
            potentialApplicationAreas:
              potentialApplicationAreaOptions.filter((opt) =>
                cleanedAppAreas.includes(opt.value)
              ),
            potentialMinistries: potentialMinistryOptions.filter((opt) =>
              cleanedMinistries.includes(opt.value)
            ),
            multiLabInstitute:
              fetchedData.multiLabInstitute === "Yes" ||
              fetchedData.multiLabInstitute === true
                ? "Yes"
                : "No",
            keywordTechnology: fetchedData.keywordTechnology || "",
            yearDevelopment: fetchedData.yearDevelopment
              ? String(fetchedData.yearDevelopment)
              : "",
            technologyLevel: fetchedData.technologyLevel
              ? String(fetchedData.technologyLevel)
              : "",
            file: null,
          };

          setInitialValues(formattedValues);
          setGeneratedRefNo(passedTRN);
          setExistingFileUrl(fetchedData.fileUrl || "");
          setIsFileRemoved(false);
        })
        .catch((err) => {
          console.error("Error fetching section one data", err);
          Swal.fire("Error", "Could not fetch existing data.", "error");
          navigate("/ViewTechnology");
        })
        .finally(() => setLoading(false));
    } else {
      // New entry
      setInitialValues({
        id: null,
        technologyRefNo: "",
        keywordTechnology: "",
        nameTechnology: "",
        industrialSector: [],
        theme: [],
        multiLabInstitute: "No",
        leadLaboratory: null,
        lab: [],
        technologyLevel: "",
        scaleDevelopment: "",
        yearDevelopment: "",
        briefTech: "",
        competitivePosition: "",
        technoEconomics: "",
        potentialApplicationAreas: [],
        potentialMinistries: [],
        environmentalStatutory: "",
        marketPotential: "",
        file: null,
        laboratoryDetail: null,
      });
      setGeneratedRefNo("");
      setExistingFileUrl("");
      setIsFileRemoved(false);
      setLoading(false);
    }
  }, [passedTRN, navigate]);

  // --- Validation ---
  const validationSchema = Yup.object({
    nameTechnology: Yup.string().required("Required").max(500, "Max 500 chars"),
    keywordTechnology: Yup.string()
      .required("Required")
      .max(200, "Max 200 chars"),
    leadLaboratory: Yup.object()
      .shape({
        value: Yup.string().required(),
        label: Yup.string().required(),
      })
      .nullable()
      .required("Lead Laboratory is required"),
    theme: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        })
      )
      .min(1, "Select at least one theme")
      .required("Theme is required"),
    multiLabInstitute: Yup.string().required("Please select Yes or No"),
    lab: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        })
      )
      .when("multiLabInstitute", {
        is: "Yes",
        then: (schema) => schema.min(1, "Select associated labs if 'Yes'"),
        otherwise: (schema) => schema.notRequired(),
      }),
    technologyLevel: Yup.string().required("TRL is required"),
    yearDevelopment: Yup.string()
      .required("Year is required")
      .matches(/^[0-9]{4}$/, "Enter a valid 4-digit year"),
    briefTech: Yup.string()
      .required("Brief details are required")
      .max(1000, "Max 1000 chars"),
    laboratoryDetail: Yup.object()
      .shape({
        value: Yup.string().required(),
        label: Yup.string().required(),
      })
      .nullable()
      .required("Lab details are required"),
    scaleDevelopment: Yup.string().max(250, "Max 250 chars").nullable(),
    competitivePosition: Yup.string()
      .max(1500, "Max 1500 chars")
      .nullable(),
    technoEconomics: Yup.string().max(1500, "Max 1500 chars").nullable(),
    environmentalStatutory: Yup.string()
      .max(300, "Max 300 chars")
      .nullable(),
    potentialMinistries: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        })
      )
      .nullable(),
    industrialSector: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        })
      )
      .nullable(),
  });

  // --- File handlers ---
  const handleViewFile = () => {
    if (existingFileUrl) {
      const viewUrl = existingFileUrl.replace("/download/", "/view/");
      setFileToView(viewUrl);
      setIsModalOpen(true);
    } else {
      Swal.fire("Info", "No file available to view.", "info");
    }
  };

  const handleRemoveFile = (setFieldValue) => {
    Swal.fire({
      title: "Remove Existing File?",
      text: "This will mark the file for removal upon saving. Upload a new file if needed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, remove it",
    }).then((result) => {
      if (result.isConfirmed) {
        setExistingFileUrl("");
        setIsFileRemoved(true);
        setFieldValue("file", null);
      }
    });
  };

  // --- Submit ---
  const handleSubmit = (values, { setSubmitting }, action) => {
    const isUpdate = !!passedTRN;

    Swal.fire({
      title: "Confirm Submission?",
      text: isUpdate ? "Update this technology?" : "Submit this new technology?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Submit!",
    }).then((result) => {
      if (!result.isConfirmed) {
        setSubmitting(false);
        return;
      }

      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        const value = values[key];

        if (key === "file" && value instanceof File) {
          formData.append("file", value);
        } else if (key === "leadLaboratory" || key === "laboratoryDetail") {
          if (value && typeof value === "object" && value.value) {
            formData.append(key, value.value);
          } else if (typeof value === "string") {
            formData.append(key, value);
          }
        } else if (
          [
            "industrialSector",
            "theme",
            "lab",
            "potentialApplicationAreas",
            "potentialMinistries",
          ].includes(key)
        ) {
          if (Array.isArray(value) && value.length > 0) {
            const list = value
              .map((v) => v?.value ?? "")
              .filter(Boolean)
              .join("|");
            formData.append(key, list);
          }
        } else if (
          value !== null &&
          value !== undefined &&
          typeof value !== "object" &&
          key !== "file"
        ) {
          formData.append(key, value);
        }
      });

      if (values.id) {
        formData.append("id", values.id);
      }

      if (isFileRemoved) {
        formData.append("isFileRemoved", "true");
      }

      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let requestPromise;
      if (isUpdate) {
        const updateUrl = `http://172.16.2.246:8080/api/section-one/update/${passedTRN}`;
        requestPromise = axios.put(updateUrl, formData, { headers });
      } else {
        const createUrl = "http://172.16.2.246:8080/api/section-one/create";
        requestPromise = axios.post(createUrl, formData, { headers });
      }

      requestPromise
        .then((res) => {
          const techRef = res.data.technologyRefNo;
          setGeneratedRefNo(techRef);

          Swal.fire(
            "Success!",
            `Technology ${isUpdate ? "updated" : "saved"}! TRN: ${techRef}`,
            "success"
          );

          if (action === "next") {
            navigate("/sectionTwo", { state: { technologyRefNo: techRef } });
          }
        })
        .catch((err) => {
          Swal.fire(
            "Error!",
            err.response?.data?.message ||
              `Failed to ${isUpdate ? "update" : "submit"}.`,
            "error"
          );
        })
        .finally(() => setSubmitting(false));
    });
  };

  if (loading && passedTRN) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-sky-200 flex items-center justify-center">
          <p className="text-center text-slate-700">
            Loading existing data...
          </p>
        </div>
        <FooterBar />
      </>
    );
  }

  const defaultAction = passedTRN ? "updateOnly" : "next";

  return (
    <>
      <NavBar />

      {/* Same background style as SectionTwo */}
      <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-sky-200">
        {/* Soft blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-300/40 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-screen">
          {/* Left main content (75%) */}
          <div className="w-full md:w-3/4">
            <div className="ml-0 md:ml-60 mr-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
              {/* Heading style same family as SectionTwo */}
              <div className="mb-5 md:mb-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 border border-indigo-400/40 text-[11px] font-medium text-indigo-700 uppercase tracking-[0.2em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Section 1
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                    Key Details of the Technology / Knowhow
                  </h1>
                  {SparklesIcon && (
                    <SparklesIcon className="h-5 w-5 text-indigo-400 hidden sm:block" />
                  )}
                </div>
                <p className="mt-1 text-xs md:text-sm text-slate-600">
                  Start by capturing the core details of your technology. You can
                  always refine other sections later.
                </p>
              </div>

              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, formikHelpers) =>
                  handleSubmit(values, formikHelpers, defaultAction)
                }
              >
                {({
                  values,
                  setFieldValue,
                  isSubmitting,
                  errors,
                  touched,
                }) => (
                  <Form className="space-y-6 rounded-2xl border border-slate-100/70 bg-white/95 shadow-2xl px-4 py-5 md:px-8 md:py-7">
                    {/* Technology Ref No */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-semibold text-slate-800">
                          Technology Ref No
                        </label>
                        <input
                          type="text"
                          value={
                            generatedRefNo ||
                            "Will be generated after submission"
                          }
                          readOnly
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm md:text-base text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Main grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Name of Technology */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="nameTechnology"
                          className="mb-1 block text-sm font-semibold text-slate-800"
                        >
                          Name of Technology{" "}
                          <span className="text-red-500">*</span>
                          <span className="block text-xs font-normal text-slate-500">
                            Max. 500 characters
                          </span>
                        </label>
                        <Field
                          name="nameTechnology"
                          as="textarea"
                          rows="3"
                          className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                            errors.nameTechnology && touched.nameTechnology
                              ? "border-red-500"
                              : "border-slate-300"
                          }`}
                        />
                        <ErrorMessage
                          name="nameTechnology"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* Keywords */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="keywordTechnology"
                          className="mb-1 block text-sm font-semibold text-slate-800"
                        >
                          Keywords <span className="text-red-500">*</span>
                          <span className="block text-xs font-normal text-slate-500">
                            Comma-separated, 5–8 words, Max 200 characters
                          </span>
                        </label>
                        <Field
                          type="text"
                          name="keywordTechnology"
                          maxLength="200"
                          className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                            errors.keywordTechnology &&
                            touched.keywordTechnology
                              ? "border-red-500"
                              : "border-slate-300"
                          }`}
                        />
                        <ErrorMessage
                          name="keywordTechnology"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* Industrial Sector */}
                      <div>
                        <label
                          htmlFor="industrialSector"
                          className="mb-1 block text-sm font-semibold text-slate-800"
                        >
                          Industrial Sector(s)
                        </label>
                        <Field
                          name="industrialSector"
                          options={industrialSectorOptions}
                          component={CustomSelect}
                          placeholder="Select sector(s)..."
                          isMulti
                        />
                        <ErrorMessage
                          name="industrialSector"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* Theme */}
                      <div>
                        <label
                          htmlFor="theme"
                          className="mb-1 block text-sm font-semibold text-slate-800"
                        >
                          Theme(s) <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="theme"
                          options={themeOptions}
                          component={CustomSelect}
                          placeholder="Select theme(s)..."
                          isMulti
                          className={
                            errors.theme && touched.theme
                              ? "react-select-error"
                              : ""
                          }
                        />
                        <ErrorMessage
                          name="theme"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* Lead Laboratory */}
                      <div>
                        <label
                          htmlFor="leadLaboratory"
                          className="mb-1 block text-sm font-semibold text-slate-800"
                        >
                          Lead Laboratory / Institute{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="leadLaboratory"
                          options={labOptions}
                          component={CustomSelect}
                          placeholder="Select lead lab..."
                          className={
                            errors.leadLaboratory && touched.leadLaboratory
                              ? "react-select-error"
                              : ""
                          }
                        />
                        <ErrorMessage
                          name="leadLaboratory"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* Multi-lab radio */}
                      <div className="rounded-lg border bg-slate-50 p-3.5">
                        <label className="mb-1 block text-sm font-semibold text-slate-800">
                          Multi Laboratories Involved?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 flex gap-4">
                          <label className="flex items-center text-xs md:text-sm text-slate-700">
                            <Field
                              type="radio"
                              name="multiLabInstitute"
                              value="Yes"
                              className="mr-2"
                            />
                            Yes
                          </label>
                          <label className="flex items-center text-xs md:text-sm text-slate-700">
                            <Field
                              type="radio"
                              name="multiLabInstitute"
                              value="No"
                              className="mr-2"
                            />
                            No
                          </label>
                        </div>
                        <ErrorMessage
                          name="multiLabInstitute"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* TRL */}
                      <div>
                        <label
                          htmlFor="technologyLevel"
                          className="mb-1 block text-sm font-semibold text-slate-800"
                        >
                          TRL <span className="text-red-500">*</span>
                        </label>
                        <Field
                          as="select"
                          name="technologyLevel"
                          className={`w-full rounded-lg border bg-white p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                            errors.technologyLevel && touched.technologyLevel
                              ? "border-red-500"
                              : "border-slate-300"
                          }`}
                        >
                          <option value="" label="Select TRL (0–9)" />
                          {[...Array(10).keys()].map((i) => (
                            <option key={i} value={String(i)}>
                              {i}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="technologyLevel"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* Associated Labs */}
                      {values.multiLabInstitute === "Yes" && (
                        <div className="md:col-span-2">
                          <label
                            htmlFor="lab"
                            className="mb-1 block text-sm font-semibold text-slate-800"
                          >
                            Specify Associated Labs{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            name="lab"
                            options={labOptions}
                            component={CustomSelect}
                            placeholder="Select associated lab(s)..."
                            isMulti
                            className={
                              errors.lab && touched.lab
                                ? "react-select-error"
                                : ""
                            }
                          />
                          <ErrorMessage
                            name="lab"
                            component="div"
                            className="mt-1 text-xs text-red-500"
                          />
                        </div>
                      )}

                      {/* Year of Development */}
                      <div>
                        <label
                          htmlFor="yearDevelopment"
                          className="mb-1 block text-sm font-semibold text-slate-800"
                        >
                          Year of Development{" "}
                          <span className="text-red-500">*</span>
                          <span className="block text-xs font-normal text-slate-500">
                            YYYY
                          </span>
                        </label>
                        <Field name="yearDevelopment">
                          {({ field, form }) => (
                            <DatePicker
                              selected={
                                field.value
                                  ? new Date(field.value, 0, 1)
                                  : null
                              }
                              onChange={(date) => {
                                const year = date?.getFullYear();
                                form.setFieldValue(field.name, year);
                              }}
                              showYearPicker
                              dateFormat="yyyy"
                              placeholderText="Select year..."
                              className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                                form.errors.yearDevelopment &&
                                form.touched.yearDevelopment
                                  ? "border-red-500"
                                  : "border-slate-300"
                              }`}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="yearDevelopment"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* Scale of Development */}
                      <div>
                        <label
                          htmlFor="scaleDevelopment"
                          className="mb-1 block text-sm font-semibold text-slate-800"
                        >
                          Scale of Development
                          <span className="block text-xs font-normal text-slate-500">
                            Max. 250 characters
                          </span>
                        </label>
                        <Field
                          name="scaleDevelopment"
                          as="textarea"
                          rows="2"
                          maxLength="250"
                          className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                            errors.scaleDevelopment &&
                            touched.scaleDevelopment
                              ? "border-red-500"
                              : "border-slate-300"
                          }`}
                        />
                        <ErrorMessage
                          name="scaleDevelopment"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* Brief details */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="briefTech"
                          className="mb-1 block text-sm font-semibold text-slate-800"
                        >
                          Details of Technology{" "}
                          <span className="text-red-500">*</span>
                          <span className="block text-xs font-normal text-slate-500">
                            Max. 1000 characters
                          </span>
                        </label>
                        <Field
                          name="briefTech"
                          as="textarea"
                          rows="4"
                          maxLength="1000"
                          className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                            errors.briefTech && touched.briefTech
                              ? "border-red-500"
                              : "border-slate-300"
                          }`}
                        />
                        <ErrorMessage
                          name="briefTech"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* Competitive Positioning */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="competitivePosition"
                          className="mb-1 block text-sm font-semibold text-slate-800"
                        >
                          Competitive Positioning (Global benchmark in the
                          domain)
                          <span className="block text-xs font-normal text-slate-500">
                            Max. 1500 characters
                          </span>
                        </label>
                        <Field
                          name="competitivePosition"
                          as="textarea"
                          rows="4"
                          maxLength="1500"
                          className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                            errors.competitivePosition &&
                            touched.competitivePosition
                              ? "border-red-500"
                              : "border-slate-300"
                          }`}
                        />
                        <ErrorMessage
                          name="competitivePosition"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* Techno-economics */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="technoEconomics"
                          className="mb-1 block text-sm font-semibold text-slate-800"
                        >
                          Techno-economics
                          <span className="block text-xs font-normal text-slate-500">
                            Max. 1500 characters
                          </span>
                        </label>
                        <Field
                          name="technoEconomics"
                          as="textarea"
                          rows="4"
                          maxLength="1500"
                          className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                            errors.technoEconomics && touched.technoEconomics
                              ? "border-red-500"
                              : "border-slate-300"
                          }`}
                        />
                        <ErrorMessage
                          name="technoEconomics"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* Potential Ministries */}
                      <div>
                        <label
                          htmlFor="potentialMinistries"
                          className="mb-1 block text-sm font-semibold text-slate-800"
                        >
                          Potential Ministries (who may be benefited)
                        </label>
                        <Field
                          name="potentialMinistries"
                          options={potentialMinistryOptions}
                          component={CustomSelect}
                          placeholder="Select ministries..."
                          isMulti
                        />
                        <ErrorMessage
                          name="potentialMinistries"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* Environmental / Statutory */}
                      <div>
                        <label
                          htmlFor="environmentalStatutory"
                          className="mb-1 block text-sm font-semibold text-slate-800"
                        >
                          Environmental / Statutory Compliance
                          <span className="block text-xs font-normal text-slate-500">
                            Max. 300 characters
                          </span>
                        </label>
                        <Field
                          name="environmentalStatutory"
                          as="textarea"
                          rows="3"
                          maxLength="300"
                          className={`w-full rounded-lg border p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 ${
                            errors.environmentalStatutory &&
                            touched.environmentalStatutory
                              ? "border-red-500"
                              : "border-slate-300"
                          }`}
                        />
                        <ErrorMessage
                          name="environmentalStatutory"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* File Upload */}
                      <div className="md:col-span-2">
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                          <label
                            htmlFor="file"
                            className="mb-1 block text-sm font-semibold text-slate-800"
                          >
                            Upload File (Optional)
                            <span className="block text-xs font-normal text-slate-500">
                              Image/PDF (Max 10MB)
                            </span>
                          </label>

                          {passedTRN && existingFileUrl && !isFileRemoved && (
                            <div className="mb-3 flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={handleViewFile}
                                className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                              >
                                View Current
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveFile(setFieldValue)
                                }
                                className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
                              >
                                Remove Current
                              </button>
                              <span className="text-xs text-slate-600">
                                (Will be replaced if you upload new)
                              </span>
                            </div>
                          )}

                          {isFileRemoved && (
                            <p className="mb-2 text-xs text-orange-600">
                              Existing file marked for removal.
                            </p>
                          )}

                          <input
                            id="file"
                            type="file"
                            name="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="block w-full text-xs md:text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-xs md:file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                            onChange={(event) => {
                              const file = event.currentTarget.files[0];
                              if (file && file.size > 10 * 1024 * 1024) {
                                Swal.fire(
                                  "File Too Large",
                                  "Maximum file size is 10MB.",
                                  "error"
                                );
                                setFieldValue("file", null);
                                event.currentTarget.value = null;
                              } else {
                                setFieldValue("file", file);
                                setIsFileRemoved(false);
                              }
                            }}
                          />
                          <ErrorMessage
                            name="file"
                            component="div"
                            className="mt-1 text-xs text-red-500"
                          />
                        </div>
                      </div>

                      {/* Laboratory Details */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="laboratoryDetail"
                          className="mb-1 block text-sm font-semibold text-slate-800"
                        >
                          Laboratory Details{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="laboratoryDetail"
                          component={CustomSelect}
                          options={labDetails}
                          placeholder="Select laboratory detail..."
                          className={
                            errors.laboratoryDetail &&
                            touched.laboratoryDetail
                              ? "react-select-error"
                              : ""
                          }
                        />
                        <ErrorMessage
                          name="laboratoryDetail"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
                      <button
                        type="button"
                        onClick={() => navigate("/ViewTechnology")}
                        className="rounded-full bg-slate-100 px-5 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>

                      {passedTRN ? (
                        <>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-5 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-indigo-400/40 hover:bg-indigo-700 disabled:bg-indigo-400"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Updating..." : "Update Section"}
                          </button>

                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-5 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-emerald-400/40 hover:bg-emerald-600"
                            onClick={() =>
                              navigate("/sectionTwo", {
                                state: {
                                  technologyRefNo:
                                    generatedRefNo || passedTRN,
                                },
                              })
                            }
                          >
                            Section Two Next →
                          </button>
                        </>
                      ) : (
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-5 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-emerald-400/40 hover:bg-emerald-600 disabled:bg-emerald-400"
                          disabled={isSubmitting}
                        >
                          {isSubmitting
                            ? "Saving & Going Next..."
                            : "Section Two Next →"}
                        </button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Right info panel (same style family as SectionTwo) */}
          <div className="hidden md:flex md:w-1/4 items-start justify-center pr-6 py-10">
            <div className="w-full max-w-xs rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-xl px-5 py-6 space-y-4 text-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                  {ClipboardDocumentCheckIcon && (
                    <ClipboardDocumentCheckIcon className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-700">
                    Section 1 Guide
                  </p>
                  <p className="text-sm font-medium">
                    Key Technology Details
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-700">
                Capture a crisp, complete summary of your technology. These
                details will be visible to stakeholders browsing the portfolio.
              </p>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="rounded-2xl bg-white/70 border border-slate-200 px-3 py-2">
                  <p className="text-slate-500">Current TRN</p>
                  <p className="mt-1 text-xs font-semibold truncate text-slate-800">
                    {generatedRefNo || "Not generated"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/70 border border-slate-200 px-3 py-2">
                  <p className="text-slate-500">Mode</p>
                  <p className="mt-1 text-xs font-semibold text-slate-800">
                    {passedTRN ? "Edit / Update" : "New Entry"}
                  </p>
                </div>
              </div>

              <ul className="mt-2 space-y-1.5 text-[11px] text-slate-700">
                <li>• Section 1 focuses on identity and positioning.</li>
                <li>• File upload is optional and can be updated later.</li>
                <li>• You can move to Section 2 after saving once.</li>
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

