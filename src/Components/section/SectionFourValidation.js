
const Yup = require("yup");

  export const validationSchema = Yup.object({
    clientName: Yup.string().required("Required").max(300, "Max 300 chars"),
    clientAddress: Yup.string().required("Required").max(300, "Max 300 chars"),
    city: Yup.string().required("Required").max(100, "Max 100 chars"),
    country: Yup.object().nullable().required("Country is required"),
    nodalContactPerson: Yup.string()
      .required("Required")
      .max(300, "Max 300 chars"),
    deploymentDetails: Yup.string()
      .required("Required")
      .max(500, "Max 500 chars"),
  });