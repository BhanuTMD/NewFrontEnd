const potentialMinistryNames = [
  "Ministry of Information and Broadcasting (MoIB)", "Ministry of Agriculture & Farmers Welfare (MoA&FW)",
  "Ministry of Textiles (MoTex)", "Ministry of Commerce & Industry (MOCI)", "Ministry of Defence (MoD)",
  "Ministry of Finance (MoF)", "Ministry of Health and Family Welfare (MoHFW)", "Ministry of Home Affairs (MoHA)",
  "Ministry of Housing and Urban Affairs (MoHUA)", "Ministry of Education (MoE)", "Ministry of Panchayati Raj (MoPR)",
  "Ministry of Petroleum & Natural Gas (MoPNG)", "Ministry of Power (MoP)", "Ministry of Railways (MoR)",
  "Ministry of Road Transport & Highways (MoRTH)", "Ministry of Rural Development (MoRD)",
  "Ministry of Urban Development (MoUD)", // Kept separate for now, might overlap with MoHUA
  "Ministry of Water Resources (MoWR)", // Now part of Jal Shakti? Keeping for potential legacy use.
  "Ministry of Women & Child Development (MoWCD)", "Ministry of Youth Affairs and Sports (MoYAS)",
  "Ministry of Coal (MoC)", "Ministry of Personnel, Public Grievances & Pensions (MoPP&P)",
  "Ministry of Law & Justice (MoL&J)", "Ministry of Parliamentary Affairs (MoPA)",
  "Ministry of Science & Technology (MoST)", "Ministry of Culture (MoCL)", "Ministry of Steel (MoS)",
  "Ministry of Labour & Employment (MoL&E)", "Ministry of Communications (MoCIT)",
  "Ministry of Civil Aviation (MoCA)", "Ministry of New and Renewable Energy (MNRE)",
  "Ministry of Tourism (MoT)", "Ministry of Consumer Affairs, Food & Public Distribution (MoCAF&PD)",
  "Ministry of Food Processing Industries (MoFPI)", // Note: Duplicate Tourism entry removed
  "Ministry of Mines (MoM)", // Note: Ministry of Disinvestment likely deprecated/merged
  "Ministry of Tribal Affairs (MoTA)", "Ministry of Social Justice & Empowerment (MoSJE)",
  "Ministry of Micro, Small & Medium Enterprises (MSME)", "Ministry of Heavy Industries & Public Enterprises (MoHI)",
  "Ministry of Statistics & Programme Implementation (MoSPI)", "Ministry of Development of North-East Region (MoDoNER)",
  "Ministry of Minority Affairs (MoMA)", "Ministry of Corporate Affairs (MoCAF)", "Ministry of Earth Science (MoES)",
  "Ministry of Skill Development and Entrepreneurship (MoSDE)", // Corrected typo
  "Department of Space (DoS)", "Election Commission of India (ECI)", "Department of Atomic Energy (DAE)", // Corrected typo
  "AYUSH", "Ministry of External Affairs (MEA)", "Ministry of Fisheries, Animal Husbandry and Dairying (DADF)", // Corrected typo
  "Ministry of Jal Shakti (MoJS)", "Ministry of Planning (NITI Aayog)",
  "Ministry of Ports, Shipping and Waterways (MoPSW)"
];

const createOptions = (names) => names.map(name => ({ label: name, value: name }));

export const potentialMinistryOptions = createOptions(potentialMinistryNames);