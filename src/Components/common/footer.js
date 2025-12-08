import React from "react";

const FooterBar = () => {
  return (
    <footer className="w-full mt-10">
      {/* Gradient + Glass Effect */}
      <div className="bg-gradient-to-r from-indigo-600 via-sky-600 to-blue-600 text-white backdrop-blur-sm shadow-inner">
        <div className="mx-auto max-w-screen-xl px-4 py-4 sm:py-5 text-center">
          <span className="text-xs sm:text-sm tracking-wide drop-shadow-md">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://www.csir.res.in/technology-management-directorate/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline-offset-4 hover:underline"
            >
              Technology Management Directorate (TMD), CSIR-HQ
            </a>
            . All Rights Reserved.
          </span>

          {/* Decorative line */}
          <div className="mx-auto mt-3 h-[2px] w-24 rounded-full bg-white/40"></div>

          {/* Sub Text */}
          <p className="mt-2 text-[11px] sm:text-xs text-white/90 tracking-wider">
            Powered by CSIR | Ministry of Science & Technology, Government of India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterBar;
