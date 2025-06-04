import React from 'react';
import { Field, ErrorMessage } from 'formik';
// import CustomSelect from '../../Components/utils/CustomSelect'; // Adjust the import path as necessary
// import { industrialSector, lab, theme } from '../../pages/techSearchOptions';

const TechSearchForm = ({ selectedSection, handleSectionChange }) => {
    return (
        <div className="grid grid-cols-4 gap-4">
            {/* Industrial Sector Dropdown */}
            {/* <div className="form-group mb-4">
                <label className="font-bold" htmlFor="industrialSector">
                    INDUSTRIAL SECTOR
                </label>
                <Field
                    name="industrialSector"
                    options={industrialSector}
                    component={CustomSelect}
                    placeholder="Select Industrial Sector..."
                />
                <ErrorMessage name="industrialSector" component="div" className="text-red-500" />
            </div> */}

            {/* Lab No Dropdown */}
            {/* <div className="form-group mb-4">
                <label className="font-bold" htmlFor="lab">
                    LAB NO
                </label>
                <Field
                    name="lab"
                    options={lab}
                    component={CustomSelect}
                    placeholder="Select List Of Lab From here..."
                />
                <ErrorMessage name="lab" component="div" className="text-red-500" />
            </div> */}

            {/* Theme No Dropdown */}
            {/* <div className="form-group mb-4">
                <label className="font-bold" htmlFor="themeNo">
                    THEME NO
                </label>
                <Field
                    name="themeNo"
                    options={theme}
                    component={CustomSelect}
                    placeholder="Select a Theme..."
                />
                <ErrorMessage name="themeNo" component="div" className="text-red-500" />
            </div> */}

            {/* TRN No Input Field */}
            <div className="form-group mb-4">
                <label className="font-bold" htmlFor="trnNo">
                    TRN NO
                </label>
                <Field
                    type="text"
                    name="trnNo"
                    className="w-full p-2 text-md outline-0.1 rounded-md"
                    placeholder="Enter TRN No"
                />
                <ErrorMessage name="trnNo" component="div" className="text-red-500" />
            </div>

            <div className="form-group mb-4 flex justify-center col-span-4">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Enter
                </button>
            </div>

            <div className="form-group mb-4 col-span-4">
                <label className="font-bold flex justify-between" htmlFor="sectionSelect">
                    SECTION
                    <span className="Hint block text-xs text-red-500 inline text-end"></span>
                </label>
                <Field
                    name="sectionSelect"
                    as="select"
                    className="w-1/4 p-2 text-lg outline-0.1 rounded-md"
                    onChange={handleSectionChange}
                    value={selectedSection}
                >
                    <option value="">-- Select Section--</option>
                    <option value="SectionOne">SectionOne</option>
                    <option value="SectionTwo">SectionTwo</option>
                    <option value="SectionThree">SectionThree</option>
                    <option value="SectionFour">SectionFour</option>
                </Field>
                <ErrorMessage name="sectionSelect" component="div" className="text-red-500" />
            </div>
        </div>
    );
};

export default TechSearchForm;