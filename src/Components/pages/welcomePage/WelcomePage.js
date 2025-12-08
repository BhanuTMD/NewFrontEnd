import React from "react";
import NavBar from "Components/common/navBar";
import "./WelcomePage.css"; // agar isme extra styles hai to rehne do, warna hata bhi sakta hai

const WelcomePage = () => {
  return (
    <div className="flex min-h-screen w-screen flex-col bg-gradient-to-b from-sky-50 via-white to-indigo-50">
      {/* Top Nav */}
      <NavBar />

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        {/* Hero Card */}
        <section className="flex w-full max-w-5xl flex-col items-center rounded-3xl bg-white/80 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur-sm sm:p-10">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 shadow-inner sm:h-24 sm:w-24">
              <img
                src="/logo.jpg"
                alt="CSIR Logo"
                className="h-18 w-18 rounded-full object-contain sm:h-22 sm:w-22"
              />
            </div>
          </div>
          {/* Hindi / English Text */}
          <div className="mb-6 text-center text-2xl  tracking-tight text-slate-800 sm:text-xl">
            <p className="font-semibold ">
              वैज्ञानिक तथा औद्योगिक अनुसंधान परिषद्
            </p>
            <p className="text-blue-600 font-semibold">Council of Scientific &amp; Industrial Research</p>
            <p className="text-blue-600 font-semibold">Ministry of Science &amp; Technology, Govt. of India</p>
          </div>
          {/* Heading */}
          <h1 className="mb-3 text-center text-2xl font-extrabold tracking-tight text-slate-700 sm:text-2xl lg:text-1xl">
            Technology Database Management Portal
          </h1>
          <p className="mb-6 text-center text-xs font-semibold   uppercase tracking-[0.22em] text-blue-600 sm:text-sm">
         Developed by Technology Management Directorate (TMD), CSIR-HQ
          </p>
  
          {/* Small divider */}
          <div className="mb-4 h-px w-20 rounded-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />

          {/* Short tagline */}
          <p className="max-w-2xl text-center text-xs text-slate-600 sm:text-s">
            “A digital gateway that transforms CSIR’s innovations into accessible knowledge, enabling industry, government, and citizens to explore, 
            evaluate, and engage with our diverse technology portfolio.”
          </p>
        </section>

        {/* Info / Description */}
        <section className="mt-8 w-full max-w-5xl rounded-3xl bg-gradient-to-r from-indigo-50 via-sky-50 to-blue-50 p-5 sm:p-7 lg:p-8 shadow-sm ring-1 ring-indigo-100/70">
          <h2 className="mb-3 text-base font-bold text-slate-800 sm:text-lg">
            About the Technology Management Directorate (TMD)
          </h2>

          <p className="mb-3 text-sm font-medium text-slate-700 sm:text-base">
            Technology Management Directorate (TMD) facilitates CSIR&apos;s
            engagement with ministries, industry, and citizens by offering
            innovative solutions and services.
          </p>

          <ul className="mt-2 space-y-2 text-sm text-slate-800 sm:text-base">
            <li className="flex items-start gap-2">
              <span className="mt-[6px] h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
              <span>Robust portal for managing CSIR lab technologies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[6px] h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
              <span>Enables collaboration and fast access to validated data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[6px] h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
              <span>Supports commercialization, licensing, and policy decisions</span>
            </li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-indigo-700/95 py-2 text-center text-xs text-indigo-50 sm:text-sm">
        Created &amp; Maintained by CSIR - Technology Management Directorate,
        New Delhi
      </footer>
    </div>
  );
};

export default WelcomePage;



//  another version`
// import React from "react";
// import NavBar from "Components/common/navBar";
// import "./WelcomePage.css"; // agar isme extra styles hai to rehne do, warna hata bhi sakta hai

// const WelcomePage = () => {
//   return (
//     <div className="flex min-h-screen w-screen flex-col bg-gradient-to-b from-sky-50 via-white to-indigo-50">
//       {/* Top Nav */}
//       <NavBar />

//       {/* Main Content */}
//       <main className="flex flex-1 flex-col items-center px-4 pb-10 pt-10 sm:px-6 lg:px-8">
//         {/* Hero Card */}
//         <section className="flex w-full max-w-5xl flex-col items-center rounded-3xl bg-white/80 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur-sm sm:p-10">
//           {/* Logo */}
//           <div className="mb-4 flex items-center justify-center">
//             <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 shadow-inner sm:h-24 sm:w-24">
//               <img
//                 src="/logo.jpg"
//                 alt="CSIR Logo"
//                 className="h-16 w-16 rounded-full object-contain sm:h-20 sm:w-20"
//               />
//             </div>
//           </div>

//           {/* Heading */}
//           <h1 className="mb-3 text-center text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl lg:text-4xl">
//             Technology Database Management Portal
//           </h1>
//           <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 sm:text-sm">
//             TDMP · Council of Scientific & Industrial Research
//           </p>

//           {/* Hindi / English Text */}
//           <div className="mb-6 text-center text-sm leading-relaxed text-slate-700 sm:text-base">
//             <p className="font-semibold">
//               वैज्ञानिक तथा औद्योगिक अनुसंधान परिषद्
//             </p>
//             <p>Council of Scientific &amp; Industrial Research</p>
//             <p>Ministry of Science &amp; Technology, Govt. of India</p>
//           </div>

//           {/* Small divider */}
//           <div className="mb-4 h-px w-20 rounded-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />

//           {/* Short tagline */}
//           <p className="max-w-2xl text-center text-xs text-slate-600 sm:text-sm">
//             A unified digital platform to capture, manage, and showcase CSIR lab
//             technologies for policy makers, industry partners, and citizens.
//           </p>
//         </section>

//         {/* Info / Description */}
//         <section className="mt-8 w-full max-w-5xl rounded-3xl bg-gradient-to-r from-indigo-50 via-sky-50 to-blue-50 p-5 sm:p-7 lg:p-8 shadow-sm ring-1 ring-indigo-100/70">
//           <h2 className="mb-3 text-base font-bold text-slate-800 sm:text-lg">
//             About the Technology Management Directorate (TMD)
//           </h2>

//           <p className="mb-3 text-sm font-medium text-slate-700 sm:text-base">
//             Technology Management Directorate (TMD) facilitates CSIR&apos;s
//             engagement with ministries, industry, and citizens by offering
//             innovative solutions and services.
//           </p>

//           <ul className="mt-2 space-y-2 text-sm text-slate-800 sm:text-base">
//             <li className="flex items-start gap-2">
//               <span className="mt-[6px] h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
//               <span>Robust portal for managing CSIR lab technologies</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="mt-[6px] h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
//               <span>Enables collaboration and fast access to validated data</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="mt-[6px] h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
//               <span>Supports commercialization, licensing, and policy decisions</span>
//             </li>
//           </ul>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="w-full bg-indigo-700/95 py-2 text-center text-xs text-indigo-50 sm:text-sm">
//         Created &amp; Maintained by CSIR - Technology Management Directorate,
//         New Delhi
//       </footer>
//     </div>
//   );
// };

// export default WelcomePage;
