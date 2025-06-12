// import FooterBar from "Components/common/footer";
// import NavBar from "Components/common/navBar";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import CustomSelect from "Components/utils/CustomSelect";
// import * as Yup from "yup";
// import React, { useState } from 'react';


// const industrialSector = [
//     {
//         label: " Agriculture and Allied Industries (AG&A)",
//         value: "AG&A",
//     },
//     {
//         label: "Auto Components (AUTOC)",
//         value: "AUTOC",
//     },
//     {
//         label: "Automobiles (AUTO)",
//         value: "AUTO",
//     },
//     {
//         label: "Aviation (AVT)",
//         value: "AVT",
//     },
//     {
//         label: "Banking (BNK)",
//         value: "BNK",
//     },
//     {
//         label: "Biotechnology (BIOT)",
//         value: "BIOT",
//     },
//     {
//         label: "Cement (CEM)",
//         value: "CEM",
//     },
//     {
//         label: "Chemicals (CHE) ",
//         value: "CHE",
//     },
//     {
//         label: "Consumer Durables (CONSD)",
//         value: "CONSD",
//     },
//     {
//         label: "Defence Manufacturing (DEFM)",
//         value: "DEFM",
//     },
//     {
//         label: "Education and Training (EDU&T)",
//         value: "EDU&T",
//     },
//     {
//         label: "Electronics System Design & Manufacturing (ESDM)",
//         value: "ESDM",
//     },
//     {
//         label: "Engineering and Capital Goods (EN&CG)",
//         value: "EN&CG",
//     },
//     {
//         label: "Financial Services (FINS)",
//         value: "FINS",
//     },
//     {
//         label: "Fast Moving Consumer Goods (FMCG)",
//         value: "FMCG",
//     },
//     {
//         label: "Gems and Jewellery (GEMJ)",
//         value: "GEMJ",
//     },
//     {
//         label: "Healthcare (HTC)",
//         value: "HTC",
//     },
//     {
//         label: "Infrastructure (INF)",
//         value: "INF",
//     },
//     {
//         label: "Insurance (INS)",
//         value: "INS",
//     },
//     {
//         label: "IT & Business Process Management (IT&BPM)",
//         value: "IT&BPM",
//     },
//     {
//         label: "Leather & Non-Leather (LEA)",
//         value: "LEA",
//     },
//     {
//         label: "Manufacturing (MNF)",
//         value: "MNF",
//     },
//     {
//         label: "Media and Entertainment (M&E)",
//         value: "M&E",
//     },
//     {
//         label: "Medical Devices (MEDD)",
//         value: "MEDD",
//     },
//     {
//         label: "Metals and Mining (M&M)",
//         value: "M&M",
//     },
//     {
//         label: "Micro, Small and Medium Enterprises (MSME)",
//         value: "MSME",
//     },
//     {
//         label: "Oil and Gas (O&G)",
//         value: "O&G",
//     },
//     {
//         label: "Pharmaceuticals (pharma)",
//         value: "pharma",
//     },
//     {
//         label: "Ports and Shipping (P&S)",
//         value: "P&S",
//     },
//     {
//         label: "Power (PSL)",
//         value: "PSL",
//     },
//     {
//         label: "Railways (RLT)",
//         value: "RLT",
//     },
//     {
//         label: "Real Estate (RE)",
//         value: "RE",
//     },
//     {
//         label: "Renewable Energy (RE)",
//         value: "RE",
//     },
//     {
//         label: "Roads and Highways (R&H)",
//         value: "R&H",
//     },
//     {
//         label: "Science and Technology (SC)",
//         value: "SC",
//     },
//     {
//         label: "Services (SRV)",
//         value: "SRV",
//     },
//     {
//         label: "Space (SP)",
//         value: "SP",
//     },
//     {
//         label: "Telecom (T&P)",
//         value: "T&P",
//     },
//     {
//         label: "Textiles and Garments (TSM)",
//         value: "TSM",
//     },
//     {
//         label: "Tourism and Hospitality (TOU)",
//         value: "TOU",
//     },
//     {
//         label: "Others (OTR)",
//         value: "OTR",
//     },
// ];

// const theme = [
//     {
//         label:
//             "Aerospace, Electronics and Instrumentation & Strategic Sector (AEISS)",
//         value: "(AEISS)",
//     },
//     {
//         label: "Chemical (including leather) and   Postchemicals (CLP)",
//         value: "(CLP)",
//     },
//     {
//         label: "Ecology, Environment, Earth & Ocean & Science and Water (ESS)",
//         value: "(ESS)",
//     },
//     {
//         label: "Ecology, Environment, Earth & Ocean & Science and Water (EOW)",
//         value: "(EOW)",
//     },
//     {
//         label: "Civil, Infrastructure & Engineering (CIE)",
//         value: "(CIE)",
//     },
//     {
//         label: "Agri, Nutrition & Biotechnology & Strategic Sector (ANB)",
//         value: "(ANB)",
//     },
//     {
//         label: " Mining, Minirals, Metal and Materials (4M)",
//         value: "(4M)",
//     },
//     {
//         label:
//             "Healthcare-Chemical Drugs,Phytopharmaceuticals,Biopharmaceutical,and Regulatory (HTC)",
//         value: "(HTC)",
//     },
// ];

// const labNo = [
//     {
//         label:
//             "CSIR-Advanced Materials and Processes Research Institute (CSIR-AMPRI), Bhopal",
//         value: "CSIR-AMPRI",
//     },
//     {
//         label: "CSIR-Central Building Research Institute (CSIR-CBRI), Roorkee",
//         value: "CSIR-CBRI",
//     },
//     {
//         label: "CSIR-Center for Cellular Molecular Biology (CSIR-CCMB), Hyderabad",
//         value: "CSIR-CCMB",
//     },
//     {
//         label: "CSIR-Central Drug Research Institute (CSIR-CDRI), Lucknow",
//         value: "CSIR-CDRI",
//     },
//     {
//         label:
//             "CSIR-Central ElectroChemical Research Institute (CSIR-CECRI), Karaikudi",
//         value: "CSIR-CECRI",
//     },
//     {
//         label:
//             "CSIR-Central Electronics Engineering Research Institute (CSIR-CEERI), Pilani",
//         value: "CSIR-CEERI",
//     },
//     {
//         label:
//             "CSIR-Central Food Technological Research Institute (CSIR-CFTRI), Mysore",
//         value: "CSIR-CFTRI",
//     },
//     {
//         label:
//             "CSIR-Central Glass and Ceramic Research Institute (CSIR-CGCRI), Kolkata",
//         value: "CSIR-CGCRI",
//     },
//     {
//         label:
//             "CSIR-Central Institute of Medicinal and Aromatic Plants (CSIR-CIMAP), Lucknow",
//         value: "CSIR-CIMAP",
//     },
//     {
//         label:
//             "CSIR-Central Institute of Mining and Fuel Research (CSIR-CIMFR), Dhanbad",
//         value: "CSIR-CIMFR",
//     },
//     {
//         label: "CSIR-Central Leather Research Institute (CSIR-CLRI), Chennai",
//         value: "CSIR-CLRI",
//     },
//     {
//         label:
//             "CSIR-Central Mechanical Engineering Research Institute (CSIR-CMERI), Durgapur",
//         value: "CSIR-CMERI",
//     },
//     {
//         label: "CSIR-Central Road Research Institute (CSIR-CRRI), New Delhi",
//         value: "CSIR-CRRI",
//     },
//     {
//         label:
//             "CSIR-Central Scientific Instruments Organisation (CSIR-CSIO), Chandigarh",
//         value: "CSIR-CSIO",
//     },
//     {
//         label:
//             "CSIR-Central Salt and Marine Chemicals Research Institute (CSIR-CSMCRI), Bhavnagar",
//         value: "CSIR-CSMCRI",
//     },
//     {
//         label: "CSIR-Central Fourth Paradigm Institute (CSIR-4PI), Bengaluru",
//         value: "CSIR-4PI",
//     },
//     {
//         label:
//             "CSIR-Institute of Genomics and Integrative Biology (CSIR-IGIB), Delhi",
//         value: "CSIR-IGIB",
//     },
//     {
//         label:
//             "CSIR-Institute of Himalayan Bioresource Technology (CSIR-IHBT), Palampur",
//         value: "CSIR-IHBT",
//     },
//     {
//         label: "CSIR-Indian Institute of Chemical Biology (CSIR-IICB), Kolkata",
//         value: "CSIR-IICB",
//     },
//     {
//         label:
//             "CSIR-Indian Institute of Chemical Technology (CSIR-IICT), Hyderabad",
//         value: "CSIR-IICT",
//     },
//     {
//         label:
//             "CSIR-Indian Institute of Integrative Medicine (CSIR-IIIM), UT of J&K",
//         value: "CSIR-IIIM",
//     },
//     {
//         label: "CSIR-Indian Institute of Petroleum (CSIR-IIP), Dehradun",
//         value: "CSIR-IIP",
//     },
//     {
//         label: "CSIR-Indian Institute of Toxicology Research (CSIR-IITR), Lucknow",
//         value: "CSIR-IITR",
//     },
//     {
//         label:
//             "CSIR-Institute of Minerals and Materials Technology (CSIR-IIMT), Bhubaneswar",
//         value: "CSIR-IIMT",
//     },
//     {
//         label: "CSIR-Institute of Microbial Technology (CSIR-IMT)",
//         value: "CSIR-IMT",
//     },
//     {
//         label:
//             "CSIR-Institute of Minerals and Materials Technology (CSIR-IMTECH), Chandigarh",
//         value: "CSIR-IMTECH",
//     },
//     {
//         label: "CSIR-National Aerospace Laboratories (CSIR-NAL), Bengaluru",
//         value: "NCSIR-NAL",
//     },
//     {
//         label: "CSIR-National Botanical Research Institute (CSIR-NBRI), Lucknow",
//         value: "CSIR-NBRI",
//     },
//     {
//         label: "CSIR-National Chemical Laboratory (CSIR-NCL), Pune",
//         value: "CSIR-NCL",
//     },
//     {
//         label:
//             "CSIR-National Environmental Engineering Research Institute (CSIR-NEERI), Nagpur",
//         value: "NEE&NEERI",
//     },
//     {
//         label:
//             "CSIR-North-East Institute of Science and Technology (CSIR-NEIST), Jorhat",
//         value: "CSIR-NEIST",
//     },
//     {
//         label:
//             "CSIR-National Geophysical Research Institute (CSIR-NGRI), Hyderabad",
//         value: "CSIR-NGRI",
//     },
//     {
//         label:
//             "CSIR-National Institute for Interdisciplinary Science and Technology (CSIR-NIIST), Thiruvananthapuram",
//         value: "CSIR-NIIST",
//     },
//     {
//         label: "CSIR-National Institute of Oceanography (CSIR-NIO), Goa",
//         value: "CSIR-NIO",
//     },
//     {
//         label: "CSIR-National Metallurgical Laboratory (CSIR-NML), Jamshedpur",
//         value: "CSIR-NML",
//     },
//     {
//         label: "CSIR-National Physical Laboratory (CSIR-NPL), New Delhi",
//         value: "CSIR-NPL",
//     },
//     {
//         label:
//             "CSIR-National Institute of Science Communication & Policy Research (CSIR-NISCPR), Delhi",
//         value: "CSIR-NISCPR",
//     },
//     {
//         label: "CSIR-Madras Complex (CSIR-CMC), Chennai",
//         value: "SERC",
//     },
//     {
//         label: "CSIR-Structural Engineering Research Centre (CSIR-SERC), Chennai",
//         value: "CSIR-CMC",
//     },
//     {
//         label: "Other than CSIR",
//         value: "CSIR",
//     },
// ];


// const TechSearch = () => {
//     const initialValues = {
//         industrialSector: "",
//         labNo: "",
//         themeNo: "",
//         trnNo: "",
//         sectionSelect: ""
//     };



//     const validationSchema = Yup.object({
//         // Uncomment and add validation as needed
//         // industrialSector: Yup.string().required("Required"),
//         // labNo: Yup.string().required("Required"),
//         // themeNo: Yup.string().required("Required"),
//         // trnNo: Yup.string().required("Required"),
//         // sectionSelect: Yup.string().required("Required"),
//     });

//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedSection, setSelectedSection] = useState('');

//     const handleSectionChange = (event) => {
//         const { value } = event.target;
//         setSelectedSection(value);
//     };



//     const handleSubmit = (values) => {
//         console.log("Submitted Data:", values);
//         fetchData(values);
//     };

//     const fetchData = async (values) => {
//         setLoading(true);
//         try {
//             const response = await fetch('http://172.16.2.246:8080/apf/tdmp/search', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     theme: values.themeNo,
//                     industrialSector: values.industrialSector,
//                     lab: values.labNo,
//                     technologyRefNo: values.trnNo,
//                     page: 0,
//                     size: 10,
//                 }),
//             });
//             const result = await response.json();
//             setData(result); // Store the entire response
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handlePrintRow = (item) => {
//         const newWindow = window.open('', '', 'width=800,height=600');
//         const rowHTML = `
//           <html>
//             <head>
//               <title>Print Preview - ${item.nameTechnology || 'Technology'}</title>
//               <style>
//                 body { font-family: Arial, sans-serif; padding: 20px; }
//                 table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//                 th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
//                 th { background-color: #f9f9f9; }
//               </style>
//             </head>
//             <body>
//               <h2>Technology Detail - ${item.nameTechnology || '-'}</h2>
//               <table>
//                 <tbody>
//                   <tr><th>TRN No</th><td>${item.technologyRefNo || '-'}</td></tr>
//                   <tr><th>Technology Name</th><td>${item.nameTechnology || '-'}</td></tr>
//                   <tr><th>Keywords</th><td>${item.keywordTechnology || '-'}</td></tr>
//                   <tr><th>Industrial Sector</th><td>${item.industrialSector?.join(', ') || '-'}</td></tr>
//                   <tr><th>Multi Lab Institute</th><td>${item.multiLabInstitute || '-'}</td></tr>
//                   <tr><th>Lead Lab</th><td>${item.leadLaboratory || '-'}</td></tr>
//                   <tr><th>Associate Institutes</th><td>${item.associateInstitute?.join(', ') || '-'}</td></tr>
//                   <tr><th>Theme</th><td>${item.theme?.join(', ') || '-'}</td></tr>
//                   <tr><th>Technology Level</th><td>${item.technologyLevel || '-'}</td></tr>
//                   <tr><th>Scale of Development</th><td>${item.scaleDevelopment || '-'}</td></tr>
//                   <tr><th>Year of Development</th><td>${item.yearDevelopment || '-'}</td></tr>
//                   <tr><th>Brief</th><td>${item.briefTech || '-'}</td></tr>
//                   <tr><th>Competitive Position</th><td>${item.competitivePosition || '-'}</td></tr>
//                   <tr><th>Stakeholders</th><td>${item.stakeHolders?.join(', ') || '-'}</td></tr>
//                   <tr><th>Techno Economics</th><td>${item.technoEconomics || '-'}</td></tr>
//                   <tr><th>Market Potential</th><td>${item.marketPotential || '-'}</td></tr>
//                   <tr><th>Environmental Statutory</th><td>${item.environmentalStatutory || '-'}</td></tr>
//                   <tr><th>Laboratory Details</th><td>${item.laboratoryDetail || '-'}</td></tr>
//                 </tbody>
//               </table>
//               <script>
//                 window.onload = function() {
//                   window.print();
//                 }
//               </script>
//             </body>
//           </html>
//         `;
//         newWindow.document.write(rowHTML);
//         newWindow.document.close();
//     };




//     return (
//         <>
//             <NavBar />
//             <div className="flex">
//                 <div className="bg-gray-800"></div>
//                 <div className="flex-1 p-8 bg-blue-200 border">
//                     <Formik
//                         initialValues={initialValues}
//                         validationSchema={validationSchema}
//                         onSubmit={handleSubmit}
//                     >
//                         <Form>
//                             <div className="grid grid-cols-4 gap-4">
//                                 {/* Industrial Sector Dropdown */}
//                                 <div className="form-group mb-4">
//                                     <label className="font-bold" htmlFor="industrialSector">
//                                         INDUSTRIAL SECTOR
//                                     </label>
//                                     <Field
//                                         name="industrialSector"
//                                         options={industrialSector}
//                                         component={CustomSelect}
//                                         placeholder="Select Industrial Sector..."
//                                     />
//                                     <ErrorMessage
//                                         name="industrialSector"
//                                         component="div"
//                                         className="text-red-500"
//                                     />
//                                 </div>

//                                 {/* Lab No Dropdown */}
//                                 <div className="form-group mb-4">
//                                     <label className="font-bold" htmlFor="labNo">
//                                         LAB NO
//                                     </label>
//                                     <Field
//                                         name="labNo"
//                                         options={labNo}
//                                         component={CustomSelect}
//                                         placeholder="Select List Of Lab From here..."
//                                     />
//                                     <ErrorMessage
//                                         name="labNo"
//                                         component="div"
//                                         className="text-red-500"
//                                     />
//                                 </div>

//                                 {/* Theme No Dropdown */}
//                                 <div className="form-group mb-4">
//                                     <label className="font-bold" htmlFor="themeNo">
//                                         THEME NO
//                                     </label>
//                                     <Field
//                                         name="themeNo"
//                                         options={theme}
//                                         component={CustomSelect}
//                                         placeholder="Select a Theme..."
//                                     />
//                                     <ErrorMessage
//                                         name="themeNo"
//                                         component="div"
//                                         className="text-red-500"
//                                     />
//                                 </div>

//                                 {/* TRN No Input Field */}
//                                 <div className="form-group mb-4">
//                                     <label className="font-bold" htmlFor="trnNo">
//                                         TRN NO
//                                     </label>
//                                     <Field
//                                         type="text"
//                                         name="trnNo"
//                                         className="w-full p-2 text-md outline-0.1 rounded-md"
//                                         placeholder="Enter TRN No"
//                                     />
//                                     <ErrorMessage
//                                         name="trnNo"
//                                         component="div"
//                                         className="text-red-500"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="form-group mb-4 flex justify-center">
//                                 <button
//                                     type="submit"
//                                     className="bg-blue-500 text-white px-4 py-2 rounded-md"
//                                 >
//                                     Enter
//                                 </button>
//                             </div>

//                             <div className="form-group mb-4">
//                                 <label
//                                     className="font-bold flex justify-between"
//                                     htmlFor="sectionSelect"
//                                 >
//                                     SECTION
//                                     <span className="Hint block text-xs text-red-500 inline text-end "></span>
//                                 </label>
//                                 <Field
//                                     name="sectionSelect"
//                                     as="select"
//                                     className="w-1/4 p-2 text-lg outline-0.1 rounded-md"
//                                     onChange={(event) => {
//                                         handleSectionChange(event);
//                                         // Call Formik's handleChange if needed
//                                     }}
//                                     value={selectedSection}
//                                 >
//                                     <option value="">-- Select Section--</option>
//                                     <option value="SectionOne">SectionOne</option>
//                                     <option value="SectionTwo">SectionTwo</option>
//                                     <option value="SectionThree">SectionThree</option>
//                                     <option value="SectionFour">SectionFour</option>
//                                 </Field>
//                                 <ErrorMessage
//                                     name="sectionSelect"
//                                     component="div"
//                                     className="text-red-500"
//                                 />
//                             </div>
//                         </Form>
//                     </Formik>

//                     {/* Data Table */}
//                     {/* Display data based on selected section */}
//                     {(loading && <div className="text-center py-8">Loading...</div>) || (
//                         <>
//                             {/* Render Section One */}
//                             {(!selectedSection || selectedSection === 'SectionOne')  && data.sectionOneList && (
//                                 <div className="mt-8">
//                                     <h2 className="text-xl font-bold mb-4">Section One - Technology Details</h2>
//                                     <div className="overflow-x-auto">
//                                         <table className="min-w-full bg-white border">
//                                             <thead>
//                                                 <tr className="bg-gray-100">
//                                                     <th className="py-2 px-4 border">TRN No</th>
//                                                     <th className="py-2 px-4 border">Technology Name</th>
//                                                     <th className="py-2 px-4 border">Keywords</th>
//                                                     <th className="py-2 px-4 border">Industrial Sector</th>
//                                                     <th className="py-2 px-4 border">Multi Lab Institute</th>
//                                                     <th className="py-2 px-4 border">Lead Lab</th>
//                                                     <th className="py-2 px-4 border">Associate Institutes</th>
//                                                     <th className="py-2 px-4 border">Theme</th>
//                                                     <th className="py-2 px-4 border">Technology Level</th>
//                                                     <th className="py-2 px-4 border">Scale of Development</th>
//                                                     <th className="py-2 px-4 border">Year of Development</th>
//                                                     <th className="py-2 px-4 border">Brief</th>
//                                                     <th className="py-2 px-4 border">Competitive Position</th>
//                                                     <th className="py-2 px-4 border">Stakeholders</th>
//                                                     <th className="py-2 px-4 border">Techno Economics</th>
//                                                     <th className="py-2 px-4 border">Market Potential</th>
//                                                     <th className="py-2 px-4 border">Environmental Statutory</th>
//                                                     <th className="py-2 px-4 border">Laboratory Details</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {data.sectionOneList.map((item, index) => (
//                                                     <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
//                                                         <td className="py-2 px-4 border">{item.technologyRefNo || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.nameTechnology || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.keywordTechnology || '-'}</td>
//                                                         <td className="py-2 px-4 border">
//                                                             {item.industrialSector?.join(', ') || '-'}
//                                                         </td>
//                                                         <td className="py-2 px-4 border">{item.multiLabInstitute || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.leadLaboratory || '-'}</td>
//                                                         <td className="py-2 px-4 border">
//                                                             {item.associateInstitute?.join(', ') || '-'}
//                                                         </td>
//                                                         <td className="py-2 px-4 border">
//                                                             {item.theme?.join(', ') || '-'}
//                                                         </td>
//                                                         <td className="py-2 px-4 border">{item.technologyLevel || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.scaleDevelopment || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.yearDevelopment || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.briefTech || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.competitivePosition || '-'}</td>
//                                                         <td className="py-2 px-4 border">
//                                                             {item.stakeHolders?.join(', ') || '-'}
//                                                         </td>
//                                                         <td className="py-2 px-4 border">{item.technoEconomics || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.marketPotential || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.environmentalStatutory || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.laboratoryDetail || '-'}</td>
//                                                         <td className="py-2 px-4 border">
//                                                             <td className="py-2 px-4 border">
//                                                                 <button
//                                                                     onClick={() => handlePrintRow(item)}
//                                                                     className="text-blue-600 hover:underline"
//                                                                 >
//                                                                     Print
//                                                                 </button>
//                                                             </td>

//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>

//                                     </div>
//                                     {data.picture && (
//                                         <div className="mt-6">
//                                             <h3 className="text-lg font-semibold mb-2">Technology Image</h3>
//                                             <img
//                                                 src={data.picture}
//                                                 alt="Technology visual representation"
//                                                 className="max-w-full h-auto rounded border"
//                                                 onError={(e) => {
//                                                     e.target.onerror = null;
//                                                     e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Available';
//                                                 }}
//                                             />
//                                         </div>
//                                     )}
//                                 </div>
//                             )}

//                             {(!selectedSection || selectedSection === 'SectionTwo') && data.sectionTwoList && (
//                                 <div className="mt-8">
//                                     <h2 className="text-xl font-bold mb-4">Section Two - IPR Details</h2>
//                                     <div className="overflow-x-auto">
//                                         <table className="min-w-full bg-white border">
//                                             <thead>
//                                                 <tr className="bg-gray-100">
//                                                     <th className="py-2 px-4 border">TRN No</th>
//                                                     <th className="py-2 px-4 border">IPR Type</th>
//                                                     <th className="py-2 px-4 border">Registration No</th>
//                                                     <th className="py-2 px-4 border">Status</th>
//                                                     <th className="py-2 px-4 border">Status Date</th>
//                                                     <th className="py-2 px-4 border">Countries</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {data.sectionTwoList.map((item, index) => (
//                                                     <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
//                                                         <td className="py-2 px-4 border">{item.technologyRefNo || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.iprType || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.registrationNo || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.status || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.statusDate || '-'}</td>
//                                                         <td className="py-2 px-4 border">
//                                                             {item.countries?.join(', ') || '-'}
//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 </div>
//                             )}

//                             {(!selectedSection || selectedSection === 'SectionThree') && data.sectionThreeList && (
//                                 <div className="mt-8">
//                                     <h2 className="text-xl font-bold mb-4">Section Three - Licensing Details</h2>
//                                     <div className="overflow-x-auto">
//                                         <table className="min-w-full bg-white border">
//                                             <thead>
//                                                 <tr className="bg-gray-100">
//                                                     <th className="py-2 px-4 border">Technology Ref No</th>
//                                                     <th className="py-2 px-4 border">License Name</th>
//                                                     <th className="py-2 px-4 border">Date of Agreement Signing</th>
//                                                     <th className="py-2 px-4 border">License Type</th>
//                                                     <th className="py-2 px-4 border">Regional Geography</th>
//                                                     <th className="py-2 px-4 border">Exclusivity Details</th>
//                                                     <th className="py-2 px-4 border">Date of License</th>
//                                                     <th className="py-2 px-4 border">License Validity</th>
//                                                     <th className="py-2 px-4 border">Payment Terms</th>
//                                                     <th className="py-2 px-4 border">Royalty</th>
//                                                     <th className="py-2 px-4 border">Premia</th>
//                                                     <th className="py-2 px-4 border">Sub Total Royalty</th>
//                                                     <th className="py-2 px-4 border">Sub Total Premia</th>
//                                                     <th className="py-2 px-4 border">Grand Total</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {data.sectionThreeList.map((item, index) => (
//                                                     <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
//                                                         <td className="py-2 px-4 border">{item.technologyRefNo || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.licenseName || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.dateOfAgreementSigning || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.typeOfLicense || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.staRegionalGeography || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.detailsOfExclusivity || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.dateOfLicense || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.licenseValidUntil || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.paymentTerms || '-'}</td>
//                                                         <td className="py-2 px-4 border">
//                                                             {(item.royalty || []).map((i, index) => (
//                                                                 <div key={index}>
//                                                                     <span>{`Amount: ₹${i.amount} on ${i.date}`}</span>
//                                                                 </div>
//                                                             ))}
//                                                         </td>
//                                                         <td className="py-2 px-4 border">
//                                                             {(item.premia || []).map((i, index) => (
//                                                                 <div key={index}>
//                                                                     <span>{`Amount: ₹${i.amount} on ${i.date}`}</span>
//                                                                 </div>
//                                                             ))}
//                                                         </td>
//                                                         <td className="py-2 px-4 border">{`₹${item.subTotalRoyalty || 0}`}</td>
//                                                         <td className="py-2 px-4 border">{`₹${item.subTotalPremia || 0}`}</td>
//                                                         <td className="py-2 px-4 border">{`₹${item.grandTotal}`}</td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>

//                                         </table>
//                                     </div>
//                                 </div>
//                             )}



//                             {(!selectedSection || selectedSection === 'SectionFour') && data.sectionFourList && (
//                                 <div className="mt-8">
//                                     <h2 className="text-xl font-bold mb-4">Section Four - Deployment Details</h2>
//                                     <div className="overflow-x-auto">
//                                         <table className="min-w-full bg-white border">
//                                             <thead>
//                                                 <tr className="bg-gray-100">
//                                                     <th className="py-2 px-4 border">TRN No</th>
//                                                     <th className="py-2 px-4 border">Client Name</th>
//                                                     <th className="py-2 px-4 border">Address</th>
//                                                     <th className="py-2 px-4 border">City</th>
//                                                     <th className="py-2 px-4 border">Country</th>
//                                                     <th className="py-2 px-4 border">Contact Person</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {data.sectionFourList.map((item, index) => (
//                                                     <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
//                                                         <td className="py-2 px-4 border">{item.technologyRefNo || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.clientName || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.clientAddress || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.city || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.country || '-'}</td>
//                                                         <td className="py-2 px-4 border">{item.nodalContactPerson || '-'}</td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>
//             <FooterBar />
//         </>
//     );
// };

// export default TechSearch;