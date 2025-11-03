// Corrected themeNames array for your frontend
const themeNames = [
  "Aerospace, Electronics and Instrumentation & Strategic Sector (AEISS)",
  "Chemical (including leather) and Postchemicals (CLP)",
  "Ecology, Environment & Sustainability (EES)", // <-- Fixed (EES)
  "Energy (conventional and non-conventional) and Energy Devices", // <-- Added
  "Earth, Ocean and Water (EOW)",
  "Civil, Infrastructure & Engineering (CIE)",
  "Agri, Nutrition & Biotechnology & Strategic Sector (ANB)",
  "Mining, Minerals, Metal and Materials (4M)",
  "Healthcare (HTC)",
];

// This part is fine
const createOptions = (names) => names.map(name => ({ label: name, value: name }));
export const themeOptions = createOptions(themeNames);