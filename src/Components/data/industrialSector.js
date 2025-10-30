const industrialSectorNames = [
  "Agriculture and Allied Industries (AG&A)", "Auto Components (AUTOC)", "Automobiles (AUTO)",
  "Aviation (AVT)", "Banking (BNK)", "Biotechnology (BIOT)", "Cement (CEM)", "Chemicals (CHE)",
  "Consumer Durables (CONSD)", "Defence Manufacturing (DEFM)", "Education and Training (EDU&T)",
  "Electronics System Design & Manufacturing (ESDM)", "Engineering and Capital Goods (EN&CG)",
  "Financial Services (FINS)", "Fast Moving Consumer Goods (FMCG)", "Gems and Jewellery (GEMJ)",
  "Healthcare (HTC)", "Infrastructure (INF)", "Insurance (INS)", "IT & Business Process Management (IT&BPM)",
  "Leather & Non-Leather (LEA)", "Manufacturing (MNF)", "Media and Entertainment (M&E)",
  "Medical Devices (MEDD)", "Metals and Mining (M&M)", "Micro, Small and Medium Enterprises (MSME)",
  "Oil and Gas (O&G)", "Pharmaceuticals (pharma)", "Ports and Shipping (P&S)", "Power (PSL)",
  "Railways (RLT)", "Real Estate (RE)", "Renewable Energy (R&E)", "Roads and Highways (R&H)",
  "Science and Technology (SC)", "Services (SRV)", "Space (SP)", "Telecom (T&P)",
  "Textiles and Garments (TSM)", "Tourism and Hospitality (TOU)", "Others (OTR)"
];

const createOptions = (names) => names.map(name => ({ label: name, value: name }));

export const industrialSectorOptions = createOptions(industrialSectorNames);