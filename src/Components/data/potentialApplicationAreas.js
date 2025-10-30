const potentialApplicationAreaNames = [
  "AYUSH (MoA)", "Agriculture and Farmers Welfare (MoAFW)", "Chemicals and Fertilizers (MoCF)",
  "Civil Aviation (MoCA)", "Coal", "Commerce and Industry (MoCI)", "Communications (MoC)",
  "Consumer Affairs, Food and Public Distribution (MoCAFP)", "Cooperation", "Corporate Affairs (MCA)",
  "Culture", "Defence (MoD)", "Development of North Eastern Region (MDONER)", "Earth Sciences (MoES)",
  "Education (MoE)", "Electronics and Information Technology (MeitY)",
  "Environment, Forest and Climate Change (MoEFCC)", "External Affairs (MEA)", "Finance (MoF)",
  "Fisheries, Animal Husbandry and Dairying (MoFAHD)", "Food Processing Industries (MoFPI)",
  "Health and Family Welfare (MoHFW)", "Heavy Industries (MoHI)", "Home Affairs (MHA)",
  "Housing and Urban Affairs (MoHUA)", "Information and Broadcasting (MIB)", "Jal Shakti (MoJS)",
  "Labour and Employment (MoLE)", "Law and Justice (MoLJ)", "Micro, Small & Medium Enterprises (MSME)",
  "Mines (MoM)", "Minority Affairs (MoMA)", "New and Renewable Energy (MNRE)", "Panchayati Raj (MoPR)",
  "Parliamentary Affairs (MPA)", "Personnel, Public Grievances and Pensions (MoPPGP)",
  "Petroleum and Natural Gas (MoPNG)", "Planning (MoP)", "Ports, Shipping and Waterways (MoPSW)",
  "Power", "Railways (MoR)", "Road Transport and Highways (MoRTH)", "Rural Development (MoRD)",
  "Science and Technology (MST)", "Skill Development and Entrepreneurship (MSDE)",
  "Social Justice and Empowerment (MoSJE)", "Statistics and Programme Implementation (MoSPI)",
  "Steel (MoS)", "Textiles (MoT)", "Tourism", "Tribal Affairs (MoTA)",
  "Women and Child Development (MoWCD)", "Youth Affairs and Sports (MoYAS)"
];

const createOptions = (names) => names.map(name => ({ label: name, value: name }));

export const potentialApplicationAreaOptions = createOptions(potentialApplicationAreaNames);