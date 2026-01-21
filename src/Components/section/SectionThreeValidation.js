
const Yup = require("yup");
  export const validationSchema = Yup.object({
    licenseName: Yup.string()
      .max(300, "Max. 300 characters")
      .required("Required"),
    address: Yup.string().max(500, "Max. 500 characters").nullable(),
    email: Yup.string().email("Invalid email format").nullable(),
    contact: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be 10 digits")
      .nullable(),
    dateOfAgreementSigning: Yup.date().nullable().required("Required"),
    typeOfLicense: Yup.string().required("Required"),
    staRegionalGeography: Yup.string().nullable(),
    detailsOfExclusivity: Yup.string()
      .max(300, "Max. 300 characters")
      .nullable(),
    dateOfLicense: Yup.date().nullable().required("Required"),
    licenseValidUntil: Yup.date().nullable().required("Required"),
    paymentTerms: Yup.string().max(300, "Max. 300 characters").nullable(),
  });
