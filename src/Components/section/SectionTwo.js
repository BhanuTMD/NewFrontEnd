import axios from "axios";
import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";

import Header from "Components/common/header";
import FooterBar from "Components/common/footer";
import Section from "Components/common/section";
import NavBar from "Components/common/navBar";
import Country from "Components/data/country";
import CustomSelect from "Components/utils/CustomSelect";

const SectionTwo = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

  const initialValues = {
    technologyRefNo: "",
    iprType: "",
    registrationNo: "",
    status: "",
    statusDate: null,
    country: [],
  };

  const validationSchema = Yup.object({
    iprType: Yup.string().required("Required"),
    registrationNo: Yup.string().max(50).required("Required"),
    status: Yup.string().required("Required"),
    statusDate: Yup.date().nullable().required("Status Date is required"),
    country: Yup.array().min(1, "At least one country is required").required(),
  });

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-GB") : null;
  };

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      statusDate: formatDate(values.statusDate),
      country: Array.isArray(values.country) ? values.country : [values.country],
    };

    axios.post("http://172.16.2.102:8080/apf/tdmp/saveSectionTwo", payload, {
      headers: { "Content-Type": "application/json" },
    })
      .then(() => Swal.fire("Success!", "Form submitted successfully!", "success"))
      .catch(() => Swal.fire("Error!", "Form submission failed. Please try again.", "error"));
  };

  return (
    <>
      <Header />
      <NavBar/>
      <div className="flex bg-blue-200 min-h-screen">
        <div className="flex-1 p-8">
          <Section sectionLine="Section 2 : IPR Status - Add/Modify" />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-6">
                {[
                  { label: "Technology /Knowhow Ref No:", name: "technologyRefNo", type: "text", placeholder: "Enter Ref No" },
                  { label: "IPR Type", name: "iprType", as: "select", options: ["Patent", "Industrial Design", "Trademark", "Copyright", "Other"] },
                  { label: "Registration No.", name: "registrationNo", type: "text", placeholder: "Enter Registration No" },
                  { label: "Status", name: "status", as: "select", options: ["Filed", "Pending for Grant", "Granted", "Lapsed", "Abandoned"] }
                ].map((field, idx) => (
                  <div className="form-group" key={idx}>
                    <label className="font-bold" htmlFor={field.name}>{field.label}</label>
                    <Field
                      name={field.name}
                      as={field.as || "input"}
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      className="w-full p-2 text-lg rounded-md"
                    >
                      {field.options && [<option key="" value="">--Please Select--</option>, ...field.options.map(opt => <option key={opt} value={opt.toLowerCase()}>{opt}</option>)]}
                    </Field>
                    <ErrorMessage name={field.name} component="div" className="text-red-500 text-sm" />
                  </div>
                ))}

                <div className="form-group">
                  <label className="font-bold" htmlFor="statusDate">Status Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setFieldValue("statusDate", date);
                    }}
                    dateFormat="dd/MM/yyyy"
                    className="w-full p-2 text-lg rounded-md"
                    placeholderText="Select date"
                  />
                  <ErrorMessage name="statusDate" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="form-group">
                  <label className="font-bold" htmlFor="country">Country</label>
                  <Field
                    name="country"
                    component={CustomSelect}
                    options={Country}
                    isMulti={true}
                    placeholder="Select country"
                  />
                  <ErrorMessage name="country" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="flex justify-center gap-4">
                  <button type="button" onClick={() => navigate("/sectionOne")} className="px-4 py-2 bg-blue-500 text-white rounded-md">Previous</button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Save</button>
                  <button type="button" onClick={() => navigate("/sectionThree")} className="px-4 py-2 bg-blue-500 text-white rounded-md">Next</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <FooterBar />
    </>
  );
};

export default SectionTwo;
