import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Header from "Components/common/header";
import FooterBar from "Components/common/footer";
import Section from "Components/common/section";
import NavBar from "Components/common/navBar";
import Country from "Components/data/country"; // your static list of countries
import CustomSelect from "Components/utils/CustomSelect"; // assuming this is your reusable Select component
import "react-datepicker/dist/react-datepicker.css";

const SectionFour = () => {
  const navigate = useNavigate();

  const initialValues = {
    technologyRefNo: "",
    clientName: "",
    clientAddress: "",
    city: "",
    country: "",
    nodalContactPerson: "",
    deploymentDetails: "",
  };

  const validationSchema = Yup.object({
    // technologyRefNo: Yup.string().required("Required"),
    // clientName: Yup.string().required("Required"),
    // clientAddress: Yup.string().required("Required"),
    // city: Yup.string().required("Required"),
    // country: Yup.string().required("Required"),
    // nodalContactPerson: Yup.string().required("Required"),
    // deploymentDetails: Yup.string().required("Required"),
  });

  const handleSubmit = async (values) => {
    try {
      const res = await axios.post(
        "http://172.16.2.246:8080/apf/tdmp/saveSectionFour",
        values,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Response:", res.data);
      Swal.fire("Success!", "Form submitted successfully!", "success");
    } catch (err) {
      console.error("Submission error:", err);
      Swal.fire("Error!", "Form submission failed. Please try again.", "error");
    }
  };

  return (
    <>
      <Header />
      <NavBar />
      <div className="p-8 bg-blue-200 border">
        <Section sectionLine="Section 4 : Commercialization / Deployment Details - Add / Modify Sub Form" />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            {/* Technology Ref No */}
            <FormField
              label="Technology / Knowhow Ref No:"
              name="technologyRefNo"
              mandatory
              placeholder="Enter New Information"
            />

            {/* Client Name */}
            <FormField
              label="Name of Client:"
              name="clientName"
              note="Max. 300 Characters"
            />

            {/* Client Address */}
            <FormField
              label="Address of Client:"
              name="clientAddress"
              note="Max. 300 Characters"
              textarea
            />

            {/* City */}
            <FormField
              label="City"
              name="city"
              note="Max. 300 Characters"
            />

            {/* Country Dropdown */}
            <div className="form-group mb-4">
              <label className="font-bold" htmlFor="country">
                Country
              </label>
              <Field
                name="country"
                options={Country} // use your imported Country list here
                component={CustomSelect}
                placeholder="Select a Country..."
                isMulti={false} // single select
              />
              <ErrorMessage
                name="country"
                component="div"
                className="text-red-500"
              />
            </div>

            {/* Nodal Contact Person */}
            <FormField
              label="Name and Address of Nodal Contact Person:"
              name="nodalContactPerson"
              note="Max. 300 Characters"
              textarea
            />

            {/* Deployment Details */}
            <FormField
              label="Deployment Details"
              name="deploymentDetails"
              note="Max. 300 Characters"
              textarea
            />

            {/* Buttons */}
            <div className="form-group mb-4 flex justify-center">
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4"
                onClick={() => navigate("/sectionThree")}
              >
                Previous
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-green-600 text-white rounded-md ml-4"
                onClick={() => navigate("/PreviewPopUp")}
              >
                Save & Preview
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4"
              >
                Submit
              </button>
            </div>
          </Form>
        </Formik>
      </div>
      <FooterBar />
    </>
  );
};

// Reusable form field component
const FormField = ({ label, name, note, mandatory, textarea, placeholder }) => (
  <div className="form-group mb-4">
    <label className="font-bold flex justify-between" htmlFor={name}>
      {label}
      {mandatory && (
        <span className="text-xs text-red-500">*Mandatory Field*</span>
      )}
    </label>
    <Field
      as={textarea ? "textarea" : "input"}
      type="text"
      name={name}
      placeholder={placeholder}
      className="w-full p-2 text-lg outline-0.1 rounded-md"
    />
    {note && <p className="text-sm text-red-500">{note}</p>}
    <ErrorMessage name={name} component="div" className="text-red-500" />
  </div>
);

export default SectionFour;
