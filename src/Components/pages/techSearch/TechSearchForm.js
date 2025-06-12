import React from 'react';
import { Field, ErrorMessage } from 'formik';

const TechSearchForm = ({ selectedSection, handleSectionChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-8">
            {/* TRN NO */}
            <div className="flex flex-col">
                <label htmlFor="trnNo" className="font-semibold mb-1">
                    TRN NO
                </label>
                <Field
                    id="trnNo"
                    name="trnNo"
                    type="text"
                    placeholder="Enter TRN No"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage name="trnNo" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Section Select */}
            <div className="flex flex-col">
                <label htmlFor="sectionSelect" className="font-semibold mb-1">
                    SECTION
                </label>
                <Field
                    id="sectionSelect"
                    name="sectionSelect"
                    as="select"
                    value={selectedSection}
                    onChange={handleSectionChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">-- Select Section --</option>
                    <option value="SectionOne">Section One</option>
                    <option value="SectionTwo">Section Two</option>
                    <option value="SectionThree">Section Three</option>
                    <option value="SectionFour">Section Four</option>
                </Field>
                <ErrorMessage name="sectionSelect" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Enter Button */}
            <div className="md:col-span-2 flex justify-center mt-4">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow transition duration-200"
                >
                    Enter
                </button>
            </div>
        </div>
    );
};

export default TechSearchForm;
