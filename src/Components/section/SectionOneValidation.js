import * as Yup from "yup";

export const sectionOneValidationSchema = Yup.object({

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

  lab: Yup.array().when("multiLabInstitute", {
    is: "Yes",
    then: (schema) =>
      schema.min(1, "Select associated labs if 'Yes'"),
  }),

  technologyLevel: Yup.string().required("TRL is required"),

  yearDevelopment: Yup.string()
    .required("Year is required")
    .matches(/^[0-9]{4}$/, "Enter valid year"),

  briefTech: Yup.string().required().max(1000),

  laboratoryDetail: Yup.object()
    .shape({
      value: Yup.string().required(),
      label: Yup.string().required(),
    })
    .nullable()
    .required("Lab details are required"),

  // ===== SCALE OF DEVELOPMENT SYSTEM =====

  scaleStage: Yup.string().required("Scale stage required"),

  labScaleDate: Yup.string().when("scaleStage", {
    is: (v) => ["Lab", "Bench", "Pilot", "Industrial"].includes(v),
    then: (s) => s.required("Lab scale date required"),
  }),

  benchScaleDate: Yup.string().when("scaleStage", {
    is: (v) => ["Bench", "Pilot", "Industrial"].includes(v),
    then: (s) => s.required("Bench scale date required"),
  }),

  pilotScaleDate: Yup.string().when("scaleStage", {
    is: (v) => ["Pilot", "Industrial"].includes(v),
    then: (s) => s.required("Pilot scale date required"),
  }),

  industrialScaleDate: Yup.string().when("scaleStage", {
    is: "Industrial",
    then: (s) => s.required("Industrial scale date required"),
  }),

  competitivePosition: Yup.string().max(1500).nullable(),
  technoEconomics: Yup.string().max(1500).nullable(),
  environmentalStatutory: Yup.string().max(300).nullable(),
});
