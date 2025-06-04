import React from "react";
import "./WelcomePage.css";
import NavBar from "Components/common/navBar";

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col pt-0 sm:pt-0 px-4 sm:px-8">
      
      {/* Logo + Header */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 mb-2 sm:mb-1 px-2 sm:px-12">

        <img
          src="/logo.jpg"
          alt="CSIR-Logo"
          className="w-24 sm:w-32 h-auto"
        />
        <div className="text-left text-xs sm:text-sm font-medium text-gray-700 leading-snug">
          <p>
            वैज्ञानिक तथा औद्योगिक अनुसंधान परिषद् <br />
            Council of Scientific & Industrial Research <br />
            (विज्ञान एवं प्रौद्योगिकी मंत्रालय, भारत सरकार) <br />
            Ministry of Science & Technology, Govt. of India
          </p>
        </div>
      </div>

      {/* Heading */}
 <div className="text-center mt-0 sm:mt-0 mb-6 px-4">
  <h1 className="text-base sm:text-4xl font-bold text-blue-700">
    Technology Database Management Portal (TDMP)
  </h1>
</div>

      {/* Navbar */}
      <div className="px-2 sm:px-12 mb-6">
        <NavBar />
      </div>

      {/* Description */}
      <div className="w-full max-w-7xl px-2 sm:px-12 text-left">
        <p className="text-base sm:text-lg font-bold text-gray-700 mb-4 leading-relaxed ">
          Technology Management Directorate (TMD) facilitates CSIR connect with
          Line Ministries, State Governments and other organizations on one hand,
          and with industry on the other for providing high-quality
          technology-based products/solutions/services as well as competitive
          advantage to citizens of the country.
        </p>

        <p className="text-base sm:text-lg font-bold text-gray-700 mb-2 leading-relaxed ">
          The Directorate is responsible for:
        </p>

        <ul className="list-disc list-inside space-y-1 text-base sm:text-lg text-gray-900 ">
          <li>
            TDMP is a robust and dynamic data feeding portal designed specifically for Technologies/Know-how developed by CSIR labs.
          </li>
          <li>
            It enables the CSIR-Technology Management Directorate (TMD) to easily manage and access up-to-date information across all CSIR labs.
          </li>
          <li>
            The portal centralizes technology data, ensuring consistency and transparency in how information is stored and shared.
          </li>
          <li>
            It streamlines the process of capturing, updating, and showcasing technological developments in real-time.
          </li>
          <li>
            TDMP fosters collaboration between labs and supports quick, informed decision-making.
          </li>
          <li>
            It also plays a key role in promoting the commercialization and licensing of CSIR technologies, connecting innovations with industry needs.
          </li>
          <li>
            With TDMP, CSIR ensures that every innovation is documented, accessible, and ready for deployment or commercialization.
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-8 px-4 sm:px-10 w-full">
        <div className="bg-indigo-500 text-white font-semibold py-2 px-4 overflow-hidden whitespace-nowrap text-center rounded-md">
          <p className="inline-block marquee-animation">
            Created & Maintained by Technology Management Directorate, CSIR, Headquarter, New Delhi
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
