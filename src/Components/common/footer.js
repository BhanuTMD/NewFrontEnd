import React from "react";

const FooterBar = () => {
  return (
    <>
      <div className="">
        <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
          <div className="w-full mx-auto max-w-screen-xl p-4 flex flex-col items-center">
            <span className="text-center text-sm text-gray-500 dark:text-gray-400">
              © 2024{" "}
              <a
                href="https://www.csir.res.in/technology-management-directorate/"
                className="hover:underline"
              >
                Technology Management Directorate (TMD), CSIR-HQ
              </a>
              . All Rights Reserved.
            </span>
          </div>
        </footer>
      </div>
    </>
  );
};

export default FooterBar;
