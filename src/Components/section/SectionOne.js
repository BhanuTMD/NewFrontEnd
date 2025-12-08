import axios from "axios";
import Section from "Components/common/section";
import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";
import { Formik, Field, Form, ErrorMessage } from "formik";
import CustomSelect from "../utils/CustomSelect";
import * as Yup from "yup";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

import { industrialSectorOptions } from "Components/data/industrialSector";
import { potentialMinistryOptions } from "Components/data/potentialMinistries";
import { themeOptions } from "Components/data/theme";
import { labOptions } from "Components/data/lab";
import { potentialApplicationAreaOptions } from "Components/data/potentialApplicationAreas";

import FileViewerModal from "Components/pages/view/FileViewerModal";

const SectionOne = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { technologyRefNo: paramTRN } = useParams();
  const passedTRN = paramTRN || location.state?.technologyRefNo || "";

  const [generatedRefNo, setGeneratedRefNo] = useState(passedTRN);
  const [loading, setLoading] = useState(!!passedTRN);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToView, setFileToView] = useState("");
  const [existingFileUrl, setExistingFileUrl] = useState("");
  const [isFileRemoved, setIsFileRemoved] = useState(false);

  const [initialValues, setInitialValues] = useState({
    id: null,
    technologyRefNo: "",
    keywordTechnology: "",
    nameTechnology: "",
    industrialSector: [],
    theme: [],
    multiLabInstitute: "No",
    leadLaboratory: null,
    lab: [],
    technologyLevel: "",
    scaleDevelopment: "",
    yearDevelopment: "",
    briefTech: "",
    competitivePosition: "",
    technoEconomics: "",
    potentialApplicationAreas: [],
    potentialMinistries: [],
    environmentalStatutory: "",
    marketPotential: "",
    file: null,
    laboratoryDetail: "",
  });

  // --- Prefill / Edit data ---
  useEffect(() => {
    if (passedTRN) {
      setLoading(true);
      const token = localStorage.getItem("token");
      axios
        .get(`http://172.16.2.246:8080/api/section-one/${passedTRN}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const fetchedData = res.data;

          const processToArray = (input) => {
            if (!input) return [];
            if (Array.isArray(input)) return input;
            if (typeof input === "string")
              return input.split("|").filter(Boolean);
            return [];
          };

          const cleanedIndustrialSectors = processToArray(
            fetchedData.industrialSector
          );
          const cleanedThemes = processToArray(fetchedData.theme);
          const cleanedLabs = processToArray(fetchedData.lab);
          const cleanedAppAreas = processToArray(
            fetchedData.potentialApplicationAreas
          );
          const cleanedMinistries = processToArray(
            fetchedData.potentialMinistries
          );

          const formattedValues = {
            ...fetchedData,
            leadLaboratory:
              labOptions.find(
                (opt) => opt.value === fetchedData.leadLaboratory
              ) || null,
            industrialSector: industrialSectorOptions.filter((opt) =>
              cleanedIndustrialSectors.includes(opt.value)
            ),
            theme: themeOptions.filter((opt) =>
              cleanedThemes.includes(opt.value)
            ),
            lab: labOptions.filter((opt) => cleanedLabs.includes(opt.value)),
            potentialApplicationAreas:
              potentialApplicationAreaOptions.filter((opt) =>
                cleanedAppAreas.includes(opt.value)
              ),
            potentialMinistries: potentialMinistryOptions.filter((opt) =>
              cleanedMinistries.includes(opt.value)
            ),
            multiLabInstitute:
              fetchedData.multiLabInstitute === "Yes" ||
              fetchedData.multiLabInstitute === true
                ? "Yes"
                : "No",
            keywordTechnology: fetchedData.keywordTechnology || "",
            yearDevelopment: fetchedData.yearDevelopment
              ? String(fetchedData.yearDevelopment)
              : "",
            technologyLevel: fetchedData.technologyLevel
              ? String(fetchedData.technologyLevel)
              : "",
            file: null,
          };

          setInitialValues(formattedValues);
          setGeneratedRefNo(passedTRN);
          setExistingFileUrl(fetchedData.fileUrl || "");
          setIsFileRemoved(false);
        })
        .catch((err) => {
          console.error("Error fetching section one data", err);
          Swal.fire("Error", "Could not fetch existing data.", "error");
          navigate("/ViewTechnology");
        })
        .finally(() => setLoading(false));
    } else {
      // --- New create ---
      setInitialValues({
        id: null,
        technologyRefNo: "",
        keywordTechnology: "",
        nameTechnology: "",
        industrialSector: [],
        theme: [],
        multiLabInstitute: "No",
        leadLaboratory: null,
        lab: [],
        technologyLevel: "",
        scaleDevelopment: "",
        yearDevelopment: "",
        briefTech: "",
        competitivePosition: "",
        technoEconomics: "",
        potentialApplicationAreas: [],
        potentialMinistries: [],
        environmentalStatutory: "",
        marketPotential: "",
        file: null,
        laboratoryDetail: "",
      });
      setGeneratedRefNo("");
      setExistingFileUrl("");
      setIsFileRemoved(false);
      setLoading(false);
    }
  }, [passedTRN, navigate]);

  // --- Yup Validation ---
  const validationSchema = Yup.object({
    nameTechnology: Yup.string().required("Required").max(500, "Max 500 chars"),
    keywordTechnology: Yup.string()
      .required("Required")
      .max(200, "Max 200 chars"),
    leadLaboratory: Yup.object()
      .shape({
        value: Yup.string().required(),
        label: Yup.string().required(),
      })
      .nullable()
      .required("Lead Laboratory is required"),
    theme: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        })
      )
      .min(1, "Select at least one theme")
      .required("Theme is required"),
    multiLabInstitute: Yup.string().required("Please select Yes or No"),
    lab: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        })
      )
      .when("multiLabInstitute", {
        is: "Yes",
        then: (schema) => schema.min(1, "Select associated labs if 'Yes'"),
        otherwise: (schema) => schema.notRequired(),
      }),
    technologyLevel: Yup.string().required("TRL is required"),
    yearDevelopment: Yup.string()
      .required("Year is required")
      .matches(/^[0-9]{4}$/, "Enter a valid 4-digit year"),
    briefTech: Yup.string()
      .required("Brief details are required")
      .max(1000, "Max 1000 chars"),
    laboratoryDetail: Yup.string()
      .required("Lab details are required")
      .max(300, "Max 300 chars"),
    scaleDevelopment: Yup.string().max(250, "Max 250 chars").nullable(),
    competitivePosition: Yup.string()
      .max(1500, "Max 1500 chars")
      .nullable(),
    technoEconomics: Yup.string().max(1500, "Max 1500 chars").nullable(),
    environmentalStatutory: Yup.string()
      .max(300, "Max 300 chars")
      .nullable(),
    potentialMinistries: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        })
      )
      .nullable(),
    industrialSector: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        })
      )
      .nullable(),
  });

  // --- File Handlers ---
  const handleViewFile = () => {
    if (existingFileUrl) {
      const viewUrl = existingFileUrl.replace("/download/", "/view/");
      setFileToView(viewUrl);
      setIsModalOpen(true);
    } else {
      Swal.fire("Info", "No file available to view.", "info");
    }
  };

  const handleRemoveFile = (setFieldValue) => {
    Swal.fire({
      title: "Remove Existing File?",
      text: "This will mark the file for removal upon saving. Upload a new file if needed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, remove it",
    }).then((result) => {
      if (result.isConfirmed) {
        setExistingFileUrl("");
        setIsFileRemoved(true);
        setFieldValue("file", null);
      }
    });
  };

  // --- Submit handler ---
  const handleSubmit = (values, { setSubmitting }, action) => {
    const isUpdate = !!passedTRN;

    Swal.fire({
      title: "Confirm Submission?",
      text: isUpdate ? "Update this technology?" : "Submit this new technology?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Submit!",
    }).then((result) => {
      if (!result.isConfirmed) {
        setSubmitting(false);
        return;
      }

      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        const value = values[key];

        if (key === "file" && value instanceof File) {
          formData.append("file", value);
        } else if (key === "leadLaboratory") {
          if (value && typeof value === "object" && value.value) {
            formData.append(key, value.value);
          } else if (typeof value === "string") {
            formData.append(key, value);
          }
        } else if (
          [
            "industrialSector",
            "theme",
            "lab",
            "potentialApplicationAreas",
            "potentialMinistries",
          ].includes(key)
        ) {
          if (Array.isArray(value) && value.length > 0) {
            const list = value
              .map((v) => v?.value ?? "")
              .filter(Boolean)
              .join("|");
            formData.append(key, list);
          }
        } else if (
          value !== null &&
          value !== undefined &&
          typeof value !== "object" &&
          key !== "file"
        ) {
          formData.append(key, value);
        }
      });

      if (values.id) {
        formData.append("id", values.id);
      }

      if (isFileRemoved) {
        formData.append("isFileRemoved", "true");
      }

      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let requestPromise;
      if (isUpdate) {
        const updateUrl = `http://172.16.2.246:8080/api/section-one/update/${passedTRN}`;
          requestPromise = axios.put(updateUrl, formData, { headers });
      } else {
        const createUrl = "http://172.16.2.246:8080/api/section-one/create";
        requestPromise = axios.post(createUrl, formData, { headers });
      }

      requestPromise
        .then((res) => {
          const techRef = res.data.technologyRefNo;
          setGeneratedRefNo(techRef);

          Swal.fire(
            "Success!",
            `Technology ${isUpdate ? "updated" : "saved"}! TRN: ${techRef}`,
            "success"
          );

          if (action === "next") {
            navigate("/sectionTwo", { state: { technologyRefNo: techRef } });
          } else {
            // updateOnly -> stay on this section
          }
        })
        .catch((err) => {
          Swal.fire(
            "Error!",
            err.response?.data?.message ||
              `Failed to ${isUpdate ? "update" : "submit"}.`,
            "error"
          );
        })
        .finally(() => setSubmitting(false));
    });
  };

  if (loading && passedTRN) {
    return (
      <p className="text-center mt-6 text-gray-600">
        Loading existing data...
      </p>
    );
  }

  const defaultAction = passedTRN ? "updateOnly" : "next";

  return (
    <>
      <NavBar />

      {/* PAGE LAYOUT: Left 75%, Right 25% empty */}
      <div className="flex min-h-screen bg-blue-100">
        {/* Left content (75%) */}
        <div className="w-full md:w-3/4 border-r">
          <div className="max-w-5xl ml-60 mr-auto p-6 md:p-8">
            <Section sectionLine="Section 1 : Key Details of the Technology / Knowhow " />

            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, formikHelpers) =>
                handleSubmit(values, formikHelpers, defaultAction)
              }
            >
              {({ values, setFieldValue, isSubmitting, errors, touched }) => (
                <Form className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100 space-y-6">
                  {/* Header: Ref No */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="font-semibold text-gray-700 block mb-1">
                        Technology Ref No
                      </label>
                      <input
                        type="text"
                        value={
                          generatedRefNo || "Will be generated after submission"
                        }
                        readOnly
                        className="w-full p-2.5 text-base rounded-md bg-gray-100 text-gray-600 border border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Main Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name of Technology (full width) */}
                    <div className="md:col-span-2">
                      <label
                        className="font-semibold text-gray-700 block mb-1"
                        htmlFor="nameTechnology"
                      >
                        Name of Technology{" "}
                        <span className="text-red-500">*</span>
                        <span className="block text-xs font-normal text-gray-500">
                          Max. 500 characters
                        </span>
                      </label>
                      <Field
                        name="nameTechnology"
                        as="textarea"
                        rows="3"
                        className={`w-full p-2.5 text-base rounded-md border ${
                          errors.nameTechnology && touched.nameTechnology
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:border-blue-500 outline-none`}
                      />
                      <ErrorMessage
                        name="nameTechnology"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Keywords */}
                    <div className="md:col-span-2">
                      <label
                        className="font-semibold text-gray-700 block mb-1"
                        htmlFor="keywordTechnology"
                      >
                        Keywords <span className="text-red-500">*</span>
                        <span className="block text-xs font-normal text-gray-500">
                          Comma-separated, 5–8 words, Max 200 characters
                        </span>
                      </label>
                      <Field
                        type="text"
                        name="keywordTechnology"
                        maxLength="200"
                        className={`w-full p-2.5 text-base rounded-md border ${
                          errors.keywordTechnology && touched.keywordTechnology
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:border-blue-500 outline-none`}
                      />
                      <ErrorMessage
                        name="keywordTechnology"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Industrial Sector */}
                    <div>
                      <label
                        className="font-semibold text-gray-700 block mb-1"
                        htmlFor="industrialSector"
                      >
                        Industrial Sector(s)
                      </label>
                      <Field
                        name="industrialSector"
                        options={industrialSectorOptions}
                        component={CustomSelect}
                        placeholder="Select sector(s)..."
                        isMulti={true}
                      />
                      <ErrorMessage
                        name="industrialSector"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Theme */}
                    <div>
                      <label
                        className="font-semibold text-gray-700 block mb-1"
                        htmlFor="theme"
                      >
                        Theme(s) <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="theme"
                        options={themeOptions}
                        component={CustomSelect}
                        placeholder="Select theme(s)..."
                        isMulti={true}
                        className={`${
                          errors.theme && touched.theme
                            ? "react-select-error"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="theme"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Lead Laboratory */}
                    <div>
                      <label
                        className="font-semibold text-gray-700 block mb-1"
                        htmlFor="leadLaboratory"
                      >
                        Lead Laboratory / Institute{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="leadLaboratory"
                        options={labOptions}
                        component={CustomSelect}
                        placeholder="Select lead lab..."
                        className={`${
                          errors.leadLaboratory && touched.leadLaboratory
                            ? "react-select-error"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="leadLaboratory"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Multi Lab Radio */}
                    <div className="border rounded-md bg-gray-50 p-3">
                      <label className="font-semibold text-gray-700 block mb-1">
                        Multi Laboratories Involved?{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4 mt-1">
                        <label className="flex items-center text-sm">
                          <Field
                            type="radio"
                            name="multiLabInstitute"
                            value="Yes"
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center text-sm">
                          <Field
                            type="radio"
                            name="multiLabInstitute"
                            value="No"
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                      <ErrorMessage
                        name="multiLabInstitute"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* TRL */}
                    <div>
                      <label
                        className="font-semibold text-gray-700 block mb-1"
                        htmlFor="technologyLevel"
                      >
                        TRL <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        name="technologyLevel"
                        className={`w-full p-2.5 text-base rounded-md border ${
                          errors.technologyLevel && touched.technologyLevel
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:border-blue-500 outline-none bg-white`}
                      >
                        <option value="" label="Select TRL (0–9)" />
                        {[...Array(10).keys()].map((i) => (
                          <option key={i} value={String(i)}>
                            {i}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="technologyLevel"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Associated Labs if Yes */}
                    {values.multiLabInstitute === "Yes" && (
                      <div className="md:col-span-2">
                        <label
                          className="font-semibold text-gray-700 block mb-1"
                          htmlFor="lab"
                        >
                          Specify Associated Labs{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="lab"
                          options={labOptions}
                          component={CustomSelect}
                          placeholder="Select associated lab(s)..."
                          isMulti={true}
                          className={`${
                            errors.lab && touched.lab
                              ? "react-select-error"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          name="lab"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    )}

                    {/* Year of Development */}
                    <div>
                      <label
                        className="font-semibold text-gray-700 block mb-1"
                        htmlFor="yearDevelopment"
                      >
                        Year of Development{" "}
                        <span className="text-red-500">*</span>
                        <span className="block text-xs font-normal text-gray-500">
                          YYYY
                        </span>
                      </label>
                      <Field name="yearDevelopment">
                        {({ field, form }) => (
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value, 0, 1) : null
                            }
                            onChange={(date) => {
                              const year = date?.getFullYear();
                              form.setFieldValue(field.name, year);
                            }}
                            showYearPicker
                            dateFormat="yyyy"
                            placeholderText="Select year..."
                            className={`w-full p-2.5 text-base rounded-md border ${
                              form.errors.yearDevelopment &&
                              form.touched.yearDevelopment
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:border-blue-500 outline-none`}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="yearDevelopment"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Scale of Development */}
                    <div>
                      <label
                        className="font-semibold text-gray-700 block mb-1"
                        htmlFor="scaleDevelopment"
                      >
                        Scale of Development
                        <span className="block text-xs font-normal text-gray-500">
                          Max. 250 characters
                        </span>
                      </label>
                      <Field
                        name="scaleDevelopment"
                        as="textarea"
                        rows="2"
                        maxLength="250"
                        className={`w-full p-2.5 text-base rounded-md border ${
                          errors.scaleDevelopment && touched.scaleDevelopment
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:border-blue-500 outline-none`}
                      />
                      <ErrorMessage
                        name="scaleDevelopment"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Brief Details (full width) */}
                    <div className="md:col-span-2">
                      <label
                        className="font-semibold text-gray-700 block mb-1"
                        htmlFor="briefTech"
                      >
                        Details of Technology{" "}
                        <span className="text-red-500">*</span>
                        <span className="block text-xs font-normal text-gray-500">
                          Max. 1000 characters
                        </span>
                      </label>
                      <Field
                        name="briefTech"
                        as="textarea"
                        rows="4"
                        maxLength="1000"
                        className={`w-full p-2.5 text-base rounded-md border ${
                          errors.briefTech && touched.briefTech
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:border-blue-500 outline-none`}
                      />
                      <ErrorMessage
                        name="briefTech"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Competitive Positioning (full width) */}
                    <div className="md:col-span-2">
                      <label
                        className="font-semibold text-gray-700 block mb-1"
                        htmlFor="competitivePosition"
                      >
                        Competitive Positioning (Global benchmark in the domain)
                        <span className="block text-xs font-normal text-gray-500">
                          Max. 1500 characters
                        </span>
                      </label>
                      <Field
                        name="competitivePosition"
                        as="textarea"
                        rows="4"
                        maxLength="1500"
                        className={`w-full p-2.5 text-base rounded-md border ${
                          errors.competitivePosition &&
                          touched.competitivePosition
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:border-blue-500 outline-none`}
                      />
                      <ErrorMessage
                        name="competitivePosition"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Techno-economics (full width) */}
                    <div className="md:col-span-2">
                      <label
                        className="font-semibold text-gray-700 block mb-1"
                        htmlFor="technoEconomics"
                      >
                        Techno-economics
                        <span className="block text-xs font-normal text-gray-500">
                          Max. 1500 characters
                        </span>
                      </label>
                      <Field
                        name="technoEconomics"
                        as="textarea"
                        rows="4"
                        maxLength="1500"
                        className={`w-full p-2.5 text-base rounded-md border ${
                          errors.technoEconomics && touched.technoEconomics
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:border-blue-500 outline-none`}
                      />
                      <ErrorMessage
                        name="technoEconomics"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Potential Ministries */}
                    <div>
                      <label
                        className="font-semibold text-gray-700 block mb-1"
                        htmlFor="potentialMinistries"
                      >
                        Potential Ministries (who may be benefited)
                      </label>
                      <Field
                        name="potentialMinistries"
                        options={potentialMinistryOptions}
                        component={CustomSelect}
                        placeholder="Select ministries..."
                        isMulti={true}
                      />
                      <ErrorMessage
                        name="potentialMinistries"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Environmental / Statutory */}
                    <div>
                      <label
                        className="font-semibold text-gray-700 block mb-1"
                        htmlFor="environmentalStatutory"
                      >
                        Environmental / Statutory Compliance
                        <span className="block text-xs font-normal text-gray-500">
                          Max. 300 characters
                        </span>
                      </label>
                      <Field
                        name="environmentalStatutory"
                        as="textarea"
                        rows="3"
                        maxLength="300"
                        className={`w-full p-2.5 text-base rounded-md border ${
                          errors.environmentalStatutory &&
                          touched.environmentalStatutory
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:border-blue-500 outline-none`}
                      />
                      <ErrorMessage
                        name="environmentalStatutory"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* File Upload (full width) */}
                    <div className="md:col-span-2">
                      <div className="p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
                        <label
                          className="font-semibold text-gray-700 block mb-1"
                          htmlFor="file"
                        >
                          Upload File (Optional)
                          <span className="block text-xs font-normal text-gray-500">
                            Image/PDF (Max 10MB)
                          </span>
                        </label>
                        {passedTRN && existingFileUrl && !isFileRemoved && (
                          <div className="mb-3 flex flex-wrap gap-3 items-center">
                            <button
                              type="button"
                              onClick={handleViewFile}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium"
                            >
                              View Current
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(setFieldValue)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                            >
                              Remove Current
                            </button>
                            <span className="text-xs text-gray-600">
                              (Will be replaced if you upload new)
                            </span>
                          </div>
                        )}
                        {isFileRemoved && (
                          <p className="text-xs text-orange-600 mb-2">
                            Existing file marked for removal.
                          </p>
                        )}
                        <input
                          id="file"
                          type="file"
                          name="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            if (file && file.size > 10 * 1024 * 1024) {
                              Swal.fire(
                                "File Too Large",
                                "Maximum file size is 10MB.",
                                "error"
                              );
                              setFieldValue("file", null);
                              event.currentTarget.value = null;
                            } else {
                              setFieldValue("file", file);
                              setIsFileRemoved(false);
                            }
                          }}
                        />
                        <ErrorMessage
                          name="file"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    </div>

                    {/* Laboratory Details (full width) */}
                    <div className="md:col-span-2">
                      <label
                        className="font-semibold text-gray-700 block mb-1"
                        htmlFor="laboratoryDetail"
                      >
                        Laboratory Details{" "}
                        <span className="text-red-500">*</span>
                        <span className="block text-xs font-normal text-gray-500">
                          Max. 300 characters
                        </span>
                      </label>
                      <Field
                        name="laboratoryDetail"
                        as="textarea"
                        rows="3"
                        maxLength="300"
                        className={`w-full p-2.5 text-base rounded-md border ${
                          errors.laboratoryDetail && touched.laboratoryDetail
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:border-blue-500 outline-none`}
                      />
                      <ErrorMessage
                        name="laboratoryDetail"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => navigate("/ViewTechnology")}
                      className="px-5 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 text-sm font-semibold"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>

                    {passedTRN ? (
                      <>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 text-sm font-semibold"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Updating..." : "Update Section"}
                        </button>

                        <button
                          type="button"
                          className="px-5 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 text-sm font-semibold"
                          onClick={() =>
                            navigate("/sectionTwo", {
                              state: {
                                technologyRefNo: generatedRefNo || passedTRN,
                              },
                            })
                          }
                        >
                          Section Two Next →
                        </button>
                      </>
                    ) : (
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 text-sm font-semibold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Saving & Going Next..."
                          : "Section Two Next →"}
                      </button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Right empty space (25%) */}
        <div className="hidden md:block md:w-1/4" />
      </div>

      <FooterBar />

      <FileViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fileUrl={fileToView}
      />
    </>
  );
};

export default SectionOne;
