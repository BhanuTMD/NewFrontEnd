import React from "react";

const Section = ({ sectionLine }) => {
  return (
    <div className="w-full flex justify-center my-4">
      <h2
        className="
          w-full 
          max-w-4xl 
          text-center 
          text-xl sm:text-2xl 
          font-extrabold 
          tracking-wide 
          text-white 
          bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400
          shadow-md 
          rounded-xl 
          py-3 
          px-4 
          border border-white/30 
          backdrop-blur-sm
        "
      >
        {sectionLine}
      </h2>
    </div>
  );
};

export default Section;
