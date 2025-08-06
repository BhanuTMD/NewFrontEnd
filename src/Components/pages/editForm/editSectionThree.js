import React, { useState } from "react";
import axios from "axios";
import FooterBar from "Components/common/footer";
// import Header from "Components/common/header";
import NavBar from "Components/common/navBar";
import Section from "Components/common/section";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


const EditSectionThree = () => {
  const navigate = useNavigate();

  // Local state
  const location = useLocation();
  const [technologyRefNo] = useState(location.state?.technologyRefNo || "");
  const [licenseName, setLicenseName] = useState("");
  const [dateOfAgreementSigning, setDateOfAgreementSigning] = useState(null);
  const [typeOfLicense, setTypeOfLicense] = useState("");
  const [staRegionalGeography, setStaRegionalGeography] = useState("");
  const [detailsOfExclusivity, setDetailsOfExclusivity] = useState("");
  const [dateOfLicense, setDateOfLicense] = useState(null);
  const [licenseValidUntil, setLicenseValidUntil] = useState(null);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [royalty, setRoyalty] = useState([{ royaltyAmount: "", royaltyDate: null }]);
  const [premia, setPremia] = useState([{ premiaAmount: "", premiaDate: null }]);

  const minDate = new Date("1900-08-12");
  const maxDate = new Date("3000-08-12");

  // Validation schema
  const validationSchema = Yup.object({
    licenseName: Yup.string()
      .max(300, "Max. 300 characters")
      .required("Required"),
    dateOfAgreementSigning: Yup.date().nullable().required("Required"),
    typeOfLicense: Yup.string().required("Required"),
    staRegionalGeography: Yup.string().required("Required"),
    detailsOfExclusivity: Yup.string().max(300, "Max. 300 characters"),
    dateOfLicense: Yup.date().nullable().required("Required"),
    licenseValidUntil: Yup.date().nullable().required("Required"),
    paymentTerms: Yup.string().max(300, "Max. 300 characters"),
  });

  // Handle submit
  const handleSubmit = () => {
    const payload = {
      technologyRefNo,
      licenseName,
      dateOfAgreementSigning: dateOfAgreementSigning
        ? dateOfAgreementSigning.toISOString().split("T")[0]
        : null,
      typeOfLicense,
      staRegionalGeography,
      detailsOfExclusivity,
      dateOfLicense: dateOfLicense
        ? dateOfLicense.toISOString().split("T")[0]
        : null,
      licenseValidUntil: licenseValidUntil
        ? licenseValidUntil.toISOString().split("T")[0]
        : null,
      paymentTerms,
      royalty: royalty.map((r) => ({
        royaltyAmount: r.royaltyAmount || "0",
        royaltyDate: r.royaltyDate
          ? r.royaltyDate.toISOString().split("T")[0]
          : null,
      })),
      premia: premia.map((p) => ({
        premiaAmount: p.premiaAmount || "0",
        premiaDate: p.premiaDate
          ? p.premiaDate.toISOString().split("T")[0]
          : null,
      })),
    };

    axios
      .post("http://172.16.2.246:8080/apf/tdmp/EditSectionThree", payload, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: "Form submitted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message || "Form submission failed. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });

  };

  // Royalties handlers
  const handleAddRoyalty = () => {
    setRoyalty([...royalty, { royaltyAmount: "", royaltyDate: null }]);
  };
  const handleRemoveRoyalty = (index) => {
    const list = [...royalty];
    list.splice(index, 1);
    setRoyalty(list);
  };
  const handleRoyaltyChange = (index, field, value) => {
    const list = [...royalty];
    list[index][field] = value;
    setRoyalty(list);
  };

  // Premias handlers
  const handleAddPremia = () => {
    setPremia([...premia, { premiaAmount: "", premiaDate: null }]);
  };
  const handleRemovePremia = (index) => {
    const list = [...premia];
    list.splice(index, 1);
    setPremia(list);
  };
  const handlePremiaChange = (index, field, value) => {
    const list = [...premia];
    list[index][field] = value;
    setPremia(list);
  };

  // Calculate totals
  const subTotalRoyalty = royalty.reduce(
    (acc, cur) => acc + parseFloat(cur.royaltyAmount || 0),
    0
  );
  const subTotalPremia = premia.reduce(
    (acc, cur) => acc + parseFloat(cur.premiaAmount || 0),
    0
  );
  const grandTotal = subTotalRoyalty + subTotalPremia;

  return (
    <>
      {/* <Header /> */}
      <NavBar />
      <div className="flex flex-col md:flex-row">
        <div className="bg-gray-800"></div>
        <div className="flex-1 p-8 bg-blue-200 border">
          <Section sectionLine="Section 3 : Details of License - Add/Modify Sub Form" />

          <Formik
            initialValues={{
              licenseName,
              dateOfAgreementSigning,
              typeOfLicense,
              staRegionalGeography,
              detailsOfExclusivity,
              dateOfLicense,
              licenseValidUntil,
              paymentTerms,
            }}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue }) => (
              <Form>
                {/* Technology Ref No */}
                <div className="form-group mb-2">
                  <label className="font-bold flex justify-between">
                    Technology / Knowhow Ref No:
                    <span className="Hint block text-xs text-red-500 inline text-end">
                      Mandatory Field
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-half p-1 text-lg outline-0.1 rounded-md bg-gray-200"
                    value={technologyRefNo}
                    readOnly
                  />
                </div>

                {/* License Name */}
                <div className="form-group mb-2 flex flex-col">
                  <label className="font-bold">
                    License Name
                    <span className="Hint block text-sm text-red-500">
                      Max. 30 Characters
                    </span>
                  </label>
                  <Field
                    as="textarea"
                    maxLength="300"
                    name="licenseName"
                    type="text"
                    className="w-half p-1 text-lg outline-0.1 rounded-md"
                    onChange={(e) => setLicenseName(e.target.value)}
                    value={licenseName}
                  />
                  <ErrorMessage
                    name="licenseName"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* Date of Agreement Signing */}
                <div className="form-group mb-2 flex flex-col">
                  <label className="font-bold mb-1">Date of Agreement Signing</label>
                  <DatePicker
                    selected={dateOfAgreementSigning}
                    onChange={(date) => {
                      setDateOfAgreementSigning(date);
                      setFieldValue("dateOfAgreementSigning", date);
                    }}
                    dateFormat="dd/MM/yyyy"
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText="Select Date"
                    className="w-half p-1 text-lg outline-0.1 rounded-md"
                  />
                  <ErrorMessage
                    name="dateOfAgreementSigning"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                {/* Type of License */}
                <div className="form-group mb-2 flex flex-col">
                  <label className="font-bold">Type of License</label>
                  <Field
                    as="select"
                    name="typeOfLicense"
                    className="w-half p-1 text-lg outline-0.1 rounded-md"
                    onChange={(e) => setTypeOfLicense(e.target.value)}
                    value={typeOfLicense}
                  >
                    <option value="">--Please Select--</option>
                    <option value="Exclusive">Exclusive</option>
                    <option value="Non-Exclusive">Non-Exclusive</option>
                  </Field>
                  <ErrorMessage
                    name="typeOfLicense"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* Regional Geography */}
                <div className="form-group mb-2 flex flex-col">
                  <label className="font-bold">Regional Geography</label>
                  <Field
                    as="select"
                    name="staRegionalGeography"
                    className="w-half p-1 text-lg outline-0.1 rounded-md"
                    onChange={(e) => setStaRegionalGeography(e.target.value)}
                    value={staRegionalGeography}
                  >
                    <option value="">--Please Select--</option>
                    <option value="North">North</option>
                    <option value="North-East">North-East</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="South">South</option>
                  </Field>
                  <ErrorMessage
                    name="staRegionalGeography"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* Details of Exclusivity */}
                <div className="form-group mb-2">
                  <label className="font-bold">
                    Details of Exclusivity:&nbsp;
                    <span className="Hint block text-sm text-red-500 inline">
                      Max. 300 Characters
                    </span>
                  </label>
                  <Field
                    as="textarea"
                    name="detailsOfExclusivity"
                    maxLength="300"
                    className="w-full p-1 text-lg outline-0.1 rounded-md"
                    onChange={(e) => setDetailsOfExclusivity(e.target.value)}
                    value={detailsOfExclusivity}
                  />
                  <ErrorMessage
                    name="detailsOfExclusivity"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* Date of License */}
                <div className="form-group mb-2">
                  <label className="font-bold">Date of License &nbsp;</label>
                  <DatePicker
                    selected={dateOfLicense}
                    onChange={(date) => {
                      setDateOfLicense(date);
                      setFieldValue("dateOfLicense", date);
                    }}
                    dateFormat="dd/MM/yyyy"
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText="Select Date"
                    className="w-full p-1 text-lg outline-0.1 rounded-md"
                  />
                  <ErrorMessage
                    name="dateOfLicense"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* License Valid Until */}
                <div className="form-group mb-2">
                  <label className="font-bold">License Valid Until &nbsp;</label>
                  <DatePicker
                    selected={licenseValidUntil}
                    onChange={(date) => {
                      setLicenseValidUntil(date);
                      setFieldValue("licenseValidUntil", date);
                    }}
                    dateFormat="dd/MM/yyyy"
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText="Select Date"
                    className="w-full p-1 text-lg outline-0.1 rounded-md"
                  />
                  <ErrorMessage
                    name="licenseValidUntil"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* Payment Terms */}
                <div className="form-group mb-2">
                  <label className="font-bold">
                    Payment Terms &nbsp;
                    <span className="Hint block text-sm text-red-500 inline">
                      Max. 300 Characters
                    </span>
                  </label>
                  <Field
                    type="text"
                    name="paymentTerms"
                    maxLength="300"
                    className="w-full p-1 text-lg outline-0.1 rounded-md"
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    value={paymentTerms}
                  />
                  <ErrorMessage
                    name="paymentTerms"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* Royalties Section */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Royalties</h3>
                  {royalty.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap gap-4 mb-4 items-center"
                    >
                      <div>
                        <label className="block font-semibold">Royalty Amount:</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="p-1 rounded border w-40"
                          value={item.royaltyAmount}
                          onChange={(e) =>
                            handleRoyaltyChange(index, "royaltyAmount", e.target.value)
                          }
                          placeholder="Enter Amount"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold">Royalty Date:</label>
                        <DatePicker
                          selected={item.royaltyDate}
                          onChange={(date) =>
                            handleRoyaltyChange(index, "royaltyDate", date)
                          }
                          dateFormat="dd/MM/yyyy"
                          minDate={minDate}
                          maxDate={maxDate}
                          placeholderText="Select Date"
                          className="p-1 rounded border w-40"
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRoyalty(index)}
                          className="bg-red-600 text-white px-3 py-1 rounded mt-6"
                          disabled={royalty.length === 1}
                          title={
                            royalty.length === 1
                              ? "At least one royalty entry required"
                              : "Remove royalty"
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddRoyalty}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Add Royalty
                  </button>
                </div>

                {/* Subtotal Royalty */}
                <div className="mb-6 font-bold">
                  Subtotal Royalty: {subTotalRoyalty.toFixed(2)}
                </div>

                {/* Premias Section */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3">Premias</h3>
                  {premia.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap gap-4 mb-4 items-center"
                    >
                      <div>
                        <label className="block font-semibold">Premia Amount:</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="p-1 rounded border w-40"
                          value={item.premiaAmount}
                          onChange={(e) =>
                            handlePremiaChange(index, "premiaAmount", e.target.value)
                          }
                          placeholder="Enter Amount"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold">Premia Date:</label>
                        <DatePicker
                          selected={item.premiaDate}
                          onChange={(date) =>
                            handlePremiaChange(index, "premiaDate", date)
                          }
                          dateFormat="dd/MM/yyyy"
                          minDate={minDate}
                          maxDate={maxDate}
                          placeholderText="Select Date"
                          className="p-1 rounded border w-40"
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => handleRemovePremia(index)}
                          className="bg-red-600 text-white px-3 py-1 rounded mt-6"
                          disabled={premia.length === 1}
                          title={
                            premia.length === 1
                              ? "At least one premia entry required"
                              : "Remove premia"
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddPremia}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Add Premia
                  </button>
                </div>
                {/* Premia Subtotal */}
                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="subTotalPremia">
                    Subtotal Premia Received (in INR)
                  </label>
                  <Field
                    maxLength="300"
                    type="number"
                    name="subTotalPremia"
                    className="w-half p-1 text-lg outline-0.1 rounded-md"
                    value={subTotalPremia}
                    readOnly
                  />
                </div>
                {/* Grand Total */}
                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="GrandTotal">
                    Grand Total (in INR)
                  </label>
                  <Field
                    maxLength="300"
                    type="number"
                    name="GrandTotal"
                    className="w-half p-1 text-lg outline-0.1 rounded-md"
                    value={grandTotal}
                    readOnly
                  />
                </div>
                {/* Buttons */}
                <div className="flex justify-center items-center gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/sectionTwo", { state: { technologyRefNo } })}
                    className="bg-blue-600 text-white px-6 py-3 rounded"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-3 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/sectionFour", { state: { technologyRefNo } })}
                    className="bg-indigo-600 text-white px-6 py-3 rounded"
                  >
                    Next
                  </button>
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

export default EditSectionThree;
