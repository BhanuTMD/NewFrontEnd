import React from "react";

const Section = ({ sectionLine }) => {
  return (
    <div className="flex justify-between ">
      <h2 className="text-2xl w-full m-1 font-bold mb-4 text-center bg-[#81abff] border-solid border-2 me-0 border-black rounded-[0.5rem] p-1">
        {sectionLine}
      </h2>
    </div>
  );
};

export default Section;
