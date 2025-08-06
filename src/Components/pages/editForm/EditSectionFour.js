import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
// import Header from "Components/common/header";
import FooterBar from "Components/common/footer";
import Section from "Components/common/section";
import NavBar from "Components/common/navBar";
import Country from "Components/data/country";
import CustomSelect from "Components/utils/CustomSelect";
import PreviewPopUp from "Components/pages/techSearch/PreviewPopUp";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";

const EditSectionFour = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [previewItem, setPreviewItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [initialValues, setInitialValues] = useState({
    technologyRefNo: location.state?.technologyRefNo || "",
    clientName: "",
    clientAddress: "",
    city: "",
    country: "",
    nodalContactPerson: "",
    deploymentDetails: "",
  });

  useEffect(() => {
    if (location.state?.technologyRefNo) {
      setInitialValues(prev => ({ ...prev, technologyRefNo: location.state.technologyRefNo }));
    }
  }, [location.state]);

  const validationSchema = Yup.object({});

  const handleSubmit = async (values, { setValues }) => {
    try {
      const res = await axios.post(
        "http://172.16.2.246:8080/apf/tdmp/saveSectionFourAndFetchAll",
        values,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data) {
        const formattedPreviewItem = {
          ...res.data.sectionOne,
          sectionTwo: res.data.sectionTwo ? [res.data.sectionTwo] : [],
          EditSectionThree: res.data.EditSectionThree ? [res.data.EditSectionThree] : [],
          sectionFour: res.data.sectionFour ? [res.data.sectionFour] : [],
        };

        setPreviewItem(formattedPreviewItem);
        setEditMode(false);
        Swal.fire("Success", "Form submitted successfully!", "success");
      }
    } catch (err) {
      console.error("Submission error:", err);
      Swal.fire("Error", "Form submission failed. Please try again.", "error");
    }
  };

  const handleEdit = () => {
    if (previewItem?.sectionFour?.[0]) {
      setEditMode(true);
    }
  };

  const handleClosePreview = () => {
    setPreviewItem(null);
    setEditMode(false);
  };

  return (
    <>
      {/* <Header /> */}
      <NavBar />
      <div className="p-8 bg-blue-200 border">
        <Section sectionLine="Section 4 : Commercialization / Deployment Details - Add / Modify Sub Form" />

        <Formik
          initialValues={editMode && previewItem?.sectionFour?.[0] ? previewItem.sectionFour[0] : initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <FormField
              label="Technology / Knowhow Ref No:"
              name="technologyRefNo"
              mandatory 
              placeholder="Enter New Information"
              readOnly
            />

            <FormField
              label="Name of Client:"
              name="clientName"
              note="Max. 300 Characters"
            />

            <FormField
              label="Address of Client:"
              name="clientAddress"
              note="Max. 300 Characters"
              textarea
            />

            <FormField
              label="City"
              name="city"
              note="Max. 300 Characters"
            />
            <div className="form-group mb-4">
              <label className="font-bold" htmlFor="country">Country</label>
              <Field
                name="country"
                options={Country}
                component={CustomSelect}
                placeholder="Select a Country..."
                isMulti={false}
              />
              <ErrorMessage
                name="country"
                component="div"
                className="text-red-500"
              />
            </div>
            <FormField
              label="Name and Address of Nodal Contact Person:"
              name="nodalContactPerson"
              note="Max. 300 Characters"
              textarea
            />
            <FormField
              label="Deployment Details"
              name="deploymentDetails"
              note="Max. 300 Characters"
              textarea
            />
            <div className="form-group mb-4 flex justify-center">
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4"
                onClick={() => navigate("/EditSectionThree", { state: { technologyRefNo: initialValues.technologyRefNo } })}
              >
                Previous
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md ml-4"
              >
                Save & Preview
              </button>
            </div>
          </Form>
        </Formik>
      </div>
      <FooterBar />

      {previewItem && (
        <PreviewPopUp
          item={previewItem}
          activeSection="all"
          onClose={handleClosePreview}
          onEdit={handleEdit}
        />
      )}
    </>
  );
};

const FormField = ({ label, name, note, mandatory, textarea, placeholder, readOnly }) => (
  <div className="form-group mb-4">
    <label className="font-bold flex justify-between" htmlFor={name}>
      {label}
      {mandatory && <span className="text-xs text-red-500">*Mandatory Field*</span>}
    </label>
    <Field
      as={textarea ? "textarea" : "input"}
      type="text"
      name={name}
      placeholder={placeholder}
      className="w-full p-2 text-lg outline-0.1 rounded-md"
      readOnly={readOnly}
    />
    {note && <p className="text-sm text-red-500">{note}</p>}
    <ErrorMessage name={name} component="div" className="text-red-500" />
  </div>
);

export default EditSectionFour;
