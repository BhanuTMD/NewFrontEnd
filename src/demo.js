// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import FooterBar from "./common/footer";
// // import Header from "./common/header";
// // import NavBar from "./common/navBar";
// // import Section from "./common/section";
// // // import Sidebar from "./common/sidebar";
// // import { Formik, Field, Form, ErrorMessage } from "formik";
// // import * as Yup from "yup";
// // import Swal from "sweetalert2";
// // import DatePicker from "react-datepicker";
// // import "react-datepicker/dist/react-datepicker.css";
// // import { useNavigate } from "react-router-dom";

// // const SectionThree = () => {
// //   const initialValues = {
// //     technologyRefNo: "",
// //     licenseName: "",
// //     dateOfAgreementSigning: null,
// //     typeOfLicense: "",
// //     staRegionalGeography: "",
// //     detailsOfExclusivity: "",
// //     dateOfLicense: null,
// //     licenseValidUntil: null,
// //     paymentTerms: "",
// //     royalty: [{ amount: "", date: null }],
// //     premia: [{ amount: "", date: null }],
// //     subTotalRoyalty: 0, // Initialize to 0
// //     subTotalPremia: 0, // Initialize to 0
// //     grandTotal: 0, // Initialize to 0
// //   };

// //   const navigate = useNavigate();
// //   const [royalties, setRoyalties] = useState([{ amount: "", date: null }]);
// //   const [premias, setPremias] = useState([{ amount: "", date: null }]);
// //   const [subTotalRoyalty, setSubTotalRoyalty] = useState(0);
// //   const [subTotalPremia, setSubTotalPremia] = useState(0);
// //   const [grandTotal, setGrandTotal] = useState(0);

// //   // Date limits
// //   const minDate = new Date("1900-08-12");
// //   const maxDate = new Date("3000-08-12");

// //   useEffect(() => {
// //     const subTotalRoyalty = royalties.reduce(
// //       (acc, item) => acc + parseFloat(item.amount || 0),
// //       0
// //     );
// //     const subTotalPremia = premias.reduce(
// //       (acc, item) => acc + parseFloat(item.amount || 0),
// //       0
// //     );

// //     // Update Subtotals
// //     setSubTotalRoyalty(subTotalRoyalty);
// //     setSubTotalPremia(subTotalPremia);

// //     // Calculate Grand Total
// //     setGrandTotal(subTotalRoyalty + subTotalPremia);
// //   }, [royalties, premias]);

// //   const validationSchema = Yup.object({
// //     licenseName: Yup.string()
// //       .max(300, "Max. 300 characters")
// //       .required("Required"),
// //     dateOfAgreementSigning: Yup.date().required("Required"),
// //     typeOfLicense: Yup.string().required("Required"),
// //     staRegionalGeography: Yup.string().required("Required"),
// //     detailsOfExclusivity: Yup.string().max(300, "Max. 300 characters"),
// //     dateOfLicense: Yup.date().required("Required"),
// //     licenseValidUntil: Yup.date().required("Required"),
// //     paymentTerms: Yup.string().max(300, "Max. 300 characters"),
// //   });

// //   const handleSubmit = (values) => {
// //     const payload = {
// //       ...values,
// //       royalty: royalties.map((r) => ({
// //         amount: r.amount || "0",
// //         date: r.date ? r.date.toISOString().split("T")[0] : null, // Format date to 'YYYY-MM-DD'
// //       })),
// //       premia: premias.map((p) => ({
// //         amount: p.amount || "0",
// //         date: p.date ? p.date.toISOString().split("T")[0] : null, // Format date to 'YYYY-MM-DD'
// //       })),
// //       subTotalRoyalty, // Include subtotal royalty
// //       subTotalPremia, // Include subtotal premia
// //       grandTotal, // Include grand total
// //     };

// //     console.log("Form submitted:", payload);
// //     const url = "http://172.16.2.87:8080/apf/tdmp/saveSectionThree";
// //     const headers = {
// //       "Content-Type": "application/json",
// //     };

// //     axios
// //       .post(url, payload, { headers })
// //       .then(() => {
// //         Swal.fire({
// //           title: "Success!",
// //           text: "Form submitted successfully!",
// //           icon: "success",
// //           confirmButtonText: "OK",
// //         });
// //       })
// //       .catch(() => {
// //         Swal.fire({
// //           title: "Error!",
// //           text: "Form submission failed. Please try again.",
// //           icon: "error",
// //           confirmButtonText: "OK",
// //         });
// //       });
// //   };

// //   const addRoyalty = () => {
// //     setRoyalties([...royalties, { amount: "", date: null }]);
// //   };

// //   const removeRoyalty = (index) => {
// //     const updatedRoyalties = royalties.filter((_, i) => i !== index);
// //     setRoyalties(updatedRoyalties);
// //   };

// //   const addPremia = () => {
// //     setPremias([...premias, { amount: "", date: null }]);
// //   };

// //   const removePremia = (index) => {
// //     const updatedPremias = premias.filter((_, i) => i !== index);
// //     setPremias(updatedPremias);
// //   };

// //   return (
// //     <>
// //       <Header />
// //       <NavBar />
// //       <div className="flex flex-col md:flex-row">
// //         <div className="bg-gray-800"></div>
// //         <div className="flex-1 p-8 bg-blue-200 border">
// //           <Section sectionLine="Section 3: Details of License - Add/Modify Sub Form" />

// //           <Formik
// //             initialValues={initialValues}
// //             validationSchema={validationSchema}
// //             onSubmit={handleSubmit}
// //           >
// //             {({ setFieldValue, values }) => (
// //               <Form>
// //                 {/* License Name */}
// //                 <div className="form-group mb-4">
// //                   <label
// //                     className="font-bold flex justify-between"
// //                     htmlFor="technologyRefNo"
// //                   >
// //                     Technology /Knowhow Ref No:
// //                     <span className="Hint block text-xs text-red-500 inline text-end">
// //                       Mandatory Field
// //                     </span>
// //                   </label>
// //                   <Field
// //                     type="text"
// //                     name="technologyRefNo"
// //                     className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                     placeholder="Enter New Information"
// //                   />
// //                   <ErrorMessage
// //                     name="technologyRefNo"
// //                     component="div"
// //                     className="text-red-500"
// //                   />
// //                 </div>
// //                 <div className="form-group mb-4">
// //                   <label className="font-bold" htmlFor="licenseName">
// //                     License Name.
// //                     <span className="Hint block text-sm text-red-500 inline">
// //                       Max. 300 Characters
// //                     </span>
// //                   </label>
// //                   <Field
// //                     maxLength="300"
// //                     type="text"
// //                     name="licenseName"
// //                     className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                   />
// //                   <ErrorMessage
// //                     name="licenseName"
// //                     component="div"
// //                     className="text-red-500"
// //                   />
// //                 </div>

// //                 {/* Date of Agreement Signing */}
// //                 <div className="form-group mb-4">
// //                   <label className="font-bold" htmlFor="dateOfAgreementSigning">
// //                     Date of Agreement Signing &nbsp;
// //                   </label>
// //                   <DatePicker
// //                     selected={values.dateOfAgreementSigning}
// //                     onChange={(date) =>
// //                       setFieldValue("dateOfAgreementSigning", date)
// //                     }
// //                     dateFormat="dd/MM/yyyy"
// //                     minDate={minDate}
// //                     maxDate={maxDate}
// //                     className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                     placeholderText="Select a date"
// //                   />
// //                   <ErrorMessage
// //                     name="dateOfAgreementSigning"
// //                     component="div"
// //                     className="text-red-500"
// //                   />
// //                 </div>

// //                 {/* Type of License */}
// //                 <div className="form-group mb-4">
// //                   <label className="font-bold" htmlFor="typeOfLicense">
// //                     Type of License
// //                   </label>
// //                   <Field
// //                     name="typeOfLicense"
// //                     as="select"
// //                     className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                   >
// //                     <option value="">--Please Select--</option>
// //                     <option value="Exclusive">Exclusive</option>
// //                     <option value="Non-Exclusive">Non-Exclusive</option>
// //                   </Field>
// //                   <ErrorMessage
// //                     name="typeOfLicense"
// //                     component="div"
// //                     className="text-red-500"
// //                   />
// //                 </div>

// //                 {/* Regional Geography */}
// //                 <div className="form-group mb-4">
// //                   <label className="font-bold" htmlFor="staRegionalGeography">
// //                     Regional Geography
// //                   </label>
// //                   <Field
// //                     name="staRegionalGeography"
// //                     as="select"
// //                     className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                   >
// //                     <option value="">--Please Select--</option>
// //                     <option value="North">North</option>
// //                     <option value="North-East">North-East</option>
// //                     <option value="East">East</option>
// //                     <option value="West">West</option>
// //                     <option value="South">South</option>
// //                   </Field>
// //                   <ErrorMessage
// //                     name="stateRegionalGeography"
// //                     component="div"
// //                     className="text-red-500"
// //                   />
// //                 </div>

// //                 {/* Details of Exclusivity */}
// //                 <div className="form-group mb-4">
// //                   <label className="font-bold" htmlFor="detailsOfExclusivity">
// //                     Details of Exclusivity: &nbsp;
// //                     <span className="Hint block text-sm text-red-500 inline">
// //                       Max. 300 Characters
// //                     </span>
// //                   </label>
// //                   <Field
// //                     type="text"
// //                     name="detailsOfExclusivity"
// //                     as="textarea"
// //                     maxLength="300"
// //                     className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                   />
// //                   <ErrorMessage
// //                     name="detailsOfExclusivity"
// //                     component="div"
// //                     className="text-red-500"
// //                   />
// //                 </div>

// //                 {/* Date of License */}
// //                 <div className="form-group mb-4">
// //                   <label className="font-bold" htmlFor="dateOfLicense">
// //                     Date of License &nbsp;
// //                   </label>
// //                   <DatePicker
// //                     selected={values.dateOfLicense}
// //                     onChange={(date) => setFieldValue("dateOfLicense", date)}
// //                     dateFormat="dd/MM/yyyy"
// //                     minDate={minDate}
// //                     maxDate={maxDate}
// //                     className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                     placeholderText="Select a date"
// //                   />
// //                   <ErrorMessage
// //                     name="dateOfLicense"
// //                     component="div"
// //                     className="text-red-500"
// //                   />
// //                 </div>

// //                 {/* License Valid Upto */}
// //                 <div className="form-group mb-4">
// //                   <label className="font-bold" htmlFor="licenseValidUntil">
// //                     License Valid Upto &nbsp;
// //                   </label>
// //                   <DatePicker
// //                     selected={values.licenseValidUntil}
// //                     onChange={(date) =>
// //                       setFieldValue("licenseValidUntil", date)
// //                     }
// //                     dateFormat="dd/MM/yyyy"
// //                     minDate={minDate}
// //                     maxDate={maxDate}
// //                     className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                     placeholderText="Select a date"
// //                   />
// //                   <ErrorMessage
// //                     name="licenseValidUntil"
// //                     component="div"
// //                     className="text-red-500"
// //                   />
// //                 </div>

// //                 {/* Payment Terms */}
// //                 <div className="form-group mb-4">
// //                   <label className="font-bold" htmlFor="paymentTerms">
// //                     Payment Terms: &nbsp;
// //                     <span className="Hint block text-sm text-red-500 inline">
// //                       Max. 300 Characters
// //                     </span>
// //                   </label>
// //                   <Field
// //                     type="text"
// //                     name="paymentTerms"
// //                     as="textarea"
// //                     maxLength="300"
// //                     className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                   />
// //                   <ErrorMessage
// //                     name="paymentTerms"
// //                     component="div"
// //                     className="text-red-500"
// //                   />
// //                 </div>

// //                 {/* Royalty Received */}
// //                 {royalties.map((royalty, index) => (
// //                   <div
// //                     className="form-group mb-4 flex items-center"
// //                     key={index}
// //                   >
// //                     <div className="w-1/2">
// //                       <label
// //                         className="font-bold"
// //                         htmlFor={royaltyAmount_${index}}
// //                       >
// //                         Royalty Received (in INR)
// //                       </label>
// //                       <Field
// //                         maxLength="300"
// //                         type="number"
// //                         step="0.01"
// //                         name={royaltyAmount_${index}}
// //                         className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                         onChange={(e) => {
// //                           const updatedRoyalties = [...royalties];
// //                           updatedRoyalties[index].amount = e.target.value;
// //                           setRoyalties(updatedRoyalties);
// //                         }}
// //                         value={royalty.amount}
// //                       />
// //                       <ErrorMessage
// //                         name={royaltyAmount_${index}}
// //                         component="div"
// //                         className="text-red-500"
// //                       />
// //                     </div>
// //                     <div className="w-1/5 pl-4">
// //                       <label
// //                         className="font-bold"
// //                         htmlFor={royaltyDate_${index}}
// //                       >
// //                         Date of Royalty Received
// //                       </label>
// //                       <DatePicker
// //                         selected={royalty.date}
// //                         onChange={(date) => {
// //                           const updatedRoyalties = [...royalties];
// //                           updatedRoyalties[index].date = date;
// //                           setRoyalties(updatedRoyalties);
// //                         }}
// //                         dateFormat="dd/MM/yyyy"
// //                         minDate={minDate}
// //                         maxDate={maxDate}
// //                         className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                         placeholderText="Select a date"
// //                       />
// //                     </div>
// //                     <div className="pl-4">
// //                       {royalties.length > 1 && (
// //                         <button
// //                           type="button"
// //                           className="bg-red-500 text-white px-4 py-2 rounded-md mt-5 mb-1"
// //                           onClick={() => removeRoyalty(index)}
// //                         >
// //                           Delete
// //                         </button>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}

// //                 <button
// //                   type="button"
// //                   className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
// //                   onClick={addRoyalty}
// //                 >
// //                   Add more
// //                 </button>

// //                 {/* Royalty Subtotal */}
// //                 <div className="form-group mb-4">
// //                   <label className="font-bold" htmlFor="subTotalRoyalty">
// //                     Subtotal Royalty Received (in INR)
// //                   </label>
// //                   <Field
// //                     maxLength="300"
// //                     type="number"
// //                     name="subTotalRoyalty"
// //                     className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                     value={subTotalRoyalty}
// //                     readOnly
// //                   />
// //                 </div>

// //                 {/* Premia Received */}
// //                 {premias.map((premia, index) => (
// //                   <div
// //                     className="form-group mb-4 flex items-center"
// //                     key={index}
// //                   >
// //                     <div className="w-1/2">
// //                       <label
// //                         className="font-bold"
// //                         htmlFor={premiaAmount_${index}}
// //                       >
// //                         Premia Received (in INR)
// //                       </label>
// //                       <Field
// //                         maxLength="300"
// //                         type="number"
// //                         step="0.01"
// //                         name={premiaAmount_${index}}
// //                         className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                         onChange={(e) => {
// //                           const updatedPremias = [...premias];
// //                           updatedPremias[index].amount = e.target.value;
// //                           setPremias(updatedPremias);
// //                         }}
// //                         value={premia.amount}
// //                       />
// //                       <ErrorMessage
// //                         name={premiaAmount_${index}}
// //                         component="div"
// //                         className="text-red-500"
// //                       />
// //                     </div>
// //                     <div className="w-1/5 pl-4">
// //                       <label
// //                         className="font-bold"
// //                         htmlFor={premiaDate_${index}}
// //                       >
// //                         Date of Premia Received
// //                       </label>
// //                       <DatePicker
// //                         selected={premia.date}
// //                         onChange={(date) => {
// //                           const updatedPremias = [...premias];
// //                           updatedPremias[index].date = date;
// //                           setPremias(updatedPremias);
// //                         }}
// //                         dateFormat="dd/MM/yyyy"
// //                         minDate={minDate}
// //                         maxDate={maxDate}
// //                         className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                         placeholderText="Select a date"
// //                       />
// //                     </div>
// //                     <div className="pl-4">
// //                       {premias.length > 1 && (
// //                         <button
// //                           type="button"
// //                           className="bg-red-500 text-white px-4 py-2 rounded-md mt-5 mb-1"
// //                           onClick={() => removePremia(index)}
// //                         >
// //                           Delete
// //                         </button>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}

// //                 <button
// //                   type="button"
// //                   className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
// //                   onClick={addPremia}
// //                 >
// //                   Add more
// //                 </button>

// //                 {/* Premia Subtotal */}
// //                 <div className="form-group mb-4">
// //                   <label className="font-bold" htmlFor="subTotalPremia">
// //                     Subtotal Premia Received (in INR)
// //                   </label>
// //                   <Field
// //                     maxLength="300"
// //                     type="number"
// //                     name="subTotalPremia"
// //                     className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                     value={subTotalPremia}
// //                     readOnly
// //                   />
// //                 </div>

// //                 {/* Grand Total */}
// //                 <div className="form-group mb-4">
// //                   <label className="font-bold" htmlFor="GrandTotal">
// //                     Grand Total (in INR)
// //                   </label>
// //                   <Field
// //                     maxLength="300"
// //                     type="number"
// //                     name="GrandTotal"
// //                     className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                     value={grandTotal}
// //                     readOnly
// //                   />
// //                 </div>

// //                 <div className="form-group mb-4 flex justify-center ">
// //                   <button
// //                     type="button"
// //                     className="px-2 py-2 bg-blue-500 text-white rounded-md "
// //                     onClick={() => navigate("/sectionTwo")}
// //                   >
// //                     Previous
// //                   </button>
// //                   <button
// //                     type="submit"
// //                     className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4 "
// //                   >
// //                     Save
// //                   </button>
// //                   <button
// //                     type="button"
// //                     className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4"
// //                     onClick={() => navigate("/sectionFour")}
// //                   >
// //                     Next
// //                   </button>
// //                 </div>
// //               </Form>
// //             )}
// //           </Formik>
// //         </div>
// //       </div>
// //       <FooterBar />
// //     </>
// //   );
// // };

// // export default SectionThree;


// //sectionone updated code
// // import axios from "axios";
// // import Header from "Components/common/header";
// // import Section from "Components/common/section";
// // import NavBar from "Components/common/navBar";
// // import FooterBar from "Components/common/footer";
// // import { Formik, Field, Form, ErrorMessage } from "formik";
// // import CustomSelect from "../utils/CustomSelect";
// // import * as Yup from "yup";
// // import Swal from "sweetalert2";
// // import { useNavigate } from "react-router-dom";
// // import { industrialSector } from "Components/data/industrialSector";
// // import { theme } from "Components/data/theme";
// // import { stakeHolders } from "Components/data/stakeHolders";
// // import { lab } from "Components/data/lab";
// // const SectionOne = () => {
// //   const initialValues = {
// //     technologyRefNo: "",
// //     keywordTechnology: "",
// //     nameTechnology: "",
// //     industrialSector: [],
// //     theme: [],
// //     multiLabInstitute: "",
// //     leadLaboratory: "",
// //     associateInstitute: [],
// //     technologyLevel: "",
// //     scaleDevelopment: "",
// //     yearDevelopment: "",
// //     briefTech: "",
// //     competitivePosition: "",
// //     technoEconomics: "",
// //     stakeHolders: [],
// //     environmentalStatutory: "",
// //     marketPotential: "",
// //     file: null, // Assuming this is a file input
// //     laboratoryDetail: "",
// //   };
// //   const validationSchema = Yup.object({
// //     // technologyRefNo: Yup.string().required("Required"),
// //     // keywordTechnology: Yup.string().required("Required"),
// //     // nameTechnology: Yup.string().required("Required"),
// //     // industrialSector: Yup.array().required("Required"), // Ensure this is an array
// //     // leadLaboratory: Yup.string().required("Required"),
// //     // associateInstitute: Yup.string().required("Required"),
// //     // technologyLevel: Yup.string().required("Required"),
// //     // scaleDevelopment: Yup.string().required("Required"),
// //     // yearDevelopment: Yup.string().required("Required"),
// //     // briefTech: Yup.string().required("Required"),
// //     // competitivePosition: Yup.string().required("Required"),
// //     // technoEconomics: Yup.string().required("Required"),
// //     // marketPotential: Yup.string().required("Required"),
// //     // environmentalStatutory: Yup.string().required("Required"),
// //     // laboratoryDetail: Yup.string().required("Required"),
// //   });
// //   const navigate = useNavigate();

// //   const handleSubmit = (values) => {
// //     console.log("handle submit is calling********", values);

// //     const url = "http://172.16.2.246:8282/apf/tdmp/saveSectionOne";

// //     // Create FormData object
// //     const formData = new FormData();

// //     // Append simple fields
// //     formData.append("technologyRefNo", values.technologyRefNo);
// //     formData.append("keywordTechnology", values.keywordTechnology);
// //     formData.append("nameTechnology", values.nameTechnology);

// //     // Append arrays
// //     if (values.industrialSector && Array.isArray(values.industrialSector)) {
// //       values.industrialSector.forEach((item) =>
// //         formData.append("industrialSector", item)
// //       );
// //     }
// //     if (values.theme && Array.isArray(values.theme)) {
// //       values.theme.forEach((item) => formData.append("theme", item));
// //     }
// //     if (values.associateInstitute && Array.isArray(values.associateInstitute)) {
// //       values.associateInstitute.forEach((item) =>
// //         formData.append("associateInstitute", item)
// //       );
// //     }
// //     // Single field
// //     formData.append("leadLaboratory", values.leadLaboratory);
// //     // Rest of the fields
// //     formData.append("technologyLevel", values.technologyLevel);
// //     formData.append("scaleDevelopment", values.scaleDevelopment);
// //     formData.append("yearDevelopment", values.yearDevelopment);
// //     formData.append("briefTech", values.briefTech);
// //     formData.append("competitivePosition", values.competitivePosition);
// //     formData.append("technoEconomics", values.technoEconomics);

// //     if (values.stakeHolders && Array.isArray(values.stakeHolders)) {
// //       values.stakeHolders.forEach((item) =>
// //         formData.append("stakeHolders", item)
// //       );
// //     }
// //     formData.append("environmentalStatutory", values.environmentalStatutory);
// //     formData.append("marketPotential", values.marketPotential);
// //     // File field
// //     if (values.file) {
// //       formData.append("file", values.file); // Changed 'file' to 'file'
// //     }
// //     formData.append("laboratoryDetail", values.laboratoryDetail);
// //     // Now post the formData (no need to set Content-Type manually)
// //     axios
// //       .post(url, formData, {
// //         headers: {
// //           "Content-Type": "multipart/form-data", // Explicitly set the content type
// //         },
// //       })
// //       .then((response) => {
// //         console.log("Response data:", response.data);
// //         Swal.fire({
// //           title: "Success!",
// //           text: "Form submitted successfully!",
// //           icon: "success",
// //           confirmButtonText: "OK",
// //         });
// //       })
// //       .catch((error) => {
// //         console.error("Error:", error);
// //         Swal.fire({
// //           title: "Error!",
// //           text: "Form submission failed. Please try again.",
// //           icon: "error",
// //           confirmButtonText: "OK",
// //         });
// //       });
// //   };
// //   return (
// //     <>
// //       <Header />
// //       <NavBar />
// //       <div className="flex">
// //         <div className="bg-gray-800  "></div>
// //         {/* Form */}
// //         <div className="flex-1 p-8 bg-blue-200 border">
// //           <Section
// //             sectionLine="Section 1 : Key Details - Add New Technology / Knowhow Information"
// //           />
// //           <Formik
// //             initialValues={initialValues}
// //             validationSchema={validationSchema}
// //             onSubmit={handleSubmit}
// //           >
// //             {({ setFieldValue }) => (
// //               <Form>
// //                 <div className="flex space-x-4 mb-4">
// //                   {/* First Field */}
// //                   <div className="form-group w-1/2">
// //                     <label className="font-bold flex justify-between" htmlFor="technologyRefNo">
// //                       Technology /Knowhow Ref No:
// //                       <span className="Hint block text-xs text-red-500 inline text-end">
// //                         Mandatory Field
// //                       </span>
// //                     </label>
// //                     <Field
// //                       type="text"
// //                       name="technologyRefNo"
// //                       className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                       placeholder="Enter New Information"
// //                     />
// //                     <ErrorMessage
// //                       name="technologyRefNo"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>

// //                   {/* Second Field */}
// //                   <div className="form-group w-1/2">
// //                     <label className="font-bold" htmlFor="keywordTechnology">
// //                       Keywords for Technology / Knowhow
// //                     </label>
// //                     <Field
// //                       type="text"
// //                       name="keywordTechnology"
// //                       defaultValue="CSIR/ANB/BIOT/01"
// //                       className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                     />
// //                     <ErrorMessage
// //                       name="keywordTechnology"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>
// //                 </div>
// //                 <div className="flex space-x-4 mb-4">
// //                   {/* Industrial Sector */}
// //                   <div className="form-group mb-4 w-1/2">
// //                     <label className="font-bold" htmlFor="industrialSector">
// //                       Industrial Sector
// //                     </label>
// //                     <Field
// //                       name="industrialSector"
// //                       options={industrialSector}
// //                       component={CustomSelect}
// //                       placeholder="Select Industrial Sector..."
// //                       isMulti={true}
// //                       className="block text-lg outline-0.1 rounded-md"
// //                     />
// //                     <ErrorMessage
// //                       name="industrialSector"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>

// //                   {/* Lead Laboratory */}
// //                   <div className="form-group mb-4 w-1/2">
// //                     <label className="font-bold" htmlFor="leadLaboratory">
// //                       Lead Laboratory / Institute
// //                     </label>
// //                     <Field
// //                       name="leadLaboratory"
// //                       options={lab}
// //                       component={CustomSelect}
// //                       placeholder="Select a Lab..."
// //                       className="block text-lg outline-0.1 rounded-md"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="flex space-x-4 mb-4">
// //                   {/* Theme Selector */}
// //                   <div className="form-group w-1/2">
// //                     <label className="font-bold" htmlFor="theme">
// //                       Theme
// //                     </label>
// //                     <Field
// //                       name="theme"
// //                       options={theme}
// //                       component={CustomSelect}
// //                       placeholder="Select a Theme..."
// //                       isMulti={true}
// //                       className="block w-full text-lg outline-0.1 rounded-md"
// //                     />
// //                     <ErrorMessage
// //                       name="theme"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>

// //                   {/* Multi Lab/Institute with inline label & radios */}
// //                   <div className="form-group w-1/2 flex items-center">
// //                     <label
// //                       className="font-bold mr-4 whitespace-nowrap"
// //                       htmlFor="multiLabInstitute"
// //                     >
// //                       Multi Laboratories / Institutes
// //                     </label>
// //                     <div className="flex space-x-4 p-7 relative">
// //                       <label htmlFor="multiLabYes" className="flex items-center">
// //                         <input
// //                           type="radio"
// //                           id="multiLabYes"
// //                           name="multiLabInstitute"
// //                           value="Yes"
// //                           className="mr-1"
// //                           onChange={() => setFieldValue("multiLabInstitute", "Yes")}
// //                         />
// //                         Yes
// //                       </label>
// //                       <label htmlFor="multiLabNo" className="flex items-center">
// //                         <input
// //                           type="radio"
// //                           id="multiLabNo"
// //                           name="multiLabInstitute"
// //                           value="No"
// //                           className="mr-1"
// //                           onChange={() => setFieldValue("multiLabInstitute", "No")}
// //                         />
// //                         No
// //                       </label>
// //                     </div>
// //                     {/* Error message under the whole field */}
// //                     <div className="absolute mt-10 text-red-500">
// //                       <ErrorMessage name="multiLabInstitute" component="div" />
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="flex space-x-4 mb-4">
// //                   {/* Multi Labs Dropdown */}
// //                   <div className="form-group w-1/2">
// //                     <label className="font-bold" htmlFor="lab">
// //                       If Yes, Please Specify Labs/Institutes
// //                     </label>
// //                     <Field
// //                       name="lab"
// //                       options={lab}
// //                       component={CustomSelect}
// //                       placeholder="Select List Of Multilabs From here..."
// //                       isMulti={true}
// //                       className="block w-full text-lg outline-0.1 rounded-md"
// //                     />
// //                     <ErrorMessage
// //                       name="lab"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>

// //                   {/* TRL Dropdown */}
// //                   <div className="form-group w-1/2">
// //                     <label className="font-bold" htmlFor="technologyLevel">
// //                       Technology Readiness Level (TRL)
// //                     </label>
// //                     <Field
// //                       as="select"
// //                       name="technologyLevel"
// //                       className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                     >
// //                       <option value="" label="Select TRL" />
// //                       {[...Array(9).keys()].map((i) => (
// //                         <option key={i + 1} value={i + 1}>
// //                           {i + 1}
// //                         </option>
// //                       ))}
// //                     </Field>
// //                     <ErrorMessage
// //                       name="technologyLevel"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>
// //                 </div>
// //                 <div className="flex space-x-4 mb-4">
// //                   {/* Scale of Development - textarea */}
// //                   <div className="form-group w-1/2">
// //                     <label className="font-bold" htmlFor="scaleDevelopment">
// //                       Scale of Development:
// //                       <span className="block text-sm text-red-500">
// //                         Max. 250 Characters
// //                       </span>
// //                     </label>
// //                     <Field
// //                       type="text"
// //                       name="scaleDevelopment"
// //                       as="textarea"
// //                       rows="3"
// //                       maxLength="250"
// //                       className="w-full p-1 text-lg outline-0.1 rounded-md"
// //                     />
// //                     <ErrorMessage
// //                       name="scaleDevelopment"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>

// //                   {/* Year of Development - input */}
// //                   <div className="form-group w-1/2">
// //                     <label className="font-bold" htmlFor="yearDevelopment">
// //                       Year of Development
// //                     </label>
// //                     <Field
// //                       type="text"
// //                       name="yearDevelopment"
// //                       className="w-full p-2 text-lg mt-5 outline-0.1 rounded-md"
// //                     />
// //                     <ErrorMessage
// //                       name="yearDevelopment"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>
// //                 </div>
// //                 <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
// //                   {/* Brief Technology Details */}
// //                   <div className="form-group w-full md:w-1/2 mb-4 md:mb-0">
// //                     <label className="font-bold block mb-1" htmlFor="briefTech">
// //                       Brief details of Technology / Knowhow:
// //                       <span className="block text-sm text-red-500">
// //                         Max. 1000 Characters
// //                       </span>
// //                     </label>
// //                     <Field
// //                       type="text"
// //                       name="briefTech"
// //                       as="textarea"
// //                       rows="3"
// //                       maxLength="1000"
// //                       className="w-full p-2 text-lg  mt-6 outline-0.1 rounded-md"
// //                     />
// //                     <ErrorMessage
// //                       name="briefTech"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>
// //                   {/* Competitive Positioning */}
// //                   <div className="form-group w-full md:w-1/2">
// //                     <label className="font-bold block mb-1" htmlFor="competitivePosition">
// //                       Competitive Positioning in the domain (how is it better than competing technology) /
// //                       Technology Benchmarking
// //                       <span className="block text-sm text-red-500">
// //                         Max. 1500 Characters
// //                       </span>
// //                     </label>
// //                     <Field
// //                       type="text"
// //                       name="competitivePosition"
// //                       as="textarea"
// //                       rows="3"
// //                       maxLength="1500"
// //                       className="w-full p-2  text-lg outline-0.1 rounded-md"
// //                     />
// //                     <ErrorMessage
// //                       name="competitivePosition"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>
// //                 </div>
// //                 <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
// //                   {/* Potential Stakeholders Dropdown */}
// //                   <div className="form-group w-full md:w-1/2 mb-4 md:mb-0">
// //                     <label className="font-bold" htmlFor="stakeHolders">
// //                       Potential Stakeholders
// //                     </label>
// //                     <Field
// //                       name="stakeHolders"
// //                       options={stakeHolders}
// //                       component={CustomSelect}
// //                       placeholder="Select Ministry List from here..."
// //                       isMulti={true}
// //                       className="block w-full text-lg mt-2 outline-0.1 rounded-md"
// //                     />
// //                     <ErrorMessage
// //                       name="stakeHolders"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>
// //                   {/* Techno-economics Textarea */}
// //                   <div className="form-group w-full md:w-1/2">
// //                     <label className="font-bold block mb-1" htmlFor="technoEconomics">
// //                       Techno-economics (including development & deployment cost, operational cost, payback period etc.)
// //                       <span className="block text-sm text-red-500">
// //                         Max. 1500 Characters
// //                       </span>
// //                     </label>
// //                     <Field
// //                       type="text"
// //                       name="technoEconomics"
// //                       as="textarea"
// //                       rows="3"
// //                       maxLength="1500"
// //                       className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                     />
// //                     <ErrorMessage
// //                       name="technoEconomics"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>
// //                 </div>
// //                 <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
// //                   {/* Market Potential */}
// //                   <div className="form-group w-full md:w-1/2 mb-4 md:mb-0">
// //                     <label className="font-bold block mb-1" htmlFor="marketPotential">
// //                       Market Potential
// //                       <span className="block text-sm text-red-500">
// //                         Max. 1000 Characters
// //                       </span>
// //                     </label>
// //                     <Field
// //                       type="text"
// //                       name="marketPotential"
// //                       as="textarea"
// //                       rows="3"
// //                       maxLength="1000"
// //                       className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                     />
// //                     <ErrorMessage
// //                       name="marketPotential"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>

// //                   {/* Environmental / Statutory Compliance */}
// //                   <div className="form-group w-full md:w-1/2">
// //                     <label className="font-bold block mb-1" htmlFor="environmentalStatutory">
// //                       Environmental considerations / Statutory regulatory compliance details
// //                       <span className="block text-sm text-red-500">
// //                         Max. 1000 Characters
// //                       </span>
// //                     </label>
// //                     <Field
// //                       type="text"
// //                       name="environmentalStatutory"
// //                       as="textarea"
// //                       rows="3"
// //                       maxLength="1000"
// //                       className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                     />
// //                     <ErrorMessage
// //                       name="environmentalStatutory"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
// //                   {/* File Upload Field */}
// //                   <div className="form-group w-full md:w-1/2 mb-4 md:mb-0">
// //                     <label className="font-bold block mb-1" htmlFor="file">
// //                       Upload High-Resolution file (Optional)
// //                     </label>
// //                     <input
// //                       type="file"
// //                       name="file"
// //                       accept=".jpg,.jpeg,.png,.pdf"
// //                       className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                       onChange={(e) => {
// //                         const file = e.currentTarget.files[0];
// //                         const maxSize = 10 * 1024 * 1024; // 10 MB

// //                         if (file) {
// //                           const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
// //                           if (!allowedTypes.includes(file.type)) {
// //                             alert("Only JPG, PNG, and PDF files are allowed.");
// //                             e.target.value = null; // Reset the input
// //                             return;
// //                           }

// //                           if (file.size > maxSize) {
// //                             alert("File size should be less than or equal to 10MB.");
// //                             e.target.value = null; // Reset the input
// //                             return;
// //                           }

// //                           // Set file if valid
// //                           setFieldValue("file", file);
// //                         }
// //                       }}
// //                     />
// //                   </div>

// //                   {/* Contact Details Textarea */}
// //                   <div className="form-group w-full md:w-1/2">
// //                     <label className="font-bold block mb-1" htmlFor="laboratoryDetail">
// //                       Contact Details of Laboratory
// //                       <span className="block text-sm text-red-500">
// //                         Max. 300 Characters
// //                       </span>
// //                     </label>
// //                     <Field
// //                       type="text"
// //                       name="laboratoryDetail"
// //                       as="textarea"
// //                       rows="3"
// //                       maxLength="300"
// //                       className="w-full p-2 text-lg outline-0.1 rounded-md"
// //                     />
// //                     <ErrorMessage
// //                       name="laboratoryDetail"
// //                       component="div"
// //                       className="text-red-500"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="form-group mb-4 flex justify-center ">
// //                   <button
// //                     type="submit"
// //                     className="px-4 py-2 bg-green-600 text-white rounded-md "
// //                   >
// //                     Save
// //                   </button>
// //                   <button
// //                     type="button"
// //                     className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4"
// //                     onClick={() => navigate("/sectionTwo")}
// //                   >
// //                     Next
// //                   </button>
// //                 </div>
// //                 {/* <MyForm/> */}
// //               </Form>
// //             )}
// //           </Formik>
// //         </div>
// //       </div>
// //       <FooterBar />
// //     </>
// //   );
// // };

// // export default SectionOne;



// // sectointhree updated code


// import axios from "axios";
// // import Header from "Components/common/header";
// import Section from "Components/common/section";
// import NavBar from "Components/common/navBar";
// import FooterBar from "Components/common/footer";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import CustomSelect from "../utils/CustomSelect";
// import * as Yup from "yup";
// import Swal from "sweetalert2";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { industrialSector } from "Components/data/industrialSector";
// import { potentialMinistries } from "Components/data/potentialMinistries";
// import { theme } from "Components/data/theme";
// import { stakeHolders } from "Components/data/stakeHolders";
// import { lab } from "Components/data/lab";

// const SectionOne = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const passedTRN = location.state?.technologyRefNo || "";
//   const [generatedRefNo, setGeneratedRefNo] = useState(passedTRN);
//   const [initialValues, setInitialValues] = useState({
//     technologyRefNo: "",
//     keywordTechnology: "",
//     nameTechnology: "",
//     industrialSector: [],
//     theme: [],
//     multiLabInstitute: "No",
//     leadLaboratory: "",
//     associateInstitute: [],
//     technologyLevel: "",
//     scaleDevelopment: "",
//     yearDevelopment: "",
//     briefTech: "",
//     competitivePosition: "",
//     technoEconomics: "",
//     stakeHolders: [],
//     potentialMinistries: [],
//     environmentalStatutory: "",
//     marketPotential: "",
//     file: null,
//     laboratoryDetail: "",
//     lab: []
//   });

//   useEffect(() => {
//     if (passedTRN) {
//       const saved = localStorage.getItem("sectionOneData");
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         if (parsed.technologyRefNo === passedTRN) {
//           setInitialValues(prev => ({ ...prev, ...parsed, file: null }));
//           setGeneratedRefNo(passedTRN);
//           return;
//         }
//       }

//       const token = localStorage.getItem("token");
//       axios
//         .get(`http://172.16.2.246:8282/apf/tdmp/sectionOne/${passedTRN}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           setInitialValues(prev => ({ ...prev, ...res.data, file: res.data.file || null }));
//           setGeneratedRefNo(passedTRN);
//         })
//         .catch((err) => console.error("Error fetching section data", err));
//     }
//   }, [passedTRN]);

//   const validationSchema = Yup.object({
//     nameTechnology: Yup.string()
//       .required("Name of Technology is required")
//       .max(500, "Maximum 500 characters allowed"),

//     keywordTechnology: Yup.string()
//       .required("Keywords are required")
//       .max(200, "Maximum 200 characters allowed"),

//     leadLaboratory: Yup.mixed().required("Lead Laboratory is required"),


//     theme: Yup.array()
//       .min(1, "Please select at least one Theme")
//       .required("Please select at least one Theme"),

//     multiLabInstitute: Yup.string()
//       .required("Please select Yes or No for Multi Laboratories"),

//     // ✅ Conditional validation for "lab"
//     lab: Yup.array().when("multiLabInstitute", {
//       is: "Yes",
//       then: (schema) =>
//         schema.min(1, "Please select at least one Lab if 'Yes' is selected"),
//       otherwise: (schema) => schema.notRequired(),
//     }),

//     technologyLevel: Yup.string()
//       .required("Please select Technology Readiness Level"),

//     yearDevelopment: Yup.string()
//       .required("Year of Development is required")
//       .matches(/^[0-9]{4}$/, "Enter a valid year (e.g., 2025)"),

//     briefTech: Yup.string()
//       .required("Brief details are required")
//       .max(1000, "Maximum 1000 characters allowed"),

//     laboratoryDetail: Yup.string()
//       .required("Laboratory Contact Details are required")
//       .max(300, "Maximum 300 characters allowed"),
//   });
//   const handleSubmit = (values, { setSubmitting }) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "Do you want to submit this form now?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Submit it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const url = "http://172.16.2.246:8282/apf/tdmp/saveSectionOne";
//         const formData = new FormData();

//         for (let key in values) {
//           if (Array.isArray(values[key])) {
//             values[key].forEach((item) => formData.append(key, item));
//           } else if (key === "file" && values.file) {
//             formData.append("file", values.file);
//           } else {
//             formData.append(key, values[key]);
//           }
//         }

//         const token = localStorage.getItem("token");

//         axios
//           .post(url, formData, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `Bearer ${token}`,
//             },
//           })
//           .then((res) => {
//             const responseData = res.data;
//             const techRef = responseData.technologyRefNo;
//             setGeneratedRefNo(techRef);
//             localStorage.setItem("sectionOneData", JSON.stringify(responseData));
//             Swal.fire("Success!", "Form submitted successfully!", "success");
//             navigate("/sectionTwo", { state: { technologyRefNo: techRef } });
//           })
//           .catch((err) => {
//             console.error("Submission error", err);
//             Swal.fire("Error!", "Failed to submit. Try again.", "error");
//           })
//           .finally(() => setSubmitting(false));
//       } else {
//         setSubmitting(false);
//       }
//     });
//   };

//   return (
//     <>
//       <NavBar />
//       <div className="flex">
//         <div className="bg-gray-800"></div>
//         <div className="flex-1 p-8 bg-blue-200 border">
//           <Section sectionLine="Section 1 : Key Details of the Technology / Knowhow " />
//           <Formik
//             enableReinitialize
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ values, setFieldValue, isSubmitting }) => (
//               <Form>
//                 <div className="form-group mb-4">
//                   <label className="font-bold flex justify-between" htmlFor="technologyRefNo">
//                     Technology /Knowhow Ref No:
//                     <span className="Hint block text-xs text-red-500 inline text-end">Mandatory Field</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="technologyRefNo"
//                     value={generatedRefNo ? generatedRefNo : "Will be generated after submission"}
//                     readOnly
//                     className="w-full p-2 text-lg outline-0.1 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <ErrorMessage
//                     name="nameTechnology"
//                     component="div"
//                     className="text-red-500"
//                   />
//                   <label className="font-bold" htmlFor="nameTechnology">
//                     Name of Technology / Knowhow: &nbsp;
//                     <span className="Hint block text-sm text-red-500 inline">
//                       Max. 500 Characters
//                     </span>
//                   </label>
//                   <Field
//                     type="text"
//                     name="nameTechnology"
//                     as="textarea"
//                     rows="3"
//                     className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <ErrorMessage
//                     name="keywordTechnology"
//                     component="div"
//                     className="text-red-500"
//                   />
//                   <label className="font-bold" htmlFor="keywordTechnology">
//                     Keywords for Technology / Knowhow &nbsp;
//                     <span className="Hint block text-sm text-red-500 inline">
//                       ( 5 to 8 Words)
//                     </span>
//                   </label>
//                   <Field
//                     type="text"
//                     name="keywordTechnology"
//                     defaultValue="CSIR/ANB/BIOT/01" // Default value here
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   />

//                 </div>
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="industrialSector">
//                     Industrial Sector
//                   </label>
//                   <Field
//                     name="industrialSector"
//                     options={industrialSector}
//                     component={CustomSelect}
//                     placeholder="Select Industrial Sector..."
//                     isMulti={true}
//                   />
//                   <ErrorMessage
//                     name="industrialSector"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>
//                 <div className="form-group mb-4">
//                   {/* Error message label ke upar */}
//                   <ErrorMessage
//                     name="leadLaboratory"
//                     component="div"
//                     className="text-red-500 mb-1 text-sm"
//                   />
//                   <label className="font-bold" htmlFor="leadLaboratory">
//                     Lead Laboratory / Institute <span className="text-red-500">*</span>
//                   </label>
//                   <Field
//                     name="leadLaboratory"
//                     options={lab}
//                     component={CustomSelect}
//                     placeholder="Select a Lab..."
//                   />
//                 </div>
//                 <div className="form-group mb-4">
//                   <ErrorMessage
//                     name="theme"
//                     component="div"
//                     className="text-red-500"
//                   />
//                   <label className="font-bold" htmlFor="theme">
//                     Theme
//                   </label>
//                   <Field
//                     name="theme"
//                     options={theme}
//                     component={CustomSelect}
//                     placeholder="Select a Theme..."
//                     isMulti={true}
//                   >
//                   </Field>

//                 </div>
//                 <div className="form-group flex items-center mb-4">
//                   <label className="font-bold" htmlFor="multiLabInstitute">
//                     Multi Laboratories / Institutes Involved
//                   </label>
//                   <div className="ml-4 flex space-x-4">
//                     <label htmlFor="multiLabYes" className="flex items-center">
//                       <input
//                         type="radio"
//                         id="multiLabYes"
//                         name="multiLabInstitute"
//                         value="Yes"
//                         className="mr-2"
//                         checked={values.multiLabInstitute === "Yes"} // ✅ bind checked
//                         onChange={() => setFieldValue("multiLabInstitute", "Yes")}
//                       />
//                       Yes
//                     </label>
//                     <label htmlFor="multiLabNo" className="flex items-center">
//                       <input
//                         type="radio"
//                         id="multiLabNo"
//                         name="multiLabInstitute"
//                         value="No"
//                         className="mr-2"
//                         checked={values.multiLabInstitute === "No"} // ✅ bind checked
//                         onChange={() => setFieldValue("multiLabInstitute", "No")}
//                       />
//                       No
//                     </label>
//                   </div>
//                   <ErrorMessage
//                     name="multiLabInstitute"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>
//                 {values.multiLabInstitute === "Yes" && (
//                   <div className="form-group mb-4">
//                     <ErrorMessage
//                       name="lab"
//                       component="div"
//                       className="text-red-500 mb-1 text-sm"
//                     />
//                     <label className="font-bold" htmlFor="lab">
//                       If Yes, Please Specify Labs/Institutes <span className="text-red-500">*</span>
//                     </label>
//                     <Field
//                       name="lab"
//                       options={lab}
//                       component={CustomSelect}
//                       placeholder="Select List Of Multilabs From here..."
//                       isMulti={true}
//                     />
//                   </div>
//                 )}
//                 <div className="form-group mb-4">
//                   <ErrorMessage
//                     name="technologyLevel"
//                     component="div"
//                     className="text-red-500"
//                   />
//                   <label className="font-bold" htmlFor="technologyLevel">
//                     Technology Readiness Level (TRL)
//                   </label>
//                   <Field
//                     as="select"
//                     name="technologyLevel"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   >
//                     <option value="" label="Select TRL" />
//                     {[...Array(9).keys()].map((i) => (
//                       <option key={i + 1} value={i + 1}>
//                         {i + 1}
//                       </option>
//                     ))}
//                   </Field>
//                 </div>
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="scaleDevelopment">
//                     Scale of Development: &nbsp;
//                     <span className="Hint block text-sm text-red-500 inline">
//                       Max. 250 Characters
//                     </span>
//                   </label>
//                   <Field
//                     type="text"
//                     name="scaleDevelopment"
//                     as="textarea"
//                     rows="3"
//                     maxLength="250"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   />
//                   <ErrorMessage
//                     name="scaleDevelopment"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>

//                 <div className="form-group mb-4">
//                   <ErrorMessage
//                     name="yearDevelopment"
//                     component="div"
//                     className="text-red-500"
//                   />
//                   <label className="font-bold" htmlFor="yearDevelopment">
//                     Year of Development
//                   </label>
//                   <Field
//                     type="text"
//                     name="yearDevelopment"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   />
//                 </div>
//                 <div className="form-group mb-4">
//                   <ErrorMessage
//                     name="briefTech"
//                     component="div"
//                     className="text-red-500"
//                   />
//                   <label className="font-bold" htmlFor="briefTech">
//                     Brief details of Technology / Knowhow: &nbsp;
//                     <span className="Hint block text-sm text-red-500 inline">
//                       Max. 1000 Characters
//                     </span>
//                   </label>
//                   <Field
//                     type="text"
//                     name="briefTech"
//                     as="textarea"
//                     rows="3"
//                     maxLength="1000"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   />

//                 </div>

//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="competitivePosition">
//                     Competitive Positioning in the domain (how is it better than
//                     competing technology)/Technology Benchmarking &nbsp;
//                     <span className="Hint block text-sm text-red-500 inline">
//                       Max. 1500 Characters
//                     </span>
//                   </label>
//                   <Field
//                     type="text"
//                     name="competitivePosition"
//                     as="textarea"
//                     rows="3"
//                     maxLength="1500"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   />
//                   <ErrorMessage
//                     name="competitivePosition"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="stakeHolders">
//                     Potential Applicant
//                   </label>
//                   <Field
//                     name="stakeHolders"
//                     options={stakeHolders}
//                     component={CustomSelect}
//                     placeholder="Select Ministry List from here..."
//                     isMulti={true}
//                   //className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   ></Field>
//                   <ErrorMessage
//                     name="stakeHolders"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="ministertialStakeHolders">
//                     Potential Ministries
//                   </label>
//                   <Field
//                     name="potentialMinistries"
//                     options={potentialMinistries}
//                     component={CustomSelect}
//                     placeholder="Select Ministry List from here..."
//                     isMulti={true}
//                   //className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   ></Field>
//                   <ErrorMessage
//                     name="potentialMinistries"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="technoEconomics">
//                     Techno-economics (including development & deployment
//                     cost,operational cost, payback period etc.) &nbsp;
//                     <span className="Hint block text-sm text-red-500 inline">
//                       Max. 1500 Characters
//                     </span>
//                   </label>
//                   <Field
//                     type="text"
//                     name="technoEconomics"
//                     as="textarea"
//                     rows="3"
//                     maxLength="1500"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   />
//                   <ErrorMessage
//                     name="technoEconomics"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>

//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="marketPotential">
//                     Market Potential &nbsp;
//                     <span className="Hint block text-sm text-red-500 inline">
//                       Max. 1000 Characters
//                     </span>
//                   </label>
//                   <Field
//                     type="text"
//                     name="marketPotential"
//                     as="textarea"
//                     rows="3"
//                     maxLength="1000"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   />
//                   <ErrorMessage
//                     name="marketPotential"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>

//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="environmentalStatutory">
//                     Environmental considerations / Statutory regulatory
//                     compliance details &nbsp;
//                     <span className="Hint block text-sm text-red-500 inline">
//                       Max. 1000 Characters
//                     </span>
//                   </label>
//                   <Field
//                     type="text"
//                     name="environmentalStatutory"
//                     as="textarea"
//                     rows="3"
//                     maxLength="300"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   />
//                   <ErrorMessage
//                     name="environmentalStatutory"
//                     component="div"
//                     className="text-red-500"
//                   />
//                 </div>
//                 <div className="form-group mb-4">
//                   <label className="font-bold" htmlFor="file">
//                     Upload High-Resolution file (Maximum 10 MB)
//                   </label>
//                   <input
//                     type="file"
//                     name="file"
//                     accept=".jpg,.jpeg,.png,.pdf"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                     onChange={(e) => {
//                       const file = e.currentTarget.files[0];
//                       const maxSize = 10 * 1024 * 1024; // 10 MB

//                       if (file) {
//                         const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
//                         if (!allowedTypes.includes(file.type)) {
//                           alert("Only JPG, PNG, and PDF files are allowed.");
//                           e.target.value = null; // Reset the input
//                           return;
//                         }

//                         if (file.size > maxSize) {
//                           alert("File size should be less than or equal to 10MB.");
//                           e.target.value = null; // Reset the input
//                           return;
//                         }

//                         // Set file if valid
//                         setFieldValue("file", file);
//                       }
//                     }}
//                   />

//                   {initialValues.file && (
//                     <img
//                       src={`data:image/jpeg;base64,${initialValues.file}`}
//                       alt="Preview"
//                       className="mt-2 max-h-40"
//                     />
//                   )}
//                 </div>

//                 <div className="form-group mb-4">
//                   <ErrorMessage
//                     name="laboratoryDetail"
//                     component="div"
//                     className="text-red-500 mb-1 text-sm"
//                   />
//                   <label className="font-bold" htmlFor="laboratoryDetail">
//                     Contact Details of Laboratory &nbsp;
//                     <span className="Hint block text-sm text-red-500 inline">
//                       Max. 300 Characters
//                     </span>
//                   </label>
//                   <Field
//                     type="text"
//                     name="laboratoryDetail"
//                     as="textarea"
//                     rows="3"
//                     maxLength="300"
//                     className="w-full p-2 text-lg outline-0.1 rounded-md"
//                   />
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
//                     onClick={() => navigate("/sectionTwo", { state: { technologyRefNo: generatedRefNo } })}

//                   >
//                     Next
//                   </button>
//                 </div>
//                 {/* <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     className="bg-blue-500 text-white px-4 py-2 rounded-md"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Submitting..." : "Submit & Next"}
//                   </button>
//                 </div> */}
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

// src/
// │
// ├── Components/
// │   ├── auth/                       ← Authentication system
// │   │   ├── Login.js
// │   │   ├── Signup.js
// │   │   ├── OtpLoginVerify.js
// │   │   ├── OtpVerify.js
// │   │   ├── ChangePassword.js
// │   │   ├── privateRoute.js         ← protects routes
// │   │   └── AuthContext.js          ← token + user state
// │   │
// │   ├── common/                     ← shared & reusable UI components
// │   │   ├── navBar.js
// │   │   ├── footer.js
// │   │   ├── header.js
// │   │   └── searchBar.js
// │   │
// │   ├── data/                       ← static dropdown & metadata options
// │   │   ├── country.js
// │   │   ├── industrialSector.js
// │   │   ├── labDetails.js
// │   │   ├── theme.js
// │   │   ├── potentialMinistries.js
// │   │   └── potentialApplicationAreas.js
// │   │
// │   ├── pages/
// │   │   ├── pendingPage/            ← Pending / Draft submitted forms
// │   │   │   └── pendingData.js
// │   │   │
// │   │   ├── techSearch/             ← Search & Preview before Final Submit
// │   │   │   ├── TechSearch.js
// │   │   │   ├── TechSearchForm.js
// │   │   │   ├── AllSectionPreview.js
// │   │   │   ├── PreviewPopUp.js
// │   │   │   ├── SectionOnePreview.js
// │   │   │   ├── SectionTwoPreview.js
// │   │   │   ├── SectionThreePreview.js
// │   │   │   └── SectionFourPreview.js
// │   │   │
// │   │   ├── view/                   ← Final view of data after submission
// │   │   │   ├── TechnologyDetails.js
// │   │   │   ├── viewTechnology.js
// │   │   │   ├── FileViewerModal.js
// │   │   │
// │   │   └── welcomePage.js          ← First landing UI after login
// │   │
// │   ├── section/                    ← Forms to fill Technology Data
// │   │   ├── SectionOne.js
// │   │   ├── SectionTwo.js
// │   │   ├── SectionThree.js
// │   │   └── SectionFour.js
// │
// ├── utils/                          ← helper functions / axios configs
// │
// ├── Routes.js                       ← Central routes manager
// ├── App.js                          ← Base wrapper component
// ├── index.js                        ← React root entry
// └── index.css                       ← Tailwind / custom css



// import React, { useState } from "react";
// import axios from "axios";
// import FooterBar from "Components/common/footer";
// // import Header from "Components/common/header";
// import NavBar from "Components/common/navBar";
// import Section from "Components/common/section";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import Swal from "sweetalert2";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { useNavigate, useLocation } from "react-router-dom";

// // Define initial empty state for one licensee
// const initialLicenseeValues = {
//   licenseName: "",
//   address: "",
//   email: "",
//   contact: "",
//   dateOfAgreementSigning: null,
//   typeOfLicense: "",
//   staRegionalGeography: "",
//   detailsOfExclusivity: "",
//   dateOfLicense: null,
//   licenseValidUntil: null,
//   paymentTerms: "",
// };

// const SectionThree = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [technologyRefNo] = useState(location.state?.technologyRefNo || "");

//   // State for the *list* of all licensees (jo abhi save nahi hue)
//   const [licensees, setLicensees] = useState([]);

//   // NEW STATE: Database se save hokar aaya data yahan store hoga
//   const [savedLicensees, setSavedLicensees] = useState([]);

//   // State for dynamic royalty and premia for the *current* form
//   const [royalty, setRoyalty] = useState([
//     { royaltyAmount: "", royaltyDate: null },
//   ]);
//   const [premia, setPremia] = useState([
//     { premiaAmount: "", premiaDate: null },
//   ]);

//   // State to track which licensee is being edited (index)
//   const [editingIndex, setEditingIndex] = useState(null);

//   const minDate = new Date("1900-08-12");
//   const maxDate = new Date("3000-08-12");

//   // Validation schema
//   const validationSchema = Yup.object({
//     licenseName: Yup.string()
//       .max(300, "Max. 300 characters")
//       .required("Required"),
//     address: Yup.string().max(500, "Max. 500 characters"),
//     email: Yup.string().email("Invalid email format"),
//     contact: Yup.string().matches(/^[0-9]{10}$/, "Must be 10 digits"),
//     dateOfAgreementSigning: Yup.date().nullable().required("Required"),
//     typeOfLicense: Yup.string().required("Required"),
//     staRegionalGeography: Yup.string().required("Required"),
//     detailsOfExclusivity: Yup.string().max(300, "Max. 300 characters"),
//     dateOfLicense: Yup.date().nullable().required("Required"),
//     licenseValidUntil: Yup.date().nullable().required("Required"),
//     paymentTerms: Yup.string().max(300, "Max. 300 characters"),
//   });

//   // Handle FINAL submit (Save button)
//   const handleSubmit = () => {
//     if (editingIndex !== null) {
//       Swal.fire({
//         title: "Update Pending",
//         text: "Please finish editing the current licensee by clicking 'Update Licensee' before saving.",
//         icon: "warning",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     if (licensees.length === 0) {
//       Swal.fire({
//         title: "No Licensees Added",
//         text: "Please add at least one licensee using the 'Add New Licensee' button before saving.",
//         icon: "warning",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     axios
//       .post(
//         `http://172.16.2.246:8282/api/section-three/save/${technologyRefNo}`,
//         licensees,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       )
//       .then((response) => { // 'response' ko yahan receive karein
//         Swal.fire({
//           title: "Success!",
//           text: "All licensees submitted successfully!",
//           icon: "success",
//           confirmButtonText: "OK",
//         });

//         // YEH HAI IMPORTANT CHANGE
//         setSavedLicensees(response.data); // Database se aaye data ko 'savedLicensees' state mein daalein
//         setLicensees([]); // Purane 'licensees' array (temporary) ko khaali karein
//         setEditingIndex(null);
//       })
//       .catch((error) => {
//         console.error(error);
//         Swal.fire({
//           title: "Error!",
//           text:
//             error?.response?.data?.message ||
//             "Form submission failed. Please try again.",
//           icon: "error",
//           confirmButtonText: "OK",
//         });
//       });
//   };

//   // --- Royalties handlers ---
//   const handleAddRoyalty = () => {
//     setRoyalty([...royalty, { royaltyAmount: "", royaltyDate: null }]);
//   };
//   const handleRemoveRoyalty = (index) => {
//     if (royalty.length > 1) {
//       const list = [...royalty];
//       list.splice(index, 1);
//       setRoyalty(list);
//     }
//   };
//   const handleRoyaltyChange = (index, field, value) => {
//     const list = [...royalty];
//     list[index][field] = value;
//     setRoyalty(list);
//   };

//   // --- Premias handlers ---
//   const handleAddPremia = () => {
//     setPremia([...premia, { premiaAmount: "", premiaDate: null }]);
//   };
//   const handleRemovePremia = (index) => {
//     if (premia.length > 1) {
//       const list = [...premia];
//       list.splice(index, 1);
//       setPremia(list);
//     }
//   };
//   const handlePremiaChange = (index, field, value) => {
//     const list = [...premia];
//     list[index][field] = value;
//     setPremia(list);
//   };

//   // Calculate totals for the *current* form
//   const subTotalRoyalty = royalty.reduce(
//     (acc, cur) => acc + parseFloat(cur.royaltyAmount || 0),
//     0
//   );
//   const subTotalPremia = premia.reduce(
//     (acc, cur) => acc + parseFloat(cur.premiaAmount || 0),
//     0
//   );
//   const grandTotal = subTotalRoyalty + subTotalPremia;

//   // Function to remove a licensee from the list
//   const handleRemoveLicensee = (indexToRemove) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setLicensees((prevLicensees) =>
//           prevLicensees.filter((_, i) => i !== indexToRemove)
//         );
//         // If the item being removed was the one being edited, clear editing state
//         if (editingIndex === indexToRemove) {
//           setEditingIndex(null);
//           // Note: Form reset is handled by 'handleAddOrUpdateLicensee' or 'Cancel Edit'
//         }
//         Swal.fire("Deleted!", "The licensee has been removed.", "success");
//       }
//     });
//   };

//   return (
//     <>
//       <NavBar />
//       <div className="flex flex-col md:flex-row">
//         <div className="bg-gray-800"></div>
//         <div className="flex-1 p-8 bg-blue-200 border">
//           <Section sectionLine="Section 3 : Details of Licensee (Commercialization)" />

//           {/* NEW: SAVED DATA DISPLAY BLOCK */}
//           {savedLicensees.length > 0 && (
//             <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded shadow">
//               <h3 className="text-xl font-bold mb-2 text-green-700">
//                 Successfully Saved Data
//                 <span className="text-sm font-normal ml-2">(Remark: Saved)</span>
//               </h3>
//               <ul className="list-disc list-inside">
//                 {savedLicensees.map((lic, index) => (
//                   <li
//                     key={lic.id} // Ab hum database ID use kar sakte hain
//                     className="text-gray-700 mb-1"
//                   >
//                     <span>
//                       {index + 1}. {lic.licenseName} (DB ID: {lic.id})
//                       <br />
//                       <span className="text-sm text-gray-600 ml-4">
//                         Total Fee: {lic.totalLicenseFee.toFixed(2)} INR
//                       </span>
//                     </span>
//                     {/* Yahan Edit/Remove buttons nahi hain kyunki yeh saved data hai */}
//                   </li>
//                 ))}
//               </ul>
//               <p className="mt-2 font-semibold text-green-700">
//                 This data is now saved. You can add more licensees below.
//               </p>
//             </div>
//           )}

//           <Formik
//             initialValues={initialLicenseeValues}
//             validationSchema={validationSchema}
//             enableReinitialize={false} // Keep this false
//             onSubmit={() => {
//               // This onSubmit is still needed by Formik,
//               // but our main save button will bypass it.
//               console.log(
//                 "Formik onSubmit triggered, but save is handled by onClick."
//               );
//             }}
//           >
//             {({
//               errors,
//               touched,
//               setFieldValue,
//               values,
//               validateForm,
//               resetForm,
//             }) => {
//               // Function to load licensee data into the form for editing
//               const handleEditLoad = (licenseeToEdit, index) => {
//                 setEditingIndex(index);

//                 // Populate Formik fields
//                 setFieldValue("licenseName", licenseeToEdit.licenseName);
//                 setFieldValue("address", licenseeToEdit.address);
//                 setFieldValue("email", licenseeToEdit.email);
//                 setFieldValue("contact", licenseeToEdit.contact);
//                 setFieldValue(
//                   "dateOfAgreementSigning",
//                   licenseeToEdit.dateOfAgreementSigning
//                     ? new Date(licenseeToEdit.dateOfAgreementSigning)
//                     : null
//                 );
//                 setFieldValue("typeOfLicense", licenseeToEdit.typeOfLicense);
//                 setFieldValue(
//                   "staRegionalGeography",
//                   licenseeToEdit.staRegionalGeography
//                 );
//                 setFieldValue(
//                   "detailsOfExclusivity",
//                   licenseeToEdit.detailsOfExclusivity
//                 );
//                 setFieldValue(
//                   "dateOfLicense",
//                   licenseeToEdit.dateOfLicense
//                     ? new Date(licenseeToEdit.dateOfLicense)
//                     : null
//                 );
//                 setFieldValue(
//                   "licenseValidUntil",
//                   licenseeToEdit.licenseValidUntil
//                     ? new Date(licenseeToEdit.licenseValidUntil)
//                     : null
//                 );
//                 setFieldValue("paymentTerms", licenseeToEdit.paymentTerms);

//                 // Populate royalty and premia arrays
//                 setRoyalty(
//                   licenseeToEdit.royalty.map((r) => ({
//                     royaltyAmount: String(r.amount),
//                     royaltyDate: r.date ? new Date(r.date) : null,
//                   }))
//                 );
//                 setPremia(
//                   licenseeToEdit.premia.map((p) => ({
//                     premiaAmount: String(p.amount),
//                     premiaDate: p.date ? new Date(p.date) : null,
//                   }))
//                 );

//                 Swal.fire({
//                   title: "Editing Licensee",
//                   text: `Now editing: ${licenseeToEdit.licenseName}. Update fields and click 'Update Licensee'.`,
//                   icon: "info",
//                   confirmButtonText: "OK",
//                 });
//               };

//               // Function to add a new licensee or update an existing one
//               const handleAddOrUpdateLicensee = async () => {
//                 const formErrors = await validateForm();
//                 if (Object.keys(formErrors).length > 0) {
//                   // This check prevents adding an empty form to the array
//                   Swal.fire({
//                     title: "Incomplete Form",
//                     text: "Please fill all required fields correctly before adding/updating.",
//                     icon: "error",
//                   });
//                   return;
//                 }

//                 // Create the licensee object from form values
//                 const licenseeData = {
//                   licenseName: values.licenseName,
//                   address: values.address,
//                   email: values.email,
//                   contact: values.contact,
//                   dateOfAgreementSigning: values.dateOfAgreementSigning
//                     ? values.dateOfAgreementSigning.toISOString().split("T")[0]
//                     : null,
//                   typeOfLicense: values.typeOfLicense,
//                   staRegionalGeography: values.staRegionalGeography,
//                   detailsOfExclusivity: values.detailsOfExclusivity,
//                   dateOfLicense: values.dateOfLicense
//                     ? values.dateOfLicense.toISOString().split("T")[0]
//                     : null,
//                   licenseValidUntil: values.licenseValidUntil
//                     ? values.licenseValidUntil.toISOString().split("T")[0]
//                     : null,
//                   paymentTerms: values.paymentTerms,
//                   royalty: royalty.map((r) => ({
//                     amount: parseFloat(r.royaltyAmount || "0"),
//                     date: r.royaltyDate
//                       ? r.royaltyDate.toISOString().split("T")[0]
//                       : null,
//                   })),
//                   premia: premia.map((p) => ({
//                     amount: parseFloat(p.premiaAmount || "0"),
//                     date: p.premiaDate
//                       ? p.premiaDate.toISOString().split("T")[0]
//                       : null,
//                   })),
//                   subTotalRoyalty: subTotalRoyalty,
//                   subTotalPremia: subTotalPremia,
//                   totalLicenseFee: grandTotal,
//                 };

//                 if (editingIndex !== null) {
//                   // Update existing licensee
//                   const updatedLicensees = [...licensees];
//                   updatedLicensees[editingIndex] = licenseeData;
//                   setLicensees(updatedLicensees);
//                   Swal.fire({
//                     title: "Licensee Updated!",
//                     text: "Licensee details have been updated.",
//                     icon: "success",
//                   });
//                 } else {
//                   // Add new licensee
//                   setLicensees((prevLicensees) => [
//                     ...prevLicensees,
//                     licenseeData,
//                   ]);
//                   Swal.fire({
//                     title: "Licensee Added!",
//                     text: "Licensee has been added to the list. You can add another one or click 'Save'.",
//                     icon: "success",
//                   });
//                 }

//                 // Reset form fields after adding/updating
//                 resetForm({ values: initialLicenseeValues });
//                 setRoyalty([{ royaltyAmount: "", royaltyDate: null }]);
//                 setPremia([{ premiaAmount: "", premiaDate: null }]);
//                 setEditingIndex(null); // Clear editing state
//               };

//               return (
//                 <>
//                   {/* Display Added Licensees (MOVED INSIDE FORMIK) */}
//                   {/* TITLE CHANGED */}
//                   {licensees.length > 0 && (
//                     <div className="mb-6 p-4 bg-white rounded shadow">
//                       <h3 className="text-xl font-bold mb-2">
//                         Licensees Pending Save ({licensees.length})
//                       </h3>
//                       <ul className="list-disc list-inside">
//                         {licensees.map((lic, index) => (
//                           <li
//                             key={index}
//                             className={`text-gray-700 mb-1 flex justify-between items-center ${
//                               editingIndex === index
//                                 ? "bg-yellow-100 p-2 rounded"
//                                 : ""
//                             }`}
//                           >
//                             <span>
//                               {index + 1}. {lic.licenseName} (Total Fee:{" "}
//                               {lic.totalLicenseFee
//                                 ? lic.totalLicenseFee.toFixed(2)
//                                 : "N/A"}{" "}
//                               INR)
//                               {editingIndex === index && (
//                                 <span className="ml-2 text-blue-500 font-semibold">
//                                   (Currently Editing)
//                                 </span>
//                               )}
//                             </span>
//                             <div>
//                               <button
//                                 type="button"
//                                 onClick={() => handleEditLoad(lic, index)} // CORRECTED: Calls function inside Formik
//                                 className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2"
//                                 disabled={editingIndex !== null} // Disable edit while another edit is active
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={() => handleRemoveLicensee(index)}
//                                 className="bg-red-500 text-white px-3 py-1 rounded text-sm"
//                               >
//                                 Remove
//                               </button>
//                             </div>
//                           </li>
//                         ))}
//                       </ul>
//                       <p className="mt-2 font-semibold">
//                         Total {licensees.length} licensee(s) added. Click 'Save'
//                         to submit all.
//                       </p>
//                     </div>
//                   )}

//                   <Form>
//                     {/* Technology Ref No */}
//                     <div className="form-group mb-2">
//                       <label className="font-bold flex justify-between">
//                         Technology / Knowhow Ref No:
//                         <span className="Hint block text-xs text-red-500 inline text-end">
//                           Mandatory Field
//                         </span>
//                       </label>
//                       <input
//                         type="text"
//                         className="w-half p-1 text-lg outline-0.1 rounded-md bg-gray-200"
//                         value={technologyRefNo}
//                         readOnly
//                       />
//                     </div>

//                     {/* License Name */}
//                     <div className="form-group mb-2 flex flex-col">
//                       <label className="font-bold">
//                         Licensee Name
//                         <span className="Hint block text-sm text-red-500">
//                           Max. 300 Characters
//                         </span>
//                       </label>
//                       <Field
//                         as="textarea"
//                         maxLength="300"
//                         name="licenseName"
//                         type="text"
//                         className="w-half p-1 text-lg outline-0.1 rounded-md"
//                       />
//                       <ErrorMessage
//                         name="licenseName"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>

//                     {/* Address */}
//                     <div className="form-group mb-2 flex flex-col">
//                       <label className="font-bold text-sm">Address</label>
//                       <Field
//                         as="textarea"
//                         maxLength="500"
//                         name="address"
//                         type="text"
//                         className="w-half text-lg outline-0.1 rounded-md"
//                       />
//                       <ErrorMessage
//                         name="address"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>

//                     {/* Email */}
//                     <div className="form-group mb-2 flex flex-col">
//                       <label className="font-bold">Email</label>
//                       <Field
//                         as="input"
//                         name="email"
//                         type="email"
//                         className="w-half p-1 text-lg outline-0.1 rounded-md"
//                       />
//                       <ErrorMessage
//                         name="email"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>

//                     {/* Contact No */}
//                     <div className="form-group mb-2 flex flex-col">
//                       <label className="font-bold">Contact No</label>
//                       <Field
//                         as="input"
//                         maxLength="10"
//                         name="contact"
//                         type="text"
//                         className="w-half p-1 text-lg outline-0.1 rounded-md"
//                       />
//                       <ErrorMessage
//                         name="contact"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>

//                     {/* Date of Agreement Signing */}
//                     <div className="form-group mb-2 flex flex-col">
//                       <label className="font-bold mb-1">
//                         Date of Agreement Signing
//                       </label>
//                       <DatePicker
//                         selected={values.dateOfAgreementSigning}
//                         onChange={(date) => {
//                           setFieldValue("dateOfAgreementSigning", date);
//                         }}
//                         dateFormat="dd/MM/yyyy"
//                         minDate={minDate}
//                         maxDate={maxDate}
//                         placeholderText="Select Date"
//                         className="w-half p-1 text-lg outline-0.1 rounded-md"
//                       />
//                       <ErrorMessage
//                         name="dateOfAgreementSigning"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>

//                     {/* Type of License */}
//                     <div className="form-group mb-2 flex flex-col">
//                       <label className="font-bold">Type of License</label>
//                       <Field
//                         as="select"
//                         name="typeOfLicense"
//                         className="w-half p-1 text-lg outline-0.1 rounded-md"
//                       >
//                         <option value="">--Please Select--</option>
//                         <option value="Exclusive">Exclusive</option>
//                         <option value="Non-Exclusive">Non-Exclusive</option>
//                       </Field>
//                       <ErrorMessage
//                         name="typeOfLicense"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>

//                     {/* Regional Geography */}
//                     <div className="form-group mb-2 flex flex-col">
//                       <label className="font-bold">Regional Geography</label>
//                       <Field
//                         as="select"
//                         name="staRegionalGeography"
//                         className="w-half p-1 text-lg outline-0.1 rounded-md"
//                       >
//                         <option value="">--Please Select--</option>
//                         <option value="North">North</option>
//                         <option value="North-East">North-East</option>
//                         <option value="East">East</option>
//                         <option value="West">West</option>
//                         <option value="South">South</option>
//                       </Field>
//                       <ErrorMessage
//                         name="staRegionalGeography"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>

//                     {/* Details of Exclusivity */}
//                     <div className="form-group mb-2">
//                       <label className="font-bold">
//                         Details of Exclusivity:&nbsp;
//                         <span className="Hint block text-sm text-red-500 inline">
//                           Max. 300 Characters
//                         </span>
//                       </label>
//                       <Field
//                         as="textarea"
//                         name="detailsOfExclusivity"
//                         maxLength="300"
//                         className="w-full p-1 text-lg outline-0.1 rounded-md"
//                       />
//                       <ErrorMessage
//                         name="detailsOfExclusivity"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>

//                     {/* Date of License */}
//                     <div className="form-group mb-2">
//                       <label className="font-bold">
//                         Date of License &nbsp;
//                       </label>
//                       <DatePicker
//                         selected={values.dateOfLicense}
//                         onChange={(date) => {
//                           setFieldValue("dateOfLicense", date);
//                         }}
//                         dateFormat="dd/MM/yyyy"
//                         minDate={minDate}
//                         maxDate={maxDate}
//                         placeholderText="Select Date"
//                         className="w-full p-1 text-lg outline-0.1 rounded-md"
//                       />
//                       <ErrorMessage
//                         name="dateOfLicense"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>

//                     {/* License Valid Until */}
//                     <div className="form-group mb-2">
//                       <label className="font-bold">
//                         License Valid Until &nbsp;
//                       </label>
//                       <DatePicker
//                         selected={values.licenseValidUntil}
//                         onChange={(date) => {
//                           setFieldValue("licenseValidUntil", date);
//                         }}
//                         dateFormat="dd/MM/yyyy"
//                         minDate={minDate}
//                         maxDate={maxDate}
//                         placeholderText="Select Date"
//                         className="w-full p-1 text-lg outline-0.1 rounded-md"
//                       />
//                       <ErrorMessage
//                         name="licenseValidUntil"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>

//                     {/* Payment Terms */}
//                     <div className="form-group mb-2">
//                       <label className="font-bold">
//                         Payment Terms &nbsp;
//                         <span className="Hint block text-sm text-red-500 inline">
//                           Max. 300 Characters
//                         </span>
//                       </label>
//                       <Field
//                         type="text"
//                         name="paymentTerms"
//                         maxLength="300"
//                         className="w-full p-1 text-lg outline-0.1 rounded-md"
//                       />
//                       <ErrorMessage
//                         name="paymentTerms"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>

//                     {/* --- Royalties Section --- */}
//                     <div className="mb-6">
//                       <h3 className="text-xl font-bold mb-2">Royalties</h3>
//                       {royalty.map((item, index) => (
//                         <div
//                           key={index}
//                           className="flex flex-wrap gap-4 mb-4 items-center"
//                         >
//                           <div>
//                             <label className="block font-semibold">
//                               Royalty Amount:
//                             </label>
//                             <input
//                               type="number"
//                               min="0"
//                               step="0.01"
//                               className="p-1 rounded border w-40"
//                               value={item.royaltyAmount}
//                               onChange={(e) =>
//                                 handleRoyaltyChange(
//                                   index,
//                                   "royaltyAmount",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Enter Amount"
//                             />
//                           </div>
//                           <div>
//                             <label className="block font-semibold">
//                               Royalty Date:
//                             </label>
//                             <DatePicker
//                               selected={item.royaltyDate}
//                               onChange={(date) =>
//                                 handleRoyaltyChange(index, "royaltyDate", date)
//                               }
//                               dateFormat="dd/MM/yyyy"
//                               minDate={minDate}
//                               maxDate={maxDate}
//                               placeholderText="Select Date"
//                               className="p-1 rounded border w-40"
//                             />
//                           </div>
//                           <div>
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveRoyalty(index)}
//                               className="bg-red-600 text-white px-3 py-1 rounded mt-6"
//                               disabled={royalty.length === 1}
//                               title={
//                                 royalty.length === 1
//                                   ? "At least one royalty entry required"
//                                   : "Remove royalty"
//                               }
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                       <button
//                         type="button"
//                         onClick={handleAddRoyalty}
//                         className="bg-green-600 text-white px-4 py-2 rounded"
//                       >
//                         Add Royalty
//                       </button>
//                     </div>

//                     {/* Subtotal Royalty */}
//                     <div className="mb-6 font-bold">
//                       Subtotal Royalty: {subTotalRoyalty.toFixed(2)}
//                     </div>

//                     {/* --- Premias Section --- */}
//                     <div className="mb-6">
//                       <h3 className="text-xl font-bold mb-3">Premias</h3>
//                       {premia.map((item, index) => (
//                         <div
//                           key={index}
//                           className="flex flex-wrap gap-4 mb-4 items-center"
//                         >
//                           <div>
//                             <label className="block font-semibold">
//                               Premia Amount:
//                             </label>
//                             <input
//                               type="number"
//                               min="0"
//                               step="0.01"
//                               className="p-1 rounded border w-40"
//                               value={item.premiaAmount}
//                               onChange={(e) =>
//                                 handlePremiaChange(
//                                   index,
//                                   "premiaAmount",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Enter Amount"
//                             />
//                           </div>
//                           <div>
//                             <label className="block font-semibold">
//                               Premia Date:
//                             </label>
//                             <DatePicker
//                               selected={item.premiaDate}
//                               onChange={(date) =>
//                                 handlePremiaChange(index, "premiaDate", date)
//                               }
//                               dateFormat="dd/MM/yyyy"
//                               minDate={minDate}
//                               maxDate={maxDate}
//                               placeholderText="Select Date"
//                               className="p-1 rounded border w-40"
//                             />
//                           </div>
//                           <div>
//                             <button
//                               type="button"
//                               onClick={() => handleRemovePremia(index)}
//                               className="bg-red-600 text-white px-3 py-1 rounded mt-6"
//                               disabled={premia.length === 1}
//                               title={
//                                 premia.length === 1
//                                   ? "At least one premia entry required"
//                                   : "Remove premia"
//                               }
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                       <button
//                         type="button"
//                         onClick={handleAddPremia}
//                         className="bg-green-600 text-white px-4 py-2 rounded"
//                       >
//                         Add Premia
//                       </button>
//                     </div>

//                     {/* Premia Subtotal */}
//                     <div className="form-group mb-4">
//                       <label className="font-bold" htmlFor="subTotalPremia">
//                         Subtotal Premia Received (in INR)
//                       </label>
//                       <Field
//                         type="number"
//                         name="subTotalPremia"
//                         className="w-half p-1 text-lg outline-0.1 rounded-md bg-gray-200"
//                         value={subTotalPremia}
//                         readOnly
//                       />
//                     </div>

//                     {/* Grand Total */}
//                     <div className="form-group mb-4">
//                       <label className="font-bold" htmlFor="GrandTotal">
//                         Total Licensee Fee (in INR)
//                       </label>
//                       <Field
//                         type="number"
//                         name="GrandTotal"
//                         className="w-half p-1 text-lg outline-0.1 rounded-md bg-gray-200"
//                         value={grandTotal}
//                         readOnly
//                       />
//                       <br />

//                       {/* Conditional Button for Add/Update Licensee */}
//                       <button
//                         type="button"
//                         onClick={handleAddOrUpdateLicensee}
//                         className={`px-6 py-3 rounded mt-3 ml-9 ${
//                           editingIndex !== null
//                             ? "bg-purple-600 hover:bg-purple-700"
//                             : "bg-blue-600 hover:bg-blue-700"
//                         } text-white`}
//                       >
//                         {editingIndex !== null
//                           ? "Update Licensee"
//                           : "Add New Licensee"}
//                       </button>
//                       {editingIndex !== null && (
//                         <button
//                           type="button"
//                           onClick={() => {
//                             resetForm({ values: initialLicenseeValues });
//                             setRoyalty([
//                               { royaltyAmount: "", royaltyDate: null },
//                             ]);
//                             setPremia([
//                               { premiaAmount: "", premiaDate: null },
//                             ]);
//                             setEditingIndex(null); // Exit editing mode
//                           }}
//                           className="bg-gray-500 text-white px-6 py-3 rounded mt-3 ml-4 hover:bg-gray-600"
//                         >
//                           Cancel Edit
//                         </button>
//                       )}
//                     </div>

//                     {/* --- Navigation Buttons --- */}
//                     <div className="flex justify-center items-center gap-4 mt-4">
//                       <button
//                         type="button"
//                         onClick={() =>
//                           navigate("/sectionTwo", {
//                             state: { technologyRefNo },
//                           })
//                         }
//                         className="bg-blue-600 text-white px-6 py-3 rounded"
//                       >
//                         Previous
//                       </button>

//                       <button
//                         type="button"
//                         onClick={handleSubmit}
//                         className="bg-green-600 text-white px-6 py-3 rounded"
//                         disabled={editingIndex !== null}
//                       >
//                         Save All Licensees
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           navigate("/sectionFour", {
//                             state: { technologyRefNo },
//                           })
//                         }
//                         className="bg-indigo-600 text-white px-6 py-3 rounded"
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </Form>
//                 </>
//               );
//             }}
//           </Formik>
//         </div>
//       </div>
//       <FooterBar />
//     </>
//   );
// };

// export default SectionThree;