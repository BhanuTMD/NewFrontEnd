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
// import Country from "Components/data/country";
// import CustomSelect from "Components/utils/CustomSelect";

// const EditSectionTwo = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [initialValues, setInitialValues] = useState({
//     technologyRefNo: "",
//     iprType: "",
//     registrationNo: "",
//     status: "",
//     statusDate: null,
//     country: [],
//   });

//   const technologyRefNo = location.state?.technologyRefNo || "";

//   useEffect(() => {
//     if (technologyRefNo) {
//       axios
//         .get(`http://172.16.2.246:8080/apf/tdmp/EditSectionTwo/${technologyRefNo}`)
//         .then((response) => {
//           const data = response.data;
//           setInitialValues({
//             technologyRefNo: data.technologyRefNo || technologyRefNo,
//             iprType: data.iprType || "",
//             registrationNo: data.registrationNo || "",
//             status: data.status || "",
//             statusDate: data.statusDate ? new Date(data.statusDate) : null,
//             country: data.country || [],
//           });
//           setSelectedDate(data.statusDate ? new Date(data.statusDate) : null);
//         })
//         .catch((error) => {
//           console.error("Error fetching EditSectionTwo data:", error);
//         });
//     }
//   }, [technologyRefNo]);

//   const validationSchema = Yup.object({
//     iprType: Yup.string().required("Required"),
//     registrationNo: Yup.string().max(50).required("Required"),
//     status: Yup.string().required("Required"),
//     statusDate: Yup.date().nullable().required("Status Date is required"),
//     country: Yup.array().min(1, "At least one country is required").required(),
//   });

//   const handleSubmit = (values) => {
//     const payload = {
//       ...values,
//       statusDate: values.statusDate
//         ? new Date(values.statusDate).toLocaleDateString("en-GB")
//         : null,
//     };

//     axios
//       .post("http://172.16.2.246:8080/apf/tdmp/EditSectionTwo", payload, {
//         headers: { "Content-Type": "application/json" },
//       })
//       .then(() => Swal.fire("Success!", "Form submitted successfully!", "success"))
//       .catch(() => Swal.fire("Error!", "Form submission failed.", "error"));
//   };

//   return (
//     <>
//       {/* <Header /> */}
//       <NavBar />
//       <div className="flex bg-blue-200 min-h-screen">
//         <div className="flex-1 p-8">
//           <Section sectionLine="Section 2 : IPR Status - Add/Modify" />
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//             enableReinitialize
//           >
//             {({ setFieldValue, values }) => (
//               <Form className="space-y-6">
//                 {/* TRN (Read-only) */}
//                 <div>
//                   <label className="font-bold">Technology Ref No:</label>
//                   <Field
//                     name="technologyRefNo"
//                     type="text"
//                     readOnly
//                     className="w-full p-2 rounded-md bg-gray-100 text-gray-600"
//                     value={values.technologyRefNo || technologyRefNo}
//                   />
//                 </div>

//                 {/* IPR Type */}
//                 <div>
//                   <label className="font-bold">IPR Type</label>
//                   <Field as="select" name="iprType" className="w-full p-2 rounded-md">
//                     <option value="">--Select--</option>
//                     {["Patent", "Industrial Design", "Trademark", "Copyright", "Other"].map((opt) => (
//                       <option key={opt} value={opt.toLowerCase()}>{opt}</option>
//                     ))}
//                   </Field>
//                   <ErrorMessage name="iprType" component="div" className="text-red-500" />
//                 </div>

//                 {/* Registration No */}
//                 <div>
//                   <label className="font-bold">Registration No.</label>
//                   <Field
//                     name="registrationNo"
//                     type="text"
//                     className="w-full p-2 rounded-md"
//                   />
//                   <ErrorMessage name="registrationNo" component="div" className="text-red-500" />
//                 </div>

//                 {/* Status */}
//                 <div>
//                   <label className="font-bold">Status</label>
//                   <Field as="select" name="status" className="w-full p-2 rounded-md">
//                     <option value="">--Select--</option>
//                     {["Filed", "Pending for Grant", "Granted", "Lapsed", "Abandoned"].map((opt) => (
//                       <option key={opt} value={opt.toLowerCase()}>{opt}</option>
//                     ))}
//                   </Field>
//                   <ErrorMessage name="status" component="div" className="text-red-500" />
//                 </div>

//                 {/* Status Date */}
//                 <div>
//                   <label className="font-bold">Status Date</label>
//                   <DatePicker
//                     selected={selectedDate}
//                     onChange={(date) => {
//                       setSelectedDate(date);
//                       setFieldValue("statusDate", date);
//                     }}
//                     dateFormat="dd/MM/yyyy"
//                     className="w-full p-2 rounded-md"
//                     placeholderText="Select date"
//                   />
//                   <ErrorMessage name="statusDate" component="div" className="text-red-500" />
//                 </div>

//                 {/* Country */}
//                 <div>
//                   <label className="font-bold">Country</label>
//                   <Field
//                     name="country"
//                     component={CustomSelect}
//                     options={Country}
//                     isMulti={true}
//                     placeholder="Select countries"
//                   />
//                   <ErrorMessage name="country" component="div" className="text-red-500" />
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex justify-center gap-4">
//                   <button
//                     type="button"
//                     onClick={() => navigate("/sectionOne", { state: { technologyRefNo } })}
//                     className="bg-blue-600 text-white px-6 py-3 rounded"
//                   >
//                     Previous
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-green-600 text-white rounded-md"
//                   >
//                     Save
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => navigate("/sectionThree", { state: { technologyRefNo } })}
//                     className="px-4 py-2 bg-blue-500 text-white rounded-md"
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

// export default EditSectionTwo;
