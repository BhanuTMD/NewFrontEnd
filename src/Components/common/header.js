import React from "react";

const Header = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-500 via-blue-700 to-blue-700 text-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 relative">
        {/* Logo on the left */}
        <a href="WelcomePage">
          <img src="/logo.jpg" alt="Logo" className="h-10 w-auto" />
        </a>

        {/* Title centered absolutely */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-center text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold tracking-wide whitespace-nowrap">
          CSIR Technology Database India
        </h1>
      </div>
    </div>
  );
};

export default Header;
