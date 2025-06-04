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