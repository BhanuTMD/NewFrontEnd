// import React from "react";
// import "./WelcomePage.css";
// import NavBar from "Components/common/navBar";

// const WelcomePage = () => {
//   return (
//     <div className="h-screen w-screen overflow-hidden flex flex-col bg-white">
//       <NavBar />
//      <div className="w-full px-2 sm:px-6 pt-2">
//   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 w-full">

//     {/* 👉 Logo + Paragraph as a group */}
//     <div className="flex items-start gap-2 sm:gap-3">
//       {/* Logo */}
//       <div className="flex-shrink-0">
//         <img src="/logo.jpg" alt="CSIR-Logo" className="w-20 sm:w-24 h-auto" />
//       </div>

//       {/* Paragraph */}
//       <div className="text-[11px] sm:text-sm font-medium text-gray-700 leading-snug text-left">
//         <p>
//           वैज्ञानिक तथा औद्योगिक अनुसंधान परिषद् <br />
//           Council of Scientific & Industrial Research <br />
//           (विज्ञान एवं प्रौद्योगिकी मंत्रालय, भारत सरकार) <br />
//           Ministry of Science & Technology, Govt. of India
//         </p>
//       </div>
//     </div>

//     {/* Heading */}
//     <div className="text-sm sm:text-lg font-bold text-blue-700 text-left sm:text-right sm:max-w-xs">
//       Technology Database Management Portal (TDMP)
//     </div>
//   </div>
// </div>


//       {/* Description Section */}
//       <div className="flex-grow flex flex-col items-center justify-start mt-6 w-full px-4 sm:px-12 overflow-auto">
//         <div className="w-full text-left text-sm sm:text-base font-medium text-gray-700 leading-relaxed">
//           <p className="mb-3">
//             Technology Management Directorate (TMD) facilitates CSIR connect with Line Ministries,
//             State Governments and other organizations on one hand, and with industry on the other
//             for providing high-quality technology-based products/solutions/services as well as
//             competitive advantage to citizens of the country.
//           </p>
//           <p className="mb-3">The Directorate is responsible for:</p>
//           <ul className="list-disc list-inside space-y-2 text-gray-900">
//             <li>TDMP is a robust and dynamic data feeding portal designed specifically for Technologies/Know-how developed by CSIR labs.</li>
//             <li>It enables the CSIR-Technology Management Directorate (TMD) to easily manage and access up-to-date information across all CSIR labs.</li>
//             <li>TDMP fosters collaboration between labs and supports quick, informed decision-making.</li>
//             <li>It also plays a key role in promoting the commercialization and licensing of CSIR technologies, connecting innovations with industry needs.</li>
//           </ul>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="bg-indigo-500 text-white font-semibold py-2 text-center w-full">
//         <p className="inline-block marquee-animation whitespace-nowrap overflow-hidden">
//           Created & Maintained by Technology Management Directorate, CSIR, Headquarter, New Delhi
//         </p>
//       </div>
//     </div>
//   );
// };

// export default WelcomePage;



import React from "react";
import "./WelcomePage.css";
import NavBar from "Components/common/navBar";

const WelcomePage = () => {
  return (
    <div className="min-h-screen w-screen bg-white flex flex-col">
      <NavBar />

      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-start pt-12 sm:pt-20 px-4 sm:px-8 text-center bg-gradient-to-b from-blue-50 to-white">
        {/* Bigger Logo */}
        <img src="/logo.jpg" alt="CSIR Logo" className="w-28 sm:w-36 mb-4" />

        {/* Bigger Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-3">
          Technology Database Management Portal (TDMP)
        </h1>

        {/* Bigger Paragraph */}
        <p className="text-gray-700 text-base sm:text-lg max-w-3xl leading-relaxed">
          वैज्ञानिक तथा औद्योगिक अनुसंधान परिषद् <br />
          Council of Scientific & Industrial Research <br />
          Ministry of Science & Technology, Govt. of India
        </p>
      </div>

      {/* Description */}
      <div className="bg-blue-100/30 px-6 py-6 sm:py-10 sm:px-12 text-left">
        <p className="text-sm sm:text-base mb-3 text-gray-700 font-semibold">
          Technology Management Directorate (TMD) facilitates CSIR connect with ministries,
          industry, and citizens by offering innovative solutions and services.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-800 text-sm sm:text-base">
          <li>Robust portal for managing CSIR lab technologies</li>
          <li>Enables collaboration and fast access to data</li>
          <li>Helps with commercialization and licensing</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="bg-indigo-600 text-white text-center py-2 text-sm">
        Created & Maintained by CSIR - Technology Management Directorate, New Delhi
      </div>
    </div>
  );
};

export default WelcomePage;

