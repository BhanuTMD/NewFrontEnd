// import { useState, useEffect } from "react";
// import axios from "axios";
// import FooterBar from "./common/footer";
// import Header from "./common/header";
// import NavBar from "./common/navBar";
// import Section from "./common/section";
// // import Sidebar from "./common/sidebar";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import Swal from "sweetalert2";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { useNavigate } from "react-router-dom";

// const SectionThree = () => {
//   const initialValues = {
//     technologyRefNo: "",
//     licenseName: "",
//     dateOfAgreementSigning: null,
//     typeOfLicense: "",
//     staRegionalGeography: "",
//     detailsOfExclusivity: "",
//     dateOfLicense: null,
//     licenseValidUntil: null,
//     paymentTerms: "",
//     royalty: [{ amount: "", date: null }],
//     premia: [{ amount: "", date: null }],
//     subTotalRoyalty: 0, // Initialize to 0
//     subTotalPremia: 0, // Initialize to 0
//     grandTotal: 0, // Initialize to 0
//   };

//   const navigate = useNavigate();
//   const [royalties, setRoyalties] = useState([{ amount: "", date: null }]);
//   const [premias, setPremias] = useState([{ amount: "", date: null }]);
//   const [subTotalRoyalty, setSubTotalRoyalty] = useState(0);
//   const [subTotalPremia, setSubTotalPremia] = useState(0);
//   const [grandTotal, setGrandTotal] = useState(0);

//   // Date limits
//   const minDate = new Date("1900-08-12");
//   const maxDate = new Date("3000-08-12");

//   useEffect(() => {
//     const subTotalRoyalty = royalties.reduce(
//       (acc, item) => acc + parseFloat(item.amount || 0),
//       0
//     );
//     const subTotalPremia = premias.reduce(
//       (acc, item) => acc + parseFloat(item.amount || 0),
//       0
//     );

//     // Update Subtotals
//     setSubTotalRoyalty(subTotalRoyalty);
//     setSubTotalPremia(subTotalPremia);

//     // Calculate Grand Total
//     setGrandTotal(subTotalRoyalty + subTotalPremia);
//   }, [royalties, premias]);

//   const validationSchema = Yup.object({
//     licenseName: Yup.string()
//       .max(300, "Max. 300 characters")
//       .required("Required"),
//     dateOfAgreementSigning: Yup.date().required("Required"),
//     typeOfLicense: Yup.string().required("Required"),
//     staRegionalGeography: Yup.string().required("Required"),
//     detailsOfExclusivity: Yup.string().max(300, "Max. 300 characters"),
//     dateOfLicense: Yup.date().required("Required"),
//     licenseValidUntil: Yup.date().required("Required"),
//     paymentTerms: Yup.string().max(300, "Max. 300 characters"),
//   });

//   const handleSubmit = (values) => {
//     const payload = {
//       ...values,
//       royalty: royalties.map((r) => ({
//         amount: r.amount || "0",
//         date: r.date ? r.date.toISOString().split("T")[0] : null, // Format date to 'YYYY-MM-DD'
//       })),
//       premia: premias.map((p) => ({
//         amount: p.amount || "0",
//         date: p.date ? p.date.toISOString().split("T")[0] : null, // Format date to 'YYYY-MM-DD'
//       })),
//       subTotalRoyalty, // Include subtotal royalty
//       subTotalPremia, // Include subtotal premia
//       grandTotal, // Include grand total
//     };

//     console.log("Form submitted:", payload);
//     const url = "http://172.16.2.87:8080/apf/tdmp/saveSectionThree";
//     const headers = {
//       "Content-Type": "application/json",
//     };

//     axios
//       .post(url, payload, { headers })
//       .then(() => {
//         Swal.fire({
//           title: "Success!",
//           text: "Form submitted successfully!",
//           icon: "success",
//           confirmButtonText: "OK",
//         });
//       })
//       .catch(() => {
//         Swal.fire({
//           title: "Error!",
//           text: "Form submission failed. Please try again.",
//           icon: "error",
//           confirmButtonText: "OK",
//         });
//       });
//   };

//   const addRoyalty = () => {
//     setRoyalties([...royalties, { amount: "", date: null }]);
//   };

//   const removeRoyalty = (index) => {
//     const updatedRoyalties = royalties.filter((_, i) => i !== index);
//     setRoyalties(updatedRoyalties);
//   };

//   const addPremia = () => {
//     setPremias([...premias, { amount: "", date: null }]);
//   };

//   const removePremia = (index) => {
//     const updatedPremias = premias.filter((_, i) => i !== index);
//     setPremias(updatedPremias);
//   };

//   return (
//     <>
//       <Header />
//       <NavBar />
//       <div className="flex flex-col md:flex-row">
//         <div className="bg-gray-800"></div>
//         <div className="flex-1 p-8 bg-blue-200 border">
//           <Section sectionLine="Section 3: Details of License - Add/Modify Sub Form" />

//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ setFieldValue, values }) => (
//               <Form>
//                 {/* License Name */}
//                 <div className="form-group mb-4">
//                   <label
//                     className="font-bold flex justify-between"
//                     htmlFor="technologyRefNo"
//                   >
//                     Technology /Knowhow Ref No:
//                     <span className="Hint block text-xs text-red-500 inline text-end">
//                       Mandatory Field
//                     </span>
//                   </label>
//                   <Field
//                     type="text"
//                     name="technologyRefNo"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                     placeholder="Enter New Information"
//                   />
//                   <ErrorMessage
//                     name="technologyRefNo"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="licenseName">
//                     License Name.
//                     <span className="Hint block text-sm text-red-500 inline">
//                       Max. 300 Characters
//                     </span>
//                   </label>
//                   <Field
//                     maxLength="300"
//                     type="text"
//                     name="licenseName"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   />
//                   <ErrorMessage
//                     name="licenseName"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>

//                 {/* Date of Agreement Signing */}
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="dateOfAgreementSigning">
//                     Date of Agreement Signing &nbsp;
//                   </label>
//                   <DatePicker
//                     selected={values.dateOfAgreementSigning}
//                     onChange={(date) =>
//                       setFieldValue("dateOfAgreementSigning", date)
//                     }
//                     dateFormat="dd/MM/yyyy"
//                     minDate={minDate}
//                     maxDate={maxDate}
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                     placeholderText="Select a date"
//                   />
//                   <ErrorMessage
//                     name="dateOfAgreementSigning"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>

//                 {/* Type of License */}
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="typeOfLicense">
//                     Type of License
//                   </label>
//                   <Field
//                     name="typeOfLicense"
//                     as="select"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   >
//                     <option value="">--Please Select--</option>
//                     <option value="Exclusive">Exclusive</option>
//                     <option value="Non-Exclusive">Non-Exclusive</option>
//                   </Field>
//                   <ErrorMessage
//                     name="typeOfLicense"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>

//                 {/* Regional Geography */}
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="staRegionalGeography">
//                     Regional Geography
//                   </label>
//                   <Field
//                     name="staRegionalGeography"
//                     as="select"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   >
//                     <option value="">--Please Select--</option>
//                     <option value="North">North</option>
//                     <option value="North-East">North-East</option>
//                     <option value="East">East</option>
//                     <option value="West">West</option>
//                     <option value="South">South</option>
//                   </Field>
//                   <ErrorMessage
//                     name="stateRegionalGeography"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>

//                 {/* Details of Exclusivity */}
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="detailsOfExclusivity">
//                     Details of Exclusivity: &nbsp;
//                     <span className="Hint block text-sm text-red-500 inline">
//                       Max. 300 Characters
//                     </span>
//                   </label>
//                   <Field
//                     type="text"
//                     name="detailsOfExclusivity"
//                     as="textarea"
//                     maxLength="300"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   />
//                   <ErrorMessage
//                     name="detailsOfExclusivity"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>

//                 {/* Date of License */}
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="dateOfLicense">
//                     Date of License &nbsp;
//                   </label>
//                   <DatePicker
//                     selected={values.dateOfLicense}
//                     onChange={(date) => setFieldValue("dateOfLicense", date)}
//                     dateFormat="dd/MM/yyyy"
//                     minDate={minDate}
//                     maxDate={maxDate}
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                     placeholderText="Select a date"
//                   />
//                   <ErrorMessage
//                     name="dateOfLicense"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>

//                 {/* License Valid Upto */}
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="licenseValidUntil">
//                     License Valid Upto &nbsp;
//                   </label>
//                   <DatePicker
//                     selected={values.licenseValidUntil}
//                     onChange={(date) =>
//                       setFieldValue("licenseValidUntil", date)
//                     }
//                     dateFormat="dd/MM/yyyy"
//                     minDate={minDate}
//                     maxDate={maxDate}
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                     placeholderText="Select a date"
//                   />
//                   <ErrorMessage
//                     name="licenseValidUntil"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>

//                 {/* Payment Terms */}
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="paymentTerms">
//                     Payment Terms: &nbsp;
//                     <span className="Hint block text-sm text-red-500 inline">
//                       Max. 300 Characters
//                     </span>
//                   </label>
//                   <Field
//                     type="text"
//                     name="paymentTerms"
//                     as="textarea"
//                     maxLength="300"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   />
//                   <ErrorMessage
//                     name="paymentTerms"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>

//                 {/* Royalty Received */}
//                 {royalties.map((royalty, index) => (
//                   <div
//                     className="form-group mb-4 flex items-center"
//                     key={index}
//                   >
//                     <div className="w-1/2">
//                       <label
//                         className="font-bold"
//                         htmlFor={royaltyAmount_${index}}
//                       >
//                         Royalty Received (in INR)
//                       </label>
//                       <Field
//                         maxLength="300"
//                         type="number"
//                         step="0.01"
//                         name={royaltyAmount_${index}}
//                         className="w-full p-2 text-lg outline-0.1 rounded-md"
//                         onChange={(e) => {
//                           const updatedRoyalties = [...royalties];
//                           updatedRoyalties[index].amount = e.target.value;
//                           setRoyalties(updatedRoyalties);
//                         }}
//                         value={royalty.amount}
//                       />
//                       <ErrorMessage
//                         name={royaltyAmount_${index}}
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>
//                     <div className="w-1/5 pl-4">
//                       <label
//                         className="font-bold"
//                         htmlFor={royaltyDate_${index}}
//                       >
//                         Date of Royalty Received
//                       </label>
//                       <DatePicker
//                         selected={royalty.date}
//                         onChange={(date) => {
//                           const updatedRoyalties = [...royalties];
//                           updatedRoyalties[index].date = date;
//                           setRoyalties(updatedRoyalties);
//                         }}
//                         dateFormat="dd/MM/yyyy"
//                         minDate={minDate}
//                         maxDate={maxDate}
//                         className="w-full p-2 text-lg outline-0.1 rounded-md"
//                         placeholderText="Select a date"
//                       />
//                     </div>
//                     <div className="pl-4">
//                       {royalties.length > 1 && (
//                         <button
//                           type="button"
//                           className="bg-red-500 text-white px-4 py-2 rounded-md mt-5 mb-1"
//                           onClick={() => removeRoyalty(index)}
//                         >
//                           Delete
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}

//                 <button
//                   type="button"
//                   className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
//                   onClick={addRoyalty}
//                 >
//                   Add more
//                 </button>

//                 {/* Royalty Subtotal */}
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="subTotalRoyalty">
//                     Subtotal Royalty Received (in INR)
//                   </label>
//                   <Field
//                     maxLength="300"
//                     type="number"
//                     name="subTotalRoyalty"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                     value={subTotalRoyalty}
//                     readOnly
//                   />
//                 </div>

//                 {/* Premia Received */}
//                 {premias.map((premia, index) => (
//                   <div
//                     className="form-group mb-4 flex items-center"
//                     key={index}
//                   >
//                     <div className="w-1/2">
//                       <label
//                         className="font-bold"
//                         htmlFor={premiaAmount_${index}}
//                       >
//                         Premia Received (in INR)
//                       </label>
//                       <Field
//                         maxLength="300"
//                         type="number"
//                         step="0.01"
//                         name={premiaAmount_${index}}
//                         className="w-full p-2 text-lg outline-0.1 rounded-md"
//                         onChange={(e) => {
//                           const updatedPremias = [...premias];
//                           updatedPremias[index].amount = e.target.value;
//                           setPremias(updatedPremias);
//                         }}
//                         value={premia.amount}
//                       />
//                       <ErrorMessage
//                         name={premiaAmount_${index}}
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>
//                     <div className="w-1/5 pl-4">
//                       <label
//                         className="font-bold"
//                         htmlFor={premiaDate_${index}}
//                       >
//                         Date of Premia Received
//                       </label>
//                       <DatePicker
//                         selected={premia.date}
//                         onChange={(date) => {
//                           const updatedPremias = [...premias];
//                           updatedPremias[index].date = date;
//                           setPremias(updatedPremias);
//                         }}
//                         dateFormat="dd/MM/yyyy"
//                         minDate={minDate}
//                         maxDate={maxDate}
//                         className="w-full p-2 text-lg outline-0.1 rounded-md"
//                         placeholderText="Select a date"
//                       />
//                     </div>
//                     <div className="pl-4">
//                       {premias.length > 1 && (
//                         <button
//                           type="button"
//                           className="bg-red-500 text-white px-4 py-2 rounded-md mt-5 mb-1"
//                           onClick={() => removePremia(index)}
//                         >
//                           Delete
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}

//                 <button
//                   type="button"
//                   className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
//                   onClick={addPremia}
//                 >
//                   Add more
//                 </button>

//                 {/* Premia Subtotal */}
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="subTotalPremia">
//                     Subtotal Premia Received (in INR)
//                   </label>
//                   <Field
//                     maxLength="300"
//                     type="number"
//                     name="subTotalPremia"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                     value={subTotalPremia}
//                     readOnly
//                   />
//                 </div>

//                 {/* Grand Total */}
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="GrandTotal">
//                     Grand Total (in INR)
//                   </label>
//                   <Field
//                     maxLength="300"
//                     type="number"
//                     name="GrandTotal"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                     value={grandTotal}
//                     readOnly
//                   />
//                 </div>

//                 <div className="form-group mb-4 flex justify-center ">
//                   <button
//                     type="button"
//                     className="px-2 py-2 bg-blue-500 text-white rounded-md "
//                     onClick={() => navigate("/sectionTwo")}
//                   >
//                     Previous
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4 "
//                   >
//                     Save
//                   </button>
//                   <button
//                     type="button"
//                     className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4"
//                     onClick={() => navigate("/sectionFour")}
//                   >
//                     Next
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

// export default SectionThree;


//sectionone updated code
// import axios from "axios";
// import Header from "Components/common/header";
// import Section from "Components/common/section";
// import NavBar from "Components/common/navBar";
// import FooterBar from "Components/common/footer";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import CustomSelect from "../utils/CustomSelect";
// import * as Yup from "yup";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { industrialSector } from "Components/data/industrialSector";
// import { theme } from "Components/data/theme";
// import { stakeHolders } from "Components/data/stakeHolders";
// import { lab } from "Components/data/lab";
// const SectionOne = () => {
//   const initialValues = {
//     technologyRefNo: "",
//     keywordTechnology: "",
//     nameTechnology: "",
//     industrialSector: [],
//     theme: [],
//     multiLabInstitute: "",
//     leadLaboratory: "",
//     associateInstitute: [],
//     technologyLevel: "",
//     scaleDevelopment: "",
//     yearDevelopment: "",
//     briefTech: "",
//     competitivePosition: "",
//     technoEconomics: "",
//     stakeHolders: [],
//     environmentalStatutory: "",
//     marketPotential: "",
//     file: null, // Assuming this is a file input
//     laboratoryDetail: "",
//   };
//   const validationSchema = Yup.object({
//     // technologyRefNo: Yup.string().required("Required"),
//     // keywordTechnology: Yup.string().required("Required"),
//     // nameTechnology: Yup.string().required("Required"),
//     // industrialSector: Yup.array().required("Required"), // Ensure this is an array
//     // leadLaboratory: Yup.string().required("Required"),
//     // associateInstitute: Yup.string().required("Required"),
//     // technologyLevel: Yup.string().required("Required"),
//     // scaleDevelopment: Yup.string().required("Required"),
//     // yearDevelopment: Yup.string().required("Required"),
//     // briefTech: Yup.string().required("Required"),
//     // competitivePosition: Yup.string().required("Required"),
//     // technoEconomics: Yup.string().required("Required"),
//     // marketPotential: Yup.string().required("Required"),
//     // environmentalStatutory: Yup.string().required("Required"),
//     // laboratoryDetail: Yup.string().required("Required"),
//   });
//   const navigate = useNavigate();

//   const handleSubmit = (values) => {
//     console.log("handle submit is calling********", values);

//     const url = "http://172.16.2.246:8080/apf/tdmp/saveSectionOne";

//     // Create FormData object
//     const formData = new FormData();

//     // Append simple fields
//     formData.append("technologyRefNo", values.technologyRefNo);
//     formData.append("keywordTechnology", values.keywordTechnology);
//     formData.append("nameTechnology", values.nameTechnology);

//     // Append arrays
//     if (values.industrialSector && Array.isArray(values.industrialSector)) {
//       values.industrialSector.forEach((item) =>
//         formData.append("industrialSector", item)
//       );
//     }
//     if (values.theme && Array.isArray(values.theme)) {
//       values.theme.forEach((item) => formData.append("theme", item));
//     }
//     if (values.associateInstitute && Array.isArray(values.associateInstitute)) {
//       values.associateInstitute.forEach((item) =>
//         formData.append("associateInstitute", item)
//       );
//     }
//     // Single field
//     formData.append("leadLaboratory", values.leadLaboratory);
//     // Rest of the fields
//     formData.append("technologyLevel", values.technologyLevel);
//     formData.append("scaleDevelopment", values.scaleDevelopment);
//     formData.append("yearDevelopment", values.yearDevelopment);
//     formData.append("briefTech", values.briefTech);
//     formData.append("competitivePosition", values.competitivePosition);
//     formData.append("technoEconomics", values.technoEconomics);

//     if (values.stakeHolders && Array.isArray(values.stakeHolders)) {
//       values.stakeHolders.forEach((item) =>
//         formData.append("stakeHolders", item)
//       );
//     }
//     formData.append("environmentalStatutory", values.environmentalStatutory);
//     formData.append("marketPotential", values.marketPotential);
//     // File field
//     if (values.file) {
//       formData.append("file", values.file); // Changed 'file' to 'file'
//     }
//     formData.append("laboratoryDetail", values.laboratoryDetail);
//     // Now post the formData (no need to set Content-Type manually)
//     axios
//       .post(url, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data", // Explicitly set the content type
//         },
//       })
//       .then((response) => {
//         console.log("Response data:", response.data);
//         Swal.fire({
//           title: "Success!",
//           text: "Form submitted successfully!",
//           icon: "success",
//           confirmButtonText: "OK",
//         });
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         Swal.fire({
//           title: "Error!",
//           text: "Form submission failed. Please try again.",
//           icon: "error",
//           confirmButtonText: "OK",
//         });
//       });
//   };
//   return (
//     <>
//       <Header />
//       <NavBar />
//       <div className="flex">
//         <div className="bg-gray-800  "></div>
//         {/* Form */}
//         <div className="flex-1 p-8 bg-blue-200 border">
//           <Section
//             sectionLine="Section 1 : Key Details - Add New Technology / Knowhow Information"
//           />
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ setFieldValue }) => (
//               <Form>
//                 <div className="flex space-x-4 mb-4">
//                   {/* First Field */}
//                   <div className="form-group w-1/2">
//                     <label className="font-bold flex justify-between" htmlFor="technologyRefNo">
//                       Technology /Knowhow Ref No:
//                       <span className="Hint block text-xs text-red-500 inline text-end">
//                         Mandatory Field
//                       </span>
//                     </label>
//                     <Field
//                       type="text"
//                       name="technologyRefNo"
//                       className="w-full p-2 text-lg outline-0.1 rounded-md"
//                       placeholder="Enter New Information"
//                     />
//                     <ErrorMessage
//                       name="technologyRefNo"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>

//                   {/* Second Field */}
//                   <div className="form-group w-1/2">
//                     <label className="font-bold" htmlFor="keywordTechnology">
//                       Keywords for Technology / Knowhow
//                     </label>
//                     <Field
//                       type="text"
//                       name="keywordTechnology"
//                       defaultValue="CSIR/ANB/BIOT/01"
//                       className="w-full p-2 text-lg outline-0.1 rounded-md"
//                     />
//                     <ErrorMessage
//                       name="keywordTechnology"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex space-x-4 mb-4">
//                   {/* Industrial Sector */}
//                   <div className="form-group mb-4 w-1/2">
//                     <label className="font-bold" htmlFor="industrialSector">
//                       Industrial Sector
//                     </label>
//                     <Field
//                       name="industrialSector"
//                       options={industrialSector}
//                       component={CustomSelect}
//                       placeholder="Select Industrial Sector..."
//                       isMulti={true}
//                       className="block text-lg outline-0.1 rounded-md"
//                     />
//                     <ErrorMessage
//                       name="industrialSector"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>

//                   {/* Lead Laboratory */}
//                   <div className="form-group mb-4 w-1/2">
//                     <label className="font-bold" htmlFor="leadLaboratory">
//                       Lead Laboratory / Institute
//                     </label>
//                     <Field
//                       name="leadLaboratory"
//                       options={lab}
//                       component={CustomSelect}
//                       placeholder="Select a Lab..."
//                       className="block text-lg outline-0.1 rounded-md"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex space-x-4 mb-4">
//                   {/* Theme Selector */}
//                   <div className="form-group w-1/2">
//                     <label className="font-bold" htmlFor="theme">
//                       Theme
//                     </label>
//                     <Field
//                       name="theme"
//                       options={theme}
//                       component={CustomSelect}
//                       placeholder="Select a Theme..."
//                       isMulti={true}
//                       className="block w-full text-lg outline-0.1 rounded-md"
//                     />
//                     <ErrorMessage
//                       name="theme"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>

//                   {/* Multi Lab/Institute with inline label & radios */}
//                   <div className="form-group w-1/2 flex items-center">
//                     <label
//                       className="font-bold mr-4 whitespace-nowrap"
//                       htmlFor="multiLabInstitute"
//                     >
//                       Multi Laboratories / Institutes
//                     </label>
//                     <div className="flex space-x-4 p-7 relative">
//                       <label htmlFor="multiLabYes" className="flex items-center">
//                         <input
//                           type="radio"
//                           id="multiLabYes"
//                           name="multiLabInstitute"
//                           value="Yes"
//                           className="mr-1"
//                           onChange={() => setFieldValue("multiLabInstitute", "Yes")}
//                         />
//                         Yes
//                       </label>
//                       <label htmlFor="multiLabNo" className="flex items-center">
//                         <input
//                           type="radio"
//                           id="multiLabNo"
//                           name="multiLabInstitute"
//                           value="No"
//                           className="mr-1"
//                           onChange={() => setFieldValue("multiLabInstitute", "No")}
//                         />
//                         No
//                       </label>
//                     </div>
//                     {/* Error message under the whole field */}
//                     <div className="absolute mt-10 text-red-500">
//                       <ErrorMessage name="multiLabInstitute" component="div" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex space-x-4 mb-4">
//                   {/* Multi Labs Dropdown */}
//                   <div className="form-group w-1/2">
//                     <label className="font-bold" htmlFor="lab">
//                       If Yes, Please Specify Labs/Institutes
//                     </label>
//                     <Field
//                       name="lab"
//                       options={lab}
//                       component={CustomSelect}
//                       placeholder="Select List Of Multilabs From here..."
//                       isMulti={true}
//                       className="block w-full text-lg outline-0.1 rounded-md"
//                     />
//                     <ErrorMessage
//                       name="lab"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>

//                   {/* TRL Dropdown */}
//                   <div className="form-group w-1/2">
//                     <label className="font-bold" htmlFor="technologyLevel">
//                       Technology Readiness Level (TRL)
//                     </label>
//                     <Field
//                       as="select"
//                       name="technologyLevel"
//                       className="w-full p-2 text-lg outline-0.1 rounded-md"
//                     >
//                       <option value="" label="Select TRL" />
//                       {[...Array(9).keys()].map((i) => (
//                         <option key={i + 1} value={i + 1}>
//                           {i + 1}
//                         </option>
//                       ))}
//                     </Field>
//                     <ErrorMessage
//                       name="technologyLevel"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex space-x-4 mb-4">
//                   {/* Scale of Development - textarea */}
//                   <div className="form-group w-1/2">
//                     <label className="font-bold" htmlFor="scaleDevelopment">
//                       Scale of Development:
//                       <span className="block text-sm text-red-500">
//                         Max. 250 Characters
//                       </span>
//                     </label>
//                     <Field
//                       type="text"
//                       name="scaleDevelopment"
//                       as="textarea"
//                       rows="3"
//                       maxLength="250"
//                       className="w-full p-1 text-lg outline-0.1 rounded-md"
//                     />
//                     <ErrorMessage
//                       name="scaleDevelopment"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>

//                   {/* Year of Development - input */}
//                   <div className="form-group w-1/2">
//                     <label className="font-bold" htmlFor="yearDevelopment">
//                       Year of Development
//                     </label>
//                     <Field
//                       type="text"
//                       name="yearDevelopment"
//                       className="w-full p-2 text-lg mt-5 outline-0.1 rounded-md"
//                     />
//                     <ErrorMessage
//                       name="yearDevelopment"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
//                   {/* Brief Technology Details */}
//                   <div className="form-group w-full md:w-1/2 mb-4 md:mb-0">
//                     <label className="font-bold block mb-1" htmlFor="briefTech">
//                       Brief details of Technology / Knowhow:
//                       <span className="block text-sm text-red-500">
//                         Max. 1000 Characters
//                       </span>
//                     </label>
//                     <Field
//                       type="text"
//                       name="briefTech"
//                       as="textarea"
//                       rows="3"
//                       maxLength="1000"
//                       className="w-full p-2 text-lg  mt-6 outline-0.1 rounded-md"
//                     />
//                     <ErrorMessage
//                       name="briefTech"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>
//                   {/* Competitive Positioning */}
//                   <div className="form-group w-full md:w-1/2">
//                     <label className="font-bold block mb-1" htmlFor="competitivePosition">
//                       Competitive Positioning in the domain (how is it better than competing technology) /
//                       Technology Benchmarking
//                       <span className="block text-sm text-red-500">
//                         Max. 1500 Characters
//                       </span>
//                     </label>
//                     <Field
//                       type="text"
//                       name="competitivePosition"
//                       as="textarea"
//                       rows="3"
//                       maxLength="1500"
//                       className="w-full p-2  text-lg outline-0.1 rounded-md"
//                     />
//                     <ErrorMessage
//                       name="competitivePosition"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
//                   {/* Potential Stakeholders Dropdown */}
//                   <div className="form-group w-full md:w-1/2 mb-4 md:mb-0">
//                     <label className="font-bold" htmlFor="stakeHolders">
//                       Potential Stakeholders
//                     </label>
//                     <Field
//                       name="stakeHolders"
//                       options={stakeHolders}
//                       component={CustomSelect}
//                       placeholder="Select Ministry List from here..."
//                       isMulti={true}
//                       className="block w-full text-lg mt-2 outline-0.1 rounded-md"
//                     />
//                     <ErrorMessage
//                       name="stakeHolders"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>
//                   {/* Techno-economics Textarea */}
//                   <div className="form-group w-full md:w-1/2">
//                     <label className="font-bold block mb-1" htmlFor="technoEconomics">
//                       Techno-economics (including development & deployment cost, operational cost, payback period etc.)
//                       <span className="block text-sm text-red-500">
//                         Max. 1500 Characters
//                       </span>
//                     </label>
//                     <Field
//                       type="text"
//                       name="technoEconomics"
//                       as="textarea"
//                       rows="3"
//                       maxLength="1500"
//                       className="w-full p-2 text-lg outline-0.1 rounded-md"
//                     />
//                     <ErrorMessage
//                       name="technoEconomics"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
//                   {/* Market Potential */}
//                   <div className="form-group w-full md:w-1/2 mb-4 md:mb-0">
//                     <label className="font-bold block mb-1" htmlFor="marketPotential">
//                       Market Potential
//                       <span className="block text-sm text-red-500">
//                         Max. 1000 Characters
//                       </span>
//                     </label>
//                     <Field
//                       type="text"
//                       name="marketPotential"
//                       as="textarea"
//                       rows="3"
//                       maxLength="1000"
//                       className="w-full p-2 text-lg outline-0.1 rounded-md"
//                     />
//                     <ErrorMessage
//                       name="marketPotential"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>

//                   {/* Environmental / Statutory Compliance */}
//                   <div className="form-group w-full md:w-1/2">
//                     <label className="font-bold block mb-1" htmlFor="environmentalStatutory">
//                       Environmental considerations / Statutory regulatory compliance details
//                       <span className="block text-sm text-red-500">
//                         Max. 1000 Characters
//                       </span>
//                     </label>
//                     <Field
//                       type="text"
//                       name="environmentalStatutory"
//                       as="textarea"
//                       rows="3"
//                       maxLength="1000"
//                       className="w-full p-2 text-lg outline-0.1 rounded-md"
//                     />
//                     <ErrorMessage
//                       name="environmentalStatutory"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
//                   {/* File Upload Field */}
//                   <div className="form-group w-full md:w-1/2 mb-4 md:mb-0">
//                     <label className="font-bold block mb-1" htmlFor="file">
//                       Upload High-Resolution file (Optional)
//                     </label>
//                     <input
//                       type="file"
//                       name="file"
//                       accept=".jpg,.jpeg,.png,.pdf"
//                       className="w-full p-2 text-lg outline-0.1 rounded-md"
//                       onChange={(e) => {
//                         const file = e.currentTarget.files[0];
//                         const maxSize = 10 * 1024 * 1024; // 10 MB

//                         if (file) {
//                           const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
//                           if (!allowedTypes.includes(file.type)) {
//                             alert("Only JPG, PNG, and PDF files are allowed.");
//                             e.target.value = null; // Reset the input
//                             return;
//                           }

//                           if (file.size > maxSize) {
//                             alert("File size should be less than or equal to 10MB.");
//                             e.target.value = null; // Reset the input
//                             return;
//                           }

//                           // Set file if valid
//                           setFieldValue("file", file);
//                         }
//                       }}
//                     />
//                   </div>

//                   {/* Contact Details Textarea */}
//                   <div className="form-group w-full md:w-1/2">
//                     <label className="font-bold block mb-1" htmlFor="laboratoryDetail">
//                       Contact Details of Laboratory
//                       <span className="block text-sm text-red-500">
//                         Max. 300 Characters
//                       </span>
//                     </label>
//                     <Field
//                       type="text"
//                       name="laboratoryDetail"
//                       as="textarea"
//                       rows="3"
//                       maxLength="300"
//                       className="w-full p-2 text-lg outline-0.1 rounded-md"
//                     />
//                     <ErrorMessage
//                       name="laboratoryDetail"
//                       component="div"
//                       className="text-red-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group mb-4 flex justify-center ">
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-green-600 text-white rounded-md "
//                   >
//                     Save
//                   </button>
//                   <button
//                     type="button"
//                     className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4"
//                     onClick={() => navigate("/sectionTwo")}
//                   >
//                     Next
//                   </button>
//                 </div>
//                 {/* <MyForm/> */}
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//       <FooterBar />
//     </>
//   );
// };

// export default SectionOne;
