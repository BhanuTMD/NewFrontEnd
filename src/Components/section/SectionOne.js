import axios from "axios";
import Header from "Components/common/header";
import Section from "Components/common/section";
import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";
import { Formik, Field, Form, ErrorMessage } from "formik";
import CustomSelect from "../utils/CustomSelect";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { industrialSector } from "Components/data/industrialSector";
import { theme } from "Components/data/theme";
import { stakeHolders } from "Components/data/stakeHolders";
import { lab } from "Components/data/lab";

const SectionOne = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedTRN = location.state?.technologyRefNo || "";

  const [generatedRefNo, setGeneratedRefNo] = useState(passedTRN);
  const [initialValues, setInitialValues] = useState({
    technologyRefNo: "",
    keywordTechnology: "",
    nameTechnology: "",
    industrialSector: [],
    theme: [],
    multiLabInstitute: "",
    leadLaboratory: "",
    associateInstitute: [],
    technologyLevel: "",
    scaleDevelopment: "",
    yearDevelopment: "",
    briefTech: "",
    competitivePosition: "",
    technoEconomics: "",
    stakeHolders: [],
    environmentalStatutory: "",
    marketPotential: "",
    file: null,
    laboratoryDetail: "",
  });

  // Prefill from localStorage or API
  useEffect(() => {
    if (passedTRN) {
      const saved = localStorage.getItem("sectionOneData");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.technologyRefNo === passedTRN) {
          setInitialValues({
            ...initialValues,
            ...parsed,
            file: null, // File can't be restored
          });
          setGeneratedRefNo(passedTRN);
          return;
        }
      }

      // Fallback to API
      const token = localStorage.getItem("token");
      axios
        .get(`http://172.16.2.246:8080/apf/tdmp/getSectionOne/${passedTRN}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setInitialValues({
            ...initialValues,
            ...res.data,
            file: null,
          });
          setGeneratedRefNo(passedTRN);
        })
        .catch((err) => {
          console.error("Error fetching section data", err);
        });
    }
  }, [passedTRN]);

  const validationSchema = Yup.object({});

  const handleSubmit = (values, { setSubmitting }) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit this form now?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Submit it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const url = "http://172.16.2.246:8080/apf/tdmp/saveSectionOne";
        const formData = new FormData();

        for (let key in values) {
          if (Array.isArray(values[key])) {
            values[key].forEach((item) => formData.append(key, item));
          } else if (key === "file" && values.file) {
            formData.append("file", values.file);
          } else {
            formData.append(key, values[key]);
          }
        }

        const token = localStorage.getItem("token");

        axios
          .post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const responseData = res.data;
            const techRef = responseData.technologyRefNo;

            setGeneratedRefNo(techRef);
            localStorage.setItem("sectionOneData", JSON.stringify(responseData));

            Swal.fire("Success!", "Form submitted successfully!", "success");

            navigate("/sectionTwo", {
              state: { technologyRefNo: techRef },
            });
          })
          .catch((err) => {
            console.error("Submission error", err);
            Swal.fire("Error!", "Failed to submit. Try again.", "error");
          })
          .finally(() => {
            setSubmitting(false);
          });
      } else {
        setSubmitting(false);
      }
    });
  };

  return (
    <>
      <Header />
      <NavBar />
      <div className="flex">
        <div className="bg-gray-800"></div>
        <div className="flex-1 p-8 bg-blue-200 border">
          <Section sectionLine="Section 1 : Key Details - Add New Technology / Knowhow Information" />
          <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
            {({ setFieldValue, isSubmitting }) => (
              <Form>
                <div className="form-group mb-4">
                  <label className="font-bold flex justify-between" htmlFor="technologyRefNo">
                    Technology /Knowhow Ref No:
                    <span className="Hint block text-xs text-red-500 inline text-end">Mandatory Field</span>
                  </label>
                  <input
                    type="text"
                    name="technologyRefNo"
                    value={generatedRefNo ? generatedRefNo : "Will be generated after submission"}
                    readOnly
                    className="w-full p-2 text-lg outline-0.1 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div className="form-group">
                  <label className="font-bold" htmlFor="keywordTechnology">
                    Keywords for Technology / Knowhow
                  </label>
                  <Field
                    type="text"
                    name="keywordTechnology"
                    defaultValue="CSIR/ANB/BIOT/01" // Default value here
                    className="w-full p-2 text-lg outline-0.1 rounded-md"
                  />
                  <ErrorMessage
                    name="keywordTechnology"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="form-group">
                  <label className="font-bold" htmlFor="nameTechnology">
                    Name of Technology / Knowhow: &nbsp;
                    <span className="Hint block text-sm text-red-500 inline">
                      Max. 500 Characters
                    </span>
                  </label>
                  <Field
                    type="text"
                    name="nameTechnology"
                    as="textarea"
                    rows="3"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <ErrorMessage
                    name="nameTechnology"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="industrialSector">
                    Industrial Sector
                  </label>
                  <Field
                    name="industrialSector"
                    options={industrialSector}
                    component={CustomSelect}
                    placeholder="Select Industrial Sector..."
                    isMulti={true}
                  />
                  <ErrorMessage
                    name="industrialSector"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="leadLaboratory">
                    Lead Laboratory / Institute
                  </label>
                  <Field
                    name="leadLaboratory"
                    options={lab}
                    component={CustomSelect}
                    placeholder="Select a Lab..."
                  // isMulti={true}
                  ></Field>
                </div>
                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="theme">
                    Theme
                  </label>
                  <Field
                    name="theme"
                    options={theme}
                    component={CustomSelect}
                    placeholder="Select a Theme..."
                    isMulti={true}
                  >
                    <ErrorMessage
                      name="theme"
                      component="div"
                      className="text-red-500"
                    />
                  </Field>
                </div>
                <div className="form-group flex items-center mb-4">
                  <label className="font-bold" htmlFor="multiLabInstitute">
                    Multi Laboratories / Institutes
                  </label>
                  <div className="ml-4 flex space-x-4">
                    <label htmlFor="multiLabYes" className="flex items-center">
                      <input
                        type="radio"
                        id="multiLabYes"
                        name="multiLabInstitute"
                        value="Yes"
                        className="mr-2"
                        onChange={() =>
                          setFieldValue("multiLabInstitute", "Yes")
                        }
                      />
                      Yes
                    </label>
                    <label htmlFor="multiLabNo" className="flex items-center">
                      <input
                        type="radio"
                        id="multiLabNo"
                        name="multiLabInstitute"
                        value="No"
                        className="mr-2"
                        onChange={() =>
                          setFieldValue("multiLabInstitute", "No")
                        }
                      />
                      No
                    </label>
                  </div>
                  <ErrorMessage
                    name="multiLabInstitute"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="lab">
                    If Yes,Please Specify Labs/Institutes
                  </label>

                  <Field
                    name="lab"
                    options={lab}
                    component={CustomSelect}
                    placeholder="Select List Of Multilabs From here..."
                    isMulti={true}
                  //className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  ></Field>
                </div>

                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="technologyLevel">
                    Technology Readiness Level (TRL)
                  </label>
                  <Field
                    as="select"
                    name="technologyLevel"
                    className="w-full p-2 text-lg outline-0.1 rounded-md"
                  >
                    <option value="" label="Select TRL" />
                    {[...Array(9).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="technologyLevel"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="scaleDevelopment">
                    Scale of Development: &nbsp;
                    <span className="Hint block text-sm text-red-500 inline">
                      Max. 250 Characters
                    </span>
                  </label>
                  <Field
                    type="text"
                    name="scaleDevelopment"
                    as="textarea"
                    rows="3"
                    maxLength="250"
                    className="w-full p-2 text-lg outline-0.1 rounded-md"
                  />
                  <ErrorMessage
                    name="scaleDevelopment"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="yearDevelopment">
                    Year of Development
                  </label>
                  <Field
                    type="text"
                    name="yearDevelopment"
                    className="w-full p-2 text-lg outline-0.1 rounded-md"
                  />
                  <ErrorMessage
                    name="yearDevelopment"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="briefTech">
                    Brief details of Technology / Knowhow: &nbsp;
                    <span className="Hint block text-sm text-red-500 inline">
                      Max. 1000 Characters
                    </span>
                  </label>
                  <Field
                    type="text"
                    name="briefTech"
                    as="textarea"
                    rows="3"
                    maxLength="1000"
                    className="w-full p-2 text-lg outline-0.1 rounded-md"
                  />
                  <ErrorMessage
                    name="briefTech"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="competitivePosition">
                    Competitive Positioning in the domain (how is it better than
                    competing technology)/Technology Benchmarking &nbsp;
                    <span className="Hint block text-sm text-red-500 inline">
                      Max. 1500 Characters
                    </span>
                  </label>
                  <Field
                    type="text"
                    name="competitivePosition"
                    as="textarea"
                    rows="3"
                    maxLength="1500"
                    className="w-full p-2 text-lg outline-0.1 rounded-md"
                  />
                  <ErrorMessage
                    name="competitivePosition"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="stakeHolders">
                    Potential Stakeholders
                  </label>
                  <Field
                    name="stakeHolders"
                    options={stakeHolders}
                    component={CustomSelect}
                    placeholder="Select Ministry List from here..."
                    isMulti={true}
                  //className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  ></Field>
                  <ErrorMessage
                    name="stakeHolders"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="technoEconomics">
                    Techno-economics (including development & deployment
                    cost,operational cost, payback period etc.) &nbsp;
                    <span className="Hint block text-sm text-red-500 inline">
                      Max. 1500 Characters
                    </span>
                  </label>
                  <Field
                    type="text"
                    name="technoEconomics"
                    as="textarea"
                    rows="3"
                    maxLength="1500"
                    className="w-full p-2 text-lg outline-0.1 rounded-md"
                  />
                  <ErrorMessage
                    name="technoEconomics"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="marketPotential">
                    Market Potential &nbsp;
                    <span className="Hint block text-sm text-red-500 inline">
                      Max. 1000 Characters
                    </span>
                  </label>
                  <Field
                    type="text"
                    name="marketPotential"
                    as="textarea"
                    rows="3"
                    maxLength="1000"
                    className="w-full p-2 text-lg outline-0.1 rounded-md"
                  />
                  <ErrorMessage
                    name="marketPotential"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="environmentalStatutory">
                    Environmental considerations / Statutory regulatory
                    compliance details &nbsp;
                    <span className="Hint block text-sm text-red-500 inline">
                      Max. 1000 Characters
                    </span>
                  </label>
                  <Field
                    type="text"
                    name="environmentalStatutory"
                    as="textarea"
                    rows="3"
                    maxLength="300"
                    className="w-full p-2 text-lg outline-0.1 rounded-md"
                  />
                  <ErrorMessage
                    name="environmentalStatutory"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="file">
                    Upload High-Resolution file (Optional)
                  </label>
                  <input
                    type="file"
                    name="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="w-full p-2 text-lg outline-0.1 rounded-md"
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      const maxSize = 10 * 1024 * 1024; // 10 MB

                      if (file) {
                        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
                        if (!allowedTypes.includes(file.type)) {
                          alert("Only JPG, PNG, and PDF files are allowed.");
                          e.target.value = null; // Reset the input
                          return;
                        }

                        if (file.size > maxSize) {
                          alert("File size should be less than or equal to 10MB.");
                          e.target.value = null; // Reset the input
                          return;
                        }

                        // Set file if valid
                        setFieldValue("file", file);
                      }
                    }}
                  />

                </div>

                <div className="form-group mb-4">
                  <label className="font-bold" htmlFor="laboratoryDetail">
                    Contact Details of Laboratory &nbsp;
                    <span className="Hint block text-sm text-red-500 inline">
                      Max. 300 Characters
                    </span>
                  </label>
                  <Field
                    type="text"
                    name="laboratoryDetail"
                    as="textarea"
                    rows="3"
                    maxLength="300"
                    className="w-full p-2 text-lg outline-0.1 rounded-md"
                  />
                  <ErrorMessage
                    name="laboratoryDetail"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* <div className="form-group mb-4 flex justify-center ">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md "
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4"
                    onClick={() => navigate("/sectionTwo", { state: { technologyRefNo: generatedRefNo } })}

                  >
                    Next
                  </button>
                </div> */}
                <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit & Next"}
                </button>
              </div>
                {/* <MyForm/> */}
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <FooterBar />
    </>
  );
};

export default SectionOne;
